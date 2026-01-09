"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  MessageCircle,
  Send,
  X,
  User,
  Loader2,
  CheckCheck,
  Zap,
} from "lucide-react";
import Image from "next/image";
import axios from "axios";
import { IMessagePopulated } from "@/types/dto/message";
import { useUser } from "@/hooks/useUser";
import { USER_ROLE } from "@/types/enums";
import { formatLastActive } from "../utils";
import { EmitterEvent } from "@/types/generic";
import { useSocket } from "@/SocketContext";

interface Message extends IMessagePopulated {
  isMine: boolean;
}

interface ChatUser {
  _id: string;
  name: string;
  image?: string;
  isOnline?: boolean;
  lastActiveAt?: Date;
  role?: USER_ROLE;
}

interface DeliveryChatProps {
  orderId: string;
  currentUserId: string;
  otherUser: ChatUser;
  orderNumber: string;
}

// Suggested messages for delivery riders
const RIDER_SUGGESTIONS = [
  "I'm on my way! 🚴",
  "Arriving in 5 minutes",
  "I'm near your location",
  "Please come to the gate",
  "Unable to find the address. Please help",
  "Can you share exact location?",
  "Traffic delay, arriving shortly",
  "Order delivered successfully! ✅",
];

// Suggested messages for customers
const CUSTOMER_SUGGESTIONS = [
  "How far are you?",
  "Please call me when you arrive",
  "I'm at the main gate",
  "Please ring the doorbell",
  "Leave at the door please",
  "Thank you! 🙏",
  "Can you wait 2 minutes?",
  "I'll come down now",
];

const DeliveryChat = ({
  orderId,
  currentUserId,
  otherUser,
  orderNumber,
}: DeliveryChatProps) => {
  const { isAdmin, isDeliveryBoy } = useUser();
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [sending, setSending] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [suggestions, setSuggestions] = useState<string[]>(
    isDeliveryBoy ? RIDER_SUGGESTIONS : CUSTOMER_SUGGESTIONS
  );
  const [suggestionLoading, setSuggestionLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const { socket, connected } = useSocket();

  useEffect(() => {
    if (!socket || !connected) {
      return;
    }

    const handler = (message: IMessagePopulated) => {
      if (
        message.chatOrder._id === orderId &&
        message.sender._id !== currentUserId
      ) {
        if (!messages.find((m) => m._id !== message._id)) {
          setMessages((prev) => [
            ...prev,
            { ...message, isMine: message.sender._id === currentUserId },
          ]);
          if (!isOpen) {
            setUnreadCount((pre) => pre + 1);
          }
        }
      }
    };

    socket.on(EmitterEvent.MESSAGE_SENT, handler);

    return () => {
      socket.off(EmitterEvent.MESSAGE_SENT, handler);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [socket, connected]);

  useEffect(() => {
    if (isOpen) fetchMessages();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (isOpen) {
      setUnreadCount(0);
      inputRef.current?.focus();
    }
  }, [isOpen]);

  const fetchAiSuggestions = async (lastMessage?: IMessagePopulated) => {
    setShowSuggestions(true);
    setSuggestionLoading(true);
    try {
      lastMessage = lastMessage || messages[messages.length - 1];
      const response = await axios.post("/api/delivery-chat/ai-suggestions", {
        message: lastMessage.content,
        role: isDeliveryBoy ? USER_ROLE.DELIVERY_BOY : USER_ROLE.USER,
      });
      if (response.status === 200) {
        setSuggestions(response.data);
      }
    } catch (error) {
      console.error("Error fetching AI suggestions:", error);
    } finally {
      setSuggestionLoading(false);
    }
  };

  // Show suggestions when there are few messages or no recent activity
  useEffect(() => {
    if (!messages.length) return;
    const lastMessage = messages[messages?.length - 1];
    if (!lastMessage.isMine && !isAdmin) {
      fetchAiSuggestions();
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [messages]);

  const fetchMessages = async () => {
    try {
      setLoading(true);
      const response = await axios.get(
        `/api/delivery-chat/${orderId}/messages`
      );
      if (response.status !== 200) return;

      const formattedMessages = response.data.map((msg: IMessagePopulated) => ({
        ...msg,
        isMine: msg.sender._id === currentUserId,
      }));

      setMessages(formattedMessages);

      if (!isOpen) {
        const unread = formattedMessages.filter(
          (msg: Message) =>
            !msg.isMine && new Date(msg.sentAt) > new Date(Date.now() - 60000)
        ).length;
        setUnreadCount(unread);
      }
    } catch (error) {
      console.error("Error fetching messages:", error);
    } finally {
      setLoading(false);
    }
  };

  const sendMessage = async (e: React.FormEvent, messageText?: string) => {
    e.preventDefault();
    const content = messageText || newMessage;
    if (!content.trim() || sending) return;
    setShowSuggestions(false);

    try {
      setSending(true);
      const response = await fetch(`/api/delivery-chat/${orderId}/messages`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          content: content,
          senderId: currentUserId,
          sentAt: new Date(),
        }),
      });

      if (response.ok) {
        const sentMessage = await response.json();
        setMessages((prev) => [...prev, { ...sentMessage, isMine: true }]);
        setNewMessage("");
      }
    } catch (error) {
      console.error("Error sending message:", error);
    } finally {
      setSending(false);
    }
  };

  const handleSuggestionClick = (suggestion: string) => {
    sendMessage({ preventDefault: () => {} } as React.FormEvent, suggestion);
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const formatTime = (date: Date) => {
    return new Date(date).toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && newMessage.trim() && !sending && !loading) {
      sendMessage(e);
    }
  };

  return (
    <>
      {/* Chat Toggle Button */}
      <motion.button
        whileHover={{ scale: 1.01 }}
        whileTap={{ scale: 0.98 }}
        onClick={(e) => {
          e.stopPropagation();
          setIsOpen((pre) => !pre);
        }}
        className="relative w-full bg-linear-to-r from-rose-500 to-pink-600 text-white py-3.5 rounded-xl font-bold hover:shadow-lg hover:shadow-rose-500/50 transition-all flex items-center justify-center gap-2 cursor-pointer"
      >
        <MessageCircle className="w-5 h-5" />
        {isAdmin
          ? "View delivery chat"
          : `Chat with ${otherUser.name.split(" ")[0]}`}

        {unreadCount > 0 && (
          <span className="absolute -top-2 -right-2 flex h-5 w-5  text-xs">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-pink-600 opacity-70"></span>
            <span className="relative inline-flex rounded-full w-5 h-5 text-white bg-rose-500 items-center justify-center">
              {unreadCount}
            </span>
          </span>
        )}
      </motion.button>

      {/* Chat Modal */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={(e) => {
                e.stopPropagation();
                if (!sending) setIsOpen(false);
              }}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
            />

            {/* Chat Window */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ type: "spring", duration: 0.5 }}
              className="fixed inset-4 sm:inset-auto sm:right-6 sm:bottom-6 sm:w-[400px] sm:h-[700px] bg-white rounded-2xl shadow-2xl z-50 flex flex-col overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header */}
              <div className="bg-linear-to-r from-rose-500 to-pink-600 p-4 text-white">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-3">
                    <div className="relative w-10 h-10 rounded-full ring-2 ring-white/50">
                      {otherUser.image ? (
                        <Image
                          src={otherUser.image}
                          alt={otherUser.name}
                          fill
                          sizes="40px"
                          className="object-cover rounded-full"
                        />
                      ) : (
                        <div className="w-full h-full bg-white/20 flex items-center justify-center rounded-full">
                          <User className="w-5 h-5 text-white" />
                        </div>
                      )}
                      {otherUser.isOnline && (
                        <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
                      )}
                    </div>
                    <div>
                      <h3 className="font-bold">
                        {otherUser.name}{" "}
                        <span className="text-sm font-normal text-rose-50">
                          (
                          {otherUser.role === USER_ROLE.DELIVERY_BOY
                            ? "Rider"
                            : "Customer"}
                          )
                        </span>
                      </h3>
                      <p className="text-xs text-rose-100">
                        {otherUser.isOnline
                          ? "Active now"
                          : `Last active ${formatLastActive(
                              otherUser.lastActiveAt
                            )}`}
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => {
                      if (!sending) setIsOpen(false);
                    }}
                    className="w-8 h-8 bg-white/20 hover:bg-white/30 rounded-lg flex items-center justify-center transition-colors cursor-pointer"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
                <p className="text-xs text-rose-100">Order #{orderNumber}</p>
              </div>

              {/* Messages Area */}
              <div className="flex-1 overflow-y-auto p-4 bg-linear-to-br from-gray-50 to-rose-50/20 scrollbar-custom">
                {loading && messages.length === 0 ? (
                  <div className="flex items-center justify-center h-full">
                    <Loader2 className="w-8 h-8 animate-spin text-rose-500" />
                  </div>
                ) : messages.length === 0 ? (
                  <div className="flex flex-col items-center justify-center h-full text-center">
                    <div className="w-16 h-16 bg-rose-100 rounded-full flex items-center justify-center mb-4">
                      <MessageCircle className="w-8 h-8 text-rose-500" />
                    </div>
                    <p className="text-gray-600 font-medium mb-2">
                      No messages yet
                    </p>
                    {!isAdmin && (
                      <p className="text-sm text-gray-500">
                        Start the conversation!
                      </p>
                    )}
                  </div>
                ) : (
                  <div className="space-y-3">
                    {messages.map((message, idx) => (
                      <motion.div
                        key={message._id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: idx * 0.05 }}
                        className={`flex ${
                          message.isMine ? "justify-end" : "justify-start"
                        }`}
                      >
                        <div
                          className={`max-w-[75%] ${
                            message.isMine
                              ? "bg-linear-to-r from-rose-600 to-red-500 text-white"
                              : "bg-white text-gray-900 shadow-sm border border-gray-100"
                          } rounded-2xl px-4 py-2.5`}
                        >
                          <p className="text-sm leading-relaxed wrap-break-words">
                            {message.content}
                          </p>
                          <div
                            className={`flex items-center gap-1 mt-1 ${
                              message.isMine
                                ? "justify-end text-rose-100"
                                : "text-gray-500"
                            }`}
                          >
                            <span className="text-xs">
                              {formatTime(message.sentAt)}
                            </span>
                            {message.isMine && (
                              <CheckCheck className="w-3 h-3" />
                            )}
                          </div>
                        </div>
                      </motion.div>
                    ))}
                    <div ref={messagesEndRef} />
                  </div>
                )}
              </div>

              {/* Suggested Messages */}
              {!isAdmin && showSuggestions && !loading && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="px-4 pb-2 bg-white border-t border-gray-100"
                >
                  <div className="flex items-center gap-2 mb-2 pt-2">
                    <Zap className="w-4 h-4 text-rose-500" />
                    <span className="text-xs font-semibold text-gray-700">
                      Quick replies
                    </span>
                  </div>
                  <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-custom">
                    {suggestionLoading
                      ? [...Array(3)].map((_, idx) => (
                          <div
                            key={idx}
                            className="relative w-28 h-7 bg-gray-200 rounded-xl overflow-hidden"
                          >
                            <motion.div
                              className="absolute inset-0 bg-linear-to-r from-transparent via-gray-100 to-transparent"
                              initial={{ x: "-100%" }}
                              animate={{ x: "100%" }}
                              transition={{
                                repeat: Infinity,
                                duration: 1.5,
                                ease: "linear",
                              }}
                            />
                          </div>
                        ))
                      : suggestions.slice(0, 4).map((suggestion, idx) => (
                          <motion.button
                            key={idx}
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: idx * 0.05 }}
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={() => handleSuggestionClick(suggestion)}
                            disabled={sending}
                            className="shrink-0 px-3 py-2 bg-linear-to-r from-rose-50 to-pink-50 hover:from-rose-100 hover:to-pink-100 text-rose-600 text-xs font-medium rounded-xl border border-rose-200 transition-all disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                          >
                            {suggestion}
                          </motion.button>
                        ))}
                  </div>
                </motion.div>
              )}

              {/* Input Area */}
              {!isAdmin && (
                <form
                  onSubmit={sendMessage}
                  className="p-4 bg-white border-t border-gray-100"
                >
                  <div className="flex items-end gap-2">
                    <div className="flex-1 bg-gray-100 rounded-xl px-4 py-2.5 focus-within:bg-gray-200 transition-colors">
                      <input
                        ref={inputRef}
                        type="text"
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        onKeyDown={(e) => handleKeyPress(e)}
                        placeholder="Type a message..."
                        className="w-full bg-transparent outline-none text-gray-900 placeholder:text-gray-500"
                        disabled={sending}
                      />
                    </div>
                    <motion.button
                      whileHover={{ scale: 1.01 }}
                      whileTap={{ scale: 0.98 }}
                      type="submit"
                      disabled={!newMessage.trim() || sending}
                      className="w-11 h-11 bg-linear-to-r from-rose-600 to-red-500 text-white rounded-xl flex items-center justify-center hover:shadow-lg hover:shadow-rose-500/50 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {sending ? (
                        <Loader2 className="w-5 h-5 animate-spin" />
                      ) : (
                        <Send className="w-5 h-5" />
                      )}
                    </motion.button>
                  </div>
                </form>
              )}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
};

export default DeliveryChat;

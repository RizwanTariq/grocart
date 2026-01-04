import { auth } from "@/auth";
import connectDB from "@/libs/db";
import eventEmitter from "@/libs/eventEmitter";

import MessageModel from "@/models/message.model";
import OrderModel from "@/models/order.model";
import { assertUser } from "@/server/auth/assertUser";
import { prepareErrorResponse } from "@/server/errors/prepare-error-response";
import { handleGenericError } from "@/server/helpers/generic-api-error-handler";
import { EmitterEvent } from "@/types/generic";
import { NextResponse } from "next/server";

export const POST = auth(async function (request, context) {
  const params = await context.params;
  try {
    const orderId = await params.orderId;
    const { senderId, content, sentAt } = await request.json();

    if (!orderId || !senderId || !content || !sentAt) {
      throw NextResponse.json(
        prepareErrorResponse("BAD_REQUEST", "Missing required fields"),
        { status: 400 }
      );
    }

    await connectDB();
    await assertUser(senderId);

    const order = await OrderModel.findById(orderId);
    if (!order) {
      throw NextResponse.json(
        prepareErrorResponse("NOT_FOUND", "Order not found"),
        { status: 404 }
      );
    }

    const message = await MessageModel.create({
      chatOrder: orderId,
      sender: senderId,
      content,
      sentAt,
    });

    await message.populate([
      { path: "chatOrder" },
      { path: "sender", select: "-password" },
    ]);

    await eventEmitter(
      EmitterEvent.MESSAGE_SENT,
      JSON.parse(JSON.stringify(message))
    );

    return NextResponse.json(JSON.parse(JSON.stringify(message)), {
      status: 200,
    });
  } catch (error) {
    return handleGenericError(error);
  }
});

export const GET = auth(async function (request, context) {
  const params = await context.params;
  try {
    const orderId = await params.orderId;
    await connectDB();
    await assertUser(request.auth?.user?.id as string);

    const order = await OrderModel.findById(orderId);
    if (!order) {
      throw NextResponse.json(
        prepareErrorResponse("NOT_FOUND", "Order not found"),
        { status: 404 }
      );
    }

    const messages = await MessageModel.find({ chatOrder: order._id })
      .populate([
        { path: "chatOrder" },
        { path: "sender", select: "-password" },
      ])
      .lean();

    return NextResponse.json(JSON.parse(JSON.stringify(messages)), {
      status: 200,
    });
  } catch (error) {
    return handleGenericError(error);
  }
});

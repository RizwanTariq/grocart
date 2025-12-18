import type { Metadata } from "next";
// import { Geist, Geist_Mono } from "next/font/google";

import "./globals.css";
import Provider from "@/Provider";
import AuthStoreBootstrap from "@/AuthStoreBootstrap";
import HotToaster from "@/components/HotToaster";

// const geistSans = Geist({
//   variable: "--font-geist-sans",
//   subsets: ["latin"],
// });

// const geistMono = Geist_Mono({
//   variable: "--font-geist-mono",
//   subsets: ["latin"],
// });

export const metadata: Metadata = {
  title: "GroCart | Quick Delivery at your Doorstep",
  description:
    "GroCart is your go-to online grocery store, offering a wide range of fresh produce, pantry essentials, and household items with fast and reliable delivery right to your doorstep.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="w-full min-h-screen bg-linear-to-b from-rose-50 to-white">
        <Provider>
          <AuthStoreBootstrap />
          {children}
          <HotToaster />
        </Provider>
      </body>
    </html>
  );
}

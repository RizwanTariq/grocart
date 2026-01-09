import type { Metadata } from "next";

import "./globals.css";
import Provider from "@/Provider";
import HotToaster from "@/components/HotToaster";

export const metadata: Metadata = {
  title: `${
    process.env.NEXT_PUBLIC_APP_NAME || "GroCart"
  } | Quick Delivery at your Doorstep`,
  description: `${
    process.env.NEXT_PUBLIC_APP_NAME || "GroCart"
  } is your go-to online grocery store, offering a wide range of fresh produce, pantry essentials, and household items with fast and reliable delivery right to your doorstep.`,
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
          {children}
          <HotToaster />
        </Provider>
      </body>
    </html>
  );
}

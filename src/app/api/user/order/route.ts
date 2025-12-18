import mongoose from "mongoose";
import { auth } from "@/auth";
import connectDB from "@/libs/db";
import OrderModel from "@/models/order.model";
import { convertIds, IOrderItem } from "@/types";
import { NextResponse } from "next/server";
import UserModel from "@/models/user.model";
import { generateOrderNumber } from "@/libs/orderNumGenerator";

export const GET = auth(async function (request) {
  try {
    await connectDB();
    if (!request.auth) {
      return new NextResponse("Unauthenticated", {
        status: 401,
      });
    }
    const orders = await OrderModel.find({}).lean();

    return NextResponse.json(convertIds(orders), { status: 200 });
  } catch (error) {
    return new NextResponse(`Unexpected error: ${error}`, { status: 500 });
  }
});

export const POST = auth(async function (request) {
  try {
    await connectDB();

    const { paymentMethod, address, items, totalAmount, coordinates } =
      await request.json();

    console.log({ paymentMethod, address, items, totalAmount, coordinates });

    if (!paymentMethod || !address || !items || !items.length || !totalAmount) {
      return new NextResponse("Missing required fields", { status: 400 });
    }

    if (!request.auth) {
      return new NextResponse("Unauthenticated", {
        status: 401,
      });
    }

    const user = await UserModel.findById(
      new mongoose.Types.ObjectId(request.auth?.user?.id)
    ).lean();

    if (!user) {
      return new NextResponse("Unauthenticated: User not found", {
        status: 404,
      });
    }

    const orderNumber = await generateOrderNumber();

    const order = await OrderModel.create({
      user: user._id,
      orderNumber: orderNumber,
      items: items.map((i: IOrderItem) => ({
        product: new mongoose.Types.ObjectId(i._id),
        name: i.name,
        price: i.price,
        quantity: i.quantity,
        unit: i.unit,
      })),
      totalAmount: totalAmount,
      status: "PENDING",
      paymentMethod: paymentMethod,
      address: {
        fullName: address.fullName,
        email: address.email,
        phone: address.phone,
        fullAddress: address.address,
        city: address.city,
        postalCode: address.postalCode,
        coordinates: {
          lat: coordinates?.lat || null,
          lng: coordinates?.lng || null,
        },
      },
    });

    return NextResponse.json(
      { orderNumber, _id: order._id.toHexString() },
      { status: 201 }
    );
  } catch (error) {
    return new NextResponse(`Unexpected error: ${error}`, { status: 500 });
  }
});

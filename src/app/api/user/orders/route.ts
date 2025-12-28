import mongoose from "mongoose";
import { auth } from "@/auth";
import connectDB from "@/libs/db";
import OrderModel from "@/models/order.model";
import { IOrderItem } from "@/types";
import { NextResponse } from "next/server";
import { generateOrderNumber } from "@/libs/orderNumGenerator";
import { assertUser } from "@/server/auth/assertUser";
import { prepareErrorResponse } from "@/server/errors/prepare-error-response";
import { ORDER_STATUS, PAYMENT_METHOD, PAYMENT_STATUS } from "@/types/enums";
import { handleGenericError } from "@/server/helpers/generic-api-error-handler";
import { MAX_PAYMENT_ATTEMPTS } from "@/constants/orders";
import eventEmitter from "@/libs/eventEmitter";
import { EmitterEvent } from "@/types/generic";

export const GET = auth(async function (request) {
  try {
    await connectDB();
    const user = await assertUser(request.auth?.user?.id as string);
    const orders = await OrderModel.aggregate([
      { $match: { user: user._id } },
      { $sort: { createdAt: -1 } },
      {
        $addFields: {
          isPaymentRetryAllowed: {
            $and: [
              {
                $eq: [{ $ifNull: ["$stripeSessionId", null] }, null],
              },
              { $eq: ["$paymentMethod", PAYMENT_METHOD.CARD] },
              { $eq: ["$paymentStatus", PAYMENT_STATUS.PAYMENT_PENDING] },
              { $eq: ["$status", ORDER_STATUS.PENDING] },
              {
                $and: [
                  { $ne: ["$expiresAt", null] },
                  { $gt: [{ $toDate: "$expiresAt" }, new Date()] },
                ],
              },
              { $lt: ["$paymentAttempts", MAX_PAYMENT_ATTEMPTS] },
            ],
          },
        },
      },
    ]);

    return NextResponse.json(JSON.parse(JSON.stringify(orders)), {
      status: 200,
    });
  } catch (error) {
    return handleGenericError(error);
  }
});

export const POST = auth(async function (request) {
  try {
    await connectDB();

    const { address, items, totalAmount } = await request.json();

    if (!address || !items || !items.length || !totalAmount) {
      throw NextResponse.json(
        prepareErrorResponse("BAD_REQUEST", "Missing required fields"),
        { status: 400 }
      );
    }

    const user = await assertUser(request.auth?.user?.id as string);

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
        image: i.image,
      })),
      totalAmount: totalAmount,
      status: ORDER_STATUS.PENDING,
      paymentMethod: PAYMENT_METHOD.COD,
      paymentStatus: PAYMENT_STATUS.PAYMENT_PENDING,
      address: {
        fullName: address.fullName,
        email: address.email,
        phone: address.phone,
        fullAddress: address.address,
        city: address.city,
        postalCode: address.postalCode,
        coordinates: {
          lat: address.coordinates?.lat || null,
          lng: address.coordinates?.lng || null,
        },
      },
    });

    await eventEmitter(EmitterEvent.ORDER_CREATED, {
      ...JSON.parse(JSON.stringify(order)),
      user: { ...JSON.parse(JSON.stringify(user)) },
    });

    return NextResponse.json(
      { orderNumber, _id: order._id.toHexString() },
      { status: 201 }
    );
  } catch (error) {
    return handleGenericError(error);
  }
});

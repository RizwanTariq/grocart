import { auth } from "@/auth";
import connectDB from "@/libs/db";
import eventEmitter from "@/libs/eventEmitter";
import nearByRiders from "@/libs/nearByRiders";
import DeliveryAssignmentModel from "@/models/delivery-assignment.model";
import OrderModel from "@/models/order.model";
import UserModel from "@/models/user.model";
import { assertAdmin } from "@/server/auth/assertAdmin";
import { prepareErrorResponse } from "@/server/errors/prepare-error-response";
import { handleGenericError } from "@/server/helpers/generic-api-error-handler";
import { convertId, convertIds, IOrderPopulated, IUser } from "@/types";
import { DELIVERY_ASSIGNMENT_STATUS, ORDER_STATUS } from "@/types/enums";
import { EmitterEvent } from "@/types/generic";
import { NextResponse } from "next/server";

export const PATCH = auth(async function (request, context) {
  const params = await context.params;
  try {
    const orderId = await params.orderId;
    await connectDB();
    await assertAdmin(request);

    const { status } = await request.json();

    if (!Object.values(ORDER_STATUS).includes(status)) {
      throw NextResponse.json(
        prepareErrorResponse("BAD_REQUEST", "Missing required fields"),
        { status: 400 }
      );
    }

    const order = await OrderModel.findById(orderId).populate([
      {
        path: "user",
        select: "-password",
      },
      {
        path: "assignedDeliveryBoy",
        select: "-password",
      },
    ]);

    if (!order) {
      throw NextResponse.json(
        prepareErrorResponse("NOT_FOUND", "Order not found"),
        { status: 404 }
      );
    }

    let deliveryBoys: IUser[] = [];
    let deliveryAssignment;

    const isDeliveryAssignmentRequired =
      status === ORDER_STATUS.OUT_FOR_DELIVERY && !order.deliveryAssignment;

    if (isDeliveryAssignmentRequired) {
      const { coordinates } = order.address;

      // find available delivery boys from socket.io server
      const { userIds: nearByDelBoyIds } = await nearByRiders(
        { longitude: coordinates.lng!, latitude: coordinates.lat! },
        order.user._id.toHexString()
      );

      const busyDelBoyIds = await DeliveryAssignmentModel.find({
        assignedTo: { $in: nearByDelBoyIds },
        status: DELIVERY_ASSIGNMENT_STATUS.ASSIGNED,
      }).distinct("assignedTo");

      const availableDeliveryBoyIds = nearByDelBoyIds.filter(
        (delBoy) =>
          !busyDelBoyIds.some((delBoyId) => delBoyId.toHexString() === delBoy)
      );

      if (availableDeliveryBoyIds.length === 0) {
        throw NextResponse.json(
          prepareErrorResponse(
            "NO_DELIVERY_BOY",
            "No delivery boy available. Please try again later."
          ),
          { status: 400 }
        );
      }

      const availableDeliveryBoys = await UserModel.find({
        _id: { $in: availableDeliveryBoyIds },
      });

      deliveryAssignment = await (
        await DeliveryAssignmentModel.create({
          order: order._id,
          broadcastedTo: availableDeliveryBoys.map((delBoy) => delBoy._id),
          status: DELIVERY_ASSIGNMENT_STATUS.BROADCASTED,
        })
      ).populate([
        { path: "order" },
        { path: "broadcastedTo", select: "socketId" },
      ]);

      order.deliveryAssignment = deliveryAssignment._id;
      deliveryBoys = convertIds(
        availableDeliveryBoys.map((delBoy) => delBoy.toObject())
      );
    }

    order.status = status;
    await order.save();

    const userSocketId = (order as unknown as IOrderPopulated).user?.socketId;
    if (userSocketId) {
      await eventEmitter(
        EmitterEvent.ORDER_UPDATED,
        JSON.parse(JSON.stringify(order)),
        userSocketId
      );
    }

    if (isDeliveryAssignmentRequired) {
      deliveryAssignment?.broadcastedTo.forEach((delBoy) => {
        const socketId = (delBoy as unknown as IUser).socketId;
        if (socketId) {
          eventEmitter(
            EmitterEvent.ORDER_BROADCASTED,
            JSON.parse(JSON.stringify(deliveryAssignment)),
            socketId
          );
        }
      });
    }

    return NextResponse.json(
      {
        order: convertId(order.toObject()),
        availableDeliveryBoys: deliveryBoys,
      },
      {
        status: 200,
      }
    );
  } catch (error) {
    return handleGenericError(error);
  }
});

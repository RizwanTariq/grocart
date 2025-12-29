import { auth } from "@/auth";
import connectDB from "@/libs/db";
import eventEmitter from "@/libs/eventEmitter";
import DeliveryAssignmentModel from "@/models/delivery-assignment.model";
import OrderModel from "@/models/order.model";
import UserModel from "@/models/user.model";
import { assertDeliveryRider } from "@/server/auth/assertdeliveryRider";

import { prepareErrorResponse } from "@/server/errors/prepare-error-response";
import { handleGenericError } from "@/server/helpers/generic-api-error-handler";

import { IUser } from "@/types";
import { DELIVERY_ASSIGNMENT_STATUS, USER_ROLE } from "@/types/enums";
import { EmitterEvent } from "@/types/generic";
import { NextResponse } from "next/server";

export const POST = auth(async function (request, context) {
  const params = await context.params;
  try {
    const assignmentId = await params.id;
    await connectDB();
    const rider = await assertDeliveryRider(request);

    const alreadyAssigned = await DeliveryAssignmentModel.findOne({
      assignedTo: rider._id,
      status: DELIVERY_ASSIGNMENT_STATUS.ASSIGNED,
    });

    if (alreadyAssigned) {
      throw NextResponse.json(
        prepareErrorResponse(
          "BAD_REQUEST",
          "You can only accept one delivery at a time!"
        ),
        { status: 400 }
      );
    }

    const assignment = await DeliveryAssignmentModel.findById(
      assignmentId
    ).populate([
      { path: "order" },
      { path: "broadcastedTo", select: "socketId" },
    ]);

    if (!assignment) {
      throw NextResponse.json(
        prepareErrorResponse(
          "NOT_FOUND",
          "This delivery is no longer available!"
        ),
        { status: 404 }
      );
    }
    if (!assignment.broadcastedTo.some((delBoy) => delBoy.equals(rider._id))) {
      throw NextResponse.json(
        prepareErrorResponse("UNAUTHORIZED", "This delivery is not for you!"),
        { status: 401 }
      );
    }
    if (
      assignment.assignedTo &&
      assignment.status !== DELIVERY_ASSIGNMENT_STATUS.BROADCASTED
    ) {
      throw NextResponse.json(
        prepareErrorResponse(
          "BAD_REQUEST",
          "This delivery is already accepted!"
        ),
        { status: 400 }
      );
    }

    const order = await OrderModel.findById(assignment.order);
    if (!order) {
      throw NextResponse.json(
        prepareErrorResponse("NOT_FOUND", "Order not found"),
        { status: 404 }
      );
    }

    assignment.status = DELIVERY_ASSIGNMENT_STATUS.ASSIGNED;
    assignment.assignedTo = rider._id;
    assignment.assignedAt = new Date();
    await assignment.save();

    order.assignedDeliveryBoy = rider._id;
    await order.save();

    const adminsAndCustomer = await UserModel.find({
      $or: [{ role: USER_ROLE.ADMIN }, { _id: order.user }],
    }).select("socketId");

    adminsAndCustomer.forEach((u) => {
      const socketId = (u as unknown as IUser).socketId;
      if (socketId) {
        eventEmitter(
          EmitterEvent.DELIVERY_ACCEPTED,
          JSON.parse(JSON.stringify(assignment)),
          socketId
        );
      }
    });
    assignment.broadcastedTo.forEach((delBoy) => {
      const socketId = (delBoy as unknown as IUser).socketId;
      if (socketId) {
        eventEmitter(
          EmitterEvent.DELIVERY_ACCEPTED,
          JSON.parse(JSON.stringify(assignment)),
          socketId
        );
      }
    });

    return NextResponse.json(JSON.parse(JSON.stringify(assignment)), {
      status: 200,
    });
  } catch (error) {
    return handleGenericError(error);
  }
});

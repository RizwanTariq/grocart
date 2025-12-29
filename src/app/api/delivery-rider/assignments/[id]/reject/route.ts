import { auth } from "@/auth";
import connectDB from "@/libs/db";
import eventEmitter from "@/libs/eventEmitter";
import DeliveryAssignmentModel from "@/models/delivery-assignment.model";
import UserModel from "@/models/user.model";
import { assertDeliveryRider } from "@/server/auth/assertdeliveryRider";

import { prepareErrorResponse } from "@/server/errors/prepare-error-response";
import { handleGenericError } from "@/server/helpers/generic-api-error-handler";
import { IUser } from "@/types";
import { USER_ROLE } from "@/types/enums";
import { EmitterEvent } from "@/types/generic";

import { NextResponse } from "next/server";

export const POST = auth(async function (request, context) {
  const params = await context.params;
  try {
    const assignmentId = await params.id;
    await connectDB();
    const rider = await assertDeliveryRider(request);

    const assignment = await DeliveryAssignmentModel.findById(assignmentId);

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

    assignment.broadcastedTo = assignment.broadcastedTo.filter(
      (delBoy) => !delBoy.equals(rider._id)
    );
    await assignment.save();

    const admins = await UserModel.find({ role: USER_ROLE.ADMIN }).select(
      "socketId"
    );
    admins.forEach((u) => {
      const socketId = (u as unknown as IUser).socketId;
      if (socketId) {
        eventEmitter(
          EmitterEvent.DELIVERY_REJECTED,
          JSON.parse(JSON.stringify(assignment)),
          socketId
        );
      }
    });

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    return handleGenericError(error);
  }
});

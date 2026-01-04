import connectDB from "@/libs/db";
import UserModel from "@/models/user.model";
import { assertOutsideReq } from "@/server/auth/assertOutsideReq";

import { prepareErrorResponse } from "@/server/errors/prepare-error-response";
import { handleGenericError } from "@/server/helpers/generic-api-error-handler";

import { NextRequest, NextResponse } from "next/server";

export const POST = async function (request: NextRequest) {
  try {
    const { socketId, userId } = await request.json();

    await connectDB();
    await assertOutsideReq(request);

    if (!socketId && !userId) {
      throw NextResponse.json(
        prepareErrorResponse(
          "BAD_REQUEST",
          "Missing socket id and user id at least one is required"
        ),
        { status: 400 }
      );
    }

    const user = await UserModel.findOne({
      $or: [{ _id: userId }, { socketId }],
    });

    if (!user) {
      throw NextResponse.json(
        prepareErrorResponse("NOT_FOUND", "User not found"),
        { status: 404 }
      );
    }
    user.socketId = undefined;
    user.isOnline = false;
    user.lastActiveAt = new Date();
    await user.save();

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    return handleGenericError(error);
  }
};

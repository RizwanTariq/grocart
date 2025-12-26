import connectDB from "@/libs/db";
import UserModel from "@/models/user.model";
import { assertOutsideReq } from "@/server/auth/assertOutsideReq";
import { assertUser } from "@/server/auth/assertUser";
import { handleGenericError } from "@/server/helpers/generic-api-error-handler";

import { NextRequest, NextResponse } from "next/server";

export const POST = async function (request: NextRequest) {
  try {
    const { userId, socketId } = await request.json();

    await connectDB();
    await assertOutsideReq(request);
    const user = await assertUser(userId);

    if (user.socketId === socketId) {
      return NextResponse.json({ success: true }, { status: 200 });
    }

    await UserModel.findByIdAndUpdate(
      userId,
      {
        socketId,
        isOnline: true,
        lastActiveAt: new Date(),
      },
      { new: true }
    );

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    return handleGenericError(error);
  }
};

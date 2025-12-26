import connectDB from "@/libs/db";
import UserModel from "@/models/user.model";
import { assertOutsideReq } from "@/server/auth/assertOutsideReq";
import { assertUser } from "@/server/auth/assertUser";
import { prepareErrorResponse } from "@/server/errors/prepare-error-response";
import { handleGenericError } from "@/server/helpers/generic-api-error-handler";

import { NextRequest, NextResponse } from "next/server";

export const POST = async function (request: NextRequest) {
  try {
    const { userId, socketId, latitude, longitude } = await request.json();

    if (!userId || !socketId || !latitude || !longitude) {
      throw NextResponse.json(
        prepareErrorResponse("BAD_REQUEST", "Missing required fields"),
        { status: 400 }
      );
    }
    if (isNaN(latitude) || isNaN(longitude)) {
      throw NextResponse.json(
        prepareErrorResponse("BAD_REQUEST", "Invalid coordinates"),
        { status: 400 }
      );
    }
    if (
      latitude < -90 ||
      latitude > 90 ||
      longitude < -180 ||
      longitude > 180
    ) {
      throw NextResponse.json(
        prepareErrorResponse("BAD_REQUEST", "Invalid coordinates"),
        { status: 400 }
      );
    }

    await connectDB();
    await assertOutsideReq(request);
    const user = await assertUser(userId);

    if (user.socketId !== socketId) {
      throw NextResponse.json(
        prepareErrorResponse(
          "UNAUTHORIZED",
          "Unauthorized: Socket id mismatch"
        ),
        { status: 401 }
      );
    }

    await UserModel.findByIdAndUpdate(
      userId,
      {
        location: {
          type: "Point",
          coordinates: [longitude, latitude],
        },
        lastActiveAt: new Date(),
      },
      { new: true }
    );

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    return handleGenericError(error);
  }
};

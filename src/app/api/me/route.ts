import { NextResponse } from "next/server";

import { auth } from "@/auth";
import connectDB from "@/libs/db";
import UserModel from "@/models/user.model";
import { convertId } from "@/types";
import { prepareErrorResponse } from "@/server/errors/prepare-error-response";
import { handleGenericError } from "@/server/helpers/generic-api-error-handler";

export const GET = auth(async function (request) {
  try {
    await connectDB();
    if (!request.auth?.user?.id) {
      throw NextResponse.json(
        prepareErrorResponse("UNAUTHENTICATED", "User not found"),
        { status: 401 }
      );
    }
    const user = await UserModel.findOne({
      email: request.auth?.user?.email,
    })
      .select("-password")
      .lean();

    if (!user) {
      throw NextResponse.json(
        prepareErrorResponse("UNAUTHENTICATED", "User not found"),
        { status: 401 }
      );
    }

    return NextResponse.json(convertId(user), { status: 200 });
  } catch (error) {
    return handleGenericError(error);
  }
});

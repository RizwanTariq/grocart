import { NextResponse } from "next/server";

import { auth } from "@/auth";
import connectDB from "@/libs/db";
import UserModel from "@/models/user.model";
import { convertId } from "@/types";

export const GET = auth(async function (request) {
  try {
    await connectDB();
    if (!request.auth) {
      return new NextResponse("Unauthenticated", {
        status: 401,
      });
    }
    const user = await UserModel.findOne({
      email: request.auth?.user?.email,
    })
      .select("-password")
      .lean();

    if (!user) {
      return new NextResponse("User not found", {
        status: 404,
      });
    }

    return NextResponse.json(convertId(user), { status: 200 });
  } catch (error) {
    return new NextResponse(`Unexpected error: ${error}`, { status: 500 });
  }
});

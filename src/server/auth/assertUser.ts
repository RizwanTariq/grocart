import { NextResponse } from "next/server";
import { NextAuthRequest } from "next-auth";

import UserModel from "@/models/user.model";
import { castIdToObjectId } from "@/server/helpers/mongoose-parser";

export async function assertUser(request: NextAuthRequest) {
  if (!request.auth?.user?.id) {
    throw NextResponse.json(
      {
        error: {
          code: "UNAUTHENTICATED",
          message: "Unauthenticated- User not found",
        },
      },
      { status: 401 }
    );
  }

  const user = await UserModel.findById(
    castIdToObjectId(request.auth?.user?.id)
  ).lean();

  if (!user) {
    throw NextResponse.json(
      {
        error: {
          code: "UNAUTHENTICATED",
          message: "Unauthenticated: User not found",
        },
      },
      { status: 401 }
    );
  }

  return user;
}

"use server";
import { NextResponse } from "next/server";

import UserModel from "@/models/user.model";
import { castIdToObjectId } from "@/server/helpers/mongoose-parser";

export async function assertUser(id: string) {
  if (!id) {
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

  const user = await UserModel.findById(castIdToObjectId(id)).lean();

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

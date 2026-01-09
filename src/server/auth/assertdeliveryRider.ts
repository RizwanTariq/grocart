"use server";
import { NextResponse } from "next/server";
import { NextAuthRequest } from "next-auth";

import { assertUser } from "./assertUser";
import { USER_ROLE } from "@/types/enums";
import { prepareErrorResponse } from "../errors/prepare-error-response";

export async function assertDeliveryRider(request: NextAuthRequest) {
  const user = await assertUser(request.auth?.user?.id as string);

  if (user.role !== USER_ROLE.DELIVERY_BOY) {
    throw NextResponse.json(
      prepareErrorResponse(
        "UNAUTHORIZED",
        "Unauthorized: Only delivery rider can accept delivery"
      ),

      { status: 401 }
    );
  }

  return user;
}

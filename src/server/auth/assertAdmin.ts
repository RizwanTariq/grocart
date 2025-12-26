import { NextResponse } from "next/server";
import { NextAuthRequest } from "next-auth";

import { assertUser } from "./assertUser";
import { USER_ROLE } from "@/types/enums";
import { prepareErrorResponse } from "../errors/prepare-error-response";

export async function assertAdmin(request: NextAuthRequest) {
  const user = await assertUser(request.auth?.user?.id as string);

  if (user.role !== USER_ROLE.ADMIN) {
    throw NextResponse.json(
      prepareErrorResponse(
        "UNAUTHORIZED",
        "Unauthorized: Only admin can update order status"
      ),

      { status: 401 }
    );
  }

  return user;
}

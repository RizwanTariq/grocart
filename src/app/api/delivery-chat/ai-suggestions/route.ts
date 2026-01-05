import { auth } from "@/auth";
import { NextResponse } from "next/server";

import { prepareErrorResponse } from "@/server/errors/prepare-error-response";
import { handleGenericError } from "@/server/helpers/generic-api-error-handler";
import { getAiSuggestions } from "@/libs/gemini";
import connectDB from "@/libs/db";
import { assertUser } from "@/server/auth/assertUser";

export const POST = auth(async function (request) {
  try {
    const { message, role } = await request.json();

    await connectDB();
    await assertUser(request.auth?.user?.id as string);

    if (!message || !role) {
      throw NextResponse.json(
        prepareErrorResponse("BAD_REQUEST", "Missing required fields"),
        { status: 400 }
      );
    }

    const response = await getAiSuggestions(role, message);
    return NextResponse.json(response, { status: 200 });
  } catch (error) {
    return handleGenericError(error);
  }
});

import "server-only";

import { NextResponse } from "next/server";
import { prepareErrorResponse } from "../errors/prepare-error-response";

function handleGenericError(error: unknown) {
  if (error instanceof NextResponse) {
    return error;
  }
  console.error(error);
  return NextResponse.json(
    prepareErrorResponse(
      "INTERNAL_SERVER_ERROR",
      "Unexpected error occurred. Please try again later."
    ),
    { status: 500 }
  );
}
export { handleGenericError };

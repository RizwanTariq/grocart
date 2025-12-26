import { ErrorCodes } from "@/types/api/errors";

export function prepareErrorResponse(
  code: ErrorCodes,
  message: string,
  orderId?: string
) {
  return {
    error: {
      code,
      message,
      orderId,
    },
  };
}

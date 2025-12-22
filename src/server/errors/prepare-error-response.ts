type ErrorCodes =
  | "BAD_REQUEST"
  | "UNAUTHENTICATED"
  | "UNAUTHORIZED"
  | "NOT_FOUND"
  | "INTERNAL_SERVER_ERROR"
  | "PAYMENT_FAILED"
  | "PAYMENT_RETRY_NOT_ALLOWED"
  | "PAYMENT_ALREADY_IN_PROGRESS"
  | "ORDER_EXPIRED"
  | "PAYMENT_ATTEMPTS_EXCEEDED"
  | "ORDER_ALREADY_PAID"
  | "NOT_A_CARD_PAYMENT_ORDER"
  | "STRIPE_ERROR";

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

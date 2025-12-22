export interface ApiError {
  code: string;
  message: string;
  orderId?: string;
}

export interface ApiErrorResponse {
  error: ApiError;
}

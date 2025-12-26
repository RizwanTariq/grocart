import axios from "axios";
import { ApiError, ApiErrorResponse } from "@/types/api/errors";

export function extractApiError(err: unknown): ApiError | null {
  if (axios.isAxiosError<ApiErrorResponse>(err)) {
    return (err.response?.data?.error as ApiError) ?? null;
  }
  return null;
}

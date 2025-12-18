import axios from "axios";
import { ApiError, ApiErrorResponse } from "../api/errors";

export function extractApiError(err: unknown): ApiError | null {
  if (axios.isAxiosError<ApiErrorResponse>(err)) {
    return err.response?.data?.error ?? null;
  }
  return null;
}

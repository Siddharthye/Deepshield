import { randomUUID } from "crypto";

export type ApiErrorCode =
  | "BAD_REQUEST"
  | "PAYLOAD_TOO_LARGE"
  | "UNSUPPORTED_MEDIA"
  | "RATE_LIMITED"
  | "UPSTREAM_ERROR"
  | "UPSTREAM_TIMEOUT"
  | "INTERNAL_ERROR";

export type ApiErrorResponse = {
  error: {
    code: ApiErrorCode;
    message: string;
    details?: Record<string, unknown>;
  };
  requestId: string;
};

export function makeRequestId() {
  return randomUUID();
}

export function apiError(
  code: ApiErrorCode,
  message: string,
  details?: Record<string, unknown>,
  requestId: string = makeRequestId(),
): ApiErrorResponse {
  return {
    error: { code, message, ...(details ? { details } : {}) },
    requestId,
  };
}


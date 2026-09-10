import { NextResponse } from "next/server";

import type { SteamClientErrorCode } from "@/lib/steam/types";

/**
 * The one error shape every route handler in this app returns, so
 * clients never need to branch on response format between endpoints.
 */
export type ApiErrorCode = SteamClientErrorCode | "VALIDATION_ERROR";

export interface ApiErrorBody {
  readonly error: {
    readonly code: ApiErrorCode;
    readonly message: string;
  };
}

export function apiErrorResponse(
  code: ApiErrorCode,
  message: string,
  status: number,
): NextResponse<ApiErrorBody> {
  return NextResponse.json({ error: { code, message } }, { status });
}

import { NextResponse } from "next/server";

/**
 * The one error shape every route handler in this app returns, so
 * clients never need to branch on response format between endpoints.
 */
export interface ApiErrorBody {
  readonly error: {
    readonly code: string;
    readonly message: string;
  };
}

export function apiErrorResponse(
  code: string,
  message: string,
  status: number,
): NextResponse<ApiErrorBody> {
  return NextResponse.json({ error: { code, message } }, { status });
}

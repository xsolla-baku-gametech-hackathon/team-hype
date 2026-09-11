import { NextResponse, type NextRequest } from "next/server";

import { apiErrorResponse, type ApiErrorCode } from "@/lib/http/api-error";
import { fetchSteamReviews } from "@/lib/steam/client";
import { requestReviewsQuerySchema, type SteamReviewPage } from "@/lib/steam/types";

interface RouteParams {
  params: Promise<{ appid: string }>;
}

/**
 * Timeouts get their own status; every other Steam-side failure is
 * reported as a gateway error since we're proxying a third party.
 */
function statusForErrorCode(code: ApiErrorCode): number {
  if (code === "INVALID_APP_ID") return 400;
  if (code === "STEAM_TIMEOUT") return 504;
  return 502;
}

export async function GET(
  request: NextRequest,
  { params }: RouteParams,
): Promise<NextResponse<SteamReviewPage> | ReturnType<typeof apiErrorResponse>> {
  const { appid } = await params;
  const appId = Number.parseInt(appid, 10);

  if (
    !Number.isSafeInteger(appId) ||
    appId <= 0 ||
    String(appId) !== appid
  ) {
    return apiErrorResponse(
      "INVALID_APP_ID",
      `"${appid}" is not a valid Steam app id.`,
      400,
    );
  }

  const queryResult = requestReviewsQuerySchema.safeParse(
    Object.fromEntries(request.nextUrl.searchParams),
  );

  if (!queryResult.success) {
    return apiErrorResponse(
      "VALIDATION_ERROR",
      "One or more query parameters were invalid.",
      400,
    );
  }

  const result = await fetchSteamReviews({
    appId,
    ...queryResult.data,
    signal: request.signal,
  });

  if (!result.success) {
    return apiErrorResponse(
      result.error.code,
      result.error.message,
      statusForErrorCode(result.error.code),
    );
  }

  return NextResponse.json(result.data);
}

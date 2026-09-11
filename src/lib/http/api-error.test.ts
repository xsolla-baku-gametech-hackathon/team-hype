import { describe, expect, it } from "vitest";

import { apiErrorResponse } from "@/lib/http/api-error";

describe("apiErrorResponse", () => {
  it("returns the shared error JSON shape with the given status", async () => {
    const response = apiErrorResponse(
      "VALIDATION_ERROR",
      "One or more query parameters were invalid.",
      400,
    );

    expect(response.status).toBe(400);
    await expect(response.json()).resolves.toEqual({
      error: {
        code: "VALIDATION_ERROR",
        message: "One or more query parameters were invalid.",
      },
    });
  });
});

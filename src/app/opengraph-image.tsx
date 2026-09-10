import { ImageResponse } from "next/og";

import { APP_NAME, APP_TAGLINE } from "@/lib/site-config";

export const runtime = "edge";
export const alt = `${APP_NAME} — market intelligence for game developers`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          height: "100%",
          width: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background: "#08090c",
          padding: "64px 72px",
          color: "#f4f7fb",
          fontFamily: "sans-serif",
        }}
      >
        <div
          style={{
            display: "flex",
            fontSize: 28,
            letterSpacing: "0.18em",
            textTransform: "uppercase",
            color: "#5eead4",
          }}
        >
          {APP_NAME}
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
          <div
            style={{
              fontSize: 64,
              fontWeight: 700,
              lineHeight: 1.05,
              maxWidth: 900,
            }}
          >
            Market intelligence for game developers
          </div>
          <div
            style={{
              fontSize: 28,
              color: "rgba(244,247,251,0.72)",
              maxWidth: 820,
            }}
          >
            {APP_TAGLINE}
          </div>
        </div>
      </div>
    ),
    { ...size },
  );
}

import { ImageResponse } from "next/og";

import { getAnalysisReport } from "@/lib/analysis/get-analysis-report";
import { APP_NAME } from "@/lib/site-config";

export const runtime = "edge";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

interface Props {
  params: Promise<{ id: string }>;
}

export default async function AnalysisOpenGraphImage({ params }: Props) {
  const { id } = await params;
  const report = getAnalysisReport(id);
  const concept = report?.concept ?? "Market analysis report";
  const title =
    concept.length > 90 ? `${concept.slice(0, 87).trimEnd()}…` : concept;

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
            fontSize: 26,
            letterSpacing: "0.18em",
            textTransform: "uppercase",
            color: "#5eead4",
          }}
        >
          {APP_NAME}
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          <div style={{ fontSize: 48, fontWeight: 700, lineHeight: 1.1, maxWidth: 980 }}>
            {title}
          </div>
          <div style={{ fontSize: 24, color: "rgba(244,247,251,0.7)" }}>
            Evidence-backed market intelligence
          </div>
        </div>
      </div>
    ),
    { ...size },
  );
}

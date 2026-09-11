import { notFound } from "next/navigation";
import type { Metadata } from "next";

import { AnalysisExperience } from "@/components/analysis/analysis-experience";
import { Container } from "@/components/layout/container";
import {
  applyReportQueryOverrides,
  getAnalysisReport,
} from "@/lib/analysis/get-analysis-report";

interface AnalysisPageProps {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ platform?: string; genre?: string }>;
}

export function generateStaticParams() {
  return [{ id: "demo" }];
}

export async function generateMetadata({
  params,
}: AnalysisPageProps): Promise<Metadata> {
  const { id } = await params;
  const report = getAnalysisReport(id);

  if (!report) {
    return {
      title: "Analysis Not Found",
      description:
        "This GameLens analysis report could not be found. Start a new concept analysis from the homepage.",
    };
  }

  const description = `Evidence-backed market intelligence for “${report.concept}” — comparable Steam titles, player themes, and ranked opportunities.`;
  const title =
    report.concept.length > 60
      ? `${report.concept.slice(0, 57).trimEnd()}…`
      : report.concept;

  return {
    title,
    description,
    alternates: { canonical: `/analysis/${id}` },
    openGraph: {
      title,
      description,
      images: ["/opengraph-image"],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: ["/opengraph-image"],
    },
  };
}

export default async function AnalysisPage({
  params,
  searchParams,
}: AnalysisPageProps) {
  const { id } = await params;
  const query = await searchParams;
  const report = getAnalysisReport(id);

  if (!report) {
    notFound();
  }

  const resolved = applyReportQueryOverrides(report, query);

  return (
    <Container>
      <AnalysisExperience report={resolved} />
    </Container>
  );
}

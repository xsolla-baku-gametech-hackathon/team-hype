import { notFound } from "next/navigation";
import type { Metadata } from "next";

import { AnalysisExperience } from "@/components/analysis/analysis-experience";
import { Container } from "@/components/layout/container";
import { getAnalysisReport } from "@/lib/analysis/get-analysis-report";

interface AnalysisPageProps {
  params: Promise<{ id: string }>;
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

  return {
    title: "Analysis Report",
    description: `Evidence-backed market intelligence for “${report.concept}” — comparable Steam titles, player themes, and ranked opportunities.`,
  };
}

export default async function AnalysisPage({ params }: AnalysisPageProps) {
  const { id } = await params;
  const report = getAnalysisReport(id);

  if (!report) {
    notFound();
  }

  return (
    <Container>
      <AnalysisExperience report={report} />
    </Container>
  );
}

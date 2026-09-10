import { notFound } from "next/navigation";
import type { Metadata } from "next";

import { AnalysisExperience } from "@/components/analysis/analysis-experience";
import { Container } from "@/components/layout/container";
import { getAnalysisReport } from "@/lib/analysis/get-analysis-report";

interface AnalysisPageProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({
  params,
}: AnalysisPageProps): Promise<Metadata> {
  const { id } = await params;
  const report = getAnalysisReport(id);

  return { title: report ? "Analysis Report" : "Analysis Not Found" };
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

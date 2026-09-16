import TrainingApp from "@/components/training/TrainingApp";

export default async function Base12TrainingTestPage({ params }: { params: Promise<{ test: string }> }) {
  const { test } = await params;
  return <TrainingApp testSlug={test} />;
}

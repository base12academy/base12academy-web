import { redirect } from "next/navigation";

export default async function Base12TrainingLegacyTestPage({ params }: { params: Promise<{ test: string }> }) {
  const { test } = await params;
  redirect(`/apps/base12-training/${test}`);
}

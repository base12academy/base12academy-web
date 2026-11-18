import { notFound } from "next/navigation";
import { packageCourse } from "@/lib/haciendas-universidades";
import Materials from "./materials";

export default async function Page({ params }: { params: Promise<{ course: string }> }) {
  const { course: slug } = await params;
  const course = packageCourse(slug);
  if (!course) notFound();
  return <Materials slug={slug} title={course.title} />;
}

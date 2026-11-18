import { notFound } from "next/navigation";
import { packageCourse } from "@/lib/haciendas-universidades";
import SharedOppositionCourse from "@/components/SharedOppositionCourse";
import localAdministrativos from "@/lib/oppositions/administrativos-haciendas-locales/index.json";
import localAuxiliares from "@/lib/oppositions/auxiliares-haciendas-locales/index.json";
import Materials from "./materials";

const classrooms = new Map([
  [localAdministrativos.courseSlug, localAdministrativos],
  [localAuxiliares.courseSlug, localAuxiliares],
]);

export default async function Page({ params }: { params: Promise<{ course: string }> }) {
  const { course: slug } = await params;
  const course = packageCourse(slug);
  if (!course) notFound();
  const index = classrooms.get(slug);
  return index
    ? <SharedOppositionCourse index={index} materialsHref={`/dashboard/haciendas-universidades/${slug}/materiales`} />
    : <Materials slug={slug} title={course.title} />;
}

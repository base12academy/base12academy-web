import { notFound } from "next/navigation";
import { bundledOppositionEnrollment, packageCourse } from "@/lib/haciendas-universidades";
import SharedOppositionCourse from "@/components/SharedOppositionCourse";
import localAdministrativos from "@/lib/oppositions/administrativos-haciendas-locales/index.json";
import localAuxiliares from "@/lib/oppositions/auxiliares-haciendas-locales/index.json";
import Materials from "./materials";

const classrooms = {
  "administrativos-haciendas-locales": localAdministrativos,
  "auxiliares-haciendas-locales": localAuxiliares,
};

function interactiveClassroom(slug: string) {
  if (!Object.hasOwn(classrooms, slug)) return null;
  const key = slug as keyof typeof classrooms;
  return { ...classrooms[key], enrollmentOpen: bundledOppositionEnrollment[key] };
}

export default async function Page({ params }: { params: Promise<{ course: string }> }) {
  const { course: slug } = await params;
  const course = packageCourse(slug);
  if (!course) notFound();
  const index = interactiveClassroom(slug);
  return index
    ? <SharedOppositionCourse index={index} materialsHref={`/dashboard/haciendas-universidades/${slug}/materiales`} />
    : <Materials slug={slug} title={course.title} />;
}

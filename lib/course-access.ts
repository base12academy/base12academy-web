export const ADMIN_EMAIL = "base12academy+administracion@gmail.com";

export const OFIMATICA_PUBLIC_PREVIEW = {
  courseSlug: "ofimatica",
  groupId: "G01",
  lessonId: "G01_V01",
} as const;

export function isCourseAdministrator(email?: string | null) {
  return email?.trim().toLowerCase() === ADMIN_EMAIL;
}

export function isPublicOfimaticaLesson(lessonId: string) {
  return lessonId.toUpperCase() === OFIMATICA_PUBLIC_PREVIEW.lessonId;
}

import catalog from "./catalog.json";

export const testPrograms = catalog;
export const TEST_PRICE = "9,90 €/mes";
export const testCoursePath = (slug: string) => "/test-opo12/" + encodeURIComponent(slug);
export const testProgram = (slug: string) => catalog.find(course => course.slug === slug);
export const testProduct = (slug: string) => "test-opo12-" + slug;

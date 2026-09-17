export const TRAINING_LICENSE_YEARS = 1;
export const TRAINING_OWNER_EMAIL = "eduardojcaro@gmail.com";
export const TRAINING_PRODUCT_SLUG = "tropa-y-marineria-base12-training";

export function getTrainingLicenseExpiry(value: string | Date) {
  const expiry = new Date(value);
  if (Number.isNaN(expiry.getTime())) return null;
  expiry.setUTCFullYear(expiry.getUTCFullYear() + TRAINING_LICENSE_YEARS);
  return expiry;
}

export function isTrainingLicenseActive(value: string | Date, now = new Date()) {
  const expiry = getTrainingLicenseExpiry(value);
  return Boolean(expiry && expiry.getTime() > now.getTime());
}

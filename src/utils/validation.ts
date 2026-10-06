export const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
/** Indian mobile: optional +91 / 0 prefix, then 10 digits starting 6-9 */
export const INDIAN_PHONE_RE = /^(?:\+91|0)?[6-9]\d{9}$/;

export const phoneError = 'Enter a valid 10-digit Indian mobile number (e.g. 98250 12345)';
export const emailError = 'Enter a valid email address';

export function isValidIndianPhone(raw: string): boolean {
  return INDIAN_PHONE_RE.test(raw.trim());
}

/** Returns the 10-digit number without country/prefix, or null when invalid. */
export function normalizePhone(raw: string): string | null {
  const trimmed = raw.trim();
  if (!INDIAN_PHONE_RE.test(trimmed)) return null;
  return trimmed.replace(/^\+91/, '').replace(/^0/, '').replace(/\D/g, '');
}

/** "+91 98250 12345" style display format from any accepted input. */
export function formatPhoneDisplay(raw: string): string {
  const digits = normalizePhone(raw);
  if (!digits) return raw;
  return `+91 ${digits.slice(0, 5)} ${digits.slice(5)}`;
}

export function isValidEmail(email: string): boolean {
  return EMAIL_RE.test(email.trim());
}

export const required = (v: string): string | null => (v.trim() ? null : 'This field is required');

export const minLen = (min: number) => (v: string): string | null =>
  v.trim().length >= min ? null : `Must be at least ${min} characters`;

export const maxLen = (max: number) => (v: string): string | null =>
  v.trim().length <= max ? null : `Must be at most ${max} characters`;

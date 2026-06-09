export const MIN_PASSENGERS = 1;
export const MAX_PASSENGERS = 8;

export function parsePassengerCount(value: string): number | null {
  const trimmed = value.trim();
  if (!trimmed) {
    return MIN_PASSENGERS;
  }
  const parsed = Number.parseInt(trimmed, 10);
  if (!Number.isFinite(parsed)) {
    return null;
  }
  if (parsed < MIN_PASSENGERS || parsed > MAX_PASSENGERS) {
    return null;
  }
  return parsed;
}

export function formatPassengerCount(count?: number): string {
  if (count === undefined || count === null) {
    return String(MIN_PASSENGERS);
  }
  return String(count);
}

/** Keep passenger field numeric and capped while the user types. */
export function sanitizePassengerInput(value: string): string {
  const digits = value.replace(/\D/g, '');
  if (!digits) {
    return '';
  }

  const parsed = Number.parseInt(digits, 10);
  if (!Number.isFinite(parsed)) {
    return '';
  }

  if (parsed > MAX_PASSENGERS) {
    return String(MAX_PASSENGERS);
  }

  if (parsed < MIN_PASSENGERS) {
    return '';
  }

  return String(parsed);
}

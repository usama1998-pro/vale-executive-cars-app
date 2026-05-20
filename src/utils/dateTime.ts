export function formatPreferredPickup(iso: string): string {
  if (!iso) return '';
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return '';

  return date.toLocaleString('en-GB', {
    weekday: 'short',
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  });
}

export function formatPickupDate(iso: string): string {
  if (!iso) return 'Select date';
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return 'Select date';

  return date.toLocaleDateString('en-GB', {
    weekday: 'short',
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
}

export function formatPickupTime(iso: string): string {
  if (!iso) return 'Select time';
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return 'Select time';

  return date.toLocaleTimeString('en-GB', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  });
}

export function mergeDatePart(base: Date, fromPicker: Date): Date {
  const merged = new Date(base);
  merged.setFullYear(
    fromPicker.getFullYear(),
    fromPicker.getMonth(),
    fromPicker.getDate(),
  );
  return merged;
}

export function mergeTimePart(base: Date, fromPicker: Date): Date {
  const merged = new Date(base);
  merged.setHours(fromPicker.getHours(), fromPicker.getMinutes(), 0, 0);
  return merged;
}

export function getDefaultPickupDate(): Date {
  const date = new Date();
  date.setMinutes(Math.ceil(date.getMinutes() / 15) * 15, 0, 0);
  date.setHours(date.getHours() + 1);
  return date;
}

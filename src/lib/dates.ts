/** Format a Date as a local 'YYYY-MM-DD' key (not UTC). */
export function toKey(date: Date): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

/** Parse a 'YYYY-MM-DD' key into a local Date at midnight. */
export function fromKey(key: string): Date {
  const [y, m, d] = key.split('-').map(Number);
  return new Date(y, m - 1, d);
}

export function todayKey(): string {
  return toKey(new Date());
}

export function addDays(key: string, n: number): string {
  const date = fromKey(key);
  date.setDate(date.getDate() + n);
  return toKey(date);
}

/** The last n day keys ending at `end` (inclusive), oldest first. */
export function lastNDays(n: number, end: string = todayKey()): string[] {
  const days: string[] = [];
  for (let i = n - 1; i >= 0; i--) days.push(addDays(end, -i));
  return days;
}

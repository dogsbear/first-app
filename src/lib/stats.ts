import type { Habit } from '../types';
import { addDays, lastNDays, todayKey } from './dates';

/**
 * Consecutive completed days ending today. If today isn't completed yet,
 * the streak counts back from yesterday so it isn't "broken" until the day ends.
 */
export function currentStreak(habit: Habit, today: string = todayKey()): number {
  const done = new Set(habit.completions);
  let day = done.has(today) ? today : addDays(today, -1);
  let streak = 0;
  while (done.has(day)) {
    streak++;
    day = addDays(day, -1);
  }
  return streak;
}

export function longestStreak(habit: Habit): number {
  const days = [...new Set(habit.completions)].sort();
  let best = 0;
  let run = 0;
  let prev: string | null = null;
  for (const day of days) {
    run = prev !== null && addDays(prev, 1) === day ? run + 1 : 1;
    best = Math.max(best, run);
    prev = day;
  }
  return best;
}

/**
 * Percentage (0–100) of the last `days` days that were completed,
 * only counting days on or after the habit was created.
 */
export function completionRate(
  habit: Habit,
  days = 30,
  today: string = todayKey(),
): number {
  const done = new Set(habit.completions);
  const window = lastNDays(days, today).filter(
    (d) => d >= habit.createdAt || done.has(d),
  );
  if (window.length === 0) return 0;
  const completed = window.filter((d) => done.has(d)).length;
  return Math.round((completed / window.length) * 100);
}

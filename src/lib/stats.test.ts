import { describe, expect, it } from 'vitest';
import type { Habit } from '../types';
import { addDays, lastNDays } from './dates';
import { completionRate, currentStreak, longestStreak } from './stats';

const TODAY = '2026-03-10';

function habit(completions: string[], createdAt = '2026-01-01'): Habit {
  return { id: 'h', name: 'Test', createdAt, completions };
}

describe('dates', () => {
  it('addDays crosses month boundaries', () => {
    expect(addDays('2026-03-01', -1)).toBe('2026-02-28');
    expect(addDays('2026-12-31', 1)).toBe('2027-01-01');
  });

  it('lastNDays returns oldest first, ending at end', () => {
    expect(lastNDays(3, TODAY)).toEqual(['2026-03-08', '2026-03-09', '2026-03-10']);
  });
});

describe('currentStreak', () => {
  it('is 0 with no completions', () => {
    expect(currentStreak(habit([]), TODAY)).toBe(0);
  });

  it('counts consecutive days including today', () => {
    expect(currentStreak(habit(['2026-03-08', '2026-03-09', '2026-03-10']), TODAY)).toBe(3);
  });

  it('counts from yesterday when today is not done yet', () => {
    expect(currentStreak(habit(['2026-03-08', '2026-03-09']), TODAY)).toBe(2);
  });

  it('stops at a gap', () => {
    expect(currentStreak(habit(['2026-03-05', '2026-03-06', '2026-03-09', '2026-03-10']), TODAY)).toBe(2);
  });

  it('is 0 when the last completion was before yesterday', () => {
    expect(currentStreak(habit(['2026-03-07', '2026-03-08']), TODAY)).toBe(0);
  });
});

describe('longestStreak', () => {
  it('is 0 with no completions', () => {
    expect(longestStreak(habit([]))).toBe(0);
  });

  it('finds the longest run regardless of order and duplicates', () => {
    const h = habit(['2026-03-10', '2026-02-27', '2026-03-01', '2026-02-28', '2026-02-28', '2026-03-09']);
    expect(longestStreak(h)).toBe(3);
  });
});

describe('completionRate', () => {
  it('uses the full window for older habits', () => {
    const h = habit(lastNDays(15, TODAY));
    expect(completionRate(h, 30, TODAY)).toBe(50);
  });

  it('only counts days since creation', () => {
    const h = habit(['2026-03-09', '2026-03-10'], '2026-03-07');
    expect(completionRate(h, 30, TODAY)).toBe(50);
  });

  it('is 0 with no completions', () => {
    expect(completionRate(habit([], TODAY), 30, TODAY)).toBe(0);
  });
});

import { useCallback, useEffect, useState } from 'react';
import type { Habit } from '../types';
import { todayKey } from '../lib/dates';

const STORAGE_KEY = 'habit-tracker:v1';

function load(): Habit[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    const parsed: unknown = raw ? JSON.parse(raw) : [];
    return Array.isArray(parsed) ? (parsed as Habit[]) : [];
  } catch {
    return [];
  }
}

export function useHabits() {
  const [habits, setHabits] = useState<Habit[]>(load);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(habits));
  }, [habits]);

  const addHabit = useCallback((name: string) => {
    const trimmed = name.trim();
    if (!trimmed) return;
    setHabits((hs) => [
      ...hs,
      { id: crypto.randomUUID(), name: trimmed, createdAt: todayKey(), completions: [] },
    ]);
  }, []);

  const toggleDate = useCallback((id: string, date: string) => {
    setHabits((hs) =>
      hs.map((h) => {
        if (h.id !== id) return h;
        const has = h.completions.includes(date);
        return {
          ...h,
          completions: has ? h.completions.filter((d) => d !== date) : [...h.completions, date],
        };
      }),
    );
  }, []);

  const toggleToday = useCallback((id: string) => toggleDate(id, todayKey()), [toggleDate]);

  const deleteHabit = useCallback((id: string) => {
    setHabits((hs) => hs.filter((h) => h.id !== id));
  }, []);

  const renameHabit = useCallback((id: string, name: string) => {
    const trimmed = name.trim();
    if (!trimmed) return;
    setHabits((hs) => hs.map((h) => (h.id === id ? { ...h, name: trimmed } : h)));
  }, []);

  return { habits, addHabit, toggleDate, toggleToday, deleteHabit, renameHabit };
}

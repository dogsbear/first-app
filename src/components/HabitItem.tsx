import { useState } from 'react';
import type { Habit } from '../types';
import { currentStreak } from '../lib/stats';

interface Props {
  habit: Habit;
  today: string;
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
}

export function HabitItem({ habit, today, onToggle, onDelete }: Props) {
  const [confirming, setConfirming] = useState(false);
  const done = habit.completions.includes(today);
  const streak = currentStreak(habit, today);

  return (
    <li className={`habit-item${done ? ' done' : ''}`}>
      <label className="habit-check">
        <input type="checkbox" checked={done} onChange={() => onToggle(habit.id)} />
        <span className="habit-name">{habit.name}</span>
      </label>
      <span className="streak" title="Current streak">
        🔥 {streak} {streak === 1 ? 'day' : 'days'}
      </span>
      {confirming ? (
        <span className="confirm">
          Delete?
          <button className="danger" onClick={() => onDelete(habit.id)}>Yes</button>
          <button className="ghost" onClick={() => setConfirming(false)}>No</button>
        </span>
      ) : (
        <button className="ghost" onClick={() => setConfirming(true)} aria-label={`Delete ${habit.name}`}>
          ✕
        </button>
      )}
    </li>
  );
}

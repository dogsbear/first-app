import type { Habit } from '../types';
import { HabitItem } from './HabitItem';

interface Props {
  habits: Habit[];
  today: string;
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
}

export function HabitList({ habits, today, onToggle, onDelete }: Props) {
  if (habits.length === 0) {
    return <p className="empty">No habits yet. Add one above to get started.</p>;
  }
  const doneCount = habits.filter((h) => h.completions.includes(today)).length;

  return (
    <>
      <p className="muted">
        {doneCount} of {habits.length} done today
      </p>
      <ul className="habit-list">
        {habits.map((h) => (
          <HabitItem key={h.id} habit={h} today={today} onToggle={onToggle} onDelete={onDelete} />
        ))}
      </ul>
    </>
  );
}

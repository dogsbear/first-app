import { useEffect, useState } from 'react';
import { useHabits } from './hooks/useHabits';
import { fromKey, todayKey } from './lib/dates';
import { AddHabitForm } from './components/AddHabitForm';
import { HabitList } from './components/HabitList';
import { Dashboard } from './components/Dashboard';

type Tab = 'today' | 'dashboard';

/** Today's date key, refreshed so the app rolls over at midnight if left open. */
function useToday() {
  const [today, setToday] = useState(todayKey);
  useEffect(() => {
    const id = setInterval(() => setToday(todayKey()), 60_000);
    return () => clearInterval(id);
  }, []);
  return today;
}

export default function App() {
  const { habits, addHabit, toggleToday, toggleDate, deleteHabit } = useHabits();
  const [tab, setTab] = useState<Tab>('today');
  const today = useToday();

  return (
    <div className="app">
      <header>
        <h1>Habit Tracker</h1>
        <p className="muted">
          {fromKey(today).toLocaleDateString(undefined, { weekday: 'long', month: 'long', day: 'numeric' })}
        </p>
        <nav className="tabs" role="tablist">
          <button role="tab" aria-selected={tab === 'today'} onClick={() => setTab('today')}>
            Today
          </button>
          <button role="tab" aria-selected={tab === 'dashboard'} onClick={() => setTab('dashboard')}>
            Dashboard
          </button>
        </nav>
      </header>

      <main>
        {tab === 'today' ? (
          <>
            <AddHabitForm existingNames={habits.map((h) => h.name)} onAdd={addHabit} />
            <HabitList habits={habits} today={today} onToggle={toggleToday} onDelete={deleteHabit} />
          </>
        ) : (
          <Dashboard habits={habits} today={today} onToggleDate={toggleDate} />
        )}
      </main>
    </div>
  );
}

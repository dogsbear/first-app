import type { Habit } from '../types';
import { fromKey, lastNDays } from '../lib/dates';
import { completionRate, currentStreak, longestStreak } from '../lib/stats';

interface Props {
  habits: Habit[];
  today: string;
  onToggleDate: (id: string, date: string) => void;
}

const weekday = (key: string) => fromKey(key).toLocaleDateString(undefined, { weekday: 'narrow' });
const longDate = (key: string) =>
  fromKey(key).toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric' });

export function Dashboard({ habits, today, onToggleDate }: Props) {
  if (habits.length === 0) {
    return <p className="empty">Add some habits on the Today tab to see your progress here.</p>;
  }

  const week = lastNDays(7, today);
  const rows = habits.map((h) => ({
    habit: h,
    current: currentStreak(h, today),
    longest: longestStreak(h),
    rate: completionRate(h, 30, today),
  }));

  const doneToday = habits.filter((h) => h.completions.includes(today)).length;
  const bestStreak = Math.max(...rows.map((r) => r.current));
  const avgRate = Math.round(rows.reduce((sum, r) => sum + r.rate, 0) / rows.length);

  return (
    <div className="dashboard">
      <div className="cards">
        <Card label="Habits" value={habits.length} />
        <Card label="Done today" value={`${doneToday}/${habits.length}`} />
        <Card label="Best current streak" value={`🔥 ${bestStreak}`} />
        <Card label="30-day average" value={`${avgRate}%`} />
      </div>

      <div className="table-wrap">
        <table className="overview">
          <thead>
            <tr>
              <th className="left">Habit</th>
              <th>Streak</th>
              <th>Best</th>
              <th className="left">Last 30 days</th>
              <th>
                <div className="week-head">
                  {week.map((d) => (
                    <span key={d} className={d === today ? 'is-today' : ''}>{weekday(d)}</span>
                  ))}
                </div>
              </th>
            </tr>
          </thead>
          <tbody>
            {rows.map(({ habit, current, longest, rate }) => (
              <tr key={habit.id}>
                <td className="left habit-name">{habit.name}</td>
                <td>🔥 {current}</td>
                <td>{longest}</td>
                <td className="left">
                  <div className="progress" title={`${rate}% of the last 30 days`}>
                    <div className="progress-bar" style={{ width: `${rate}%` }} />
                  </div>
                  <span className="rate">{rate}%</span>
                </td>
                <td>
                  <div className="week">
                    {week.map((d) => {
                      const done = habit.completions.includes(d);
                      return (
                        <button
                          key={d}
                          className={`dot${done ? ' filled' : ''}${d === today ? ' is-today' : ''}`}
                          title={`${longDate(d)}: ${done ? 'done' : 'not done'} (click to toggle)`}
                          aria-label={`${habit.name}, ${longDate(d)}, ${done ? 'done' : 'not done'}`}
                          aria-pressed={done}
                          onClick={() => onToggleDate(habit.id, d)}
                        />
                      );
                    })}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function Card({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="card">
      <div className="card-value">{value}</div>
      <div className="card-label">{label}</div>
    </div>
  );
}

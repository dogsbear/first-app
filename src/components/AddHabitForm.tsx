import { useState, type FormEvent } from 'react';

interface Props {
  existingNames: string[];
  onAdd: (name: string) => void;
}

export function AddHabitForm({ existingNames, onAdd }: Props) {
  const [name, setName] = useState('');
  const [error, setError] = useState('');

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    const trimmed = name.trim();
    if (!trimmed) {
      setError('Please enter a habit name.');
      return;
    }
    if (existingNames.some((n) => n.toLowerCase() === trimmed.toLowerCase())) {
      setError('You already have a habit with that name.');
      return;
    }
    onAdd(trimmed);
    setName('');
    setError('');
  }

  return (
    <form className="add-form" onSubmit={handleSubmit}>
      <input
        type="text"
        placeholder="New habit, e.g. Drink 8 glasses of water"
        value={name}
        maxLength={60}
        onChange={(e) => {
          setName(e.target.value);
          if (error) setError('');
        }}
        aria-label="Habit name"
      />
      <button type="submit">Add</button>
      {error && <p className="form-error">{error}</p>}
    </form>
  );
}

export interface Habit {
  id: string;
  name: string;
  /** Local date key 'YYYY-MM-DD' */
  createdAt: string;
  /** Local date keys 'YYYY-MM-DD' on which the habit was completed */
  completions: string[];
}

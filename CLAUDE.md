# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

- `npm run dev` — Vite dev server with HMR
- `npm run build` — type-check (`tsc -b`) then production build to `dist/`
- `npm run lint` — Oxlint (config in `.oxlintrc.json`; enforces `react/rules-of-hooks`)
- `npm test` — Vitest, single run
- Single test file: `npx vitest run src/lib/stats.test.ts`
- Single test by name: `npx vitest run -t "currentStreak"`

## Architecture

A client-only habit tracker (React 19 + TypeScript + Vite). There is no backend: all state lives in `localStorage`.

- **State:** `src/hooks/useHabits.ts` is the only owner of habit data. It loads from and saves to `localStorage` under the key `habit-tracker:v1` and exposes the mutations (add, toggle, rename, delete). Components receive data and callbacks as props from `App.tsx`; they never touch storage themselves. If you change the `Habit` shape in `src/types.ts`, bump the storage key or add a migration in `load()`, because existing users' saved data still uses the old shape.
- **Dates are local `'YYYY-MM-DD'` string keys, not `Date` objects.** `createdAt` and `completions` are stored this way. Always go through `src/lib/dates.ts` (`toKey`, `fromKey`, `addDays`, `lastNDays`). Never use `toISOString()`, which converts to UTC and shifts the day for non-UTC users. Keys sort lexicographically, so plain string comparison (`d >= habit.createdAt`) is valid.
- **"Today" is passed in, not read globally.** `App.tsx`'s `useToday()` checks the date every minute so the UI rolls over at midnight. `today` flows down as a prop. Functions in `src/lib/stats.ts` take an optional `today` parameter so tests can pin the date (see `stats.test.ts`, which uses a fixed `TODAY`).
- **Stats** (`src/lib/stats.ts`) are pure functions. `currentStreak` deliberately counts back from yesterday if today isn't done yet, so a streak isn't shown as broken until the day ends. `completionRate` only counts days on or after `createdAt`.
- UI has two tabs in `App.tsx`: "Today" (add form + list) and "Dashboard" (history; can toggle past dates via `toggleDate`).

## Workflow

The repo is backed up to GitHub at `dogsbear/first-app` (private). Commit each logical change with a clear message and push to `origin/main` promptly, so the user can roll back.

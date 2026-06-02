import { Table, z } from '@botpress/runtime'

/**
 * Tracks student mood check-ins over time.
 *
 * Each row represents one mood check-in event. The mood and notes
 * columns are searchable, enabling semantic search over past check-ins
 * (e.g. "when did I last feel burnt out?").
 *
 * @reserved id, createdAt, updatedAt — auto-managed by the system
 */
export const MoodLogTable = new Table({
  name: 'moodLogTable',
  description: 'Logs student mood check-ins with score, label, and optional notes for trend tracking',
  columns: {
    userId: {
      schema: z.string().describe('The user ID associated with this check-in'),
    },
    mood: {
      searchable: true,
      schema: z.string().describe('Mood label as described by the user (e.g. stressed, tired, anxious, good, great)'),
    },
    score: {
      schema: z.number().min(1).max(10).describe('Numeric mood score from 1 (very low) to 10 (excellent)'),
    },
    notes: {
      searchable: true,
      schema: z.string().optional().describe('Optional additional context the user provided about their mood'),
    },
    studySessionsCompleted: {
      schema: z.number().default(0).describe('Number of study sessions the user completed on this day'),
    },
  },
})

/**
 * Tracks habit completion for each user by day.
 *
 * Each row represents one habit tracking entry. Enables the bot to
 * confirm streaks and provide personalised accountability feedback.
 */
export const HabitLogTable = new Table({
  name: 'habitLogTable',
  description: 'Logs daily habit completion entries to support streak tracking and accountability',
  columns: {
    userId: {
      schema: z.string().describe('The user ID associated with this habit log entry'),
    },
    habitName: {
      searchable: true,
      schema: z.string().describe('Name of the habit being tracked (e.g. Morning Pomodoro, Exercise, Flashcard Review)'),
    },
    completed: {
      schema: z.boolean().describe('Whether the habit was completed on this day'),
    },
    streakDays: {
      schema: z.number().default(0).describe('Consecutive days this habit has been completed'),
    },
    date: {
      schema: z.string().describe('ISO date string (YYYY-MM-DD) for this habit entry'),
    },
  },
})

import { Action, z, context } from '@botpress/runtime'
import { MoodLogTable } from '../tables'

/**
 * Logs a student mood check-in to the MoodLogTable.
 *
 * Called by the conversation agent when a user performs a mood check-in.
 * Records the mood label, numeric score, and optional context notes.
 * Can be exposed as an AI tool via .asTool() for autonomous invocation.
 */
export const logMoodCheckIn = new Action({
  name: 'logMoodCheckIn',
  description: 'Log a student mood check-in to the mood tracking database. Call this whenever a user shares their mood or rates it on a scale.',

  input: z.object({
    userId: z.string().describe('The ID of the user performing the check-in'),
    mood: z.string().describe('Mood label as described by the user (e.g. stressed, tired, anxious, good, great, overwhelmed)'),
    score: z.number().min(1).max(10).describe('Numeric mood score from 1 (very low) to 10 (excellent)'),
    notes: z.string().optional().describe('Any additional context the user provided about their mood or situation'),
    studySessionsCompleted: z.number().default(0).describe('Number of study sessions the user completed today'),
  }),

  output: z.object({
    success: z.boolean().describe('Whether the log entry was created successfully'),
    message: z.string().describe('Confirmation message'),
    entryId: z.string().optional().describe('ID of the created table row'),
  }),

  async handler({ input }) {
    const client = context.get('client')

    try {
      const { rows } = await client.createTableRows({
        table: MoodLogTable.name,
        rows: [{
          userId: input.userId,
          mood: input.mood,
          score: input.score,
          notes: input.notes ?? '',
          studySessionsCompleted: input.studySessionsCompleted,
        }],
      })
      const row = rows[0]

      return {
        success: true,
        message: `Mood check-in logged: "${input.mood}" (${input.score}/10)`,
        entryId: String(row?.id ?? ''),
      }
    } catch (error) {
      return {
        success: false,
        message: `Could not log mood check-in: ${error instanceof Error ? error.message : 'Unknown error'}`,
      }
    }
  },
})

/**
 * Logs a habit completion entry to the HabitLogTable.
 *
 * Called when a user reports completing or skipping a tracked habit.
 */
export const logHabitCompletion = new Action({
  name: 'logHabitCompletion',
  description: 'Log a daily habit completion or skip to the habit tracking database.',

  input: z.object({
    userId: z.string().describe('The ID of the user logging the habit'),
    habitName: z.string().describe('Name of the habit being tracked'),
    completed: z.boolean().describe('Whether the habit was completed today'),
    streakDays: z.number().default(0).describe('Current streak count for this habit'),
    date: z.string().describe('ISO date string (YYYY-MM-DD) for this log entry'),
  }),

  output: z.object({
    success: z.boolean(),
    message: z.string(),
  }),

  async handler({ input }) {
    const client = context.get('client')

    try {
      await client.createTableRows({
        table: 'habitLogTable',
        rows: [{
          userId: input.userId,
          habitName: input.habitName,
          completed: input.completed,
          streakDays: input.streakDays,
          date: input.date,
        }],
      })

      return {
        success: true,
        message: input.completed
          ? `Habit "${input.habitName}" marked as completed. Streak: ${input.streakDays} days.`
          : `Habit "${input.habitName}" marked as skipped today.`,
      }
    } catch (error) {
      return {
        success: false,
        message: `Could not log habit: ${error instanceof Error ? error.message : 'Unknown error'}`,
      }
    }
  },
})

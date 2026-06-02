import { z, defineConfig } from '@botpress/runtime'

export default defineConfig({
    name: 'ai_assignment',
    description: 'MindHelper — Student Mental Health & Productivity Assistant. Helps students manage stress, stay productive, track habits, and get study guidance.',

    defaultModels: {
        autonomous: 'openai:gpt-4.1-mini-2025-04-14',
        zai: 'openai:gpt-4.1-2025-04-14',
    },

    // Per-bot persistent state (global analytics)
    bot: {
        state: z.object({
            totalMoodCheckIns: z.number().default(0).describe('Total mood check-ins across all users'),
            totalStudySessions: z.number().default(0).describe('Total study sessions logged across all users'),
        }),
    },

    // Per-user persistent state — tracks mood history, study progress, and habit streaks
    user: {
        state: z.object({
            lastMood: z.string().optional().describe('Most recent mood label (e.g. stressed, tired, anxious, good, great)'),
            moodScore: z.number().min(1).max(10).optional().describe('Mood score from 1 (very low) to 10 (excellent)'),
            studySessionsCompleted: z.number().default(0).describe('Total Pomodoro study sessions completed by this user'),
            habitStreak: z.number().default(0).describe('Consecutive days the user has checked in with the bot'),
            lastCheckInDate: z.string().optional().describe('ISO date string of the last mood check-in'),
            totalCheckIns: z.number().default(0).describe('Cumulative number of mood check-ins by this user'),
            preferredStudyTechnique: z.string().optional().describe('User-preferred study technique (e.g. Pomodoro, active recall)'),
            currentGoal: z.string().optional().describe('User-stated current academic goal or focus area'),
        }),
    },

    // Integrations
    dependencies: {
        "integrations": {
            "chat": "chat@1.0.0",
            "webchat": "webchat@0.3.0"
        }
    },
})

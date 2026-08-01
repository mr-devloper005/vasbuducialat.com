import type { CSSProperties } from 'react'
import type { TaskKey } from '@/lib/site-config'

/*
  One shared editorial visual language for every task surface.
  Palette + type pulled from the reference (givewave.webflow.io). Only kicker
  and note change per task so pages retain a little voice while staying
  cohesive.
*/

export type TaskTheme = {
  kicker: string
  note: string
  dark: boolean
  fontDisplay: string
  fontBody: string
  bg: string
  surface: string
  raised: string
  text: string
  muted: string
  line: string
  accent: string
  accentSoft: string
  onAccent: string
  glow: string
  radius: string
}

const DISPLAY =
  "'Instrument Sans', 'Inter Tight', 'Inter', system-ui, -apple-system, sans-serif"
const BODY =
  "'Inter Tight', 'Inter', system-ui, -apple-system, 'Helvetica Neue', Arial, sans-serif"

const base = {
  dark: false,
  fontDisplay: DISPLAY,
  fontBody: BODY,
  bg: '#ffffff',
  surface: '#ffffff',
  raised: '#f1f3f4',
  text: '#060f1e',
  muted: '#646464',
  line: 'rgba(138,138,138,0.20)',
  accent: '#ffb44f',
  accentSoft: '#fff2df',
  onAccent: '#060f1e',
  glow: 'rgba(255,180,79,0.10)',
  radius: '8px',
} satisfies Omit<TaskTheme, 'kicker' | 'note'>

export const taskThemes: Record<TaskKey, TaskTheme> = {
  article: {
    ...base,
    kicker: 'Field journal',
    note: 'Slow reads and reported pieces from the field.',
  },
  listing: {
    ...base,
    kicker: 'Community Directory',
    note: 'Verified places, people, and organisations you can visit today.',
  },
  classified: {
    ...base,
    kicker: 'Noticeboard',
    note: 'Short-form calls, offers, and asks with room to move.',
  },
  image: {
    ...base,
    kicker: 'Contact sheet',
    note: 'A rolling contact sheet from the community lens.',
  },
  sbm: {
    ...base,
    kicker: 'Shelf',
    note: 'Links, tools, and references worth keeping.',
  },
  pdf: {
    ...base,
    kicker: 'Field Notes',
    note: 'Downloadable guides, briefs, and reference material.',
  },
  profile: {
    ...base,
    kicker: 'Neighbours',
    note: 'People and organisations behind the directory.',
  },
}

export function getTaskTheme(task: TaskKey): TaskTheme {
  return taskThemes[task] || taskThemes.article
}

export function taskThemeStyle(task: TaskKey): CSSProperties {
  const t = getTaskTheme(task)
  return {
    '--tk-bg': t.bg,
    '--tk-surface': t.surface,
    '--tk-raised': t.raised,
    '--tk-text': t.text,
    '--tk-muted': t.muted,
    '--tk-line': t.line,
    '--tk-accent': t.accent,
    '--tk-accent-soft': t.accentSoft,
    '--tk-on-accent': t.onAccent,
    '--tk-glow': t.glow,
    '--tk-radius': t.radius,
    '--slot4-accent': t.accent,
    '--slot4-accent-fill': t.accent,
    '--editable-font-display': t.fontDisplay,
    '--editable-font-body': t.fontBody,
    fontFamily: t.fontBody,
  } as CSSProperties
}

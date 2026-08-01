import type { CSSProperties } from 'react'

/*
  Design tokens extracted from https://givewave.webflow.io/ (real CSS bundle).
  Editorial-NGO character: near-monochrome cool grays on white, alternating ash
  panels, single warm amber accent, soft-8px cards + full-pill CTAs.
  All values verbatim from the reference where possible.
*/
export const editableRootStyle = {
  // Palette (reference: --color-style-*)
  '--slot4-page-bg': '#ffffff',
  '--slot4-page-text': '#060f1e',
  '--slot4-panel-bg': '#f1f3f4',
  '--slot4-surface-bg': '#ffffff',
  '--slot4-muted-text': '#646464',
  '--slot4-soft-muted-text': '#8a8a8a',
  '--slot4-accent': '#ffb44f',
  '--slot4-accent-fill': '#ffb44f',
  '--slot4-accent-soft': '#fff2df',
  '--slot4-on-accent': '#060f1e',
  '--slot4-dark-bg': '#141d2c',
  '--slot4-dark-text': '#ffffff',
  '--slot4-media-bg': '#f1f3f4',
  '--slot4-cream': '#f5f3f2',
  '--slot4-warm': '#f5f3f2',
  '--slot4-lavender': '#f1f3f4',
  '--slot4-gray': '#f1f3f4',
  '--slot4-body-gradient': 'none',
  '--slot4-stroke': 'rgba(138,138,138,0.20)',
  '--slot4-stroke-strong': '#262626',
  '--editable-page-bg': '#ffffff',
  '--editable-page-text': '#060f1e',
  '--editable-container': '1352px',
  '--editable-container-sm': '906px',
  '--editable-container-tiny': '684px',
  '--editable-pad-x': 'clamp(20px, 4vw, 60px)',
  '--editable-section-y': 'clamp(72px, 10vw, 180px)',
  '--editable-block-y': 'clamp(48px, 7vw, 120px)',
  '--editable-border': 'rgba(138,138,138,0.20)',
  '--editable-nav-bg': '#ffffff',
  '--editable-nav-text': '#060f1e',
  '--editable-nav-active': '#ffb44f',
  '--editable-nav-active-text': '#060f1e',
  '--editable-cta-bg': '#ffb44f',
  '--editable-cta-text': '#060f1e',
  '--editable-search-bg': '#ffffff',
  '--editable-footer-bg': '#141d2c',
  '--editable-footer-text': '#ffffff',
} as CSSProperties

export const editablePalette = {
  pageBg: 'bg-[var(--slot4-page-bg)]',
  pageText: 'text-[var(--slot4-page-text)]',
  panelBg: 'bg-[var(--slot4-panel-bg)]',
  panelText: 'text-[var(--slot4-page-text)]',
  surfaceBg: 'bg-[var(--slot4-surface-bg)]',
  surfaceText: 'text-[var(--slot4-page-text)]',
  mutedText: 'text-[var(--slot4-muted-text)]',
  softMutedText: 'text-[var(--slot4-soft-muted-text)]',
  accentText: 'text-[var(--slot4-accent)]',
  accentBg: 'bg-[var(--slot4-accent-fill)]',
  accentSoftBg: 'bg-[var(--slot4-accent-soft)]',
  accentSoftText: 'text-[var(--slot4-accent-soft)]',
  onAccentText: 'text-[var(--slot4-on-accent)]',
  darkBg: 'bg-[var(--slot4-dark-bg)]',
  darkText: 'text-[var(--slot4-dark-text)]',
  mediaBg: 'bg-[var(--slot4-media-bg)]',
  creamBg: 'bg-[var(--slot4-cream)]',
  warmBg: 'bg-[var(--slot4-warm)]',
  lavenderBg: 'bg-[var(--slot4-lavender)]',
  grayBg: 'bg-[var(--slot4-gray)]',
  border: 'border-[color:var(--editable-border)]',
  darkBorder: 'border-white/10',
  shadow: 'shadow-none',
  shadowStrong: 'shadow-none',
  overlay: 'bg-[linear-gradient(180deg,rgba(6,15,30,0.05),rgba(6,15,30,0.75))]',
} as const

export const editableDesignContract = {
  shell: {
    page: `min-h-screen ${editablePalette.pageBg} ${editablePalette.pageText}`,
    section:
      'mx-auto w-full max-w-[var(--editable-container)] px-[var(--editable-pad-x)]',
    narrow:
      'mx-auto w-full max-w-[var(--editable-container-sm)] px-[var(--editable-pad-x)]',
    tiny:
      'mx-auto w-full max-w-[var(--editable-container-tiny)] px-[var(--editable-pad-x)]',
    bleed: 'w-full',
    sectionY: 'py-[var(--editable-section-y)]',
    sectionYSm: 'py-16 sm:py-20 lg:py-24',
    blockY: 'py-[var(--editable-block-y)]',
  },
  layout: {
    // Reference grid signatures — deliberate asymmetric splits.
    split3565: 'grid gap-10 lg:grid-cols-[.35fr_.65fr] lg:items-start',
    split4555: 'grid gap-10 lg:grid-cols-[.45fr_.55fr] lg:items-start',
    split4753: 'grid gap-10 lg:grid-cols-[.47fr_.53fr] lg:items-start',
    split5446: 'grid gap-10 lg:grid-cols-[1.18fr_1fr] lg:items-start',
    split4654: 'grid gap-10 lg:grid-cols-[1fr_1.15fr] lg:items-start',
    dividerCols:
      'grid gap-10 lg:grid-cols-[1fr_1px_1fr] lg:items-start [&>hr]:hidden lg:[&>hr]:block lg:[&>hr]:h-full lg:[&>hr]:w-px lg:[&>hr]:bg-[var(--slot4-stroke-strong)] lg:[&>hr]:border-0',
    safeGrid: 'grid gap-6 md:grid-cols-2 xl:grid-cols-3',
    featureGrid: 'grid gap-10 lg:grid-cols-[.45fr_.55fr] lg:items-start',
    threeUp: 'grid gap-6 sm:grid-cols-2 lg:grid-cols-3',
    fourUp: 'grid gap-6 sm:grid-cols-2 lg:grid-cols-4',
    rail:
      'flex snap-x snap-mandatory gap-5 overflow-x-auto pb-6 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden',
    minRailCard: 'w-[280px] shrink-0 snap-start sm:w-[320px] lg:w-[360px]',
    numberedRow:
      'grid gap-6 border-t border-[var(--slot4-stroke-strong)] py-10 lg:grid-cols-[auto_.35fr_.65fr] lg:items-baseline',
  },
  type: {
    // Reference type scale, fluid via clamp
    eyebrow:
      'inline-flex items-center gap-2 rounded-full bg-[var(--slot4-panel-bg)] px-3 py-1 text-[13px] font-medium tracking-[0] text-[var(--slot4-page-text)]',
    heroTitle:
      'font-[var(--editable-font-display)] text-[clamp(2rem,5.4vw,4.125rem)] font-semibold leading-[1.05] tracking-[-0.03em]',
    display:
      'font-[var(--editable-font-display)] text-[clamp(2.5rem,7vw,5rem)] font-semibold leading-[1.02] tracking-[-0.035em]',
    sectionTitle:
      'font-[var(--editable-font-display)] text-[clamp(1.75rem,4vw,3.5rem)] font-semibold leading-[1.08] tracking-[-0.03em]',
    subheading:
      'font-[var(--editable-font-display)] text-[clamp(1.25rem,2.4vw,2.25rem)] font-medium leading-[1.15] tracking-[-0.016em]',
    body: 'text-[16px] leading-[1.5] text-[var(--slot4-muted-text)]',
    bodyLg: 'text-[17px] sm:text-[18px] leading-[1.55] text-[var(--slot4-muted-text)]',
    lead:
      'font-[var(--editable-font-display)] text-[clamp(1.125rem,1.8vw,1.5rem)] leading-[1.4] tracking-[-0.01em] text-[var(--slot4-page-text)]',
    label: 'text-[14px] leading-[1.2] font-medium text-[var(--slot4-page-text)]',
    caption: 'text-[13px] leading-[1.35] text-[var(--slot4-muted-text)]',
  },
  surface: {
    // Bordered flat on white — no shadows (reference confirmed no shadows).
    card:
      'rounded-[8px] border border-[color:var(--editable-border)] bg-[var(--slot4-surface-bg)]',
    soft:
      'rounded-[8px] border border-[color:var(--editable-border)] bg-[var(--slot4-panel-bg)]',
    dark:
      'rounded-[8px] bg-[var(--slot4-dark-bg)] text-[var(--slot4-dark-text)]',
    panel: 'bg-[var(--slot4-panel-bg)]',
    hairline: 'border-t border-[var(--slot4-stroke-strong)]',
  },
  button: {
    // Full pill (96px), dark ink on amber, sliding hover.
    primary:
      'group/btn relative inline-flex items-center justify-center gap-2 overflow-hidden rounded-full bg-[var(--slot4-accent-fill)] px-6 py-3 text-[14px] font-medium leading-none text-[var(--slot4-on-accent)] transition-[color,background-color,border-color] duration-300 hover:bg-white hover:text-[var(--slot4-page-text)] hover:ring-1 hover:ring-[var(--slot4-page-text)]/10',
    secondary:
      'inline-flex items-center justify-center gap-2 rounded-full border border-[color:var(--slot4-stroke-strong)] bg-transparent px-6 py-3 text-[14px] font-medium leading-none text-[var(--slot4-page-text)] transition-[color,background-color,border-color] duration-300 hover:bg-[var(--slot4-page-text)] hover:text-white',
    accent:
      'inline-flex items-center justify-center gap-2 rounded-full bg-[var(--slot4-accent-fill)] px-6 py-3 text-[14px] font-medium text-[var(--slot4-on-accent)] transition-colors duration-300 hover:bg-[var(--slot4-page-text)] hover:text-white',
    ghost:
      'inline-flex items-center gap-2 text-[14px] font-medium text-[var(--slot4-page-text)] underline-offset-4 decoration-transparent transition-[text-decoration-color,color] duration-300 hover:decoration-current',
    circle:
      'inline-flex h-10 w-10 items-center justify-center rounded-full bg-[var(--slot4-accent-fill)] text-[var(--slot4-on-accent)] transition-colors duration-300 hover:bg-[var(--slot4-page-text)] hover:text-white',
    // small utility 8px-corner variant
    utility:
      'inline-flex items-center justify-center gap-2 rounded-[8px] border border-[color:var(--editable-border)] bg-white px-4 py-2 text-[14px] font-medium text-[var(--slot4-page-text)] transition-colors duration-300 hover:border-[var(--slot4-page-text)]',
  },
  badge: {
    pill:
      'inline-flex items-center gap-2 rounded-full bg-[var(--slot4-panel-bg)] px-3 py-1 text-[13px] font-medium text-[var(--slot4-page-text)]',
    accentPill:
      'inline-flex items-center gap-2 rounded-full bg-[var(--slot4-accent-fill)] px-3 py-1 text-[13px] font-medium text-[var(--slot4-on-accent)]',
    darkPill:
      'inline-flex items-center gap-2 rounded-full bg-[var(--slot4-dark-bg)] px-3 py-1 text-[13px] font-medium text-white',
    metaChip:
      'inline-flex items-center gap-1.5 rounded-[6px] border border-[color:var(--editable-border)] bg-white px-2 py-1 text-[12px] font-medium text-[var(--slot4-muted-text)]',
  },
  media: {
    frame: `relative overflow-hidden rounded-[8px] ${editablePalette.mediaBg}`,
    frameFull: `relative overflow-hidden ${editablePalette.mediaBg}`,
    frameTall: `relative overflow-hidden rounded-[8px] ${editablePalette.mediaBg}`,
    ratio: 'aspect-[4/3]',
    ratioTall: 'aspect-[3/4]',
    ratioWide: 'aspect-[16/9]',
    ratioCinema: 'aspect-[21/9]',
  },
  motion: {
    lift: 'transition-colors duration-300',
    fade: 'transition-opacity duration-300',
    zoom:
      '[&_img]:transition-transform [&_img]:duration-[600ms] [&_img]:ease-[var(--ease-premium)] hover:[&_img]:scale-[1.04]',
    arrow: 'transition-transform duration-300 group-hover/btn:translate-x-1 group-hover:translate-x-1',
  },
} as const

export const aiLayoutRules = [
  'Palette + fonts live in editableRootStyle + editable-global.css — change them there first, everything else consumes CSS vars.',
  'Grid ratios shift per section — never default every section to 3-up equal columns; use split3565 / split4555 / split4753 / split5446 for asymmetry.',
  'Section eyebrow is a small ash-fill pill with an inline icon, never uppercase-tracked.',
  'Cards are flat, 8px radius, hairline-bordered on white; hover is color-only, no lift.',
  'CTAs are full pills (rounded-full). Utility buttons are 8px corner.',
  'Keep dynamic post fetching intact; do not replace posts with mock arrays.',
  'Use postHref() for all post links so task-specific routes keep working.',
  'Wrap section headers + grid items in <EditableReveal index={i} /> for the reveal stagger.',
] as const

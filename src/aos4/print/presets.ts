import type {
  PrintPageSpec,
  PrintPreset,
  PrintRoleStyle,
  PrintTagStyle,
  PrintTagTone,
  PrintTextRole,
} from './types'

export type PrintPageSize = 'a4' | 'letter'

const PAGE_SIZES: Record<PrintPageSize, { widthIn: number; heightIn: number }> = {
  a4: { widthIn: 8.2677, heightIn: 11.6929 },
  letter: { widthIn: 8.5, heightIn: 11 },
}

/** The masthead teal used by the app, reused for section rules and boxes. */
const ACCENT = [28, 117, 149] as const
/** $themeRoyalBlue, matching the on-screen note colour. */
const NOTE = [18, 55, 199] as const

const page = (size: PrintPageSize, margin: number, columns: number, gutterIn: number): PrintPageSpec => ({
  ...PAGE_SIZES[size],
  marginTopIn: margin,
  marginRightIn: margin,
  marginBottomIn: margin,
  marginLeftIn: margin,
  columns,
  gutterIn,
})

const standardRoles: Record<PrintTextRole, PrintRoleStyle> = {
  documentTitle: { sizePt: 17, leading: 1.25, weight: 'bold', align: 'center', spaceAfterIn: 0.04 },
  documentSubtitle: {
    sizePt: 11,
    leading: 1.25,
    weight: 'normal',
    align: 'center',
    color: ACCENT,
    spaceAfterIn: 0.16,
  },
  sectionHeading: {
    sizePt: 12,
    leading: 1.35,
    weight: 'bold',
    align: 'center',
    boxed: true,
    spaceBeforeIn: 0.16,
    spaceAfterIn: 0.1,
  },
  ruleTitle: { sizePt: 10, leading: 1.3, weight: 'bold', spaceBeforeIn: 0.1, spaceAfterIn: 0.02 },
  ruleTag: { sizePt: 6.5, leading: 1.5, weight: 'bold', spaceAfterIn: 0.03 },
  ruleBody: { sizePt: 9.5, leading: 1.28, weight: 'normal' },
  ruleNote: { sizePt: 9.5, leading: 1.28, weight: 'italic', color: NOTE, indentIn: 0.18 },
  summaryHeading: {
    sizePt: 12,
    leading: 1.35,
    weight: 'bold',
    align: 'center',
    spaceBeforeIn: 0.3,
    spaceAfterIn: 0.08,
  },
  summaryLine: { sizePt: 9.5, leading: 1.28, weight: 'normal' },
  footer: { sizePt: 9, leading: 1.3, weight: 'bold', align: 'center', spaceBeforeIn: 0.24 },
}

const compactRoles: Record<PrintTextRole, PrintRoleStyle> = {
  documentTitle: { sizePt: 13, leading: 1.2, weight: 'bold', align: 'center', spaceAfterIn: 0.03 },
  documentSubtitle: {
    sizePt: 8.5,
    leading: 1.2,
    weight: 'normal',
    align: 'center',
    color: ACCENT,
    spaceAfterIn: 0.12,
  },
  sectionHeading: {
    sizePt: 8.5,
    leading: 1.3,
    weight: 'bold',
    align: 'center',
    boxed: true,
    spaceBeforeIn: 0.1,
    spaceAfterIn: 0.06,
  },
  ruleTitle: { sizePt: 7.5, leading: 1.25, weight: 'bold', spaceBeforeIn: 0.07, spaceAfterIn: 0.015 },
  ruleTag: { sizePt: 5.5, leading: 1.5, weight: 'bold', spaceAfterIn: 0.02 },
  ruleBody: { sizePt: 7, leading: 1.24, weight: 'normal' },
  ruleNote: { sizePt: 7, leading: 1.24, weight: 'italic', color: NOTE, indentIn: 0.12 },
  summaryHeading: {
    sizePt: 8.5,
    leading: 1.3,
    weight: 'bold',
    align: 'center',
    spaceBeforeIn: 0.2,
    spaceAfterIn: 0.06,
  },
  summaryLine: { sizePt: 6.5, leading: 1.24, weight: 'normal' },
  footer: { sizePt: 7.5, leading: 1.3, weight: 'bold', align: 'center', spaceBeforeIn: 0.18 },
}

/**
 * Tag ink. No tone carries a fill: on a printed page a flood-filled box costs far more ink than the
 * tag is worth, so every tone is an outline. `drawTags` already strokes rather than fills whenever
 * `fill` is absent, which is how the usage tone has always rendered.
 *
 * The border takes the tone's own text colour. The previous light borders were tuned to edge a fill
 * behind them; standing alone on white at 0.005in they would all but disappear.
 */
const TAG_TONES: Record<PrintTagTone, PrintTagStyle> = {
  cost: { text: [53, 92, 100], border: [53, 92, 100] },
  'kind-active': { text: [12, 74, 96], border: [12, 74, 96] },
  'kind-reaction': { text: [121, 73, 13], border: [121, 73, 13] },
  'kind-passive': { text: [70, 88, 95], border: [70, 88, 95] },
  'turn-your': { text: [31, 83, 52], border: [31, 83, 52] },
  'turn-enemy': { text: [124, 53, 53], border: [124, 53, 53] },
  'turn-neutral': { text: [77, 90, 99], border: [77, 90, 99] },
  priority: { text: [121, 73, 13], border: [121, 73, 13] },
  usage: { text: [91, 107, 116], border: [91, 107, 116], dashed: true },
  source: { text: [84, 62, 122], border: [84, 62, 122] },
  // The quiet cousin of `source`: names a game-wide origin (core rules, season, battle traits)
  // rather than a pick, so it keeps the same family hue at a more muted ink.
  provenance: { text: [107, 96, 133], border: [107, 96, 133] },
  keyword: { text: [122, 46, 91], border: [122, 46, 91] },
}

export const STANDARD_PRESET: PrintPreset = {
  id: 'standard',
  label: 'Standard',
  description: 'Larger type, one column, more whitespace',
  page: page('a4', 0.6, 1, 0),
  roles: standardRoles,
  // 7.07in of measure leaves ample room beside the title.
  tagPlacement: 'title-right',
  tagTones: TAG_TONES,
  tagPaddingXIn: 0.045,
}

export const COMPACT_PRESET: PrintPreset = {
  id: 'compact',
  label: 'Compact',
  description: 'Smaller type, two columns, fewer pages',
  page: page('a4', 0.45, 2, 0.28),
  roles: compactRoles,
  // 3.54in per column is far too narrow to share a line with the title.
  tagPlacement: 'below-title',
  tagTones: TAG_TONES,
  tagPaddingXIn: 0.035,
}

export const PRINT_PRESETS = [STANDARD_PRESET, COMPACT_PRESET]

/**
 * Page size is a presentation choice, not a layout rewrite. Everything downstream reads inches from
 * `preset.page`, so swapping A4 for Letter needs no other change.
 */
export const withPageSize = (preset: PrintPreset, size: PrintPageSize): PrintPreset => ({
  ...preset,
  page: { ...preset.page, ...PAGE_SIZES[size] },
})

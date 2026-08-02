/**
 * Presentation-neutral print model.
 *
 * `PrintDocument` describes *what* to print. `PrintPreset` describes *how much space* each role
 * takes. Neither knows about jsPDF, the DOM, or React, so the PDF renderer and the browser print
 * view can share one source of truth. See docs/printing.md.
 */

export type PrintTextRole =
  | 'documentTitle'
  | 'documentSubtitle'
  | 'sectionHeading'
  | 'ruleTitle'
  | 'ruleTag'
  | 'ruleBody'
  | 'ruleNote'
  | 'summaryHeading'
  | 'summaryLine'
  | 'footer'

export interface PrintParagraph {
  role: Extract<PrintTextRole, 'ruleBody' | 'ruleNote'>
  /** Rendered as a bold run before the text, e.g. `Effect: `. */
  label?: string
  text: string
}

/** Names the facet, not a colour. `PrintPreset.tagTones` maps it to ink. */
export type PrintTagTone =
  | 'kind-active'
  | 'kind-reaction'
  | 'kind-passive'
  | 'source'
  | 'turn-your'
  | 'turn-enemy'
  | 'turn-neutral'
  | 'usage'
  | 'priority'

export interface PrintTag {
  label: string
  tone: PrintTagTone
}

export interface PrintTagStyle {
  fill?: readonly [number, number, number]
  text: readonly [number, number, number]
  border: readonly [number, number, number]
  /** Dashed borders mark the usage limit, which is a constraint rather than a classification. */
  dashed?: boolean
}

export interface PrintRule {
  id: string
  title: string
  tags?: PrintTag[]
  paragraphs: PrintParagraph[]
}

/** A tag with its box resolved to absolute inches by the layout. */
export interface PlacedTag extends PrintTag {
  xIn: number
  widthIn: number
}

export interface PrintSection {
  key: string
  heading: string
  rules: PrintRule[]
}

export interface PrintSummary {
  heading: string
  lines: string[]
}

export interface PrintDocument {
  title: string
  subtitle?: string
  sections: PrintSection[]
  summary?: PrintSummary
  footer: string[]
}

export type PrintFontWeight = 'normal' | 'bold' | 'italic'

export interface PrintRoleStyle {
  /** Font size in points. */
  sizePt: number
  /** Line advance as a multiple of `sizePt`. */
  leading: number
  weight: PrintFontWeight
  /** RGB 0-255. Defaults to black. */
  color?: readonly [number, number, number]
  /** Left inset from the column origin, in inches. */
  indentIn?: number
  spaceBeforeIn?: number
  spaceAfterIn?: number
  align?: 'left' | 'center'
  /** Draw a hairline box around the line, used for section headings. */
  boxed?: boolean
}

export interface PrintPageSpec {
  widthIn: number
  heightIn: number
  marginTopIn: number
  marginRightIn: number
  marginBottomIn: number
  marginLeftIn: number
  columns: number
  gutterIn: number
}

export interface PrintPreset {
  id: 'standard' | 'compact'
  label: string
  description: string
  page: PrintPageSpec
  roles: Record<PrintTextRole, PrintRoleStyle>
  /**
   * Where a rule's tags sit. `title-right` needs a wide measure to avoid colliding with the title;
   * `below-title` always fits. Declared per preset rather than derived from the column count, so a
   * future preset has to make the choice deliberately.
   */
  tagPlacement: 'title-right' | 'below-title'
  tagTones: Record<PrintTagTone, PrintTagStyle>
  /** Horizontal padding inside a tag box, in inches. */
  tagPaddingXIn: number
}

/**
 * Width of a string in inches, at the size and weight of the supplied role.
 *
 * This is the seam the old implementation lacked. Wrapping widths are always real inches here,
 * never inches-scaled-by-an-implicit-font-size.
 */
export interface PrintTextMeasurer {
  widthIn: (text: string, style: PrintRoleStyle) => number
}

export interface PlacedLine {
  /** Zero-based page index. */
  page: number
  /** Zero-based column index within the page. */
  column: number
  /** Left edge for left-aligned text, horizontal centre for centred text. */
  xIn: number
  /** Text baseline. */
  yIn: number
  widthIn: number
  heightIn: number
  role: PrintTextRole
  align: 'left' | 'center'
  boxed: boolean
  /** Drawn across the full text width rather than inside a single column. */
  spansColumns: boolean
  /** Bold run rendered before `text`, if any. Only ever set on the first line of a paragraph. */
  label?: string
  /** Tag boxes already resolved to absolute inches, so the renderer makes no layout decisions. */
  tags?: PlacedTag[]
  text: string
  /** Identifies the source block, so callers and tests can regroup wrapped lines. */
  blockId?: string
  /** Index of the paragraph within its rule, for lines produced from `PrintRule.paragraphs`. */
  paragraphIndex?: number
}

export interface PrintPlan {
  preset: PrintPreset
  pageCount: number
  columnWidthIn: number
  columnOriginsIn: number[]
  lines: PlacedLine[]
}

import type {
  PlacedLine,
  PlacedTag,
  PrintDocument,
  PrintPlan,
  PrintPreset,
  PrintRoleStyle,
  PrintRule,
  PrintTag,
  PrintTextMeasurer,
  PrintTextRole,
} from './types'

interface LineDraft {
  role: PrintTextRole
  text: string
  label?: string
  /** `xIn` is relative to the column origin here; `emit` resolves it to an absolute page position. */
  tags?: PlacedTag[]
  widthIn: number
  lineHeightIn: number
  spaceBeforeIn: number
  spaceAfterIn: number
  indentIn: number
  align: 'left' | 'center'
  boxed: boolean
  spansColumns: boolean
  blockId?: string
  paragraphIndex?: number
}

interface FlowBlock {
  id: string
  lines: LineDraft[]
  /** Reintroduced at the top of a new column when the block has to be split. */
  continuationTitle?: string
  continuationRole?: PrintTextRole
  sectionKey?: string
  isSectionHeading?: boolean
  /** Require the first line of the next block to share this column. */
  keepWithNext?: boolean
}

const lineHeightIn = (style: PrintRoleStyle) => (style.sizePt * style.leading) / 72

const advanceOf = (draft: LineDraft) => draft.spaceBeforeIn + draft.lineHeightIn + draft.spaceAfterIn

const heightOf = (drafts: LineDraft[]) => drafts.reduce((total, draft) => total + advanceOf(draft), 0)

/**
 * Greedy word wrap against a real inch budget. `firstLineOffsetIn` reserves room for a bold label
 * run that only the first line carries.
 */
const wrapText = (
  text: string,
  style: PrintRoleStyle,
  maxWidthIn: number,
  measurer: PrintTextMeasurer,
  firstLineOffsetIn = 0
): string[] => {
  if (!text) return ['']
  const words = text.split(' ')
  const lines: string[] = []
  let current = ''

  const budget = () => maxWidthIn - (lines.length === 0 ? firstLineOffsetIn : 0)

  const breakLongWord = (word: string): string[] => {
    const parts: string[] = []
    let chunk = ''
    for (const character of word) {
      const candidate = chunk + character
      if (chunk && measurer.widthIn(candidate, style) > maxWidthIn) {
        parts.push(chunk)
        chunk = character
      } else {
        chunk = candidate
      }
    }
    if (chunk) parts.push(chunk)
    return parts
  }

  words.forEach(word => {
    const candidate = current ? `${current} ${word}` : word
    if (!current || measurer.widthIn(candidate, style) <= budget()) {
      if (!current && measurer.widthIn(word, style) > budget()) {
        const parts = breakLongWord(word)
        parts.slice(0, -1).forEach(part => lines.push(part))
        current = parts[parts.length - 1] ?? ''
        return
      }
      current = candidate
      return
    }
    lines.push(current)
    if (measurer.widthIn(word, style) > budget()) {
      const parts = breakLongWord(word)
      parts.slice(0, -1).forEach(part => lines.push(part))
      current = parts[parts.length - 1] ?? ''
      return
    }
    current = word
  })

  if (current) lines.push(current)
  return lines.length ? lines : ['']
}

interface DraftContext {
  preset: PrintPreset
  measurer: PrintTextMeasurer
  columnWidthIn: number
  usableWidthIn: number
}

const draftLines = (
  context: DraftContext,
  role: PrintTextRole,
  text: string,
  options: {
    label?: string
    blockId?: string
    paragraphIndex?: number
    spansColumns?: boolean
  } = {}
): LineDraft[] => {
  const style = context.preset.roles[role]
  const spansColumns = options.spansColumns ?? false
  const available = (spansColumns ? context.usableWidthIn : context.columnWidthIn) - (style.indentIn ?? 0)
  const labelText = options.label ? `${options.label}: ` : ''
  const labelWidthIn = labelText ? context.measurer.widthIn(labelText, { ...style, weight: 'bold' }) : 0

  const wrapped = wrapText(text, style, available, context.measurer, labelWidthIn)

  return wrapped.map((value, index) => ({
    role,
    text: value,
    ...(index === 0 && options.label ? { label: options.label } : {}),
    widthIn: context.measurer.widthIn(value, style) + (index === 0 ? labelWidthIn : 0),
    lineHeightIn: lineHeightIn(style),
    spaceBeforeIn: index === 0 ? (style.spaceBeforeIn ?? 0) : 0,
    spaceAfterIn: index === wrapped.length - 1 ? (style.spaceAfterIn ?? 0) : 0,
    indentIn: style.indentIn ?? 0,
    align: style.align ?? 'left',
    boxed: style.boxed ?? false,
    spansColumns,
    ...(options.blockId ? { blockId: options.blockId } : {}),
    ...(options.paragraphIndex === undefined ? {} : { paragraphIndex: options.paragraphIndex }),
  }))
}

/** Box width for a tag: its text plus symmetric padding. */
const tagBoxWidthIn = (context: DraftContext, tag: PrintTag): number =>
  context.measurer.widthIn(tag.label, context.preset.roles.ruleTag) + context.preset.tagPaddingXIn * 2

const TAG_GAP_IN = 0.05

const totalTagWidthIn = (context: DraftContext, tags: PrintTag[]): number =>
  tags.reduce((total, tag) => total + tagBoxWidthIn(context, tag), 0) + TAG_GAP_IN * (tags.length - 1)

/** Lays tags left to right from `startXIn`, wrapping is the caller's problem. */
const placeTagsFrom = (context: DraftContext, tags: PrintTag[], startXIn: number): PlacedTag[] => {
  let cursor = startXIn
  return tags.map(tag => {
    const widthIn = tagBoxWidthIn(context, tag)
    const placed = { ...tag, xIn: cursor, widthIn }
    cursor += widthIn + TAG_GAP_IN
    return placed
  })
}

/**
 * The rule title, with its tags either sharing the title line (right-aligned) or occupying their
 * own line beneath it.
 *
 * `title-right` degrades to `below-title` whenever the title and tags would not fit on one line, so
 * a long ability name never collides with its tags. Tag x-offsets are relative to the column origin
 * and resolved to absolute inches during placement.
 */
const draftTitleWithTags = (context: DraftContext, rule: PrintRule, blockId: string): LineDraft[] => {
  const tags = rule.tags ?? []
  const titleDrafts = draftLines(context, 'ruleTitle', rule.title, { blockId })
  if (!tags.length) return titleDrafts

  const available = context.columnWidthIn
  const tagsWidthIn = totalTagWidthIn(context, tags)
  const lastTitleLine = titleDrafts[titleDrafts.length - 1]
  const fitsBeside =
    context.preset.tagPlacement === 'title-right' &&
    titleDrafts.length === 1 &&
    lastTitleLine.widthIn + TAG_GAP_IN * 2 + tagsWidthIn <= available

  if (fitsBeside) {
    return titleDrafts.map((draft, index) =>
      index === titleDrafts.length - 1
        ? { ...draft, tags: placeTagsFrom(context, tags, available - tagsWidthIn) }
        : draft
    )
  }

  const tagStyle = context.preset.roles.ruleTag
  return [
    ...titleDrafts,
    {
      role: 'ruleTag' as const,
      text: '',
      tags: placeTagsFrom(context, tags, 0),
      widthIn: Math.min(tagsWidthIn, available),
      lineHeightIn: lineHeightIn(tagStyle),
      spaceBeforeIn: 0,
      spaceAfterIn: tagStyle.spaceAfterIn ?? 0,
      indentIn: 0,
      align: 'left' as const,
      boxed: false,
      spansColumns: false,
      blockId,
    },
  ]
}

const buildBlocks = (document: PrintDocument, context: DraftContext): FlowBlock[] => {
  const blocks: FlowBlock[] = []

  document.sections.forEach(section => {
    blocks.push({
      id: `section:${section.key}`,
      lines: draftLines(context, 'sectionHeading', section.heading),
      sectionKey: section.key,
      isSectionHeading: true,
      keepWithNext: true,
    })

    section.rules.forEach(rule => {
      const blockId = `rule:${rule.id}`
      blocks.push({
        id: blockId,
        sectionKey: section.key,
        continuationTitle: `${rule.title} (continued)`,
        continuationRole: 'ruleTitle',
        lines: [
          ...draftTitleWithTags(context, rule, blockId),
          ...rule.paragraphs.flatMap((paragraph, paragraphIndex) =>
            draftLines(context, paragraph.role, paragraph.text, {
              ...(paragraph.label ? { label: paragraph.label } : {}),
              blockId,
              paragraphIndex,
            })
          ),
        ],
      })
    })
  })

  if (document.summary) {
    blocks.push({
      id: 'summary:heading',
      lines: draftLines(context, 'summaryHeading', document.summary.heading, {
        blockId: 'summary:heading',
      }),
      keepWithNext: true,
    })
    document.summary.lines.forEach((line, index) => {
      blocks.push({
        id: `summary:line:${index}`,
        lines: draftLines(context, 'summaryLine', line, { blockId: `summary:line:${index}` }),
      })
    })
  }

  blocks.push({
    id: 'footer',
    lines: document.footer.flatMap(line => draftLines(context, 'footer', line, { blockId: 'footer' })),
  })

  return blocks
}

/**
 * Flows the print model into positioned lines.
 *
 * Rules are atomic: a rule block moves to the next column or page rather than being split, which is
 * the behaviour players rely on at the table. A rule is only ever broken when it cannot fit in an
 * otherwise empty column, and the continuation is labelled.
 */
export const planPrintLayout = (
  document: PrintDocument,
  preset: PrintPreset,
  measurer: PrintTextMeasurer
): PrintPlan => {
  const { page } = preset
  const usableWidthIn = page.widthIn - page.marginLeftIn - page.marginRightIn
  const columnWidthIn = (usableWidthIn - page.gutterIn * (page.columns - 1)) / page.columns
  const columnOriginsIn = Array.from(
    { length: page.columns },
    (_, index) => page.marginLeftIn + index * (columnWidthIn + page.gutterIn)
  )

  const context: DraftContext = { preset, measurer, columnWidthIn, usableWidthIn }

  const bannerDrafts = [
    ...draftLines(context, 'documentTitle', document.title, { spansColumns: true }),
    ...(document.subtitle
      ? draftLines(context, 'documentSubtitle', document.subtitle, { spansColumns: true })
      : []),
  ]
  const bannerHeightIn = heightOf(bannerDrafts)

  const columnTopIn = (pageIndex: number) => page.marginTopIn + (pageIndex === 0 ? bannerHeightIn : 0)
  const pageBottomIn = page.heightIn - page.marginBottomIn

  const sectionHeadings = new Map(
    document.sections.map(section => [
      section.key,
      draftLines(context, 'sectionHeading', `${section.heading} (continued)`),
    ])
  )

  const blocks = buildBlocks(document, context)

  /**
   * `shortenedPage` lowers the column bottom for a single page. Column balancing uses it to squeeze
   * the trailing page until its columns even out.
   */
  const runFlow = (shortenedPage?: { page: number; bottomIn: number }) => {
    const lines: PlacedLine[] = []
    let pageIndex = 0
    let columnIndex = 0
    let cursorY = page.marginTopIn

    const bottomFor = (index: number) =>
      shortenedPage && shortenedPage.page === index ? shortenedPage.bottomIn : pageBottomIn

    const xFor = (draft: LineDraft) => {
      if (draft.spansColumns) {
        return draft.align === 'center' ? page.marginLeftIn + usableWidthIn / 2 : page.marginLeftIn
      }
      const origin = columnOriginsIn[columnIndex]
      return draft.align === 'center' ? origin + columnWidthIn / 2 : origin + draft.indentIn
    }

    const emit = (draft: LineDraft) => {
      cursorY += draft.spaceBeforeIn + draft.lineHeightIn
      lines.push({
        page: pageIndex,
        column: columnIndex,
        xIn: xFor(draft),
        yIn: cursorY,
        widthIn: draft.widthIn,
        heightIn: draft.spaceBeforeIn + draft.lineHeightIn,
        role: draft.role,
        align: draft.align,
        boxed: draft.boxed,
        spansColumns: draft.spansColumns,
        ...(draft.label ? { label: draft.label } : {}),
        ...(draft.tags
          ? {
              tags: draft.tags.map(tag => ({
                ...tag,
                xIn: columnOriginsIn[columnIndex] + tag.xIn,
              })),
            }
          : {}),
        text: draft.text,
        ...(draft.blockId ? { blockId: draft.blockId } : {}),
        ...(draft.paragraphIndex === undefined ? {} : { paragraphIndex: draft.paragraphIndex }),
      })
      cursorY += draft.spaceAfterIn
    }

    bannerDrafts.forEach(emit)
    cursorY = columnTopIn(0)

    const advanceColumn = () => {
      if (columnIndex + 1 < page.columns) {
        columnIndex += 1
      } else {
        pageIndex += 1
        columnIndex = 0
      }
      cursorY = columnTopIn(pageIndex)
    }

    const remainingIn = () => bottomFor(pageIndex) - cursorY
    const fullColumnIn = () => bottomFor(pageIndex) - columnTopIn(pageIndex)

    const reintroduceSection = (block: FlowBlock) => {
      if (!block.sectionKey || block.isSectionHeading) return
      sectionHeadings.get(block.sectionKey)?.forEach(emit)
    }

    blocks.forEach((block, index) => {
      const blockHeightIn = heightOf(block.lines)
      const next = blocks[index + 1]
      const keepWithNextIn = block.keepWithNext && next ? advanceOf(next.lines[0]) : 0
      const continuationHeadingIn =
        block.sectionKey && !block.isSectionHeading
          ? heightOf(sectionHeadings.get(block.sectionKey) ?? [])
          : 0

      if (blockHeightIn + keepWithNextIn <= remainingIn()) {
        block.lines.forEach(emit)
        return
      }

      if (blockHeightIn + keepWithNextIn + continuationHeadingIn <= fullColumnIn()) {
        advanceColumn()
        reintroduceSection(block)
        block.lines.forEach(emit)
        return
      }

      // Genuinely taller than an empty column. Split it, labelling every continuation.
      block.lines.forEach(draft => {
        if (advanceOf(draft) > remainingIn()) {
          advanceColumn()
          reintroduceSection(block)
          if (block.continuationTitle && block.continuationRole) {
            draftLines(context, block.continuationRole, block.continuationTitle, {
              ...(block.id.startsWith('rule:') ? { blockId: block.id } : {}),
            }).forEach(emit)
          }
        }
        emit(draft)
      })
    })

    return { lines, pageCount: pageIndex + 1 }
  }

  const splitBlockCount = (lines: PlacedLine[]) => {
    const seen = new Map<string, Set<string>>()
    lines.forEach(line => {
      if (!line.blockId) return
      const places = seen.get(line.blockId) ?? new Set<string>()
      places.add(`${line.page}/${line.column}`)
      seen.set(line.blockId, places)
    })
    return Array.from(seen.values()).filter(places => places.size > 1).length
  }

  /**
   * Balances the trailing page's columns.
   *
   * A full page balances itself — every column is packed. Only the last page can end up with one
   * long column beside an empty one, which is what the old implementation's half-height heuristic
   * was trying to avoid. Binary search the shortest column that still fits the same pages without
   * breaking any additional rule.
   */
  const balanceLastPage = (baseline: ReturnType<typeof runFlow>) => {
    if (page.columns < 2) return baseline

    const lastPage = baseline.pageCount - 1
    const columnLines = baseline.lines.filter(line => line.page === lastPage && !line.spansColumns)
    if (!columnLines.length) return baseline

    const top = columnTopIn(lastPage)
    const bottoms = new Map<number, number>()
    columnLines.forEach(line => {
      bottoms.set(line.column, Math.max(bottoms.get(line.column) ?? top, line.yIn))
    })
    if (bottoms.size >= page.columns) return baseline

    const contentIn = Array.from(bottoms.values()).reduce((total, bottom) => total + (bottom - top), 0)
    const baselineSplits = splitBlockCount(baseline.lines)

    let low = contentIn / page.columns
    let high = pageBottomIn - top
    let best = baseline

    for (let attempt = 0; attempt < 12; attempt += 1) {
      const middle = (low + high) / 2
      const candidate = runFlow({ page: lastPage, bottomIn: top + middle })
      if (candidate.pageCount === baseline.pageCount && splitBlockCount(candidate.lines) <= baselineSplits) {
        best = candidate
        high = middle
      } else {
        low = middle
      }
    }

    return best
  }

  const flowed = balanceLastPage(runFlow())

  return {
    preset,
    pageCount: flowed.pageCount,
    columnWidthIn,
    columnOriginsIn,
    lines: flowed.lines,
  }
}

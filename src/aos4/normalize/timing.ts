import type {
  AbilityActor,
  AbilityKind,
  AbilityTiming,
  GameWindow,
  TimingPerspective,
  TurnPhaseId,
  UsagePeriod,
  UsageScope,
} from '../domain'
import type { NormalizationDiagnostic } from './diagnostics'
import { normalizeSourceText } from './text'

export interface TimingParseOptions {
  abilityKind: AbilityKind
  actor: AbilityActor
}

export interface TimingParseResult {
  timings: AbilityTiming[]
  diagnostics: NormalizationDiagnostic[]
}

const PHASE_PATTERNS: Array<[TurnPhaseId, RegExp]> = [
  ['start-of-turn', /\bstart of (?:(?:your|the enemy|enemy|any|the) )?turn(?: phase)?\b/i],
  ['hero', /\bhero phase\b/i],
  ['movement', /\bmovement phase\b/i],
  ['shooting', /\bshooting phase\b/i],
  ['charge', /\bcharge phase\b/i],
  ['combat', /\bcombat phase\b/i],
  ['end-of-turn', /\bend of (?:(?:your|the enemy|enemy|any|the) )?turn(?: phase)?\b/i],
]

const PERSPECTIVE_WINDOW_PATTERN =
  'deployment(?: phase)?|start of (?:the )?(?:(?:first|second|third|fourth|fifth|\\d+(?:st|nd|rd|th)?) )?battle(?: round)?|' +
  'end of (?:the )?(?:(?:first|second|third|fourth|fifth|final|\\d+(?:st|nd|rd|th)?) )?battle(?: round)?|' +
  'start of (?:the )?turn(?: phase)?|hero phase|movement phase|shooting phase|charge phase|' +
  'combat phase|end of (?:the )?turn(?: phase)?'

const PERSPECTIVE_PATTERNS: Array<[RegExp, TimingPerspective]> = [
  [
    new RegExp(
      `(?:\\byour\\b(?=[^.!;\\n]{0,40}(?:${PERSPECTIVE_WINDOW_PATTERN}))|` +
        `\\b(?:start|end) of your turn\\b)`,
      'i'
    ),
    'your',
  ],
  [
    new RegExp(
      `(?:\\benemy\\b(?=[^.!;\\n]{0,40}(?:${PERSPECTIVE_WINDOW_PATTERN}))|` +
        `\\b(?:start|end) of (?:the )?enemy turn\\b)`,
      'i'
    ),
    'enemy',
  ],
  [
    new RegExp(
      `(?:\\bany\\b(?=[^.!;\\n]{0,40}(?:${PERSPECTIVE_WINDOW_PATTERN}))|` +
        `\\b(?:start|end) of any turn\\b)`,
      'i'
    ),
    'any',
  ],
]

const USAGE_PERIODS: Record<string, UsagePeriod> = {
  phase: 'phase',
  turn: 'turn',
  'battle round': 'battle-round',
  battle: 'battle',
}

const usageScopeFromActor = (actor: AbilityActor): UsageScope => {
  if (actor === 'army') return 'army'
  if (actor === 'player') return 'player'
  return 'unit'
}

const BATTLE_ROUND_VALUES: Record<string, number> = {
  first: 1,
  second: 2,
  third: 3,
  fourth: 4,
  fifth: 5,
}

const battleRoundWindow = (
  value: string,
  boundary: 'start' | 'end'
): Extract<GameWindow, { kind: 'battle-round-start' | 'battle-round-end' }> | undefined => {
  const match = value.match(
    new RegExp(
      `\\b${boundary} of (?:the )?(?:(first|second|third|fourth|fifth|final|\\d+(?:st|nd|rd|th)?) )?battle round\\b`,
      'i'
    )
  )
  if (!match) return undefined

  const rawRound = match[1]?.toLowerCase()
  const round =
    rawRound && rawRound !== 'final'
      ? (BATTLE_ROUND_VALUES[rawRound] ?? Number.parseInt(rawRound, 10))
      : undefined
  return {
    kind: boundary === 'start' ? 'battle-round-start' : 'battle-round-end',
    ...(round === undefined ? {} : { round }),
  }
}

const findPerspective = (value: string, diagnostics: NormalizationDiagnostic[]): TimingPerspective => {
  const perspectives = PERSPECTIVE_PATTERNS.filter(([pattern]) => pattern.test(value)).map(
    ([, perspective]) => perspective
  )

  if (perspectives.length > 1) {
    diagnostics.push({
      code: 'conflicting-perspective',
      severity: 'error',
      message: `Timing text contains multiple perspectives: ${perspectives.join(', ')}`,
    })
    return 'neutral'
  }

  return perspectives[0] ?? 'neutral'
}

const findWindows = (value: string, abilityKind: AbilityKind): GameWindow[] => {
  if (abilityKind === 'passive' || /\bpassive\b/i.test(value)) return [{ kind: 'always' }]

  const windows: GameWindow[] = []
  if (/\bdeployment(?: phase)?\b/i.test(value)) windows.push({ kind: 'deployment' })
  const roundStart = battleRoundWindow(value, 'start')
  const roundEnd = battleRoundWindow(value, 'end')
  if (roundStart) windows.push(roundStart)
  if (roundEnd) windows.push(roundEnd)
  if (/\bstart of (?:the )?battle(?! round|\s+(?:first|second|third|fourth|fifth|\d))\b/i.test(value)) {
    windows.push({ kind: 'battle-start' })
  }
  if (/\bend of (?:the )?battle(?! round|\s+(?:first|second|third|fourth|fifth|\d))\b/i.test(value)) {
    windows.push({ kind: 'battle-end' })
  }

  PHASE_PATTERNS.forEach(([phase, pattern]) => {
    if (pattern.test(value)) windows.push({ kind: 'turn-phase', phase })
  })
  if (abilityKind === 'reaction' && /\breaction\s*:/i.test(value) && windows.length === 0) {
    windows.push({ kind: 'reaction' })
  }

  return windows
}

const findUsage = (value: string, actor: AbilityActor): AbilityTiming['usage'] | undefined => {
  const match = value.match(/\bonce per (battle round|phase|turn|battle)\b/i)
  if (!match) return undefined

  return {
    limit: 1,
    period: USAGE_PERIODS[match[1].toLowerCase()],
    scope: /\(\s*army\s*\)/i.test(value) ? 'army' : usageScopeFromActor(actor),
  }
}

export const parseTiming = (source: string, options: TimingParseOptions): TimingParseResult => {
  const normalized = normalizeSourceText(source)
  const diagnostics = [...normalized.diagnostics]
  const parsingText = normalized.text.replace(/%[A-Za-z0-9_-]+/g, ' ')
  const windows = findWindows(parsingText, options.abilityKind)
  const usage = findUsage(parsingText, options.actor)
  let window: GameWindow

  if (windows.length === 0 && options.abilityKind === 'active' && usage) {
    window = { kind: 'phase-independent' }
  } else if (windows.length === 0) {
    window = { kind: 'unknown' }
    diagnostics.push({
      code: 'unknown-timing',
      severity: 'error',
      message: `Could not classify timing text: ${normalized.text || '(empty)'}`,
    })
  } else if (windows.length > 1) {
    window = { kind: 'unknown' }
    diagnostics.push({
      code: 'conflicting-window',
      severity: 'error',
      message: `Timing text contains more than one game window: ${normalized.text}`,
    })
  } else {
    window = windows[0]
  }

  const timing: AbilityTiming = {
    kind: options.abilityKind,
    window,
    perspective: findPerspective(parsingText, diagnostics),
    raw: normalized.text,
  }

  if (/\bstrike[\s-]*first\b/i.test(parsingText)) timing.priority = 'strike-first'
  if (/\bstrike[\s-]*last\b/i.test(parsingText)) timing.priority = 'strike-last'

  if (usage) timing.usage = usage

  return {
    timings: [timing],
    diagnostics,
  }
}

import { isTurnPhaseId, type TurnPhaseId } from '../domain/game'

export type PrintRgb = readonly [number, number, number]

/**
 * PDF-only phase colours (#2052). Each value is the fill of the timing bar Games Workshop prints at
 * the top of an ability, read from the vector artwork of the official Core Rules (April 2025) and
 * the Faction Packs: the most common fill behind each "<Your|Enemy|Any> <Phase> Phase" bar.
 *
 * Only the seven turn phases are listed because only they are coloured consistently in the source.
 * Passive and reaction bars take different colours from context, so those sections keep the teal
 * accent rather than borrow a guessed colour. The website does not use these: its phase headers
 * stay Signal Teal (DESIGN.md).
 */
export const PRINT_PHASE_ACCENTS: Record<TurnPhaseId, PrintRgb> = {
  'start-of-turn': [35, 31, 32], // #231f20
  hero: [168, 141, 48], // #a88d30
  movement: [128, 130, 133], // #808285
  shooting: [0, 82, 109], // #00526d
  charge: [202, 103, 34], // #ca6722
  combat: [139, 0, 24], // #8b0018
  'end-of-turn': [93, 54, 125], // #5d367d
}

const TURN_PHASE_KEY_PREFIX = 'turn-phase:'

/**
 * The official phase colour for a print section, or undefined when the section is not a turn phase.
 * Section keys come from `gameWindowKey`, so a turn-phase section is keyed `turn-phase:<phase>`.
 */
export const phaseAccentFor = (sectionKey: string | undefined): PrintRgb | undefined => {
  if (!sectionKey?.startsWith(TURN_PHASE_KEY_PREFIX)) return undefined
  const phase = sectionKey.slice(TURN_PHASE_KEY_PREFIX.length)
  return isTurnPhaseId(phase) ? PRINT_PHASE_ACCENTS[phase] : undefined
}

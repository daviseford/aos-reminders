import type { Aos4Catalog, RulesContext } from '../domain'
import { createAos4ArmyDocument, type Aos4ArmyDocument } from './armyDocument'

/*
 * The seasonal rules switch (issue #1994) moves an army between exactly two contexts: the
 * standard-mode seasonal context (the sitting General's Handbook, today's default) and the
 * standard-mode current context (battletome plus core rules only). Both are found by status and
 * mode — never by name or season string — so the switch survives the next handbook without an
 * edit. Spearhead, Legends, and historical contexts are deliberately outside its vocabulary, and
 * the `allowsLegends`/`allowsHistorical` overlays are orthogonal document state it never touches.
 */

export interface Aos4SeasonalRulesContexts {
  seasonal?: RulesContext
  current?: RulesContext
}

export const findAos4SeasonalRulesContexts = (catalog: Aos4Catalog): Aos4SeasonalRulesContexts => {
  const standard = catalog.rulesContexts.filter(context => context.mode === 'standard')
  return {
    seasonal: standard.find(context => context.status === 'seasonal'),
    current: standard.find(context => context.status === 'current'),
  }
}

/**
 * What the switch may honestly say about a document:
 *
 * - `'on'` — the document lives in the seasonal standard context.
 * - `'off'` — the document lives in the current standard context.
 * - `'unavailable'` — the document lives somewhere else (Spearhead, a Legends-moved import, a
 *   historical season, or a context the catalog no longer carries). The switch does not speak for
 *   those contexts, and a checked state either way would lie.
 */
export type Aos4SeasonalRulesState = 'on' | 'off' | 'unavailable'

export const getAos4SeasonalRulesState = (
  catalog: Aos4Catalog,
  document: Aos4ArmyDocument
): Aos4SeasonalRulesState => {
  const { seasonal, current } = findAos4SeasonalRulesContexts(catalog)
  if (seasonal && document.rulesContextId === seasonal.id) return 'on'
  if (current && document.rulesContextId === current.id) return 'off'
  return 'unavailable'
}

/**
 * Moves the document to the seasonal (`enabled`) or current standard context. Non-destructive by
 * construction: only `rulesContextId` moves, so a season-exclusive selection held while the rules
 * are off stays in `explicitSelectionIds` — selection resolution reports it as
 * `inapplicable-explicit-selection` and keeps the rest of the army alive — and comes back to life
 * when the season is switched on again.
 *
 * Returns the same instance when there is nothing to do: the document already sits in the target
 * context, the catalog does not carry it, or the document lives outside the two standard contexts
 * (the switch never shows there; see `getAos4SeasonalRulesState`).
 */
export const setAos4SeasonalRules = (
  catalog: Aos4Catalog,
  document: Aos4ArmyDocument,
  enabled: boolean
): Aos4ArmyDocument => {
  if (getAos4SeasonalRulesState(catalog, document) === 'unavailable') return document
  const { seasonal, current } = findAos4SeasonalRulesContexts(catalog)
  const target = enabled ? seasonal : current
  if (!target || document.rulesContextId === target.id) return document
  return createAos4ArmyDocument({ ...document, rulesContextId: target.id })
}

import type { RulesContext } from '../domain'

/**
 * The accuracy caveat every surface that offers or shows a past season carries (#2042).
 *
 * A past season pairs its own battlepack (the Scourge of Ghyran variants, battle formations, and
 * handbook rules) with today's warscrolls, points, and battletome rules, because no accepted
 * source records those as they stood during the season. The wording says exactly that and never
 * dates "today": the values move with every accepted corpus refresh.
 */
export const pastSeasonCaveat = (context: Pick<RulesContext, 'status' | 'season'>): string | undefined => {
  if (context.status !== 'past-season') return undefined
  const season = context.season ? `the ${context.season} season` : 'that season'
  return (
    `A past season. Its battlepack rules are used with current warscrolls, points, unit sizes, and ` +
    `battletome rules, not the versions in use during ${season}.`
  )
}

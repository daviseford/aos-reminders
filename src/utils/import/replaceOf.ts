import { SUPPORTED_FACTIONS } from 'meta/factions'
import { titleCase } from 'utils/textUtils'

/**
 * Accepts an UPPERCASED value and looks for a faction in the name
 * e.g. Demon Prince of Slaanesh -> Demon Prince
 * @param val
 */
export const replaceOf = (val: string) => {
  const factions = SUPPORTED_FACTIONS.map(titleCase).map(x => x.toUpperCase())
  const faction = factions.find(x => val.includes(` OF ${x}`))
  if (faction) val = val.replace(` OF ${faction}`, ``)
  return val
}

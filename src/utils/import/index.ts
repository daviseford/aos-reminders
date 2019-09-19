import { difference } from 'lodash'
import { isValidFactionName } from 'utils/armyUtils'
import { logFailedImport } from 'utils/analytics'
import { getArmy } from 'utils/getArmy/getArmy'
import { isDev } from 'utils/env'
import { getAllyData } from 'utils/import/allyData'
import { parserOptions } from 'utils/import/options'
import { createFatalError, getAllWarnings, hasFatalError } from 'utils/import/warnings'
import { importSelectionLookup } from 'utils/import/selectionLookup'
import { checkErrorsForAllegianceAbilities } from 'utils/import/checkErrors'
import { IArmy } from 'types/army'
import { TImportParsers, IImportedArmy } from 'types/import'

export const importErrorChecker = (army: IImportedArmy, parser: TImportParsers): IImportedArmy => {
  const opts = parserOptions[parser]

  let { errors, factionName, selections, unknownSelections, allyUnits } = army

  // If we've already gotten an error, go ahead and bail out
  if (hasFatalError(errors)) return army

  // If we're missing a faction name, we won't be able to do much with this
  if (!isValidFactionName(factionName)) {
    logFailedImport(`faction:${factionName || 'Unknown'}`, parser)
    const errorTxt = !!factionName ? `${factionName} are not supported.` : opts.fileReadError
    return {
      ...army,
      errors: [createFatalError(errorTxt)],
    }
  }

  const foundSelections: string[] = []

  const Army = getArmy(factionName) as IArmy
  const lookup = importSelectionLookup(
    Army,
    selections,
    errors,
    unknownSelections,
    foundSelections,
    opts.checkPoorSpacing,
    opts.typoMap
  )

  const errorFreeSelections = {
    allegiances: lookup('allegiances'),
    artifacts: lookup('artifacts'),
    battalions: lookup('battalions'),
    endless_spells: lookup('endless_spells'),
    spells: lookup('spells'),
    traits: lookup('traits'),
    units: lookup('units'),
  }

  const couldNotFind = difference(unknownSelections, foundSelections)
  if (couldNotFind.length > 0 && isDev) console.log('Could not find: ', couldNotFind)

  const allyData = getAllyData(allyUnits, factionName, errors, opts.checkPoorSpacing, opts.typoMap)

  // Check for allegiance abilities and remove them from errors if we find them
  checkErrorsForAllegianceAbilities(Army, errorFreeSelections.allegiances, errors)

  // Fire off any warnings to Google Analytics
  getAllWarnings(errors).forEach(e => logFailedImport(e.text, parser))

  return {
    ...army,
    errors,
    unknownSelections: couldNotFind,
    selections: {
      ...selections,
      ...errorFreeSelections,
    },
    ...allyData,
  }
}

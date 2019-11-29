import { difference } from 'lodash'
import { isValidFactionName } from 'utils/armyUtils'
import { logFailedImport } from 'utils/analytics'
import { getArmy } from 'utils/getArmy/getArmy'
import { isDev } from 'utils/env'
import { getAllyData } from 'utils/import/allyData'
import { parserOptions } from 'utils/import/options'
import { createFatalError, hasFatalError, getAllyWarnings, getWarnings } from 'utils/import/warnings'
import { importSelectionLookup } from 'utils/import/selectionLookup'
import { checkErrorsForAllegianceAbilities } from 'utils/import/checkErrors'
import { addAmbiguousSelectionErrors } from 'utils/import/ambiguousSelections'
import { TSupportedFaction } from 'meta/factions'
import { IArmy } from 'types/army'
import { TImportParsers, IImportedArmy, TImportError } from 'types/import'
import { TAllySelectionStore } from 'types/store'

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

  // Check if any of the selections have names that map one-to-many from source to us
  addAmbiguousSelectionErrors(errors, errorFreeSelections, allyData, opts.ambiguousNamesMap)

  // Remove errors where we have found the missing item
  errors = removeFoundErrors(errors, errorFreeSelections, allyData)

  // Fire off any warnings to Google Analytics
  getWarnings(errors).forEach(e => logFailedImport(e.text, parser))

  const mergedSelections = {
    ...selections,
    ...errorFreeSelections,
  }

  return {
    ...army,
    errors,
    unknownSelections: couldNotFind,
    selections: mergedSelections,
    ...allyData,
  }
}

type TRemoveFoundErrors = (
  errors: TImportError[],
  selections: { [key: string]: string[] },
  allyData: { allyFactionNames: TSupportedFaction[]; allySelections: TAllySelectionStore }
) => TImportError[]

const removeFoundErrors: TRemoveFoundErrors = (errors, selections, allyData) => {
  const foundAllies = Object.values(allyData.allySelections)
    .map(x => (x ? x.units : []))
    .flat()

  const found = Object.values(selections)
    .concat(foundAllies)
    .flat()

  const filteredErrors = errors
    .filter(e => !found.some(f => f === e.text))
    .filter(e => !found.some(f => f.startsWith(e.text)))

  const allyErrors = getAllyWarnings(errors)

  // Filter out duplicative ally/normal warnings
  return filteredErrors.reduce((a, error) => {
    if (error.severity === 'warn' && allyErrors.some(a => a.text.startsWith(`Allied ${error.text} `))) {
      return a
    }
    a.push(error)
    return a
  }, [] as TImportError[])
}

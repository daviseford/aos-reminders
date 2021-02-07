import { difference } from 'lodash'
import { TSupportedFaction } from 'meta/factions'
import { IArmy } from 'types/army'
import { IImportedArmy, TImportError, TImportParsers } from 'types/import'
import { IAllySelections, TSelectionTypes } from 'types/selections'
import { TAllySelectionStore } from 'types/store'
import { logDeprecatedImport, logFailedImport } from 'utils/analytics'
import { isValidFactionName } from 'utils/armyUtils'
import { isDev } from 'utils/env'
import { getArmy } from 'utils/getArmy/getArmy'
import { addSideEffectsToImport } from 'utils/import/addSideEffectsToImport'
import { getAllyData } from 'utils/import/allyData'
import { addAmbiguousSelectionErrors } from 'utils/import/ambiguousSelections'
import { checkErrorsForAllegianceAbilities, checkErrorsForDeprecations } from 'utils/import/checkErrors'
import { DeprecatedSelections, ignoredUnknownSelections, parserOptions } from 'utils/import/options'
import { removeSideEffectsFromImport } from 'utils/import/removeSideEffectsFromImport'
import { importSelectionLookup } from 'utils/import/selectionLookup'
import {
  createDeprecationWarning,
  createFatalError,
  getAllyWarnings,
  getWarnings,
  hasFatalError,
} from 'utils/import/warnings'

export const importErrorChecker = (army: IImportedArmy, parser: TImportParsers): IImportedArmy => {
  const opts = parserOptions[parser]

  let { errors, factionName, subFactionName, selections, unknownSelections, allyUnits } = army

  // If we've already gotten an error, go ahead and bail out
  if (hasFatalError(errors)) return army

  // If we're missing a faction name, we won't be able to do much with this
  if (!isValidFactionName(factionName)) {
    const deprecation = DeprecatedSelections[factionName]
    const logFn = !!deprecation ? logDeprecatedImport : logFailedImport
    logFn(`faction:${factionName || 'Unknown'}`, parser)
    const errorTxt = !!factionName ? `${factionName} are not supported.` : opts.fileReadError
    const error = !!deprecation
      ? createDeprecationWarning(factionName, deprecation)
      : createFatalError(errorTxt)
    return {
      ...army,
      errors: [error],
    }
  }

  unknownSelections = unknownSelections.filter(x => !ignoredUnknownSelections.includes(x))

  const foundSelections: string[] = []

  const Army = getArmy(factionName, subFactionName) as IArmy

  const lookup = importSelectionLookup(
    Army,
    selections,
    errors,
    unknownSelections,
    foundSelections,
    opts.checkPoorSpacing,
    opts.typoMap
  )

  const errorFreeSelections: Record<TSelectionTypes, string[]> = {
    artifacts: lookup('artifacts'),
    battalions: lookup('battalions'),
    command_abilities: lookup('command_abilities'),
    command_traits: lookup('command_traits'),
    endless_spells: lookup('endless_spells'),
    flavors: lookup('flavors'),
    mount_traits: lookup('mount_traits'),
    prayers: lookup('prayers'),
    scenery: lookup('scenery'),
    spells: lookup('spells'),
    triumphs: lookup('triumphs'),
    units: lookup('units'),
  }

  const couldNotFind = difference(unknownSelections, foundSelections)
  if (couldNotFind.length > 0 && isDev) console.log('Could not find: ', couldNotFind)

  const allyData = getAllyData(allyUnits, factionName, errors, opts.checkPoorSpacing, opts.typoMap)

  // Check for allegiance abilities and remove them from errors if we find them
  checkErrorsForAllegianceAbilities(Army, errorFreeSelections.flavors, errors)

  // Check for deprecated selections and replace the warning if we find them
  checkErrorsForDeprecations(errors)

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

  // Remove explicitly-included selections that are actually side-effects, then add relevant side-effects
  const selectionsWithoutSideEffects = removeSideEffectsFromImport(mergedSelections, Army, parser)
  const selectionsWithSideEffects = addSideEffectsToImport(selectionsWithoutSideEffects, Army)

  return {
    ...army,
    errors,
    unknownSelections: couldNotFind,
    selections: selectionsWithSideEffects,
    ...allyData,
  }
}

type TRemoveFoundErrors = (
  errors: TImportError[],
  selections: Record<string, string[]>,
  allyData: { allyFactionNames: TSupportedFaction[]; allySelections: TAllySelectionStore }
) => TImportError[]

const removeFoundErrors: TRemoveFoundErrors = (errors, selections, allyData) => {
  const foundAllies = (Object.values(allyData.allySelections) as IAllySelections[])
    .map(x => [...x.units, ...x.battalions])
    .flat()

  const found = Object.values(selections).concat(foundAllies).flat()

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

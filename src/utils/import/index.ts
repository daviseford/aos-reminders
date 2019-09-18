import { uniq, difference } from 'lodash'
import { getNameMap, createError } from 'utils/warscroll/warscrollUtils'
import { warscrollTypoMap } from 'utils/warscroll/options'
import { IArmy } from 'types/army'
import { ISelections } from 'types/selections'
import { TImportError, TImportParsers, IImportedArmy } from 'types/import'
import { checkImportSelection, isPoorlySpacedMatch } from 'utils/azyr/azyrUtils'
import { isValidFactionName } from 'utils/armyUtils'
import { logFailedImport } from 'utils/analytics'
import { getArmy } from 'utils/getArmy/getArmy'
import { isDev } from 'utils/env'
import { getAllyData } from 'utils/warscroll/allyData'

export const importErrorChecker = (army: IImportedArmy, parser: TImportParsers): IImportedArmy => {
  const checkPoorSpacing = {
    'Warscroll Builder': false,
    Azyr: true,
    Battlescribe: false,
  }[parser]

  let { errors, factionName, selections, unknownSelections, allyUnits } = army

  // If we've already gotten an error, go ahead and bail out
  if (errors.some(({ severity }) => severity === 'error')) return army

  // If we're missing a faction name, we won't be able to do much with this
  if (!isValidFactionName(factionName)) {
    logFailedImport(`faction:${factionName || 'Unknown'}`, parser)
    const errorTxt = !!factionName
      ? `${factionName} are not supported.`
      : `There was a problem reading this file.`
    return {
      ...army,
      errors: [createError(errorTxt)],
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
    checkPoorSpacing
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

  const allyData = getAllyData(allyUnits, factionName, errors)

  // Fire off any warnings to Google Analytics
  errors
    .filter(e => e.severity === 'warn' || e.severity === 'ally-warn')
    .forEach(e => logFailedImport(e.text, parser))

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

type TLookupType =
  | 'allegiances'
  | 'artifacts'
  | 'battalions'
  | 'endless_spells'
  | 'spells'
  | 'traits'
  | 'units'

export const importSelectionLookup = (
  Army: IArmy,
  selections: ISelections,
  errors: TImportError[],
  unknownSelections: string[],
  foundSelections: string[],
  checkPoorSpacing: boolean
) => (type: TLookupType): string[] => {
  const lookup = {
    allegiances: 'Allegiances',
    artifacts: 'Artifacts',
    battalions: 'Battalions',
    endless_spells: 'EndlessSpells',
    spells: 'Spells',
    traits: 'Traits',
    units: 'Units',
  }

  const Names: string[] = Army[lookup[type]].map(({ name }) => name)
  const NameMap = getNameMap(Names)
  const checkVal = checkImportSelection(Names, NameMap, errors, true, checkPoorSpacing)

  const errorFree = selections[type].map(checkVal).filter(x => !!x)

  const found = unknownSelections
    .map(val => {
      const orig = `${val}`

      // Check for typos
      if (warscrollTypoMap[val]) val = warscrollTypoMap[val]

      if (NameMap[val]) {
        foundSelections.push(orig)
        return val
      }

      // See if we have something like it...
      const valUpper = val.toUpperCase()
      const match = Names.find(x => x.toUpperCase().includes(valUpper))
      if (match) {
        foundSelections.push(orig)
        return match
      }

      // Sometimes parentheses get in our way
      const valNoParens = valUpper.replace(/\(.+\)/g, '').trim()
      const match2 = Names.find(x =>
        x
          .toUpperCase()
          .replace(/\(.+\)/g, '')
          .includes(valNoParens)
      )
      if (match2) {
        foundSelections.push(orig)
        return match2
      }

      // Last chance - check for bad spacing
      const match3 = Names.find(x => isPoorlySpacedMatch(val, x))
      if (match3) {
        foundSelections.push(orig)
        return match3
      }

      return ''
    })
    .filter(x => !!x)

  return uniq(errorFree.concat(found))
}

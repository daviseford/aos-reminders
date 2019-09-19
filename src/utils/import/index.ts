import { uniq, difference, last } from 'lodash'
import { isValidFactionName } from 'utils/armyUtils'
import { logFailedImport } from 'utils/analytics'
import { getArmy } from 'utils/getArmy/getArmy'
import { isDev } from 'utils/env'
import { mapListToDict } from 'utils/mapListToDict'
import { getAllyData } from 'utils/import/allyData'
import { warscrollTypoMap, azyrTypoMap } from 'utils/import/options'
import { stripPunctuation } from 'utils/textUtils'
import { createError, createWarning } from './warnings'
import { isPoorlySpacedMatch } from './isPoorlySpacedMatch'
import { replaceOf } from './replaceOf'
import { IArmy } from 'types/army'
import { TImportError, TImportParsers, IImportedArmy } from 'types/import'
import { ISelections } from 'types/selections'

type TParserOptions = {
  [key in TImportParsers]: {
    checkPoorSpacing: boolean
    fileReadError: string
    typoMap: { [key: string]: string }
  }
}

const parserOptions: TParserOptions = {
  'Warscroll Builder': {
    checkPoorSpacing: false,
    fileReadError: `There was a problem reading this file. Please try re-downloading it from Warscroll Builder.`,
    typoMap: warscrollTypoMap,
  },
  Azyr: {
    checkPoorSpacing: true,
    fileReadError: `There was a problem reading this file.`,
    typoMap: azyrTypoMap,
  },
  Battlescribe: {
    checkPoorSpacing: false,
    fileReadError: `There was a problem reading this file.`,
    typoMap: {},
  },
}

export const importErrorChecker = (army: IImportedArmy, parser: TImportParsers): IImportedArmy => {
  const opts = parserOptions[parser]

  let { errors, factionName, selections, unknownSelections, allyUnits } = army

  // If we've already gotten an error, go ahead and bail out
  if (errors.some(({ severity }) => severity === 'error')) return army

  // If we're missing a faction name, we won't be able to do much with this
  if (!isValidFactionName(factionName)) {
    logFailedImport(`faction:${factionName || 'Unknown'}`, parser)
    const errorTxt = !!factionName ? `${factionName} are not supported.` : opts.fileReadError
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

  const allyData = getAllyData(allyUnits, factionName, errors, opts.checkPoorSpacing)

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
  checkPoorSpacing: boolean,
  typoMap: { [key: string]: string }
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
  const NameMap = mapListToDict(Names)
  const checkVal = checkImportSelection(Names, NameMap, errors, true, checkPoorSpacing)

  const errorFree = selections[type].map(checkVal).filter(x => !!x)

  const found = unknownSelections
    .map(val => {
      const orig = `${val}`

      // Check for typos
      if (typoMap[val]) val = typoMap[val]

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

      if (checkPoorSpacing) {
        // Last chance - check for bad spacing
        const match3 = Names.find(x => isPoorlySpacedMatch(val, x))
        if (match3) {
          foundSelections.push(orig)
          return match3
        }
      }

      return ''
    })
    .filter(x => !!x)

  return uniq(errorFree.concat(found))
}

export const checkImportSelection = (
  Names: string[],
  NameMap: { [key: string]: string },
  errors: TImportError[],
  logError: boolean = true,
  checkPoorSpacing: boolean
) => (val: string) => {
  // Check for typos
  if (azyrTypoMap[val]) val = azyrTypoMap[val]

  if (NameMap[val]) return val

  // See if we have something like it...
  const valUpper = val.toUpperCase()
  const match = Names.find(x => x.toUpperCase().includes(valUpper))
  if (match) return match

  // Maybe we have a trailing '... of Slaanesh'?
  const valShortened = replaceOf(valUpper)
  const match2 = Names.find(x => x.toUpperCase().includes(valShortened))
  if (match2) return match2

  // Maybe punctuation is in our way?
  const valNoPunc = stripPunctuation(valUpper)
  const match3 = Names.find(x => stripPunctuation(x.toUpperCase()).includes(valNoPunc))
  if (match3) return match3

  // Sometimes parentheses get in our way
  const valNoParens = valUpper.replace(/\(.+\)/g, '').trim()
  const match4 = Names.find(x =>
    x
      .toUpperCase()
      .replace(/\(.+\)/g, '')
      .includes(valNoParens)
  )
  if (match4) return match4

  // Maybe semicolons?
  const valNoSemi = last(valUpper.split(':')) as string
  const match5 = Names.find(x => x.toUpperCase().includes(valNoSemi))
  if (match5) return match5

  if (checkPoorSpacing) {
    // Last chance - check for bad spacing
    const match6 = Names.find(x => isPoorlySpacedMatch(val, x))
    if (match6) return match6
  }

  if (logError) {
    errors.push(createWarning(val))
  }
  return ''
}

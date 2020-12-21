import { LegionsOfNagashFaction } from 'factions/legions_of_nagash'
import { uniq, without } from 'lodash'
import {
  LEGIONS_OF_NAGASH,
  LUMINETH_REALMLORDS,
  SERAPHON,
  TPrimaryFactions,
  TSupportedFaction,
} from 'meta/factions'
import { getFactionFromList } from 'meta/faction_list'
import { TBattleRealms, TOriginRealms } from 'types/realmscapes'
import { TSelections } from 'types/selections'
import { isValidFactionName } from 'utils/armyUtils'
import { cleanText, fixKeys, ignoredValues } from 'utils/battlescribe/battlescribeUtils'
import { isChildNode, isParentNode } from 'utils/battlescribe/checks'
import {
  IChildNode,
  IFactionInfo,
  IFlavorInfo,
  IParentNode,
  IParsedRoot,
} from 'utils/battlescribe/getBattlescribeArmy'
import { partialSearchDoc, stripParentNode } from 'utils/battlescribe/parseHTML'
import { importFactionNameMap } from 'utils/import/options'

type TFactionsAndFlavors = {
  factionName: TSupportedFaction | null
  flavors: string[]
  subFactionName: string | null
}

export const getFactionAndFlavors = (
  flavorInfo: IFlavorInfo[],
  factionInfo: IFactionInfo
): TFactionsAndFlavors => {
  const store: TFactionsAndFlavors = {
    factionName: isValidFactionName(factionInfo.factionName) ? factionInfo.factionName : null,
    subFactionName: null,
    flavors: [],
  }

  flavorInfo.forEach(info => {
    if (!store.factionName) {
      info.flavors?.forEach(name => {
        const y: TPrimaryFactions | string | undefined = isValidFactionName(name)
          ? name
          : importFactionNameMap[name]?.factionName
        if (!store.factionName && isValidFactionName(y)) {
          store.factionName = y
        }
      })
    }

    const mappedFaction = isValidFactionName(info.factionName)
      ? info.factionName
      : importFactionNameMap[info.factionName || '']?.factionName

    if (!store.factionName && isValidFactionName(mappedFaction)) {
      store.factionName = mappedFaction
    }

    if (info.flavors) {
      store.flavors = store.flavors.concat(info.flavors)
    }
  })

  const factionName = store.factionName || (factionInfo.factionName as TSupportedFaction)

  const possibleNameCollisions = Object.keys(importFactionNameMap).filter(
    k => importFactionNameMap[k]?.factionName === factionName
  )

  // We want to ensure we're not duplicating the faction inside of flavors.
  const fixedFlavors = without(uniq(store.flavors), factionName, ...possibleNameCollisions)

  let subFactionName = store.subFactionName || factionInfo.subFactionName || ''
  if (isValidFactionName(factionName) && !subFactionName) {
    const _Faction = getFactionFromList(factionName)
    const _subFactionName = store.flavors.find(x => !!_Faction.subFactionKeyMap[x])
    if (_subFactionName) subFactionName = _subFactionName
  }

  debugger

  return {
    factionName,
    subFactionName,
    flavors: without(fixedFlavors, subFactionName),
  }
}

export const parseBattleRealmObj = (obj: IParentNode): TBattleRealms | null => {
  try {
    //@ts-ignore
    const text = obj.childNodes[1].childNodes[1].value
    return text.split(': ')[1].trim() as TBattleRealms
  } catch (err) {
    return null
  }
}

export const parseOriginRealmObj = (obj: IParentNode): TOriginRealms | null => {
  try {
    //@ts-ignore
    const text = obj.childNodes[1].childNodes[1].value
    return text.split(': ')[1].trim() as TOriginRealms
  } catch (err) {
    return null
  }
}

/**
 *
 * @param obj
 */
export const parseFaction = (obj: IParentNode): IFactionInfo => {
  try {
    const factionNode = obj.childNodes.find(x => x.nodeName === 'h2')

    // obj.childNodes[0].childNodes[0].value
    // value === "-Pitched Battle - Battlehost (2000pts) (Chaos - Disciples of Tzeentch)"

    if (!isParentNode(factionNode)) throw new Error('Could not find factionNode')
    if (!isChildNode(factionNode.childNodes[0])) throw new Error('Not a child node')

    const value = factionNode.childNodes[0].value

    const factionValue = value
      .replace('(Warscroll Compendium)', '')
      .replace(/\([\d]{1,5}pts\)/g, '')
      .replace(/.+\((.+)\).+/g, '$1')

    const sep = factionValue.includes(': ') ? ': ' : ' - '
    let [grandAlliance, ...rest] = factionValue.split(sep).map(x => {
      // Remove any stray parentheses
      return x.replace(/(\(|\))/g, '').trim()
    })

    const last = rest[rest.length - 1]

    const factionLookup = importFactionNameMap?.[last]
    const factionName = factionLookup?.factionName || 'Unknown'
    const subFactionName = factionLookup?.subFactionName || null

    debugger

    return { grandAlliance, factionName, subFactionName }
  } catch (err) {
    console.log('There was an error detecting the faction name')
    console.error(err)
    return { grandAlliance: null, factionName: null, subFactionName: null }
  }
}

export const parseAllegiance = (obj: IParentNode): IFlavorInfo => {
  const flavorInfo: IFlavorInfo = { factionName: null, flavors: null, subFactionName: null }
  try {
    const strippedObj = stripParentNode(obj) as IParentNode
    strippedObj.childNodes = strippedObj.childNodes.filter(x => isParentNode(x))
    // If there is a node with the value of `Allegiance:`
    // There is some advanced Battlescribe bullshittery going on
    // And we need to parse it in a special manner
    if (partialSearchDoc(obj, 'Allegiance:')) {
      return getFlavorMetadata(obj)
    }

    // TODO: Switch to Table lookup
    // Otherwise we can do a semi-normal lookup
    const { childNodes = [] } = strippedObj

    const isSelectionNode = (node: IParentNode | IChildNode) => {
      return (
        isParentNode(node) &&
        node.nodeName === 'span' &&
        node.childNodes.length &&
        isChildNode(node.childNodes[0]) &&
        node.childNodes[0].value === 'Selections:'
      )
    }

    const nameObj = childNodes.find(x => {
      if (
        isParentNode(x) &&
        x.nodeName === 'p' &&
        x.childNodes.length &&
        x.childNodes.some(isSelectionNode)
      ) {
        return true
      } else {
        return false
      }
    })

    if (!nameObj || !isParentNode(nameObj)) {
      let flavor = flavorCategoryLookup(childNodes)
      flavorInfo.flavors = flavor ? [flavor] : null

      if (!flavor) {
        flavor = flavorSelectionLookup(childNodes)
        flavorInfo.flavors = flavor ? [flavor] : null
      }

      const lookup = factionH4Lookup(childNodes)
      flavorInfo.faction = lookup.factionName
      if (lookup.subFactionName) flavorInfo.subFactionName = lookup.subFactionName

      return flavorInfo
    }

    const selectionIdx = nameObj.childNodes.findIndex(isSelectionNode)

    const objs = nameObj.childNodes.slice(selectionIdx + 1)

    const factionName = objs
      .reduce((a, b) => {
        if (isParentNode(b)) return a
        a = `${a} ${b.value}`
        return a
      }, '')
      .trim()

    return { ...flavorInfo, factionName }
  } catch (err) {
    return flavorInfo
  }
}

const factionH4Lookup = (
  childNodes: Array<IParentNode | IChildNode>
): { factionName: TSupportedFaction | null; subFactionName: string | null } => {
  const emptyResponse = { factionName: null, subFactionName: null }
  try {
    // @ts-ignore
    const valNode = childNodes[2].childNodes[0].childNodes[0].childNodes[0]

    // @ts-ignore
    if (childNodes[2].childNodes[0].childNodes[0].nodeName !== 'h4') return emptyResponse
    if (valNode.nodeName !== '#text') return emptyResponse

    const lookup = importFactionNameMap[cleanText(valNode.value)]
    const factionName = lookup.factionName || null
    const subFactionName = lookup.subFactionName || null

    return {
      factionName: isValidFactionName(factionName) ? factionName : null,
      subFactionName,
    }
  } catch (err) {
    return emptyResponse
  }
}

const flavorSelectionLookup = (childNodes: Array<IParentNode | IChildNode>) => {
  const ignoredValues = [
    'Cycle of Corruption, Summon Daemons of Nurgle',
    'Cycle of Corruption',
    'Light of the Bad Moon',
  ]
  try {
    // Don't run if we have categories
    // @ts-ignore
    if (childNodes[2].childNodes[0].childNodes[2].childNodes[0].childNodes[0].value === 'Categories:') {
      return null
    }
    // @ts-ignore
    const mainNode = childNodes[2].childNodes[0].childNodes[1]
    const spanNode = mainNode.childNodes[0]
    // @ts-ignore
    const valNode = childNodes[2].childNodes[0].childNodes[1].childNodes[1]

    if (mainNode.nodeName !== 'p') return null
    if (spanNode.nodeName !== 'span') return null
    if (spanNode.childNodes[0].value !== 'Selections:') return null
    if (!isChildNode(valNode) || valNode.nodeName !== '#text') return null

    const value = cleanText(valNode.value)
      .replace('Cycle of Corruption, ', '')
      .replace('Summon Daemons of Nurgle', '')
      .trim()

    return ignoredValues.includes(value) || !value ? null : value
  } catch (err) {
    return null
  }
}

/**
 * Handles weird formatting issues with armies like Idoneth Deepkin
 * @param childNodes
 */
const flavorCategoryLookup = (childNodes: Array<IParentNode | IChildNode>): string | null => {
  try {
    //@ts-ignore
    if (childNodes[2].childNodes[0].childNodes[2].childNodes[0].childNodes[0].value !== 'Categories:') {
      return null
    }

    //@ts-ignore
    const value = childNodes[2].childNodes[0].childNodes[2].childNodes[1].childNodes[0].value
    const possibleFlavors: string[] = value
      .split(', ')
      .map(cleanText)
      .filter((x: string) => {
        return x !== 'SCENERY' && x !== 'GLOOMTIDE SHIPWRECK'
      })
    const faction = cleanText(possibleFlavors.shift() || '')
      .split(' ')
      .join('_')

    if (isValidFactionName(faction) && possibleFlavors.length > 0) {
      return possibleFlavors[0]
    } else {
      return null
    }
  } catch (err) {
    return null
  }
}

const getFlavorMetadata = (obj: IParentNode): IFlavorInfo => {
  const flavorInfo: IFlavorInfo = { factionName: null, subFactionName: null, flavors: null }

  let liNode = obj

  const ulNode = obj.childNodes.find(x => x.nodeName === 'ul') as IParentNode
  if (ulNode) {
    liNode = ulNode.childNodes.find(x => x.nodeName === 'li') as IParentNode
  }

  const pChildren = liNode.childNodes.filter(x => x.nodeName === 'p') as IParentNode[]

  let className = ''
  let key = ''
  const entries = pChildren.reduce((accum, x) => {
    x.childNodes.forEach(cNode => {
      let val = ''

      if (isParentNode(cNode)) {
        if (cNode.attrs.length > 0) {
          if (cNode.attrs[0].value === 'bold' && className !== 'bold') {
            className = 'bold'
            key = ''
          } else if (cNode.attrs[0].value !== 'bold' && className !== 'not_bold') {
            accum[key] = ''
            className = 'not_bold'
          }
        }
        val = cleanText((cNode.childNodes[0] as IChildNode).value)
      } else if (isChildNode(cNode)) {
        if (!accum[key]) accum[key] = ''
        className = 'not_bold'
        val = cleanText(cNode.value)
      }

      if (className === 'bold') {
        key = cleanText(`${key} ${val}`).replace(/:$/g, '')
      } else {
        accum[key] = cleanText(`${accum[key]} ${val}`)
      }
    })

    return accum
  }, {} as Record<string, string>)

  const liEntries = Object.keys(entries).reduce((a, key) => {
    const val = entries[key]
      .replace(/^Allegiance: /g, '') // Remove leading Allegiance indicator for subfactions
      .replace(/^Awakened Wyldwood(,)?/g, '') // Remove random Sylvaneth Wyldwood entry
      .replace(/(, )?Ur-Gold(,)?/g, '') // Remove Ur-Gold (not an allegiance)
      .replace(/ {1,},$/g, '') // remove trailing comma
      .trim()
    a[key] = val
    return a
  }, {} as Record<string, string>)

  const tableTags = obj.childNodes.filter(x => isParentNode(x) && x.nodeName === 'table') as IParentNode[]

  const tableTraits = tableTags.reduce((a, table) => {
    // @ts-ignore
    const tableName = table.childNodes[0].childNodes[0].childNodes[0].childNodes[0].value
    // @ts-ignore
    const tds = table.childNodes[0].childNodes.slice(1).map(x => x.childNodes[0])
    const names = tds.map(x => x.childNodes[0].value).flat()
    a[tableName] = names
    return a
  }, {} as Record<string, string[] | string>)

  const mergedTraits = fixKeys(
    Object.keys(liEntries).reduce((a, key) => {
      if (tableTraits[key]) {
        // Prefer table traits to li traits
        a[key] = tableTraits[key]
      } else {
        a[key] = liEntries[key]
      }
      return a
    }, {})
  )

  const fixedKeys = Object.keys(mergedTraits).reduce((a, key) => {
    const val = mergedTraits[key]

    // Ignore empty values
    if (!val) return a

    if (key === 'Selections' && typeof val === 'string') {
      a.flavors = [stripAllegiancePrefix(val)]
    } else if (key === 'Categories' && typeof val === 'string') {
      a.factionName = val
    } else {
      a[key] = val
    }
    return a
  }, flavorInfo)

  // Soulblight hotfix
  if (
    // @ts-ignore
    obj?.childNodes[2]?.childNodes?.[0]?.childNodes?.[0]?.childNodes?.[0]?.value === 'Allegiance: Soulblight'
  ) {
    fixedKeys.factionName = LEGIONS_OF_NAGASH
    fixedKeys.subFactionName = LegionsOfNagashFaction.subFactionKeyMap.Soulblight
    fixedKeys.flavors = []
  }

  // Seraphon hotfix
  // It's messy, sorry!
  if (
    // @ts-ignore
    ulNode?.childNodes?.[0]?.childNodes?.[0]?.childNodes?.[0]?.value === 'Allegiance: Seraphon'
  ) {
    const way =
      // @ts-ignore
      obj?.childNodes?.[2]?.childNodes?.[0]?.childNodes[2]?.childNodes?.[0]?.childNodes?.[0]?.childNodes?.[0]
        ?.value
    const constellation =
      // @ts-ignore
      ulNode?.childNodes?.[0]?.childNodes[2]?.childNodes?.[0]?.childNodes?.[1]?.childNodes?.[1]?.value
        ?.replace('The ', '')
        ?.replace(', Show Celestial Conjuration Table', '')
        ?.replace('Show Celestial Conjuration Table', '')

    if ((way || constellation) && !fixedKeys.flavors) fixedKeys.flavors = []
    if (way) fixedKeys.subFactionName = way
    if (constellation) fixedKeys.flavors?.push(constellation)
    fixedKeys.factionName = SERAPHON
  }

  // Horrible Lumineth hotfix - 10/28/20
  // @ts-ignore
  if (liNode?.childNodes?.[0]?.childNodes?.[0].value === 'Allegiance: Lumineth') {
    // @ts-ignore
    const luminethAllegiance = liNode?.childNodes?.[2]?.childNodes?.[1]?.childNodes?.[0]?.value
    if (luminethAllegiance) {
      fixedKeys.flavors = [luminethAllegiance]
      fixedKeys.factionName = LUMINETH_REALMLORDS
    }
  }

  return fixedKeys
}

const stripAllegiancePrefix = (str: string) => str.replace(/(Legion: )/g, '')

export const sortParsedRoots = (roots: IParsedRoot[], flavorInfo: IFlavorInfo[]) => {
  const Collection: TSelections = {
    artifacts: [],
    battalions: [],
    command_abilities: [],
    command_traits: [],
    endless_spells: [],
    flavors: [],
    mount_traits: [],
    prayers: [],
    scenery: [],
    spells: [],
    triumphs: [],
    units: [],
  }

  roots.forEach(r => {
    // Handle name first
    if (ignoredValues.includes(r.name)) return

    // We'll keep track of whether we've matched the current name to a category yet
    // And if we need to do some additional parsing (we don't need to for Endless Spells)
    let [has_matched, process_entries] = [false, true]

    // If we have a battalion entry (and no helpful prefix) let's be sure to store it accordingly
    if (isBattalion(r)) {
      const val = cleanText(r.name)
      Collection.battalions = uniq(Collection.battalions.concat(val))
      has_matched = true
    }

    // Let's see if we can match this entry nicely to a certain category
    if (!has_matched) {
      Object.keys(prefixLookup).forEach(key => {
        if (!has_matched && r.name.startsWith(`${key}:`)) {
          const vals = r.name.split(`${key}:`)[1].split(',').map(cleanText)
          Collection[prefixLookup[key]] = uniq(Collection[prefixLookup[key]].concat(vals))
          has_matched = true
          if (['Endless Spell', 'Bound Endless Spell'].includes(key)) {
            process_entries = false
          }
        }
      })
    }

    // Check for exact matches
    if (!has_matched) {
      const cleanedName = cleanText(r.name)
      Object.keys(exactMatches).forEach(key => {
        if (!has_matched && key === cleanedName) {
          Collection[exactMatches[key]] = uniq(Collection[exactMatches[key]].concat([cleanedName]))
          has_matched = true
        }
      })
    }

    // Put everything else in units
    if (!has_matched) {
      const val = cleanText(r.name)
      const names = multiNameMap[val] || [val]
      Collection.units = uniq(Collection.units.concat(names))
    }

    if (process_entries) {
      // Now need to handle entries
      Object.keys(r.entries).forEach(key => {
        if (prefixLookup[key]) {
          const vals = without(r.entries[key], ...ignoredNames)
          Collection[prefixLookup[key]] = uniq(Collection[prefixLookup[key]].concat(vals))
        }
      })
    }
  })

  flavorInfo.forEach(info => {
    Object.keys(info).forEach(key => {
      if (prefixLookup[key]) {
        const vals = info[key]
        if (vals) Collection[prefixLookup[key]] = uniq(Collection[prefixLookup[key]].concat(vals))
      }
    })
  })

  // Remove duplicates like "Gors" and "Gor" (leaves the pluralized version)
  Collection.units.forEach(x => {
    if (x.endsWith('s')) {
      const singular = x.slice(0, -1)
      Collection.units = without(Collection.units, singular)
    }
  })

  return Collection
}

const ignoredNames = [
  'Crew',
  'Screaming Skull Catapult Crew',
  'Show Celestial Conjuration Table',
  'Summon Bleeding Icon',
  'Summon Hexgorger Skulls',
  'Summon Molten Infernoth',
  'Summon Runic Fyrewall',
  'Summon Umbral Spellportal',
  'Summon Wrath-Axe',
  'Summon Zharrgron Flame Splitter',
  'Ur-Gold',
  "Summon Ravenak's Gnashing Jaws",
]

// Convert names of units that contain multiple unit types
const multiNameMap: Record<string, string[]> = {
  'Duke Crakmarrow and the Grymwatch': ['Duke Crakmarrow', 'The Grymwatch'],
}

/**
 * If a value is prefixed with a certain string,
 * assign the value to a certain selection type
 */
const prefixLookup: Record<string, keyof TSelections> = {
  'Battle Traits': 'command_traits',
  'Bound Endless Spell': 'endless_spells',
  'Command Abilities': 'command_abilities',
  'Command Traits': 'command_traits',
  'Endless Spell': 'endless_spells',
  'Magmic Invocation': 'endless_spells',
  'Super Battalion': 'battalions',
  Artifacts: 'artifacts',
  Battalion: 'battalions',
  Commands: 'command_abilities',
  Enginecoven: 'battalions',
  Judgement: 'endless_spells',
  Prayers: 'prayers',
  Scenery: 'scenery',
  Spells: 'spells',
  Traits: 'command_traits',
  Unit: 'units',
}

/**
 * Names that if they are matched exactly,
 * should be placed in a certain selection type
 */
const exactMatches: Record<string, keyof TSelections> = {
  'Charnel Throne': 'scenery',
}

const isBattalion = (r: IParsedRoot): boolean => {
  // Ignore units
  if (r.entries['Unit']?.[0] === r.name) {
    return false
  }

  // Do we have battalion abilities? And are our abilities unique?
  if (!r.entries['Battalion Abilities'] || r.entries?.['Battalion Abilities']?.[0] === r.name) {
    return false
  }

  // Are we missing a known prefix?
  const startsWithPrefix = Object.keys(prefixLookup).some(x => r.name.startsWith(x))
  return !startsWithPrefix
}

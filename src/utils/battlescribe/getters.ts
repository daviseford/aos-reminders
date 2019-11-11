import { uniq } from 'lodash'
import { IParentNode, IFactionInfo, IChildNode, IParsedRoot, IAllegianceInfo } from './getBattlescribeArmy'
import { isParentNode, isChildNode } from './checks'
import { importFactionNameMap } from 'utils/import/options'
import { stripParentNode, partialSearchDoc } from './parseHTML'
import { cleanText, fixKeys, ignoredValues } from './battlescribeUtils'
import { TRealms } from 'types/realmscapes'
import { isString } from 'util'
import { isValidFactionName } from 'utils/armyUtils'
import { TSupportedFaction } from 'meta/factions'

export const getFactionAndAllegiance = (allegianceInfo: IAllegianceInfo[], factionInfo: IFactionInfo) => {
  const store = { factionName: null as TSupportedFaction | null, allegiances: [] as string[] }

  allegianceInfo.forEach(info => {
    const mappedAllegiance = isValidFactionName(info.allegiance)
      ? info.allegiance
      : importFactionNameMap[info.allegiance || '']
    const mappedFaction = isValidFactionName(info.faction)
      ? info.faction
      : importFactionNameMap[info.faction || '']

    if (isValidFactionName(mappedAllegiance)) {
      if (!store.factionName) store.factionName = mappedAllegiance
      return
    } else if (isValidFactionName(mappedFaction) && !store.factionName) {
      store.factionName = mappedFaction
    }

    if (info.allegiance) store.allegiances.push(info.allegiance)
  })

  return {
    factionName: store.factionName || (factionInfo.factionName as TSupportedFaction),
    allegiances: uniq(store.allegiances) as string[],
  }
}

export const parseRealmObj = (obj: IParentNode): TRealms | null => {
  try {
    //@ts-ignore
    const text = obj.childNodes[1].childNodes[1].value
    return text.split(': ')[1].trim() as TRealms
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

    if (!isParentNode(factionNode)) throw new Error('Could not find factionNode')
    if (!isChildNode(factionNode.childNodes[0])) throw new Error('Not a child node')

    const value = factionNode.childNodes[0].value

    const factionValue = value.replace('(Warscroll Compendium)', '').replace(/.+\((.+)\).+/g, '$1')

    const sep = factionValue.includes(': ') ? ': ' : ' - '
    let [grandAlliance, factionName] = factionValue.split(sep).map(x => x.trim())

    factionName = importFactionNameMap[factionName] || 'Unknown'

    return { grandAlliance, factionName }
  } catch (err) {
    console.log('There was an error detecting the faction name')
    console.error(err)
    return { grandAlliance: null, factionName: null }
  }
}

export const parseAllegiance = (obj: IParentNode): IAllegianceInfo => {
  const allegianceInfo = { faction: null as string | null, allegiance: null as string | null }

  try {
    const strippedObj = stripParentNode(obj) as IParentNode
    strippedObj.childNodes = strippedObj.childNodes.filter(x => isParentNode(x))
    // If there is a node with the value of `Allegiance:`
    // There is some advanced Battlescribe bullshittery going on
    // And we need to parse it in a special manner
    if (partialSearchDoc(obj, 'Allegiance:')) {
      return getAllegianceMetadata(obj)
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
      let allegiance = allegianceCategoryLookup(childNodes)
      allegianceInfo.allegiance = allegiance

      if (!allegiance) {
        allegiance = allegianceSelectionLookup(childNodes)
        allegianceInfo.allegiance = allegiance
      }

      allegianceInfo.faction = factionAllegianceh4Lookup(childNodes)

      return allegianceInfo
    }

    const selectionIdx = nameObj.childNodes.findIndex(isSelectionNode)

    const objs = nameObj.childNodes.slice(selectionIdx + 1)

    let faction = objs
      .reduce((a, b) => {
        if (isParentNode(b)) return a
        a = `${a} ${b.value}`
        return a
      }, '')
      .trim()

    return { ...allegianceInfo, faction }
  } catch (err) {
    return allegianceInfo
  }
}

const factionAllegianceh4Lookup = (childNodes: Array<IParentNode | IChildNode>): TSupportedFaction | null => {
  try {
    // @ts-ignore
    const valNode = childNodes[2].childNodes[0].childNodes[0].childNodes[0]

    // @ts-ignore
    if (childNodes[2].childNodes[0].childNodes[0].nodeName !== 'h4') return null
    if (valNode.nodeName !== '#text') return null

    const val = importFactionNameMap[cleanText(valNode.value)] || null

    return isValidFactionName(val) ? val : null
  } catch (err) {
    return null
  }
}

const allegianceSelectionLookup = (childNodes: Array<IParentNode | IChildNode>) => {
  const ignoredValues = ['Cycle of Corruption, Summon Daemons of Nurgle', 'Cycle of Corruption']
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
    return ignoredValues.includes(value) ? null : value
  } catch (err) {
    return null
  }
}

/**
 * Handles weird formatting issues with armies like Idoneth Deepkin
 * @param childNodes
 */
const allegianceCategoryLookup = (childNodes: Array<IParentNode | IChildNode>): string | null => {
  try {
    //@ts-ignore
    if (childNodes[2].childNodes[0].childNodes[2].childNodes[0].childNodes[0].value !== 'Categories:')
      return null

    //@ts-ignore
    const value = childNodes[2].childNodes[0].childNodes[2].childNodes[1].childNodes[0].value
    const possibleAllegiances: string[] = value.split(', ').map(cleanText)
    const faction = cleanText(possibleAllegiances.shift() || '')
      .split(' ')
      .join('_')

    if (isValidFactionName(faction) && possibleAllegiances.length > 0) {
      return possibleAllegiances[0]
    } else {
      return null
    }
  } catch (err) {
    return null
  }
}

export const getAllegianceMetadata = (obj: IParentNode): IAllegianceInfo => {
  const allegianceInfo = { faction: null, allegiance: null }
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
  }, {} as { [key: string]: string })

  const liEntries = Object.keys(entries).reduce((a, key) => {
    const val = entries[key]
      .replace(/^Allegiance: /g, '') // Remove leading Allegiance indicator for subfactions
      .replace(/^Awakened Wyldwood,/g, '') // Remove random Sylvaneth Wyldwood entry
      .replace(/ {1,},$/g, '') // remove trailing comma
      .trim()
    a[key] = val
    return a
  }, {} as { [key: string]: string })

  const tableTags = obj.childNodes.filter(x => isParentNode(x) && x.nodeName === 'table') as IParentNode[]

  const tableTraits = tableTags.reduce((a, table) => {
    // @ts-ignore
    const tableName = table.childNodes[0].childNodes[0].childNodes[0].childNodes[0].value
    // @ts-ignore
    const tds = table.childNodes[0].childNodes.slice(1).map(x => x.childNodes[0])
    const names = tds.map(x => x.childNodes[0].value).flat()
    a[tableName] = names
    return a
  }, {} as { [key: string]: string[] | string })

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
    if (key === 'Selections' && isString(val)) {
      a.allegiance = val
    } else if (key === 'Categories' && isString(val)) {
      a.faction = val
    } else {
      a[key] = val
    }
    return a
  }, allegianceInfo as IAllegianceInfo)

  return fixedKeys
}

export const sortParsedRoots = (roots: IParsedRoot[], allegianceInfo: IAllegianceInfo[]) => {
  const Collection = {
    allegiances: [] as string[],
    artifacts: [] as string[],
    battalions: [] as string[],
    commands: [] as string[],
    endless_spells: [] as string[],
    scenery: [] as string[],
    spells: [] as string[],
    traits: [] as string[],
    triumphs: [] as string[],
    units: [] as string[],
  }

  const lookup = {
    'Battle Traits': 'traits',
    'Endless Spell': 'endless_spells',
    'Magmic Invocation': 'endless_spells',
    'Super Battalion': 'battalions',
    Artifacts: 'artifacts',
    Battalion: 'battalions',
    Commands: 'commands',
    Judgement: 'endless_spells',
    Scenery: 'scenery',
    Spells: 'spells',
    Traits: 'traits',
    Unit: 'units',
  }

  roots.forEach(r => {
    // Handle name first
    if (ignoredValues.includes(r.name)) return

    let [has_matched, process_entries] = [false, true]
    Object.keys(lookup).forEach(key => {
      if (!has_matched && r.name.startsWith(`${key}:`)) {
        const vals = r.name
          .split(`${key}:`)[1]
          .split(',')
          .map(cleanText)
        Collection[lookup[key]] = uniq(Collection[lookup[key]].concat(vals))
        has_matched = true
        if (key === 'Endless Spell') process_entries = false
      }
    })

    // Put everything else in units
    if (!has_matched) {
      const val = cleanText(r.name)
      Collection.units = uniq(Collection.units.concat(val))
    }

    if (process_entries) {
      // Now need to handle entries
      Object.keys(r.entries).forEach(key => {
        if (lookup[key]) {
          const vals = r.entries[key]
          Collection[lookup[key]] = uniq(Collection[lookup[key]].concat(vals))
        }
      })
    }
  })

  allegianceInfo.forEach(info => {
    Object.keys(info).forEach(key => {
      if (lookup[key]) {
        const vals = info[key]
        Collection[lookup[key]] = uniq(Collection[lookup[key]].concat(vals))
      }
    })
  })

  return Collection
}

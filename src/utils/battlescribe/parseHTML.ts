import { TBattleRealms, TOriginRealms } from 'types/realmscapes'
import { cleanText, fixKeys } from 'utils/battlescribe/battlescribeUtils'
import {
  isAllegianceObj,
  isBattleRealmObj,
  isChildNode,
  isFactionObj,
  isOriginRealmObj,
  isParentNode,
  isRootSelection,
} from 'utils/battlescribe/checks'
import { IChildNode, IFactionInfo, IFlavorInfo, IParentNode } from 'utils/battlescribe/getBattlescribeArmy'
import {
  parseAllegiance,
  parseBattleRealmObj,
  parseFaction,
  parseOriginRealmObj,
} from 'utils/battlescribe/getters'

type TTraverseDoc = (
  docObj: IParentNode | IChildNode
) => {
  allegianceInfo: IFlavorInfo[]
  factionInfo: IFactionInfo
  origin_realm: TOriginRealms | null
  realmscape: TBattleRealms | null
  rootSelections: IParentNode[]
}

export const traverseDoc: TTraverseDoc = docObj => {
  const results = {
    allegianceInfo: [] as IFlavorInfo[],
    factionInfo: { factionName: null, grandAlliance: null } as IFactionInfo,
    origin_realm: null as TOriginRealms | null,
    realmscape: null as TBattleRealms | null,
    rootSelections: [] as IParentNode[],
  }

  const traverse = (obj: IParentNode | IChildNode) => {
    if (!isParentNode(obj)) return

    if (isRootSelection(obj)) {
      results.rootSelections.push(obj)
    }

    if (!results.realmscape && isBattleRealmObj(obj)) {
      results.realmscape = parseBattleRealmObj(obj)
    }

    if (!results.origin_realm && isOriginRealmObj(obj)) {
      results.origin_realm = parseOriginRealmObj(obj)
    }

    if (!results.factionInfo.factionName && isFactionObj(obj)) {
      results.factionInfo = parseFaction(obj)
    }

    if (isAllegianceObj(obj)) {
      results.allegianceInfo.push(parseAllegiance(obj))
    }

    if (obj.childNodes.length > 0) {
      obj.childNodes.forEach(traverse)
    }
  }

  traverse(docObj)

  return results
}

const isUncategorizedScenery = (obj: IParentNode, name: string) => {
  // Some Scenery is not even given the Scenery tag...
  // So we have to keep a manual list here
  const knownScenery = ['Skull Altar', 'Bad Moon Loonshrine', 'Great Mawpot', 'Bone-Tithe Nexus']

  try {
    if (name.startsWith(`Scenery: `)) return false // It's categorized properly already
    if (knownScenery.includes(name)) return true
    //@ts-ignore
    if (obj.childNodes[1].childNodes[1].childNodes[0].value.includes('SCENERY')) {
      return true
    }
    return false
  } catch (err) {
    return false
  }
}

interface IParsedRootSelection {
  name: string
  entries: {
    [key: string]: string[]
  }
}

export const parseRootSelection = (obj: IParentNode): IParsedRootSelection => {
  try {
    const { childNodes = [] } = obj
    const h4Node = childNodes.find(x => x.nodeName === 'h4')

    if (!isParentNode(h4Node) || !h4Node.childNodes.length || !isChildNode(h4Node.childNodes[0])) {
      throw new Error('Could not find the item name')
    }

    let name = h4Node.childNodes[0].value.replace(/(.+)\[.+\]/g, '$1').trim()

    // Handle custom character names like Funggar Longfinger - Fungoid Cave-Shaman
    if (name.includes(' - ')) {
      name = name.split(' - ')[1]
    }

    // Add Scenery tag to uncategorised entries
    if (isUncategorizedScenery(obj, name)) {
      name = `Scenery: ${name}`
    }

    const tableEntries = childNodes.reduce((a, x) => {
      if (isParentNode(x) && x.nodeName === 'table') {
        const { tableName, names } = getNamesFromTableTags(x)
        if (tableName) a[tableName] = names
      }
      return a
    }, {} as { [key: string]: string[] })

    return { name, entries: fixKeys(tableEntries) }
  } catch (err) {
    console.log('There was an error parsing a root selection')
    console.error(err)
    return { name: '', entries: {} }
  }
}

const getNamesFromTableTags = (table: IParentNode): { tableName: string; names: string[] } => {
  try {
    // @ts-ignore
    const tableName: string = table.childNodes[0].childNodes[0].childNodes[0].childNodes[0].value
    // @ts-ignore
    const tds = table.childNodes[0].childNodes.slice(1).map(x => x.childNodes[0]) as IParentNode[]
    const names: string[] = tds.map(x => (x.childNodes[0] as IChildNode).value).flat()
    return { tableName, names }
  } catch (err) {
    return { tableName: '', names: [] }
  }
}

/**
 * Helps us get the JSON string (removes circular references)
 */
export const stripParentNode = (docObj: IParentNode | IChildNode) => {
  if (isChildNode(docObj) && docObj.value) {
    docObj.value = cleanText(docObj.value)
  }
  //@ts-ignore
  delete docObj.parentNode // Get rid of circular references
  //@ts-ignore
  delete docObj.namespaceURI // Unnecessary key
  //@ts-ignore
  delete docObj.tagName // Unnecessary key (duplicates nodeName)

  if (!isParentNode(docObj)) return docObj

  if (docObj.childNodes.length > 0) {
    docObj.childNodes = docObj.childNodes
      .map(stripParentNode)
      .map(x => {
        if (isChildNode(x)) {
          x.value = cleanText(x.value)
        }
        return x
      })
      .filter(x => {
        if (isChildNode(x)) {
          const trimmedVal = cleanText(x.value)
          if (trimmedVal === '') return false
          if (trimmedVal === '\n') return false
          if (trimmedVal === '\n\n') return false
        }
        return true
      })
  }

  return docObj
}

export const partialSearchDoc = (docObj: IParentNode, searchString: string) => {
  let result: string = ''

  const traverse = (obj: IParentNode | IChildNode) => {
    if (result) return
    if (isChildNode(obj) && obj.value.startsWith(searchString)) {
      result = obj.value
      return
    }
    if (!isParentNode(obj)) return

    if (obj.childNodes.length > 0) {
      obj.childNodes.forEach(traverse)
    }
  }

  traverse(docObj)

  return result
}

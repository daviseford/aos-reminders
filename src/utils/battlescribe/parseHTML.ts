import { IParentNode, IChildNode, IFactionInfo } from './getBattlescribeArmy'
import {
  isChildNode,
  isParentNode,
  isRootSelection,
  isFactionObj,
  isAllegianceObj,
  isRealmObj,
} from './checks'
import { cleanText, fixKeys } from './battlescribeUtils'
import { parseFaction, parseAllegiance, parseRealmObj } from './getters'
import { TRealms } from 'types/realmscapes'

export const traverseDoc = (docObj: IParentNode | IChildNode) => {
  const results = {
    realmInfo: null as null | TRealms,
    allegianceInfo: null as any,
    factionInfo: { factionName: null, grandAlliance: null } as IFactionInfo,
    rootSelections: [] as IParentNode[],
  }

  const traverse = (obj: IParentNode | IChildNode) => {
    if (!isParentNode(obj)) return

    if (isRootSelection(obj)) {
      results.rootSelections.push(obj)
    }

    if (!results.realmInfo && isRealmObj(obj)) {
      results.realmInfo = parseRealmObj(obj)
    }

    if (!results.factionInfo.factionName && isFactionObj(obj)) {
      results.factionInfo = parseFaction(obj)
    }

    if (!results.allegianceInfo && isAllegianceObj(obj)) {
      debugger
      results.allegianceInfo = parseAllegiance(obj)
    }

    if (obj.childNodes.length > 0) {
      obj.childNodes.forEach(traverse)
    }
  }

  traverse(docObj)

  return results
}

export const parseRootSelection = (obj: IParentNode) => {
  try {
    const { childNodes = [] } = obj
    const nameObj = childNodes.find(x => x.nodeName === 'h4')
    if (!isParentNode(nameObj) || !nameObj.childNodes.length) throw new Error('Could not find the item name')
    const name = (nameObj.childNodes[0] as IChildNode).value.replace(/(.+)\[.+\]/g, '$1').trim()

    const tableTags = childNodes.filter(x => {
      return isParentNode(x) && x.nodeName === 'table'
    }) as IParentNode[]

    const entries: { [key: string]: string[] } = {}

    tableTags.forEach(table => {
      // @ts-ignore
      const tableName = table.childNodes[0].childNodes[0].childNodes[0].childNodes[0].value
      // @ts-ignore
      const tds = table.childNodes[0].childNodes.slice(1).map(x => x.childNodes[0])
      const names = tds.map(x => x.childNodes[0].value).flat()
      entries[tableName] = names
    })

    return { name, entries: fixKeys(entries) }
  } catch (err) {
    console.log('There was an error parsing a root selection')
    console.error(err)
    return { name: '', entries: {} }
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
  delete docObj.tagName // Unnecessary key

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

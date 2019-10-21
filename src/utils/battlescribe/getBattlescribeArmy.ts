//@ts-nocheck
import parse5 from 'parse5'

export const getBattleScribeArmy = (html_string: string) => {
  const document = parse5.parse(html_string)

  const strippedDoc = stripParentNode(document as ParentNode)

  const selections = traverseDoc(strippedDoc)
  const parsedRoots = selections.rootSelections.map(parseRootSelection)
  console.log(strippedDoc)
  console.log(selections)
  console.log(parsedRoots)
}

/**
 * Helps us get the JSON string (removes circular references)
 */
const stripParentNode = (docObj: ParentNode | ChildNode) => {
  //@ts-ignore
  delete docObj.parentNode // Get rid of circular references
  if (!isParentNode(docObj)) return docObj

  if (docObj.childNodes.length > 0) {
    docObj.childNodes = docObj.childNodes
      .map(stripParentNode)
      .map(x => {
        if (isChildNode(x)) {
          x.value = x.value.replace(/(.+)\\n {1,}(.+)/g, `$1 $2`).trim()
        }
        return x
      })
      .filter(x => {
        if (isChildNode(x)) {
          const trimmedVal = x.value.trim()
          if (trimmedVal === '') return false
          if (trimmedVal === '\n') return false
          if (trimmedVal === '\n\n') return false
        }
        return true
      })
  }

  return docObj
}

const isParentNode = (val: ParentNode | ChildNode): val is ParentNode => 'attrs' in val
const isChildNode = (val: ParentNode | ChildNode): val is ChildNode => 'value' in val

const isFactionObj = (obj: ParentNode | ChildNode): obj is ParentNode => {
  if (isChildNode(obj)) return false
  return obj.nodeName === 'li' && obj.attrs && obj.attrs[0] && obj.attrs[0].value === 'force'
}

/**
 *
 * @param obj
 */
const parseFaction = (obj: ParentNode | ChildNode): IFaction => {
  try {
    const factionNode = (obj.childNodes as ChildNode[]).find(x => x.nodeName === 'h2')
    if (!factionNode) throw new Error('Could not find factionNode')
    const factionValue = factionNode.childNodes[0].value.replace(/.+\((.+)\).+/g, '$1')
    const [alliance, faction] = factionValue.split(' - ').map(x => x.trim())
    return { alliance, faction }
  } catch (err) {
    console.log('There was an error detecting the faction name')
    console.error(err)
    return { alliance: null, faction: null }
  }
}

const parseRootSelection = (obj: ParentNode) => {
  try {
    const nameObj = obj.childNodes.find(x => x.nodeName === 'h4')
    if (!nameObj || !nameObj.childNodes.length) throw new Error('Could not find the item name')
    const name = (nameObj.childNodes[0] as ChildNode).value.replace(/(.+)\[.+\]/g, '$1').trim()

    return { name }
  } catch (err) {
    console.log('There was an error parsing a root selection')
    console.error(err)
  }
}

const isRootSelection = (obj: ParentNode | ChildNode): obj is ParentNode => {
  if (isChildNode(obj)) return false
  return obj.nodeName === 'li' && obj.attrs && obj.attrs[0] && obj.attrs[0].value === 'rootselection'
}

const traverseDoc = (docObj: ParentNode | ChildNode) => {
  let results = {
    faction: null as null | IFaction,
    rootSelections: [] as ParentNode[],
  }

  const traverse = (obj: ParentNode | ChildNode) => {
    if (!obj.childNodes) return

    if (isRootSelection(obj)) {
      results.rootSelections.push(obj)
    }

    if (!results.faction && isFactionObj(obj)) {
      results.faction = parseFaction(obj)
    }

    if (obj.childNodes.length > 0) {
      obj.childNodes.forEach(traverse)
    }
  }

  traverse(docObj)

  return results
}

interface Attrs {
  name: string
  value: string
}

interface ChildNode {
  nodeName: string
  value: string
}

interface ParentNode {
  nodeName: string
  tagName: string
  attrs: Attrs[]
  namespaceURI: string
  childNodes: Array<ChildNode | ParentNode>
}

interface IFaction {
  alliance: string | null
  faction: string | null
}

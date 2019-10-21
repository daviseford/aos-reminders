//@ts-nocheck
import parse5 from 'parse5'

export const getBattleScribeArmy = (html_string: string) => {
  const document = parse5.parse(html_string)

  const strippedDoc = stripParentNode(document)

  const selections = traverseDoc(strippedDoc)
  console.log(strippedDoc)
  console.log(selections)
}

/**
 * Helps us get the JSON string (removes circular references)
 */
const stripParentNode = (docObj: Object) => {
  //@ts-ignore
  delete docObj.parentNode
  if (!docObj.childNodes) return docObj

  if (docObj.childNodes.length > 0) {
    docObj.childNodes = docObj.childNodes.map(stripParentNode).filter(x => {
      if (x.value && (!x.childNodes || !x.childNodes.length)) {
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

const isFactionObj = obj => {
  return obj.nodeName === 'li' && obj.attrs && obj.attrs[0] && obj.attrs[0].value === 'force'
}

/**
 *
 * @param obj
 */
const parseFaction = obj => {
  try {
    const factionNode = obj.childNodes.find(x => x.nodeName === 'h2')
    const factionValue = factionNode.childNodes[0].value.replace(/.+\((.+)\).+/g, '$1')
    const [alliance, faction] = factionValue.split(' - ').map(x => x.trim())
    return { alliance, faction }
  } catch (err) {
    console.log('There was an error detecting the faction name')
    console.error(err)
    return { alliance: null, faction: null }
  }
}

const isRootSelection = obj => {
  return obj.nodeName === 'li' && obj.attrs && obj.attrs[0] && obj.attrs[0].value === 'rootselection'
}

const traverseDoc = (docObj: Object) => {
  let results = {
    faction: null as any,
    rootSelections: [] as any[],
  }

  const traverse = (obj: Object) => {
    if (!obj.childNodes) return

    // @ts-ignore
    if (isRootSelection(obj)) {
      results.rootSelections.push(obj)
    }

    // @ts-ignore
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

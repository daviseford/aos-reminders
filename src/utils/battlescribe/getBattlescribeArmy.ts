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
      return
    }

    // @ts-ignore
    if (!results.faction && isFactionObj(obj)) {
      results.faction = obj
      return
    }

    if (obj.childNodes.length > 0) {
      obj.childNodes.forEach(traverse)
    }
  }

  traverse(docObj)

  return results
}

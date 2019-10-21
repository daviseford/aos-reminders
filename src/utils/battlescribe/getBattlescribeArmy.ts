//@ts-nocheck
import parse5 from 'parse5'
import { find } from 'lodash'

export const getBattleScribeArmy = (html_string: string) => {
  const document = parse5.parse(html_string)

  const nonCircular = stripParentNode(document)

  // @ts-ignore
  const body = nonCircular.childNodes[2]
  const faction = getFaction(nonCircular)
  const selections = getRootSelections(nonCircular)
  console.log(nonCircular)
  console.log(selections)
  //   console.log(traverseDoc(nonCircular).flat())
}

// Remove empty entries
const cleanHtml = (a: { [key: string]: any }) => {}

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

const getFaction = (document: Object) => {
  const found = find(document, obj => {
    return obj.tagName === 'li'
    //  && obj.attrs && obj.attrs[0] && obj.attrs[0].value === 'force'
  })
  return found
}

const getRootSelections = (docObj: Object) => {
  let results: any[] = []

  const traverse = (obj: Object) => {
    if (!obj.childNodes) return

    // @ts-ignore
    if (obj.nodeName === 'li' && obj.attrs && obj.attrs[0] && obj.attrs[0].value === 'rootselection') {
      results.push(obj)
      return
    }

    if (obj.childNodes.length > 0) {
      obj.childNodes.forEach(traverse)
    }
  }

  traverse(docObj)

  return results
}

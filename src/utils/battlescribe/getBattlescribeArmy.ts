//@ts-nocheck
import parse5 from 'parse5'

export const getBattleScribeArmy = (html_string: string) => {
  const document = parse5.parse(html_string)

  const nonCircular = stripParentNode(document)

  // @ts-ignore
  const body = nonCircular.childNodes[2]
  console.log(nonCircular)
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

const getFaction = (document: parse5.Document) => {}

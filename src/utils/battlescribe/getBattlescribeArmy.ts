import parse5 from 'parse5'

export const getBattleScribeArmy = (html_string: string) => {
  const document = parse5.parse(html_string)

  // @ts-ignore
  const body = document.childNodes[2]
  console.log(document)
}

const stripParentNode = (document: parse5.Document) => {
  const strip = (a: Object) => {
    //@ts-ignore
    delete a.parentNode
    return a
  }

  return Object.keys(document).reduce((a, k) => {
    const obj = strip(document[k])
    if (obj.childNodes) {
      a[k]
    }
  }, {})
}

const getFaction = (document: parse5.Document) => {}

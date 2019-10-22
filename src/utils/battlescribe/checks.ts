import { IParentNode, IChildNode } from './getBattlescribeArmy'

export const isParentNode = (node: IParentNode | IChildNode | undefined): node is IParentNode =>
  !!node && 'childNodes' in node
export const isChildNode = (node: IParentNode | IChildNode | undefined): node is IChildNode =>
  !!node && 'value' in node

export const isFactionObj = (obj: IParentNode | IChildNode): obj is IParentNode => {
  if (isChildNode(obj)) return false
  return obj.nodeName === 'li' && obj.attrs && obj.attrs[0] && obj.attrs[0].value === 'force'
}

export const isRootSelection = (obj: IParentNode | IChildNode): obj is IParentNode => {
  if (isChildNode(obj)) return false
  return obj.nodeName === 'li' && obj.attrs && obj.attrs[0] && obj.attrs[0].value === 'rootselection'
}

export const isAllegianceObj = (obj: IParentNode | IChildNode): obj is IParentNode => {
  if (isChildNode(obj)) return false
  if (!isRootSelection(obj)) return false
  if (!obj.childNodes.length) return false
  const subObj = obj.childNodes.find(x => {
    return (
      isParentNode(x) &&
      x.nodeName === 'h4' &&
      isChildNode(x.childNodes[0]) &&
      x.childNodes[0].value === 'Allegiance'
    )
  })
  return !!subObj
}

import parse5 from 'parse5'
import { isTest } from 'utils/env'
import { importErrorChecker } from 'utils/import'
import { stripParentNode, traverseDoc, parseRootSelection } from './parseHTML'
import { sortParsedRoots } from './getters'
import { TSupportedFaction } from 'meta/factions'

export const getBattlescribeArmy = (html_string: string) => {
  const army = getInitialBattlescribeArmy(html_string)
  const errorChecked = importErrorChecker(army, 'Battlescribe')

  return errorChecked
}

const getInitialBattlescribeArmy = (html_string: string) => {
  const document = parse5.parse(html_string)

  const strippedDoc = stripParentNode(document as IParentNode)

  const { allegianceInfo, factionInfo, rootSelections } = traverseDoc(strippedDoc)
  const parsedRoots: IParsedRoot[] = rootSelections.map(parseRootSelection)
  const selections = sortParsedRoots(parsedRoots)

  if (!isTest) {
    console.log(strippedDoc)
    console.log(allegianceInfo, factionInfo, rootSelections)
    // console.log(parsedRoots)
    console.log(selections)
  }

  return {
    allyFactionNames: [],
    allySelections: {},
    allyUnits: [],
    errors: [],
    realmscape_feature: null,
    realmscape: null,
    unknownSelections: [],
    factionName: factionInfo.factionName as TSupportedFaction,
    selections: {
      ...selections,
      allegiances: allegianceInfo && allegianceInfo.Allegiance ? [allegianceInfo.Allegiance as string] : [],
    },
  }
}

export interface IParsedRoot {
  name: string
  entries: {
    [key: string]: string[]
  }
}

export interface IAttrs {
  name: string
  value: string
}

export interface IChildNode {
  nodeName: string
  value: string
}

export interface IParentNode {
  nodeName: string
  attrs: IAttrs[]
  childNodes: Array<IChildNode | IParentNode>
}

export interface IFactionInfo {
  grandAlliance: string | null
  factionName: string | null
}

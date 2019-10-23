import parse5 from 'parse5'
import { isTest } from 'utils/env'
import { importErrorChecker } from 'utils/import'
import { stripParentNode, traverseDoc, parseRootSelection } from './parseHTML'
import { sortParsedRoots, getFactionAndAllegiance } from './getters'
import { TSupportedFaction } from 'meta/factions'

export const getBattlescribeArmy = (html_string: string) => {
  const army = getInitialBattlescribeArmy(html_string)
  const errorChecked = importErrorChecker(army, 'Battlescribe')

  if (!isTest) console.log('errorChecked', errorChecked)
  return errorChecked
}

const getInitialBattlescribeArmy = (html_string: string) => {
  const document = parse5.parse(html_string)

  const strippedDoc = stripParentNode(document as IParentNode)

  const { allegianceInfo, factionInfo, realmInfo, rootSelections } = traverseDoc(strippedDoc)
  const { factionName, allegiances } = getFactionAndAllegiance(allegianceInfo, factionInfo)
  const parsedRoots: IParsedRoot[] = rootSelections.map(parseRootSelection)
  const selections = sortParsedRoots(parsedRoots, allegianceInfo)

  if (!isTest) {
    console.log(strippedDoc)
    console.log(allegianceInfo, factionInfo, rootSelections)
    console.log({ factionName, allegiances })
    console.log(parsedRoots)
    console.log(selections)
  }

  return {
    allyFactionNames: [],
    allySelections: {},
    allyUnits: [],
    errors: [],
    realmscape_feature: null,
    realmscape: realmInfo,
    unknownSelections: [],
    factionName: factionName as TSupportedFaction,
    selections: {
      ...selections,
      allegiances,
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

export interface IAllegianceInfo {
  faction: string | null
  allegiance: string | null
  [key: string]: string | string[] | null
}

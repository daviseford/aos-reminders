import { TSupportedFaction } from 'meta/factions'
import parse5 from 'parse5'
import { BATTLESCRIBE, IImportedArmy } from 'types/import'
import { getFactionAndFlavors, sortParsedRoots } from 'utils/battlescribe/getters'
import { parseRootSelection, stripParentNode, traverseDoc } from 'utils/battlescribe/parseHTML'
import { importErrorChecker } from 'utils/import'

export const getBattlescribeArmy = (html_string: string) => {
  const army = getInitialBattlescribeArmy(html_string)
  const errorChecked = importErrorChecker(army, BATTLESCRIBE)

  return errorChecked
}

const getInitialBattlescribeArmy = (html_string: string): IImportedArmy => {
  const document = parse5.parse(html_string)

  const strippedDoc = stripParentNode(document)

  const { allegianceInfo, factionInfo, realmscape, origin_realm, rootSelections } = traverseDoc(strippedDoc)
  const { factionName, subFactionName, flavors } = getFactionAndFlavors(allegianceInfo, factionInfo)
  const parsedRoots: IParsedRoot[] = rootSelections.map(parseRootSelection)
  const selections = sortParsedRoots(parsedRoots, allegianceInfo)

  return {
    allyFactionNames: [],
    allySelections: {},
    allyUnits: [],
    errors: [],
    factionName: factionName as TSupportedFaction,
    subFactionName: subFactionName || '', // TODO
    origin_realm,
    realmscape_feature: null,
    realmscape,
    selections: {
      ...selections,
      flavors,
    },
    unknownSelections: [],
  }
}

export interface IParsedRoot {
  name: string
  entries: {
    [key: string]: string[]
  }
}

interface IAttrs {
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
  subFactionName: string | null
}

export interface IFlavorInfo {
  factionName: string | null
  subFactionName: string | null
  flavors: string[] | null
  [key: string]: string | string[] | null
}

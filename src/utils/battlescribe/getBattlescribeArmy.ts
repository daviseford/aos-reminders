import { TSupportedFaction } from 'meta/factions'
import parse5 from 'parse5'
import { BATTLESCRIBE } from 'types/import'
import { getFactionAndAllegiance as getFactionAndFlavor, sortParsedRoots } from 'utils/battlescribe/getters'
import { parseRootSelection, stripParentNode, traverseDoc } from 'utils/battlescribe/parseHTML'
import { importErrorChecker } from 'utils/import'

export const getBattlescribeArmy = (html_string: string) => {
  const army = getInitialBattlescribeArmy(html_string)
  const errorChecked = importErrorChecker(army, BATTLESCRIBE)

  return errorChecked
}

const getInitialBattlescribeArmy = (html_string: string) => {
  const document = parse5.parse(html_string)

  const strippedDoc = stripParentNode(document as IParentNode)

  const { allegianceInfo, factionInfo, realmscape, origin_realm, rootSelections } = traverseDoc(strippedDoc)
  const { factionName, flavors } = getFactionAndFlavor(allegianceInfo, factionInfo)
  const parsedRoots: IParsedRoot[] = rootSelections.map(parseRootSelection)
  const selections = sortParsedRoots(parsedRoots, allegianceInfo)

  return {
    allyFactionNames: [],
    allySelections: {},
    allyUnits: [],
    errors: [],
    factionName: factionName as TSupportedFaction,
    subFactionName: '', // TODO
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
}

export interface IFlavorInfo {
  faction: string | null
  flavor: string[] | null
  [key: string]: string | string[] | null
}

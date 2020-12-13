import { TGrandAlliances } from 'meta/alliances'
import { TSupportedFaction } from 'meta/factions'
import { TInitialArmy, TSubfactionArmy } from 'types/army'
import { TItemDescriptions } from './factionTypes'
import { getAggregateArmy, temporaryAdapter } from './temporaryAdapter'

/**
 * This class is used to manage Factions
 */
export class Faction<
  F extends TSupportedFaction,
  G extends TGrandAlliances,
  S extends TItemDescriptions,
  K extends Extract<keyof S, string>
> {
  public readonly AggregateArmy: TSubfactionArmy
  public readonly subFactionKeys: K[]
  public readonly subFactionKeyMap: Record<K, K>
  public readonly subFactionArmies: Record<K, TInitialArmy>

  constructor(
    public readonly factionName: F,
    public readonly GrandAlliance: G,
    public readonly SubFactions: S,
    public readonly flavorLabel = 'Flavors',
    public readonly sources = [],
    public readonly isMercenary = false
  ) {
    this.AggregateArmy = getAggregateArmy(SubFactions, flavorLabel)

    this.subFactionKeys = Object.keys(SubFactions) as K[]

    this.subFactionKeyMap = this.subFactionKeys.reduce((a, k) => {
      a[k] = k
      return a
    }, {} as Record<K, K>)

    this.subFactionArmies = this.subFactionKeys.reduce((a, subFactionName) => {
      a[subFactionName] = temporaryAdapter(this.SubFactions[subFactionName], subFactionName, this.flavorLabel)
      return a
    }, {} as Record<K, TInitialArmy>)
  }
}

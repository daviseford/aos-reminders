import { TGrandAlliances } from 'meta/alliances'
import { TSupportedFaction } from 'meta/factions'
import { TInitialArmy } from 'types/army'
import { TItemDescriptions } from './factionTypes'
import { getAggregateArmy, temporaryAdapter } from './temporaryAdapter'

export class Faction {
  public readonly AggregateArmy: TInitialArmy
  public readonly subFactionKeys: string[]
  public readonly subFactionArmies: Record<string, TInitialArmy>

  constructor(
    public readonly factionName: TSupportedFaction,
    public readonly GrandAlliance: TGrandAlliances,
    public readonly SubFactions: TItemDescriptions,
    public readonly subFactionLabel = 'Sub-Factions',
    public readonly flavorLabel = 'Flavors'
  ) {
    this.AggregateArmy = getAggregateArmy(SubFactions, flavorLabel)
    this.subFactionKeys = Object.keys(SubFactions)
    this.subFactionArmies = this.subFactionKeys.reduce((a, subFactionName) => {
      a[subFactionName] = temporaryAdapter(this.SubFactions[subFactionName], subFactionName, this.flavorLabel)
      return a
    }, {} as Record<string, TInitialArmy>)
  }
}

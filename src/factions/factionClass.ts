import { uniq } from 'lodash'
import { TGrandAlliances } from 'meta/alliances'
import { TSupportedFaction } from 'meta/factions'
import { TRuleSource } from 'meta/rule_sources'
import { TSubfactionArmy } from 'types/army'
import { SELECTION_TYPES, TEffects } from 'types/data'
import { TSelectionTypes } from 'types/selections'
import { TItemDescriptions, TItemKey } from './factionTypes'
import { getAggregateArmy, temporaryAdapter } from './temporaryAdapter'

/**
 * This class is used to manage Factions
 */
export class Faction<
  F extends TSupportedFaction,
  G extends TGrandAlliances,
  S extends TItemDescriptions,
  K extends Extract<keyof S, string>,
  RS extends TRuleSource,
  BT extends TEffects[],
> {
  public readonly AggregateArmy: TSubfactionArmy
  public readonly flavorKeys: string[] = []
  public readonly subFactionKeys: string[]
  public readonly subFactionKeyMap: Record<K, K>
  public readonly subFactionArmies: Record<K, TSubfactionArmy>

  constructor(
    public readonly factionName: F,
    public readonly GrandAlliance: G,
    public readonly SubFactions: S,
    public readonly flavorLabel = 'Flavors',
    public readonly rule_source?: RS,
    /**
     * Battle traits that are shared for the whole faction
     *  (useful when there are multiple subfactions
     *  that have their own battle traits,
     *  but share the parent factions battle traits as well,
     *  e.g. Soulblight Gravelords)
     */
    public readonly factionBattleTraits?: BT,
    public readonly isMercenary = false
  ) {
    this.AggregateArmy = getAggregateArmy(SubFactions, flavorLabel)

    this.flavorKeys = this.AggregateArmy.Flavors.map(x => x.name)

    this.subFactionKeys = Object.keys(SubFactions) as K[]

    this.subFactionKeyMap = this.subFactionKeys.reduce(
      (a, k) => {
        a[k] = k
        return a
      },
      {} as Record<K, K>
    )

    this.subFactionArmies = this.subFactionKeys.reduce(
      (a, subFactionName) => {
        a[subFactionName] = temporaryAdapter(
          this.SubFactions[subFactionName],
          subFactionName,
          this.flavorLabel
        )
        return a
      },
      {} as Record<K, TSubfactionArmy>
    )

    this.checkForDataEntryErrors()
  }

  /** Throw an error if we've got bad data (this will discover bad data entry) */
  private checkForDataEntryErrors = () => {
    const validSelectionKeys: TItemKey[] = [...SELECTION_TYPES, 'allied_units']

    this.subFactionKeys.forEach(k => {
      const allKeys = uniq([
        ...Object.keys(this.SubFactions[k]?.available ?? {}),
        ...Object.keys(this.SubFactions[k]?.mandatory ?? {}),
      ]) as TSelectionTypes[]

      allKeys.forEach(selection => {
        if (!validSelectionKeys.includes(selection)) {
          throw new Error(
            `${this.factionName} subfaction ${k} has an invalid/unknown key: ${selection}. Please check your data in this faction's subfactions.ts file`
          )
        }
      })
    })
  }
}

// export type TGenericFaction = Faction<
//   TSupportedFaction,
//   TGrandAlliances,
//   TItemDescriptions,
//   string,
//   TRuleSource,
//   TEffects[]
// >

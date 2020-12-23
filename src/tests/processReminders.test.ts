// Army Imports
import { SylvanethFaction } from 'factions/sylvaneth'
import {
  GenericCommandAbilities,
  GenericTriumphs,
  RealmscapeCommands,
  RealmscapeFeatures,
} from 'generic_rules'
// Meta
import { SYLVANETH } from 'meta/factions'
// Types
import { IArmy } from 'types/army'
import { TTurnAction } from 'types/data'
import { getArmy } from 'utils/getArmy/getArmy'
import { processReminders } from 'utils/processReminders'
import { getRealmscape } from 'utils/realmUtils'
import { selectionsFactory } from './__mock'

describe('processReminders', () => {
  it('should work with a loaded army, multiple allies, and realmscape', () => {
    // const allyUnits = [OrrukWarclansFaction.SubFactions., ironjawz.Units[1], seraphon.Units[0]]
    // const allyFactionNames = [SKAVENTIDE, IRONJAWZ, SERAPHON]
    // const allyArmies: TAllyArmies = {
    //   [SKAVENTIDE]: getArmy(SKAVENTIDE) as IArmy,
    //   [IRONJAWZ]: getArmy(IRONJAWZ) as IArmy,
    //   [SERAPHON]: getArmy(SERAPHON) as IArmy,
    // }

    // const allySelections = {
    //   [SKAVENTIDE]: allySelectionsFactory(),
    //   [IRONJAWZ]: allySelectionsFactory([allyUnits[0].name, allyUnits[1].name]),
    //   [SERAPHON]: allySelectionsFactory([allyUnits[2].name]),
    // }

    const artifact = SylvanethFaction.AggregateArmy.Artifacts?.[0]
    const battalion = SylvanethFaction.AggregateArmy.Battalions?.[0]
    const command_trait = SylvanethFaction.AggregateArmy.CommandTraits?.[0]
    const command1 = GenericCommandAbilities[0]
    const command2 = RealmscapeCommands[0]
    const endless_spell = SylvanethFaction.AggregateArmy.EndlessSpells?.[0]
    const flavor = SylvanethFaction.AggregateArmy.Flavors?.[0]
    const scenery = SylvanethFaction.AggregateArmy.Scenery?.[0]
    const spell1 = SylvanethFaction.AggregateArmy.Spells?.[0]
    const spell2 = SylvanethFaction.AggregateArmy.Spells?.[1]
    const triumph = GenericTriumphs[0]
    const unit = SylvanethFaction.AggregateArmy.Units?.[0]

    const army = getArmy(SYLVANETH, null, null, getRealmscape(command2.name)) as IArmy

    const selections = selectionsFactory({
      // @ts-ignore
      artifacts: [artifact.name],
      // @ts-ignore
      battalions: [battalion.name],
      // @ts-ignore
      command_abilities: [command1.name, command2.name],
      // @ts-ignore
      command_traits: [command_trait.name],
      // @ts-ignore
      endless_spells: [endless_spell.name],
      // @ts-ignore
      flavors: [flavor.name],
      // @ts-ignore
      scenery: [scenery.name],
      // @ts-ignore
      spells: [spell1.name, spell2.name],
      // @ts-ignore
      triumphs: [triumph.name],
      // @ts-ignore
      units: [unit.name],
      // @ts-ignore
    })
    const realmscape_feature = RealmscapeFeatures[0]
    const reminders = processReminders(army, SYLVANETH, selections, realmscape_feature.name, [], {}, {})

    const testEntries = [
      artifact,
      battalion,
      command_trait,
      command1,
      command2,
      endless_spell,
      flavor,
      scenery,
      spell1,
      spell2,
      triumph,
      unit,
    ]
    testEntries.forEach(entry => {
      const effect = entry
        ? reminders[entry.effects[0].when[0]].find(({ condition }) => condition[0] === entry.name)
        : undefined
      expect(effect).toBeDefined()
    })

    // Check for Allegiance ability
    const ability = SylvanethFaction.AggregateArmy.BattleTraits?.[0]
    const abilityEffect = ability
      ? reminders[ability.when[0]].find(({ name }) => {
          return name === ability.name
        })
      : undefined
    expect(abilityEffect).toBeDefined()
    expect((abilityEffect as TTurnAction).condition[0]).toEqual(`Sylvaneth Allegiance`)

    // Check for Realmscape info
    const realmscapeEffect = reminders[realmscape_feature.when[0]].find(
      ({ name }) => name === realmscape_feature.name
    )
    expect(realmscapeEffect).toBeDefined()
    expect((realmscapeEffect as TTurnAction).condition[0]).toEqual('Realmscape Feature')
  })
})

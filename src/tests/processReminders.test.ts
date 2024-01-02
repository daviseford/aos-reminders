import IronjawzBattleTraits from 'factions/orruk_warclans/ironjawz/battle_traits'
import { SylvanethFaction } from 'factions/sylvaneth'
import { GenericCommandAbilities, GenericTriumphs } from 'generic_rules'
import { ORRUK_WARCLANS, SYLVANETH } from 'meta/factions'
import { IArmy } from 'types/army'
import { TTurnAction } from 'types/data'
import { getArmy } from 'utils/getArmy/getArmy'
import { processReminders } from 'utils/processReminders'
import { selectionsFactory } from './__mock'

describe('processReminders', () => {
  it('should work with a loaded army and multiple allies', () => {
    const artifact = SylvanethFaction.AggregateArmy.Artifacts?.[0]
    const command_trait = SylvanethFaction.AggregateArmy.CommandTraits?.[0]
    const command1 = GenericCommandAbilities[0]
    const endless_spell = SylvanethFaction.AggregateArmy.EndlessSpells?.[0]
    const flavor = SylvanethFaction.AggregateArmy.Flavors?.[0]
    const scenery = SylvanethFaction.AggregateArmy.Scenery?.[0]
    const spell1 = SylvanethFaction.AggregateArmy.Spells?.[0]
    const spell2 = SylvanethFaction.AggregateArmy.Spells?.[1]
    const triumph = GenericTriumphs[0]
    const unit = SylvanethFaction.AggregateArmy.Units?.[0]

    const army = getArmy(SYLVANETH, null, null, null) as IArmy

    const selections = selectionsFactory({
      artifacts: [artifact.name],
      battalions: [],
      command_abilities: [command1.name],
      command_traits: [command_trait.name],
      endless_spells: [endless_spell.name],
      flavors: [flavor.name],
      scenery: [scenery.name],
      spells: [spell1.name, spell2.name],
      triumphs: [triumph.name],
      units: [unit.name],
    })
    const reminders = processReminders(army, SYLVANETH, SYLVANETH, selections, null, [], {}, {})

    const testEntries = [
      artifact,
      command_trait,
      command1,
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
  })

  it('should correctly attribute allegiance abilities to subfactions', () => {
    const army = getArmy(ORRUK_WARCLANS, 'Ironjawz', null, null) as IArmy

    const selections = selectionsFactory({})
    const reminders = processReminders(army, ORRUK_WARCLANS, 'Ironjawz', selections, null, [], {}, {})

    // Check for Allegiance ability
    const ability = IronjawzBattleTraits['Smashing and Bashing']

    const abilityEffect = ability
      ? reminders[ability.effects[0].when[0]].find(({ name }) => {
          return name === ability.effects[0].name
        })
      : undefined

    expect(abilityEffect).toBeDefined()
    expect((abilityEffect as TTurnAction).condition[0]).toEqual(`Ironjawz Allegiance`)
  })
})

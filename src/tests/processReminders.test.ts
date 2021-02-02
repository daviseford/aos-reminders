// Army Imports
import { OrrukWarclansFaction } from 'factions/orruk_warclans'
import { SylvanethFaction } from 'factions/sylvaneth'
import {
  GenericCommandAbilities,
  GenericTriumphs,
  RealmscapeCommands,
  RealmscapeFeatures,
} from 'generic_rules'
// Meta
import { DAUGHTERS_OF_KHAINE, ORRUK_WARCLANS, SYLVANETH } from 'meta/factions'
// Types
import { IArmy } from 'types/army'
import { TTurnAction } from 'types/data'
import { getArmy } from 'utils/getArmy/getArmy'
import { processConditions, processReminders } from 'utils/processReminders'
import { getRealmscape } from 'utils/realmUtils'
import { selectionsFactory } from './__mock'

describe('processReminders', () => {
  it('should work with a loaded army, multiple allies, and realmscape', () => {
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
      artifacts: [artifact.name],
      battalions: [battalion.name],
      command_abilities: [command1.name, command2.name],
      command_traits: [command_trait.name],
      endless_spells: [endless_spell.name],
      flavors: [flavor.name],
      scenery: [scenery.name],
      spells: [spell1.name, spell2.name],
      triumphs: [triumph.name],
      units: [unit.name],
    })
    const realmscape_feature = RealmscapeFeatures[0]
    const reminders = processReminders(
      army,
      SYLVANETH,
      SYLVANETH,
      selections,
      realmscape_feature.name,
      [],
      {},
      {}
    )

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

  it('should correctly attribute allegiance abilities to subfactions', () => {
    const army = getArmy(ORRUK_WARCLANS, 'Ironjawz', null, null) as IArmy

    const selections = selectionsFactory({})
    const reminders = processReminders(army, ORRUK_WARCLANS, 'Ironjawz', selections, null, [], {}, {})

    // Check for Allegiance ability
    const ability = OrrukWarclansFaction.AggregateArmy.BattleTraits[0]
    const abilityEffect = ability
      ? reminders[ability.when[0]].find(({ name }) => {
          return name === ability.name
        })
      : undefined
    expect(abilityEffect).toBeDefined()
    expect((abilityEffect as TTurnAction).condition[0]).toEqual(`Ironjawz Allegiance`)
  })

  // fixes https://github.com/daviseford/aos-reminders/issues/1210
  it('should work with Rune of Khaine', () => {
    const selections = {
      artifacts: ['Iron Circlet'],
      battalions: [],
      command_abilities: ['Worship Through Bloodshed'],
      command_traits: ['Mistress of Illusion'],
      endless_spells: [],
      flavors: ['Khailebron'],
      mount_traits: [],
      prayers: [
        'Catechism of Murder',
        'Sacrament of Blood',
        'Rune of Khaine',
        'Touch of Death',
        'Wrath of Khaine',
      ],
      scenery: [],
      spells: ['Mindrazor', 'Black Horror of Ulgu'],
      triumphs: [],
      units: [
        'Hag Queen on Cauldron of Blood',
        'Hag Queen',
        'The Shadow Queen',
        'Morathi-Khaine',
        'Sisters of Slaughter',
        'Witch Aelves',
        'Khainite Shadowstalkers',
        'Blood Stalkers',
      ],
    }
    const army = getArmy(DAUGHTERS_OF_KHAINE, DAUGHTERS_OF_KHAINE, null, null) as IArmy
    const reminders = processConditions(army.Game, selections, {})

    const runeOfKhaineArtifact = reminders.WOUND_ALLOCATION.find(
      x => x.name === 'Rune of Khaine' && x.artifact === true
    )
    const runeOfKhainePrayer = reminders.DURING_COMBAT_PHASE.find(
      x => x.name === 'Rune of Khaine' && x.prayer === true
    )
    const khailebroneEffect = reminders.DURING_SHOOTING_PHASE.find(
      x => x.name === 'Concealment and Stealth' && x.condition[0] === 'Khailebron'
    )

    expect(runeOfKhaineArtifact).toBeUndefined()
    expect(runeOfKhainePrayer).toBeDefined()
    expect(khailebroneEffect).toBeDefined()
  })
})

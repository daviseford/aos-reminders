import { flatten } from 'lodash'
import { selectionsFactory, allySelectionsFactory } from './__mock'
import { getArmy } from 'utils/getArmy/getArmy'
import { processReminders, addToString } from 'utils/processReminders'

// Army Imports
import ironjawz from 'army/ironjawz'
import seraphon from 'army/seraphon'
import sylvaneth from 'army/sylvaneth'
import {
  GenericCommands,
  GenericEndlessSpells,
  GenericTriumphs,
  RealmscapeFeatures,
  RealmscapeCommands,
} from 'army/generic'

// Meta
import {
  BEASTCLAW_RAIDERS,
  DISPOSSESSED,
  EVERCHOSEN,
  IRONJAWZ,
  SERAPHON,
  STORMCAST_ETERNALS,
  SYLVANETH,
} from 'meta/factions'

// Types
import { HERO_PHASE, SHOOTING_PHASE, COMBAT_PHASE, START_OF_HERO_PHASE } from 'types/phases'
import { IArmy, TAllyArmies } from 'types/army'
import { TTurnAction } from 'types/data'
import { getRealmscape } from 'utils/realmUtils'

describe('processReminders', () => {
  it('should work with no selections', () => {
    const army = getArmy(BEASTCLAW_RAIDERS) as IArmy
    const selections = selectionsFactory({})
    const reminders = processReminders(army, BEASTCLAW_RAIDERS, selections, null, [], {}, {})

    const heroPhaseEntry = reminders[START_OF_HERO_PHASE][0]
    expect(heroPhaseEntry.name).toEqual(`The Everwinter's Blessing`)
    expect(heroPhaseEntry.condition).toEqual(`Beastclaw Raiders Allegiance`)
    expect(heroPhaseEntry.allegiance_ability).toEqual(true)

    const combatPhaseEntry = reminders[COMBAT_PHASE][0]
    expect(combatPhaseEntry.name).toEqual(`Beastclaw Stampede`)
    expect(combatPhaseEntry.condition).toEqual(`Beastclaw Raiders Allegiance`)
    expect(combatPhaseEntry.allegiance_ability).toEqual(true)
  })

  it('should merge similar abilities (issue #183)', () => {
    const army = getArmy(STORMCAST_ETERNALS) as IArmy
    const selections = selectionsFactory({ units: ['Drakesworn Templar', 'Lord-Celestant on Stardrake'] })
    const reminders = processReminders(army, STORMCAST_ETERNALS, selections, null, [], {}, {})

    // The test case defined for me in issue #183
    const mergedHeroAbility = reminders[HERO_PHASE].find(
      ({ condition }) => condition === 'Drakesworn Templar, Lord-Celestant on Stardrake'
    )
    expect(mergedHeroAbility).toBeDefined()

    // Two more expected merged abilities
    const mergedCombatAbilities = reminders[COMBAT_PHASE].filter(
      ({ condition }) => condition === 'Drakesworn Templar, Lord-Celestant on Stardrake'
    )
    expect(mergedCombatAbilities.length).toEqual(2)

    // Test case because this was an indicator of breaking before
    const skyboltBow = reminders[SHOOTING_PHASE].find(({ name }) => name === 'Skybolt Bow')
    expect(skyboltBow).toBeDefined()
    expect(skyboltBow && skyboltBow.condition).toEqual('Drakesworn Templar')
  })

  it('should not merge abilities with the same name but different descriptions (issue #186)', () => {
    const endless_spells = GenericEndlessSpells.filter(x => x.effects.some(y => y.name === 'Predatory'))
      .map(x => x.name)
      .slice(0, 3)
    const army = getArmy(EVERCHOSEN) as IArmy
    const selections = selectionsFactory({ endless_spells })
    const reminders = processReminders(army, EVERCHOSEN, selections, null, [], {}, {})
    const flattenedGame = flatten(Object.values(reminders))

    expect(flattenedGame.filter(x => x.name === 'Predatory').length).toEqual(3)

    const mergedAbility = reminders[HERO_PHASE].find(
      ({ condition }) => condition === addToString(``, endless_spells.join(`, `))
    )
    expect(mergedAbility).toBeUndefined()
  })

  it('should work with a loaded army, multiple allies, and realmscape', () => {
    const allyUnits = [ironjawz.Units[0], ironjawz.Units[1], seraphon.Units[0]]
    const allyFactionNames = [DISPOSSESSED, IRONJAWZ, SERAPHON]
    const allyArmies: TAllyArmies = {
      [DISPOSSESSED]: getArmy(DISPOSSESSED) as IArmy,
      [IRONJAWZ]: getArmy(IRONJAWZ) as IArmy,
      [SERAPHON]: getArmy(SERAPHON) as IArmy,
    }

    const allySelections = {
      [DISPOSSESSED]: allySelectionsFactory(),
      [IRONJAWZ]: allySelectionsFactory([allyUnits[0].name, allyUnits[1].name]),
      [SERAPHON]: allySelectionsFactory([allyUnits[2].name]),
    }

    const allegiance = sylvaneth.Allegiances[0]
    const artifact = sylvaneth.Artifacts[0]
    const battalion = sylvaneth.Battalions[0]
    const command1 = GenericCommands[0]
    const command2 = RealmscapeCommands[0]
    const endless_spell = sylvaneth.EndlessSpells[0]
    const scenery = sylvaneth.Scenery[0]
    const spell1 = sylvaneth.Spells[0]
    const spell2 = sylvaneth.Spells[1]
    const trait = sylvaneth.Traits[0]
    const triumph = GenericTriumphs[0]
    const unit = sylvaneth.Units[0]

    const army = getArmy(SYLVANETH, getRealmscape(command2.name)) as IArmy

    const selections = selectionsFactory({
      allegiances: [allegiance.name],
      artifacts: [artifact.name],
      battalions: [battalion.name],
      commands: [command1.name, command2.name],
      endless_spells: [endless_spell.name],
      scenery: [scenery.name],
      spells: [spell1.name, spell2.name],
      traits: [trait.name],
      triumphs: [triumph.name],
      units: [unit.name],
    })
    const realmscape_feature = RealmscapeFeatures[0]
    const reminders = processReminders(
      army,
      SYLVANETH,
      selections,
      realmscape_feature.name,
      allyFactionNames,
      allyArmies,
      allySelections
    )

    const testEntries = [
      ...allyUnits,
      allegiance,
      artifact,
      battalion,
      command1,
      command2,
      endless_spell,
      scenery,
      spell1,
      spell2,
      trait,
      triumph,
      unit,
    ]
    testEntries.forEach(entry => {
      const effect = reminders[entry.effects[0].when[0]].find(({ condition }) => condition === entry.name)
      expect(effect).toBeDefined()
    })

    // Check for Allegiance ability
    const ability = sylvaneth.Abilities[0]
    const abilityEffect = reminders[ability.when[0]].find(({ name }) => {
      return name === ability.name
    })
    expect(abilityEffect).toBeDefined()
    expect((abilityEffect as TTurnAction).condition).toEqual(`Sylvaneth Allegiance`)

    // Check for Realmscape info
    const realmscapeEffect = reminders[realmscape_feature.when[0]].find(
      ({ name }) => name === realmscape_feature.name
    )
    expect(realmscapeEffect).toBeDefined()
    expect((realmscapeEffect as TTurnAction).condition).toEqual('Realmscape Feature')
  })
})

import { selectionsFactory, allySelectionsFactory } from './__mock'
import { processReminders, addToString } from 'utils/processReminders'
import ironjawz from 'army/ironjawz'
import seraphon from 'army/seraphon'
import sylvaneth from 'army/sylvaneth'
import {
  BEASTCLAW_RAIDERS,
  DISPOSSESSED,
  EVERCHOSEN,
  IRONJAWZ,
  SERAPHON,
  STORMCAST_ETERNALS,
  SYLVANETH,
} from '../meta/factions'
import { RealmscapeFeatures } from 'army/malign_sorcery'
import { getArmy } from '../utils/getArmy'
import { IArmy, TAllyData } from '../types/army'
import { HERO_PHASE, SHOOTING_PHASE, COMBAT_PHASE, START_OF_HERO_PHASE } from 'types/phases'
import { ITurnAction } from 'types/data'
import { GenericEndlessSpells } from 'army/generic'
import { sortBy } from 'lodash'

describe('processReminders', () => {
  it('should work with no selections', () => {
    const army = getArmy(BEASTCLAW_RAIDERS) as IArmy
    const selections = selectionsFactory({})
    const reminders = processReminders(army, BEASTCLAW_RAIDERS, selections, null, [])

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
    const reminders = processReminders(army, STORMCAST_ETERNALS, selections, null, [])

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
    const reminders = processReminders(army, EVERCHOSEN, selections, null, [])

    expect(reminders[HERO_PHASE].filter(x => x.name === 'Predatory').length).toEqual(3)

    const mergedAbility = reminders[HERO_PHASE].find(
      ({ condition }) => condition === addToString(``, endless_spells.join(`, `))
    )
    expect(mergedAbility).toBeUndefined()
  })

  it('should work with a loaded army,  multiple allies, and realmscape', () => {
    const allyUnits = [ironjawz.Units[0], ironjawz.Units[1], seraphon.Units[0]]
    const allyData: TAllyData = [
      { allyArmy: getArmy(DISPOSSESSED) as IArmy, allySelections: allySelectionsFactory() },
      {
        allyArmy: getArmy(IRONJAWZ) as IArmy,
        allySelections: allySelectionsFactory([allyUnits[0].name, allyUnits[1].name]),
      },
      { allyArmy: getArmy(SERAPHON) as IArmy, allySelections: allySelectionsFactory([allyUnits[2].name]) },
    ]
    const army = getArmy(SYLVANETH) as IArmy

    const allegiances = sylvaneth.Allegiances[0]
    const artifact = sylvaneth.Artifacts[0]
    const battalion = sylvaneth.Battalions[0]
    const endless_spells = sylvaneth.EndlessSpells[0]
    const spell1 = sylvaneth.Spells[0]
    const spell2 = sylvaneth.Spells[1]
    const trait = sylvaneth.Traits[0]
    const unit = sylvaneth.Units[0]

    const selections = selectionsFactory({
      allegiances: [allegiances.name],
      artifacts: [artifact.name],
      battalions: [battalion.name],
      endless_spells: [endless_spells.name],
      spells: [spell1.name, spell2.name],
      traits: [trait.name],
      units: [unit.name],
    })
    const realmscape_feature = RealmscapeFeatures[0]
    const reminders = processReminders(army, SYLVANETH, selections, realmscape_feature.name, allyData)

    const testEntries = [
      ...allyUnits,
      allegiances,
      artifact,
      battalion,
      endless_spells,
      spell1,
      spell2,
      trait,
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
    expect((abilityEffect as ITurnAction).condition).toEqual(`Sylvaneth Allegiance`)

    // Check for Realmscape info
    const realmscapeEffect = reminders[realmscape_feature.when[0]].find(
      ({ name }) => name === realmscape_feature.name
    )
    expect(realmscapeEffect).toBeDefined()
    expect((realmscapeEffect as ITurnAction).condition).toEqual('Realmscape Feature')
  })
})

describe('getArmy', () => {
  it('adds GenericEndlessSpells to every army', () => {
    const endlessSpellList = sortBy(GenericEndlessSpells.map(x => x.name))
    const army = getArmy(EVERCHOSEN) as IArmy
    const armyEndlessSpells = sortBy(army.EndlessSpells.map(x => x.name))
    expect(armyEndlessSpells).toEqual(endlessSpellList)

    // Make sure we don't add duplicates (was an issue before using Immer)
    const army2 = getArmy(EVERCHOSEN) as IArmy
    const armyEndlessSpells2 = sortBy(army2.EndlessSpells.map(x => x.name))
    expect(armyEndlessSpells2).toEqual(endlessSpellList)
  })

  it('adds Allegiances to every army', () => {
    const numEntries = sylvaneth.Allegiances.length
    const army1 = getArmy(SYLVANETH) as IArmy

    expect(army1.Allegiances).toBeDefined()
    expect(army1.Allegiances.length).toEqual(numEntries)

    const army2 = getArmy(SERAPHON) as IArmy
    expect(army2.Allegiances).toBeDefined()
    expect(army2.Allegiances.length).toEqual(0)
  })
})

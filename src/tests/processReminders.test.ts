import { selectionsFactory, allySelectionsFactory } from './__mock'
import { getArmy } from 'utils/getArmy/getArmy'
import { processReminders } from 'utils/processReminders'

// Army Imports
import ironjawz from 'army/ironjawz'
import seraphon from 'army/seraphon'
import sylvaneth from 'army/sylvaneth'
import { GenericCommands, GenericTriumphs, RealmscapeFeatures, RealmscapeCommands } from 'army/generic'

// Meta
import { DISPOSSESSED, IRONJAWZ, SERAPHON, SYLVANETH } from 'meta/factions'

// Types
import { IArmy, TAllyArmies } from 'types/army'
import { TTurnAction } from 'types/data'
import { getRealmscape } from 'utils/realmUtils'

describe('processReminders', () => {
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
      const effect = reminders[entry.effects[0].when[0]].find(({ condition }) => condition[0] === entry.name)
      expect(effect).toBeDefined()
    })

    // Check for Allegiance ability
    const ability = sylvaneth.Abilities[0]
    const abilityEffect = reminders[ability.when[0]].find(({ name }) => {
      return name === ability.name
    })
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

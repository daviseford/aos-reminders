import { GenericCommands, GenericTriumphs, RealmscapeCommands, RealmscapeFeatures } from 'army/generic'
// Army Imports
import ironjawz from 'army/ironjawz'
import seraphon from 'army/seraphon'
import sylvaneth from 'army/sylvaneth'
// Meta
import { IRONJAWZ, SERAPHON, SKAVEN, SYLVANETH } from 'meta/factions'
// Types
import { IArmy, TAllyArmies } from 'types/army'
import { TTurnAction } from 'types/data'
import { getArmy } from 'utils/getArmy/getArmy'
import { processReminders } from 'utils/processReminders'
import { getRealmscape } from 'utils/realmUtils'
import { allySelectionsFactory, selectionsFactory } from './__mock'

describe('processReminders', () => {
  it('should work with a loaded army, multiple allies, and realmscape', () => {
    const allyUnits = [ironjawz.Units[0], ironjawz.Units[1], seraphon.Units[0]]
    const allyFactionNames = [SKAVEN, IRONJAWZ, SERAPHON]
    const allyArmies: TAllyArmies = {
      [SKAVEN]: getArmy(SKAVEN) as IArmy,
      [IRONJAWZ]: getArmy(IRONJAWZ) as IArmy,
      [SERAPHON]: getArmy(SERAPHON) as IArmy,
    }

    const allySelections = {
      [SKAVEN]: allySelectionsFactory(),
      [IRONJAWZ]: allySelectionsFactory([allyUnits[0].name, allyUnits[1].name]),
      [SERAPHON]: allySelectionsFactory([allyUnits[2].name]),
    }

    const artifact = sylvaneth.Artifacts[0]
    const battalion = sylvaneth.Battalions[0]
    const command_trait = sylvaneth.Traits[0]
    const command1 = GenericCommands[0]
    const command2 = RealmscapeCommands[0]
    const endless_spell = sylvaneth.EndlessSpells[0]
    const flavor = sylvaneth.Allegiances[0]
    const scenery = sylvaneth.Scenery[0]
    const spell1 = sylvaneth.Spells[0]
    const spell2 = sylvaneth.Spells[1]
    const triumph = GenericTriumphs[0]
    const unit = sylvaneth.Units[0]

    const army = getArmy(SYLVANETH, null, getRealmscape(command2.name)) as IArmy

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
      selections,
      realmscape_feature.name,
      allyFactionNames,
      allyArmies,
      allySelections
    )

    const testEntries = [
      ...allyUnits,
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

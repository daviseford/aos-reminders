// Army Imports
import beasts_of_chaos from 'army/beasts_of_chaos'
import { GenericEndlessSpells, GenericScenery, GenericTriumphs } from 'army/generic'
import seraphon from 'army/seraphon'
import sylvaneth from 'army/sylvaneth'
import { sortBy } from 'lodash'
import { ORDER } from 'meta/alliances'
// Meta
import { BEASTS_OF_CHAOS, SERAPHON, SYLVANETH } from 'meta/factions'
// Types
import { IArmy } from 'types/army'
import { getAllianceItems } from 'utils/getArmy/getAllianceItems'
import { getArmy } from 'utils/getArmy/getArmy'

describe('getArmy', () => {
  it('adds Grand Alliance + Generic Endless Spells to an army', () => {
    const genericSpellList = GenericEndlessSpells.map(x => x.name)
    const endlessSpellList = sortBy(
      getAllianceItems(ORDER, 'EndlessSpells', [])
        .map(x => x.name)
        .concat(...genericSpellList)
    )
    const army = getArmy(SERAPHON) as IArmy
    const armyEndlessSpells = sortBy(army.EndlessSpells.map(x => x.name))
    expect(armyEndlessSpells).toEqual(endlessSpellList)

    // Make sure we don't add duplicates (was an issue before using Immer)
    const army2 = getArmy(SERAPHON) as IArmy
    const armyEndlessSpells2 = sortBy(army2.EndlessSpells.map(x => x.name))
    expect(armyEndlessSpells2).toEqual(endlessSpellList)
  })

  it('adds Flavors to an army', () => {
    const numEntries = sylvaneth.Allegiances.length
    const army1 = getArmy(SYLVANETH) as IArmy

    expect(army1.Flavors).toBeDefined()
    expect(army1.Flavors.length).toEqual(numEntries)
  })

  it('adds Scenery to an army', () => {
    const army1SceneryNum = beasts_of_chaos.Scenery.length
    const genericSceneryNum = GenericScenery.length
    const army1 = getArmy(BEASTS_OF_CHAOS) as IArmy

    expect(army1.Scenery).toBeDefined()
    expect(army1.Scenery.length).toEqual(army1SceneryNum + genericSceneryNum)

    const army2SceneryNum = seraphon.Scenery.length
    const army2 = getArmy(SERAPHON) as IArmy
    expect(army2.Scenery).toBeDefined()
    expect(army2.Scenery.length).toEqual(army2SceneryNum + genericSceneryNum)
  })

  it('adds Triumphs to an army', () => {
    const army1 = getArmy(BEASTS_OF_CHAOS) as IArmy

    expect(army1.Triumphs).toBeDefined()
    expect(army1.Triumphs.length).toEqual(GenericTriumphs.length)
  })
})

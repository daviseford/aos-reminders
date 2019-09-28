import { sortBy } from 'lodash'
import { getArmy } from 'utils/getArmy/getArmy'

// Army Imports
import beasts_of_chaos from 'army/beasts_of_chaos'
import sylvaneth from 'army/sylvaneth'
import { GenericEndlessSpells, GenericScenery, GenericTriumphs } from 'army/generic'

// Meta
import { BEASTS_OF_CHAOS, EVERCHOSEN, SERAPHON, SYLVANETH } from 'meta/factions'

// Types
import { IArmy } from 'types/army'

describe('getArmy', () => {
  it('adds GenericEndlessSpells to an army', async () => {
    const endlessSpellList = sortBy(GenericEndlessSpells.map(x => x.name))
    const army = (await getArmy(EVERCHOSEN)) as IArmy
    const armyEndlessSpells = sortBy(army.EndlessSpells.map(x => x.name))
    expect(armyEndlessSpells).toEqual(endlessSpellList)

    // Make sure we don't add duplicates (was an issue before using Immer)
    const army2 = (await getArmy(EVERCHOSEN)) as IArmy
    const armyEndlessSpells2 = sortBy(army2.EndlessSpells.map(x => x.name))
    expect(armyEndlessSpells2).toEqual(endlessSpellList)
  })

  it('adds Allegiances to an army', async () => {
    const numEntries = sylvaneth.Allegiances.length
    const army1 = (await getArmy(SYLVANETH)) as IArmy

    expect(army1.Allegiances).toBeDefined()
    expect(army1.Allegiances.length).toEqual(numEntries)

    const army2 = (await getArmy(SERAPHON)) as IArmy
    expect(army2.Allegiances).toBeDefined()
    expect(army2.Allegiances.length).toEqual(0)
  })

  it('adds Scenery to an army', async () => {
    const army1SceneryNum = beasts_of_chaos.Scenery.length
    const genericSceneryNum = GenericScenery.length
    const army1 = (await getArmy(BEASTS_OF_CHAOS)) as IArmy

    expect(army1.Scenery).toBeDefined()
    expect(army1.Scenery.length).toEqual(army1SceneryNum + genericSceneryNum)

    const army2 = (await getArmy(SERAPHON)) as IArmy
    expect(army2.Scenery).toBeDefined()
    expect(army2.Scenery.length).toEqual(genericSceneryNum)
  })

  it('adds Triumphs to an army', async () => {
    const army1 = (await getArmy(BEASTS_OF_CHAOS)) as IArmy

    expect(army1.Triumphs).toBeDefined()
    expect(army1.Triumphs.length).toEqual(GenericTriumphs.length)
  })
})

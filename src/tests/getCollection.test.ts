import { LEGION_OF_THE_FIRST_PRINCE } from 'meta/factions'
import { getFactionFromList } from 'meta/faction_list'
import { TSubfactionArmy } from 'types/army'
import { getCollection } from 'utils/getArmy/getCollection'

describe('getCollection', () => {
  it('correctly adds Daemon Prince command abilities', () => {
    const { subFactionArmies } = getFactionFromList(LEGION_OF_THE_FIRST_PRINCE)

    const Army: TSubfactionArmy = subFactionArmies[LEGION_OF_THE_FIRST_PRINCE]

    const Collection = getCollection(Army)

    const hasBelakorSpell = Collection.Spells.some(x => x.name === 'Enfeeble Foe')

    expect(hasBelakorSpell).toBeTruthy()
  })
})

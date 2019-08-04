import { selectionsFactory } from './__mock'
import { getArmy } from '../utils/getArmy'
import { STORMCAST_ETERNALS } from '../meta/factions'
import { IArmy } from '../types/army'
import { processReminders } from 'utils/processReminders'
import { HERO_PHASE, SHOOTING_PHASE, COMBAT_PHASE } from 'types/phases'

describe('processReminder', () => {
  const factionName = STORMCAST_ETERNALS
  const army = getArmy(factionName) as IArmy
  it('should merge similar abilities (issue #183)', () => {
    const selections = selectionsFactory({ units: ['Drakesworn Templar', 'Lord-Celestant on Stardrake'] })
    const reminders = processReminders(army, factionName, selections, null, [])

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
})

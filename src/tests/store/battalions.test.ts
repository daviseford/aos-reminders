import { IDropdownOption } from 'components/input/select'
import { selectionActions } from 'ducks'
import { STORMCAST_ETERNALS } from 'meta/factions'
import { ActionMeta } from 'react-select'
import { store } from 'store'
import { IArmy } from 'types/army'
import { getArmy } from 'utils/getArmy/getArmy'
import { getSideEffects } from 'utils/getSideEffects'
import { withSelectMultiWithSideEffects } from 'utils/withSelect'

beforeEach(() => {
  store.dispatch(selectionActions.resetAllSelections())
})

describe('Stormcast battalions', () => {
  const army = getArmy(STORMCAST_ETERNALS) as IArmy
  const setValues = withSelectMultiWithSideEffects(
    selectionActions.setBattalions,
    getSideEffects(army.Battalions),
    STORMCAST_ETERNALS
  )
  const BROTHERHOOD = 'Stormkeep Brotherhood'
  const SUB_BATTALIONS = ['Wardens of the Stormkeep', 'Stormtower Garrison', 'Stormkeep Patrol']

  it('should handle setting a super battalion', () => {
    const option: IDropdownOption = {
      value: BROTHERHOOD,
      label: BROTHERHOOD,
    }
    const values = [option]
    const action: ActionMeta<IDropdownOption> = { option: option, action: 'select-option' }

    setValues(values, action)
    const { selections } = store.getState()

    const expectedUnits = ['Knight-Vexillor', 'Liberators', 'Lord-Veritant', 'Gryph-Hounds']

    expect(selections.selections).toEqual(
      expect.objectContaining({
        battalions: [BROTHERHOOD, ...SUB_BATTALIONS],
        units: expectedUnits,
      })
    )
    expect(selections.sideEffects).toEqual({
      'Stormkeep Brotherhood': {
        battalions: SUB_BATTALIONS,
        units: expectedUnits,
      },
    })
  })

  it('should handle setting and unsetting a super battalion', () => {
    const option: IDropdownOption = {
      value: BROTHERHOOD,
      label: BROTHERHOOD,
    }
    const setAction: ActionMeta<IDropdownOption> = { option: option, action: 'select-option' }
    const unsetAction: ActionMeta<IDropdownOption> = { option: option, action: 'remove-value' }

    setValues([option], setAction)
    setValues([], unsetAction)
    const { selections } = store.getState()

    expect(selections.selections).toEqual(
      expect.objectContaining({
        battalions: [],
        units: [],
      })
    )
    // TODO: resetSideEffects?
    // expect(selections.sideEffects).toEqual({})
  })
})

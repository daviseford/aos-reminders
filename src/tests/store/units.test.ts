import { convertToOptions, TDropdownOption } from 'components/input/select'
import { selectionActions } from 'ducks'
import { DAUGHTERS_OF_KHAINE } from 'meta/factions'
import { ActionMeta } from 'react-select'
import { store } from 'store'
import { IArmy } from 'types/army'
import { getArmy } from 'utils/getArmy/getArmy'
import { getSideEffects } from 'utils/getSideEffects'
import { withSelectMultiWithSideEffects } from 'utils/withSelect'

beforeEach(() => {
  store.dispatch(selectionActions.resetAllSelections())
})

describe('Daughters of Khaine units', () => {
  const army = getArmy(DAUGHTERS_OF_KHAINE) as IArmy
  const setValues = withSelectMultiWithSideEffects(
    selectionActions.setUnits,
    getSideEffects(army.Units),
    DAUGHTERS_OF_KHAINE
  )
  const MORATHI_KHAINE = 'Morathi-Khaine'
  // const SHADOW_QUEEN = 'Shadow Queen'

  it('should handle adding Morathi-Khaine', () => {
    const values = convertToOptions([MORATHI_KHAINE])
    const action: ActionMeta<TDropdownOption> = { option: values[0], action: 'select-option' }

    setValues(values, action)
    const { selections } = store.getState()

    const expectedSideEffects = {
      command_abilities: ['Worship Through Bloodshed'],
      spells: ['Black Horror of Ulgu'],
    }
    expect(selections.selections).toEqual(
      expect.objectContaining({
        ...expectedSideEffects,
        units: [MORATHI_KHAINE],
      })
    )
    expect(selections.sideEffects).toEqual({
      'Morathi-Khaine': {
        ...expectedSideEffects,
      },
    })
  })
})

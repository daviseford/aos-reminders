import { TDropdownOption } from 'components/input/select'
import { selectionActions } from 'ducks'
import { STORMCAST_ETERNALS } from 'meta/factions'
import { ActionMeta } from 'react-select'
import { store } from 'store'
import { IArmy } from 'types/army'
import { getArmy } from 'utils/getArmy/getArmy'
import { getSideEffects } from 'utils/getSideEffects'
import { withSelectMultiWithSideEffects } from 'utils/withSelect'

beforeEach(() => {
  const { resetAllSelections } = selectionActions
  store.dispatch(resetAllSelections())
})

describe('Stormcast flavors', () => {
  const army = getArmy(STORMCAST_ETERNALS) as IArmy
  const setValues = withSelectMultiWithSideEffects(
    selectionActions.setFlavors,
    getSideEffects(army.Flavors),
    STORMCAST_ETERNALS
  )

  it('should handle setFlavors with side effects', () => {
    const option: TDropdownOption = {
      value: 'Anvils of the Heldenhammer (Stormhost)',
      label: 'Anvils of the Heldenhammer (Stormhost)',
    }
    const values = [option]
    const action: ActionMeta<TDropdownOption> = { option: option, action: 'select-option' }

    setValues(values, action)
    const { selections } = store.getState()

    expect(selections.selections).toEqual(
      expect.objectContaining({
        artifacts: ['Soulthief'],
        command_abilities: ['Heroes of Another Age'],
        command_traits: ['Deathly Aura'],
        flavors: ['Anvils of the Heldenhammer (Stormhost)'],
      })
    )
    expect(selections.sideEffects).toEqual({
      'Anvils of the Heldenhammer (Stormhost)': {
        artifacts: ['Soulthief'],
        command_abilities: ['Heroes of Another Age'],
        command_traits: ['Deathly Aura'],
      },
    })
  })

  it('should handle another setFlavors with side effects', () => {
    const option: TDropdownOption = {
      value: 'Hammers of Sigmar (Stormhost)',
      label: 'Hammers of Sigmar (Stormhost)',
    }
    const values = [option]
    const action: ActionMeta<TDropdownOption> = { option: option, action: 'select-option' }

    setValues(values, action)
    const { selections } = store.getState()

    expect(selections.selections).toEqual(
      expect.objectContaining({
        flavors: ['Hammers of Sigmar (Stormhost)'],
        artifacts: ['God-forged Blade'],
        command_abilities: ['Soul of the Stormhost'],
        command_traits: ['We Cannot Fail'],
      })
    )
    expect(selections.sideEffects).toEqual({
      'Hammers of Sigmar (Stormhost)': {
        artifacts: ['God-forged Blade'],
        command_abilities: ['Soul of the Stormhost'],
        command_traits: ['We Cannot Fail'],
      },
    })
  })
})

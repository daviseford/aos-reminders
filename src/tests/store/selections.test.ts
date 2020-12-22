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
    const state = store.getState()
    const selections = state.selections.selections

    expect(selections.flavors).toEqual(['Anvils of the Heldenhammer (Stormhost)'])
    expect(selections.artifacts).toEqual(['Soulthief'])
    expect(selections.command_abilities).toEqual(['Heroes of Another Age'])
    expect(selections.command_traits).toEqual(['Deathly Aura'])
    expect(state.selections.sideEffects).toEqual({
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
    const state = store.getState()
    const selections = state.selections.selections

    expect(selections.flavors).toEqual(['Hammers of Sigmar (Stormhost)'])
    expect(selections.artifacts).toEqual(['God-forged Blade'])
    expect(selections.command_abilities).toEqual(['Soul of the Stormhost'])
    expect(selections.command_traits).toEqual(['We Cannot Fail'])
    expect(state.selections.sideEffects).toEqual({
      'Hammers of Sigmar (Stormhost)': {
        artifacts: ['God-forged Blade'],
        command_abilities: ['Soul of the Stormhost'],
        command_traits: ['We Cannot Fail'],
      },
    })
  })
})

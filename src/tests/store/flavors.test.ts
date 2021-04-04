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

describe('Stormcast flavors', () => {
  const army = getArmy(STORMCAST_ETERNALS) as IArmy
  const setValues = withSelectMultiWithSideEffects(
    selectionActions.setFlavors,
    getSideEffects(army.Flavors),
    STORMCAST_ETERNALS
  )
  const ANVILS = 'Anvils of the Heldenhammer (Stormhost)'
  const HAMMERS = 'Hammers of Sigmar (Stormhost)'

  it('should handle setting a flavor with side effects', () => {
    const option: IDropdownOption = {
      value: ANVILS,
      label: ANVILS,
    }
    const values = [option]
    const action: ActionMeta<IDropdownOption> = { option: option, action: 'select-option' }

    setValues(values, action)
    const { selections } = store.getState()

    const expectedSideEffects = {
      artifacts: ['Soulthief'],
      command_abilities: ['Heroes of Another Age'],
      command_traits: ['Deathly Aura'],
    }
    expect(selections.selections).toEqual(
      expect.objectContaining({
        flavors: [ANVILS],
        ...expectedSideEffects,
      })
    )
    expect(selections.sideEffects).toEqual({
      'Anvils of the Heldenhammer (Stormhost)': {
        ...expectedSideEffects,
      },
    })
  })

  it('should handle setting a different flavor with side effects', () => {
    const option: IDropdownOption = {
      value: HAMMERS,
      label: HAMMERS,
    }
    const values = [option]
    const action: ActionMeta<IDropdownOption> = { option: option, action: 'select-option' }

    setValues(values, action)
    const { selections } = store.getState()

    const expectedSideEffects = {
      artifacts: ['God-forged Blade'],
      command_abilities: ['Soul of the Stormhost'],
      command_traits: ['We Cannot Fail'],
    }
    expect(selections.selections).toEqual(
      expect.objectContaining({
        flavors: [HAMMERS],
        ...expectedSideEffects,
      })
    )
    expect(selections.sideEffects).toEqual({
      'Hammers of Sigmar (Stormhost)': {
        ...expectedSideEffects,
      },
    })
  })

  it('should handle setting a second flavor with side effects', () => {
    const existingOption: IDropdownOption = {
      value: ANVILS,
      label: ANVILS,
    }
    const newOption: IDropdownOption = {
      value: HAMMERS,
      label: HAMMERS,
    }
    const values = [existingOption, newOption]
    const action: ActionMeta<IDropdownOption> = { option: newOption, action: 'select-option' }

    setValues(values, action)
    const { selections } = store.getState()

    expect(selections.selections).toEqual(
      expect.objectContaining({
        flavors: [ANVILS, HAMMERS],
        artifacts: ['Soulthief', 'God-forged Blade'],
        command_abilities: ['Heroes of Another Age', 'Soul of the Stormhost'],
        command_traits: ['Deathly Aura', 'We Cannot Fail'],
      })
    )
    expect(selections.sideEffects).toEqual({
      'Anvils of the Heldenhammer (Stormhost)': {
        artifacts: ['Soulthief'],
        command_abilities: ['Heroes of Another Age'],
        command_traits: ['Deathly Aura'],
      },
      'Hammers of Sigmar (Stormhost)': {
        artifacts: ['God-forged Blade'],
        command_abilities: ['Soul of the Stormhost'],
        command_traits: ['We Cannot Fail'],
      },
    })
  })

  it('should handle setting and unsetting a flavor with side effects', () => {
    const option: IDropdownOption = {
      value: HAMMERS,
      label: HAMMERS,
    }
    const setAction: ActionMeta<IDropdownOption> = { option: option, action: 'select-option' }
    const unsetAction: ActionMeta<IDropdownOption> = { option: option, action: 'remove-value' }

    setValues([option], setAction)
    setValues([], unsetAction)

    const { selections } = store.getState()

    const expectedSideEffects = {
      artifacts: [],
      command_abilities: [],
      command_traits: [],
    }
    expect(selections.selections).toEqual(
      expect.objectContaining({
        flavors: [],
        ...expectedSideEffects,
      })
    )
    // TODO: resetSideEffects?
    // expect(selections.sideEffects).toEqual({})
  })

  it('should handle setting and unsetting a second flavor with side effects', () => {
    const existingOption: IDropdownOption = {
      value: ANVILS,
      label: ANVILS,
    }
    const newOption: IDropdownOption = {
      value: HAMMERS,
      label: HAMMERS,
    }
    const setAction: ActionMeta<IDropdownOption> = { option: newOption, action: 'select-option' }
    const unsetAction: ActionMeta<IDropdownOption> = { option: newOption, action: 'remove-value' }

    setValues([existingOption, newOption], setAction)
    setValues([existingOption], unsetAction)

    const { selections } = store.getState()

    const expectedSideEffects = {
      artifacts: ['Soulthief'],
      command_abilities: ['Heroes of Another Age'],
      command_traits: ['Deathly Aura'],
    }
    expect(selections.selections).toEqual(
      expect.objectContaining({
        flavors: [ANVILS],
        ...expectedSideEffects,
      })
    )
    // TODO: resetSideEffects?
    // expect(selections.sideEffects).toEqual({
    // 'Anvils of the Heldenhammer (Stormhost)': {
    // ...expectedSideEffects,
    // },
    // })
  })
})

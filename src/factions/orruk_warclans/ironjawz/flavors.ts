import { keyPicker } from 'factions/metatagger'
import { CHARGE_PHASE, COMBAT_PHASE, SHOOTING_PHASE } from 'types/phases'
import artifacts from './artifacts'
import command_abilities from './command_abilities'
import command_traits from './command_traits'

const IronjawzFlavors = {
  Ironsunz: {
    mandatory: {
      artifacts: [keyPicker(artifacts, ['Sunzblessed Armour'])],
      command_abilities: [keyPicker(command_abilities, ["Alright - Get 'Em"])],
      command_traits: [keyPicker(command_traits, ['Right Fist of Dakkbad'])],
    },
    effects: [
      {
        name: `Ironsunz Kunnin'`,
        desc: `-1 to be hit for enemy attacks in the first battle round.`,
        when: [SHOOTING_PHASE, COMBAT_PHASE],
      },
    ],
  },
  Bloodtoofs: {
    mandatory: {
      artifacts: [keyPicker(artifacts, ['Quickduff Amulet'])],
      command_abilities: [keyPicker(command_abilities, ['Break Through da Line'])],
      command_traits: [keyPicker(command_traits, ['Get Da Realmgate'])],
    },
    effects: [
      {
        name: `Hunt and Crush`,
        desc: `+1 to run and charge rolls. This stacks with Eager for Battle.`,
        when: [CHARGE_PHASE],
      },
    ],
  },
  'Da Choppas': {
    mandatory: {
      artifacts: [keyPicker(artifacts, ['Megaskull Staff'])],
      command_abilities: [keyPicker(command_abilities, ['Rabble Rouser'])],
      command_traits: [keyPicker(command_traits, ['Checked Out'])],
    },
    effects: [
      {
        name: `Vandal Hordes`,
        desc: `Reroll charges if the unit is within 12" of a terrain feature that's partially or wholly within enemy territory.`,
        when: [CHARGE_PHASE],
      },
    ],
  },
}

// Note: We do NOT use tagAs for Flavors
export default IronjawzFlavors

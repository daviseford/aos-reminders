import { keyPicker } from 'factions/metatagger'
import { COMBAT_PHASE, DURING_GAME, MOVEMENT_PHASE, SHOOTING_PHASE } from 'types/phases'
import artifacts from './artifacts'
import command_abilities from './command_abilities'
import command_traits from './command_traits'

const Flavors = {
  'Morgaunt (Grand Court)': {
    mandatory: {
      artifacts: [keyPicker(artifacts, ['Decrepit Coronet'])],
      command_abilities: [keyPicker(command_abilities, ['Heaving Masses'])],
      command_traits: [keyPicker(command_traits, ['Savage Chivalry'])],
    },
    effects: [
      {
        name: `Bloody Loyalty`,
        desc: `You can reroll hit rolls of 1 for friendly MORGAUNT COURTIER units that are wholly within 12" of a friendly MORGAUNT SERFS unit. In addition, while a friendly MORGAUNT SERFS unit is wholly within 12" of a friendly MORGAUNT COURTIER, its Boundless Ferocity ability activates if the SERFS unit has 10 or more models. You cannot use this command ability more than once per phase.`,
        when: [DURING_GAME],
      },
    ],
  },
  'Hollowmourne (Grand Court)': {
    mandatory: {
      artifacts: [keyPicker(artifacts, ['Corpsefane Gauntlet'])],
      command_abilities: [keyPicker(command_abilities, ['Ravenous Crusaders'])],
      command_traits: [keyPicker(command_traits, ['Grave Robber'])],
    },
    effects: [
      {
        name: `Shattering Charge`,
        desc: `You can reroll wound rolls of 1 for attacks made with melee weapons by friendly HOLLOWMOURNE COURTIER units and friendly HOLLOWMOURNE KNIGHTS units that have made a charge move in the same turn.`,
        when: [COMBAT_PHASE],
      },
    ],
  },
  'Blisterskin (Grand Court)': {
    mandatory: {
      artifacts: [keyPicker(artifacts, ['Eye of Hysh'])],
      command_abilities: [keyPicker(command_abilities, ['Lords of the Burning Skies'])],
      command_traits: [keyPicker(command_traits, ['Hellish Orator'])],
    },
    effects: [
      {
        name: `Blistering Speed`,
        desc: `Add 2" to the Move characteristic of BLISTERSKIN units.`,
        when: [MOVEMENT_PHASE],
      },
    ],
  },
  'Gristlegore (Grand Court)': {
    mandatory: {
      artifacts: [keyPicker(artifacts, ['Ghurish Mawshard'])],
      command_abilities: [keyPicker(command_abilities, ['Call to War'])],
      command_traits: [keyPicker(command_traits, ['Savage Strike'])],
    },
    effects: [
      {
        name: `Peerless Ferocity`,
        desc: `If the unmodified hit roll for an attack made by a GRISTLEGORE HERO or GRISTLEGORE MONSTER is 6, that attack inflicts 2 hits on that target instead of 1. Make a wound and save roll for each hit.`,
        when: [SHOOTING_PHASE, COMBAT_PHASE],
      },
    ],
  },
}

// Note: We do NOT use tagAs for Flavors
export default Flavors

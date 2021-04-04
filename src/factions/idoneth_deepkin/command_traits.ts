import { tagAs } from 'factions/metatagger'
import { BATTLESHOCK_PHASE, CHARGE_PHASE, COMBAT_PHASE, DURING_GAME, MOVEMENT_PHASE } from 'types/phases'

const CommandTraits = {
  'Merciless Raider': {
    effects: [
      {
        name: `Merciless Raider`,
        desc: `You can reroll run rolls and charge rolls for this general.`,
        when: [MOVEMENT_PHASE, CHARGE_PHASE],
      },
    ],
  },
  'Hunter of Souls': {
    effects: [
      {
        name: `Hunter of Souls`,
        desc: `Reroll wound rolls of 1 for this general.`,
        when: [COMBAT_PHASE],
      },
    ],
  },
  'Unstoppable Fury': {
    effects: [
      {
        name: `Unstoppable Fury`,
        desc: `Add 2 to the Attacks characteristic of any weapons used by this general in any battle round in which the High Tide ability is in effect. Note: this only effects the general and not their mount.`,
        when: [COMBAT_PHASE],
      },
    ],
  },
  'Born From Agony': {
    effects: [
      {
        name: `Born From Agony`,
        desc: `Increase this general's Wounds characteristic by 2.`,
        when: [DURING_GAME],
      },
    ],
  },
  'Nightmare Legacy': {
    effects: [
      {
        name: `Nightmare Legacy`,
        desc: `Subtract 1 from the Bravery characteristic of enemy units while they are within 12" of this general.`,
        when: [DURING_GAME, BATTLESHOCK_PHASE],
      },
    ],
  },
  'Lord of Storm and Sea': {
    effects: [
      {
        name: `Lord of Storm and Sea`,
        desc: `Add 2 to the Bravery characteristic of friendly IDONETH DEEPKIN units while they are wholly within 12" of this general.`,
        when: [DURING_GAME, BATTLESHOCK_PHASE],
      },
    ],
  },
  // Ionrach Enclave
  'Emissary of the Deep Places': {
    effects: [
      {
        name: `Emissary of the Deep Places`,
        desc: `Allied units in an Ionrach army are treated as having the Tides of Death battle trait and can therefore use abilities from the Tides of Death table each battle round.`,
        when: [DURING_GAME],
      },
    ],
  },
}

export default tagAs(CommandTraits, 'command_trait')

import { TCommandTraits } from 'types/army'
import {
  BATTLESHOCK_PHASE,
  CHARGE_PHASE,
  COMBAT_PHASE,
  DURING_GAME,
  MOVEMENT_PHASE,
  SAVES_PHASE,
  SHOOTING_PHASE,
} from 'types/phases'

const CommandTraits: TCommandTraits = [
  {
    name: `Merciless Raider`,
    effects: [
      {
        name: `Merciless Raider`,
        desc: `You can reroll run rolls and charge rolls for this general.`,
        when: [MOVEMENT_PHASE, CHARGE_PHASE],
      },
    ],
  },
  {
    name: `Hunter of Souls`,
    effects: [
      {
        name: `Hunter of Souls`,
        desc: `Reroll wound rolls of 1 for this general.`,
        when: [COMBAT_PHASE],
      },
    ],
  },
  {
    name: `Unstoppable Fury`,
    effects: [
      {
        name: `Unstoppable Fury`,
        desc: `Add 2 to the Attacks characteristic of any weapons used by this general in any battle round in which the High Tide ability is in effect. Note: this only effects the general and not their mount.`,
        when: [COMBAT_PHASE],
      },
    ],
  },
  {
    name: `Born From Agony`,
    effects: [
      {
        name: `Born From Agony`,
        desc: `Increase this general's Wounds characteristic by 2.`,
        when: [DURING_GAME],
      },
    ],
  },
  {
    name: `Nightmare Legacy`,
    effects: [
      {
        name: `Nightmare Legacy`,
        desc: `Subtract 1 from the Bravery characteristic of enemy units while they are within 12" of this general.`,
        when: [DURING_GAME, BATTLESHOCK_PHASE],
      },
    ],
  },
  {
    name: `Lord of Storm and Sea`,
    effects: [
      {
        name: `Lord of Storm and Sea`,
        desc: `Add 2 to the Bravery characteristic of friendly IDONETH DEEPKIN units while they are wholly within 12" of this general.`,
        when: [DURING_GAME, BATTLESHOCK_PHASE],
      },
    ],
  },
  {
    name: `Ionrach: Emissary of the Deep Places`,
    effects: [
      {
        name: `Ionrach: Emissary of the Deep Places`,
        desc: `Allied units in an Ionrach army are treated as having the Tides of Death battle trait and can therefore use abilities from the Tides of Death table each battle round.`,
        when: [DURING_GAME],
      },
    ],
  },
  {
    name: `Swift-finned Impaler`,
    effects: [
      {
        name: `Swift-finned Impaler`,
        desc: `If this model's Deepmare Horn roll is a 6, the nearest enemy unit suffers D6 mortal wounds instead of D3 mortal wounds.`,
        when: [CHARGE_PHASE],
        mount_trait: true,
      },
    ],
  },
  {
    name: `Savage Ferocity`,
    effects: [
      {
        name: `Savage Ferocity`,
        desc: `Add 1 to the attacks characteristic of this models Deepmare's Fanged Jaws and Talons and Deepmare's Lashing Tails attacks.`,
        when: [COMBAT_PHASE],
        mount_trait: true,
      },
    ],
  },
  {
    name: `Voidchill Darkness`,
    effects: [
      {
        name: `Voidchill Darkness`,
        desc: `Subtract 1 from hit rolls made against this model by enemies within 3".`,
        when: [SHOOTING_PHASE, COMBAT_PHASE],
        mount_trait: true,
      },
    ],
  },
  {
    name: `Ancient`,
    effects: [
      {
        name: `Ancient`,
        desc: `Attacks against this model with a rend of -1 have a rend of '-' instead.`,
        when: [SAVES_PHASE],
        mount_trait: true,
      },
    ],
  },
  {
    name: `Denizen of the Darkest Depths`,
    effects: [
      {
        name: `Denizen of the Darkest Depths`,
        desc: `Add 1 to the number of mortal wounds inflicted by this model's Crushing Charge. A roll of 1 will inflict 1 mortal wound.`,
        when: [CHARGE_PHASE],
        mount_trait: true,
      },
    ],
  },
  {
    name: `Reverberating Carapace`,
    effects: [
      {
        name: `Reverberating Carapace`,
        desc: `This model's Void Drum ability increases to 15".`,
        when: [SAVES_PHASE],
        mount_trait: true,
      },
    ],
  },
]

export default CommandTraits

import { tagAs } from 'factions/metatagger'
import { COMBAT_PHASE, END_OF_CHARGE_PHASE, MOVEMENT_PHASE, SHOOTING_PHASE } from 'types/phases'

const MountTraits = {
  'Flame-scale Youngblood': {
    effects: [
      {
        name: `Flame-scale Youngblood`,
        desc: `If you carry out a Stomp monstrous rampage (core rules, 21.1) with this unit and the enemy unit you picked suffers any mortal wounds, that enemy unit suffers 3 additional mortal wounds.`,
        when: [END_OF_CHARGE_PHASE],
      },
    ],
  },
  'Lava-Tongue Adult': {
    effects: [
      {
        name: `Lava-Tongue Adult`,
        desc: `When determining the Attacks characteristic of this unit's Roaring Fyrestream, an Attacks characteristic of less than 5 is treated as being 5.`,
        when: [SHOOTING_PHASE],
      },
    ],
  },
  'Coal-heart Ancient': {
    effects: [
      {
        name: `Coal-heart Ancient`,
        desc: `If this unit is the target of an attack made with a melee weapon, subtract 1 from the Damage characteristic of that weapon for that attack (to a minimum of 1).`,
        when: [COMBAT_PHASE],
      },
    ],
  },
  Packdroth: {
    effects: [
      {
        name: `Packdroth`,
        desc: `In your movement phase, before this unit makes a move, you can pick 1 friendly VULKYN FLAMESEEKERS unit to hitch a lift on this MAGMADROTH (see the Skilled Drothwranglers battle trait) even if another unit has already hitched a lift on a MAGMADROTH in the same phase. The same unit cannot hitch a lift on a MAGMADROTH more than once per phase, and multiple units cannot hitch a lift on the same MAGMADROTH in the same phase.`,
        when: [MOVEMENT_PHASE],
      },
    ],
  },
  'Red-hot Fury': {
    effects: [
      {
        name: `Red-hot Fury`,
        desc: `At the end of the enemy charge phase, before carrying out monstrous rampages, if this unit is more than 3" from all enemy units, it can attempt a charge. It must finish the charge move within 1/2" of an enemy unit that is itself within 3" ofa friendly VULKYN FLAMESEEKERS Kyndledroth.`,
        when: [END_OF_CHARGE_PHASE],
      },
    ],
  },
  'Scalding Steam-breath': {
    effects: [
      {
        name: `Scalding Steam-breath`,
        desc: `If the target is a MONSTER, the Damage characteristic of this unit's Blazing Maw is 3 instead of D3.`,
        when: [COMBAT_PHASE],
      },
    ],
  },
}

export default tagAs(MountTraits, 'mount_trait')

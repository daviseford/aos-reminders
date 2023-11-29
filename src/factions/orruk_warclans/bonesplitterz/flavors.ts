import { TItemDescriptions } from 'factions/factionTypes'
import { COMBAT_PHASE, SAVES_PHASE, SHOOTING_PHASE } from 'types/phases'

const BonesplitterzFlavors = {
  Bonegrinz: {
    effects: [
      {
        name: `Barrage of Arrows`,
        desc: `Add 1 to the Attacks characteristic of missile weapons used by friendly BONEGRINZ SAVAGE ORRUK ARROWBOYS.`,
        when: [SHOOTING_PHASE],
      },
    ],
  },
  Icebone: {
    effects: [
      {
        name: `Freezing Strike`,
        desc: `If the unmodified wound roll for an attack made with a melee weapon by a friendly ICEBONE model is 6, that attack causes a number of mortal wounds to the target equal to the weapon's Damage characteristic and the attack sequence ends (do not make a save roll).`,
        when: [COMBAT_PHASE],
      },
    ],
  },
  Drakkfoot: {
    effects: [
      {
        name: `Strength of Purpose`,
        desc: `Ward rolls cannot be made for wounds and mortal wounds caused by attacks made by. friendly DRAKKFOOT units.`,
        when: [COMBAT_PHASE, SHOOTING_PHASE, SAVES_PHASE],
      },
    ],
  },
} satisfies TItemDescriptions

// Note: We do NOT use tagAs for Flavors
export default BonesplitterzFlavors

import { keyPicker } from 'factions/metatagger'
import {
  COMBAT_PHASE,
  DURING_GAME,
  DURING_SETUP,
  END_OF_MOVEMENT_PHASE,
  END_OF_SETUP,
  HERO_PHASE,
  MOVEMENT_PHASE,
  SHOOTING_PHASE,
} from 'types/phases'
import CommandAbilities from './command_abilities'
import { TItemDescriptions } from 'factions/factionTypes'

const Flavors = {
  // Glades
  Oakenbrow: {
    effects: [
      {
        name: `Our Roots Run Deep`,
        desc: `When determining which row to use on the damage table of a friendly OAKENBROW TREELORD, TREELORD ANCIENT or SPIRIT OF DURTHU, it is treated as having suffered half the number of wounds that are actually allocated to it (rounding up).`,
        when: [DURING_GAME, COMBAT_PHASE],
      },
    ],
  },
  Gnarlroot: {
    effects: [
      {
        name: `Keepers of the Arcane`,
        desc: `Once per turn, when you make a casting roll or unbinding roll for a friendly GNARLROOT WIZARD that is wholly within 9" of an overgrown terrain feature or friendly Awakened Wyldwood, you can roll 3D6 instead of 2D6. If you do so, remove 1 dice of your choice from the roll, and then use the remaining dice to determine that casting roll or unbinding roll.`,
        when: [HERO_PHASE],
      },
    ],
  },
  Heartwood: {
    effects: [
      {
        name: `Masters of the Hunt`,
        desc: `After deployment but before the first battle round begins, you can pick up to 3 different enemy units on the battlefield to be the quarry of the hunt. If you do so, add 1 to hit rolls for attacks made by friendly HEARTWOOD units that target those units.`,
        when: [DURING_SETUP, COMBAT_PHASE, SHOOTING_PHASE],
      },
    ],
  },
  Ironbark: {
    mandatory: {
      command_abilities: [keyPicker(CommandAbilities, ['Stand Firm'])],
    },
    effects: [],
  },
  Winterleaf: {
    effects: [
      {
        name: `Winters Bite`,
        desc: `Enemy units within 3" of a friendly WINTERLEAF unit cannot retreat. In addition, if you pick Everdusk from the Seasons of War battle trait, enemy units within 3" of a friendly WINTERLEAF unit cannot be removed from the battlefield through an effect that would allow them to be set up again later in the battle.`,
        when: [DURING_GAME, MOVEMENT_PHASE],
      },
    ],
  },
  Dreadwood: {
    effects: [
      {
        name: `Malicious Tormentors`,
        desc: `Once per battle, you can use Walk the Hidden Paths twice in the same turn, but if you do so, at least one of the units you pick must be a friendly DEADWOOD SPITE-REVENANTS unit. In addition, once per battle, you can use Strike and Fade twice in the same turn, but if you do so, at least one of the units you pick must be a friendly DREADWOOD SPITE-REVENANTS unit.`,
        when: [END_OF_MOVEMENT_PHASE, COMBAT_PHASE],
      },
    ],
  },
  Harvestboon: {
    effects: [
      {
        name: `Vibrant Surge`,
        desc: `After deployment but before the first battle round begins, you can move each friendly HARVESTBOON SPITERIDER LANCERS and REVENANT SEEKERS unit up to 12". If both players can move units before the first battle round begins, they must roll off and the winner chooses who moves their units first.`,
        when: [END_OF_SETUP],
      },
    ],
  },
} satisfies TItemDescriptions

export default Flavors

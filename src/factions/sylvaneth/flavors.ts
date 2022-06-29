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
  WARDS_PHASE,
} from 'types/phases'
import CommandAbilities from './command_abilities'

const Flavors = {
  // Seasons of War
  'The Burgeoning': {
    effects: [
      {
        name: `The Burgeoning`,
        desc: `Friendly SYLVANETH units that did not charge in the same turn and are wholly within 9" of an overgrown terrain feature or friendly Awakened Wyldwood have a ward of 6+.`,
        when: [WARDS_PHASE],
      },
    ],
  },
  'The Reaping': {
    effects: [
      {
        name: `The Reaping`,
        desc: `Add 3 to the range within which you can pick friendly SYLVANETH units with the Places of Power and From the Woodland Depths battle traits.`,
        when: [DURING_GAME],
      },
    ],
  },
  'The Dwindling': {
    effects: [
      {
        name: `The Dwindling`,
        desc: `In the hero phase, you can reroll 1 casting roll, 1 unbinding roll and 1 dispelling roll, so long as the friendly WIZARD you pick is a SYLVANETH WIZARD that is wholly within 9" of an overgrown terrain feature or friendly Awakened Wyldwood.`,
        when: [HERO_PHASE],
      },
    ],
  },
  Everdusk: {
    effects: [
      {
        name: `Everdusk`,
        desc: `Subtract 3" from the range within which you can pick friendly SYLVANETH units with the Places of Power and From the Woodland Depths battle traits. However, if the unmodified hit roll for an attack made with a melee weapon by a friendly SYLVANETH unit wholly within 6" of an overgrown terrain feature or friendly Awakened Wyldwood is 6, that attack scores 2 hits on the target instead of 1. Make a wound and save roll for each hit.`,
        when: [DURING_GAME, COMBAT_PHASE],
      },
    ],
  },

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
}

export default Flavors

import { TItemDescriptions } from 'factions/factionTypes'
import { tagAs } from 'factions/metatagger'
import {
  COMBAT_PHASE,
  DURING_GAME,
  HERO_PHASE,
  SHOOTING_PHASE,
  START_OF_HERO_PHASE,
  START_OF_SETUP,
} from 'types/phases'
const CommandTraits = {
  // Arcanites
  'Cult Demagogue': {
    effects: [
      {
        name: `Cult Demagogue`,
        desc: `WIZARDS only. If a casting roll for this general is a double, the casting attempt is successful and the spell cannot be unbound (regardless of the roll). In addition, you receive 2 Fate Points instead of 1.`,
        when: [HERO_PHASE],
      },
    ],
  },
  'Arcane Sacrifice': {
    effects: [
      {
        name: `Arcane Sacrifice`,
        desc: `WIZARDS only. At the start of your hero phase, you can cause 1 mortal wound to a friendly TZEENTCH unit within 3" of this general. If you do so, until the end of that phase, add 9" to the range of all spells successfully cast by this general.`,
        when: [START_OF_HERO_PHASE],
      },
    ],
  },
  'Soul Burn': {
    effects: [
      {
        name: `Soul Burn`,
        desc: `If the unmodified hit roll for an attack made with a melee weapon by this general is 6, that attack causes 1 mortal wound to the target in addition to any damage it inflicts.`,
        when: [COMBAT_PHASE],
      },
    ],
  },
  Illusionist: {
    effects: [
      {
        name: `Illusionist`,
        desc: `Subtract 1 from hit rolls for attacks that target this general.`,
        when: [COMBAT_PHASE, SHOOTING_PHASE],
      },
    ],
  },
  // Daemons
  Daemonspark: {
    effects: [
      {
        name: `Daemonspark`,
        desc: `Once per battle, in your hero phase, you can unleash the Daemonspark. If you do so, you immediately gain 3 Fate Points.`,
        when: [HERO_PHASE],
      },
    ],
  },
  'Incorporeal Form': {
    effects: [
      {
        name: `Incorporeal Form`,
        desc: `Each time this general is affected by a spell or endless spell, you can roll a dice. On a 5+, ignore the effect of that spell or the effects of that endless spell on this general.`,
        when: [DURING_GAME],
      },
    ],
  },
  //Shared
  'Arch-sorcerer': {
    effects: [
      {
        name: `Arch-sorcerer`,
        desc: `WIZARDS only. This general knows 2 extra spells from their spell lore.`,
        when: [START_OF_SETUP],
      },
    ],
  },
  'Nexus of Fate': {
    effects: [
      {
        name: `Nexus of Fate`,
        desc: `At the start of your hero phase, if this general is on the battlefield, you can roll a dice. If you do so, you can replace one of your Destiny Dice with that roll.`,
        when: [START_OF_HERO_PHASE],
      },
    ],
  },
} satisfies TItemDescriptions

export default tagAs(CommandTraits, 'command_trait')

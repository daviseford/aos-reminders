import { tagAs } from 'factions/metatagger'
import {
  BATTLESHOCK_PHASE,
  COMBAT_PHASE,
  DURING_GAME,
  HERO_PHASE,
  SAVES_PHASE,
  SHOOTING_PHASE,
  START_OF_GAME,
  START_OF_HERO_PHASE,
  START_OF_SETUP,
} from 'types/phases'
const CommandTraits = {
  // Common
  'Arch-sorcerer': {
    effects: [
      {
        name: `Arch-sorcerer`,
        desc: `This general knows 2 extra spells from their Lore.`,
        when: [START_OF_SETUP],
      },
    ],
  },
  'Nexus of Fate': {
    effects: [
      {
        name: `Nexus of Fate`,
        desc: `At the start of your hero phase, if this general is on the field, you can roll a die. If you do so, you can replace one of your Destiny Dice with that roll.`,
        when: [START_OF_HERO_PHASE],
      },
    ],
  },
  'Magical Supremacy': {
    effects: [
      {
        name: `Magical Supremacy`,
        desc: `Add 12" to the range at which your general can attempt to unbind spells and dispel endless spells.`,
        when: [HERO_PHASE],
      },
    ],
  },
  // Arcanites
  'Boundless Mutation': {
    effects: [
      {
        name: `Boundless Mutation`,
        desc: `At the start of your hero phases, roll a D6; on a 2+, your general heals D3 wounds.`,
        when: [START_OF_HERO_PHASE],
      },
    ],
  },
  'Cult Demagogue': {
    effects: [
      {
        name: `Cult Demagogue`,
        desc: `If a casting roll for this general is a double, the casting attempt is automatically successful(regardless of result). In addition, if the spell is not unbound, you receive 2 fate points instead of 1.`,
        when: [BATTLESHOCK_PHASE],
      },
    ],
  },
  'Arcane Sacrifice': {
    effects: [
      {
        name: `Arcane Sacrifice`,
        desc: `At the start of your hero phase, you can inflict 1 mortal wounds on a friendly Tzeentch unit within 3" of your general. If you do so, until the end of that phase, add 9" to the range of any spell successfully cast by this general.`,
        when: [START_OF_HERO_PHASE],
      },
    ],
  },
  // Mortals
  'Soul Burn': {
    effects: [
      {
        name: `Soul Burn`,
        desc: `If the unmodified hit roll for an attack made with a melee weapon by this gerenal is a 6, that attack inflicts 1 mortal wound on the target in addition to any normal damage.`,
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
        desc: `Each time this general is affected by a spell or endless spell, you can roll a D6. On a 5+, ignore the effects of that spell or endless spell on this general.`,
        when: [HERO_PHASE],
      },
    ],
  },
  'Aether Tether': {
    effects: [
      {
        name: `Aether Tether`,
        desc: `Add 1 to save rolls for attacks that target this general.`,
        when: [SAVES_PHASE],
      },
    ],
  },
  // Eternal Conflagration Flavor
  'Coruscating Flames': {
    effects: [
      {
        name: `Coruscating Flames`,
        desc: `Subtract 1 from hit rolls for attacks made with missile weapons that target friendly Eternal Conflagration Daemon units wholly within 12" of this general.`,
        when: [SHOOTING_PHASE],
      },
    ],
  },
  // Hosts  Duplicitous Flavor
  'Will of the Phantom Lord': {
    effects: [
      {
        name: `Will of the Phantom Lord`,
        desc: `You can reroll casting and unbinding rolls for friendly Hosts Duplicitous Daemon Wizards while they are wholly within 9" of this general.`,
        when: [HERO_PHASE],
      },
    ],
  },
  // Hosts Arcanum Flavor
  'Spell Hunters': {
    effects: [
      {
        name: `Spell Hunters`,
        desc: `After armies have been set up but before the first battle round begins, D3 friendly Hosts Arcanum units that can fly can move 6".`,
        when: [START_OF_GAME],
      },
    ],
  },
  // Cult of Transient Form Flavor
  'Defiant in their Pursuit': {
    effects: [
      {
        name: `Defiant in their Pursuit`,
        desc: `Add 2 to the bravery characteristic of friendly Cult of the Transient Form units wholly within 12" of this general.`,
        when: [BATTLESHOCK_PHASE],
      },
    ],
  },
  // Pyrofane Cult Flavor
  'Shrouded in Unnatural Flame': {
    effects: [
      {
        name: `Shrouded in Unnatural Flame`,
        desc: `Subtract 1 from hit rolls for attacks made with missile weapons that target this general.`,
        when: [SHOOTING_PHASE],
      },
    ],
  },
  // Guild of Summoners Flavor
  'Prophet of the Ostensible': {
    effects: [
      {
        name: `Prophet of the Ostensible`,
        desc: `If this general is part of your army and on the battlefield at the start of your hero phase, roll a D6. On a 4+, you receive 1 extra command point.`,
        when: [START_OF_HERO_PHASE],
      },
    ],
  },
  // Unbound Flux Flavor
  'Aegis of Insanity': {
    effects: [
      {
        name: `Aegis of Insanity`,
        desc: `Do not take battleshock tests for friendly Unbound Flux daemon units while they are wholly within 9" of this general.`,
        when: [BATTLESHOCK_PHASE],
      },
    ],
  },
  // Cult of a Thousand Eyes Flavor
  'Tzeentch is Pleased': {
    effects: [
      {
        name: `Tzeentch is Pleased`,
        desc: `Each time you spend a command point, if this general is on the battlefield, you can roll a D6. On a 5+ you can heal D3 wounds allocated to this general.`,
        when: [DURING_GAME],
      },
    ],
  },
}

export default tagAs(CommandTraits, 'command_trait')

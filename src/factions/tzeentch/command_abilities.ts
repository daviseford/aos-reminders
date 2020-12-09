import { tagAs } from 'factions/metatagger'
import {
  COMBAT_PHASE,
  HERO_PHASE,
  SHOOTING_PHASE,
  START_OF_HERO_PHASE,
  WOUND_ALLOCATION_PHASE,
} from 'types/phases'

// Store Command Abilities here. You can add them to units, abilties, flavors, and subfactions later.
const CommandAbilities = {
  // Unit Commands
  'Beacon of Sorcery': {
    effects: [
      {
        name: `Beacon of Sorcery`,
        desc: `You can use this command ability at the start of your hero phase. If you do so, pick 1 friendly model with this command ability. Until your next hero phase, you can add 1 to casting and unbinding rolls for friendly TZEENTCH DAEMON WIZARDS while they are wholly within 18" of that model. The same unit cannot benefit from this command ability more than once per turn.`,
        when: [START_OF_HERO_PHASE],
      },
    ],
  },
  'Lord of Fate': {
    effects: [
      {
        name: `Lord of Fate`,
        desc: `You can use this command ability at the start of your hero phase. If you do so, pick a friendly model with this command ability. Until your next hero phase, you can reroll hit rolls for attacks made by friendly Tzeentch units wholly within 9" of this model.`,
        when: [HERO_PHASE],
      },
    ],
  },
  // Eternal Conflagration Flavor
  'Infernos of Mutation': {
    effects: [
      {
        name: `Infernos of Mutation`,
        desc: `You can use this command ability in the shooting phase. If you do so, pick 1 friendly Eternal Conflagration Daemon unit wholly within 12" of a friendly Daemon Hero. If the unmodified hit roll for any attack made by that unit's Warpflame, Billowing Warpflame, or Magical Flames missile weapons is 6, subtract 2 from the Bravery characteristic of the target unit until the end of the battle round. A unit cannot benefit from this command ability more than once per turn.`,
        when: [SHOOTING_PHASE],
      },
    ],
  },
  // Hosts  Duplicitous Flavor
  'Impossible to Anticipate': {
    effects: [
      {
        name: `Impossible to Anticipate`,
        desc: `You can use this command ability once per battle, immediately after a friendly Hosts Duplicitous Horrors of Tzeentch unit is destroyed. If you do so, roll a D6. On a 5+, a new unit identical to the one that was destroyed is added to your army. Set up the new unit wholly within 12" of a friendly Hosts Duplicitious Hero and more than 9" from any enemy units.`,
        when: [WOUND_ALLOCATION_PHASE],
      },
    ],
  },
  // Hosts Arcanum Flavor
  'Entourage of Sky-Sharks': {
    effects: [
      {
        name: `Entourage of Sky-Sharks`,
        desc: `You can use this command ability in your hero phase. If you do so, pick 1 friendly Hosts Arcanum Screamers unit wholly within 12" of a friendly Hero. Until your next hero phase, add 1 to save rolls for attacks that target that unit. In addition, until your next hero phase improve the Rend characteristic of that unit's Lamprey Bite by 1. A unit cannot benefit from the effects of this ability more than once per turn.`,
        when: [HERO_PHASE, COMBAT_PHASE],
      },
    ],
  },
  // Cult of Transient Form Flavor
  'Fate of Transmutation': {
    effects: [
      {
        name: `Fate of Transmutation`,
        desc: `You can use this command ability in your hero phase. Pick 1 Kairic Acolyte unit wholly within 12" of a friendly Hero. Until your next hero phase, each time a Kairic Acolyte model from that unit is slain, add 1 to the dice roll made for that unit's Change-gift ability.`,
        when: [HERO_PHASE],
      },
    ],
  },
  // Pyrofane Cult Flavor
  Immolate: {
    effects: [
      {
        name: `Immolate`,
        desc: `You can use this command ability in your shooting phase. Pick 1 friendly Kairic Acolyte unit wholly within 12" of a friendly Pryofane Cult Hero. You can reroll wound rolls for attacks made by that unit until the end of that phase.`,
        when: [SHOOTING_PHASE],
      },
    ],
  },
  // Guild of Summoners Flavor
  'Will of the Arcane Lords': {
    effects: [
      {
        name: `Will of the Arcane Lords`,
        desc: `You can use this command ability in your hero phase. If you do so, pick a friendly Guild of Summoners Wizard wholly within 9" of a friendly Guild of Summoners Hero or wholly within 18" of a friendly Hero that is a general. Add 1 to casting rolls for that Wizard until the end of that phase. A unit cannot benefit from this command ability more than once per turn.`,
        when: [HERO_PHASE],
      },
    ],
  },
  // Unbound Flux Flavor
  'Fuelled by Mayhem': {
    effects: [
      {
        name: `Fuelled by Mayhem`,
        desc: `Pick 1 friendly Unbound Flux daemon wizard wholly within 9" of a friendly Unbound Flux daemon hero or wholly within 18" of a friendly Unbound Flux daemon general. Add 1 to the casting rolls for that wizard until the end of the phase. A unit cannot benefit from this ability more than once per turn.`,
        when: [HERO_PHASE],
      },
    ],
  },
  // Cult of a Thousand Eyes Flavor
  'Eyes Everywhere': {
    effects: [
      {
        name: `Eyes Everywhere`,
        desc: `Pick 1 friendly Cult of a Thousand Eyes mortal unit wholly within 12" of a Cult of a Thousand Eyes mortal hero. Until the start of your next hero phase, enemy units do not receive the benefit of cover against the buffed unit.`,
        when: [START_OF_HERO_PHASE],
      },
    ],
  },
}

export default tagAs(CommandAbilities, 'command_ability')

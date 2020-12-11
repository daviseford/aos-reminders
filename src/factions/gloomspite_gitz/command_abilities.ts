import { tagAs } from 'factions/metatagger'
import {
  DURING_GAME,
  HERO_PHASE,
  START_OF_CHARGE_PHASE,
  START_OF_COMBAT_PHASE,
  START_OF_MOVEMENT_PHASE,
  START_OF_ROUND,
} from 'types/phases'

const CommandAbilities = {
  // Unit command abilities
  'I`m Da Boss, Now Stab `Em Good!': {
    effects: [
      {
        name: `I'm Da Boss, Now Stab 'Em Good!`,
        desc: `You can use this command ability at the start of the combat phase. If you do so, pick 1 friendly Moonclan Grot unit wholly within 12" of a friendly model with this command ability, or wholly within 24" of a model with this command ability that is your general. If the unmodified wound roll for an attack made by that unit in that phase is 6, that attack inflicts 1 mortal wound on the target in addition to any normal damage. The same unit cannot be picked to be affected by this command ability more than once per phase.`,
        when: [START_OF_COMBAT_PHASE],
      },
    ],
  },
  'The Loonking`s Entreaty': {
    effects: [
      {
        name: `The Loonking's Entreaty`,
        desc: `You can use this command ability once per battle if this model is your general and on the battlefield, before you roll the dice to determine how far the Bad Moon moves that battle round. If you do so, you can choose for the Bad Moon to either not move that battle round, or to make 1 move or 2 moves that battle round (do not roll the dice to determine how far it moves).`,
        when: [START_OF_ROUND],
      },
    ],
  },
  'Bite Da Moon!': {
    effects: [
      {
        name: `Bite Da Moon!`,
        desc: `You can use this command ability at the start of a combat phase. If you do so, pick 1 friendly model with this command ability. In that combat phase you can add 1 to wound rolls for friendly SQUIG units while they are wholly within 18" of that model.`,
        when: [START_OF_COMBAT_PHASE],
      },
    ],
  },
  'Let`s Get Bouncing!': {
    effects: [
      {
        name: `Let's Get Bouncing!`,
        desc: `You can use this command ability at the start of your movement phase. If you do so, pick 1 friendly model with this command ability. All friendly SQUIG units wholly within 12" of that model at the start of that phase can move an extra 3" if they make a move in that phase. A unit cannot benefit from this command ability more than once per movement phase.`,
        when: [START_OF_MOVEMENT_PHASE],
      },
    ],
  },
  'Ride Em All Down': {
    effects: [
      {
        name: `Ride Em All Down`,
        desc: `You can use this command ability at the start of your charge phase. If you do so, pick 1 friendly SPIDERFANG GROT unit wholly within 18" of a friendly model with this command ability. You can reroll charge rolls for that unit in that charge phase. In addition, you can reroll hit rolls for attacks made with that unit's Crooked Spears in the following combat phase.`,
        when: [START_OF_CHARGE_PHASE],
      },
    ],
  },
  'Instinctive Leader': {
    effects: [
      {
        name: `Instinctive Leader`,
        desc: `Use this command ability at the start of the combat phase. If you do so, pick 1 friendly DANKHOLD TROGGOTH HERO with this command ability. Until the end of that phase, you can reroll hit rolls of 1 for attacks made by friendly TROGGOTH units wholly within 18" of that model when they attack.`,
        when: [START_OF_COMBAT_PHASE],
      },
    ],
  },
  // Jaws of Mork
  'Get Some Loonshine Down `Em!': {
    effects: [
      {
        name: `"Get Some Loonshine Down 'Em!"`,
        desc: `You can use this command ability at the start of any phase. If you do so, pick 1 friendly JAWS OF MORK MANGLER SQUIGS model. Until the end of that phase, use the top row on that model's damage table, regardless of how many wounds it has suffered.`,
        when: [DURING_GAME],
      },
    ],
  },
  // Glogg's Megamob
  'Oblivious to Sorcery': {
    effects: [
      {
        name: `Oblivious to Sorcery`,
        desc: `You can use this command ability in your hero phase. If you do so, pick 1 friendly GLOGG'S MEGAMOB FELLWATER TROGGOTH OR GLOGG'S MEGAMOB TOCKGUT TROGGOTH unit wholly within 12" of a friendly GLOGG'S MEGAMOB DANKHOLD HERO. Until your next hero phase, each time that unit is affected by a spell or endless spell, you can roll a D6. If you do so, on a 4+, ignore the effects of that spell or endless spell on that unit.`,
        when: [HERO_PHASE],
      },
    ],
  },
}

export default tagAs(CommandAbilities, 'command_ability')

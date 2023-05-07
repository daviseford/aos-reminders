import { tagAs } from 'factions/metatagger'
import { COMBAT_PHASE, HERO_PHASE, START_OF_BATTLESHOCK_PHASE, START_OF_COMBAT_PHASE } from 'types/phases'

const CommandAbilities = {
  'Excess of Violence': {
    effects: [
      {
        name: `Excess of Violence`,
        desc: `You can use this command ability in the combat phase when it is your turn to pick a unit to fight with. If you do so, pick 1 other friendly HEDONITE unit that has already fought once in that phase and is wholly within 12" of a model with this command ability. That unit can be picked to fight for a second time if it is within 3" of any enemy units. You cannot pick the same unit to benefit from this command ability more than once in the same phase.`,
        when: [COMBAT_PHASE],
      },
    ],
  },
  'Regal Authority': {
    effects: [
      {
        name: `Regal Authority`,
        desc: `You can use this command ability at the start of the battleshock phase if this model is your general and is on the battlefield. If you do so, until the end of that phase, do not take battleshock tests for friendly SLAANESH units while they are wholly within 18" of this model.`,
        when: [START_OF_BATTLESHOCK_PHASE],
      },
    ],
  },
  'Paragon of Depravity': {
    effects: [
      {
        name: `Paragon of Depravity`,
        desc: `You can use this command ability in the combat phase. If you do so, pick 1 friendly MORTAL HEDONITE unit wholly within 12" of this model. You can reroll hit rolls for attacks made by that unit in that phase.`,
        when: [COMBAT_PHASE],
      },
    ],
  },
  'Gorge on Excess': {
    effects: [
      {
        name: `Gorge on Excess`,
        desc: `You can use this command ability once per turn in your hero phase. If you do so, pick 1 friendly HEDONITE unit wholly within 12" of this model. Until your next hero phase, if an enemy unit is destroyed by an attack made by that HEDONITE unit and there are wounds that remain to be allocated to that enemy unit from that attack, heal up to the same number of wounds allocated to that HEDONITE unit.`,
        when: [HERO_PHASE],
      },
    ],
  },

  'Intoxicating Pall': {
    effects: [
      {
        name: `Intoxicating Pall`,
        desc: `You can use this command ability once per turn in the combat phase. If you do so, pick 1 friendly LURID HAZE INVADERS HOST unit wholly within 12" of a friendly LURID HAZE INVADERS HOST HERO with this command ability. Until the end of that phase, add 1 to save rolls for attacks that target that unit. The same unit cannot benefit from this command ability more than once per turn.`,
        when: [COMBAT_PHASE],
      },
    ],
  },
  'Armour of Arrogance': {
    effects: [
      {
        name: `Armour of Arrogance`,
        desc: `You can use this command ability once per turn in the combat phase. If you do so, pick 1 friendly FAULTLESS BLADES PRETENDERS HOST unit wholly within 12" of a friendly FAULTLESS BLADES PRETENDERS HOST HERO with this command ability. The first 2 wounds allocated to that unit in that phase are negated.`,
        when: [COMBAT_PHASE],
      },
    ],
  },
  'Vicious Spurs': {
    effects: [
      {
        name: `Vicious Spurs`,
        desc: `You can use this command ability at the start of the combat phase. If you do so, pick 1 friendly SCARLET CAVALCADE GODSEEKERS HOST unit that made a charge move that turn and is wholly within 12" of a friendly SCARLET CAVALCADE GODSEEKERS HOST HERO. Until the end of that phase, if the unmodified save roll for an attack that targets that unit is 6, the attacking unit suffers 1 mortal wound after all of its attacks have been resolved.`,
        when: [START_OF_COMBAT_PHASE],
      },
    ],
  },
}

export default tagAs(CommandAbilities, 'command_ability')

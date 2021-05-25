import { tagAs } from 'factions/metatagger'
import {
  COMBAT_PHASE,
  END_OF_COMBAT_PHASE,
  END_OF_MOVEMENT_PHASE,
  HERO_PHASE,
  START_OF_COMBAT_PHASE,
  START_OF_HERO_PHASE,
  START_OF_MOVEMENT_PHASE,
} from 'types/phases'

// Store Command Abilities here. You can add them to units, abilties, flavors, and subfactions later.
const CommandAbilities = {
  'Supreme Lord of the Undead': {
    effects: [
      {
        name: `Supreme Lord of the Undead`,
        desc: `You can use this command ability in your hero phase if this model is on the battlefield. If you do so, until your next hero phase, you can reroll hit rolls of 1 for attacks made by friendly DEATH units, you can reroll save rolls of 1 for attacks that target friendly DEATH units, and do not take battleshock tests for friendly DEATH units.`,
        when: [HERO_PHASE],
      },
    ],
  },
  'Vigour of Undeath': {
    effects: [
      {
        name: `Vigour of Undeath`,
        desc: `You can use this command ability once per turn in your hero phase. If you do so, add 1 to hit and wound rolls for friendly SOULBLIGHT GRAVELORDS units wholly within 12" of this model until your next hero phase.`,
        when: [HERO_PHASE],
      },
    ],
  },
  "Twilight's Allure": {
    effects: [
      {
        name: `Twilight's Allure`,
        desc: `You can use this command ability once per turn in your hero phase. If you do so, subtract 1 from hit rolls for attacks made with melee weapons that target friendly SOULBLIGHT GRAVELORDS units wholly within 12" of this model until your next hero phase.`,
        when: [HERO_PHASE],
      },
    ],
  },
  'Fist of Nagash': {
    effects: [
      {
        name: `Fist of Nagash`,
        desc: `You can use this command ability once per turn in your hero phase. If you do so, pick 1 other friendly SOULBLIGHT GRAVELORDS HERO that is wholly within 12" of this model and within 3" of any enemy units. That HERO can fight.`,
        when: [HERO_PHASE],
      },
    ],
  },
  'A Queen Amongst Monsters': {
    effects: [
      {
        name: `A Queen Amongst Monsters`,
        desc: `You can use this command ability once per turn in your hero phase. If you do so, pick 1 enemy unit on the battlefield. Until your next hero phase, add 1 to hit rolls for attacks made with melee weapons by friendly SOULBLIGHT GRAVELORDS MONSTERS that target that enemy unit.`,
        when: [HERO_PHASE],
      },
      {
        name: `A Queen Amongst Monsters`,
        desc: `If active, until your next hero phase, add 1 to hit rolls for attacks made with melee weapons by friendly SOULBLIGHT GRAVELORDS MONSTERS that target that enemy unit.`,
        when: [COMBAT_PHASE],
      },
    ],
  },
  'Festering Feast': {
    effects: [
      {
        name: `Festering Feast`,
        desc: `You can use this command ability at the end of the combat phase if any attacks made by a friendly SOULBLIGHT GRAVELORDS unit in that phase destroyed any enemy units. If you do so, you can heal up to D6 wounds allocated to that SOULBLIGHT GRAVELORDS unit. The same unit cannot benefit from this command ability more than once per phase.`,
        when: [END_OF_COMBAT_PHASE],
      },
    ],
  },
  'Pack Alpha': {
    effects: [
      {
        name: `Pack Alpha`,
        desc: `You can use this command ability at the start of your hero phase. If you do so, pick 1 friendly DIRE WOLVES unit wholly within 12" of this model. That unit is eligible to fight in the combat phase if it is within 6" of an enemy unit instead of 3", and it can move an extra 3" when it piles in.`,
        when: [START_OF_HERO_PHASE],
      },
    ],
  },
  'Call to the Hunt': {
    effects: [
      {
        name: `Call to the Hunt`,
        desc: `You can use this command ability at the start of the combat phase. If you do so, pick 1 friendly model with this command ability that made a charge move in that turn. Add 1 to the Attacks characteristic of melee weapons used by friendly SOULBLIGHT GRAVELORDS units wholly within 18" of that model until the end of that phase. The same unit cannot benefit from this command ability more than once per phase.`,
        when: [START_OF_COMBAT_PHASE],
      },
    ],
  },
  'Mustering Howl': {
    effects: [
      {
        name: `Mustering Howl`,
        desc: `You can use this command ability once per battle at the end of your movement phase. If you do sot you can add 1 unit of 10 DIRE WOLVES to your army. The unit must be set up wholly within 12" of this model and more than 9" from all enemy units.`,
        when: [END_OF_MOVEMENT_PHASE],
      },
    ],
  },
  'Arise! Arise!': {
    effects: [
      {
        name: `Arise! Arise!`,
        desc: `You can use this command ability at the end of your movement phase. If you do so, pick 1 friendly SUMMONABLE DEADWALKERS unit that has been destroyed. A new replacement unit with half of the models from the unit that was destroyed (rounding up) is added to your army. Set up that unit wholly within 9" of a friendly model with this command ability and more than 9" from any enemy units. Each destroyed unit can only be replaced once - replacement units cannot themselves be replaced.`,
        when: [END_OF_MOVEMENT_PHASE],
      },
    ],
  },
  'Disciplined Advance': {
    effects: [
      {
        name: `Disciplined Advance`,
        desc: `You can use this command ability at the start of your movement phase. If you do sot pick up to 3 friendly DEATHRATTLE units wholly within 18" of this model. Until the end of that phase, if you declare that any of those units will run, do not make run roll for them. Instead, add 4" to the Move characteristic of those units until the end of that phase.`,
        when: [START_OF_MOVEMENT_PHASE],
      },
    ],
  },
  'Crimson Feast': {
    effects: [
      {
        name: `Crimson Feast`,
        desc: `You can use this command ability in the combat phase. If you do so, pick 1 friendly SOULBLIGHT GRAVELORDS SUMMONABLE unit wholly within 12" of this model. Add 1 to the Attacks characteristic of that unit's melee weapons until your next hero phase. The same unit cannot benefit from this command ability more than once per phase.`,
        when: [COMBAT_PHASE],
      },
    ],
  },
  'Tactical Insight': {
    effects: [
      {
        name: `Tactical Insight`,
        desc: `You can use this command ability at the start of your hero phase. If you do so, pick 1 friendly SOULBLIGHT GRAVELORDS unit wholly within 12" of this model. Until your next hero phase, add 1 to hit rolls and wound rolls for attacks made by that unit and add 1 to save rolls for attacks that target that unit. The same unit cannot benefit from this command ability more than once per phase.`,
        when: [START_OF_HERO_PHASE],
      },
    ],
  },
  'Lord of Bones': {
    effects: [
      {
        name: `Lord of Bones`,
        desc: `You can use this command ability in your hero phase. If you do so, pick 1 friendly DEATHRATTLE unit wholly within 12" of this model. Until the end of that phase, you can reroll hit rolls of 1 for attacks made with melee weapons by that unit.`,
        when: [HERO_PHASE],
      },
    ],
  },
}

// Always export using tagAs
export default tagAs(CommandAbilities, 'command_ability')

import { tagAs } from 'factions/metatagger'
import {
  CHARGE_PHASE,
  COMBAT_PHASE,
  END_OF_COMBAT_PHASE,
  HERO_PHASE,
  MOVEMENT_PHASE,
  SHOOTING_PHASE,
  START_OF_BATTLESHOCK_PHASE,
  START_OF_CHARGE_PHASE,
  START_OF_COMBAT_PHASE,
  WOUND_ALLOCATION_PHASE,
} from 'types/phases'

// Store Command Abilities here. You can add them to units, abilties, flavors, and subfactions later.
const CommandAbilities = {
  'Grandfather`s Joy': {
    effects: [
      {
        name: `Grandfather's Joy`,
        desc: `Pick a friendly Nurgle Daemon unit within 21" of this model. Add 1 to the attacks characteristic of all melee weapons used by that unit until your next hero phase. You cannot pick the same unit to benefit from this ability more than once per hero phase.`,
        when: [HERO_PHASE],
      },
    ],
  },
  'Lord of Nurgle': {
    effects: [
      {
        name: `Lord of Nurgle`,
        desc: `Until your next hero phase, all friendly Nurgle units within 14" of this model add 1 to their attacks characteristic of any of their melee weapons.`,
        when: [HERO_PHASE],
      },
    ],
  },
  'Fester and Rot': {
    effects: [
      {
        name: `Fester and Rot`,
        desc: `Pick a friendly Nurgle unit within 14" of this model. Reroll failed wound rolls for that unit until your next hero phase.`,
        when: [HERO_PHASE],
      },
    ],
  },
  'Spearhead of Contagion': {
    effects: [
      {
        name: `Spearhead of Contagion`,
        desc: `If this model is your general, you can pick a friendly Pusgoyle Blightlords unit within 14" and add 8" to that unit's move characteristic until your next hero phase. The same unit cannot benefit from this ability more than once in the same phase.`,
        when: [HERO_PHASE],
      },
      {
        name: `Spearhead of Contagion`,
        desc: `If active, add 8" to the buffed unit's move characteristic.`,
        when: [MOVEMENT_PHASE],
      },
    ],
  },
  'Morbid Vigour': {
    effects: [
      {
        name: `Morbid Vigour`,
        desc: `You may activate this command ability to affect mortal units within 7" of this model until your next hero phase.`,
        when: [HERO_PHASE],
      },
      {
        name: `Morbid Vigour`,
        desc: `If active, roll a D6 each time you allocate a wound or mortal wound to a friendly Nurgle unit within 7" of this model. On a 5+ the wound is negated. The same unit cannot benefit from this ability more than once in the same phase.`,
        when: [WOUND_ALLOCATION_PHASE],
      },
    ],
  },
  'Plague of Flies': {
    effects: [
      {
        name: `Plague of Flies`,
        desc: `Pick a friendly Nurgle unit within 21" of this model. Until your next hero phase, subtract 1 from the hit rolls of attacks that target that unit in the shooting phase. If the unit contains 20 or more models, subtract 2 from the hit rolls of attacks that target the unit in the shooting phase and 1 from the hit rolls of attacks that target the unit in the combat phase.`,
        when: [HERO_PHASE],
      },
      {
        name: `Plague of Flies`,
        desc: `If this ability had been activated, subtract 1 from the hit rolls of attacks targeting the buffed unit.
      
               If the unit contains 20 or more models, subtract 2 from the hit rolls of attacks targeting the buffed unit.
      
               The same unit cannot benefit from this ability more than once in the same phase.`,
        when: [SHOOTING_PHASE],
      },
      {
        name: `Plague of Flies`,
        desc: `If this ability had been activated and buffed unit contains 20 or more models, subtract 1 from the hit rolls of attacks on the buffed unit. The same unit cannot benefit from this ability more than once in the same phase.`,
        when: [COMBAT_PHASE],
      },
    ],
  },
  'Grandfather`s Gift': {
    effects: [
      {
        name: `Grandfather's Gift`,
        desc: `Pick an enemy unit within 21" of this model. Roll 7 dice. Each 6+ causes the target to suffer 1 mortal wound.`,
        when: [HERO_PHASE],
      },
    ],
  },
  'Grandfather`s Exalted Joy': {
    effects: [
      {
        name: `Grandfather's Exalted Joy`,
        desc: `You can use this command ability in your hero phase. If you do so, pick 1 friendly Nurgle Daemon unit wholly within 28" of a friendly model with this command ability. Add 1 to the Attacks characteristic of that unit's melee weapons until your next hero phase.`,
        when: [HERO_PHASE],
      },
      {
        name: `Grandfather's Exalted Joy`,
        desc: `If active, add 1 to the Attacks characteristic of the buffed unit's melee weapons.`,
        when: [COMBAT_PHASE],
      },
    ],
  },
  // Munificent Wanderers Command Abilities
  'Infested with Wonders': {
    effects: [
      {
        name: `Infested with Wonders`,
        desc: `Pick 1 friendly Munificent Wanderers daemon unit wholly within 14" of a friendly Munificent Wanderers hero with this command ability. Until the start of your next hero phase, if an enemy unit ends a charge move within 3" of the target, that enemy unit suffers D3 mortal wounds. A unit cannot benefit from this ability more than once per turn.`,
        when: [HERO_PHASE],
      },
      {
        name: `Infested with Wonders`,
        desc: `If an enemy unit ends a charge move within 3" of the buffed unit, that enemy unit suffers D3 mortal wounds.`,
        when: [CHARGE_PHASE],
      },
    ],
  },
  // Droning Guard Command Abilities
  'Twice-blessed Rotspawn': {
    effects: [
      {
        name: `Twice-blessed Rotspawn`,
        desc: `Pick 1 friendly Droning Guard Plague Drones unit wholly within 12" of a friendly Droning Guard daemon hero with this ability. Until the end of the phase, add 1 to Disgustingly Resilient rolls made for that unit.`,
        when: [COMBAT_PHASE],
      },
    ],
  },
  // Blessed Sons Command Abilities
  'Degraded and Defiled': {
    effects: [
      {
        name: `Degraded and Defiled`,
        desc: `Pick 1 friendly Blessed Sons Rotbringer unit wholly within 14" of a friendly Blessed Sons Rotbringer hero with this ability. At the end of the phase, pick 1 enemy unit that suffered any wounds or mortal wounds inflicted by the selected friendly unit in this phase. If the combined wounds/mortal wounds is greater than the bravery characteristic of the enemy unit, that unit suffers 3 additional mortal wounds.`,
        when: [START_OF_COMBAT_PHASE],
      },
      {
        name: `Degraded and Defiled`,
        desc: `If active on a friendly unit at the end of the phase, pick 1 enemy unit that suffered any wounds or mortal wounds inflicted by the buffed friendly unit in this phase. If the combined wounds/mortal wounds is greater than the bravery characteristic of the enemy unit, that unit suffers 3 additional mortal wounds.`,
        when: [END_OF_COMBAT_PHASE],
      },
    ],
  },
  // Drowned Men Command Abilities
  'Kneel Before the Plague': {
    effects: [
      {
        name: `Kneel Before the Plague`,
        desc: `Pick 1 friendly Drowned Men Pusgoyle Blightlord unit wholly within 12" of a friendly Drowned Men Rotbringer hero. Until your next hero phase, if the unmodified wound roll for an attack made with that unit's Blighted Weapons is a 6, improve the rend characteristic for that attack by 1.`,
        when: [START_OF_COMBAT_PHASE],
      },
      {
        name: `Kneel Before the Plague`,
        desc: `Improve the rend characteristic by 1 for unmodified Blighted Weapons wound rolls of 6 on the buffed unit.`,
        when: [COMBAT_PHASE],
      },
    ],
  },
  // Tamurkhan's Horde Command Abilities
  'Shout of Command': {
    effects: [
      {
        name: `Shout of Command`,
        desc: `Pick 1 friendly Tamurkhan's Horde Hero. You can reroll charge rolls for friendly Tamurkhan's Horde units while they are wholly within 14" of that HERO in that phase.`,
        when: [START_OF_CHARGE_PHASE],
      },
    ],
  },
  'Roar of Command': {
    effects: [
      {
        name: `Roar of Command`,
        desc: `If this model is your general and is on the battlefield, you can reroll charge rolls for friendly Tamurkhan's Horde units while they are wholly within 28" of this model in that charge phase.`,
        when: [START_OF_CHARGE_PHASE],
      },
    ],
  },
  'Breath of the Plague Pit': {
    effects: [
      {
        name: `Breath of the Plague Pit`,
        desc: `Do not take battleshock tests for friendly Nurgle units while they are wholly within 14" of this model.`,
        when: [START_OF_BATTLESHOCK_PHASE],
      },
    ],
  },
  '': {
    effects: [],
  },
}

// Always export using tagAs
export default tagAs(CommandAbilities, 'command_ability')

import {
  DURING_GAME,
  END_OF_HERO_PHASE,
  END_OF_MOVEMENT_PHASE,
  END_OF_SETUP,
  START_OF_COMBAT_PHASE,
  START_OF_HERO_PHASE,
  START_OF_MOVEMENT_PHASE,
  START_OF_ROUND,
  HERO_PHASE,
} from 'types/phases'
import { TCommands } from 'types/army'
import { AQSHY, CHAMON, GHUR, GHYRAN, HYSH, SHYISH, STYGXX, ULGU } from 'types/realmscapes'

// Realm specific command abilities.
const Commands: TCommands = [
  {
    name: `Blazing Fervour (${AQSHY})`,
    effects: [
      {
        name: `Blazing Fervour (${AQSHY})`,
        desc: `Pick 1 friendly unit wholly within 12" of a friendly HERO. Add 1 to run and charge rolls made for that unit until your next hero phase. The same unit cannot benefit from this command ability more than once per phase.`,
        when: [START_OF_HERO_PHASE],
      },
    ],
  },
  {
    name: `Living Blades (${CHAMON})`,
    effects: [
      {
        name: `Living Blades (${CHAMON})`,
        desc: `Pick 1 friendly unit wholly within 12" of a friendly HERO. Until your next hero phase, add 1 to hit rolls for attacks made with melee weapons by that unit if it made a charge move in the same turn.`,
        when: [START_OF_COMBAT_PHASE],
      },
    ],
  },
  {
    name: `Feral Roar (${GHUR})`,
    effects: [
      {
        name: `Feral Roar (${GHUR})`,
        desc: `Pick 1 friendly MONSTER wholly within 12" of a friendly HERO. Until the end of the battle round, when you look up a value on that model's damage table, that MONSTER is treated as if it has suffered 0 wounds.`,
        when: [HERO_PHASE],
      },
    ],
  },
  {
    name: `Command the Land (${GHYRAN})`,
    effects: [
      {
        name: `Command the Land (${GHYRAN})`,
        desc: `A friendly hero can attempt to cast Shield of Thorns even if they are not a wizard and even if the spell has already been attempted in this phase.`,
        when: [END_OF_HERO_PHASE],
      },
    ],
  },
  {
    name: `Strike Quickly (${HYSH})`,
    effects: [
      {
        name: `Strike Quickly (${HYSH})`,
        desc: `Pick a friendly unit within 3" of a friendly hero (12" of your general) and within 3" of an enemy unit. That unit fights immediately instead of later in the combat phase.`,
        when: [START_OF_COMBAT_PHASE],
      },
    ],
  },
  {
    name: `Lord of the Shadow Realm (${ULGU})`,
    effects: [
      {
        name: `Lord of the Shadow Realm (${ULGU})`,
        desc: `You can use either Shadowed Mansions or Shadow Realm realmscape features. In addition, you do not need to perform the lost in shadow realm check for these actions. Note this action is in addition to the active realmscape feature.`,
        when: [START_OF_HERO_PHASE],
      },
    ],
  },
  {
    name: `Honour the Dead (${SHYISH}) (${STYGXX})`,
    effects: [
      {
        name: `Honour the Dead (${SHYISH}) (${STYGXX})`,
        desc: `Pick a friendly unit within 3" of a hero (12" of a general) and roll a D6. If the roll is less than the number of models that have been slain from the selected unit, you can add 1 to the attacks characteristic of that unit.`,
        when: [START_OF_COMBAT_PHASE],
      },
    ],
  },
  {
    name: `Soul-force Sacrifice (${SHYISH}) (${STYGXX})`,
    effects: [
      {
        name: `Soul-force Sacrifice (${SHYISH}) (${STYGXX})`,
        desc: `Pick a friendly unit within 3" of your general. Allocate any number of wounds to selected unit and heal that many wounds from the general.`,
        when: [START_OF_HERO_PHASE],
      },
    ],
  },
]

export default Commands

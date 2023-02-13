import { tagAs } from 'factions/metatagger'
import { END_OF_MOVEMENT_PHASE, START_OF_COMBAT_PHASE, START_OF_HERO_PHASE } from 'types/phases'

const CommandAbilities = {
  // Unit commands
  "Slaughterer's Call": {
    effects: [
      {
        name: `Slaughterer's Call`,
        desc: `You can use this command ability at the start of the combat phase. This unit must issue the command and the unit that receives the command must be a friendly WARHERD unit within 12" of an enemy unit and more than 3" from all enemy units. If you do so, you must attempt a charge with that unit.`,
        when: [START_OF_COMBAT_PHASE],
      },
    ],
  },

  // Allherd Greatfray
  'Booming Roar': {
    effects: [
      {
        name: `Booming Roar`,
        desc: `You can use this command ability at the start of your hero phase if your general is on the battlefield. If you do so, you receive 1 Primordial Call point.`,
        when: [START_OF_HERO_PHASE],
      },
    ],
  },
  // Gavespawn Greatfray
  'Propagator of Devolution': {
    effects: [
      {
        name: `Propagator of Devolution`,
        desc: `You can use this command ability at the start of the combat phase. If you do so, pick a friendly GAVESPAWN unit wholly within 12" of a friendly GAVESPAWN CHAOS SPAWN. Add 1 to the Attacks characteristic of that unit's melee weapons until the end of that phase.`,
        when: [START_OF_COMBAT_PHASE],
      },
    ],
  },
  // Darkwalkers Greatfray
  'Savage Encirclement': {
    effects: [
      {
        name: `Savage Encirclement`,
        desc: `You can use this command ability at the end of your movement phase. If you do so, pick a friendly DARKWALKERS unit that is more than 9" from any enemy units and wholly within 18" of a friendly DARKWALKERS HERO. Remove that unit from the battlefield and place it to one side. At the end of your next movement phase, set that unit up again anywhere on the battlefield more than 9" from any enemy units.`,
        when: [END_OF_MOVEMENT_PHASE],
      },
    ],
  },
}

export default tagAs(CommandAbilities, 'command_ability')

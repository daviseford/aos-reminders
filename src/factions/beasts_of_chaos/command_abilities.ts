import { tagAs } from 'factions/metatagger'
import { COMBAT_PHASE, END_OF_MOVEMENT_PHASE, START_OF_COMBAT_PHASE, START_OF_HERO_PHASE } from 'types/phases'

// Store Command Abilities here. You can add them to units, abilties, flavors, and subfactions later.
const CommandAbilities = {
  // Unit commands
  'Grisly Trophy': {
    effects: [
      {
        name: `Grisly Trophy`,
        desc: `You can use this command ability in the combat phase if any attacks made by a friendly BEASTLORD with this command ability resulted in an enemy model being slain that phase. If you do so, until the end of that phase, you can reroll wound rolls for attacks made by friendly BRAYHERD units wholly within 18" of that BEASTLORD . If any attacks made by that BEASTLORD resulted in an enemy HERO or MONSTER being slain that phase, you can reroll both hit rolls and wound rolls for attacks made by friendly BRAYHERD units wholly within 18" of that BEASTLORD instead.`,
        when: [COMBAT_PHASE],
      },
    ],
  },
  'Slaughterer`s Call': {
    effects: [
      {
        name: `Slaughterer's Call`,
        desc: `You can use this command ability at the start of the combat phase. If you do so, pick a friendly WARHERD unit wholly within 12" of a friendly model with this command ability. Add 1 to wound rolls for attacks made by that unit until the end of that phase.`,
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

import { tagAs } from 'factions/metatagger'
import {
  COMBAT_PHASE,
  DURING_GAME,
  END_OF_MOVEMENT_PHASE,
  START_OF_HERO_PHASE,
  START_OF_MOVEMENT_PHASE,
} from 'types/phases'

// Store Command Abilities here. You can add them to units, abilties, flavors, and subfactions later.
const CommandAbilities = {
  'Summon Men-at-arms': {
    effects: [
      {
        name: `Summon Men-at-arms`,
        desc: `You can use this command ability at the end of your movement phase. If you do so, pick a friendly model that has this command ability and has not used it before in the battle. That model summons 1 unit of 10 Crypt Ghouls to the battlefield. The summoned unit is added to your army, and must be set up wholly within 6" of the edge of the battlefield and more than 9" from any enemy units.`,
        when: [END_OF_MOVEMENT_PHASE],
      },
    ],
  },
  'Summon Royal Guard': {
    effects: [
      {
        name: `Summon Royal Guard`,
        desc: `You can use this command ability at the end of your movement phase. If you do so, pick a friendly model that has this command ability and has not used it before in the battle. That model summons 1 unit of 3 Crypt Horrors or 1 unit of 3 Crypt Flayers to the battlefield. The summoned unit is added to your army, and must be set up wholly within 6" of the edge of the battlefield and more than 9" from any enemy units.`,
        when: [END_OF_MOVEMENT_PHASE],
      },
    ],
  },
  'Summon Courtier': {
    effects: [
      {
        name: `Summon Courtier`,
        desc: `You can use this command ability at the end of your movement phase. If you do so, pick a friendly model that has this command ability and has not used it before in the battle. That model summons 1 Courtier unit to the battlefield. The summoned unit is added to your army, and must be set up wholly within 6" of the edge of the battlefield and more than 9" from any enemy units.`,
        when: [END_OF_MOVEMENT_PHASE],
      },
    ],
  },
  'Summon Imperial Guard': {
    effects: [
      {
        name: `Summon Imperial Guard`,
        desc: `You can use this command ability at the end of your movement phase. If you do so, pick 1 friendly model that has this command ability and has not used it before in the battle. That model summons 1 of the following units to the battlefield: 1 COURTIER; or 1 unit of up to 3 KNIGHTS; or 1 unit of up to 20 SERFS. The summoned unit is added to your army, and must be set up wholly within 6" of the edge of the battlefield and more than 9" from any enemy units.`,
        when: [END_OF_MOVEMENT_PHASE],
      },
    ],
  },
  'Heaving Masses': {
    effects: [
      {
        name: `Heaving Masses`,
        desc: `You can use this command ability when a friendly MORGAUNT SERFS unit is destroyed. If you do so, roll a D6. On a 4+ a new unit identical to the one that was destroyed is added to your army. Set up the new unit wholly within 6" of the edge of the battlefield and more than 9" from any enemy models.`,
        when: [DURING_GAME],
      },
    ],
  },
  'Ravenous Crusaders': {
    effects: [
      {
        name: `Ravenous Crusaders`,
        desc: `You can use this command ability at the start of your hero phase. If you do so, pick 1 friendly HOLLOWMOURNE unit wholly within 9" of a friendly HOLLOWMOURNE HERO, or wholly within 18" of a friendly HOLLOWMOURNE HERO that is a general. Add 1 to run and charge rolls for that unit until your next hero phase. In addition, until your next hero phase, that unit can run and still charge later in the same turn.`,
        when: [START_OF_HERO_PHASE],
      },
    ],
  },
  'Lords of the Burning Skies': {
    effects: [
      {
        name: `Lords of the Burning Skies`,
        desc: `You can use this command ability at the start of your movement phase. If you do so, pick 1 friendly BLISTERSKIN unit that can fly and which is wholly within 12" of a friendly BLISTERSKIN HERO, or wholly within 18" of a friendly BLISTERSKIN HERO that is a general. Remove that unit from the battlefield and then set it up again anywhere on the battlefield more than 9" from any enemy units. It may not move later in that movement phase.`,
        when: [START_OF_MOVEMENT_PHASE],
      },
    ],
  },
  'Call to War': {
    effects: [
      {
        name: `Call to War`,
        desc: `You can use this command ability in the combat phase if a friendly GRISTLEGORE HERO or GRISTLEGORE MONSTER that has not fought in that phase is slain while it is wholly within 12" of a friendly GRISTLEGORE HERO, or wholly within 18" of a friendly GRISTLEGORE HERO that is a general. If you do so, before that model is removed from play, it can make a pile-in move and then attack with all of the melee weapons it is armed with. You cannot pick the same unit to benefit from this ability more than once per phase.`,
        when: [COMBAT_PHASE],
      },
    ],
  },
  'Feeding Frenzy': {
    effects: [
      {
        name: `Feeding Frenzy`,
        desc: `You can use this command ability after a friendly FLESH-EATER COURTS unit has fought in the combat phase for the first time and is wholly within 12" of a friendly FLESH-EATER COURTS HERO, or wholly within 18" of a friendly FLESH-EATER COURTS HERO that is a general. If you do so, that unit can immediately make a pile-in move and then attack with all of the melee weapons it is armed with for a second time. You cannot pick the same unit to benefit from this ability more than once per phase.`,
        when: [COMBAT_PHASE],
      },
    ],
  },
}

// Always export using tagAs
export default tagAs(CommandAbilities, 'command_ability')

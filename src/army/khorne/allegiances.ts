import { TAllegiances } from 'types/army'
import {
  BATTLESHOCK_PHASE,
  CHARGE_PHASE,
  COMBAT_PHASE,
  HERO_PHASE,
  MOVEMENT_PHASE,
  SHOOTING_PHASE,
  START_OF_COMBAT_PHASE,
  START_OF_HERO_PHASE,
} from 'types/phases'

const Allegiances: TAllegiances = [
  {
    name: `Reapers of Vengeance`,
    effects: [
      {
        name: `Devour the Craven`,
        desc: `If an enemy unit fails a battleshock test within 3" of any friendly REAPERS OF VENGEANCE DAEMON units, add D3 to the number of models that flee.`,
        when: [BATTLESHOCK_PHASE],
        allegiance_ability: true,
      },
      {
        name: `Leave None Alive`,
        desc: `You can use this command ability at the start of the combat phase. If you do so, pick 1 friendly REAPERS OF VENGEANCE DAEMON unit wholly within 8" of a friendly DAEMON model with this command ability. After that unit has fought in the combat phase for the first time, if it is within 3" of an enemy unit it can immediately make a pile-in move and then attack with all of the melee weapons it is armed with for a second time.`,
        when: [START_OF_COMBAT_PHASE],
        command_ability: true,
      },
      {
        name: `Mage Eater`,
        desc: `This general can attempt to unbind one spell in the enemy hero phase in the same manner as a WIZARD. In addition, if this general attempts to unbind a spell and the unmodified unbinding roll is 8, that spell is successfully unbound and the caster suffers D6 mortal wounds. If this general can already unbind spells, they can attempt to unbind 1 extra spell in the enemy hero phase (only the first unbinding roll in the phase can inflict mortal wounds).`,
        when: [HERO_PHASE],
        command_trait: true,
      },
      {
        name: `Skullshard Mantle`,
        desc: `Each time the bearer is affected by a spell or endless spell, you can roll a D6. If you do so, on a 2+ ignore the effects of that spell on the bearer.`,
        when: [HERO_PHASE],
        artifact: true,
      },
    ],
  },
  {
    name: `The Bloodlords`,
    effects: [
      {
        name: `Slay the Mighty`,
        desc: `You can re-roll wound rolls of 1 for attacks made by friendly BLOODLORDS DAEMON units that target a HERO or MONSTER.`,
        when: [COMBAT_PHASE, SHOOTING_PHASE],
        allegiance_ability: true,
      },
      {
        name: `First in His Sight`,
        desc: `You can use this command ability at the start of the hero phase. If you do so, pick a friendly model with this command ability. You can heal 1 wound allocated to each friendly BLOODLORDS DAEMON unit wholly within 16" of that model.`,
        when: [START_OF_HERO_PHASE],
        command_ability: true,
      },
      {
        name: `Slaughterer's Thirst`,
        desc: `Add 4" to the Move characteristic of this general.`,
        when: [MOVEMENT_PHASE],
        command_trait: true,
      },
      {
        name: `Slaughterer's Thirst`,
        desc: `You can re-roll charge rolls for this general.`,
        when: [CHARGE_PHASE],
        command_trait: true,
      },
      {
        name: `Halo of Blood`,
        desc: `The bearer fights at the start of the combat phase, before the players pick any other units to fight in that combat phase. The bearer cannot fight again in that combat phase unless an ability or spell allows it to fight more than once.`,
        when: [START_OF_COMBAT_PHASE],
        artifact: true,
      },
    ],
  },
  {
    name: `The Goretide`,
    effects: [
      {
        name: `Tireless Conquerors`,
        desc: `You can re-roll wound rolls of 1 for attacks made with melee weapons by friendly GORETIDE MORTAL units wholly within 12" of an objective marker.`,
        when: [COMBAT_PHASE],
        allegiance_ability: true,
      },
      {
        name: `Ever Onwards`,
        desc: `You can use this command ability before you make a run roll for 1 friendly GORETIDE BLOODREAVERS or GORETIDE BLOOD WARRIORS unit wholly within 16" of a friendly model with this command ability. If you do so, that run roll is treated as being 6. In addition, that unit can run and still charge later in the same turn.`,
        when: [MOVEMENT_PHASE],
        command_ability: true,
      },
      {
        name: `Hew the Foe`,
        desc: `Add 1 to the Damage characteristic of this general's melee weapons.`,
        when: [COMBAT_PHASE],
        command_trait: true,
      },
      {
        name: `Thronebreaker's Torc`,
        desc: `Ignore modifiers (positive and negative) when making save rolls for attacks that target this model.`,
        when: [COMBAT_PHASE, SHOOTING_PHASE],
        artifact: true,
      },
    ],
  },
  {
    name: `The Skullfiend Tribe`,
    effects: [
      {
        name: `Skull Hunters`,
        desc: `You can re-roll hit rolls of 1 for attacks made by friendly SKULLFIEND TRIBE MORTAL units that are wholly within 12" of an enemy HERO.`,
        when: [COMBAT_PHASE, SHOOTING_PHASE],
        allegiance_ability: true,
      },
      {
        name: `For the Brass Citadel`,
        desc: `You can use this command ability at the start of the combat phase. If you do so, pick 1 friendly model with this command ability. Until the end of that phase, you can re-roll hit and wound rolls for attacks made by friendly SKULLFIEND TRIBE KHORGORATH units wholly within 10" of that model.`,
        when: [START_OF_COMBAT_PHASE],
        command_ability: true,
      },
      {
        name: `Master Decapitator`,
        desc: `You receive 2 Blood Tithe points instead of 1 when this general slays a HERO.`,
        when: [COMBAT_PHASE, SHOOTING_PHASE],
        command_trait: true,
      },
      {
        name: `Crowncleaver`,
        desc: `Pick one of the bearer's melee weapons. Add 2 to the Attacks characteristic of that weapon.`,
        when: [COMBAT_PHASE],
        artifact: true,
      },
    ],
  },
]

export default Allegiances

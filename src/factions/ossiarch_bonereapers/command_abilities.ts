import { TItemDescriptions } from 'factions/factionTypes'
import { tagAs } from 'factions/metatagger'
import {
  CHARGE_PHASE,
  COMBAT_PHASE,
  END_OF_CHARGE_PHASE,
  END_OF_MOVEMENT_PHASE,
  HERO_PHASE,
  MOVEMENT_PHASE,
  SHOOTING_PHASE,
  START_OF_COMBAT_PHASE,
} from 'types/phases'

const CommandAbilities = {
  'Re-form Ranks': {
    effects: [
      {
        name: `Re-form Ranks`,
        desc: `You can use this command ability in your movement phase. The unit that receives the command must be a friendly OSSIARCH BONEREAPERS unit. That unit can retreat in that phase and still charge later in the turn.`,
        when: [MOVEMENT_PHASE],
      },
    ],
  },
  'Impenetrable Ranks': {
    effects: [
      {
        name: `Impenetrable Ranks`,
        desc: `You can use this command ability when a friendly OSSIARCH BONEREAPERS unit is picked as the target of an attack. That unit must receive the command. Until the end of the phase, add 1 to ward rolls for that unit for the purposes of the Deathless Warriors battle trait.`,
        when: [COMBAT_PHASE, SHOOTING_PHASE],
      },
    ],
  },
  'Unstoppable Advance': {
    effects: [
      {
        name: `Unstoppable Advance`,
        desc: `You can use this command ability in your movement phase when you pick a friendly OSSIARCH BONEREAPERS unit to make a normal move. Add 3" to that unit's Move characteristic until the end of that phase.`,
        when: [MOVEMENT_PHASE],
      },
    ],
  },
  'Endless Duty': {
    effects: [
      {
        name: `Endless Duty`,
        desc: `You can use this command ability in your hero phase. The unit that receives the command must be a friendly OSSIARCH BONEREAPERS unit. Until your next hero phase, add 1 to the Attacks characteristic of that unit's melee weapons.`,
        when: [HERO_PHASE],
      },
    ],
  },
  'Reknit Construct': {
    effects: [
      {
        name: `Reknit Construct`,
        desc: `You can use this command ability at the end of your movement phase. The unit that receives the command must be a friendly OSSIARCH BONEREAPERS unit that is more than 3" from all enemy units. You can heal up to D3 wounds allocated to that unit or, if no wounds are allocated to it, you can return a number of slain models to that unit that have a combined Wounds characteristic of D3 or less.`,
        when: [END_OF_MOVEMENT_PHASE],
      },
    ],
  },
  'Unflinching Coordination': {
    effects: [
      {
        name: `Unflinching Coordination`,
        desc: `You can use this command ability in the combat phase, after a friendly OSSIARCH BONEREAPERS HERO has fought for the first time in that phase. The unit that receives the command must be a friendly OSSIARCH BONEREAPERS unit that has not yet fought in that combat phase, that is within 3" of an enemy unit and that is wholly within 12" of that friendly OSSIARCH BONEREAPERS HERO. That unit fights immediately.
        
        Designer's Note: If the unit you pick to fight immediately is an OSSIARCH BONEREAPERS HERO, after that unit has fought, you cannot then use this command ability to pick another friendly OSSIARCH BONEREAPERS unit to fight immediately.`,
        when: [COMBAT_PHASE],
      },
    ],
  },
  'Still Their Breath!': {
    effects: [
      {
        name: `Still Their Breath!`,
        desc: `You can use this command ability in the combat phase. This unit must receive the command. Until your next hero phase, add 1 to wound rolls for attacks made with melee weapons by friendly MORTIS PRAETORIANS units while they are wholly within 12" of this unit.`,
        when: [COMBAT_PHASE],
      },
    ],
  },
  Shieldwall: {
    effects: [
      {
        name: `Shieldwall`,
        desc: `You can use this command ability at the start of the combat phase. The command can only be issued by this unit's Mortek Hekatos, and this unit must receive the command. Ignore modifiers (positive and negative) to save rolls for attacks that target this unit in that phase.`,
        when: [START_OF_COMBAT_PHASE],
      },
    ],
  },
  'Deathrider Wedge': {
    effects: [
      {
        name: `Deathrider Wedge`,
        desc: `You can use this command ability in the charge phase. The command can only be issued by this unit's Mortek Hekatos, and this unit must receive the command. Until the end of that phase, models in this unit can pass across other models with a Wounds characteristic of 3 or less in the same manner as a model that can fly.`,
        when: [CHARGE_PHASE],
      },
    ],
  },
  'Hunt and Kill': {
    effects: [
      {
        name: `Hunt and Kill`,
        desc: `You can use this command ability in your hero phase. The command can only be issued by a model in this unit, and this unit must receive the command. Until your next hero phase, this unit can run and still charge later in the turn. In addition, until your next hero phase, models in this unit can pass across terrain features in the same manner as models that can fly.`,
        when: [HERO_PHASE],
      },
    ],
  },
  'Supreme Lord of the Bonereaper Legions': {
    effects: [
      {
        name: `Supreme Lord of the Bonereaper Legions`,
        desc: `You can use this command ability in your hero phase if this unit is more than 3" from all enemy units. This unit must receive the command. Until your next hero phase, add 1 to hit rolls for attacks made by friendly OSSIARCH BONEREAPERS units wholly within 24" of this unit and add 1 to save rolls for attacks that target friendly OSSIARCH BONEREAPERS units wholly within 24" of this unit.`,
        when: [HERO_PHASE],
      },
    ],
  },
  'Counter-strike': {
    effects: [
      {
        name: `Counter-strike`,
        desc: `You can use this command ability in the enemy charge phase, after an enemy unit has finished a charge move. The unit that receives the command must be a friendly OSSIARCH BONEREAPERS unit that is within 3" of an enemy unit that made a charge move in the same turn and more than 3" from all other enemy units. Add 1 to wound rolls for attacks made with melee weapons by that unit in the following combat phase.`,
        when: [END_OF_CHARGE_PHASE],
      },
    ],
  },
  Bludgeon: {
    effects: [
      {
        name: `Bludgeon`,
        desc: `You can use this command ability at the start of the combat phase. The unit that receives the command must be a friendly OSSIARCH BONEREAPERS unit. Improve the Rend characteristic of that unit's melee weapons by 1 until the end of that phase.`,
        when: [START_OF_COMBAT_PHASE],
      },
    ],
  },
  'Crushing Assault': {
    effects: [
      {
        name: `Crushing Assault`,
        desc: `You can use this command ability once per battle, after this unit has fought for the first time in the combat phase. The command can only be issued by a model in this unit, and this unit must receive the command. This unit can fight for a second time in that phase. The strike-last effect applies to this unit when it fights for that second time.`,
        when: [COMBAT_PHASE],
      },
    ],
  },
} satisfies TItemDescriptions

export default tagAs(CommandAbilities, 'command_ability')

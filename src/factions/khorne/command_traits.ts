import { tagAs } from 'factions/metatagger'
import {
  BATTLESHOCK_PHASE,
  CHARGE_PHASE,
  COMBAT_PHASE,
  DURING_GAME,
  END_OF_CHARGE_PHASE,
  END_OF_COMBAT_PHASE,
  HERO_PHASE,
  MOVEMENT_PHASE,
  SHOOTING_PHASE,
  WOUND_ALLOCATION_PHASE,
} from 'types/phases'
const CommandTraits = {
  // Common
  'Arch-slaughterer': {
    effects: [
      {
        name: `Arch-slaughterer`,
        desc: `Each time an attack made by this general with a melee weapon slays an enemy HERO or MONSTER, you receive 2 Blood Tithe points instead of 1.`,
        when: [DURING_GAME],
      },
    ],
  },
  'Unrivalled Battlelust': {
    effects: [
      {
        name: `Unrivalled Battlelust`,
        desc: `At the end of your opponent's charge phase, if this general is within 12" of any enemy units (but not within 3" of any enemy units), you can attempt to make a charge move with this general.`,
        when: [END_OF_CHARGE_PHASE],
      },
    ],
  },
  Slaughterborn: {
    effects: [
      {
        name: `Slaughterborn`,
        desc: `You can reroll hit rolls for attacks made with melee weapons by this general.`,
        when: [COMBAT_PHASE],
      },
    ],
  },
  // Mortals
  'Hungry for Glory': {
    effects: [
      {
        name: `Hungry for Glory`,
        desc: `You can reroll hit and wound rolls for attacks made by this general that target an enemy HERO or MONSTER.`,
        when: [COMBAT_PHASE, SHOOTING_PHASE],
      },
    ],
  },
  'Berserker Lord': {
    effects: [
      {
        name: `Berserker Lord`,
        desc: `Roll a D6 each time you allocate a wound or mortal wound to this general. On a 5+ that wound or mortal wound is negated.`,
        when: [WOUND_ALLOCATION_PHASE],
      },
    ],
  },
  'Violent Urgency': {
    effects: [
      {
        name: `Violent Urgency`,
        desc: `You can reroll charge rolls for friendly KHORNE units that are wholly within 12" of this general when the charge roll is made.`,
        when: [CHARGE_PHASE],
      },
    ],
  },
  // Bloodbound
  'Mark of the Cannibal': {
    effects: [
      {
        name: `Mark of the Cannibal`,
        desc: `At the end of the combat phase, if any enemy models were slain by this general's attacks in that combat phase, you can heal 1 wound allocated to this general.`,
        when: [END_OF_COMBAT_PHASE],
      },
    ],
  },
  Bloodsworn: {
    effects: [
      {
        name: `Bloodsworn`,
        desc: `While friendly KHORNE MORTAL units are wholly within 16" of this general, they can use this general's Bravery characteristic instead of their own.`,
        when: [BATTLESHOCK_PHASE],
      },
    ],
  },
  'Disciple of Khorne': {
    effects: [
      {
        name: `Disciple of Khorne`,
        desc: `Add 2 to the Attacks characteristic of this general's melee weapons.`,
        when: [COMBAT_PHASE],
      },
    ],
  },
  // Daemons
  'Rage Unchained': {
    effects: [
      {
        name: `Rage Unchained (Daemon)`,
        desc: `Add 1 to the Attacks characteristic of this general's melee weapons.`,
        when: [COMBAT_PHASE],
      },
    ],
  },
  'Aspect of Death': {
    effects: [
      {
        name: `Aspect of Death (Daemon)`,
        desc: `If an enemy unit fails a battleshock test within 8" of this general, add D3 to the number of models that flee.`,
        when: [BATTLESHOCK_PHASE],
      },
    ],
  },
  'Devastating Blow': {
    effects: [
      {
        name: `Devastating Blow (Daemon)`,
        desc: `If the unmodified wound roll for an attack made with a melee weapon by this general is 6, that attack inflicts a number of mortal wounds on the target equal to that melee weapon's Damage characteristic and the attack sequence ends (do not make a wound or save roll).`,
        when: [COMBAT_PHASE],
      },
    ],
  },
  // Reapers of Vengeance
  'Mage Eater': {
    effects: [
      {
        name: `Mage Eater`,
        desc: `This general can attempt to unbind one spell in the enemy hero phase in the same manner as a WIZARD. In addition, if this general attempts to unbind a spell and the unmodified unbinding roll is 8, that spell is successfully unbound and the caster suffers D6 mortal wounds. If this general can already unbind spells, they can attempt to unbind 1 extra spell in the enemy hero phase (only the first unbinding roll in the phase can inflict mortal wounds).`,
        when: [HERO_PHASE],
      },
    ],
  },
  // Bloodlords
  "Slaughterer's Thirst": {
    effects: [
      {
        name: `Slaughterer's Thirst`,
        desc: `Add 4" to the Move characteristic of this general.`,
        when: [MOVEMENT_PHASE],
      },
      {
        name: `Slaughterer's Thirst`,
        desc: `You can reroll charge rolls for this general.`,
        when: [CHARGE_PHASE],
        command_trait: true,
      },
    ],
  },
  // Goretide
  'Hew the Foe': {
    effects: [
      {
        name: `Hew the Foe`,
        desc: `Add 1 to the Damage characteristic of this general's melee weapons.`,
        when: [COMBAT_PHASE],
      },
    ],
  },
  // Skullfiend Tribe
  'Master Decapitator': {
    effects: [
      {
        name: `Master Decapitator`,
        desc: `You receive 2 Blood Tithe points instead of 1 when this general slays a HERO.`,
        when: [COMBAT_PHASE, SHOOTING_PHASE],
      },
    ],
  },
  // Flayed
  'Vessel of Butchery': {
    effects: [
      {
        name: `Vessel of Butchery`,
        desc: `You can reroll prayer rolls of 1 for friendly Flayed priests wholly within 8" of this general.`,
        when: [HERO_PHASE],
      },
    ],
  },
  // Baleful Lords
  'Thirst for Carnage': {
    effects: [
      {
        name: `Thirst for Carnage`,
        desc: `Add 1 to charge rolls for friendly Baleful Lords Bloodthirsters within 8" of this general.`,
        when: [CHARGE_PHASE],
      },
    ],
  },
}

export default tagAs(CommandTraits, 'command_trait')

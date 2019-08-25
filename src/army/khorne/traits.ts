import { TTraits } from 'types/army'
import {
  BATTLESHOCK_PHASE,
  CHARGE_PHASE,
  COMBAT_PHASE,
  DURING_GAME,
  END_OF_CHARGE_PHASE,
  END_OF_COMBAT_PHASE,
  SHOOTING_PHASE,
} from 'types/phases'

const CommandTraits: TTraits = [
  {
    name: `Arch-slaughterer`,
    effects: [
      {
        name: `Arch-slaughterer`,
        desc: `Each time an attack made by this general with a melee weapon slays an enemy HERO or MONSTER, you receive 2 Blood Tithe points instead of 1.`,
        when: [DURING_GAME],
      },
    ],
  },
  {
    name: `Unrivalled Battlelust`,
    effects: [
      {
        name: `Unrivalled Battlelust`,
        desc: `At the end of your opponent's charge phase, if this general is within 12" of any enemy units (but not within 3" of any enemy units), you can attempt to make a charge move with this general.`,
        when: [END_OF_CHARGE_PHASE],
      },
    ],
  },
  {
    name: `Slaughterborn`,
    effects: [
      {
        name: `Slaughterborn`,
        desc: `You can re-roll hit rolls for attacks made with melee weapons by this general.`,
        when: [COMBAT_PHASE],
      },
    ],
  },
  {
    name: `Mark of the Cannibal (Bloodbound)`,
    effects: [
      {
        name: `Mark of the Cannibal (Bloodbound)`,
        desc: `At the end of the combat phase, if any enemy models were slain by this general's attacks in that combat phase, you can heal 1 wound allocated to this general.`,
        when: [END_OF_COMBAT_PHASE],
      },
    ],
  },
  {
    name: `Bloodsworn (Bloodbound)`,
    effects: [
      {
        name: `Bloodsworn (Bloodbound)`,
        desc: `While friendly KHORNE MORTAL units are wholly within 16" of this general, they can use this general's Bravery characteristic instead of their own.`,
        when: [BATTLESHOCK_PHASE],
      },
    ],
  },
  {
    name: `Disciple of Khorne (Bloodbound)`,
    effects: [
      {
        name: `Disciple of Khorne (Bloodbound)`,
        desc: `Add 2 to the Attacks characteristic of this general's melee weapons.`,
        when: [COMBAT_PHASE],
      },
    ],
  },
  {
    name: `Rage Unchained (Daemon)`,
    effects: [
      {
        name: `Rage Unchained (Daemon)`,
        desc: `Add 1 to the Attacks characteristic of this general's melee weapons.`,
        when: [COMBAT_PHASE],
      },
    ],
  },
  {
    name: `Aspect of Death (Daemon)`,
    effects: [
      {
        name: `Aspect of Death (Daemon)`,
        desc: `If an enemy unit fails a battleshock test within 8" of this general, add D3 to the number of models that flee.`,
        when: [BATTLESHOCK_PHASE],
      },
    ],
  },
  {
    name: `Devastating Blow (Daemon)`,
    effects: [
      {
        name: `Devastating Blow (Daemon)`,
        desc: `If the unmodified wound roll for an attack made with a melee weapon by this general is 6, that attack inflicts a number of mortal wounds on the target equal to that melee weapon's Damage characteristic and the attack sequence ends (do not make a wound or save roll).`,
        when: [COMBAT_PHASE],
      },
    ],
  },
  {
    name: `Hungry for Glory (Mortal)`,
    effects: [
      {
        name: `Hungry for Glory (Mortal)`,
        desc: `You can re-roll hit and wound rolls for attacks made by this general that target an enemy HERO or MONSTER.`,
        when: [COMBAT_PHASE, SHOOTING_PHASE],
      },
    ],
  },
  {
    name: `Berzerker Lord (Mortal)`,
    effects: [
      {
        name: `Berzerker Lord (Mortal)`,
        desc: `Roll a D6 each time you allocate a wound or mortal wound to this general. On a 5+ that wound or mortal wound is negated.`,
        when: [COMBAT_PHASE],
      },
    ],
  },
  {
    name: `Violent Urgency (Mortal)`,
    effects: [
      {
        name: `Violent Urgency (Mortal)`,
        desc: `You can re-roll charge rolls for friendly KHORNE units that are wholly within 12" of this general when the charge roll is made.`,
        when: [CHARGE_PHASE],
      },
    ],
  },
]

export default CommandTraits

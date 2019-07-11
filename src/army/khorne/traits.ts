import { TCommandTraits } from 'types/army'
import {
  CHARGE_PHASE,
  SHOOTING_PHASE,
  BATTLESHOCK_PHASE,
  COMBAT_PHASE,
  END_OF_COMBAT_PHASE,
  DURING_GAME,
  END_OF_CHARGE_PHASE,
} from 'types/phases'

const CommandTraits: TCommandTraits = [
  {
    name: `Arch-slaughterer`,
    effects: [
      {
        name: `Arch-slaughterer`,
        desc: `You generate one additional Blood Tithe point each time your general slays an enemy HERO or MONSTER`,
        when: [DURING_GAME],
      },
    ],
  },
  {
    name: `Unrivalled Battlelust`,
    effects: [
      {
        name: `Unrivalled Battlelust`,
        desc: `If your general is within 12" of an enemy unit (but not within 3" of an enemy unit) at the end of any of your opponent’s charge phases, you can immediately attempt a charge move with your general.`,
        when: [END_OF_CHARGE_PHASE],
      },
    ],
  },
  {
    name: `Slaughterborn`,
    effects: [
      {
        name: `Slaughterborn`,
        desc: `You can re-roll all of your general’s failed hit rolls when making attacks in the combat phase.`,
        when: [COMBAT_PHASE],
      },
    ],
  },
  {
    name: `Mark of the Cannibal (Bloodbound)`,
    effects: [
      {
        name: `Mark of the Cannibal (Bloodbound)`,
        desc: `If your general slays one or more enemy models in the combat phase, they heal 1 wound at the end of the phase.`,
        when: [END_OF_COMBAT_PHASE],
      },
    ],
  },
  {
    name: `Bloodsworn (Bloodbound)`,
    effects: [
      {
        name: `Bloodsworn (Bloodbound)`,
        desc: `KHORNE MORTAL units from your army within 8" of your general can use your general’s Bravery characteristic in place of their own when making battleshock tests.`,
        when: [BATTLESHOCK_PHASE],
      },
    ],
  },
  {
    name: `Disciple of Khorne (Bloodbound)`,
    effects: [
      {
        name: `Disciple of Khorne (Bloodbound)`,
        desc: `Add 1 to the Attacks characteristic of all melee weapons wielded by your general (but not any weapons used by their mount if they have one).`,
        when: [COMBAT_PHASE],
      },
    ],
  },
  {
    name: `Immense Power (Daemon)`,
    effects: [
      {
        name: `Immense Power (Daemon)`,
        desc: `Add 1 to the Damage characteristic of all melee weapons wielded by your general (but not any weapons used by their mount if they have one).`,
        when: [COMBAT_PHASE],
      },
    ],
  },
  {
    name: `Aspect of Death (Daemon)`,
    effects: [
      {
        name: `Aspect of Death (Daemon)`,
        desc: `Each time an enemy unit within 8" of your general fails a battleshock test, one additional model flees from the unit.`,
        when: [BATTLESHOCK_PHASE],
      },
    ],
  },
  {
    name: `Devastating Blow (Daemon)`,
    effects: [
      {
        name: `Devastating Blow (Daemon)`,
        desc: `Any wound rolls of 6 for attacks made by your general in the combat phase inflict a number of mortal wounds equal to the weapon’s Damage characteristic instead of being resolved normally.`,
        when: [COMBAT_PHASE],
      },
    ],
  },
  {
    name: `Hungry for Glory (Mortal)`,
    effects: [
      {
        name: `Hungry for Glory (Mortal)`,
        desc: `You can reroll all hit and wound rolls of 1 for your general when attacking enemy HEROES or MONSTERS.`,
        when: [COMBAT_PHASE, SHOOTING_PHASE],
      },
    ],
  },
  {
    name: `Berzerker Lord (Mortal)`,
    effects: [
      {
        name: `Berzerker Lord (Mortal)`,
        desc: `Roll a dice each time your general suffers an unsaved wound or mortal wound in the combat phase; on a roll of 5 or 6, the wound or mortal wound is ignored.`,
        when: [COMBAT_PHASE],
      },
    ],
  },
  {
    name: `Violent Urgency (Mortal)`,
    effects: [
      {
        name: `Violent Urgency (Mortal)`,
        desc: `You can reroll failed charge rolls for your general and any KHORNE units from your army that are within 8" of him at the start of the charge phase.`,
        when: [CHARGE_PHASE],
      },
    ],
  },
]

export default CommandTraits

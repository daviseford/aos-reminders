import { TCommandTraits } from 'types/army'
import { COMBAT_PHASE, CHARGE_PHASE, BATTLESHOCK_PHASE, START_OF_COMBAT_PHASE, SHOOTING_PHASE } from 'types/phases'

const CommandTraits: TCommandTraits = [
  {
    name: `Hulking Muscle-bound Brute`,
    effects: [
      {
        name: `Hulking Muscle-bound Brute`,
        desc: `You can re-roll wound rolls of 1 for attacks made with this general’s melee weapons.`,
        when: [COMBAT_PHASE],
      },
    ],
  },
  {
    name: `Live to Fight`,
    effects: [
      {
        name: `Live to Fight`,
        desc: `You can re-roll failed hit rolls for attacks made by this general if they charged in the same turn.`,
        when: [COMBAT_PHASE],
      },
    ],
  },
  {
    name: `Brutish Cunning`,
    effects: [
      {
        name: `Brutish Cunning`,
        desc: `Roll a dice at the start of your opponent’s charge phase. On a 5+ one friendly IRONJAWZ unit wholly within 12" of this general can attempt to charge. This charge takes place before any enemy charges.`,
        when: [CHARGE_PHASE],
      },
    ],
  },
  {
    name: `Bestial Charisma`,
    effects: [
      {
        name: `Bestial Charisma`,
        desc: `If this general is chosen as the model from which the Inspiring Presence command ability is measured, you can pick D3 units rather than 1 to be affected by the command ability.`,
        when: [BATTLESHOCK_PHASE],
      },
    ],
  },
  {
    name: `Prophet of the Waaagh!`,
    effects: [
      {
        name: `Prophet of the Waaagh!`,
        desc: `If this general has the Waaagh! or Mighty Waaagh! command ability, you can re-roll the dice to see if the relevant units can make an extra attack. If this general does not have one of these abilities, they can use the Waaagh! command ability from the Orruk Megaboss warscroll.`,
        when: [START_OF_COMBAT_PHASE],
      },
    ],
  },
  {
    name: `Ironclad`,
    effects: [
      {
        name: `Ironclad`,
        desc: `Worsen the Rend characteristic of enemy weapons by 1, to a minimum of ‘-’, if they target this general.`,
        when: [COMBAT_PHASE, SHOOTING_PHASE],
      },
    ],
  },
]

export default CommandTraits

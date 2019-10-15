import { TTraits } from 'types/army'
import {
  BATTLESHOCK_PHASE,
  CHARGE_PHASE,
  COMBAT_PHASE,
  DURING_GAME,
  HERO_PHASE,
  SHOOTING_PHASE,
  START_OF_COMBAT_PHASE,
  TURN_ONE_HERO_PHASE,
  MOVEMENT_PHASE,
} from 'types/phases'

const CommandTraits: TTraits = [
  {
    name: `Hulking Muscle-bound Brute`,
    effects: [
      {
        name: `Hulking Muscle-bound Brute`,
        desc: `After this general makes a charge move, you can pick 1 enemy unit within 1" of this general and roll a D6. On a 2+ that enemy unit suffers D3 mortal wounds.`,
        when: [CHARGE_PHASE],
      },
    ],
  },
  {
    name: `Live to Fight`,
    effects: [
      {
        name: `Live to Fight`,
        desc: `You can re-roll wound rolls for attacks made by this general and their mount if they charged in the same turn.`,
        when: [COMBAT_PHASE],
      },
    ],
  },
  {
    name: `Brutish Cunning`,
    effects: [
      {
        name: `Brutish Cunning`,
        desc: `Once per battle round, this general can use the mighty destroyers command ability without spending a command point.`,
        when: [HERO_PHASE],
      },
    ],
  },
  {
    name: `Bestial Charisma`,
    effects: [
      {
        name: `Bestial Charisma`,
        desc: `Once per battle round this general can use the Inspiring Presence without spending a command point.`,
        when: [BATTLESHOCK_PHASE],
      },
    ],
  },
  {
    name: `Mighty Waaagh!`,
    effects: [
      {
        name: `Mighty Waaagh!`,
        desc: `Your Ironjawz Waagh! ability increases range from 18" to 24".`,
        when: [START_OF_COMBAT_PHASE],
      },
    ],
  },
  {
    name: `Ironclad`,
    effects: [
      {
        name: `Ironclad`,
        desc: `Add 1 to the save rolls for this general.`,
        when: [COMBAT_PHASE, SHOOTING_PHASE],
      },
    ],
  },
  {
    name: `Dead Kunnin'`,
    effects: [
      {
        name: `Dead Kunnin'`,
        desc: `Gain D3 extra command points at the start of the first hero phase.`,
        when: [TURN_ONE_HERO_PHASE],
      },
    ],
  },
  {
    name: `Master of the Weird`,
    effects: [
      {
        name: `Master of the Weird`,
        desc: `This general gains +1 to casting, dispelling, and unbinding attempts.`,
        when: [HERO_PHASE],
      },
    ],
  },
  {
    name: `Burstin' with Power`,
    effects: [
      {
        name: `Burstin' with Power`,
        desc: `The general knows 1 extra spell from the lore of the weird, in addition, they can cast 1 extra spell.`,
        when: [HERO_PHASE],
      },
    ],
  },
  {
    name: `Big 'Un`,
    effects: [
      {
        name: `Big 'Un`,
        desc: `+1 to the wound characteristic to this model.`,
        when: [DURING_GAME],
      },
    ],
  },
  {
    name: `Fast 'Un`,
    effects: [
      {
        name: `Fast 'Un`,
        desc: `Add +2 to the movement characteristic of this model.`,
        when: [MOVEMENT_PHASE],
      },
    ],
  },
  {
    name: `Mean 'Un`,
    effects: [
      {
        name: `Mean 'Un`,
        desc: `Add 1 to the damage characteristic of this model's Mighty Fists and Tail attacks.`,
        when: [COMBAT_PHASE],
      },
    ],
  },
  {
    name: `Heavy 'Un`,
    effects: [
      {
        name: `Heavy 'Un`,
        desc: `Add 1 to the dice rolls for the Destructive Bulk ability.`,
        when: [CHARGE_PHASE],
      },
    ],
  },
  {
    name: `Loud 'Un`,
    effects: [
      {
        name: `Loud 'Un`,
        desc: `Once per battle, give -1 to hit for enemies within 3".`,
        when: [START_OF_COMBAT_PHASE],
      },
    ],
  },
  {
    name: `Weird 'Un`,
    effects: [
      {
        name: `Weird 'Un`,
        desc: `You may ignore spell and endless spell effects on this model with a dice roll of a 4+.`,
        when: [HERO_PHASE],
      },
    ],
  },
]

export default CommandTraits

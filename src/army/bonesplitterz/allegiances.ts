import { TAllegiances } from 'types/army'
import {
  BATTLESHOCK_PHASE,
  CHARGE_PHASE,
  COMBAT_PHASE,
  DURING_GAME,
  END_OF_COMBAT_PHASE,
  HERO_PHASE,
  MOVEMENT_PHASE,
  SHOOTING_PHASE,
  START_OF_COMBAT_PHASE,
} from 'types/phases'

// This is where we store sub-allegiances such as
const Allegiances: TAllegiances = [
  {
    name: `Bonegrinz Clan`,
    effects: [
      {
        name: `Bring it On!`,
        desc: `Enemy units within 12" of your units must attempt and finish a charge move if they are able. Enemy units within 3" of your units cannot choose to retreat.`,
        when: [CHARGE_PHASE],
      },
      {
        name: `Feel da Spirit`,
        desc: `At the start of the combat phase, pick 1 friendly unit wholly within 18" of a Savage Big Boss, if that unit makes unmodified hit rolls of 6, they score 2 hits.`,
        when: [START_OF_COMBAT_PHASE],
        command_ability: true,
      },
      {
        name: `A Right Monster`,
        desc: `Enemy units within 12" of this general subtract 1 from their Bravery characteristic.`,
        when: [BATTLESHOCK_PHASE],
        command_trait: true,
      },
      {
        name: `Maw-Krusha Beast Totem`,
        desc: `Once per battle, the bearer can use the Innard-Bursting Bellow from the Maw Krusha warscroll.`,
        when: [SHOOTING_PHASE],
        artifact: true,
      },
    ],
  },
  {
    name: `Icebone Clan`,
    effects: [
      {
        name: `Freezing Strike`,
        desc: `Unmodified wound rolls of 6 increase the rend of that attack by 1.`,
        when: [SHOOTING_PHASE, COMBAT_PHASE],
      },
      {
        name: `Freeze and Run`,
        desc: `At the end of the combat phase, pick 1 friendly Icebone Boarboys unit that is within 3" of an enemy unit and wholly within 18" of a friendly hero. That friendly unit can retreat and the enemy units that were within 3" get -2 on their charge roll.`,
        when: [END_OF_COMBAT_PHASE],
        command_ability: true,
      },
      {
        name: `Pure-bred War Boar`,
        desc: `Add 2" to the move characteristic of the bearer. Also add 1 to hit and wound rolls for the boar attacks.`,
        when: [MOVEMENT_PHASE, COMBAT_PHASE],
        command_trait: true,
      },
      {
        name: `Kattanak Pelt`,
        desc: `Add 1 to the Bravery characteristic of friendly units that are wholly within 18" of the bearer.`,
        when: [BATTLESHOCK_PHASE],
        artifact: true,
      },
    ],
  },
  {
    name: `Drakkfoot Clan`,
    effects: [
      {
        name: `Strength of Purpose`,
        desc: `Units in this clan can ignore the etheral save keyword. Also all abilities that negate wounds are ignored whe taking wounds from this clan.`,
        when: [COMBAT_PHASE, SHOOTING_PHASE],
      },
      {
        name: `Shout Down da Magic!`,
        desc: `If an enemy wizard casts a spell you may pick a unit with 10+ models and wholly within 18" of a friendly Wurrgog prophet or Wardokk, that unit can attempt to unbind that spell. +1 to unbind if the unit has 20 or more models.`,
        when: [HERO_PHASE],
        command_ability: true,
      },
      {
        name: `Fireball!`,
        desc: `All wizards in the clan know the Fireball spell instead of Arcane bolt and can cast it. Casting Value 5. Pick 1 enemy unit within 18". It suffers 1 mortal wound if it has 1 model, D3 mortal wounds instead if it has 2-9 models, or D6 mortal wounds instead if it has 10+ models.`,
        when: [HERO_PHASE],
        spell: true,
      },
      {
        name: `Burnin' Tattooz`,
        desc: `If you make a sucessful Warpaint save, pick an enemy unit within 1" and deal 1 mortal wound in return.`,
        when: [DURING_GAME],
        artifact: true,
      },
    ],
  },
]

export default Allegiances

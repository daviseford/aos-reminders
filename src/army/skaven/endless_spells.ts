import { TEndlessSpells } from 'types/army'
import {
  BATTLESHOCK_PHASE,
  CHARGE_PHASE,
  DURING_GAME,
  END_OF_MOVEMENT_PHASE,
  HERO_PHASE,
  MOVEMENT_PHASE,
  START_OF_ROUND,
} from 'types/phases'

const EndlessSpells: TEndlessSpells = [
  {
    name: `Warp Lightning Vortex (Skaven)`,
    effects: [
      {
        name: `Summon`,
        desc: `Casting value of 8. Only Skaventide wizards can attempt to cast this spell. If successfully cast, set up 1 of these models wholly within 26" of the caster. Then set up the second and third models exactly 7" from each other to form a triangle.`,
        when: [HERO_PHASE],
      },
      {
        name: `Warp Lightning Bolts`,
        desc: `Roll 1 dice for each unit within 6" of any of the models from this spell. Add 1 to the dice roll if that unit is within 6" of two models. Add 2 to the roll if that unit is within 6" of all three spell models. On a 4+ that unit suffers D3 mortal wounds. On an unmodified 6, that unit suffers D6 mortal wounds instead.`,
        when: [HERO_PHASE, END_OF_MOVEMENT_PHASE],
      },
      {
        name: `Warp Vortex`,
        desc: `Units cannot run or fly when they make a normal move that starts within 6" of any models from this endless spell.`,
        when: [DURING_GAME],
      },
    ],
  },
  {
    name: `Vermintide (Skaven)`,
    effects: [
      {
        name: `Predatory`,
        desc: `Vermintide can move up to 7".`,
        when: [START_OF_ROUND],
      },
      {
        name: `Summon`,
        desc: `Casting value of 7. Only Skaventide wizards can attempt to cast this spell. If successfully cast, set up 1 of these models wholly within 13" of the caster.`,
        when: [HERO_PHASE],
      },
      {
        name: `Ravening Horde`,
        desc: `After this model has moved, the player that moved it can pick 1 unit within 3" of this model and roll 13 dice. For each 6, that unit suffers 1 mortal wound.`,
        when: [START_OF_ROUND],
      },
      {
        name: `Ravening Horde`,
        desc: `Roll 13 dice for each unit that finishes a normal move or a charge move within 3" of this model. For each 6, that unit suffers 1 mortal wound.`,
        when: [MOVEMENT_PHASE, CHARGE_PHASE],
      },
      {
        name: `Voracious Hunger`,
        desc: `When this model is set up, the player who set it up can immediately make a move with it.`,
        when: [HERO_PHASE],
      },
      {
        name: `Ratkin`,
        desc: `Skaventide units are not affected by the Ravening Horde ability. In addition, Skaventide models can move across this model in the same manner as a model that can fly.`,
        when: [DURING_GAME],
      },
    ],
  },
  {
    name: `Bell of Doom (Skaven)`,
    effects: [
      {
        name: `Predatory`,
        desc: `Bell of Doom can move up to 13" and can fly.`,
        when: [START_OF_ROUND],
      },
      {
        name: `Summon`,
        desc: `Casting value of 6. Only Skaventide wizards can attempt to cast this spell. If successfully cast, set up 1 of these models wholly within 13" of the caster.`,
        when: [HERO_PHASE],
      },
      {
        name: `Apocalyptic Doom`,
        desc: `Roll 3D6 after this model is set up or finishes a move. On a roll of 13, each unit within 13" of this model suffers D3 mortal wounds. This model is then dispelled.`,
        when: [HERO_PHASE, START_OF_ROUND],
      },
      {
        name: `Boldness or Despair`,
        desc: `Do not take battleshock tests for Skaventide units while they are within 13" of this model. Subtract 1 from the Bravery characteristic of any other units while they are within 13" of this model.`,
        when: [BATTLESHOCK_PHASE],
      },
    ],
  },
]

export default EndlessSpells

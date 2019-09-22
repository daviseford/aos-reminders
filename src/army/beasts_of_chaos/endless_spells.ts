import { TEndlessSpells } from 'types/army'
import {
  BATTLESHOCK_PHASE,
  COMBAT_PHASE,
  HERO_PHASE,
  MOVEMENT_PHASE,
  SHOOTING_PHASE,
  START_OF_ROUND,
  START_OF_TURN,
} from 'types/phases'

const EndlessSpells: TEndlessSpells = [
  {
    name: `Ravening Direflock`,
    effects: [
      {
        name: `Summon Ravening Direflock`,
        desc: `Casting value of 5. Only BEASTS OF CHAOS WIZARDS can attempt to cast this spell. If successfully cast, set up a Ravening Direflock model wholly within 12" of the caster and more than 3" from any units, then set up the second and third Ravening Direflock models wholly within 6" of the first and more than 3" from any units.`,
        when: [HERO_PHASE],
      },
      {
        name: `Harbingers of Dark Omens`,
        desc: `Subtract 2 from the Bravery characteristic of units while they are within 6" of any Ravening Direflock models. BEASTS OF CHAOS units are not affected by this ability.`,
        when: [BATTLESHOCK_PHASE],
      },
      {
        name: `Black-souled Cowardice`,
        desc: `If a unit finishes a move within 1" of a Ravening Direflock model, remove that Ravening Direflock model from the battlefield. The player whose turn is taking place must set it up again exactly 3D6" from its previous location and more than 3" from any units, and then set up the two remaining Ravening Direflock models wholly within 6" of the first model and more than 3" from any units.`,
        when: [MOVEMENT_PHASE],
      },
    ],
  },
  {
    name: `Doomblast Dirgehorn`,
    effects: [
      {
        name: `Summon Doomblast Dirgehorn`,
        desc: `Casting value of 6. Only BEASTS OF CHAOS WIZARDS can attempt to cast this spell. If successfully cast, set up a Doomblast Dirgehorn model wholly within 12" of the caster.`,
        when: [HERO_PHASE],
      },
      {
        name: `Booming Cacophony`,
        desc: `Subtract 1 from hit rolls for attacks made by units within 3" of this model. BEASTS OF CHAOS models are not affected by this ability.`,
        when: [COMBAT_PHASE, SHOOTING_PHASE],
      },
      {
        name: `Rising Discord`,
        desc: `At the start of each battle round after this model is set up, add 3" to the range of this model's Booming Cacophony ability. If this model is dispelled, the next time it is set up on the battlefield, the range of this ability starts at 3".`,
        when: [START_OF_ROUND],
      },
    ],
  },
  {
    name: `Wildfire Taurus`,
    effects: [
      {
        name: `Summon Wildfire Taurus`,
        desc: `Casting value of 6. Only BEASTS OF CHAOS WIZARDS can attempt to cast this spell. If successfully cast, set up a Wildfire Taurus model wholly within 12" of the caster.`,
        when: [HERO_PHASE],
      },
      {
        name: `Predatory`,
        desc: `The Wildfire Taurus is a predatory endless spell. It can move up to 12" and can fly.`,
        when: [START_OF_TURN],
      },
      {
        name: `Raging Stampede`,
        desc: `When this model is set up, the player who set it up can immediately make a move with it.`,
        when: [HERO_PHASE],
      },
      {
        name: `Whirlwind of Destruction`,
        desc: `After this model has moved, each unit that it moved over, and each other unit that is within 1" of it at the end of its move, suffers D3 mortal wounds. If a unit has 10 or more models it suffers D6 mortal wounds instead. If this spell inflicts any wounds on a unit, that unit fights at the end of the next combat phase, after the players have picked any other units to fight in that phase.`,
        when: [START_OF_TURN],
      },
    ],
  },
]

export default EndlessSpells

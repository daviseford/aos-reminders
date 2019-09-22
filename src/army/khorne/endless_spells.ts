import {
  BATTLESHOCK_PHASE,
  COMBAT_PHASE,
  HERO_PHASE,
  SHOOTING_PHASE,
  START_OF_HERO_PHASE,
  START_OF_ROUND,
} from 'types/phases'
import { TEndlessSpells } from 'types/army'

// Judgements of Khorne.
const EndlessSpells: TEndlessSpells = [
  {
    name: `Hexgorger Skulls (Khorne)`,
    effects: [
      {
        name: `Compelled by Hate`,
        desc: `These flying models can be moved 8" by the player who prayed for the Judgement. Both models must finish any move within 6" of each other.`,
        when: [START_OF_ROUND],
      },
      {
        name: `Summon`,
        desc: `Prayer value of 3+. Only friendly Khorne Priests can attempt this. If successful, set up both of these models wholly within 8" of the Priest and within 6" of each other. You may then immediately move these models 8" ending the movement with each model 6" from the other.`,
        when: [START_OF_HERO_PHASE],
      },
      {
        name: `Hexgorgers`,
        desc: `Subtract 2 from the casting rolls for Wizards while they are within 12" of any Hexgorger Skulls models. If addition, if a Wizard attempts to cast a spell within 12" of both Hexgorger models from the same Judement and the casting roll is an unmodified 8, the attempt fails and each Wizard within 12" suffers D6 mortal wounds.`,
        when: [HERO_PHASE],
      },
    ],
  },
  {
    name: `Bleeding Icon (Khorne)`,
    effects: [
      {
        name: `Drifting Menace`,
        desc: `This flying model can be moved 8" by the player who prayed for the Judgement.`,
        when: [START_OF_ROUND],
      },
      {
        name: `Summon`,
        desc: `Prayer value of 4+. Only friendly Khorne Priests can attempt this. If successful, set up one of these models wholly within 8" of the Priest. You may then move this flying model 8".`,
        when: [HERO_PHASE],
      },
      {
        name: `Crushing Retribution`,
        desc: `After this model has moved, each unit that has any models it passed across, and each other unit that is within 1" of it at the end of its move, suffers D3 mortal wounds.`,
        when: [START_OF_ROUND],
      },
      {
        name: `Sigil of Doom`,
        desc: `If a unit fails a battleshock test within 3" of any models with this ability, add D3 to the number of models that flee. This ability has no effect on Khorne units.`,
        when: [BATTLESHOCK_PHASE],
      },
    ],
  },
  {
    name: `Wrath-Axe (Khorne)`,
    effects: [
      {
        name: `Compelled by Hate`,
        desc: `This flying model can be moved 8" by the player who prayed for the Judgement.`,
        when: [START_OF_ROUND],
      },
      {
        name: `Summon`,
        desc: `Prayer value of 5+. Only friendly Khorne Priests can attempt this. If successful, set up one of these models wholly within 8" of the Priest. You may then move this flying model 8".`,
        when: [START_OF_HERO_PHASE],
      },
      {
        name: `Hatred's Edge`,
        desc: `After this model has moved, roll a D6 for each unit that has any models it passed across. On a 2+ that unit suffers D3 mortal wounds. Then the player that set up this model picks 1 enemy unit within 3" of this model and rolls a dice (the enemy unit may be one that this model passed across). On a 2+ that enemy unit suffers D6 mortal wounds.`,
        when: [START_OF_ROUND],
      },
      {
        name: `Reality Cleaved`,
        desc: `Subtract 1 from hit rolls for attacks made by units within 3" of this model. This ability has no effect on Khorne units.`,
        when: [SHOOTING_PHASE, COMBAT_PHASE],
      },
    ],
  },
]

export default EndlessSpells

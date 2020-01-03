import { TArtifacts } from 'types/army'
import {
  DURING_GAME,
  END_OF_MOVEMENT_PHASE,
  END_OF_SETUP,
  START_OF_COMBAT_PHASE,
  START_OF_HERO_PHASE,
  START_OF_MOVEMENT_PHASE,
  START_OF_SHOOTING_PHASE,
} from 'types/phases'

const Artifacts: TArtifacts = [
  {
    name: `Heavy Metal Ingot`,
    effects: [
      {
        name: `Heavy Metal Ingot`,
        desc: `You can re-roll failed save rolls for the bearer as long as they have not made a move in the same turn.`,
        when: [DURING_GAME],
      },
    ],
  },
  {
    name: `Ancestral Pickaxe`,
    effects: [
      {
        name: `Ancestral Pickaxe`,
        desc: `Once per the battle, at the start of your movement phase, you can remove the bearer and up to 1 other friendly DISPOSSESSED unit within 6" of the bearer from the battlefield. They may be set up at the end of your next movement phase.`,
        when: [START_OF_MOVEMENT_PHASE],
      },
      {
        name: `Ancestral Pickaxe`,
        desc: `Units removed in your last movement phase may be set up anywhere on the battlefield, wholly within 6" of each other and more than 9" away from enemy models.`,
        when: [END_OF_MOVEMENT_PHASE],
      },
    ],
  },
  {
    name: `Teardrop of Grungni`,
    effects: [
      {
        name: `Teardrop of Grungni`,
        desc: `Once per battle, at the start of your shooting phase, pick an enemy unit within 6" of the bearer. That unit suffers D3 mortal wounds. In addition, if the target is a HERO or MONSTER, it must halve its Move characteristic in its next movement phase.`,
        when: [START_OF_SHOOTING_PHASE],
      },
    ],
  },
  {
    name: `Grudge Rune`,
    effects: [
      {
        name: `Grudge Rune`,
        desc: `After set up is complete but before the battle begins, pick an enemy HERO. You can re-roll failed hit and wound rolls for the bearer if the target of the attack is the enemy HERO you picked.`,
        when: [END_OF_SETUP],
      },
      {
        name: `Grudge Rune`,
        desc: `You can re-roll failed hit and wound rolls for the bearer if the target of the attack is the enemy HERO you picked before the battle begun.`,
        when: [DURING_GAME],
      },
    ],
  },
  {
    name: `Piledriver Gauntlets`,
    effects: [
      {
        name: `Piledriver Gauntlets`,
        desc: `At the start of the combat phase, you can declare that the bearer will strike the ground instead of attacking. If you do so, in that combat phase, subtract 1 from hit rolls for attacks made by enemy models that are within 6" of the bearer when they attack.`,
        when: [START_OF_COMBAT_PHASE],
      },
    ],
  },
  {
    name: `Resounding Gromrilhorn`,
    effects: [
      {
        name: `Resounding Gromrilhorn`,
        desc: `Once per battle, at the start of your hero phase, the bearer can use this artifact. If they do so, add 2 to the Bravery characteristic of friendly DISPOSSESSED units until your next hero phase.`,
        when: [START_OF_HERO_PHASE],
      },
    ],
  },
]

export default Artifacts

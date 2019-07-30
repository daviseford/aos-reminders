import { TArtifacts } from 'types/army'
import {
  BATTLESHOCK_PHASE,
  CHARGE_PHASE,
  COMBAT_PHASE,
  END_OF_CHARGE_PHASE,
  END_OF_COMBAT_PHASE,
  END_OF_ROUND,
  END_OF_SETUP,
  HERO_PHASE,
  MOVEMENT_PHASE,
  SHOOTING_PHASE,
  START_OF_COMBAT_PHASE,
  START_OF_GAME,
  START_OF_HERO_PHASE,
  START_OF_SHOOTING_PHASE,
  TURN_ONE_START_OF_ROUND,
} from 'types/phases'

const Artifacts: TArtifacts = [
  // Invaders Host Artifacts
  {
    name: `The Rod of Misrule (Invaders)`,
    effects: [
      {
        name: `The Rod of Misrule (Invaders)`,
        desc: `Roll a dice, on a 1 your opponent receives 1 command point.  On a 2-5 you receive 1 command point.  On a 6 you receive D3 command points.`,
        when: [START_OF_HERO_PHASE],
        artifact: true,
      },
    ],
  },
  {
    name: `Rapier of Ecstatic Conquest (Invaders)`,
    effects: [
      {
        name: `Rapier of Ecstatic Conquest (Invaders)`,
        desc: `Pick 1 of the bearer's melee weapons.  If the unmodified wound roll for an attack made by that weapon is a 6, the attack inflicts 1 mortal wound on the target in addtion to normal damage.`,
        when: [COMBAT_PHASE],
        artifact: true,
      },
    ],
  },
  {
    name: `Whip of Subversion (Invaders)`,
    effects: [
      {
        name: `Whip of Subversion (Invaders)`,
        desc: `You can pick 1 enemy hero within 6" of the bearer.  Pick 1 melee weapon that hero is armed with and then pick 1 other enemy unit within 1" of that hero.  The other unit suffers a number of mortal wounds equal to the attacks characteristic of the melee weapon selected.`,
        when: [END_OF_COMBAT_PHASE],
        artifact: true,
      },
    ],
  },
  {
    name: `Icon of Infinite Excess (Invaders)`,
    effects: [
      {
        name: `Icon of Infinite Excess (Invaders)`,
        desc: `Once per battle the bearer can use this artifact.  Until the end of the combat phase, add 1 to the hit rolls for units that were wholly within 12" of the bearer when this effect triggered.`,
        when: [START_OF_COMBAT_PHASE],
        artifact: true,
      },
    ],
  },
  {
    name: `Fallacious Gift (Invaders)`,
    effects: [
      {
        name: `Fallacious Gift (Invaders)`,
        desc: `Pick one enemy hero and select one of their weapons to trigger at the end of each battle round.`,
        when: [END_OF_SETUP],
        artifact: true,
      },
      {
        name: `Fallacious Gift (Invaders)`,
        desc: `If the chosen hero attacked with the selected weapon that hero suffers 1 mortal wound.`,
        when: [END_OF_ROUND],
        artifact: true,
      },
    ],
  },
  {
    name: `The Beguiling Gem (Invaders)`,
    effects: [
      {
        name: `The Beguiling Gem (Invaders)`,
        desc: `Pick 1 enemy hero within 3" of the bearer and roll 3D6.  If the roll is greater than that hero's bravery characteristic, subtract 1 from the attacks characteristic of all that hero's melee weapons (to a minimum of 0) until the end of the phase.`,
        when: [START_OF_COMBAT_PHASE],
        artifact: true,
      },
    ],
  },
  // Pretenders Artifacts
  {
    name: `The Crown of Dark Secrets (Pretenders)`,
    effects: [
      {
        name: `The Crown of Dark Secrets (Pretenders)`,
        desc: `Pick 1 enemy hero.  You can re-roll hit rolls for attacks made by the bearer against the target and re-roll unbinding attempts for spells cast by the target.`,
        when: [TURN_ONE_START_OF_ROUND],
        artifact: true,
      },
      {
        name: `The Crown of Dark Secrets (Pretenders)`,
        desc: `You can re-roll unbinding attempts for spells cast by the target.`,
        when: [HERO_PHASE],
        artifact: true,
      },
      {
        name: `The Crown of Dark Secrets (Pretenders)`,
        desc: `You can re-roll hit rolls for attacks made by the bearer against the target.`,
        when: [SHOOTING_PHASE, COMBAT_PHASE],
        artifact: true,
      },
    ],
  },
  {
    name: `Pendant of Slaanesh (Pretenders)`,
    effects: [
      {
        name: `Pendant of Slaanesh (Pretenders)`,
        desc: `You can heal up to D3 wounds allocated to the bearer.`,
        when: [START_OF_HERO_PHASE],
        artifact: true,
      },
    ],
  },
  {
    name: `Silverslash (Pretenders)`,
    effects: [
      {
        name: `Silverslash (Pretenders)`,
        desc: `Pick 1 of the bearer's melee weapons.`,
        when: [START_OF_GAME],
        artifact: true,
      },

      {
        name: `Silverslash (Pretenders)`,
        desc: `Add 2 to the attacks characteristic of selected weapon.`,
        when: [COMBAT_PHASE],
        artifact: true,
      },
    ],
  },
  {
    name: `Sceptre of Domination (Pretenders)`,
    effects: [
      {
        name: `Sceptre of Domination (Pretenders)`,
        desc: `If the bearer is within 12" of any enemy heros, and your opponent has any command points, roll a dice.  On a 4+ your opponent loses 1 command point and you receive 1 command point.`,
        when: [START_OF_HERO_PHASE],
        artifact: true,
      },
    ],
  },
  {
    name: `Breathtaker (Pretenders)`,
    effects: [
      {
        name: `Breathtaker (Pretenders)`,
        desc: `You can re-roll the dice roll that determines if an enemy hero within 3" of the bearer is affected by the Locus of Diversion trait.`,
        when: [END_OF_CHARGE_PHASE],
        artifact: true,
      },
    ],
  },
  {
    name: `Mask of Spiteful Beauty (Pretenders)`,
    effects: [
      {
        name: `Mask of Spiteful Beauty (Pretenders)`,
        desc: `Pick 1 enemy unit within 6" of the bearer.  Subtract 2 from that unit's bravery characteristic until your next hero phase.`,
        when: [START_OF_HERO_PHASE],
        artifact: true,
      },
      {
        name: `Mask of Spiteful Beauty (Pretenders)`,
        desc: `Subtract 2 from targeted unit's bravery characteristic until your next hero phase.`,
        when: [HERO_PHASE, SHOOTING_PHASE, COMBAT_PHASE, BATTLESHOCK_PHASE],
        artifact: true,
      },
    ],
  },
  // Godseekers Artifacts
  {
    name: `Cameo of the Dark Prince (Godseekers)`,
    effects: [
      {
        name: `Cameo of the Dark Prince (Godseekers)`,
        desc: `Once per battle can use this artefact.  You receive 1 command point.`,
        when: [START_OF_HERO_PHASE],
        artifact: true,
      },
      {
        name: `Cameo of the Dark Prince (Godseekers)`,
        desc: `If used at the start of this hero phase, you do not have to take battleshock tests for friendly Chaos Slaanesh units while they are wholly within 18" of the bearer.`,
        when: [BATTLESHOCK_PHASE],
        artifact: true,
      },
    ],
  },
  {
    name: `Girdle of the Realm-racer (Godseekers)`,
    effects: [
      {
        name: `Girdle of the Realm-racer (Godseekers)`,
        desc: `Subtract 1 from the bearer's wounds characteristic.  In addition, the bearer can fly.`,
        when: [HERO_PHASE, MOVEMENT_PHASE, CHARGE_PHASE, COMBAT_PHASE],
        artifact: true,
      },
    ],
  },
  {
    name: `Threnody Voicebox (Godseekers)`,
    effects: [
      {
        name: `Threnody Voicebox (Godseekers)`,
        desc: `You can pick 1 enemy hero that is within 3" of the bearer.  Subtract 1 from the attacks characteristic of melee weapons used by that hero (to a minimum of 1) until the end of the phase.`,
        when: [START_OF_COMBAT_PHASE],
        artifact: true,
      },
    ],
  },
  {
    name: `Lash of Despair (Godseekers)`,
    effects: [
      {
        name: `Lash of Despair (Godseekers)`,
        desc: `You can roll a dice for each enemy unit within 6" of the bearer.  On a 4+ that unit suffers 1 mortal wound.`,
        when: [START_OF_SHOOTING_PHASE],
        artifact: true,
      },
    ],
  },
  {
    name: `Erapturing Cirlet (Godseekers)`,
    effects: [
      {
        name: `Erapturing Cirlet (Godseekers)`,
        desc: `Enemy units within 3" of the bearer cannot retreat.`,
        when: [MOVEMENT_PHASE],
        artifact: true,
      },
      {
        name: `Erapturing Cirlet (Godseekers)`,
        desc: `Roll a dice for each enemy unit within 3" of the bearer.  On a 2+ that enemy unit suffers 1 mortal wound.`,
        when: [START_OF_HERO_PHASE],
        artifact: true,
      },
    ],
  },
  {
    name: `Bindings of Slaanesh (Godseekers)`,
    effects: [
      {
        name: `Bindings of Slaanesh (Godseekers)`,
        desc: `You can pick 1 enemy hero within 3" of the bearer and roll 2D6.  If the roll is greater than the targets move characteristic, subtract 1 from hit rolls for attacks made by that enemy.  
        
               In addtion, if the roll is greater than the target's wounds characteristic that enemy suffers D3 mortal wound.`,
        when: [START_OF_COMBAT_PHASE],
        artifact: true,
      },
    ],
  },
]

export default Artifacts

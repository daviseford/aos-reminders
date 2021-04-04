import { tagAs } from 'factions/metatagger'
import {
  BATTLESHOCK_PHASE,
  COMBAT_PHASE,
  DURING_GAME,
  END_OF_CHARGE_PHASE,
  END_OF_COMBAT_PHASE,
  END_OF_ROUND,
  END_OF_SETUP,
  HERO_PHASE,
  MOVEMENT_PHASE,
  SHOOTING_PHASE,
  START_OF_COMBAT_PHASE,
  START_OF_HERO_PHASE,
  START_OF_SHOOTING_PHASE,
  TURN_ONE_START_OF_ROUND,
  WOUND_ALLOCATION_PHASE,
} from 'types/phases'

const Artifacts = {
  // Invaders Host - Sacred Spoils of War
  'The Rod of Misrule': {
    effects: [
      {
        name: `The Rod of Misrule`,
        desc: `Roll a D6, on a 1 your opponent receives 1 command point. On a 2-5 you receive 1 command point. On a 6 you receive D3 command points.`,
        when: [START_OF_HERO_PHASE],
      },
    ],
  },
  'Rapier of Ecstatic Conquest': {
    effects: [
      {
        name: `Rapier of Ecstatic Conquest`,
        desc: `Pick 1 of the bearer's melee weapons. If the unmodified wound roll for an attack made by that weapon is a 6, the attack inflicts 1 mortal wound on the target in addition to normal damage.`,
        when: [COMBAT_PHASE],
      },
    ],
  },
  'Whip of Subversion': {
    effects: [
      {
        name: `Whip of Subversion`,
        desc: `You can pick 1 enemy hero within 6" of the bearer. Pick 1 melee weapon that hero is armed with and then pick 1 other enemy unit within 3" of that hero. The other unit suffers a number of mortal wounds equal to the attacks characteristic of the melee weapon selected.`,
        when: [END_OF_COMBAT_PHASE],
      },
    ],
  },
  'Icon of Infinite Excess': {
    effects: [
      {
        name: `Icon of Infinite Excess`,
        desc: `Once per battle the bearer can use this artifact. Until the end of the combat phase, add 1 to the hit rolls for units that were wholly within 12" of the bearer when this effect triggered.`,
        when: [START_OF_COMBAT_PHASE],
      },
    ],
  },
  'Fallacious Gift': {
    effects: [
      {
        name: `Fallacious Gift`,
        desc: `Pick one enemy hero and select one of their weapons to trigger at the end of each battle round.`,
        when: [END_OF_SETUP],
      },
      {
        name: `Fallacious Gift`,
        desc: `If the chosen hero attacked with the selected weapon that hero suffers 1 mortal wound.`,
        when: [END_OF_ROUND],
      },
    ],
  },
  'The Beguiling Gem': {
    effects: [
      {
        name: `The Beguiling Gem`,
        desc: `Pick 1 enemy hero within 3" of the bearer and roll 3D6. If the roll is greater than that hero's bravery characteristic, subtract 1 from the attacks characteristic of all that hero's melee weapons (to a minimum of 0) until the end of the phase.`,
        when: [START_OF_COMBAT_PHASE],
      },
    ],
  },
  // Pretenders Host - Regalia of the Rightful Heir
  'The Crown of Dark Secrets': {
    effects: [
      {
        name: `The Crown of Dark Secrets`,
        desc: `Pick 1 enemy hero. You can reroll hit rolls for attacks made by the bearer against the target and reroll unbinding attempts for spells cast by the target.`,
        when: [TURN_ONE_START_OF_ROUND],
      },
      {
        name: `The Crown of Dark Secrets`,
        desc: `If active, you can reroll unbinding attempts for spells cast by the target.`,
        when: [HERO_PHASE],
      },
      {
        name: `The Crown of Dark Secrets`,
        desc: `If active, you can reroll hit rolls for attacks made by the bearer against the target.`,
        when: [SHOOTING_PHASE, COMBAT_PHASE],
      },
    ],
  },
  'Pendant of Slaanesh': {
    effects: [
      {
        name: `Pendant of Slaanesh`,
        desc: `You can heal up to D3 wounds allocated to the bearer.`,
        when: [START_OF_HERO_PHASE],
      },
    ],
  },
  Sliverslash: {
    effects: [
      {
        name: `Sliverslash`,
        desc: `Add 1 to the attacks characteristic of selected weapon.`,
        when: [COMBAT_PHASE],
      },
    ],
  },
  'Sceptre of Domination': {
    effects: [
      {
        name: `Sceptre of Domination`,
        desc: `If the bearer is within 12" of any enemy heroes, and your opponent has any command points, roll a D6. On a 4+ you steal 1 command point from your opponent.`,
        when: [START_OF_HERO_PHASE],
      },
    ],
  },
  Breathtaker: {
    effects: [
      {
        name: `Breathtaker`,
        desc: `You can reroll the Locus of Diversion dice against enemy heroes within 6" of the bearer.`,
        when: [END_OF_CHARGE_PHASE],
      },
    ],
  },
  'Mask of Spiteful Beauty': {
    effects: [
      {
        name: `Mask of Spiteful Beauty`,
        desc: `Pick 1 enemy unit within 6" of the bearer. Subtract 2 from that unit's bravery characteristic until your next hero phase.`,
        when: [START_OF_HERO_PHASE],
      },
      {
        name: `Mask of Spiteful Beauty`,
        desc: `Subtract 2 from targeted unit's bravery characteristic until your next hero phase.`,
        when: [BATTLESHOCK_PHASE],
      },
    ],
  },
  // Godseekers Host - Treasures of the Hunt
  'Cameo of the Dark Prince': {
    effects: [
      {
        name: `Cameo of the Dark Prince`,
        desc: `Once per battle can use this artifact. You receive 1 command point.`,
        when: [START_OF_HERO_PHASE],
      },
    ],
  },
  'Girdle of the Realm-race': {
    effects: [
      {
        name: `Girdle of the Realm-racer`,
        desc: `Subtract 1 from the bearer's wounds characteristic. In addition, the bearer can fly.`,
        when: [DURING_GAME],
      },
    ],
  },
  'Threnody Voicebox': {
    effects: [
      {
        name: `Threnody Voicebox`,
        desc: `You can pick 1 enemy hero that is within 3" of the bearer. Subtract 1 from the attacks characteristic of melee weapons used by that hero (to a minimum of 1) until the end of the phase.`,
        when: [START_OF_COMBAT_PHASE],
      },
    ],
  },
  'Lash of Despair': {
    effects: [
      {
        name: `Lash of Despair`,
        desc: `You can roll a D6 for each enemy unit within 6" of the bearer. On a 4+ that unit suffers 1 mortal wound.`,
        when: [START_OF_SHOOTING_PHASE],
      },
    ],
  },
  'Enrapturing Circlet': {
    effects: [
      {
        name: `Enrapturing Circlet`,
        desc: `Enemy units within 3" of the bearer cannot retreat.`,
        when: [MOVEMENT_PHASE],
      },
      {
        name: `Enrapturing Circlet`,
        desc: `Roll a D6 for each enemy unit within 3" of the bearer. On a 2+ that enemy unit suffers 1 mortal wound.`,
        when: [START_OF_HERO_PHASE],
      },
    ],
  },
  'Bindings of Slaanesh': {
    effects: [
      {
        name: `Bindings of Slaanesh`,
        desc: `You can pick 1 enemy hero within 3" of the bearer and roll 2D6. If the roll is greater than the targets move characteristic, subtract 1 from hit rolls for attacks made by the target until the end of the phase.`,
        when: [START_OF_COMBAT_PHASE],
      },
    ],
  },
  // Lurid Haze Flavor
  'Oil of Exultation': {
    effects: [
      {
        name: `Oil of Exultation`,
        desc: `Add 1 to the wounds characteristic of the bearer.`,
        when: [WOUND_ALLOCATION_PHASE],
      },
    ],
  },
  // Faultless Blades Flavor
  'Contemptuous Brand': {
    effects: [
      {
        name: `Contemptuous Brand`,
        desc: `Add 1 to the wound rolls for melee attacks made with this weapon that target a hero.`,
        when: [COMBAT_PHASE],
      },
    ],
  },
  // Scarlet Cavalcade Flavor
  'Helm of the Last Rider': {
    effects: [
      {
        name: `Helm of the Last Rider`,
        desc: `Add 1 to the bravery characteristic of friendly Scarlet Cavalcade Godseekers Host units while they are wholly within 12" of the bearer.`,
        when: [DURING_GAME, BATTLESHOCK_PHASE],
      },
    ],
  },
}

export default tagAs(Artifacts, 'artifact')

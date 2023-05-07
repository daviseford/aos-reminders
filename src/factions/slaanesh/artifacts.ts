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
        desc: `At the start of your hero phase, roll a dice. On a 1, your opponent receives 1 command point. On a 2-5, you receive 1 command point. On a 6, you receive D3 command points.`,
        when: [START_OF_HERO_PHASE],
      },
    ],
  },
  'Rapier of Ecstatic Conquest': {
    effects: [
      {
        name: `Rapier of Ecstatic Conquest`,
        desc: `Pick 1 of the bearer's melee weapons. If the unmodified wound roll for an attack made with that weapon is 6, that attack inflicts 1 mortal wound on the target in addition to any normal damage.`,
        when: [COMBAT_PHASE],
      },
    ],
  },
  'Whip of Subversion': {
    effects: [
      {
        name: `Whip of Subversion`,
        desc: `At the end of the combat phase, you can pick 1 enemy HERO within 6" of the bearer. Pick 1 melee weapon that HERO is armed with, then pick 1 other enemy unit within 3" of that HERO. That unit suffers a number of mortal wounds equal to the unmodified Attacks characteristic of the melee weapon you picked.`,
        when: [END_OF_COMBAT_PHASE],
      },
    ],
  },
  'Icon of Infinite Excess': {
    effects: [
      {
        name: `Icon of Infinite Excess`,
        desc: `Once per battle, at the start of the combat phase, the bearer can use this artefact. If they do so, until the end of that phase, add 1 to hit rolls for attacks made with melee weapons by friendly HEDONITE units while they are wholly within 12" of the bearer.`,
        when: [START_OF_COMBAT_PHASE],
      },
    ],
  },
  'Fallacious Gift': {
    effects: [
      {
        name: `Fallacious Gift`,
        desc: `After set-up is complete, but before the battle begins, pick 1 enemy HERO on the battlefield, then pick one of their weapons. At the end of each battle round in which that HERO has attacked with that weapon, that HERO suffers 1 mortal wound.`,
        when: [END_OF_SETUP],
      },
      {
        name: `Fallacious Gift`,
        desc: `At the end of each battle round in which that HERO has attacked with that weapon, that HERO suffers 1 mortal wound.`,
        when: [END_OF_ROUND],
      },
    ],
  },
  'The Beguiling Gem': {
    effects: [
      {
        name: `The Beguiling Gem`,
        desc: `At the start of the combat phase, pick 1 enemy HERO within 3" of the bearer and roll 3D6. If the roll is greater than that HERO's Bravery characteristic, subtract 1 from the Attacks characteristic of that HERO's melee weapons (to a minimum of 0) until the end of that phase.`,
        when: [START_OF_COMBAT_PHASE],
      },
    ],
  },
  // Pretenders Host - Regalia of the Rightful Heir
  'The Crown of Dark Secrets': {
    effects: [
      {
        name: `The Crown of Dark Secrets`,
        desc: `At the start of the first battle round, pick 1 enemy HERO. You can reroll hit rolls for attacks made by the bearer that target that HERO, and you can reroll unbinding rolls for the bearer for spells cast by that HERO.`,
        when: [TURN_ONE_START_OF_ROUND],
      },
      {
        name: `The Crown of Dark Secrets`,
        desc: `If active, you can reroll unbinding rolls for the bearer for spells cast by that HERO.`,
        when: [HERO_PHASE],
      },
      {
        name: `The Crown of Dark Secrets`,
        desc: `If active, you can reroll hit rolls for attacks made by the bearer that target that HERO.`,
        when: [SHOOTING_PHASE, COMBAT_PHASE],
      },
    ],
  },
  'Pendant of Slaanesh': {
    effects: [
      {
        name: `Pendant of Slaanesh`,
        desc: `At the start of your hero phase, you can heal up to D3 wounds allocated to the bearer.`,
        when: [START_OF_HERO_PHASE],
      },
    ],
  },
  Sliverslash: {
    effects: [
      {
        name: `Sliverslash`,
        desc: `Pick 1 of the bearer's melee weapons. Add 1 to the Attacks characteristic of that weapon.`,
        when: [COMBAT_PHASE],
      },
    ],
  },
  'Sceptre of Domination': {
    effects: [
      {
        name: `Sceptre of Domination`,
        desc: `At the start of the hero phase, if the bearer is within 12" of any enemy HEROES, and your opponent has any command points, roll a dice. On a 4+, your opponent loses 1 command point and you receive 1 command point.`,
        when: [START_OF_HERO_PHASE],
      },
    ],
  },
  Breathtaker: {
    effects: [
      {
        name: `Breathtaker`,
        desc: `You can reroll the dice roll that determines if an enemy HERO within 6" of the bearer is affected by the Locus of Diversion battle trait.`,
        when: [END_OF_CHARGE_PHASE],
      },
    ],
  },
  'Mask of Spiteful Beauty': {
    effects: [
      {
        name: `Mask of Spiteful Beauty`,
        desc: `At the start of your hero phase, pick 1 enemy unit within 6" of the bearer. Subtract 2 from that unit's Bravery characteristic until your next hero phase.`,
        when: [START_OF_HERO_PHASE],
      },
    ],
  },
  // Godseekers Host - Treasures of the Hunt
  'Cameo of the Dark Prince': {
    effects: [
      {
        name: `Cameo of the Dark Prince`,
        desc: `Once per battle, at the start of your hero phase, the bearer can use this artefact. If they do so, you receive 1 command point.`,
        when: [START_OF_HERO_PHASE],
      },
    ],
  },
  'Girdle of the Realm-racer': {
    effects: [
      {
        name: `Girdle of the Realm-racer`,
        desc: `Subtract 1 from the bearer's Wounds characteristic. In addition, the bearer can fly.`,
        when: [DURING_GAME],
      },
    ],
  },
  'Threnody Voicebox': {
    effects: [
      {
        name: `Threnody Voicebox`,
        desc: `At the start of the combat phase, you can pick 1 enemy HERO that is within 3" of the bearer. Subtract 1 from the Attacks characteristic of melee weapons used by that HERO (to a minimum of 1) until the end of that phase.`,
        when: [START_OF_COMBAT_PHASE],
      },
    ],
  },
  'Lash of Despair': {
    effects: [
      {
        name: `Lash of Despair`,
        desc: `At the start of your shooting phase, you can roll a dice for each enemy unit within 6" of the bearer. On a 4+, that unit suffers 1 mortal wound.`,
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
        desc: `At the start of your hero phase, roll a dice for each enemy unit within 3" of the bearer. On a 3+, that unit suffers 1 mortal wound.`,
        when: [START_OF_HERO_PHASE],
      },
    ],
  },
  'Bindings of Slaanesh': {
    effects: [
      {
        name: `Bindings of Slaanesh`,
        desc: `At the start of the combat phase, you can pick 1 enemy HERO within 3" of the bearer and roll 2D6. If the roll is greater than that HERO's Move characteristic, subtract 1 from hit rolls for attacks made by that HERO until the end of that phase.`,
        when: [START_OF_COMBAT_PHASE],
      },
    ],
  },

  'Oil of Exultation': {
    effects: [
      {
        name: `Oil of Exultation`,
        desc: `Add 1 to the Wounds characteristic of the bearer.`,
        when: [WOUND_ALLOCATION_PHASE],
      },
    ],
  },
  'Contemptuous Brand': {
    effects: [
      {
        name: `Contemptuous Brand`,
        desc: `Pick one of the bearer's melee weapons. Add 1 to wound rolls for attacks made with that weapon that target a HERO.`,
        when: [COMBAT_PHASE],
      },
    ],
  },
  'Helm of the Last Rider': {
    effects: [
      {
        name: `Helm of the Last Rider`,
        desc: `Add 1 to the Bravery characteristic of friendly SCARLET CAVALCADE GODSEEKERS HOST units while they are wholly within 12" of the bearer.`,
        when: [DURING_GAME, BATTLESHOCK_PHASE],
      },
    ],
  },
}

export default tagAs(Artifacts, 'artifact')

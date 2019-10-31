import { TArtifacts } from 'types/army'
import {
  COMBAT_PHASE,
  MOVEMENT_PHASE,
  SHOOTING_PHASE,
  DURING_GAME,
  START_OF_HERO_PHASE,
  HERO_PHASE,
  CHARGE_PHASE,
} from 'types/phases'

const Artifacts: TArtifacts = [
  {
    name: `Headmasher`,
    effects: [
      {
        name: `Headmasher`,
        desc: `The bearer's Thundermace has a Damage characteristic of 4 instead of 3.`,
        when: [COMBAT_PHASE],
      },
    ],
  },
  {
    name: `Grawl's Gut-plate`,
    effects: [
      {
        name: `Grawl's Gut-plate`,
        desc: `Add 4" to the bearer's Move characteristic while they are hungry instead of 2".`,
        when: [MOVEMENT_PHASE],
      },
    ],
  },
  {
    name: `Gruesome Trophy Rack`,
    effects: [
      {
        name: `Gruesome Trophy Rack`,
        desc: `Add 1 to hit rolls for attacks made by friendly GUTBUSTERS units wholly within 12" of the bearer that target a MONSTER or HERO.`,
        when: [SHOOTING_PHASE, COMBAT_PHASE],
      },
    ],
  },
  {
    name: `Flask of Stonehorn Blood`,
    effects: [
      {
        name: `Flask of Stonehorn Blood`,
        desc: `Once per battle, at the start of any phase, the bearer can use this artefact. If they do so, until the end of that turn, roll a dice each time you allocate a wound or mortal wound to the bearer. On a 4+, that wound or mortal wound is negated.`,
        when: [DURING_GAME],
      },
    ],
  },
  {
    name: `Sky-Titan Scatter Pistols`,
    effects: [
      {
        name: `Sky-Titan Scatter Pistols`,
        desc: `The bearer's Ogor Pistols have an Attacks characteristic of 6 instead of 2.`,
        when: [],
      },
    ],
  },
  {
    name: `The Fang of Ghur`,
    effects: [
      {
        name: `The Fang of Ghur`,
        desc: `The bearer's Beastskewer Glaive has a Rend characteristic of -3 instead of -l.`,
        when: [COMBAT_PHASE],
      },
    ],
  },
  {
    name: `Dracoline Heart`,
    effects: [
      {
        name: `Dracoline Heart`,
        desc: `Once per battle, at the start of your hero phase, the bearer can use this artefact. If they do so, pick 1 GREAT MAWPOT terrain feature that is part of your army, within 6" of the bearer and empty. Tlat GREAT MAWPOT is now full.`,
        when: [START_OF_HERO_PHASE],
      },
    ],
  },
  {
    name: `Shrunken Priest Head`,
    effects: [
      {
        name: `Shrunken Priest Head`,
        desc: `Roll a dice each time you allocate a wound or mortal wound to the bearer. On a 5+, that wound or mortal wound is negated.`,
        when: [DURING_GAME],
      },
    ],
  },
  {
    name: `Wizardflesh Apron`,
    effects: [
      {
        name: `Wizardflesh Apron`,
        desc: `The bearer can cast 1 additional spell in each of your hero phases.`,
        when: [HERO_PHASE],
      },
    ],
  },
  {
    name: `Bloodrock Talisman`,
    effects: [
      {
        name: `Bloodrock Talisman`,
        desc: `Add 2 to the roll when the bearer attempts to unbind or dispel an endless spell.`,
        when: [HERO_PHASE],
      },
    ],
  },
  {
    name: `Grease-smeared Tusks`,
    effects: [
      {
        name: `Grease-smeared Tusks`,
        desc: `Add 1 to charge rolls for friendly MONSTERS while they are within 9" of the bearer.`,
        when: [CHARGE_PHASE],
      },
    ],
  },
  {
    name: `Rotting Dankhold Spores`,
    effects: [
      {
        name: `Rotting Dankhold Spores`,
        desc: `Once per battle, at the start of your hero phase, the bearer can use this artefact. If they do so, pick 1 enemy unit within 6" of the bearer and roll a number of dice equal to the number of models in that unit. For each 4+, that unit suffers 1 mortal wound.`,
        when: [START_OF_HERO_PHASE],
      },
    ],
  },
  {
    name: ``,
    effects: [
      {
        name: ``,
        desc: ``,
        when: [],
      },
    ],
  },
  {
    name: ``,
    effects: [
      {
        name: ``,
        desc: ``,
        when: [],
      },
    ],
  },
  {
    name: ``,
    effects: [
      {
        name: ``,
        desc: ``,
        when: [],
      },
    ],
  },
  {
    name: ``,
    effects: [
      {
        name: ``,
        desc: ``,
        when: [],
      },
    ],
  },
  {
    name: ``,
    effects: [
      {
        name: ``,
        desc: ``,
        when: [],
      },
    ],
  },
  {
    name: ``,
    effects: [
      {
        name: ``,
        desc: ``,
        when: [],
      },
    ],
  },
  {
    name: ``,
    effects: [
      {
        name: ``,
        desc: ``,
        when: [],
      },
    ],
  },
  {
    name: ``,
    effects: [
      {
        name: ``,
        desc: ``,
        when: [],
      },
    ],
  },
  {
    name: ``,
    effects: [
      {
        name: ``,
        desc: ``,
        when: [],
      },
    ],
  },
  {
    name: ``,
    effects: [
      {
        name: ``,
        desc: ``,
        when: [],
      },
    ],
  },
  {
    name: ``,
    effects: [
      {
        name: ``,
        desc: ``,
        when: [],
      },
    ],
  },
  {
    name: ``,
    effects: [
      {
        name: ``,
        desc: ``,
        when: [],
      },
    ],
  },
  {
    name: ``,
    effects: [
      {
        name: ``,
        desc: ``,
        when: [],
      },
    ],
  },
  {
    name: ``,
    effects: [
      {
        name: ``,
        desc: ``,
        when: [],
      },
    ],
  },
  {
    name: ``,
    effects: [
      {
        name: ``,
        desc: ``,
        when: [],
      },
    ],
  },
]

export default Artifacts

import { TArtifacts } from 'types/army'
import {
  BATTLESHOCK_PHASE,
  COMBAT_PHASE,
  DURING_GAME,
  HERO_PHASE,
  MOVEMENT_PHASE,
  SHOOTING_PHASE,
  START_OF_COMBAT_PHASE,
  START_OF_SHOOTING_PHASE,
} from 'types/phases'

const Artifacts: TArtifacts = [
  {
    name: `Spiteful Prodder`,
    effects: [
      {
        name: `Spiteful Prodder`,
        desc: `At the start of your shooting phase, pick 1 enemy unit within 18" of the bearer and visible to them. Then roll 1 dice for each friendly GROT unit wholly within 12" of the bearer that has at least 5 models. For each 5+ that enemy unit suffers D3 mortal wounds.`,
        when: [START_OF_SHOOTING_PHASE],
      },
    ],
  },
  {
    name: `Backstabber's Blade`,
    effects: [
      {
        name: `Backstabber's Blade`,
        desc: `Pick one of the bearer's melee weapons. If the unmodified hit roll for an attack made with that weapon is 6, the save roll for that attack automatically fails (do not roll the dice).`,
        when: [COMBAT_PHASE],
      },
    ],
  },
  {
    name: `Loonstone Talisman`,
    effects: [
      {
        name: `Loonstone Talisman`,
        desc: `Roll a D6 each time you allocate a mortal wound to the bearer. On a 5+ that mortal wound is negated.`,
        when: [DURING_GAME],
      },
    ],
  },
  {
    name: `The Pipes of Doom`,
    effects: [
      {
        name: `The Pipes of Doom`,
        desc: `Subtract 1 from the Bravery characteristic of enemy units while they are within 12" of the bearer.`,
        when: [BATTLESHOCK_PHASE],
      },
    ],
  },
  {
    name: `The Clammy Cowl`,
    effects: [
      {
        name: `The Clammy Cowl`,
        desc: `Subtract 1 from hit rolls for attacks that target the bearer.`,
        when: [DURING_GAME],
      },
    ],
  },
  {
    name: `Leering Gitshield`,
    effects: [
      {
        name: `Leering Gitshield`,
        desc: `If the unmodified save roll for an attack made with a melee weapon that targets the bearer is 6, the attacking unit suffers 1 mortal wound after all of its attacks have been resolved.`,
        when: [COMBAT_PHASE],
      },
    ],
  },
  {
    name: `Spiteshroom Familiar`,
    effects: [
      {
        name: `Spiteshroom Familiar`,
        desc: `Subtract 1 from hit rolls for attacks made by enemy models while they are within 3" of the bearer.`,
        when: [DURING_GAME],
      },
    ],
  },
  {
    name: `Moonface Mommet`,
    effects: [
      {
        name: `Moonface Mommet`,
        desc: `At the start of the combat phase, pick 1 enemy unit within 12" of the bearer. Subtract 1 from save rolls for attacks that target that unit until the end of the phase.`,
        when: [START_OF_COMBAT_PHASE],
      },
    ],
  },
  {
    name: `Staff of Sneaky Stealin'`,
    effects: [
      {
        name: `Staff of Sneaky Stealin'`,
        desc: `Add 1 to casting and unbinding rolls for the bearer for each enemy WIZARD within 12" of the bearer. In addition, add 1 to casting and unbinding rolls for the bearer for each enemy HERO with an artifact of power within 12" of the bearer.`,
        when: [HERO_PHASE],
      },
    ],
  },
  {
    name: `Totem of the Spider God`,
    effects: [
      {
        name: `Totem of the Spider God`,
        desc: `While a friendly SPIDERFANG unit is wholly within 12" of the bearer, its Spider Venom ability causes mortal wounds on an unmodified hit roll of 5+ instead of 6.`,
        when: [COMBAT_PHASE],
      },
    ],
  },
  {
    name: `Headdress of Many Eyes`,
    effects: [
      {
        name: `Headdress of Many Eyes`,
        desc: `Subtract 1 from hit rolls for attacks that target the bearer.`,
        when: [SHOOTING_PHASE, COMBAT_PHASE],
      },
    ],
  },
  {
    name: `The Black Fang`,
    effects: [
      {
        name: `The Black Fang`,
        desc: `Pick one of the bearer's melee weapons. If the unmodified hit roll for an attack made with that weapon is 6, that attack inflicts D3 mortal wounds on the target and the attack sequence ends (do not make a wound or save roll). If the weapon already inflicts mortal wounds on a roll of 6, add D3 to the number of mortal wounds it inflicts instead.`,
        when: [COMBAT_PHASE],
      },
    ],
  },
  {
    name: `Nibblas 'Itty Ring`,
    effects: [
      {
        name: `Nibblas 'Itty Ring`,
        desc: `Once per battle, at the start of a combat phase, you can pick 1 enemy unit within 3" of the bearer and roll a D6. On a 1 there is no effect. On a 2-5 that enemy unit suffers D3 mortal wounds. On a 6, that enemy unit suffer D6 mortal wounds.`,
        when: [START_OF_COMBAT_PHASE],
      },
    ],
  },
  {
    name: `Earskuttla`,
    effects: [
      {
        name: `Earskuttla`,
        desc: `Once per battle, at the start of a combat phase, you can pick 1 enemy WIZARD within 3", and roll a D6. On a 2+, that enemy WIZARD suffers D3 mortal wounds. In addition, for the rest of the battle, subtract 1 from casting and unbinding rolls for that WIZARD for each mortal wound that was inflicted.`,
        when: [START_OF_COMBAT_PHASE],
      },
    ],
  },
  {
    name: `Web Strung Cloak`,
    effects: [
      {
        name: `Web Strung Cloak`,
        desc: `Enemy units cannot retreat if they are within 3" of the bearer.`,
        when: [MOVEMENT_PHASE],
      },
    ],
  },
  {
    name: `Shiny Wotnot`,
    effects: [
      {
        name: `Shiny Wotnot`,
        desc: `Roll a D6 each time a mortal wound caused by a spell is allocated to this model. On a 6+ the mortal wound is allocated to the caster of the spell instead of the bearer. If the mortal wound was inflicted by an endless spell, on a 6+ that mortal wound is negated, and that endless spell is dispelled (any other mortal wounds it could have inflicted are negated).`,
        when: [HERO_PHASE],
      },
    ],
  },
  {
    name: `Glowy Howzit`,
    effects: [
      {
        name: `Glowy Howzit`,
        desc: `Roll a D6 each time you allocate a wound or mortal wound to the bearer. On a 4+ that wound is negated. On a 1, the bearer eats the Glowy Howzit and it cannot be used again for the rest of the battle.`,
        when: [DURING_GAME],
      },
    ],
  },
  {
    name: `Pet Gribbly`,
    effects: [
      {
        name: `Pet Gribbly`,
        desc: `If an enemy unit attacks the bearer in the combat phase before the bearer has been selected to fight in that combat phase, then the enemy unit suffers D3 mortal wounds after all of its attacks have been resolved.`,
        when: [COMBAT_PHASE],
      },
    ],
  },
]

export default Artifacts

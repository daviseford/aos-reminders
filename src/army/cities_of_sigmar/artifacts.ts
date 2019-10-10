import { TArtifacts } from 'types/army'
import { DURING_GAME, HERO_PHASE, COMBAT_PHASE, SHOOTING_PHASE } from 'types/phases'

const Artifacts: TArtifacts = [
  {
    name: `Armour of Mallus (Hammerhal)`,
    effects: [
      {
        name: `Armour of Mallus`,
        desc: `Add 1 to save rolls for attacks that target the bearer.`,
        when: [DURING_GAME],
      },
    ],
  },
  {
    name: `Saint's Blade (Hammerhal)`,
    effects: [
      {
        name: `Saint's Blade`,
        desc: `Pick 1 melee weapon. Improve the Rend of that weapon by 1. In addition, while the bearer is within 6" of an objective marker, add 1 to the damage inflicted by attacks made with that weapon.`,
        when: [COMBAT_PHASE],
      },
    ],
  },
  {
    name: `The Twinstone (Hammerhal)`,
    effects: [
      {
        name: `Choose aspect`,
        desc: `Pick Aqshy or Ghyran Aspect in each of your hero phases.`,
        when: [HERO_PHASE],
      },
      {
        name: `Aqshy Aspect`,
        desc: `If you choose this aspect, add 1 to hit rolls for attacks made with melee weapons by friendly HAMMERHAL units wholly within 12" of the bearer.`,
        when: [COMBAT_PHASE],
      },
      {
        name: `Ghyran Aspect`,
        desc: `If you choose this aspect, roll 1 dice for each friendly HAMMERHAL unit wholly within 12" of the bearer. On a 4+, you can heal up to D3 wounds allocated to that unit.`,
        when: [HERO_PHASE],
      },
    ],
  },
  {
    name: `Spear of the Hunt (The Living City)`,
    effects: [
      {
        name: `Spear of the Hunt`,
        desc: `Pick 1 of the bearer's melee weapons. Improve the Rend by 1. In addition, the bearer (and mount) fights at the start of the combat phase if they made a charge move in the same turn. The bearer cannot fight again in that combat phase unless an ability or spell allows them to fight more than once.`,
        when: [COMBAT_PHASE],
      },
    ],
  },
  {
    name: `Deepmire Cloak (The Living City)`,
    effects: [
      {
        name: `Deepmire Cloak`,
        desc: `If the bearer has a Wounds characteristic of 6 or less, while they are in cover, they cannot be chosen to be the target of a missile weapon.
        If the bearer has a Wounds characteristic of 7 or more, while they are in cover, subtract 1 from hit rolls for attacks made with missile weapons that target them.`,
        when: [SHOOTING_PHASE],
      },
    ],
  },
  {
    name: `Wardroth Horn (The Living City)`,
    effects: [
      {
        name: `Wardroth Horn`,
        desc: `Once per battle, the bearer can sound the Wardroth Horn. If they do, until the start of your next hero phase, add 1 to the Attacks characteristic of melee weapons used by LIVING CITY SYLVANETH units.`,
        when: [HERO_PHASE],
      },
    ],
  },
]

export default Artifacts

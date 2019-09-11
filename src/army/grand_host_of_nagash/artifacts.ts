import { TArtifacts } from 'types/army'
import { COMBAT_PHASE, HERO_PHASE, SHOOTING_PHASE, START_OF_HERO_PHASE } from 'types/phases'

const Artifacts: TArtifacts = [
  {
    name: `Deathforged Chain`,
    effects: [
      {
        name: `Deathforged Chain`,
        desc: `At the start of your hero phase, the bearer heals 1 wound that has been allocated to it.`,
        when: [START_OF_HERO_PHASE],
      },
    ],
  },
  {
    name: `Balefire Lantern`,
    effects: [
      {
        name: `Balefire Lantern`,
        desc: `Subtract 1 from wound rolls for enemy units within 6" of the bearer. In addition, re-roll successful casting rolls for enemy WIZARDS within 6" of the bearer.`,
        when: [HERO_PHASE, SHOOTING_PHASE, COMBAT_PHASE],
      },
    ],
  },
  {
    name: `Grave-sand Timeglass`,
    effects: [
      {
        name: `Grave-sand Timeglass`,
        desc: `Whilst the bearer is on the battlefield, once per battle, in your hero phase, you can pick an enemy HERO on the battlefield. The enemy hero suffers D3 mortal wounds. At the start of each of your subsequent hero phases, roll a D6. On a 4+ the enemy hero suffers 1 mortal wound.ent hero phases, on a 4+ they suffer a mortal wound.`,
        when: [START_OF_HERO_PHASE],
      },
    ],
  },
  {
    name: `Ossific Diadem`,
    effects: [
      {
        name: `Ossific Diadem`,
        desc: `Roll a D6 each time you allocate a wound or mortal wound to a friendly DEATHRATTLE model within 12" of the bearer. On a 6+ the wound is negated.`,
        when: [COMBAT_PHASE],
      },
    ],
  },
  {
    name: `Amethyst Shard`,
    effects: [
      {
        name: `Amethyst Shard`,
        desc: `Once per battle, in your hero phase, you can declare that the bearer will merge the shard with one of their melee weapons. Pick one of the bearer's melee weapons. Until your next hero phase, add 1 to hit and wound rolls made for that weapon.`,
        when: [HERO_PHASE],
      },
    ],
  },
  {
    name: `Terrorgheist Mantle`,
    effects: [
      {
        name: `Terrorgheist Mantle`,
        desc: `In your shooting phase, you can declare that the bearer will unleash a death shriek. Pick an enemy unit within 10" of the bearer and roll 2 dice. If the total is higher than the enemy unit's Bravery characteristic, it suffers a number of mortal wounds equal to the difference.`,
        when: [SHOOTING_PHASE],
      },
    ],
  },
]

export default Artifacts

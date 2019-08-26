import { TArtifacts } from 'types/army'
import { COMBAT_PHASE, SHOOTING_PHASE, START_OF_COMBAT_PHASE, HERO_PHASE, DURING_GAME } from 'types/phases'
import { DEATH } from 'meta/alliances'

const Artifacts: TArtifacts = [
  {
    name: `Cursed Book (${DEATH})`,
    effects: [
      {
        name: `Cursed Book (${DEATH})`,
        desc: `You and your opponent must subtract 1 from hit rolls made for units within 3" of the bearer, unless the unit has the DEATH keyword.`,
        when: [SHOOTING_PHASE, COMBAT_PHASE],
      },
    ],
  },
  {
    name: `Cloak of Mists and Shadows (${DEATH})`,
    effects: [
      {
        name: `Cloak of Mists and Shadows (${DEATH})`,
        desc: `At the start of any combat phase, the bearer can use this cloak. If it does so, remove the bearer from the battlefield, and then set it up anywhere on the battlefield within 12" of its original location and more than 3" from any enemy models. If this is impossible, this model remains in its current location.`,
        when: [START_OF_COMBAT_PHASE],
      },
    ],
  },
  {
    name: `Blade of Dark Summons (${DEATH})`,
    effects: [
      {
        name: `Blade of Dark Summons (${DEATH})`,
        desc: `Once per battle, in your hero phase, you can set up a SUMMONABLE DEATH unit wholly within 12" of the bearer and more than 3" from any enemy models, and add it to your army. The models in the unit must have a combined Wounds characteristic of no more than a 2D6 roll.`,
        when: [HERO_PHASE],
      },
    ],
  },
  {
    name: `Black Amulet (${DEATH})`,
    effects: [
      {
        name: `Black Amulet (${DEATH})`,
        desc: `Once per battle, in your hero phase, the bearer can use this amulet. If it does so, pick an enemy unit within 12" of the bearer. Inflict a number of mortal wounds equal to the number of the current battle round on the unit you picked.`,
        when: [HERO_PHASE],
      },
    ],
  },
  {
    name: `Tomb Blade (${DEATH})`,
    effects: [
      {
        name: `Tomb Blade (${DEATH})`,
        desc: `Pick one of the bearer's melee weapons. For each wound roll of 6+ you make for this weapon, you can heal 1 wound that has been allocated to a friendly DEATH model within 6" of the bearer.`,
        when: [COMBAT_PHASE],
      },
    ],
  },
  {
    name: `Ring of Immortality (${DEATH})`,
    effects: [
      {
        name: `Ring of Immortality (${DEATH})`,
        desc: `The first time the bearer is slain, before removing them from the battlefield, roll a D6. On a 3+ the bearer is not slain and D3 wounds allocated to them are healed (any excess damage is negated). Then, remove the bearer from the battlefield and set them up again within 18" of their original location and more than 3" from any enemy models.`,
        when: [DURING_GAME],
      },
    ],
  },
]

export default Artifacts

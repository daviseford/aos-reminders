import { TArtifacts } from 'types/army'
import {
  CHARGE_PHASE,
  END_OF_COMBAT_PHASE,
  DURING_GAME,
  HERO_PHASE,
  SHOOTING_PHASE,
  START_OF_COMBAT_PHASE,
} from 'types/phases'

const Artifacts: TArtifacts = [
  {
    name: `The Stalking Blade`,
    effects: [
      {
        name: `The Stalking Blade`,
        desc: `Pick one of the bearer's melee weapons. Keep a tally of the number of wounds allocated as a result of attacks made with that weapon. As soon as the total reaches 6 or more, the bearer heals D3 wounds that have been allocated to them, and you can add 1 to the Damage characteristic of that weapon for the rest of the battle.`,
        when: [DURING_GAME],
      },
    ],
  },
  {
    name: `The Scabbing Plate`,
    effects: [
      {
        name: `The Scabbing Plate`,
        desc: `At the end of any combat phase in which the bearer caused any wounds to be allocated to any enemy models, you can heal 1 wound that has been allocated to the bearer.`,
        when: [END_OF_COMBAT_PHASE],
      },
    ],
  },
  {
    name: `Crimson Wing`,
    effects: [
      {
        name: `Crimson Wing`,
        desc: `In your shooting phase, you can pick an enemy unit within 30" of the bearer and roll a D6. On a roll of 3+ that unit suffers 1 mortal wound.`,
        when: [SHOOTING_PHASE],
      },
    ],
  },
  {
    name: `Sigil of the Sanguine Throne`,
    effects: [
      {
        name: `Sigil of the Sanguine Throne`,
        desc: `Once per charge phase, you can re-roll a failed charge roll made for a friendly VAMPIRE unit within 12" of the bearer.`,
        when: [CHARGE_PHASE],
      },
    ],
  },
  {
    name: `The Saccharine Goblet`,
    effects: [
      {
        name: `The Saccharine Goblet`,
        desc: `At start of the combat phase, you can declare that the bearer will drink from the Saccharine Goblet. If you do so, you can add 1 to hit and wound rolls for the bearer until the end of the phase. However, if no wounds are allocated as a result of these attacks, then the bearer suffers D3 mortal wounds.`,
        when: [START_OF_COMBAT_PHASE],
      },
    ],
  },
  {
    name: `Ruby Vial`,
    effects: [
      {
        name: `Ruby Vial`,
        desc: `Once per battle, in your hero phase, you can declare that the bearer will open the Ruby Vial. If you do so, then until your next hero phase, subtract 1 from the Bravery characteristic of enemy units and subtract 1 from the result of any charge rolls made for them.`,
        when: [HERO_PHASE],
      },
    ],
  },
]

export default Artifacts

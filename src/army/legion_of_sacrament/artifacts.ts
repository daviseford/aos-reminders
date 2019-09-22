import { TArtifacts } from 'types/army'
import { COMBAT_PHASE, DURING_TURN, HERO_PHASE, SHOOTING_PHASE } from 'types/phases'

const Artifacts: TArtifacts = [
  {
    name: `Spirit Cage`,
    effects: [
      {
        name: `Spirit Cage`,
        desc: `Whenever an enemy HERO is slain within 6" of the bearer, add 1 to wound rolls for friendly DEATH units within 12" of the bearer until the end of the turn.`,
        when: [DURING_TURN],
      },
    ],
  },
  {
    name: `Shroud of Darkness`,
    effects: [
      {
        name: `Shroud of Darkness`,
        desc: `Subtract 1 from the hit rolls of attacks that target the bearer in the shooting phase if the attacking unit is within 8" of the bearer. Subtract 2 from the hit rolls of attacks that target the bearer in the shooting phase if the attacking unit is more than 8" away from the bearer.`,
        when: [SHOOTING_PHASE],
      },
    ],
  },
  {
    name: `Asylumaticae`,
    effects: [
      {
        name: `Asylumaticae`,
        desc: `Once per battle, in your hero phase, you can declare that the bearer will open the Asylumaticae. If you do so, roll a D6. On a 1 the bearer suffers a mortal wound. On a 2+ each enemy unit within 12" of the bearer suffers 1 mortal wound.`,
        when: [HERO_PHASE],
      },
    ],
  },
  {
    name: `Wristbands of Black Gold`,
    effects: [
      {
        name: `Wristbands of Black Gold`,
        desc: `Roll a D6 each time you allocate a wound or mortal wound to the bearer in the shooting phase. On a 4+ the wound is negated.`,
        when: [COMBAT_PHASE],
      },
    ],
  },
  {
    name: `Azyrbane Standard`,
    effects: [
      {
        name: `Azyrbane Standard`,
        desc: `Subtract 1 from wound rolls for enemy units within 6" of the bearer. In addition, re-roll successful casting rolls for ORDER WIZARDS within 6" of the bearer.`,
        when: [HERO_PHASE, SHOOTING_PHASE, COMBAT_PHASE],
      },
    ],
  },
  {
    name: `Black Gem`,
    effects: [
      {
        name: `Black Gem`,
        desc: `Once per battle, in your hero phase, you can declare that the bearer will shatter the Black Gem. Pick a point on the battlefield within 8" of the bearer. Roll a D6 for each unit within 3" of this point. On a 6+, one model from that unit is slain. If the unit has any models with wounds allocated to it, then that model must be the model that is slain.`,
        when: [HERO_PHASE],
      },
    ],
  },
]

export default Artifacts

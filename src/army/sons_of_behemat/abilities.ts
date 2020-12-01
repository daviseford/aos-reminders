// General Allegiance Abilities (always active regardless of army composition)
import { TEffects } from 'types/data'
import { DURING_GAME, SHOOTING_PHASE } from 'types/phases'

const Abilities: TEffects[] = [
  {
    name: `Mightier Makes Rightier`,
    desc: `When determining control of an objective, each friendly MANCRUSHER GARGANT model counts as 10 models instead of I, and each friendly MEGA-GARGANT counts as 20 models instead of 1.`,
    when: [DURING_GAME],
  },
  {
    name: `Chuck Rocks`,
    desc: `In your shooting phase, you can pick 1 friendly MANCRUSHER GARGANT unit wholly within 18" of your general. Each model in that unit can make a shooting attack with the Chuck Rocks missile weapon.`,
    when: [SHOOTING_PHASE],
  },
]

export default Abilities

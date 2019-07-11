import {
  START_OF_HERO_PHASE,
  DURING_GAME,
  HERO_PHASE,
  BATTLESHOCK_PHASE,
  CHARGE_PHASE,
  COMBAT_PHASE,
  DURING_SETUP,
  START_OF_MOVEMENT_PHASE,
  END_OF_MOVEMENT_PHASE,
} from 'types/phases'
import { IEffects } from 'types/data'

// General Allegiance Abilities (always active regardless of army composition)
const Abilities: IEffects[] = [
  {
    name: `Deathless Minions`,
    desc: `Roll a dice each time you allocate a wound or mortal wound to a friendly DEATH unit within 6" of your general or a friendly DEATH HERO. On a 6+, that wound or mortal wound is negated.`,
    when: [DURING_GAME],
  },
  {
    name: `The Unquiet Dead`,
    desc: `After territories are determined, but before deployment, you may set up up to four gravesites. Two in your territory, two anywhere. When deploying a unit you may say it is set up In The Grave instead. You can do this as many times as you wish. At the end of any movement phase a DEATH HERO within 9" of a gravesite can set up a unit from In The Grave. Set it up wholly within 9" of the gravesite, more than 9" from enemy models.`,
    when: [DURING_SETUP, END_OF_MOVEMENT_PHASE],
  },
  {
    name: `Invigorating Aura`,
    desc: `Gravesites have the following ability. Pick a friendly SUMMONABLE unit within 9" of this gravesite. Heal d3 wounds to it, or if no wounds are allocated you can return a number of models with a combined wounds characteristic of d3 or less.`,
    when: [START_OF_HERO_PHASE],
  },
  {
    name: `Chosen Guardians (Grand Host of Nagash)`,
    desc: `Add 1 attack to all melee weapons used by GRAND HOST OF NAGASH MORGHAST units`,
    when: [DURING_GAME],
  },
  {
    name: `Legions Innumerable (Grand Host of Nagash)`,
    desc: `Roll a dice for each friendly GRAND HOST OF NAGASH SUMMONABLE unit, on a 5+ heal d3 wounds. If no wounds are allocated, return a number of models with a combined wounds characteristic of d3 or less.`,
    when: [HERO_PHASE],
  },
  {
    name: `Endless Legions`,
    desc: `Pick a gravesite within 9" of your general. You may return a destroyed friendly SUMMONABLE unit to the battlefield within 9" of the gravesite and more than 9" from enemy models.`,
    when: [END_OF_MOVEMENT_PHASE],
    command: true,
  },
  {
    name: `Endless Legions`,
    desc: `Pick a gravesite within 9" of your general. You may return a destroyed friendly SUMMONABLE unit to the battlefield within 9" of the gravesite and more than 9" from enemy models.`,
    when: [END_OF_MOVEMENT_PHASE],
  },
  {
    name: `Magic (Grand Host of Nagash)`,
    desc: `All WIZARDS in a GRAND HOST OF NAGASH army know an additional spell from the Lores of the Dead. Nagash knows an additional three`,
    when: [DURING_GAME],
  },
  {
    name: `Magic (Legion of Sacrament, Blood or Night)`,
    desc: `All WIZARDS know an additional spell from the Lores of the Dead.`,
    when: [DURING_GAME],
  },
  {
    name: ``,
    desc: ``,
    when: [],
  },
]

export default Abilities

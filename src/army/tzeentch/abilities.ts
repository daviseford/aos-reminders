import { HERO_PHASE, END_OF_SETUP, DURING_GAME } from 'types/phases'
import { IEffects } from 'types/data'

// General Allegiance Abilities (always active regardless of army composition)
const Abilities: IEffects[] = [
  {
    name: `Masters of Destiny`,
    desc: `After set-up, but before rolling to see which player takes the first turn in the first battle round, roll 9 dice and keep them to one side; this is your pool of Destiny Dice. Though it is possible for some or even all of these dice to be replenished during the course of the battle, the number of dice in your pool of Destiny Dice can never exceed 9.`,
    when: [END_OF_SETUP],
  },
  {
    name: `Masters of Destiny`,
    desc: `Before rolling any dice for a TZEENTCH unit, you can use one or more of the remaining Destiny Dice from your pool in their stead; the result of the roll you would have made is automatically substituted with the result shown on the Destiny Dice you have chosen to use.`,
    when: [DURING_GAME],
  },
  {
    name: ``,
    desc: ``,
    when: [HERO_PHASE],
  },
]

export default Abilities

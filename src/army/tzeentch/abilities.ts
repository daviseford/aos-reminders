import { END_OF_SETUP, DURING_GAME, HERO_PHASE, END_OF_MOVEMENT_PHASE } from 'types/phases'
import { TAbilities } from 'types/army'

// General Allegiance Abilities (always active regardless of army composition)
const Abilities: TAbilities = [
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
    name: `Summon Daemons of Tzeentch`,
    desc: `You can summon units of Tzeentch Daemons to the battlefield by expending Fate Points. You receive 1 Fate Point each time a casting roll is successful, and the spell is not unbound. Note that you receive Fate Points whenever a spell is cast, be it by friend or foe - Tzeentch cares not from whence the magic flows!`,
    when: [HERO_PHASE],
  },
  {
    name: `Summon Daemons of Tzeentch`,
    desc: `If you have 10 or more Fate Points at the end of your movement phase, you can summon one or more units from the summoning list onto the battlefield, and add them to your army. Each unit you summon costs a number of Fate Points, as shown on the list, and you can only summon a unit if you have enough Fate Points to pay its cost.

    Summoned units must be set up wholly within 12" of a friendly Tzeentch Hero and more than 9" from any enemy units. Subtract the cost of the summoned unit from the number of Fate Points you have immediately after the summoned unit has been set up.`,
    when: [END_OF_MOVEMENT_PHASE],
  },
]

export default Abilities

import {
  COMBAT_PHASE,
  END_OF_MOVEMENT_PHASE,
  END_OF_SETUP,
  DURING_GAME,
  HERO_PHASE,
  START_OF_HERO_PHASE,
  CHARGE_PHASE,
} from 'types/phases'
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
    desc: `Before rolling any dice for a TZEENTCH unit, you can use one or more of the remaining Destiny Dice from your pool in their stead; the result of the roll you would have made is automatically substituted with the result shown on the Destiny Dice you have chosen to use. 
    
    Each Destiny Dice spent only allows you to replace a single dice roll. If you want to replace a 2D6 roll (such as a casting roll or charge roll), you must spend 2 Destiny Dice. In addition, any rolls that have been replaced (with the exception of save rolls and battleshock tests) count as unmodified rolls and cannot be re-rolled or modified further.

    If you spend a Destiny Dice to replace a save roll, the result of that Destiny Dice is modified by the Rend characteristic of the attack as normal.
    
    If you spend a Destiny Dice to replace a battleshock test, the result of that Destiny Dice is modified by the number of models slain from that unit as normal.`,
    when: [DURING_GAME],
  },
  {
    name: `Summon Daemons of Tzeentch`,
    desc: `You can summon units of Tzeentch Daemons to the battlefield by expending Fate Points. You receive 1 Fate Point each time a casting roll is successful, and the spell is not unbound. Note that you receive Fate Points whenever a spell is cast, be it by friend or foe - Tzeentch cares not from whence the magic flows!`,
    when: [HERO_PHASE],
  },
  {
    name: `Summon Daemons of Tzeentch`,
    desc: `If you have 10 or more Fate Points at the end of your movement phase, you can summon one unit from the summoning list onto the battlefield, and add them to your army. Each unit you summon costs a number of Fate Points, as shown on the list, and you can only summon a unit if you have enough Fate Points to pay its cost.

    Summoned units must be set up wholly within 12" of a friendly Tzeentch Hero and more than 9" from any enemy units. Subtract the cost of the summoned unit from the number of Fate Points you have immediately after the summoned unit has been set up.`,
    when: [END_OF_MOVEMENT_PHASE],
  },
  {
    name: `Locus of Change`,
    desc: `SUbtract 1 from hit rolls for attacks made with melee weapons that target friendly Tzeentch Daemon units that are wholly within 12" of a friendly Tzeentch Daemon Hero.`,
    when: [COMBAT_PHASE],
  },
  {
    name: `Agendas of Anarchy`,
    desc: `At the start of your hero phase, you can say that your army intends to complete one of the following agendas before the start of your next hero phase. You must tell your opponent which agenda you intend to complete, and you cannot complete the same agenda more than once per battle.

    If a friendly Tzeentch unit completes one of the following agendas during a battle, that unit gains that agenda's ability for the rest of the game.

    Friendly Tzeentch units that complete more than 1 agenda must choose which ability they wish to keep; any other ability gained are lost.`,
    when: [START_OF_HERO_PHASE],
  },
  {
    name: `Agenda: Mass Conjuration`,
    desc: `Pick 1 friendly Tzeentch Wizard. If that Wizard successfully casts 2 spells and/or endless spells in that hero phase with an unmodified casting roll of 9+ and neither spell or endless spell is unbound, this agenda is completed.`,
    when: [START_OF_HERO_PHASE],
  },
  {
    name: `Ability: Mass Conjuration`,
    desc: `Add 1 to casting rolls for the Tzeentch Wizard that completed this agenda.`,
    when: [HERO_PHASE],
  },
  {
    name: `Agenda: Ninefold Dismantlement`,
    desc: `Pick 1 enemy unit on the battlefield that has 9 or more models. If that unit is destroyed before the end of that turn, this agenda is completed.`,
    when: [START_OF_HERO_PHASE],
  },
  {
    name: `Ability: Ninefold Dismantlement`,
    desc: `Add 1 to hit rolls for attacks made with melee weapons by the friendly Tzeentch unit that destroyed that unit to complete this agenda.`,
    when: [COMBAT_PHASE],
  },
  {
    name: `Agenda: Overthrow Leaders`,
    desc: `Pick 1 enemy Hero or Monster on the battlefield with a wounds characteristic of 9 or more. If that Hero or Monster is slain before the end of that turn, this agenda is completed.`,
    when: [START_OF_HERO_PHASE],
  },
  {
    name: `Ability: Overthrow Leaders`,
    desc: `Add 1 to save rolls for attacks that target the friendly Tzeentch unit that destroyed that Hero or Monster to complete this agenda.`,
    when: [COMBAT_PHASE],
  },
  {
    name: `Agenda: Reckless Abandon`,
    desc: `At the start of your charge phase, pick 1 friendly Tzeentch unit that is 9" or more from any enemy untis. If that unit ends a charge move in that charge phase within 1/2" of an enemy model, this agenda is completed.`,
    when: [START_OF_HERO_PHASE, CHARGE_PHASE],
  },
  {
    name: `Ability: Reckless Abandon`,
    desc: `Add 1 to the Attacks characteristic of melee weapons used by the Tzeentch unit that completed this agenda if that unit made a charge move in the same turn.`,
    when: [COMBAT_PHASE],
  },
  {
    name: `Agenda: Tides of Anarcy`,
    desc: `If a friendly Tzeentch unit that has 9 or more models gains control of an objective that was controlled by your opponent at the start of your hero phase, this agenda is completed.`,
    when: [START_OF_HERO_PHASE],
  },
  {
    name: `Ability: Tides of Anarchy`,
    desc: `Each Tzeentch model in the unit that completed this agenda counts as 2 models instead of 1 when determining control of that objective.`,
    when: [DURING_GAME],
  },
]

export default Abilities

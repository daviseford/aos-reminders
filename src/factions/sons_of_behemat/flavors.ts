import { TItemDescriptions } from 'factions/factionTypes'
import {
  COMBAT_PHASE,
  DURING_GAME,
  SHOOTING_PHASE,
  START_OF_COMBAT_PHASE,
  START_OF_SETUP,
  START_OF_SHOOTING_PHASE,
} from 'types/phases'

const Flavors = {
  'Taker Tribe': {
    effects: [
      {
        name: `Get Rid Of 'Em!`,
        desc: `For the purposes of contesting objectives, each friendly MANCRUSHER GARGANT model counts as 15 models instead of 10. In addition, add 5 to the Mightier Makes Rightier value for friendly KRAKEN-EATERS that are contesting an objective.`,
        when: [DURING_GAME],
      },
      {
        name: `I Want That For Me Collection`,
        desc: `You can use this command ability at the start of the combat phase. The command can only be issued by your general, and the unit that receives the command must be a friendly Mancrusher Gargant unit. Until the end of that phase, add 1 to the Damage characteristic of attacks made with melee weapons that target an enemy unit that bears an artefact of power or is Unique.`,
        when: [START_OF_COMBAT_PHASE],
      },
    ],
  },
  'Stomper Tribe': {
    effects: [
      {
        name: `Getting Stuck In`,
        desc: `Add 1 to the damage inflicted by each successful attack made by a friendly Mancrusher Gargant unit if it targets an enemy unit that has 10-19 models. Add 2 to the damage inflicted by each successful attack made by a friendly Mancrusher Gargant unit if it targets an enemy unit that has 20 or more models.`,
        when: [COMBAT_PHASE],
      },
      {
        name: `Big Shouts`,
        desc: `After your general issues a command to a friendly Mancrusher Gargant unit, until the end of the phase, they can issue the same command to any other friendly Mancrusher Gargant units without any further command points being spent.`,
        when: [COMBAT_PHASE],
      },
      {
        name: `Grab Those Rocks and Chuck 'Em at Somethin'! (Stomper Tribe)`,
        desc: `You can use this command ability at the start of your shooting phase. The unit that receives the command must be a friendly Mancrusher Gargant unit. Until the end of that phase, add 1 to the Attacks characteristic of that unit's Throwin' Rocks.`,
        when: [START_OF_SHOOTING_PHASE],
      },
    ],
  },
  'Smasher Tribe': {
    effects: [
      {
        name: `Bone-crunching Strikes`,
        desc: `When a friendly Mancrusher Gargant unit fights, if it is within 3" of an enemy Monster, you can say that it will unleash a bone-crunching strike. If you do so, until the end of the phase, the Attacks characteristic of that unit's Massive Club is 1 and cannot be modified, the Damage characteristic is 4d6, and all attacks made with its Massive Club must target an enemy Monster.`,
        when: [COMBAT_PHASE],
      },
      {
        name: `Don't Let a Few Cuts Stop Yer!`,
        desc: `You can use this command ability at the start of the combat phase. The command can only be issued by your general, and the unit that receives the command must be a friendly Mancrusher Gargant unit. Until the end of that phase, use the top row on that unit's damage table, regardless of how many wounds it has suffered. In addition, until the end of that phase, each time a model in that unit is slain, if that unit has not yet fought in that phase, that model can fight before it is removed from play.`,
        when: [COMBAT_PHASE],
      },
    ],
  },
  'Breaker Tribe': {
    effects: [
      {
        name: `Breaking Down The Houses`,
        desc: `Add 1 to the damage inflicted by each successful attack made by a friendly MANCRUSHER GARGANT unit that targets an enemy unit that is part of a garrison or is wholly on a terrain feature.`,
        when: [COMBAT_PHASE],
      },
      {
        name: `Fierce Loathings`,
        desc: `When you pick a Breaker Tribe army, you can pick 1 of the fierce loathings below and record it on your army roster. The rule for that fierce loathing applies to friendly Gatebreaker and Mancrusher Gargant Units.`,
        when: [START_OF_SETUP],
      },
      {
        name: `Fierce Loathings - Bossyboots and Clever Clogs`,
        desc: `Add 1 to hit rolls for attacks made by this unit that target an enemy Hero or Wizard.`,
        when: [START_OF_SETUP, SHOOTING_PHASE, COMBAT_PHASE],
      },
      {
        name: `Fierce Loathings - Idiots with Flags`,
        desc: `Add 1 to hit rolls for attacks made by this unit that target an enemy Totem or unit with any command models.`,
        when: [START_OF_SETUP, SHOOTING_PHASE, COMBAT_PHASE],
      },
      {
        name: `Fierce Loathings - Wannabes`,
        desc: `Add 1 to hit rolls for attacks made by this unit that target an enemy War Machine or Monster.`,
        when: [START_OF_SETUP, SHOOTING_PHASE, COMBAT_PHASE],
      },
      {
        name: `Ramming Speed`,
        desc: `You can use this command ability at the start of your charge phase. The command can only be issued by your general, and the unit that receives the command must be a friendly Mancrusher Gargant unit. Until the end of that phase, you can attempt a charge with the uni that received the command if it is within 18" of an enemy unit instead of 12". In addition, roll 3d6 instead of 2d6 when making a charge roll for that unit until the end of that phase.`,
        when: [START_OF_SETUP],
      },
    ],
  },
} satisfies TItemDescriptions

export default Flavors

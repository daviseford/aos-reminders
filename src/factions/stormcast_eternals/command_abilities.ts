import { tagAs } from 'factions/metatagger'
import {
  HERO_PHASE,
  START_OF_COMBAT_PHASE,
  START_OF_MOVEMENT_PHASE,
  WOUND_ALLOCATION_PHASE,
} from 'types/phases'

const CommandAbilities = {
  // Holy Commands
  'Call for Aid': {
    effects: [
      {
        name: `Call for Aid`,
        desc: `You can use this command ability once per battle when a friendly REDEEMER unit with 5 or fewer models is destroyed. If you do so, pick 1 STORMCAST ETERNALS HERO on the battlefield. A new replacement unit identical to the unit that was destroyed is added to your army. Set up that unit wholly within 12" of that STORMCAST ETERNALS HERO and more than 9" from all enemy units.`,
        when: [WOUND_ALLOCATION_PHASE],
      },
    ],
  },
  'Steadfast March': {
    effects: [
      {
        name: `Steadfast March`,
        desc: `You can use this command ability once per battle at the start of your movement phase. The command can only be issued by a friendly KNIGHT to a unit wholly within 12" of them or by a friendly LORD or DRACONITH to a unit wholly within 18" of them. The unit that receives the command must be a friendly STORMCAST ETERNALS unit. Until your next hero phase, that unit can run and still charge later in the turn.`,
        when: [START_OF_MOVEMENT_PHASE],
      },
    ],
  },
  'Thunderbolt Volley': {
    effects: [
      {
        name: `Thunderbolt Volley`,
        desc: `You can use this command ability once per battle in your hero phase. The command can only be issued by a friendly KNIGHT to a unit wholly within 12" of them or by a friendly LORD or DRACONITH to a unit wholly within 18" of them. The unit that receives the command must be a friendly JUSTICAR or ANGELOS unit. That unit can shoot in that phase.`,
        when: [HERO_PHASE],
      },
    ],
  },
  'Unleash Thy Hatred': {
    effects: [
      {
        name: `Unleash Thy Hatred`,
        desc: `You can use this command ability once per battle at the start of the combat phase. The command can only be issued by a friendly KNIGHT to a unit wholly within 12" of them or by a friendly LORD or DRACONITH to a unit wholly within 18" of them. The unit that receives the command must be a friendly PALADIN unit. Add 1 to the Attacks characteristic of that unit's melee weapons until the end of that phase.`,
        when: [START_OF_COMBAT_PHASE],
      },
    ],
  },
  'Final Thunderstrike': {
    effects: [
      {
        name: `Final Thunderstrike`,
        desc: `You can use this command ability once per battle at the start of the combat phase. The command can only be issued by a friendly KNIGHT to a unit wholly within 12" of them or by a friendly LORD or DRACONITH to a unit wholly within 18" of them. Ihe unit that receives the command must be a friendly STORMCAST ETERNALS unit. Until the end of that phase, add 1 to rolls for the Blaze of Glory battle trait (pg 106) when a model in that unit is slain.`,
        when: [START_OF_COMBAT_PHASE],
      },
    ],
  },
}

export default tagAs(CommandAbilities, 'command_ability')

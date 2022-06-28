import meta_rule_sources from 'meta/rule_sources'
import { TEntry } from 'types/data'
import {
  COMBAT_PHASE,
  DURING_GAME,
  END_OF_CHARGE_PHASE,
  END_OF_ROUND,
  HERO_PHASE,
  START_OF_COMBAT_PHASE,
  START_OF_ROUND,
  TURN_THREE_START_OF_ROUND,
} from 'types/phases'
import { GALLET, GHUR } from 'types/realmscapes'

// Realmscapes and their various effects/spells etc.
const Realmscapes: TEntry[] = [
  {
    name: GHUR,
    effects: [
      {
        name: `Predators and Prey`,
        desc: `Once per battle round, you score 1 additional victory point if any enemy MONSTERS were slain in that battle round.`,
        when: [END_OF_ROUND],
        rule_sources: [meta_rule_sources.GHB_2021],
      },
      {
        name: `Seismic Shift`,
        desc: `At the start of the third battle round, after the players roll off to determine who has the first turn, the player taking the second turn in that battle round can pick 1 objective marker on the battlefield and remove it from play.`,
        when: [TURN_THREE_START_OF_ROUND],
        rule_sources: [meta_rule_sources.GHB_2021],
      },
      {
        name: `Feral Roar`,
        desc: `You can use this command ability at the start of the combat phase. The unit that receives that command must be a MONSTER. Until the end of that phase, when you look up a value on that unit's damage table, it is treated as if it has suffered 0 wounds.`,
        when: [START_OF_COMBAT_PHASE],
        rule_sources: [meta_rule_sources.GHB_2021],
        command_ability: true,
      },
      {
        name: `Metamorphosis`,
        desc: `Casting value of 5 and range of 12". Pick 1 friendly HERO that is not a MONSTER and that is within range and visible to the caster. That HERO gains the MONSTER keyword until your next hero phase.`,
        when: [HERO_PHASE],
        rule_sources: [meta_rule_sources.GHB_2021],
        spell: true,
      },
    ],
  },

  {
    name: GALLET,
    effects: [
      {
        name: `Masters of the Splintered Land`,
        desc: `Friendly Battleline units that have a Wounds characteristic of 4 or less and do not have mounts gain the GALLETIAN VETERANS keyword.`,
        when: [DURING_GAME],
        rule_sources: [meta_rule_sources.GHB_2022],
      },
      {
        name: `Proving Grounds`,
        desc: `At the start of each battle round, after the players have determined who will take the first turn, the player who will take the second turn can pick 1 objective on the battlefield to be the proving ground until the end of that battle round. The same objective cannot be picked as the proving ground more than once per battle, and only 1 objective can be marked as the proving ground at any one time. Only models in units with the GALLETIAN VETERANS keyword can contest an objective marked as the proving ground.`,
        when: [START_OF_ROUND],
        rule_sources: [meta_rule_sources.GHB_2022],
      },
      {
        name: `The Bonds of Battle`,
        desc: `When a model in a GALLETIAN VETERANS unit makes an attack with a melee weapon, you can target an enemy unit within 1/2" of another model from that GALLETIAN VETERANS unit instead of using the weapon's Range characteristic for that attack. If you do so, the attacking model must be within 1/2" of another model from its own unit that is within 1/2" of the target.`,
        when: [COMBAT_PHASE],
        rule_sources: [meta_rule_sources.GHB_2022],
      },
      {
        name: `Gaze of Ghur`,
        desc: `Casting value of 7 and a range of 12". Pick 1 enemy unit within range and visible to the caster. When determining the number of models in that enemy unit that are contesting an objective, your opponent must halve that number, rounding down. All WIZARDS know the Gaze of Ghur in addition to any others that they know.`,
        when: [HERO_PHASE],
        rule_sources: [meta_rule_sources.GHB_2022],
        spell: true,
      },
      {
        name: `Overwhelming Assault`,
        desc: `You can use this command ability at the end of your charge phase. The unit that receives the command must be a GALLETIAN VETERANS that has 10 or more models. Pick 1 enemy unit within 1" of that unit that has a Wounds characteristic of 4 or less and roll a dice. If the roll is greater than the number of models in that enemy unit, the strike-last effect applies to that enemy unit in the following combat phase.`,
        when: [END_OF_CHARGE_PHASE],
        rule_sources: [meta_rule_sources.GHB_2022],
        command_ability: true,
      },
    ],
  },
]

export default Realmscapes

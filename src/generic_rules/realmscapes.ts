import meta_rule_sources from 'meta/rule_sources'
import { TEntry } from 'types/data'
import { END_OF_ROUND, HERO_PHASE, START_OF_COMBAT_PHASE, TURN_THREE_START_OF_ROUND } from 'types/phases'
import { GHUR } from 'types/realmscapes'

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
        desc: `Casting value of 5 and a range of 12". Pick 1 friendly HERO that is not a MONSTER and that is within range and visible to the caster. That HERO gains the MONSTER keyword until your next hero phase.`,
        when: [HERO_PHASE],
        rule_sources: [meta_rule_sources.GHB_2021],
        spell: true,
      },
    ],
  },
]

export default Realmscapes

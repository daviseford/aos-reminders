import meta_rule_sources from 'meta/rule_sources'
import { TEffects } from 'types/data'
import { DURING_ROUND, TURN_THREE_START_OF_ROUND } from 'types/phases'
import { GHUR } from 'types/realmscapes'

const RealmscapeFeatures: TEffects[] = [
  {
    name: `Predators and Prey (${GHUR})`,
    desc: `Once per battle round, you score 1 additional victory point if any enemy MONSTERS were slain in that battle round.`,
    when: [DURING_ROUND],
    rule_sources: [meta_rule_sources.GHB_2021],
  },
  {
    name: `Seismic Shift (${GHUR})`,
    desc: `At the start of the third battle round, after the players roll off to determine who has the first turn, the player taking the second turn in that battle round can pick 1 objective marker on the battlefield and remove it from play.`,
    when: [TURN_THREE_START_OF_ROUND],
    rule_sources: [meta_rule_sources.GHB_2021],
  },
]

export default RealmscapeFeatures

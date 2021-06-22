// Realm Spells
import rule_sources from 'meta/rule_sources'
import { TEntry } from 'types/data'
import { HERO_PHASE } from 'types/phases'
import { GHUR } from 'types/realmscapes'

const RealmscapeSpells: TEntry[] = [
  {
    name: `Metamorphosis (${GHUR})`,
    effects: [
      {
        name: `Metamorphosis (${GHUR})`,
        desc: `Casting value of 5 and a range of 12". Pick 1 friendly HERO that is not a MOSNTER and that is within range and visible to the caster. That HERO gains the MONSTER keyword until your next hero phase.`,
        when: [HERO_PHASE],
        rule_sources: [rule_sources.GHB_2021],
      },
    ],
  },
]

export default RealmscapeSpells

import { tagAs } from 'factions/metatagger'
import { COMBAT_PHASE, SAVES_PHASE, START_OF_COMBAT_PHASE, START_OF_GAME, START_OF_HERO_PHASE } from 'types/phases'
import rule_sources from '../rule_sources'

const BonesplitterzBattleTraits = {
  'Battle Tactics': {
    effects: [
      {
        name: `Kill Da Big 'Un!`,
        desc: `You can pick this battle tactic only if the model picked to be your general has the BONESPLITTERZ keyword. Pick 1 enemy MONSTER. You complete this tactic if that MONSTER was slain by attacks made by a friendly BONESPLITTERZ unit during this turn.`,
        when: [START_OF_HERO_PHASE],
      },
    ],
  },
  Warpaint: {
    effects: [
      {
        name: `Warpaint`,
        desc: `Friendly BONESPLITTERZ units have a ward of 6+.`,
        when: [SAVES_PHASE],
      },
    ],
  },
  'Bonesplitterz Waaagh!': {
    effects: [
      {
        name: `Bonesplitterz Waaagh!`,
        desc: `Once per battle, at the start of the combat phase, you can pick 1 friendly BONESPLITTERZ general on the battlefield and say that they are calling a Bonesplitterz Waaagh!. If you do so, until the end of that phase, friendly BONESPLITTERZ units have a ward of 4+ instead of 6+.`,
        when: [START_OF_COMBAT_PHASE],
      },
      {
        name: `Bonesplitterz Waaagh!`,
        desc: `If active, friendly BONESPLITTERZ units have a ward of 4+ instead of 6+.`,
        when: [SAVES_PHASE],
      },
    ],
  },
  'Spirit of Gorkamorka': {
    effects: [
      {
        name: `Spirit of Gorkamorka`,
        desc: `If the unmodified hit roll for an attack made with a melee weapon by a friendly BONESPLITTERZ unit is 6, that attack scores 2 hits on the target instead of 1 (make a wound roll and save roll for each hit).`,
        when: [COMBAT_PHASE],
        rule_sources: [rule_sources.BATTLETOME_ORRUK_WARCLANS, rule_sources.ERRATA_JULY_2022],
      },
    ],
  },
  'Tireless Trackers': {
    effects: [
      {
        name: `Tireless Trackers`,
        desc: `After deployment but before the first battle round begins, half of the BONESPLITTERZ units in your army (rounding up) can move up to 5". If both players can move units before the first battle round begins, they must roll off, and the winner chooses who moves their units first.`,
        when: [START_OF_GAME],
      },
    ],
  },
}

export default tagAs(BonesplitterzBattleTraits, 'battle_trait')

import { tagAs } from 'factions/metatagger'
import { START_OF_HERO_PHASE, TURN_ONE_START_OF_HERO_PHASE, TURN_TWO_START_OF_HERO_PHASE } from 'types/phases'
import meta_rule_sources from 'meta/rule_sources'
import { TParentEffectsObjWithEffects } from 'factions/factionTypes'

const BattleTactics = {
  'Time to Get Stuck In!': {
    effects: [
      {
        name: `Time to Get Stuck In!`,
        desc: `You can pick this battle tactic only in your first or second turn. You complete this tactic if the model picked to be your general and all of the models in your army that are on the battlefield are within 12" of an enemy unit at the end of this turn.`,
        when: [TURN_ONE_START_OF_HERO_PHASE, TURN_TWO_START_OF_HERO_PHASE],
      },
    ],
  },
  'Destroyer of Empires': {
    effects: [
      {
        name: `Destroyer of Empires`,
        desc: `You can pick this battle tactic only if a friendly KRAGNOS is on the battlefield. Pick 1 faction terrain feature on the battlefield that was set up by your opponent and that has not been demolished. You complete this tactic if that faction terrain feature is demolished this turn.`,
        when: [START_OF_HERO_PHASE],
      },
    ],
  },
  'Sneak Up': {
    effects: [
      {
        name: `Sneak Up`,
        desc: `You complete this tactic if, at the end of the turn, every friendly Kruleboyz unit is within 3" of any terrain features and is more than 3" from all enemy units.`,
        when: [START_OF_HERO_PHASE],
        rule_sources: [meta_rule_sources.BATTLESCROLL_ANDTOR_SEPTEMBER_2023],
      },
    ],
  },
  "Dat's Our Turf Now!": {
    effects: [
      {
        name: `Dat's Our Turf Now!`,
        desc: `You complete this tactic if, at the end of the turn, 2 or more friendly Ironjawz units are within 3" of the centre of the battlefield.`,
        when: [START_OF_HERO_PHASE],
        rule_sources: [meta_rule_sources.BATTLESCROLL_ANDTOR_SEPTEMBER_2023],
      },
    ],
  },
} satisfies TParentEffectsObjWithEffects

export default tagAs(BattleTactics, 'battle_tactic')

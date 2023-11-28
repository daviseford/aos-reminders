import { tagAs } from 'factions/metatagger'
import { START_OF_HERO_PHASE } from 'types/phases'
import rule_sources from './rule_sources'

const BattleTactics = {
  'Eat Your Fill': {
    effects: [
      {
        name: `Eat Your Fill`,
        desc: `You complete this tactic at the start of the combat phase if every friendly OGOR unit is eating.`,
        when: [START_OF_HERO_PHASE],
      },
    ],
  },
  'Savour the Taste': {
    effects: [
      {
        name: `Savour the Taste`,
        desc: `You cannot pick this battle tactic in the first battle round. You complete this tactic at the end of your turn if every friendly OGOR unit on the battlefield is hungry.`,
        when: [START_OF_HERO_PHASE],
        rule_sources: [rule_sources.BATTLETOME_OGOR_MAWTRIBES, rule_sources.ERRATA_APRIL_2023],
      },
    ],
  },
  'Avalanche of Flesh': {
    effects: [
      {
        name: `Avalanche of Flesh`,
        desc: `You complete this tactic at the end of the turn if 10+ mortal wounds were caused by the trampling charge battle trait this turn.`,
        when: [START_OF_HERO_PHASE],
      },
    ],
  },
  'Winter Take Thee': {
    effects: [
      {
        name: `Winter Take Thee`,
        desc: `Pick 1 enemy HERO or enemy MONSTER. You complete this tactic if that enemy unit is destroyed by wounds caused by the Grasp of the Everwinter battle trait (pg 64) this turn.`,
        when: [START_OF_HERO_PHASE],
      },
    ],
  },
  'Let them Loose': {
    effects: [
      {
        name: `Let them Loose`,
        desc: `You complete this tactic at the end of your turn if you carried out 4 or more monstrous rampages this turn.`,
        when: [START_OF_HERO_PHASE],
      },
    ],
  },
  'Boil their Bones': {
    effects: [
      {
        name: `Boil their Bones`,
        desc: `Pick 1 enemy HERO or enemy MONSTER. You complete this tactic if that enemy unit is destroyed within 6 of an empty Great Mawpot in your army.`,
        when: [START_OF_HERO_PHASE],
      },
    ],
  },
}

export default tagAs(BattleTactics, 'battle_tactic')

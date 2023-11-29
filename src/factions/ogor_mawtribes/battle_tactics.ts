import { tagAs } from 'factions/metatagger'
import { START_OF_HERO_PHASE } from 'types/phases'
import rule_sources from './rule_sources'
import meta_rule_sources from 'meta/rule_sources'
import { TItemDescriptions } from 'factions/factionTypes'

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
  'That Was Just a Morsel': {
    effects: [
      {
        name: `That Was Just a Morsel`,
        desc: `You complete this tactic if any enemy models were slain by the Mawpit's Head Butcher ability in this turn.`,
        when: [START_OF_HERO_PHASE],
        rule_sources: [meta_rule_sources.BOOK_DAWNBRINGERS_BOOK_3],
      },
    ],
  },
  'Slavering Ambush': {
    effects: [
      {
        name: `Slavering Ambush`,
        desc: `You complete this tactic if a friendly GORGERS unit was set up on the battlefield using the Ambushing Hunters ability this turn and made a charge move this turn.`,
        when: [START_OF_HERO_PHASE],
        rule_sources: [meta_rule_sources.BOOK_DAWNBRINGERS_BOOK_3],
      },
    ],
  },
  "We Eated 'Em All": {
    effects: [
      {
        name: `We Eated 'Em All`,
        desc: `Pick 1 objective controlled by your opponent. You complete this tactic if you control that objective at the end of this turn and there are no enemy models contesting it.`,
        when: [START_OF_HERO_PHASE],
        rule_sources: [meta_rule_sources.BOOK_DAWNBRINGERS_BOOK_3],
      },
    ],
  },
} satisfies TItemDescriptions

export default tagAs(BattleTactics, 'battle_tactic')

import { tagAs } from 'factions/metatagger'
import { CITIES_OF_SIGMAR } from 'meta/factions'
import { HERO_PHASE, START_OF_HERO_PHASE, WOUND_ALLOCATION_PHASE } from 'types/phases'
import rule_sources from './rule_sources'
import { TItemDescriptions } from 'factions/factionTypes'

const BattleTraits = {
  [CITIES_OF_SIGMAR]: {
    effects: [
      {
        name: `Amplified Sorceries`,
        desc: `Add 1 to casting rolls for CITIES OF SIGMAR WIZARDS attempting to cast a Summoning spell on an endless spell warscroll.`,
        when: [HERO_PHASE],
        rule_sources: [rule_sources.BATTLETOME_CITIES_OF_SIGMAR, rule_sources.ERRATA_JULY_2021],
      },
      {
        name: `Loyal Shields`,
        desc: `If your general is within 3" of their retinue, roll a D6 before allocating a wound or mortal wound to the general. On a 4+ allocate the wound or mortal wound to the retinue.`,
        when: [WOUND_ALLOCATION_PHASE],
      },
      {
        name: `Wise Council`,
        desc: `If your general is within 3" of their adjutant, roll a D6. On a 4+ receive 1 extra command point.`,
        when: [START_OF_HERO_PHASE],
      },
    ],
  },
} satisfies TItemDescriptions

export default tagAs(BattleTraits, 'battle_trait')

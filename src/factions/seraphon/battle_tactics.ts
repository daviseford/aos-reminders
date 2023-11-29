import { tagAs } from 'factions/metatagger'
import { START_OF_HERO_PHASE } from 'types/phases'

import { TItemDescriptions } from 'factions/factionTypes'

const BattleTactics = {
  'Celestial Obliteration': {
    effects: [
      {
        name: `Celestial Obliteration`,
        desc: `Pick 1 enemy unit on the battlefield. You complete this tactic if that unit is destroyed this turn by mortal wounds caused by a spell or the abilities of an endless spell.`,
        when: [START_OF_HERO_PHASE],
      },
    ],
  },
  'Overwhelming Numbers': {
    effects: [
      {
        name: `Overwhelming Numbers`,
        desc: `Pick 1 objective controlled by the enemy. You complete this tactic at the end of this turn if you control that objective and all friendly units contesting it have the SKINK keyword.`,
        when: [START_OF_HERO_PHASE],
      },
    ],
  },
  'Apex Predator': {
    effects: [
      {
        name: `Apex Predator`,
        desc: `Pick 1 enemy MONSTER. You complete this tactic at the end of this turn if that enemy unit was destroyed by an attack made by a friendly SERAPHON MONSTER.`,
        when: [START_OF_HERO_PHASE],
      },
    ],
  },
  'Cold-blooded Resilience': {
    effects: [
      {
        name: `Cold-blooded Resilience`,
        desc: `Pick 1 friendly SAURUS or KROXIGOR unit within 3" of an enemy unit. You complete this tactic at the end of this turn if that unit was not destroyed, did not retreat and was not removed from the battlefield.`,
        when: [START_OF_HERO_PHASE],
      },
    ],
  },
  'Pack Hunters': {
    effects: [
      {
        name: `Pack Hunters`,
        desc: `Pick 1 enemy unit within 3" of only 1 friendly AGGRADON unit. You complete this tactic if, at the end of this turn, that unit is within 3" of 2 or more friendly AGGRADON units.`,
        when: [START_OF_HERO_PHASE],
      },
    ],
  },
  'Stampede of Scales': {
    effects: [
      {
        name: `Stampede of Scales`,
        desc: `Pick 3 different friendly SERAPHON MONSTERS. You complete this tactic if each of those units runs in the following movement phase and finishes that run within 6" of at least 1 of the other units you picked and wholly within enemy territory.`,
        when: [START_OF_HERO_PHASE],
      },
    ],
  },
} satisfies TItemDescriptions

export default tagAs(BattleTactics, 'battle_tactic')

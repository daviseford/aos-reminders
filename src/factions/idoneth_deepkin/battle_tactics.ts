import { TItemDescriptions } from 'factions/factionTypes'
import { tagAs } from 'factions/metatagger'
import { START_OF_HERO_PHASE } from 'types/phases'

const BattleTactics = {
  'Assassins of the High Tide': {
    effects: [
      {
        name: `Assassins of the High Tide`,
        desc: `You complete this battle tactic if 2 or more enemy units are destroyed during this turn by attacks made by friendly IDONETH DEEPKIN units that are affected by the High Tide ability.`,
        when: [START_OF_HERO_PHASE],
      },
    ],
  },
  'Predators of the Deep': {
    effects: [
      {
        name: `Predators of the Deep`,
        desc: `Pick 1 unit in your that has a Wounds characteristic of 8 or more and that has 0 wounds allocated to it. You complete this tactic if that unit is destroyed during this turn by a friendly AKHELIAN ALLOPEXES unit.`,
        when: [START_OF_HERO_PHASE],
      },
    ],
  },
  'Revenge of the Namarti': {
    effects: [
      {
        name: `Revenge of the Namarti`,
        desc: `You complete this battle tactic if an enemy HERO or MONSTER is destroyed during this turn by an attack made by a friendly NAMARTI unit.`,
        when: [START_OF_HERO_PHASE],
      },
    ],
  },
  'Deny Trespassers': {
    effects: [
      {
        name: `Deny Trespassers`,
        desc: `Pick 1 Gloomtide Shipwreck in your army that is within 12" of any enemy units. You complete this battle tactic if that Gloomtide Shipwreck is more than 12" from all enemy units at the end of this turn.`,
        when: [START_OF_HERO_PHASE],
      },
    ],
  },
  'Trapped in the Undercurrents': {
    effects: [
      {
        name: `Trapped in the Undercurrents`,
        desc: `You complete this battle tactic if 3 or more friendly IDONETH DEEPKIN units retreated and made a charge move during this turn.`,
        when: [START_OF_HERO_PHASE],
      },
    ],
  },
  'Isharann Defiance': {
    effects: [
      {
        name: `Isharann Defiance`,
        desc: `When you reveal this battle tactic, pick 1 objective wholly within enemy territory. At the end of this turn, you complete this battle tactic if you control that objective and there is a friendly ISHARANN unit within 6" of that objective.`,
        when: [START_OF_HERO_PHASE],
      },
    ],
  },
} satisfies TItemDescriptions

export default tagAs(BattleTactics, 'battle_tactic')

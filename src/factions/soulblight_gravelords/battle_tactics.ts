import { tagAs } from 'factions/metatagger'
import { START_OF_HERO_PHASE } from 'types/phases'
import { TItemDescriptions } from 'factions/factionTypes'

const BattleTactics = {
  'Callous Overlord': {
    effects: [
      {
        name: `Callous Overlord`,
        desc: `Pick 1 friendly SUMMONABLE unit more than 3" from all enemy units. You complete this tactic if that friendly unit is destroyed during this turn.`,
        when: [START_OF_HERO_PHASE],
      },
    ],
  },
  'Cursed Unlife': {
    effects: [
      {
        name: `Cursed Unlife`,
        desc: `You complete this tactic if any wounds allocated to your general or to 2 other friendly VAMPIRE units are healed using The Hunger ability during this turn.`,
        when: [START_OF_HERO_PHASE],
      },
    ],
  },
  'The Grasping Dead': {
    effects: [
      {
        name: `The Grasping Dead`,
        desc: `Pick 1 friendly SUMMONABLE unit within 3" of any enemy units. You complete this tactic if that unit is within 3" of any enemy units at the end of this turn.`,
        when: [START_OF_HERO_PHASE],
      },
    ],
  },
  'The Choicest Vintage': {
    effects: [
      {
        name: `The Choicest Vintage`,
        desc: `Pick 1 enemy HERO on the battlefield. You complete this tactic if that enemy HERO is slain during this turn by an attack made by a friendly VAMPIRE HERO.`,
        when: [START_OF_HERO_PHASE],
      },
    ],
  },
  'Expand the Grave-empires': {
    effects: [
      {
        name: `Expand the Grave-empires`,
        desc: `You complete this tactic if you control 2 or more objectives wholly outside your territory and each of those objectives is contested by a friendly SUMMONABLE or VAMPIRE unit.`,
        when: [START_OF_HERO_PHASE],
      },
    ],
  },
  'Endless Nightmare': {
    effects: [
      {
        name: `Endless Nightmare`,
        desc: `Pick 1 friendly SOULBLIGHT GRAVELORDS SUMMONABLE unit on the battlefield. You complete this tactic if 6 or more slain models are returned to that unit during this turn.`,
        when: [START_OF_HERO_PHASE],
      },
    ],
  },
} satisfies TItemDescriptions

export default tagAs(BattleTactics, 'battle_tactic')

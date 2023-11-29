import { tagAs } from 'factions/metatagger'
import { START_OF_HERO_PHASE } from 'types/phases'
import { TItemDescriptions } from 'factions/factionTypes'

const BattleTactics = {
  'Call for Change': {
    effects: [
      {
        name: `Call for Change`,
        desc: `You complete this battle tactic if you summon a Lord of Change to the battlefield this turn.`,
        when: [START_OF_HERO_PHASE],
      },
    ],
  },
  'Mass Conjuration': {
    effects: [
      {
        name: `Mass Conjuration`,
        desc: `Pick 1 friendly Disciples of Tzeentch Wizard. You complete this battle tactic if that Wizard successfully casts 3 or more spells in that turn and none of those spells are unbound.`,
        when: [START_OF_HERO_PHASE],
      },
    ],
  },
  'Ninefold Dismantelment': {
    effects: [
      {
        name: `Ninefold Dismantelment`,
        desc: `Pick 1 enemy unit that has 9 or more models, or pick 1 enemy Hero or Monster with a Wounds characteristic of 9 ore more. You complete this battle tactic if that unit is destroyed by the end of this turn.`,
        when: [START_OF_HERO_PHASE],
      },
    ],
  },
  'Reckless Abandon': {
    effects: [
      {
        name: `Reckless Abandon`,
        desc: `Pick 1 friendly Mortal Disciples of Tzeentch unit that is more than 18" from all enemy units. You complete this battle tactic if that unit completes a charge move in this turn.`,
        when: [START_OF_HERO_PHASE],
      },
    ],
  },
  'Tides of Anarchy': {
    effects: [
      {
        name: `Tides of Anarchy`,
        desc: `You complete this battle tactic if you gain control of an objective that was controlled by your opponent at the start of your hero phase, and you have 9 ore more friendly models within 6" of that objective when you gain control of it.`,
        when: [START_OF_HERO_PHASE],
      },
    ],
  },
} satisfies TItemDescriptions

export default tagAs(BattleTactics, 'battle_tactic')

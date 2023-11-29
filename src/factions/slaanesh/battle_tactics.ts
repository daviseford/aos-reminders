import { tagAs } from 'factions/metatagger'
import { START_OF_HERO_PHASE } from 'types/phases'
import { TItemDescriptions } from 'factions/factionTypes'

const BattleTactics = {
  'Death by a Thousand Cuts': {
    effects: [
      {
        name: 'Death by a Thousand Cuts',
        desc: `Pick 1 enemy unit. You complete this tactic if wounds caused by attacks made by 3 or more different friendly units are allocated to that unit in this turn.`,
        when: [START_OF_HERO_PHASE],
      },
    ],
  },
  'An Enrapturing Blur': {
    effects: [
      {
        name: `An Enrapturing Blur`,
        desc: `Pick 1 enemy HERO that has no wounds allocated to them. You complete this tactic if that unit is destroyed in the combat phase of this turn before it is picked to fight.`,
        when: [START_OF_HERO_PHASE],
      },
    ],
  },
  'The Grand Feast': {
    effects: [
      {
        name: `The Grand Feast`,
        desc: `You complete this tactic if you receive 12 or more depravity points from the Euphoric Killers battle trait during this turn.`,
        when: [START_OF_HERO_PHASE],
      },
    ],
  },
  'Excessive Carnage': {
    effects: [
      {
        name: `Excessive Carnage`,
        desc: `Pick 1 enemy unit that is contesting an objective. You complete this tactic if you pick that unit using the Euphoric Killers battle trait (pg 79) and that unit is destroyed during this turn.`,
        when: [START_OF_HERO_PHASE],
      },
    ],
  },
  'Realm-racers': {
    effects: [
      {
        name: `Realm-racers`,
        desc: `You complete this tactic if 3 or more different friendly HEDONITES OF SLAANESH units make a charge move of 7" or more during this turn.`,
        when: [START_OF_HERO_PHASE],
      },
    ],
  },
  'Depraved Unity': {
    effects: [
      {
        name: `Depraved Unity`,
        desc: `Pick 1 objective that you do not control. You complete this tactic if you control that objective at the end of this turn and at least 1 friendly HEDONITES OF SLAANESH MORTAL unit and 1 friendly HEDONITES OF SLAANESH DAEMON unit are contesting that objective.`,
        when: [START_OF_HERO_PHASE],
      },
    ],
  },
} satisfies TItemDescriptions

export default tagAs(BattleTactics, 'battle_tactic')

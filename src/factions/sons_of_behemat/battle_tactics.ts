import { tagAs } from 'factions/metatagger'
import { START_OF_HERO_PHASE } from 'types/phases'
import { TItemDescriptions } from 'factions/factionTypes'

const BattleTactics = {
  "That's Mine!": {
    effects: [
      {
        name: `That's Mine!`,
        desc: `Pick 1 objective on the battlefield that is not within your territory. You complete this tactic if that objective is kicked away and is wholly within your territory at the end of this turn.`,
        when: [START_OF_HERO_PHASE],
      },
    ],
  },
  'Wrecking Crew': {
    effects: [
      {
        name: `Wrecking Crew`,
        desc: `You complete this tactic if an enemy faction terrain feature was demolished during this turn.`,
        when: [START_OF_HERO_PHASE],
      },
    ],
  },
  'Man-skittles': {
    effects: [
      {
        name: `Man-skittles`,
        desc: `You complete this tactic if a friendly Warstomper used its 'Hurled Body' ability, an enemy model was slain by the first part of the ability, and an enemy Battleline unit was picked for the second part of the ability and suffered any mortal wounds.`,
        when: [START_OF_HERO_PHASE],
      },
    ],
  },
  'Fury of Titans': {
    effects: [
      {
        name: `Fury of Titans`,
        desc: `You complete this tactic if you carry out the Beast Grapple, Earth-Shaking Roar and Colossal Slam monstrous rampages this turn.`,
        when: [START_OF_HERO_PHASE],
      },
    ],
  },
  'Splat!': {
    effects: [
      {
        name: `Splat!`,
        desc: `Pick 1 enemy Hero. You complete this tactic if that Hero is slain by wounds caused by an attack made with Throwin' Rocks, Hurled Debris or a Hurled Boulder during this turn.`,
        when: [START_OF_HERO_PHASE],
      },
    ],
  },
  'Colossal Violence': {
    effects: [
      {
        name: `Colossal Violence`,
        desc: `Pick 1 friendly Mega-Gargant. You complete this tactic if you carried out the Titanic Duel monstrous rampage with that unit during this turn and the enemy Monster picked as the target was slain by attacks made by that unit during this turn.`,
        when: [START_OF_HERO_PHASE],
      },
    ],
  },
  // King Brodd's Stomp
  "'Good Shot! Hur Hur!'": {
    effects: [
      {
        name: `'Good Shot! Hur Hur!'`,
        desc: `You complete this battle tactic if an enemy unit was destroyed during this turn by an attack made with the Hurled Terrain missile weapon.`,
        when: [START_OF_HERO_PHASE],
      },
    ],
  },
  "King's Conquest": {
    effects: [
      {
        name: `King's Conquest`,
        desc: `You complete this battle tactic if a friendly KING BRODD and 1 other friendly KING BRODD'S STOMP unit are contesting the same objective at the end of this turn and that objective was controlled by your opponent at the start of this turn.`,
        when: [START_OF_HERO_PHASE],
      },
    ],
  },
  "Clear 'Em Out": {
    effects: [
      {
        name: `Clear 'Em Out`,
        desc: `Pick 1 objective on the battlefield that you do not control. You complete this battle tactic if, at the end of this turn, you control that objective and that objective is contested by a friendly KING BR0DD's STOMP unit that made a charge move this turn.`,
        when: [START_OF_HERO_PHASE],
      },
    ],
  },
} satisfies TItemDescriptions

export default tagAs(BattleTactics, 'battle_tactic')

import { tagAs } from 'factions/metatagger'
import meta_rule_sources from 'meta/rule_sources'
import { START_OF_HERO_PHASE } from 'types/phases'

const BattleTactics = {
  'Follow da Moon': {
    effects: [
      {
        name: `Follow da Moon`,
        desc: `You cannot pick this tactic in the first battle round. You complete this tactic if at the end of this turn every friendly GLOOMSPITE GITZ unit on the battlefield is affected by the Light of the Bad Moon and you control more objectives than your opponent.`,
        when: [START_OF_HERO_PHASE],
      },
    ],
  },
  'Glory Grabbers': {
    effects: [
      {
        name: `Glory Grabbers`,
        desc: `Pick 1 objective controlled by your opponent. You complete this tactic if at the end of this turn you control that objective and a friendly GLOOMSPITE GITZ unit that was added to your army as a replacement unit using the Bad Moon Loonshrine's Moonclan Lairs ability is contesting it.`,
        when: [START_OF_HERO_PHASE],
      },
    ],
  },
  'Venomous Assault': {
    effects: [
      {
        name: `Venomous Assault`,
        desc: `You complete this tactic if at least 8 mortal wounds were caused by the Spider Venom ability of friendly SPIDERFANG units during this turn and not negated.`,
        when: [START_OF_HERO_PHASE],
      },
    ],
  },
  "Stab 'Em in the Dark": {
    effects: [
      {
        name: `Stab 'Em in the Dark`,
        desc: `Pick 1 enemy unit on the battlefield. You complete this tactic if that unit was destroyed by an attack made by a friendly GLOOMSPITE GITZ unit during this turn while it was not affected by the Light of the Bad Moon.`,
        when: [START_OF_HERO_PHASE],
      },
    ],
  },
  'Moonlight Raid': {
    effects: [
      {
        name: `Moonlight Raid`,
        desc: `Pick 1 objective controlled by your opponent. You complete this tactic if at the end of this turn you control that objective and every friendly GLOOMSPITE GITZ unit that is contesting it is affected by the Light of the Bad Moon.`,
        when: [START_OF_HERO_PHASE],
      },
    ],
  },
  "You Ain't So Big": {
    effects: [
      {
        name: `You Ain't So Big`,
        desc: `Pick 1 enemy MONSTER on the battlefield. You complete this tactic if that MONSTER was slain by an attack made by a friendly GLOOMSPITE GITZ TROGGOTH unit during this turn.`,
        when: [START_OF_HERO_PHASE],
      },
    ],
  },
  "Don't Like Dat One!": {
    effects: [
      {
        name: `Don't Like Dat One!`,
        desc: `Pick 1 enemy HERO. You complete this battle tactic if that HERO was destroyed during this turn by an attack made by a friendly TRUGG.`,
        when: [START_OF_HERO_PHASE],
        rule_sources: [meta_rule_sources.BOOK_DAWNBRINGERS_BOOK_2],
      },
    ],
  },
  'Feels Funny': {
    effects: [
      {
        name: `Feels Funny`,
        desc: `You complete this battle tactic if a friendly TRUGG'S TROGGHERD unit destroyed an enemy unit during this turn while it was affected by the Aura of Haywire Magic battle trait (pg 76).`,
        when: [START_OF_HERO_PHASE],
        rule_sources: [meta_rule_sources.BOOK_DAWNBRINGERS_BOOK_2],
      },
    ],
  },
  "Wot's Dat Glowy Fing?": {
    effects: [
      {
        name: `Wot's Dat Glowy Fing?`,
        desc: `Pick 1 objective you do not control. You complete this battle tactic if you control that objective at the end of this turn and 2 or more friendly TRUGG'S TROGGHERD units that are affected by the Light of the Bad Moon are contesting that objective.`,
        when: [START_OF_HERO_PHASE],
        rule_sources: [meta_rule_sources.BOOK_DAWNBRINGERS_BOOK_2],
      },
    ],
  },
}

export default tagAs(BattleTactics, 'battle_tactic')

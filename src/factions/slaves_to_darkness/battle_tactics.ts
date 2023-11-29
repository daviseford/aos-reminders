import { tagAs } from 'factions/metatagger'
import { START_OF_HERO_PHASE } from 'types/phases'
import { TItemDescriptions } from 'factions/factionTypes'

const BattleTactics = {
  'In Thrall to Chaos': {
    effects: [
      {
        name: `In Thrall to Chaos`,
        desc: `Pick 1 objective marker on the battlefield that is within 12" of any enemy units. You complete this battle tactic if there are no enemy units within 12" of that objective marker at the end of this turn.`,
        when: [START_OF_HERO_PHASE],
      },
    ],
  },
  'Lust for Power': {
    effects: [
      {
        name: `Lust for Power`,
        desc: `Pick 1 friendly SLAVES TO DARKNESS HERO that has the EYE OF THE GODS keyword. You complete this battle tactic if you roll on the Eye of the Gods table for that HERO during this turn.`,
        when: [START_OF_HERO_PHASE],
      },
    ],
  },
  'The March of Ruin': {
    effects: [
      {
        name: `The March of Ruin`,
        desc: `Pick 1 friendly SLAVES TO DARKNESS unit that includes an Ensorcelled Banner and is not within enemy territory. You complete this battle tactic if at the end of this turn that unit is wholly within enemy territory and within 3" of any other friendly units.`,
        when: [START_OF_HERO_PHASE],
      },
    ],
  },
  Iconoclasts: {
    effects: [
      {
        name: `Iconoclasts`,
        desc: `Pick 1 enemy unit that is a PRIEST OF TOTEM. You complete this battle tactic if that unit is destroyed at the end of the turn.`,
        when: [START_OF_HERO_PHASE],
      },
    ],
  },
  'Champions of Chaos': {
    effects: [
      {
        name: `Champions of Chaos`,
        desc: `You complete this battle tactic if at the end of your turn there are 3 or more friendly HEROES within 3" of enemy HEROES.`,
        when: [START_OF_HERO_PHASE],
      },
    ],
  },
  'Run Them Down': {
    effects: [
      {
        name: `Run Them Down`,
        desc: `You complete this battle tactic if at the end of your turn, 3 or more friendly SLAVES TO DARKNESS units made a charge move in that turn.`,
        when: [START_OF_HERO_PHASE],
      },
    ],
  },
} satisfies TItemDescriptions

export default tagAs(BattleTactics, 'battle_tactic')

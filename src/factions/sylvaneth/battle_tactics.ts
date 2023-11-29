import { tagAs } from 'factions/metatagger'
import { START_OF_HERO_PHASE } from 'types/phases'
import { TItemDescriptions } from 'factions/factionTypes'

const BattleTactics = {
  'Trophy Kill': {
    effects: [
      {
        name: 'Trophy Kill',
        desc: `You complete this tactic if the quarry was destroyed by an attack made with a melee weapon in this turn.`,
        when: [START_OF_HERO_PHASE],
      },
    ],
  },
  Encircled: {
    effects: [
      {
        name: 'Encircled',
        desc: `You complete this tactic if, at the end of this turn, all friendly units are in the same large quarter of the battlefield as the quarry.`,
        when: [START_OF_HERO_PHASE],
      },
    ],
  },
  'Spring the Trap': {
    effects: [
      {
        name: 'Spring the Trap',
        desc: `You complete this tactic if 4 or more friendly units made a charge move in this turn and 1 or more of those units made an attack with a melee weapon that targeted the quarry in this turn.`,
        when: [START_OF_HERO_PHASE],
      },
    ],
  },
  'Eradicate Trespassers': {
    effects: [
      {
        name: 'Eradicate Trespassers',
        desc: `Pick 1 enemy unit within 6" of a friendly Awakened Wyldwood. You complete this battle tactic if that unit is destroyed during this turn.`,
        when: [START_OF_HERO_PHASE],
      },
    ],
  },
  'Harness the Spirit Paths': {
    effects: [
      {
        name: `Harness the Spirit Paths`,
        desc: `You complete this battle tactic if any models in a friendly SYLVANETH unit that was set up using the From the Woodland Depths battle trait this turn make a charge move this turn.`,
        when: [START_OF_HERO_PHASE],
      },
    ],
  },
  'Balance the Cycle': {
    effects: [
      {
        name: `Balance the Cycle`,
        desc: `Pick 1 enemy unit within 12" of an overgrown terrain feature or friendly Awakened Wyldwood. You complete this battle tactic if that unit is destroyed by an attack made by a friendly SYLVANETH unit that was added to your army this turn.`,
        when: [START_OF_HERO_PHASE],
      },
    ],
  },
  'March of the Forest Lords': {
    effects: [
      {
        name: `March of the Forest Lords`,
        desc: `Pick 1 enemy MONSTER on the battlefield. You complete this battle tactic if that MONSTER is slain by an attack made by a friendly SPIRIT OF DURTHU, TREELORD ANCIENT or TREELORD during this turn.`,
        when: [START_OF_HERO_PHASE],
      },
    ],
  },
  "Unleash Ghyran's Wrath": {
    effects: [
      {
        name: `Unleash Ghyran's Wrath`,
        desc: `Pick 1 friendly SYLVANETH WIZARD on the battlefield. You complete this battle tactic if a spell successfully cast by that WIZARD, or an endless spell summoned by that WIZARD, destroys an enemy unit this turn.`,
        when: [START_OF_HERO_PHASE],
      },
    ],
  },
} satisfies TItemDescriptions

export default tagAs(BattleTactics, 'battle_tactic')

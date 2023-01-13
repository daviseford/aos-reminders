import { tagAs } from 'factions/metatagger'
import { SYLVANETH } from 'meta/factions'
import {
  COMBAT_PHASE,
  DURING_GAME,
  DURING_SETUP,
  END_OF_MOVEMENT_PHASE,
  HERO_PHASE,
  START_OF_HERO_PHASE,
  START_OF_ROUND,
  WARDS_PHASE,
} from 'types/phases'
import rule_sources from './rule_sources'

const BattleTraits = {
  [SYLVANETH]: {
    effects: [
      {
        name: `Places of Power`,
        desc: `After territories are determined, before faction terrain features are set up, you can pick up to 3 terrain features on the battlefield that are wholly outside enemy territory. Those terrain features are considered by you to be overgrown terrain features.`,
        when: [DURING_SETUP],
      },
      {
        name: `Places of Power`,
        desc: `At the start of your hero phase, you can heal 1 wound allocated to each friendly SYLVANETH unit that is wholly within 9" of an overgrown terrain feature or friendly Awakened Wyldwood.`,
        when: [START_OF_HERO_PHASE],
      },
      {
        name: `Walk the Hidden Paths`,
        desc: `Once per turn at the end of your movement phase, you can pick 1 friendly SYLVANETH unit that is wholly within 9" of an overgrown terrain feature or friendly Awakened Wyldwood. 
      
      Remove that unit from the battlefield and set it up again more than 9" from all enemy units and wholly within 9" of either a different overgrown terrain feature or Awakened Wyldwood that is more than 3" from all enemy units.`,
        when: [END_OF_MOVEMENT_PHASE],
      },
      {
        name: `Strike and Fade`,
        desc: `Once per turn, in your combat phase, immediately after a friendly Sylvaneth unit that is wholly within 9" of an overgrown terrain feature or friendly Awakened Wyldwood has fought and slain models (if any) have been removed from play (core rules, 14.2), you can remove that unit from the battlefield and set it up again more than 9" from all enemy units and wholly within 9" of either a different overgrown terrain feature that is more than 3" from all enemy units or a different friendly Awakened Wyldwood that is more than 3" from all enemy units.

        Designer's Note: This errata means that any abilities or effects that come into play when a model is slain but before it is removed from play (such as the 'Blaze of Glory' battle trait for the Stormcast Eternals) are resolved before the 'Strike and Fade' effect regardless of whose turn is taking place.`,
        when: [COMBAT_PHASE],
        rule_sources: [
          rule_sources.BATTLETOME_SYLVANETH,
          rule_sources.ERRATA_OCTOBER_2022,
          rule_sources.ERRATA_JANUARY_2023,
        ],
      },
    ],
  },

  // Seasons of War
  'The Burgeoning': {
    effects: [
      {
        name: `The Burgeoning`,
        desc: `Friendly SYLVANETH units that did not charge in the same turn and are wholly within 9" of an overgrown terrain feature or friendly Awakened Wyldwood have a ward of 6+.`,
        when: [WARDS_PHASE],
      },
    ],
  },
  'The Reaping': {
    effects: [
      {
        name: `The Reaping`,
        desc: `Add 3 to the range within which you can pick friendly SYLVANETH units with the Places of Power and From the Woodland Depths battle traits.`,
        when: [DURING_GAME],
      },
    ],
  },
  'The Dwindling': {
    effects: [
      {
        name: `The Dwindling`,
        desc: `In the hero phase, you can reroll 1 casting roll, 1 unbinding roll and 1 dispelling roll, so long as the friendly WIZARD you pick is a SYLVANETH WIZARD that is wholly within 9" of an overgrown terrain feature or friendly Awakened Wyldwood.`,
        when: [HERO_PHASE],
      },
    ],
  },
  Everdusk: {
    effects: [
      {
        name: `Everdusk`,
        desc: `Subtract 3" from the range within which you can pick friendly SYLVANETH units with the Places of Power and From the Woodland Depths battle traits. However, if the unmodified hit roll for an attack made with a melee weapon by a friendly SYLVANETH unit wholly within 6" of an overgrown terrain feature or friendly Awakened Wyldwood is 6, that attack scores 2 hits on the target instead of 1. Make a wound and save roll for each hit.`,
        when: [DURING_GAME, COMBAT_PHASE],
      },
    ],
  },

  'Battle Tactics': {
    effects: [
      {
        name: 'Eradicate Trespassers',
        desc: `Pick 1 enemy unit within 6" of a friendly Awakened Wyldwood. You complete this battle tactic if that unit is destroyed during this turn.`,
        when: [START_OF_ROUND],
      },
      {
        name: `Harness the Spirit Paths`,
        desc: `You complete this battle tactic if any models in a friendly SYLVANETH unit that was set up using the From the Woodland Depths battle trait this turn make a charge move this turn.`,
        when: [START_OF_ROUND],
      },
      {
        name: `Balance the Cycle`,
        desc: `Pick 1 enemy unit within 12" of an overgrown terrain feature or friendly Awakened Wyldwood. You complete this battle tactic if that unit is destroyed by an attack made by a friendly SYLVANETH unit that was added to your army this turn.`,
        when: [START_OF_ROUND],
      },
      {
        name: `March of the Forest Lords`,
        desc: `Pick 1 enemy MONSTER on the battlefield. You complete this battle tactic if that MONSTER is slain by an attack made by a friendly SPIRIT OF DURTHU, TREELORD ANCIENT or TREELORD during this turn.`,
        when: [START_OF_ROUND],
      },
      {
        name: `Unleash Ghyran's Wrath`,
        desc: `Pick 1 friendly SYLVANETH WIZARD on the battlefield. You complete this battle tactic if a spell successfully cast by that WIZARD, or an endless spell summoned by that WIZARD, destroys an enemy unit this turn.`,
        when: [START_OF_ROUND],
      },
    ],
  },
}

export default tagAs(BattleTraits, 'battle_trait')

import { tagAs } from 'factions/metatagger'
import { SYLVANETH } from 'meta/factions'
import {
  COMBAT_PHASE,
  DURING_GAME,
  DURING_SETUP,
  END_OF_MOVEMENT_PHASE,
  END_OF_SETUP,
  HERO_PHASE,
  START_OF_HERO_PHASE,
  START_OF_ROUND,
  WARDS_PHASE,
} from 'types/phases'
import rule_sources from './rule_sources'
import { TItemDescriptions } from 'factions/factionTypes'

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

  'The Evergreen Hunt': {
    effects: [
      {
        name: `To Honour Kurnouth`,
        desc: `Friendly EVERGREEN HUNT units that do not have the HERO keyword have the Battleline battlefield role.`,
        when: [DURING_GAME],
      },
      {
        name: `Rhythm of the Chase`,
        desc: `After deployment, before the players have determined who will take the first turn, you can pick 1 enemy unit on the battlefield to be the quarry. If the quarry is destroyed, at the start of your next hero phase, you can pick 1 enemy unit on the battlefield to be the new quarry.`,
        when: [END_OF_SETUP],
      },
      {
        name: `Harmonies of the Hunt`,
        desc: `At the start of each battle round, after the priority roll has been made, each player commanding an Evergreen Hunt army must determine their Hunting Harmony for that battle round, starting with the player taking the first turn. A Hunting Harmony is made up of a number of chords. You start with 0 chords and receive 1 chord for the following:

        - If a friendly BELTHANOS is on the battlefield.
        - For each friendly EVERGREEN HUNT unit wholly ewithin the same large quarter of the battlefield as the quarry.
        - For each quarry destroyed during the battle.
        
        Add up the number of chords you received and consult the Hunting Harmony Table to see which effects will apply to your army for that battle round. These effects are cumulative: if you have 6 chords, all of the effects in the table will apply. Hunting Harmony chords are lost at the end of each battle round.
        
        0: Discordant: No effect.
        1: Simple: Add 1 to run rolls and charge rolls for friendly units wholly within the same large quarter of the battlefield as the quarry.
        2: Tuneful: Add 1 to hit rolls and wound rolls for attacks made with melee weapons that target an enemy unit wholly within the same large quarter of the battlefield as the quarry.
        3-5: Melodic: Add 1 to the Attacks characteristic of melee weapons used by friendly units while they are within 3" of the quarry.
        6+: Mellifluous: While a friendly unit is wholly within the same large quarter of the battlefield as the quarry, it is eligible to fight in the combat phase if it is within 6" of the quarry instead of 3", and it can move an extra 3" when it piles in. `,
        when: [START_OF_ROUND],
      },
      {
        name: `Adundant Growth`,
        desc: `After territories are determined, before faction terrain features are set up, you can pick up to 3 terrain features on the battlefield that are wholly outside enemy territory. These terrain features are considered by you to be overgrown terrain features.

        At the start of your hero phase, you can heal 1 wound allocated to each friendly EVERGREEN HUNT unit that is wholly within 9" of an overgrown terrain feature.`,
        when: [END_OF_SETUP],
      },
      {
        name: `Adundant Growth`,
        desc: `At the start of your hero phase, you can heal 1 wound allocated to each friendly EVERGREEN HUNT unit that is wholly within 9" of an overgrown terrain feature.`,
        when: [START_OF_HERO_PHASE],
      },
      {
        name: `Heroic Action: A Prize Quarry is Sighted`,
        desc: `Pick 1 friendly EVERGREEN HUNT HERO and 1 enemy unit within 9" of that HERO. That enemy unit becomes the quarry instead of the enemy unit that was picked to be the quarry.`,
        when: [START_OF_HERO_PHASE],
      },
    ],
  },
} satisfies TItemDescriptions

export default tagAs(BattleTraits, 'battle_trait')

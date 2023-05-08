import { tagAs } from 'factions/metatagger'
import { SOULBLIGHT_GRAVELORDS } from 'meta/factions'
import {
  DURING_SETUP,
  END_OF_MOVEMENT_PHASE,
  START_OF_HERO_PHASE,
  START_OF_SETUP,
  WARDS_PHASE,
} from 'types/phases'

const BattleTraits = {
  [SOULBLIGHT_GRAVELORDS]: {
    effects: [
      {
        name: `The Unquiet Dead`,
        desc: `After territories are determined, you can pick up to 2 points within your territory and up to 2 points anywhere on the battlefield outside your territory to be gravesites. Each gravesite must be more than 1" from all terrain features and objectives. If both players can set up gravesites at the same time, or if one player can set up faction terrain features at the same time as the other player can set up gravesites, they must roll off, and the winner chooses who sets up their faction terrain features or gravesites first.`,
        when: [START_OF_SETUP],
      },
      {
        name: `The Unquiet Dead`,
        desc: `During deployment, instead of setting up a SOULBLIGHT GRAVELORDS SUMMONABLE unit on the battlefield, you can place it to one side and say that it is set up in the grave as a reserve unit. You can set up 1 unit in the grave for each unit you have set up on the battlefield. At the end of your movement phase, you can set up 1 or more of the reserve units in the grave on the battlefield, wholly within 12" of a gravesite and more than 9" from all enemy units.`,
        when: [DURING_SETUP],
      },
      {
        name: `The Unquiet Dead`,
        desc: `At the end of your movement phase, you can set up 1 or more of the reserve units in the grave on the battlefield, wholly within 12" of a gravesite and more than 9" from all enemy units.`,
        when: [END_OF_MOVEMENT_PHASE],
      },
      {
        name: `Deathless Minions`,
        desc: `Friendly SOULBLIGHT GRAVELORDS units have a ward of 6+.`,
        when: [WARDS_PHASE],
      },
      {
        name: `Endless Legions`,
        desc: `At the end of the movement phase, you can pick 1 friendly SOULBLIGHT GRAVELORDS SUMMONABLE unit that has been destroyed and roll a dice. Add 1 to the roll if it is your movement phase.

        If you pick a SUMMONABLE unit that is not a HERO, on a 4+, a new replacement unit with half of the models from the unit that was destroyed (rounding up) is added to your army. That unit must be set up wholly within 12" of a friendly SOULBLIGHT GRAVELORDS HERO or gravesite and more than 3" from all enemy units, and it cannot attempt a charge or make pile-in moves in the same turn. Each destroyed unit can only be replaced once - replacement units cannot themselves be replaced.

        If you pick a SUMMONABLE HERO, on a 4+, you can set up that HERO wholly within 12" of a friendly SOULBLIGHT GRAVELORDS HERO or gravesite, more than 3" from all enemy units and with 3 wounds allocated to it. That HERO cannot attempt a charge or make a pile-in move in the same turn. You cannot pick the same HERO to benefit from this ability more than once per battle.`,
        when: [END_OF_MOVEMENT_PHASE],
      },
      {
        name: `Deathly Invocation`,
        desc: `In your hero phase, you can pick up to 3 friendly SOULBLIGHT GRAVELORDS SUMMONABLE units wholly within 12" of a friendly SOULBLIGHT GRAVELORDS HERO. You can either heal up to 3 wounds allocated to that unit or, if no wounds have been allocated to that unit, you can return a number of slain models to it that have a combined Wounds characteristic of 3 or less. Add 1 to the number of slain models that are returned to that unit if it is wholly within 12" of a gravesite. You cannot pick the same unit to benefit from this ability more than once per phase.`,
        when: [START_OF_HERO_PHASE],
      },
    ],
  },

  'Battle Tactics': {
    effects: [
      {
        name: `Callous Overlord`,
        desc: `Pick 1 friendly SUMMONABLE unit more than 3" from all enemy units. You complete this tactic if that friendly unit is destroyed during this turn.`,
        when: [START_OF_HERO_PHASE],
      },
      {
        name: `Cursed Unlife`,
        desc: `You complete this tactic if any wounds allocated to your general or to 2 other friendly VAMPIRE units are healed using The Hunger ability during this turn.`,
        when: [START_OF_HERO_PHASE],
      },
      {
        name: `The Grasping Dead`,
        desc: `Pick 1 friendly SUMMONABLE unit within 3" of any enemy units. You complete this tactic if that unit is within 3" of any enemy units at the end of this turn.`,
        when: [START_OF_HERO_PHASE],
      },
      {
        name: `The Choicest Vintage`,
        desc: `Pick 1 enemy HERO on the battlefield. You complete this tactic if that enemy HERO is slain during this turn by an attack made by a friendly VAMPIRE HERO.`,
        when: [START_OF_HERO_PHASE],
      },
      {
        name: `Expand the Grave-empires`,
        desc: `You complete this tactic if you control 2 or more objectives wholly outside your territory and each of those objectives is contested by a friendly SUMMONABLE or VAMPIRE unit.`,
        when: [START_OF_HERO_PHASE],
      },
      {
        name: `Endless Nightmare`,
        desc: `Pick 1 friendly SOULBLIGHT GRAVELORDS SUMMONABLE unit on the battlefield. You complete this tactic if 6 or more slain models are returned to that unit during this turn.`,
        when: [START_OF_HERO_PHASE],
      },
    ],
  },
}

// Always export using tagAs
export default tagAs(BattleTraits, 'battle_trait')

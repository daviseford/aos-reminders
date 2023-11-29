import { tagAs } from 'factions/metatagger'
import { START_OF_HERO_PHASE } from 'types/phases'

const BattleTactics = {
  'Blood for the Altar': {
    effects: [
      {
        name: `Blood for the Altar`,
        desc: `Pick 1 enemy unit within 8" of your Skull Altar. You complete this battle tactic if that enemy unit is destroyed during this turn.`,
        when: [START_OF_HERO_PHASE],
      },
    ],
  },
  'Slay the Sorcerer': {
    effects: [
      {
        name: `Slay the Sorcerer`,
        desc: `Pick 1 enemy WIZARD HERO on the battlefield. You complete this battle tactic if that HERO is slain during this turn.`,
        when: [START_OF_HERO_PHASE],
      },
    ],
  },
  'The Trial of Skulls': {
    effects: [
      {
        name: `The Trial of Skulls`,
        desc: `Pick 1 friendly unit. You complete this battle tactic if 8 or more enemy models are slain by attacks made by that unit during this turn.`,
        when: [START_OF_HERO_PHASE],
      },
    ],
  },
  'No Cowards Among Us': {
    effects: [
      {
        name: `No Cowards Among Us`,
        desc: `You complete this battle tactic at the end of this turn if all friendly BLADES OF KHORNE units on the battlefield are within 8" of any enemy units.`,
        when: [START_OF_HERO_PHASE],
      },
    ],
  },
  'Leave None Standing': {
    effects: [
      {
        name: `Leave None Standing`,
        desc: `Pick 1 friendly unit within 3" of any enemy units. You complete this battle tactic if that unit fights in the combat phase of this turn and at the end of that phase there are no enemy units within 3" of that unit.`,
        when: [START_OF_HERO_PHASE],
      },
    ],
  },
  'The Battlefield Runs Red': {
    effects: [
      {
        name: `The Battlefield Runs Red`,
        desc: `You complete this battle tactic if 4 or more units were destroyed during this turn.`,
        when: [START_OF_HERO_PHASE],
      },
    ],
  },
}

export default tagAs(BattleTactics, 'battle_tactic')

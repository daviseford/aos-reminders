import { tagAs } from 'factions/metatagger'
import { START_OF_HERO_PHASE, TURN_ONE_START_OF_HERO_PHASE, TURN_TWO_START_OF_HERO_PHASE } from 'types/phases'

const BattleTactics = {
  'In the Shadow of the Herdstone': {
    effects: [
      {
        name: `In the Shadow of the Herdstone`,
        desc: `Pick 1 enemy unit within 12" of your Herdstone. You complete this battle tactic if that unit is destroyed during this turn.`,
        when: [START_OF_HERO_PHASE],
      },
    ],
  },
  'Bestial Wrath': {
    effects: [
      {
        name: `Bestial Wrath`,
        desc: `You can pick this battle tactic only in your first or second turn. You complete this tactic if your general and 2 or more other friendly BEASTS OF CHAOS units are within 3" of any enemy units at the end of this turn.`,
        when: [TURN_ONE_START_OF_HERO_PHASE, TURN_TWO_START_OF_HERO_PHASE],
      },
    ],
  },
  'Rampaging Beastherd': {
    effects: [
      {
        name: `Rampaging Beastherd`,
        desc: `Pick 1 objective controlled by your opponent. You complete this tactic if you control that objective at the end of this turn and that objective is contested by a friendly unit that has 10 or more models.`,
        when: [START_OF_HERO_PHASE],
      },
    ],
  },
  'Reduced to Savagery': {
    effects: [
      {
        name: `Reduced to Savagery`,
        desc: `Pick 1 enemy unit on the battlefield. You complete this tactic if that unit is picked as the target of a heroic action from the Rituals of Ruin battle trait (pg 62-63) and is destroyed during this turn.`,
        when: [START_OF_HERO_PHASE],
      },
    ],
  },
  'Trampled to Mulch': {
    effects: [
      {
        name: `Trampled to Mulch`,
        desc: `You complete this tactic if any enemy units are destroyed during this turn by mortal wounds allocated in your charge phase.`,
        when: [START_OF_HERO_PHASE],
      },
    ],
  },
  'Aid of the Wilderness': {
    effects: [
      {
        name: `Aid of the Wilderness`,
        desc: `You complete this tactic if there are 2 or more friendly BEASTS OF CHAOS units in cover wholly outside of your territory at the end of this turn.`,
        when: [START_OF_HERO_PHASE],
      },
    ],
  },
}

export default tagAs(BattleTactics, 'battle_tactic')

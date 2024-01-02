import { TItemDescriptions } from 'factions/factionTypes'
import { tagAs } from 'factions/metatagger'
import { START_OF_HERO_PHASE } from 'types/phases'

const BattleTactics = {
  'Bring Full Arms to Bear': {
    effects: [
      {
        name: `Bring Full Arms to Bear`,
        desc: `Pick 1 enemy unit. You complete this battle tactic if that unit is destroyed this turn and was suppressed as a result of the 'Suppressing Fire' order.`,
        when: [START_OF_HERO_PHASE],
      },
    ],
  },
  'Raise the Banner': {
    effects: [
      {
        name: `Raise the Banner`,
        desc: `Pick 1 objective controlled by your opponent. You complete this tactic if you control that objective at the end of this turn and a friendly FREEGUILD COMMAND CORPS that includes a Great Herald contests it.`,
        when: [START_OF_HERO_PHASE],
      },
    ],
  },
  'Blackpowder Bombardment': {
    effects: [
      {
        name: `Blackpowder Bombardment`,
        desc: `You complete this battle tactic if 3 or more enemy units are destroyed in your shooting phase this turn.`,
        when: [START_OF_HERO_PHASE],
      },
    ],
  },
  'Mount the Charge': {
    effects: [
      {
        name: `Mount the Charge`,
        desc: `Pick 1 objective controlled by your opponent. You complete this tactic if you control that objective at the end of this turn and every friendly unit that contests it has a mount/s and made a charge move this turn.`,
        when: [START_OF_HERO_PHASE],
      },
    ],
  },
  'Strike Without Warning': {
    effects: [
      {
        name: `Strike Without Warning`,
        desc: `You complete this battle tactic if 3 or more friendly CITIES OF SIGMAR AELF units made a charge move this turn.`,
        when: [START_OF_HERO_PHASE],
      },
    ],
  },
  'Iron Might': {
    effects: [
      {
        name: `Iron Might`,
        desc: `You complete this battle tactic at the end of the turn if 3 or more friendly CITIES OF SIGMAR DUARDIN units fought this turn and no friendly CITIES OF SIGMAR DUARDIN units were destroyed this turn.`,
        when: [START_OF_HERO_PHASE],
      },
    ],
  },
} satisfies TItemDescriptions

export default tagAs(BattleTactics, 'battle_tactic')

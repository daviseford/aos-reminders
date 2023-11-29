import { TItemDescriptions } from 'factions/factionTypes'
import {
  CHARGE_PHASE,
  COMBAT_PHASE,
  DURING_GAME,
  HERO_PHASE,
  WARDS_PHASE,
  WOUND_ALLOCATION_PHASE,
} from 'types/phases'

const Flavors = {
  'Reapers of Vengeance': {
    effects: [
      {
        name: `Brutal Retribution`,
        desc: `Add 1 to hit rolls for attacks made by friendly REAPERS OF VENGEANCE DAEMON units that target an enemy HERO. In addition, each time an enemy HERO is slain, you receive 1 additional Blood Tithe point.`,
        when: [DURING_GAME],
      },
      {
        name: `Brutal Retribution`,
        desc: `Each time an enemy HERO is slain, you receive 1 additional Blood Tithe point.`,
        when: [WOUND_ALLOCATION_PHASE],
      },
    ],
  },

  Bloodlords: {
    effects: [
      {
        name: `The First to Draw Blood`,
        desc: `When you use the Decapitating Blow ability for a BLOODLORDS BLOODLETTER unit, mortal wounds are caused on an unmodified roll of 5+ instead of 6 if that unit made a charge move in the same turn.`,
        when: [COMBAT_PHASE],
      },
    ],
  },

  Goretide: {
    effects: [
      {
        name: `Tireless Conquerors`,
        desc: `Add 1 to wound rolls for attacks made with melee weapons by friendly GORETIDE BLOODBOUND units that target an enemy unit that is contesting an objective you do not control, or that target an enemy unit wholly within enemy territory.`,
        when: [HERO_PHASE],
      },
    ],
  },

  'Skullfiend Tribe': {
    effects: [
      {
        name: `Blood-crazed Berserkers`,
        desc: `If you make an unmodified charge roll of 8+ for a friendly SKULLFIEND TRIBE BLOODBOUND unit, the strike-first effect applies to that unit until the end of the turn.`,
        when: [CHARGE_PHASE],
      },
    ],
  },

  'The Flayed': {
    effects: [
      {
        name: `Blood-woken Runes`,
        desc: `Friendly THE FLAYED BLOODBOUND units have a ward of 5+ if they have been picked to fight in the same phase.`,
        when: [WARDS_PHASE],
      },
    ],
  },

  'Baleful Lords': {
    effects: [
      {
        name: `Unbound Slaughter`,
        desc: `While a friendly BALEFUL LORDS BLOODTHIRSTER, other than SKARBRAND, is wholly within 8" of any other friendly BALEFUL LORDS BLOODTHIRSTERS, other than SKARBRAND, use the top row on its damage table regardless of how many wounds it has suffered.`,
        when: [DURING_GAME],
      },
    ],
  },
} satisfies TItemDescriptions

export default Flavors

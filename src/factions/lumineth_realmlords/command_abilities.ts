import { tagAs } from 'factions/metatagger'
import {
  COMBAT_PHASE,
  DURING_GAME,
  END_OF_COMBAT_PHASE,
  START_OF_BATTLESHOCK_PHASE,
  START_OF_COMBAT_PHASE,
} from 'types/phases'

// Store Command Abilities here. You can add them to units, abilties, flavors, and subfactions later.
const CommandAbilities = {
  'Redoubled Force': {
    effects: [
      {
        name: `Redoubled Force`,
        desc: `Pick 1 YMETRICA ALARITH unit that has forced an enemy unit to move using the Tectonic Force battle trait for the first time in that phase and that is wholly within 18" of a friendly YMETRICA HERO. You can use Tectonic Force a second time by picking 1 other enemy unit within 1" of that friendly unit.`,
        when: [END_OF_COMBAT_PHASE],
      },
    ],
  },
  'Deplete Reserves': {
    effects: [
      {
        name: `Deplete Reserves`,
        desc: `You can use this command ability when a friendly SYAR unit could use an aetherquartz reserve ability, even if any friendly SYAR units have already done so in that phase. Pick 1 friendly SYAR unit that has any aetherquartz reserves and is wholly within 18" of a friendly SYAR HERO. That unit can use one of its aetherquartz reserves.`,
        when: [DURING_GAME],
      },
    ],
  },
  'Unflinching Valour': {
    effects: [
      {
        name: `Unflinching Valour`,
        desc: `You can use this command ability at the start of the battleshock phase. If you do so, pick 1 friendly model with this command ability. Until the end of that phase, all friendly LUMINETH REALM-LORDS units wholly within 24" of that model are treated as having a Bravery characteristic of 10.`,
        when: [START_OF_BATTLESHOCK_PHASE],
      },
    ],
  },
  'Faith of the Mountains': {
    effects: [
      {
        name: `Faith of the Mountains`,
        desc: `Pick 1 ALARITH AELF unit wholly within 18" of a friendly model with this command ability. Add 1 to the Attacks characteristic for melee weapons for the unit affected in that combat phase. Units cannot benefit more than once per combat phase from this ability. Additionally, they cannot benefit from Faith of the Mountains and Unshakeable Faith of the Mountains in the same phase.`,
        when: [START_OF_COMBAT_PHASE, COMBAT_PHASE],
      },
    ],
  },
  'Unshakeable Faith of the Mountains': {
    effects: [
      {
        name: `Unshakeable Faith of the Mountains`,
        desc: `Pick D3 ALARITH AELF units wholly within 24" of a friendly model with this command ability. Add 1 to the Attacks characteristic for melee weapons for the units affected in that combat phase. Units cannot benefit more than once per combat phase from this ability. Additionally, they cannot benefit from Faith of the Mountains and Unshakeable Faith of the Mountains in the same phase.`,
        when: [START_OF_COMBAT_PHASE, COMBAT_PHASE],
      },
    ],
  },
}

// Always export using tagAs
export default tagAs(CommandAbilities, 'command_ability')

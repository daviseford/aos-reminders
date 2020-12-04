import { tagAs } from 'factions/metatagger'
import {
  CHARGE_PHASE,
  END_OF_HERO_PHASE,
  END_OF_MOVEMENT_PHASE,
  TURN_ONE_BATTLESHOCK_PHASE,
} from 'types/phases'

const BattleTraits = {
  // Battle traits are effects that are always active, and don't fall in a specific category
  //    (i.e. these are not artifacts, spells, command_traits, etc.)
  'Sample Army Default Battle Traits': {
    effects: [
      {
        name: `A Battle Trait`,
        desc: `do some stuff`,
        when: [END_OF_HERO_PHASE],
      },
      {
        name: `A Second Battle Trait`,
        desc: `do some more stuff`,
        when: [TURN_ONE_BATTLESHOCK_PHASE],
      },
    ],
  },
  // Let's say that our second subfaction enables some more battle traits
  // We would group them here, and then access them in subfactions.ts using keyPicker
  'SubFaction 2 Battle Traits': {
    effects: [
      {
        name: `A Subfaction2 Battle Trait`,
        desc: `do some stuff`,
        when: [END_OF_MOVEMENT_PHASE],
      },
      {
        name: `A Subfaction2 Second Battle Trait`,
        desc: `do some more stuff`,
        when: [CHARGE_PHASE],
      },
    ],
  },
}

// Always export using tagAs
export default tagAs(BattleTraits, 'battle_trait')

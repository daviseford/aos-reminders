import { tagAs } from 'factions/metatagger'
import { LETHISIAN_DEFENDERS } from 'meta/factions'
import { BATTLESHOCK_PHASE, CHARGE_PHASE, COMBAT_PHASE, MOVEMENT_PHASE } from 'types/phases'

const BattleTraits = {
  [LETHISIAN_DEFENDERS]: {
    effects: [
      {
        name: `Warriors of the Grand Necropolis`,
        desc: `You can reroll battleshock tests for friendly Lethisian Defender units.`,
        when: [BATTLESHOCK_PHASE],
      },
      {
        name: `Warriors of the Grand Necropolis`,
        desc: `Add 1 to hit rolls for melee weapons used by Human/Duradin Lethisian Defender units in this army that target enemy units who have made a charge move in this turn.`,
        when: [COMBAT_PHASE],
      },
      {
        name: `Akhelian Phalanx`,
        desc: `Add 1 to the move characterstic of Akhelian Lethisian Defender units.`,
        when: [MOVEMENT_PHASE],
      },
      {
        name: `Akhelian Phalanx`,
        desc: `Add 1 to the charge rolls of Akhelian Lethisian Defender units.`,
        when: [CHARGE_PHASE],
      },
    ],
  },
}

// Always export using tagAs
export default tagAs(BattleTraits, 'battle_trait')

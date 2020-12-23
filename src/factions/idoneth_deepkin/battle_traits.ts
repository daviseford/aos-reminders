import { tagAs } from 'factions/metatagger'
import { DURING_GAME, SHOOTING_PHASE } from 'types/phases'

const BattleTraits = {
  'Idoneth Deepkin': {
    effects: [
      {
        name: `Forgotten Nightmares`,
        desc: `Missile weapons can only be used to target an IDONETH DEEPKIN unit with this battle trait if it is the closest visible enemy unit.`,
        when: [SHOOTING_PHASE],
      },
      {
        name: `Tides of Death`,
        desc: `Idoneth Deepkin units with this battle trait have a different Tides of Death ability each round, as outlined below.

          Round 1 - Low Tide: In this battle round, all units with the Tides of Death battle trait are treated as being in cover.

          Round 2 - Flood Tide: In this battle round, all units with the Tides of Death battle trait that run can still either shoot or charge in the same turn (but not both).

          Round 3 - High Tide: In this battle round, units with the Tides of Death battle trait fight at the start of the combat phase.

          Round 4 - Ebb Tide: In this battle round, all units with the Tides of Death battle trait that retreat can still either shoot or charge in the same turn (but not both).

          Round 5+ - Repeat starting with Low Tide`,
        when: [DURING_GAME],
      },
    ],
  },
}

export default tagAs(BattleTraits, 'battle_trait')

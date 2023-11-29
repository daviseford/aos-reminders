import { TItemDescriptions } from 'factions/factionTypes'
import { tagAs } from 'factions/metatagger'
import { IDONETH_DEEPKIN } from 'meta/factions'
import { DURING_GAME, SHOOTING_PHASE, TURN_ONE_START_OF_TURN } from 'types/phases'

const BattleTraits = {
  [IDONETH_DEEPKIN]: {
    effects: [
      {
        name: `Forgotten Nightmares`,
        desc: `Friendly IDONETH DEEPKIN units can only be picked as the target of a shooting attack if they are the closest eligible target to the attacking model.`,
        when: [SHOOTING_PHASE],
      },
      {
        name: `Tides of Death`,
        desc: `A different Tides of Death ability applies to your army in each battle round, as shown on the Tides of Death table below.

          Round 1 - Low Tide: In this battle round, friendly IDONETH DEEPKIN units are treated as being in cover.

          Round 2 - Flood Tide: In this battle round, friendly IDONETH DEEPKIN units can run and still shoot or charge in the same turn.

          Round 3 - High Tide: In this battle round, the strike-first effect (core rules, 12.4) applies to friendly IDONETH DEEPKIN units.

          Round 4 - Ebb Tide: In this battle round, friendly IDONETH DEEPKIN units can retreat and still shoot or charge in the same turn.

          Round 5+ - Repeat the four Tides of Death steps, starting with Low Tide.`,
        when: [DURING_GAME],
      },
      {
        name: `Isharran Rituals`,
        desc: `In the first battle round, after the players have received their starting command points but before the start of the first turn, if your army includes any ISHARANN units, you can pick 1 of the following Isharann rituals to influence the ethersea during the battle.

          Ritual of the Creeping Mist: Friendly IDONETH DEEPKIN units that are affected by the Low Tide ability cannot be picked as the target of a shooting attack unless the attacking model is within 12" of that unit.

          Ritual of the Surging Stream: Add 1 to run rolls and charge rolls for friendly IDONETH DEEPKIN units that are affected by the Flood Tide ability.

          Ritual of Deep-sight: Friendly NAMARTI units that are affected by the High Tide ability have a ward of 5+.

          Ritual of the Spiteful Riptide: Before a friendly IDONETH DEEPKIN unit that is affected by the Ebb Tide ability retreats, roll a for each enemy unit within 3" of that unit. on a 4+, that enemy unit suffers D3 mortal wounds.`,
        when: [TURN_ONE_START_OF_TURN],
      },
    ],
  },
} satisfies TItemDescriptions

export default tagAs(BattleTraits, 'battle_trait')

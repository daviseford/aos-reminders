import { tagAs } from 'factions/metatagger'
import { IDONETH_DEEPKIN } from 'meta/factions'
import { DURING_GAME, SHOOTING_PHASE, START_OF_HERO_PHASE, TURN_ONE_START_OF_TURN } from 'types/phases'

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

  'Battle Tactics': {
    effects: [
      {
        name: `Assassins of the High Tide`,
        desc: `You complete this battle tactic if 2 or more enemy units are destroyed during this turn by attacks made by friendly IDONETH DEEPKIN units that are affected by the High Tide ability.`,
        when: [START_OF_HERO_PHASE],
      },
      {
        name: `Predators of the Deep`,
        desc: `Pick 1 unit in your that has a Wounds characteristic of 8 or more and that has 0 wounds allocated to it. You complete this tactic if that unit is destroyed during this turn by a friendly AKHELIAN ALLOPEXES unit.`,
        when: [START_OF_HERO_PHASE],
      },
      {
        name: `Revenge of the Namarti`,
        desc: `You complete this battle tactic if an enemy HERO or MONSTER is destroyed during this turn by an attack made by a friendly NAMARTI unit.`,
        when: [START_OF_HERO_PHASE],
      },
      {
        name: `Deny Trespassers`,
        desc: `Pick 1 Gloomtide Shipwreck in your army that is within 12" of any enemy units. You complete this battle tactic if that Gloomtide Shipwreck is more than 12" from all enemy units at the end of this turn.`,
        when: [START_OF_HERO_PHASE],
      },
      {
        name: `Trapped in the Undercurrents`,
        desc: `You complete this battle tactic if 3 or more friendly IDONETH DEEPKIN units retreated and made a charge move during this turn.`,
        when: [START_OF_HERO_PHASE],
      },
      {
        name: `Isharann Defiance`,
        desc: `When you reveal this battle tactic, pick 1 objective wholly within enemy territory. At the end of this turn, you complete this battle tactic if you control that objective and there is a friendly ISHARANN unit within 6" of that objective.`,
        when: [START_OF_HERO_PHASE],
      },
    ],
  },
}

export default tagAs(BattleTraits, 'battle_trait')

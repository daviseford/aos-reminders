import { tagAs } from 'factions/metatagger'
import { BATTLESHOCK_PHASE, COMBAT_PHASE, START_OF_GAME, WOUND_ALLOCATION_PHASE } from 'types/phases'

const BonesplitterzBattleTraits = {
  Warpaint: {
    effects: [
      {
        name: `Warpaint`,
        desc: `When a model in this army is allocated a wound or mortal wound roll a D6. On a 6+, that wound or mortal wound is negated.`,
        when: [WOUND_ALLOCATION_PHASE],
      },
    ],
  },
  'Monster Hunters': {
    effects: [
      {
        name: `Monster Hunters`,
        desc: `If a Bonesplitterz unit is chosen to make its attacks and it is within 3" of an enemy MONSTER, you can choose one of the benefits below before piling in.

      - Wild Abandon: The unit can pile in 6" this phase.
      - Stab! Stab! Stab!: Add 1 to hit rolls for attacks against a MONSTER this phase.
      - Berserk Strength: Each time a model in this unit rolls an unmodified wound roll of 6 against a MONSTER, the MONSTER suffers a mortal wound in addition to the normal damage.`,
        when: [COMBAT_PHASE],
      },
    ],
  },
  'Spirit of the Beast': {
    effects: [
      {
        name: `Spirit of the Beast`,
        desc: `Do not take Battleshock tests for a Bonesplitterz unit if any enemy MONSTERS were slain by that unit in the same turn.`,
        when: [BATTLESHOCK_PHASE],
      },
    ],
  },
  'Tireless Trackers': {
    effects: [
      {
        name: `Tireless Trackers`,
        desc: `After armies are set up, but before the first battle round begins, half the Bonesplitterz units in a Bonesplitterz army (rounding up) can move up to 5". If both players can move units before the first battle round begins, they must roll-off, and the winner chooses who moves their units first.`,
        when: [START_OF_GAME],
      },
    ],
  },
}

// Always export using tagAs
export default tagAs(BonesplitterzBattleTraits, 'battle_trait')

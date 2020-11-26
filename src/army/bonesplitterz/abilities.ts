import { TAbilities } from 'types/army'
import {
  BATTLESHOCK_PHASE,
  COMBAT_PHASE,
  START_OF_COMBAT_PHASE,
  START_OF_GAME,
  WOUND_ALLOCATION_PHASE,
} from 'types/phases'

// General Allegiance Abilities (always active regardless of army composition)
const Abilities: TAbilities = [
  {
    name: `Warpaint`,
    desc: `When a model in this army is allocated a wound or mortal wound roll a D6. On a 6+, that wound or mortal wound is negated.`,
    when: [WOUND_ALLOCATION_PHASE],
  },
  {
    name: `Monster Hunters`,
    desc: `If a Bonesplitterz unit is chosen to make its attacks and it is within 3" of an enemy MONSTER, you can choose one of the benefits below before piling in.

      - Wild Abandon: The unit can pile in 6" this phase.
      - Stab! Stab! Stab!: Add 1 to hit rolls for attacks against a MONSTER this phase.
      - Berserk Strength: Each time a model in this unit rolls an unmodified wound roll of 6 against a MONSTER, the MONSTER suffers a mortal wound in addition to the normal damage.`,
    when: [COMBAT_PHASE],
  },
  {
    name: `Spirit of the Beast`,
    desc: `Do not take Battleshock tests for a Bonesplitterz unit if any enemy MONSTERS were slain by that unit in the same turn.`,
    when: [BATTLESHOCK_PHASE],
  },
  {
    name: `Tireless Trackers`,
    desc: `After armies are set up, but before the first battle round begins, half the Bonesplitterz units in a Bonesplitterz army (rounding up) can move up to 5". If both players can move units before the first battle round begins, they must roll-off, and the winner chooses who moves their units first.`,
    when: [START_OF_GAME],
  },
  {
    name: `Bonesplitterz Waaagh!`,
    desc: `You can use this command ability once per battle at the start of your combat phase if your general is still alive. Roll a D6 and add the number of friendly Bonesplitterz units wholly within 18" of your general to the roll. On an 11 or lower all friendly Bonesplitterz units wholly within range of the general get +1 to their attacks, if the roll is 12 or more then add +2 to their attacks instead.`,
    when: [START_OF_COMBAT_PHASE],
    command_ability: true,
  },
]

export default Abilities

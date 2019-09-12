import { COMBAT_PHASE, DURING_GAME } from 'types/phases'
import { TAbilities } from 'types/army'

// General Allegiance Abilities (always active regardless of army composition)
const Abilities: TAbilities = [
  {
    name: `Warpaint`,
    desc: `When making a save roll for a Bonespitterz model, a dice result of 6 (before modifers) is always a successful save. When you take a mortal wound, roll a dice. On a 6+ that mortal wound is ignored.`,
    when: [DURING_GAME],
  },
  {
    name: `Monster Hunters`,
    desc: `If a Bonesplitterz unit kills a Monster in the combat phase then that unit does not need to take a battleshock test until your next hero phase.

      If a Bonesplitterz unit is chosen to make it's attacks and it is within 3" of an enemy Monster, roll a dice before piling in.

      1-2: Wild Abandon: The unit can pile in 6" this phase.
      3-4: Stab! Stab! Stab!: You can reroll any failed wound rolls for models in the unit that direct their attacks against a monster this phase.
      5-6: Berserk Strength: Each time a model in this unit rolls a wound roll of 6+ against a monster, the monster suffers a mortal wound in addtion to the normal damage.`,
    when: [COMBAT_PHASE],
  },
]

export default Abilities

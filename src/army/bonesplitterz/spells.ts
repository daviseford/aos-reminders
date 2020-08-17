import { TSpells } from 'types/army'
import { COMBAT_PHASE, HERO_PHASE } from 'types/phases'

// Spells, Prayers, etc. go here
const Spells: TSpells = [
  {
    name: `Squiggly Curse`,
    effects: [
      {
        name: `Squiggly Curse`,
        desc: `Casting value of 6. Select a HERO within 3" and it suffers D3 mortal wounds. If you rolled a double to cast it then suffers D6 mortal wounds instead.

        If a model is slain by Squiggly Curse, you can add 1 to any further casting attempts made by the caster during the battle.`,
        when: [HERO_PHASE],
      },
    ],
  },
  {
    name: `Breath of Gorkamorka`,
    effects: [
      {
        name: `Breath of Gorkamorka`,
        desc: `Casting value of 6. Pick a Bonesplitterz unit within 24", that unit doubles how far it can move and can fly in your next movement phase. If casting roll was a double, triple how far the unit can move instead.`,
        when: [HERO_PHASE],
      },
    ],
  },
  {
    name: `Brutal Beast Spirits`,
    effects: [
      {
        name: `Brutal Beast Spirits`,
        desc: `Casting value of 6. Pick a Bonesplitterz unit wholly within 24". Until your next hero phase, you can add 1 to all run, charge, and hit rolls made for that unit. If the casting roll was a double, you can select 2 different friendly Bonesplitterz units wholly within 24" of the caster to be affected by this spell instead of 1.`,
        when: [HERO_PHASE],
      },
    ],
  },
  {
    name: `Bone Krusha`,
    effects: [
      {
        name: `Bone Krusha`,
        desc: `Casting value of 6. Pick an enemy unit within 24" that is visible to the caster.

          If target is within 6": Deal D6 mortal wounds.

          6" to 12" away: Deal D3 mortal wounds.

          More than 12" away: Deal 1 mortal wound.`,
        when: [HERO_PHASE],
      },
    ],
  },
  {
    name: `Kunnin' Beast Spirits`,
    effects: [
      {
        name: `Kunnin' Beast Spirits`,
        desc: `Casting value of 6. Pick a unit wholly within 24". Add 1 to save rolls for that unit until your next hero phase.`,
        when: [HERO_PHASE, COMBAT_PHASE],
      },
    ],
  },
  {
    name: `Gorkamorka's War Cry`,
    effects: [
      {
        name: `Gorkamorka's War Cry`,
        desc: `Casting value of 7. Pick 1 enemy unit within 18", that unit suffers D3 mortal wounds and must fight at the end of the combat phase in the next combat.`,
        when: [HERO_PHASE],
      },
    ],
  },
]

export default Spells

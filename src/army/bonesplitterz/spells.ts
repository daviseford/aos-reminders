import { COMBAT_PHASE, HERO_PHASE } from 'types/phases'
import { TSpells } from 'types/army'

// Spells, Prayers, etc. go here
const Spells: TSpells = [
  {
    name: `Squiggly Curse`,
    effects: [
      {
        name: `Squiggly Curse`,
        desc: `Casting Value 6. Select a Hero or Monster within 20" and roll a dice. On a 1, the unit suffers a Mortal Wound, on a 2-5 it suffers D3 Mortal Wounds, and on a 6 it sufferes D6 Mortal Wounds. If casting roll was a double and the spell was cast, the target suffers an additional D3 mortal wounds.

        If a model is slain by Squiggly Curse, you can add 1 to any further casting attempts made by the caster during the battle.`,
        when: [HERO_PHASE],
      },
    ],
  },
  {
    name: `Hand of Gork (or Mork)`,
    effects: [
      {
        name: `Hand of Gork (or Mork)`,
        desc: `Casting Value 6. Pick a Bonesplitterz unit, that unit doubles how far it can move and can fly in your next movement phase. If casting roll was a double, triple how far the unit can move instead.`,
        when: [HERO_PHASE],
      },
    ],
  },
  {
    name: `Brutal Beast Spirits`,
    effects: [
      {
        name: `Brutal Beast Spirits`,
        desc: `Casting Value 6. Pick a Bonesplitterz unit within 18". Until your next hero phase, you can add 1 to all run, charge, and hit rolls made for that unit. If casting roll was a double you can effect 2 units instead.`,
        when: [HERO_PHASE],
      },
    ],
  },
  {
    name: `Bone Krusha`,
    effects: [
      {
        name: `Bone Krusha`,
        desc: `Casting Value 6. Pick an enemy unit within 24" that is visible to the caster.

          If target is within 6": Deal D6 mortal wounds.

          6" to 12" away: Deal D3 mortal wounds.

          More than 12" away: Deal 1 mortal wound.

          If the casting roll was a double, then double the number of mortal wounds inflicted. The caster then also suffers D3 mortal wounds.`,
        when: [HERO_PHASE],
      },
    ],
  },
  {
    name: `Kunnin' Beast Spirits`,
    effects: [
      {
        name: `Kunnin' Beast Spirits`,
        desc: `Casting value 6. Pick a unit within 18". Unit your next hero phase, your opponent must re-roll all hit rolls of 6 or more that target the unit.`,
        when: [HERO_PHASE, COMBAT_PHASE],
      },
    ],
  },
  {
    name: `Gorkamorka's War Cry`,
    effects: [
      {
        name: `Gorkamorka's War Cry`,
        desc: `Casting value 7. Pick a unit within 18" that is visible to the caster. Roll a dice and add the caster's bravery to the result. Your opponent then rolls a dice, adding the bravery of the target unit to the result.

          If your result is equal to or higher than your opponent's result, the target suffers D3 mortal wounds. Unitl your next hero phase, that unit halves the distance it can move, run, and charge, and it cannot be chosen to make attacks until the end of the combat phase`,
        when: [HERO_PHASE],
      },
    ],
  },
]

export default Spells

import { TBattalions, TUnits } from '../../types/army'
import { HERO_PHASE, DURING_GAME } from '../../types/phases'

// Unit Names
export const Units: TUnits = [
  {
    name: `Warden King`,
    effects: [
      {
        name: `Ancestor Shield`,
        desc: `You can re-roll all failed saves for a Warden King.`,
        when: [DURING_GAME],
      },
      {
        name: `Oath Stone`,
        desc: `In the hero phase, a Warden King can stand atop his oath stone to increase the resolve of his followers. If he does so, he cannot move until his next hero phase, but all DISPOSSESSED units from your army within 18" in the battleshock phase may use the Warden King’s Bravery instead of their own.`,
        when: [HERO_PHASE],
      },
      {
        name: `Ancestral Grudge`,
        desc: `If a Warden King uses this ability, pick one enemy unit within 16". Until your next hero phase, you can add 1 to wound rolls for all attacks made by DISPOSSESSED models that target that unit.`,
        // Doesn't state HERO_PHASE specifically, potentially could be DURING_GAME?
        when: [HERO_PHASE],
        command: true,
      },
    ],
  },
  {
    name: `Runelord`,
    effects: [
      {
        name: `Runes of Spellbreaking`,
        desc: `A Runelord can attempt to unbind one enemy spell in the enemy hero phase as if he were a wizard. You can add 2 to any unbinding rolls for a Runelord.`,
        when: [HERO_PHASE],
      },
      {
        name: `Rune Lore`,
        desc: `In your hero phase a Runelord can pray to the Ancestor Gods to imbue his allies’ weapons and armour with power. If he does so, pick a DISPOSSESSED unit within 16", select a power and roll a dice; on a 1 the Runelord has failed and nothing happens. On a roll of 2 or more the runes hammered into his allies’ wargear glow white-hot with rune magic and the power takes effect.
        
        Ancestral Shield: Until your next hero phase, you can roll a dice whenever a model in this unit suffers a wound or a mortal wound. On a 6, that wound or mortal wound is ignored. 
        
        Forgefire: Until your next hero phase, increase the Rend characteristics of the unit’s weapons by 1 (i.e. ‘-’ becomes -1, -1 becomes -2 and so on).
        `,
        when: [HERO_PHASE],
      },
    ],
  },
  {
    name: `Unforged`,
    effects: [
      {
        name: ``,
        desc: ``,
        when: [HERO_PHASE],
      },
    ],
  },
  {
    name: `Hammerers`,
    effects: [
      {
        name: ``,
        desc: ``,
        when: [HERO_PHASE],
      },
    ],
  },
  {
    name: `Ironbreakers`,
    effects: [
      {
        name: ``,
        desc: ``,
        when: [HERO_PHASE],
      },
    ],
  },
  {
    name: `Irondrakes`,
    effects: [
      {
        name: ``,
        desc: ``,
        when: [HERO_PHASE],
      },
    ],
  },
  {
    name: `Longbeards`,
    effects: [
      {
        name: ``,
        desc: ``,
        when: [HERO_PHASE],
      },
    ],
  },
  {
    name: `Quarrellers`,
    effects: [
      {
        name: ``,
        desc: ``,
        when: [HERO_PHASE],
      },
    ],
  },
  {
    name: `Thunderers`,
    effects: [
      {
        name: ``,
        desc: ``,
        when: [HERO_PHASE],
      },
    ],
  },
  {
    name: `Warriors`,
    effects: [
      {
        name: ``,
        desc: ``,
        when: [HERO_PHASE],
      },
    ],
  },
]

// Battalions
export const Battalions: TBattalions = [
  {
    name: `Grudgebound War Throng`,
    effects: [
      {
        name: ``,
        desc: ``,
        when: [HERO_PHASE],
      },
    ],
  },
]

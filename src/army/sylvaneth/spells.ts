import { HERO_PHASE } from 'types/phases'
import { TSpells } from 'types/army'

const Spells: TSpells = [
  {
    name: `Verdant Blessing`,
    effects: [
      {
        name: `Verdant Blessing`,
        desc: `Casting value of 6. If successfully cast, set up 1 AWAKENED WYLDWOOD wholly within 24" of the caster and more than 1" from any other model, terrain feature or objective.`,
        when: [HERO_PHASE],
      },
    ],
  },
  // Lore of the Deepwood
  {
    name: `Throne of Vines`,
    effects: [
      {
        name: `Throne of Vines`,
        desc: `Casting value of 5. If successfully cast, add 2 to casting rolls for the caster until the caster makes a move or is set up in a different location.`,
        when: [HERO_PHASE],
      },
    ],
  },
  {
    name: `Regrowth`,
    effects: [
      {
        name: `Regrowth`,
        desc: `Casting value of 5. If successfully cast, pick 1 friendly SYLVANETH unit wholly within 18" of the caster and visible to them. You can heal up to D6 wounds allocated to that unit.`,
        when: [HERO_PHASE],
      },
    ],
  },
  {
    name: `The Dwellers Below`,
    effects: [
      {
        name: `The Dwellers Below`,
        desc: `Casting value of 7. If successfully cast, pick 1 enemy unit within 10" of the caster and visible to them and roll a number of dice equal to the number of models in that unit. For each 6+ that unit suffers 1 mortal wound.`,
        when: [HERO_PHASE],
      },
    ],
  },
  {
    name: `Deadly Harvest`,
    effects: [
      {
        name: `Deadly Harvest`,
        desc: `Casting value of 6. If successfully cast, each enemy unit within 3" of the caster suffers D3 mortal wounds (roll separately for each unit).`,
        when: [HERO_PHASE],
      },
    ],
  },
  {
    name: `Verdurous Harmony`,
    effects: [
      {
        name: `Verdurous Harmony`,
        desc: `Casting value of 7. If successfully cast, pick 1 friendly SYLVANETH unit wholly within 18" of the caster and visible to them. You can return 1 slain model to that unit. If you picked a unit of DRYADS, TREE-REVENANTS or SPITE-REVENANTS, you can return up to D3 slain models to that unit instead of 1.`,
        when: [HERO_PHASE],
      },
    ],
  },
  {
    name: `Treesong`,
    effects: [
      {
        name: `Treesong`,
        desc: `Casting value of 7. If successfully cast, pick 1 enemy unit within 16" of the caster and within 6" of an AWAKENED WYLDWOOD. Until the end of the turn, you can re-roll hit and wound rolls of 1 for attacks made with melee weapons that target that unit.`,
        when: [HERO_PHASE],
      },
    ],
  },
]

export default Spells

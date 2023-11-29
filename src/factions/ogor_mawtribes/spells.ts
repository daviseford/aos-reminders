import { TItemDescriptions } from 'factions/factionTypes'
import { tagAs } from 'factions/metatagger'
import meta_rule_sources from 'meta/rule_sources'
import { COMBAT_PHASE, HERO_PHASE, WOUND_ALLOCATION_PHASE } from 'types/phases'

const Spells = {
  //BUTCHER SPELLS
  'Blood Feast': {
    effects: [
      {
        name: `Blood Feast`,
        desc: `Casting value of 7 and a range of 18". Pick 1 friendly OGOR unit that is not a MONSTER and that is wholly within 18" of the caster and visible to them. Add 1 to the Attacks characteristic of that unit's melee weapons until the start of your next hero phase.`,
        when: [HERO_PHASE],
      },
    ],
  },
  'Blubbergrub Stench': {
    effects: [
      {
        name: `Blubbergrub Stench`,
        desc: `Casting value of 5 and a range of 18". Until the start of your next hero phase, while they are wholly within range of the caster, friendly RHINOX units are treated as MONSTERS for the purposes of the Trampling Charge battle trait; contesting objectives; and carrying out monstrous rampages.`,
        when: [HERO_PHASE],
      },
    ],
  },
  'Molten Entrails': {
    effects: [
      {
        name: `Molten Entrails`,
        desc: `Casting value of 5. Pick 1 friendly OGOR MAWTRIBES MONSTER wholly within 18" of the caster that is visible to them. Until the start of your next hero phase, add 1 to the Damage characteristic of the melee weapons used by that MONSTER'S mount.`,
        when: [HERO_PHASE],
      },
      {
        name: `Molten Entrails`,
        desc: `If active, add 1 to the Damage characteristic of the melee weapons used by that MONSTER'S mount.`,
        when: [COMBAT_PHASE],
      },
    ],
  },
  'Greasy Deluge': {
    effects: [
      {
        name: `Greasy Deluge`,
        desc: `Casting value of 6. Pick 1 enemy unit within 18" of the caster that is visible to them. Subtract 1 from hit rolls for attacks made by that unit until the start of your next hero phase.`,
        when: [HERO_PHASE],
      },
    ],
  },
  //FIREBELLY SPELLS
  'Fiery Whirlwind': {
    effects: [
      {
        name: `Fiery Whirlwind`,
        desc: `Casting value of 6. Pick one enemy unit and roll 1 dice for each model in that unit that is within 12" of the caster and visible to them. For each 4+, that unit suffers 1 mortal wound. If that unit only has 1 model, roll 3 dice instead of 1.`,
        when: [HERO_PHASE],
      },
    ],
  },
  'Billowing Ash': {
    effects: [
      {
        name: `Billowing Ash`,
        desc: `Casting value of 6. Until the start of your next hero phase, subtract 1 from hit rolls for attacks that target friendly units wholly within 12" of the caster.`,
        when: [HERO_PHASE],
      },
    ],
  },
  'Tongues of Flame': {
    effects: [
      {
        name: `Tongues of Flame`,
        desc: `Casting value of 6. Pick 1 enemy unit that has 5 or more models that are within 18" of the caster and visible to them. Until the start of your next hero phase, each time that unit finishes a move, it suffers D3 mortal wounds.`,
        when: [HERO_PHASE],
      },
    ],
  },

  //UNIT SPELLS
  'Voracious Maw': {
    effects: [
      {
        name: `Voracious Maw`,
        desc: `Casting value of 7. Pick 1 enemy unit within 18" of the caster that is visible to them. That unit suffers D3 mortal wounds. After resolving any damage, roll a D6. On a 1, 2 or 3, the maw is said to be satisfied and the spell ends. On a 4+, the target unit suffers D3 additional mortal wounds. Keep repeating this process until the maw is satisfied or the target unit is destroyed.`,
        when: [HERO_PHASE],
      },
    ],
  },

  'Cascading Fire-cloak': {
    effects: [
      {
        name: `Cascading Fire-cloak`,
        desc: `Casting value of 5. Roll 1 dice for each enemy unit within 3" of the caster. On a 4+, that enemy unit suffers D3 mortal wounds. In addition, if this spell is successfully cast, this unit has a ward of 5+ until the start of your next hero phase.`,
        when: [HERO_PHASE],
      },
      {
        name: `Cascading Fire-cloak`,
        desc: `If active, this unit has a ward of 5+ until the start of your next hero phase.`,
        when: [WOUND_ALLOCATION_PHASE],
      },
    ],
  },

  Rockchomper: {
    effects: [
      {
        name: `Rockchomper`,
        desc: `Casting value of 5. Pick 1 friendly unit of Ogor Gluttons wholly within 18" of the caster that is visible to them. Until the start of your next hero phase, rolls made for the Gulping Bite batlle trait cause D6 mortal wounds on a 4+ instead of D3.`,
        when: [HERO_PHASE],
      },
    ],
  },

  // The Roving Maw
  Mawmeat: {
    effects: [
      {
        name: `Mawmeat`,
        desc: `Casting value of 6 and a range of 18". Pick 1 terrain feature within range and visible to the caster. For the rest of the battle, units on or within 1" of that terrain feature are vulnerable to Mawpits.`,
        when: [HERO_PHASE],
        rule_sources: [meta_rule_sources.BOOK_DAWNBRINGERS_BOOK_3],
      },
    ],
  },
  Retcher: {
    effects: [
      {
        name: `Retcher`,
        desc: `Casting value of 7. If successfully cast, until your next hero phase, improve the Rend characteristic of melee weapons used by the caster by 2.`,
        when: [HERO_PHASE],
        rule_sources: [meta_rule_sources.BOOK_DAWNBRINGERS_BOOK_3],
      },
    ],
  },
  'Offal Bringer': {
    effects: [
      {
        name: `Offal Bringer`,
        desc: `Casting value of 6 and a range of 12". Pick 1 enemy unit within range and visible to the caster. Your opponent must make a move of up to 6" with that unit. All of the models in that unit must finish that move as close as possible to the caster and can finish that move within 3" of the caster. If it is impossible for that unit to make the move, it suffers D3 mortal wounds instead. After that unit has moved, if that unit is within 3" of the caster and the caster is within 6" of a Mawpit in your army, you can immediately use the Mawpit's Head Butcher ability, but you must pick that enemy unit to be the target.`,
        when: [HERO_PHASE],
        rule_sources: [meta_rule_sources.BOOK_DAWNBRINGERS_BOOK_3],
      },
    ],
  },
} satisfies TItemDescriptions

export default tagAs(Spells, 'spell')

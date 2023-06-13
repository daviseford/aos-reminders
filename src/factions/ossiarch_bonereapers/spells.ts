import { tagAs } from 'factions/metatagger'
import { HERO_PHASE } from 'types/phases'

const Spells = {
  'Empower Nadirite Weapons': {
    effects: [
      {
        name: `Empower Nadirite Weapons`,
        desc: `Casting value of 5 and a range of 24". Pick 1 friendly OSSIARCH BONEREAPERS unit wholly within range and visible to the caster. Until the start of your next hero phase, the Nadirite Weapons battle trait triggers on an unmodified hit roll of 5+ instead of 6 for that unit.`,
        when: [HERO_PHASE],
      },
    ],
  },
  'Protection of Nagash': {
    effects: [
      {
        name: `Protection of Nagash`,
        desc: `Casting value of 6. If successfully cast, at the end of any phase, if any wounds or mortal wounds were allocated to the caster in that phase from an attack made with a melee weapon and the caster was not slain, remove them from the battlefield and set them up again on the battlefield more than 9" from all enemy units. After setting up the caster, this spell is unbound.`,
        when: [HERO_PHASE],
      },
    ],
  },
  'Reinforce Constructs': {
    effects: [
      {
        name: `Reinforce Constructs`,
        desc: `Casting value of 5 and a range of 18". Pick 1 friendly OSSIARCH BONEREAPERS unit wholly within range and visible to the caster. Until your next hero phase, that unit has a ward of 4+ against mortal wounds.`,
        when: [HERO_PHASE],
      },
    ],
  },
  'Drain Vitality': {
    effects: [
      {
        name: `Drain Vitality`,
        desc: `Casting value of 6 and a range of 18". Pick 1 enemy unit within range and visible to the caster. Until your next hero phase, subtract 1 from hit rolls for attacks made by that unit and subtract 1 from save rolls for attacks that target that unit.`,
        when: [HERO_PHASE],
      },
    ],
  },
  'Mortal Contract': {
    effects: [
      {
        name: `Mortal Contract`,
        desc: `Casting value of 7 and a range of 18". Pick 1 enemy unit within range and visible to the caster. For the rest of the battle, roll a dice at the end of each phase in which any attacks made by that unit inflicted any damage on a friendly OSSIARCH BONEREAPERS unit. On a 3+, that enemy unit suffers D3 mortal wounds. You cannot pick the same enemy unit to be affected by this spell more than once per battle.`,
        when: [HERO_PHASE],
      },
    ],
  },
  'Soul Release': {
    effects: [
      {
        name: `Soul Release`,
        desc: `Casting value of 5. If successfully cast, until your next hero phase, enemy reserve units and enemy summoned units (core rules, 3.1) cannot be set up within 12" of the caster. The range of this spell must be measured from the caster, even if an ability would allow you to measure it from elsewhere.`,
        when: [HERO_PHASE],
      },
    ],
  },
  'Mortal Touch': {
    effects: [
      {
        name: `Mortal Touch`,
        desc: `Casting value of 7 and a range of 1". Pick 1 enemy model within range and visible to the caster and roll a dice. On a 4+, that model is slain. The range of this spell cannot be modified and must be measured from the caster, even if an ability would allow you to measure it from elsewhere.`,
        when: [HERO_PHASE],
      },
    ],
  },
  'Soul-guide': {
    effects: [
      {
        name: `Soul-guide`,
        desc: `Soul-guide is a spell that has a casting value of 6 and a range of 24". Pick 1 friendly MORTEK GUARD or KAVALOS DEATHRIDERS unit wholly within range and visible to the caster. Add 1 to wound rolls for attacks made with melee weapons by that unit until your next hero phase.`,
        when: [HERO_PHASE],
      },
    ],
  },
  'Soul-blast': {
    effects: [
      {
        name: `Soul-blast`,
        desc: `Soul-blast is a spell that has a casting value of 6 and a range of 12". If successfully cast, at the start of any 1 phase before your next hero phase, you can pick 1 enemy unit within range and visible to the caster. That unit suffers D3 mortal wounds. If that unit is within 3" of the caster, it suffers 3 mortal wounds instead of D3.`,
        when: [HERO_PHASE],
      },
    ],
  },
  'Shard-storm': {
    effects: [
      {
        name: `Shard-storm`,
        desc: `Shard-storm is a spell that has a casting value of 5 and a range of 18". Pick 1 enemy unit within range and visible to the caster and roll a number of dice equal to the number of models in that unit. For each 5+, that unit suffers 1 mortal wound.`,
        when: [HERO_PHASE],
      },
    ],
  },
  'Empower Ossification': {
    effects: [
      {
        name: `Empower Ossification`,
        desc: `Casting value of 5 and a range of 24". If successfully cast, the caster can pick up to 3 different friendly GOTHIZZAR HARVESTERS, MORTEK CRAWLERS or MORGHAST units in any combination that are wholly within range to benefit from the Refined Creations ability instead of 1 unit that is wholly within 12".`,
        when: [HERO_PHASE],
      },
    ],
  },
  'Dire Ultimatum': {
    effects: [
      {
        name: `Dire Ultimatum`,
        desc: `Casting value of 4 and a range of 3". Pick 1 enemy unit within range and visible to the caster. Until your next hero phase, any attacks made with melee weapons by that unit must target this unit. The range of this spell must be measured from the caster, even if an ability would allow you to measure it from elsewhere.`,
        when: [HERO_PHASE],
      },
    ],
  },
}

export default tagAs(Spells, 'spell')

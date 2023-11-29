import { TItemDescriptions } from 'factions/factionTypes'
import { tagAs } from 'factions/metatagger'
import {
  CHARGE_PHASE,
  COMBAT_PHASE,
  DURING_GAME,
  END_OF_COMBAT_PHASE,
  HERO_PHASE,
  WARDS_PHASE,
} from 'types/phases'

const Artifacts = {
  Gorecleaver: {
    effects: [
      {
        name: `Gorecleaver`,
        desc: `Pick 1 of the bearer's melee weapons. Improve the Rend characteristic of that weapon by 1. In addition, if the unmodified hit roll for an attack made with that weapon is 6, that attack causes 1 mortal wound to the target in addition to any damage it inflicts.`,
        when: [COMBAT_PHASE],
      },
    ],
  },
  'The Crimson Plate': {
    effects: [
      {
        name: `The Crimson Plate`,
        desc: `The bearer has a ward of 5+.`,
        when: [WARDS_PHASE],
      },
    ],
  },
  'Blood Rune': {
    effects: [
      {
        name: `Blood Rune`,
        desc: `At the end of the combat phase, if any wounds caused by an attack made by the bearer were allocated to a HERO or MONSTER and not negated, you receive 1 Blood Tithe point.`,
        when: [END_OF_COMBAT_PHASE],
      },
    ],
  },
  'Banner of Blood': {
    effects: [
      {
        name: `Banner of Blood`,
        desc: `BLOODSECRATOR only. You can reroll charge rolls for friendly BLADES OF KHORNE units wholly within 16" of the bearer.`,
        when: [CHARGE_PHASE],
      },
    ],
  },
  "Ar'gath, the King of Blades": {
    effects: [
      {
        name: `Ar'gath, the King of Blades`,
        desc: `Ward rolls cannot be made for enemy units while they are within 3" of the bearer.`,
        when: [WARDS_PHASE],
      },
    ],
  },
  'Mark of the Bloodreaper': {
    effects: [
      {
        name: `Mark of the Bloodreaper`,
        desc: `The bearer has a ward of 4+ against mortal wounds.`,
        when: [WARDS_PHASE],
      },
    ],
  },
  'Skullshard Mantle': {
    effects: [
      {
        name: `Skullshard Mantle`,
        desc: `Add 2 to Hatred of Sorcery rolls made for the bearer.`,
        when: [HERO_PHASE],
      },
    ],
  },
  'Halo of Blood': {
    effects: [
      {
        name: `Halo of Blood`,
        desc: `The strike-first effect applies to the bearer.`,
        when: [DURING_GAME],
      },
    ],
  },
} satisfies TItemDescriptions

export default tagAs(Artifacts, 'artifact')

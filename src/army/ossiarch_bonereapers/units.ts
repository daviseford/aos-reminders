import { TBattalions, TUnits } from 'types/army'
import { filterUnits } from 'utils/filterUtils'
import { Units as LegionsOfNagashUnits } from 'army/legions_of_nagash/units'

const getLegionsOfNagahsUnits = () => {
  const listOfUnits = [`Nagash, Supreme Lord of the Undead`, `Arkhan the Black, Mortarch of Sacrament`]
  return filterUnits(LegionsOfNagashUnits, listOfUnits)
}

// Unit Names
export const Units: TUnits = [
  ...getLegionsOfNagahsUnits(),
  {
    name: `Gothizzar Harvester`,
    effects: [
      //      {
      //       name: `TBD`,
      //        desc: `TBD.`,
      //        when: [HERO_PHASE],
      //      },
    ],
  },
  {
    name: `Immortis Guard`,
    effects: [
      //      {
      //       name: `TBD`,
      //        desc: `TBD.`,
      //        when: [HERO_PHASE],
      //      },
    ],
  },
  {
    name: `Mortek Guard`,
    effects: [
      //      {
      //       name: `TBD`,
      //        desc: `TBD.`,
      //        when: [HERO_PHASE],
      //      },
    ],
  },
  {
    name: `Kavalos Deathriders`,
    effects: [
      //      {
      //       name: `TBD`,
      //        desc: `TBD.`,
      //        when: [HERO_PHASE],
      //      },
    ],
  },
  {
    name: `Mortisian Priest`,
    effects: [
      //      {
      //       name: `TBD`,
      //        desc: `TBD.`,
      //        when: [HERO_PHASE],
      //      },
    ],
  },
  {
    name: `Necropolis Stalkers`,
    effects: [
      //      {
      //       name: `TBD`,
      //        desc: `TBD.`,
      //        when: [HERO_PHASE],
      //      },
    ],
  },
  {
    name: `Mortek Crawler`,
    effects: [
      //      {
      //       name: `TBD`,
      //        desc: `TBD.`,
      //        when: [HERO_PHASE],
      //      },
    ],
  },
  {
    name: `Orpheon Katakros`,
    effects: [
      //      {
      //       name: `TBD`,
      //        desc: `TBD.`,
      //        when: [HERO_PHASE],
      //      },
    ],
  },
]

// Battalions
export const Battalions: TBattalions = [
  //  {
  //    name: ``,
  //    effects: [
  //      {
  //        name: ``,
  //        desc: ``,
  //        when: [HERO_PHASE],
  //      },
  //    ],
  //  },
]

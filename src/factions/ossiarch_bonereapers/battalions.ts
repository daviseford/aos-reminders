import { keyPicker, tagAs } from 'factions/metatagger'
import {
  CHARGE_PHASE,
  DURING_GAME,
  END_OF_SETUP,
  HERO_PHASE,
  START_OF_COMBAT_PHASE,
  START_OF_HERO_PHASE,
  WOUND_ALLOCATION_PHASE,
} from 'types/phases'
import Units from './units'

const RegularBattalions = {
  // The name that you enter here is how it'll appear on the UI
  'Mortek Shield-Corps': {
    mandatory: {
      units: [keyPicker(Units, ['Mortek Guard'])],
    },
    effects: [
      {
        name: `Unbreakable Bulwark`,
        desc: `Once per turn, you can use the Shieldwall command ability for a unit from this battalion without spending a relentless discipline point to do so.`,
        when: [START_OF_COMBAT_PHASE],
      },
    ],
  },
  'Mortisan Trident': {
    mandatory: {
      units: [
        keyPicker(Units, [
          'Mortisan Boneshaper',
          'Mortisan Soulreaper',
          'Mortisan Soulmason',
          'Gothizzar Harvester',
        ]),
      ],
    },
    effects: [
      {
        name: `Deadly Combination`,
        desc: `Each MORTISAN from this battalion can attempt to cast 1 extra spell in your hero phase if it is within 18" of the GOTHIZZAR HARVESTER from the same battalion and the GOTHIZZAR HARVESTER is within 3" of any enemy units.`,
        when: [HERO_PHASE],
      },
    ],
  },
  'Katakrosian Deathglaive': {
    mandatory: {
      units: [keyPicker(Units, ['Necropolis Stalker', 'Morghast Harbingers'])],
    },
    effects: [
      {
        name: `Supernatural Strike-force`,
        desc: `After armies are set up but before the first battle round begins, if all units from this battalion are wholly within 12" of this battalion's MORGHAST HARBINGERS unit, you can move any units from this battalion up to 6".`,
        when: [END_OF_SETUP],
      },
    ],
  },
  'Aegis Immortal': {
    mandatory: {
      units: [keyPicker(Units, ['Immortis Guard', 'Morghast Archai'])],
    },
    effects: [
      {
        name: `Undying Guardians`,
        desc: `The MORGHAST ARCHAI unit from this battalion has the Soulbound Protectors ability from the IMMORTIS GUARD warscroll. In addition, when you use the Soulbound Protectors ability for a unit from this battalion and the dice roll is 5+, the wound or mortal wound is negated instead of being allocated to a unit from this battalion.`,
        when: [DURING_GAME],
      },
    ],
  },
  'Kavalos Lance': {
    mandatory: {
      units: [keyPicker(Units, ['Kavalos Deathriders'])],
    },
    effects: [
      {
        name: `Liege Companions`,
        desc: `Units from this battalion can charge even if they retreated earlier in the same turn if they are wholly within 12" of the LIEGE from the same battalion when the charge roll is made. In addition, once per turn, you can use the Deathrider Wedge command ability for a unit from this battalion without spending a relentless discipline point to do so.`,
        when: [CHARGE_PHASE],
      },
    ],
  },
  'Mortek Ballistari': {
    mandatory: {
      units: [keyPicker(Units, ['Mortisan Boneshaper', 'Mortek Guard', 'Mortek Crawler'])],
    },
    effects: [
      {
        name: `Vital Assets`,
        desc: `Roll a D6 before you allocate a wound or mortal wound to a MORTEK CRAWLER from this battalion while it is within 3" of the MORTEK GUARD from the same battalion. Add 2 to the roll if the MORTEK CRAWLER is within 3" of the MORTISAN BONESHAPER from the same battalion. On a 4+, that wound or mortal wound is allocated to the MORTEK GUARD instead of the MORTEK CRAWLER.`,
        when: [WOUND_ALLOCATION_PHASE],
      },
    ],
  },
  "Vokmortian's Retinue": {
    mandatory: {
      units: [keyPicker(Units, ['Vokmortian', 'Mortek Guard', 'Necropolis Stalker'])],
    },
    effects: [
      {
        name: `Eternal Duty`,
        desc: `At the start of your hero phase, you can pick 1 unit from this battalion within 8" of the VOKMORTIAN from the same battalion. Return 1 slain model to that unit.`,
        when: [START_OF_HERO_PHASE],
      },
    ],
  },
}

const SuperBattalions = {
  'Ossiarch Cohort': {
    mandatory: {
      // This battalion requires these two battalions to be a part of it.
      battalions: [
        keyPicker(RegularBattalions, [
          'Mortek Shield-Corps',
          'Mortisan Trident',
          'Katakrosian Deathglaive',
          'Aegis Immortal',
          'Kavalos Lance',
          'Mortek Ballistari',
        ]),
      ],
      units: [keyPicker(Units, ['Orpheon Katakros'])],
    },
    effects: [
      {
        name: `Unstoppable Battleforce`,
        desc: `At the start of your hero phase, if your general is from this battalion and on the battlefield, you receive D3 relentless discipline points.`,
        when: [START_OF_HERO_PHASE],
      },
    ],
  },
}

// Merge the Battalions
const Battalions = { ...RegularBattalions, ...SuperBattalions }

// Always export using tagAs
export default tagAs(Battalions, 'battalion')

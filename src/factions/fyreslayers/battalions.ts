import { keyPicker, tagAs } from 'factions/metatagger'
import { COMBAT_PHASE, DURING_ROUND, HERO_PHASE, SAVES_PHASE, START_OF_HERO_PHASE } from 'types/phases'
import Units from './units'

const RegularBattalions = {
  'Lords of the Lodge': {
    mandatory: {
      units: [keyPicker(Units, ['Auric Runemaster', 'Battlesmith', 'Hearthguard Berzerkers'])],
    },
    effects: [
      {
        name: `Oathbound Guardians`,
        desc: `If a unit of HEARTHGUARD BERZERKERS from this battalion is wholly within 12" of a HERO from the same battalion at the start of the combat phase, then after that unit has fought in that phase for the first time, when it is your turn to pick a unit to fight with later in the same phase, you can select it again.`,
        when: [COMBAT_PHASE],
      },
    ],
  },
  'Warrior Kinband': {
    mandatory: {
      units: [keyPicker(Units, ['Auric Runeson', 'Hearthguard Berzerkers'])],
    },
    effects: [
      {
        name: `Berserk Kindred`,
        desc: `You can use the Berserk Fury ability for 1 VULKITE BERZERKERS unit from this battalion twice in the same battle if that unit is wholly within 12" of an AURIC RUNESON from the same battalion the second time the ability is used.`,
        when: [COMBAT_PHASE],
      },
    ],
  },
  'Forge Brethren': {
    mandatory: {
      units: [keyPicker(Units, ['Auric Hearthguard'])],
    },
    effects: [
      {
        name: `Bulwark of Molten Stone`,
        desc: `At the start of the enemy hero phase, you can pick 1 friendly unit wholly within 18" of any units of AURIC HEARTHGUARD from this battalion. If you do so add 1 to save rolls for that target until your next hero phase.`,
        when: [START_OF_HERO_PHASE],
      },
      {
        name: `Bulwark of Molten Stone`,
        desc: `If active, add 1 to save rolls for that target until your next hero phase.`,
        when: [SAVES_PHASE],
      },
    ],
  },
  'Lords of Vostarg': {
    mandatory: {
      units: [
        keyPicker(Units, [
          'Bael-Grimnir on Flamespitter',
          'Auric Runemaster',
          'Battlesmith',
          'Hearthguard Berzerkers',
        ]),
      ],
    },
    effects: [
      {
        name: `Strength in Tradition`,
        desc: `Once per battle round, a HERO from this battalion can use a command ability without spending a command point.`,
        when: [DURING_ROUND],
      },
    ],
  },
  'Vostarg Warrior Kinband': {
    mandatory: {
      units: [keyPicker(Units, ['Auric Runeson', 'Hearthguard Berzerkers'])],
    },
    effects: [
      {
        name: `Mighty Deeds and Blazing Oaths`,
        desc: `Add 1 to the melee weapon Attacks for VULKITE BERZERKERS units from this battalion while they are wholly within 12" of this battalion' AURIC RUNESON.`,
        when: [COMBAT_PHASE],
      },
    ],
  },
  'Vostarg Forge Brethren': {
    mandatory: {
      units: [keyPicker(Units, ['Auric Runesmiter', 'Auric Hearthguard'])],
    },
    effects: [
      {
        name: `Heir of the Fyreheart Temple`,
        desc: `If a friendly unit of AURIC HEARTHGUARD from this battalion is wholly within 12" of Dhurgan when he uses his Magmic Prayer of Runic Empowerment ability, the prayer is answered on a 2+ instead of 3+.`,
        when: [HERO_PHASE],
      },
    ],
  },
  "Hajkarl's Sons of Fortune": {
    mandatory: {
      units: [
        keyPicker(Units, [
          'Auric Runefather on Magmadroth',
          'Auric Runeson',
          'Auric Runesmiter',
          'Hearthguard Berzerkers',
        ]),
      ],
    },
    effects: [
      {
        name: `Quest for Ur-gold`,
        desc: `Once per battle, in your hero phase, choose one enemy unit on the battlefield to be the target of the Runesmiter's appraising eye; unless they are already within 3" of any enemy units, all Hajkarl's Sons of Fortune units can immediately move up to 4" towards the unit you picked, provided that they end this move closer to the target unit than where they started.`,
        when: [HERO_PHASE],
      },
    ],
  },
}

const SuperBattalions = {
  'Grand Fyrd': {
    mandatory: {
      battalions: [keyPicker(RegularBattalions, ['Lords of the Lodge', 'Warrior Kinband', 'Forge Brethren'])],
    },
    effects: [
      {
        name: `Blazing Runes`,
        desc: `Ur-gold enhanced effects trigger on 5+.`,
        when: [START_OF_HERO_PHASE],
      },
    ],
  },
  'The Grand Fyrd of Furios Peak': {
    mandatory: {
      battalions: [
        keyPicker(RegularBattalions, [
          'Lords of Vostarg',
          'Vostarg Warrior Kinband',
          'Vostarg Forge Brethren',
        ]),
      ],
      units: [keyPicker(Units, ['Grimwrath Berzerker'])],
    },
    effects: [
      {
        name: `Heir of the Fyreheart Temple`,
        desc: `If a friendly unit of AURIC HEARTHGUARD from this battalion is wholly within 12" of Dhurgan when he uses his Magmic Prayer of Runic Empowerment ability, the prayer is answered on a 2+ instead of 3+.`,
        when: [HERO_PHASE],
      },
    ],
  },
}

const Battalions = { ...RegularBattalions, ...SuperBattalions }

export default tagAs(Battalions, 'battalion')

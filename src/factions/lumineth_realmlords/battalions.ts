import { keyPicker, tagAs } from 'factions/metatagger'
import { COMBAT_PHASE, SAVES_PHASE, START_OF_COMBAT_PHASE, WOUND_ALLOCATION_PHASE } from 'types/phases'
import rule_sources from './rule_sources'
import units from './units'

const RegularBattalions = {
  'Alarith Temple': {
    mandatory: {
      units: [
        keyPicker(units, [
          'Alarith Stonemage',
          'Alarith Stoneguard',
          'Alarith Spirit of the Mountain',
          'Avalenor, the Stoneheart King',
        ]),
      ],
    },
    effects: [
      {
        name: `Skin to Stone`,
        desc: `Any friendly STONEGUARD units from this battalion that are wholly within 12" of a friendly HERO from the same battalion can turn their skin to stone until the end of the phase. Add 1 to save rolls for attacks that target a unit that has turned its skin to stone, but models in a unit that has turned its skin to stone can only move 1" when they pile in.`,
        when: [START_OF_COMBAT_PHASE],
        rule_sources: [rule_sources.BATTLETOME_LUMINETH, rule_sources.ERRATA_LUMINETH_JULY_2021],
      },
      {
        name: `Skin to Stone`,
        desc: `Add 1 to save rolls for attacks that target a unit that has turned its skin to stone.`,
        when: [SAVES_PHASE],
        rule_sources: [rule_sources.BATTLETOME_LUMINETH, rule_sources.ERRATA_LUMINETH_JULY_2021],
      },
      {
        name: `Skin to Stone`,
        desc: `Models in a unit that has turned its skin to stone can only move 1" when they pile in.`,
        when: [COMBAT_PHASE],
        rule_sources: [rule_sources.BATTLETOME_LUMINETH, rule_sources.ERRATA_LUMINETH_JULY_2021],
      },
    ],
  },
  'Auralan Legion': {
    mandatory: {
      units: [keyPicker(units, ['Scinari Cathallar', 'Vanari Auralan Sentinels', 'Vanari Auralan Wardens'])],
    },
    effects: [
      {
        name: `Shield of Light`,
        desc: `Add 1 to save rolls for attacks made with missile weapons that target a friendly unit from this battalion while it is within 3" of any other friendly units from the same battalion.`,
        when: [SAVES_PHASE],
        rule_sources: [rule_sources.BATTLETOME_LUMINETH, rule_sources.ERRATA_LUMINETH_JULY_2021],
      },
    ],
  },
  'Bladelord Host': {
    mandatory: {
      units: [
        keyPicker(units, [
          'Vanari Bladelords',
          'Scinari Calligrave',
          'Scinari Cathallar',
          'Scinari Loreseeker',
          'Vanari Lord Regent',
        ]),
      ],
    },
    effects: [
      {
        name: `Calculated Response`,
        desc: `Reroll hit rolls of 1 for attacks made with melee weapons by friendly units from this battalion that target an enemy model that made a charge move in the same turn.`,
        when: [COMBAT_PHASE],
      },
    ],
  },
  'Dawnrider Lance': {
    mandatory: {
      units: [keyPicker(units, ['Vanari Dawnriders'])],
    },
    effects: [
      {
        name: `Shafts of Light`,
        desc: `Reroll hit rolls of 1 for attacks made with melee weapons by friendly units from this battalion that made a charge move in the same turn.`,
        when: [COMBAT_PHASE],
      },
    ],
  },
  'Hurakan Temple': {
    mandatory: {
      units: [
        keyPicker(units, [
          'Hurakan Windmage',
          'Hurakan Windchargers',
          'Sevireth, Lord of the Seventh Wind',
          'Hurakan Spirit of the Wind',
        ]),
      ],
    },
    effects: [
      {
        name: `Whirling Tornadoes`,
        desc: `If a unit from this battalion is wholly within 12" of a HERO from the same battalion at the start of the combat phase, the models in that unit count as having made a charge move in the same turn.`,
        when: [COMBAT_PHASE],
      },
    ],
  },
  'Starshard Battery': {
    mandatory: {
      units: [keyPicker(units, ['Vanari Starshard Ballistas', 'Scinari Calligrave'])],
    },
    effects: [
      {
        name: `Ward Barrier`,
        desc: `The 'Warding Lanterns' ability now grants a 5+ save for all wounds and mortal wounds inflicted to Starshard Ballistas in this unit.`,
        when: [WOUND_ALLOCATION_PHASE],
      },
    ],
  },
}

const SuperBattalions = {
  'Teclian Vanguard': {
    mandatory: {
      units: [keyPicker(units, ['Archmage Teclis'])],
      battalions: [keyPicker(RegularBattalions, ['Alarith Temple', 'Auralan Legion', 'Dawnrider Lance'])],
    },
    effects: [
      {
        name: `Blessing of Teclis`,
        desc: `Roll a D6 each time you allocate a wound or mortal wound to a friendly unit from this battalion while it is wholly within its own territory. On a 6, that wound or mortal wound is negated.`,
        when: [WOUND_ALLOCATION_PHASE],
      },
    ],
  },
}

// Always export using tagAs
export default tagAs({ ...RegularBattalions, ...SuperBattalions }, 'battalion')

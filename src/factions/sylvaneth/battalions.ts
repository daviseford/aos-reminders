import { keyPicker, tagAs } from 'factions/metatagger'
import {
  BATTLESHOCK_PHASE,
  CHARGE_PHASE,
  DURING_SETUP,
  HERO_PHASE,
  MOVEMENT_PHASE,
  SHOOTING_PHASE,
} from 'types/phases'
import units from './units'

const RegularBattalions = {
  'Free Spirits': {
    mandatory: {
      units: [keyPicker(units, ['Spirit of Durthu', 'Kurnoth Hunters'])],
    },
    effects: [
      {
        name: `Swift Vengeance`,
        desc: `In your movement phase, if you declare a unit from this battalion will run, do not make a run roll. Instead, add 6" to the Move characteristic of that unit for that phase.`,
        when: [HERO_PHASE],
      },
    ],
  },
  'Lords of the Clan': {
    mandatory: {
      units: [keyPicker(units, ['Treelord', 'Treelord Ancient'])],
    },
    effects: [
      {
        name: `Deadly Chorus`,
        desc: `In your shooting phase, roll a D6 for each enemy unit that is within 6" of 2 or more models from this battalion. On a 2+ that enemy unit suffers D3 mortal wounds.`,
        when: [SHOOTING_PHASE],
      },
    ],
  },
  Household: {
    mandatory: {
      units: [keyPicker(units, ['Treelord', 'Branchwych', 'Tree-Revenants'])],
    },
    effects: [
      {
        name: `Discipline of the Ages`,
        desc: `Enemy units within 3" of any units from this battalion cannot retreat.`,
        when: [MOVEMENT_PHASE],
      },
    ],
  },
  'Forest Folk': {
    mandatory: {
      units: [keyPicker(units, ['Branchwraith', 'Dryads'])],
    },
    effects: [
      {
        name: `Swift as the Breeze`,
        desc: `Units from this battalion can retreat and still charge later in the same turn.`,
        when: [CHARGE_PHASE],
      },
    ],
  },
  Outcasts: {
    mandatory: {
      units: [keyPicker(units, ['Spite-Revenants'])],
    },
    effects: [
      {
        name: `Feat the Forest-kin`,
        desc: `If an enemy unit fails a battleshock test within 3" of any units from this battalion, add D3 to the number of models that flee.`,
        when: [BATTLESHOCK_PHASE],
      },
    ],
  },
  'Sylvaneth Heartwood Host': {
    mandatory: {
      units: [keyPicker(units, ['Treelord', 'Branchwych', 'Dryads'])],
    },
    effects: [
      {
        name: `Blessing of the Heartwood`,
        desc: `During each hero phase, the host's Branchwych and Treelord heal one wound lost earlier in battle, whilst its Dryads add 1 model to their unit that was slain earlier in battle.`,
        when: [HERO_PHASE],
      },
    ],
  },
}

const SuperBattalions = {
  Wargrove: {
    mandatory: {
      battalions: [
        keyPicker(RegularBattalions, [
          'Lords of the Clan',
          'Household',
          'Forest Folk',
          'Free Spirits',
          'Outcasts',
        ]),
      ],
    },
    effects: [
      {
        name: `Mighty Wyldwood`,
        desc: `When you choose a Sylvaneth army, you can include 2 AWAKENED WYLDWOOD terrain features instead of 1 if your army includes this battalion.`,
        when: [DURING_SETUP],
      },
    ],
  },
}

const Battalions = { ...RegularBattalions, ...SuperBattalions }

export default tagAs(Battalions, 'battalion')

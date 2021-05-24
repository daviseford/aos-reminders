import { keyPicker, pickEffects } from '../metatagger'
import Artifacts from './artifacts'
import Battalions from './battalions'
import BattleTraits from './battle_traits'
import CommandAbilities from './command_abilities'
import CommandTraits from './command_traits'
import EndlessSpells from './endless_spells'
import MountTraits from './mount_traits'
import Prayers from './prayers'
import Scenery from './scenery'
import Spells from './spells'
import Units from './units'

const subFactionBase = {
  artifacts: [Artifacts],
  battalions: [Battalions],
  command_abilities: [CommandAbilities],
  command_traits: [CommandTraits],
  endless_spells: [EndlessSpells],
  // flavors: [Flavors],
  mount_traits: [MountTraits],
  prayers: [Prayers],
  scenery: [Scenery],
  spells: [Spells],
  units: [Units],
}

const subFactions = {
  'Legion of Blood': {
    effects: pickEffects(BattleTraits, ['Legion of Blood']),
    available: {
      ...subFactionBase,
      artifacts: [
        keyPicker(Artifacts, [
          'Amulet of Screams',
          'Orb of Enchantment',
          'Oubliette Arcana',
          'Ring of Dominion',
          'Shadeglass Decanter',
          'Soulbound Garments',
        ]),
      ],
      command_traits: [
        keyPicker(CommandTraits, [
          'Premeditated Violence',
          'Soul-crushing Contempt',
          'Aristocracy of Blood',
          'Aura of Dark Majesty',
          'Walking Death',
          'Sanguine Blur',
        ]),
      ],
    },
  },

  'Legion of Night': {
    effects: pickEffects(BattleTraits, ['Legion of Night']),
    available: {
      ...subFactionBase,
      artifacts: [
        keyPicker(Artifacts, [
          'Vial of Pure Blood',
          'Shard of Night',
          'Gem of Exsanguination',
          'Chiropteran Cloak',
          "Morbheg's Claw",
          'Curseblade',
        ]),
      ],
      command_traits: [
        keyPicker(CommandTraits, [
          'Above Suspicion',
          'Swift Form',
          'Unbending Will',
          'Merciless Hunter',
          'Unholy Impetus',
          'Terrifying Visage',
        ]),
      ],
    },
  },

  'Vyrkos Dynasty': {
    effects: pickEffects(BattleTraits, ['Vyrkos Dynasty']),
    available: {
      ...subFactionBase,
      artifacts: [keyPicker(Artifacts, [])],
      command_traits: [
        keyPicker(CommandTraits, [
          'Pack Alpha',
          'Driven by Deathstench',
          'Kin of the Wolf',
          "Hunter's Snare",
          'Spoor Trackers',
          'United by Blood',
        ]),
      ],
    },
  },

  'Kastelai Dynasty': {
    effects: pickEffects(BattleTraits, ['Kastelai Dynasty']),
    available: {
      ...subFactionBase,
      artifacts: [keyPicker(Artifacts, [])],
      command_traits: [keyPicker(CommandTraits, [])],
    },
  },

  'Avengorii Dynasty': {
    effects: pickEffects(BattleTraits, ['Avengorii Dynasty']),
    available: {
      ...subFactionBase,
      artifacts: [keyPicker(Artifacts, [])],
      command_traits: [keyPicker(CommandTraits, [])],
    },
  },
}

export default subFactions

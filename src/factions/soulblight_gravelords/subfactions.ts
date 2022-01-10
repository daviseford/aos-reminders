import { keyPicker, pickEffects } from '../metatagger'
import Artifacts from './artifacts'
import Battalions from './battalions'
import BattleTraits from './battle_traits'
import CommandAbilities from './command_abilities'
import CommandTraits from './command_traits'
import GrandStrategies from './grand_strategies'
import MountTraits from './mount_traits'
import Spells from './spells'
import Units from './units'

const subFactionBase = {
  battalions: [Battalions],
  command_abilities: [CommandAbilities],
  grand_strategies: [GrandStrategies],
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
      artifacts: [
        keyPicker(Artifacts, [
          'Ulfenkarnian Phylactery',
          'Cloak of the Night Prowler',
          'Sangsyron',
          "Vilnas' Fang",
          'Terminus Clock',
          'Standard of the Ulfenwatch',
        ]),
      ],
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
      artifacts: [
        keyPicker(Artifacts, [
          'Sword of the Red Seneschals',
          "Bloodsaint's Shield",
          'Standard of the Crimson Keep',
          'Grave-sand Shard',
          'Fragment of the Keep',
          'The Red Casket',
        ]),
      ],
      command_traits: [
        keyPicker(CommandTraits, [
          'Beacon of Bloodshed',
          'Master of Retaliation',
          'Power in the Blood',
          'Rousing Commander',
          'Swift and Deadly',
          'A Craving for Massacre',
        ]),
      ],
    },
  },

  'Avengorii Dynasty': {
    effects: pickEffects(BattleTraits, ['Avengorii Dynasty']),
    available: {
      ...subFactionBase,
      artifacts: [keyPicker(Artifacts, ['Breath of the Void Maw', "Ghorvar's Collar", 'The Furious Crown'])],
      command_traits: [
        keyPicker(CommandTraits, ['An Eye for An Eye', 'Torment-driven Throes', 'Unhinged Rampager']),
      ],
      mount_traits: [
        keyPicker(MountTraits, [
          'Maddening Hunger (Cursed Mutation)',
          'Nullblood Construct (Cursed Mutation)',
          'Urges of Atrocity (Cursed Mutation)',
        ]),
      ],
    },
  },
}

export default subFactions

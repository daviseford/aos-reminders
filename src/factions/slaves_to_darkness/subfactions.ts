import { IItemDescription } from 'factions/factionTypes'
import { keyOmitter, keyPicker, pickEffects } from '../metatagger'
import Artifacts from './artifacts'
import Battalions from './battalions'
import BattleTraits from './battle_traits'
import CommandAbilities from './command_abilities'
import CommandTraits from './command_traits'
import EndlessSpells from './endless_spells'
import Flavors from './flavors'
import Prayers from './prayers'
import Spells from './spells'
import Units from './units'

const baseSubFaction: IItemDescription = {
  effects: pickEffects(BattleTraits, ['Bane of the Mortal Realms']),
  available: {
    endless_spells: [EndlessSpells],
    prayers: [Prayers],
    spells: [Spells],
  },
}

const subFactions = {
  Ravagers: {
    effects: pickEffects(BattleTraits, ['Bane of the Mortal Realms', 'Glory for the Taking']),

    mandatory: {
      command_abilities: [keyPicker(CommandAbilities, ['Rally the Tribes'])],
    },

    available: {
      ...baseSubFaction.available,
      artifacts: [
        keyPicker(Artifacts, [
          'Hellfire Sword',
          'Blasphemous Cuirass',
          'Helm of the Oppressor',
          'Cloak of the Relentless Conqueror',
          'Mark of the High-favoured',
          'Desecrator Gauntlets',
        ]),
      ],
      battalions: [keyOmitter(Battalions, ['Overlords of Chaos', "Gresh's Iron Reapers"])],
      command_traits: [
        keyPicker(CommandTraits, [
          'Bolstered by Hate',
          'Unquestioned Resolve',
          'Favoured of the Pantheon',
          'Eternal Vendetta',
          'Flames of Spite',
          'Master of Deception',
        ]),
      ],
      units: [keyOmitter(Units, ['Idolator Lord on Chaos Chariot', 'Idolator Lord on Gorebeast Chariot'])],
    },
  },

  Cabalists: {
    effects: pickEffects(BattleTraits, ['Bane of the Mortal Realms', 'Binding Rituals']),

    mandatory: {
      spells: [keyPicker(Spells, ['Crippling Ruin'])],
    },

    available: {
      ...baseSubFaction.available,
      artifacts: [
        keyPicker(Artifacts, [
          'Soul Feeder',
          'Black Athame',
          'Infernal Puppet',
          'Spelleater Pendant',
          'Scroll of Dark Unravelling',
          'Spell Familiar',
        ]),
      ],
      battalions: [keyOmitter(Battalions, ['Overlords of Chaos', "Gresh's Iron Reapers"])],
      command_traits: [
        keyPicker(CommandTraits, [
          'Bolstered by Hate',
          'Lord of Terror',
          'Favoured of the Pantheon',
          'Mighty Ritualist',
          'Blasphemous Influence',
          'All for One',
        ]),
      ],
      units: [keyOmitter(Units, ['Idolator Lord on Chaos Chariot', 'Idolator Lord on Gorebeast Chariot'])],
    },
  },

  Despoilers: {
    effects: pickEffects(BattleTraits, [
      'Bane of the Mortal Realms',
      'Sacrilegious Might',
      'Blessed by the Unholy',
      'Twisted Dominion',
      'Pitch Black',
      'Nightmare Chasm',
    ]),

    available: {
      ...baseSubFaction.available,
      artifacts: [
        keyPicker(Artifacts, [
          'Crown of Hellish Adoration',
          'Helm of Many Eyes',
          'Armour of Tortured Souls',
          'Diabolic Mantle',
          'Doombringer Blade',
          "Realmwarper's Twist-rune",
        ]),
      ],
      battalions: [keyOmitter(Battalions, ['Overlords of Chaos', "Gresh's Iron Reapers"])],
      command_traits: [
        keyPicker(CommandTraits, [
          'Bolstered by Hate',
          'Lord of Terror',
          'Lightning Reflexes',
          'Radiance of Dark Glory',
          'Distorting Miasma',
          'Paragon of Ruin',
        ]),
      ],
      units: [keyOmitter(Units, ['Idolator Lord on Chaos Chariot', 'Idolator Lord on Gorebeast Chariot'])],
    },
  },

  'Host of the Everchosen': {
    effects: pickEffects(BattleTraits, [
      'Bane of the Mortal Realms',
      'Exalted Grand Marshall of the Apocalypse',
      'Fearless in His Presence',
      'The Will of the Everchosen',
      'The Eight Circles of the Varanguard',
    ]),

    mandatory: {
      command_abilities: [keyPicker(CommandAbilities, ['Dark Prophecy'])],
    },

    available: {
      ...baseSubFaction.available,
      battalions: [keyOmitter(Battalions, ["Gresh's Iron Reapers"])],
      flavors: [Flavors],
      units: [keyOmitter(Units, ['Idolator Lord on Chaos Chariot', 'Idolator Lord on Gorebeast Chariot'])],
    },
  },

  'Knights of the Empty Throne': {
    effects: pickEffects(BattleTraits, ['Bane of the Mortal Realms', 'Fists of the Everchosen']),

    mandatory: {
      command_abilities: [keyPicker(CommandAbilities, ['Unmatched Conquerors', 'Failure is Not an Option'])],
    },

    available: {
      ...baseSubFaction.available,
      artifacts: [keyPicker(Artifacts, ['Flask of Daemonblood', 'Grasping Plate', 'Corrupted Nullstone'])],
      battalions: [keyOmitter(Battalions, ['Overlords of Chaos', "Gresh's Iron Reapers"])],
      command_traits: [
        keyPicker(CommandTraits, ['Annihilating Charge', 'Inescapeable Doom', 'Wall of Cursed Iron']),
      ],
      units: [keyOmitter(Units, ['Idolator Lord on Chaos Chariot', 'Idolator Lord on Gorebeast Chariot'])],
    },
  },

  Idolators: {
    effects: pickEffects(BattleTraits, [
      'Bane of the Mortal Realms',
      'Blessed of Chaos',
      'Panopy of Ruin',
      'Destroy the False Idols',
    ]),

    mandatory: {
      command_abilities: [keyPicker(CommandAbilities, ['Desecrate'])],
    },

    available: {
      ...baseSubFaction.available,
      battalions: [keyOmitter(Battalions, ['Overlords of Chaos'])],
      command_traits: [
        keyPicker(CommandTraits, [
          'Bolstered by Hate',
          'Lord of Terror',
          'Favoured of the Pantheon',
          'Fiery Orator',
          'Bane of the False Idols',
          'Smite the Unbeliever',
        ]),
      ],
      units: [Units],
    },
  },
}

export default subFactions

import { keyPicker } from 'factions/metatagger'
import { CHARGE_PHASE, COMBAT_PHASE, HERO_PHASE, SHOOTING_PHASE } from 'types/phases'
import artifacts from './artifacts'
import command_abilities from './command_abilities'
import command_traits from './command_traits'
import spells from './spells'

const BonesplitterzFlavors = {
  'Bonegrinz Clan': {
    mandatory: {
      artifacts: [keyPicker(artifacts, ['Maw-Krusha Beast Totem'])],
      command_abilities: [keyPicker(command_abilities, ['Feel da Spirit'])],
      command_traits: [keyPicker(command_traits, ['A Right Monster'])],
    },
    effects: [
      {
        name: `Bring it On!`,
        desc: `Enemy units within 12" of your units must attempt and finish a charge move if they are able. Enemy units within 3" of your units cannot choose to retreat.`,
        when: [CHARGE_PHASE],
      },
    ],
  },
  'Icebone Clan': {
    mandatory: {
      artifacts: [keyPicker(artifacts, ['Kattanak Pelt'])],
      command_abilities: [keyPicker(command_abilities, ['Freeze and Run'])],
      command_traits: [keyPicker(command_traits, ['Pure-bred War Boar'])],
    },
    effects: [
      {
        name: `Freezing Strike`,
        desc: `Unmodified wound rolls of 6 increase the rend of that attack by 1.`,
        when: [SHOOTING_PHASE, COMBAT_PHASE],
      },
    ],
  },
  'Drakkfoot Clan': {
    mandatory: {
      artifacts: [keyPicker(artifacts, ["Burnin' Tattooz"])],
      command_abilities: [keyPicker(command_abilities, ['Shout Down da Magic!'])],
      spells: [keyPicker(spells, ['Fireball!'])],
    },
    effects: [
      {
        name: `Strength of Purpose`,
        desc: `Units in this clan can ignore the Ethereal save keyword. Also all abilities that negate wounds are ignored whe taking wounds from this clan.`,
        when: [COMBAT_PHASE, SHOOTING_PHASE],
      },
      {
        name: `Fireball!`,
        desc: `All wizards in the clan know the Fireball spell instead of Arcane Bolt and can cast it.`,
        when: [HERO_PHASE],
      },
    ],
  },
}

// Note: We do NOT use tagAs for Flavors
export default BonesplitterzFlavors

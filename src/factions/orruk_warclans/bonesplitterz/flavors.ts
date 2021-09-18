import { COMBAT_PHASE, SAVES_PHASE, SHOOTING_PHASE } from 'types/phases'

const BonesplitterzFlavors = {
  Bonegrinz: {
    mandatory: {
      // artifacts: [keyPicker(artifacts, ['Maw-Krusha Beast Totem'])],
      // command_abilities: [keyPicker(command_abilities, ['Feel da Spirit'])],
      // command_traits: [keyPicker(command_traits, ['A Right Monster'])],
    },
    effects: [
      {
        name: `Barrage of Arrows`,
        desc: `Add 1 to the Attacks characteristic of missile weapons used by friendly BONEGRINZ SAVAGE ORRUK ARROWBOYS.`,
        when: [SHOOTING_PHASE],
      },
    ],
  },
  Icebone: {
    mandatory: {
      // artifacts: [keyPicker(artifacts, ['Kattanak Pelt'])],
      // command_abilities: [keyPicker(command_abilities, ['Freeze and Run'])],
      // command_traits: [keyPicker(command_traits, ['Pure-bred War Boar'])],
    },
    effects: [
      {
        name: `Freezing Strike`,
        desc: `If the unmodified wound roll for an attack made with a melee weapon by a friendly ICEBONE model is 6, that attack causes a number of mortal wounds to the target equal to the weapon's Damage characteristic and the attack sequence ends (do not make a save roll).`,
        when: [COMBAT_PHASE],
      },
    ],
  },
  Drakkfoot: {
    mandatory: {
      // artifacts: [keyPicker(artifacts, ["Burnin' Tattooz"])],
      // command_abilities: [keyPicker(command_abilities, ['Shout Down da Magic!'])],
      // spells: [keyPicker(spells, ['Fireball!'])],
    },
    effects: [
      {
        name: `Strength of Purpose`,
        desc: `Ward rolls cannot be made for wounds and mortal wounds caused by attacks made by. friendly DRAKKFOOT units.`,
        when: [COMBAT_PHASE, SHOOTING_PHASE, SAVES_PHASE],
      },
      // {
      //   name: `Fireball!`,
      //   desc: `All wizards in the clan know the Fireball spell instead of Arcane Bolt and can cast it.`,
      //   when: [HERO_PHASE],
      // },
    ],
  },
}

// Note: We do NOT use tagAs for Flavors
export default BonesplitterzFlavors

import { COMBAT_PHASE, SHOOTING_PHASE, TURN_ONE_DURING_ROUND, TURN_ONE_SHOOTING_PHASE } from 'types/phases'

const KruleboyzFlavors = {
  "Grinnin' Blades": {
    mandatory: {
      // artifacts: [keyPicker(artifacts, ['Maw-Krusha Beast Totem'])],
      // command_abilities: [keyPicker(command_abilities, ['Feel da Spirit'])],
      // command_traits: [keyPicker(command_traits, ['A Right Monster'])],
    },
    effects: [
      {
        name: `Out of the Mists`,
        desc: `During the first battle round, friendly GRINNIN' BLADES units are not visible to enemy models that are more than 12" away from them.`,
        when: [TURN_ONE_DURING_ROUND],
      },
    ],
  },
  'Big Yellers': {
    mandatory: {
      // artifacts: [keyPicker(artifacts, ['Kattanak Pelt'])],
      // command_abilities: [keyPicker(command_abilities, ['Freeze and Run'])],
      // command_traits: [keyPicker(command_traits, ['Pure-bred War Boar'])],
    },
    effects: [
      {
        name: `Only Da Best`,
        desc: `Add 3" to the Range characteristic of missile weapons used by friendly BIG YELLERS ORRUK units.`,
        when: [SHOOTING_PHASE],
      },
      {
        name: `Only Da Best`,
        desc: `In the first battle round, each time a friendly BIG YELLERS ORRUK unit shoots, you can reroll 1 of the hit rolls for 1 of the attacks made by that unit.`,
        when: [TURN_ONE_SHOOTING_PHASE],
      },
    ],
  },
  Skulbugz: {
    mandatory: {
      // artifacts: [keyPicker(artifacts, ["Burnin' Tattooz"])],
      // command_abilities: [keyPicker(command_abilities, ['Shout Down da Magic!'])],
      // spells: [keyPicker(spells, ['Fireball!'])],
    },
    effects: [
      {
        name: `Crawly Swarm`,
        desc: `When an enemy unit is picked to fight, roll a dice if it is within 3" of any friendly SKULBUGZ units. Add 2 to the roll if that enemy unit is within 3" of any friendly SKULBUGZ MONSTERS. On a roll of 6+, subtract 1 from hit rolls for attacks made by that enemy unit in that phase.`,
        when: [COMBAT_PHASE],
      },
    ],
  },
}

// Note: We do NOT use tagAs for Flavors
export default KruleboyzFlavors

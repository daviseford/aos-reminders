import { keyPicker } from 'factions/metatagger'
import { CHARGE_PHASE, DURING_GAME, HERO_PHASE, SHOOTING_PHASE } from 'types/phases'
import artifacts from './artifacts'
import command_abilities from './command_abilities'
import command_traits from './command_traits'

const Flavors = {
  'Meatfist (Mawtribe)': {
    mandatory: {
      command_abilities: [keyPicker(command_abilities, ['The Unstoppable Feast'])],
      command_traits: [keyPicker(command_traits, ['Food for Thought'])],
      artifacts: [keyPicker(artifacts, ['Gut-plate of Ghur'])],
    },
    effects: [
      {
        name: `Fleshy Stampede`,
        desc: `You can roll 1 additional dice when a MEATFIST unit uses the Trampling Charge battle trait.`,
        when: [CHARGE_PHASE],
      },
    ],
  },
  'Bloodgullet (Mawtribe)': {
    mandatory: {
      command_abilities: [keyPicker(command_abilities, ['Bloodbath'])],
      command_traits: [keyPicker(command_traits, ["'Nice Drop of the Red Stuff!'"])],
      artifacts: [keyPicker(artifacts, ['Splatter-cleaver'])],
    },
    effects: [
      {
        name: `Heralds of the Gulping God`,
        desc: `BLOODGULLET BUTCHERS know 1 extra spell from the Lore of Gutmagic. In addition, friendly BLOODGULLET BUTCHERS can attempt to cast 1 extra spell in your hero phase.`,
        when: [HERO_PHASE],
      },
    ],
  },
  'Underguts (Mawtribe)': {
    mandatory: {
      command_abilities: [keyPicker(command_abilities, ['Thunderous Salvo'])],
      command_traits: [keyPicker(command_traits, ['Mass of Scars'])],
      artifacts: [keyPicker(artifacts, ['Gnoblar Blast Keg'])],
    },
    effects: [
      {
        name: `Gunmasters`,
        desc: `Leadbelcher Guns used by UNDERGUTS LEADBELCHERS units have a Range characteristic of 18" instead of 12".`,
        when: [SHOOTING_PHASE],
      },
    ],
  },
  'Boulderhead (Mawtribe)': {
    mandatory: {
      command_abilities: [keyPicker(command_abilities, ['Dig Deep your Heels!'])],
      command_traits: [keyPicker(command_traits, ['Lord of Beasts'])],
      artifacts: [keyPicker(artifacts, ['Brand of the Svard'])],
    },
    effects: [
      {
        name: `Fearsome Breed`,
        desc: `Add 1 to the Wounds characteristic of friendly BOULDERHEAD MONSTERS. In addition, each BOULDERHEAD HERO on STONEHORN or THUNDERTUSK, instead of only 1, can be given a mount trait.`,
        when: [DURING_GAME],
      },
    ],
  },
  'Thunderbellies (Mawtribe)': {
    mandatory: {
      command_abilities: [keyPicker(command_abilities, ['Rip and Tear'])],
      command_traits: [keyPicker(command_traits, ['Storm Chaser'])],
      artifacts: [keyPicker(artifacts, ['Shatterstone'])],
    },
    effects: [
      {
        name: `Swift Outflank`,
        desc: `Friendly THUNDERBELLIES MOURNFANG PACK units wholly within 12" of the edge of the battlefield at the start of your charge phase can charge in that charge phase even if they ran in the same turn.`,
        when: [CHARGE_PHASE],
      },
      {
        name: `Riders of the Hurricane`,
        desc: `Add 1 to prayer rolls for Keening Gale when a THUNDERBELLIES PRIEST is chanting that prayer.`,
        when: [HERO_PHASE],
      },
    ],
  },
  'Winterbite (Mawtribe)': {
    mandatory: {
      command_abilities: [keyPicker(command_abilities, ['Howl of the Wild'])],
      command_traits: [keyPicker(command_traits, ['Wintertouched'])],
      artifacts: [keyPicker(artifacts, ['Frostfang'])],
    },
    effects: [
      {
        name: `Ghosts in the Blizzard`,
        desc: `Subtract 1 from hit rolls for attacks made with missile weapons that target friendly WINTERBITE units that are wholly within your territory.`,
        when: [SHOOTING_PHASE],
      },
      {
        name: `Call of the Endless White`,
        desc: `Add 1 to prayer rolls for Call of the Blizzard when a WINTERBITE PRIEST is chanting that prayer.`,
        when: [HERO_PHASE],
      },
    ],
  },
}

// Note: We do NOT use tagAs for Flavors
export default Flavors

import { TItemDescriptions } from 'factions/factionTypes'
import { CHARGE_PHASE, DURING_GAME, HERO_PHASE, SHOOTING_PHASE } from 'types/phases'

const Flavors = {
  'Meatfist (Mawtribe)': {
    effects: [
      {
        name: `Fleshy Stampede`,
        desc: `Add 1 to each roll made for the Trampling Charge battle trait by friendly MEATFIST GUTBUSTERS units.`,
        when: [CHARGE_PHASE],
      },
    ],
  },
  'Bloodgullet (Mawtribe)': {
    effects: [
      {
        name: `Heralds of the Gulping God`,
        desc: `Friendly BLOODGULLET BUTCHERS can attempt to cast 1 extra spell in your hero phase.`,
        when: [HERO_PHASE],
      },
      {
        name: `Heralds of the Gulping God`,
        desc: `Friendly BLOODGULLET BUTCHERS know 1 extra spell from the Lore of Gutmagic.`,
        when: [DURING_GAME],
      },
    ],
  },
  'Underguts (Mawtribe)': {
    effects: [
      {
        name: `Gunmasters`,
        desc: `Improve the Rend characteristic of missile weapons used by friendly UNDERGUTS LEADBELCHERS and UNDERGUTS IRONBLASTER units by 1.`,
        when: [SHOOTING_PHASE],
      },
    ],
  },
  'Boulderhead (Mawtribe)': {
    effects: [
      {
        name: `Fearsome Breed`,
        desc: `Add 2 to the Wounds characteristic of friendly BOULDERHEAD STONEHORN and BOULDERHEAD THUNDERTUSK units. In addition, you can pick up to 3 BOULDERHEAD STONEHORNS HEROES or BOULDERHEAD THUNDERTUSK HERORS in your army to have different mount traits instead of 1.`,
        when: [DURING_GAME],
      },
    ],
  },
  'Thunderbellies (Mawtribe)': {
    effects: [
      {
        name: `Swift Outflank`,
        desc: `Friendly THUNDERBELLIES MOURNFANG PACK units can run and still charge later in the turn.`,
        when: [CHARGE_PHASE],
      },
    ],
  },
  'Winterbite (Mawtribe)': {
    effects: [
      {
        name: `Ghosts in the Blizzard`,
        desc: `Subtract 1 from hit rolls for attacks made with missile weapons that target friendly WiNTERBITE units wholly within your territory.`,
        when: [SHOOTING_PHASE],
      },
      {
        name: `Ghosts in the Blizzard`,
        desc: `Friendly WINTERBITE FROST SABRES, ICEBROW HUNTER and ICEFALL YHETEES units are not visible to enemy models more than 12 away.`,
        when: [SHOOTING_PHASE, HERO_PHASE],
      },
    ],
  },
} satisfies TItemDescriptions

// Note: We do NOT use tagAs for Flavors
export default Flavors

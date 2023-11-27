import { TItemDescriptions } from 'factions/factionTypes'
import { tagAs } from 'factions/metatagger'
import {
  BATTLESHOCK_PHASE,
  DURING_GAME,
  DURING_SETUP,
  HERO_PHASE,
  SHOOTING_PHASE,
  START_OF_HERO_PHASE,
  START_OF_SETUP,
} from 'types/phases'

const CommandTraits: TItemDescriptions = {
  //Gutbuster Heros
  'Reluctant Rabble-rouser': {
    effects: [
      {
        name: `Reluctant Rabble-rouser`,
        desc: `Do not take battleshock tests for friendly GNOBLAR units wholly within 18" of this general.`,
        when: [BATTLESHOCK_PHASE],
      },
    ],
  },
  Gastromancer: {
    effects: [
      {
        name: `Gastromancer`,
        desc: 'This general knows all of the spells from the Lore of Gutmagic (pg 68) in addition to the other spells it knows. Butcher Only.',
        when: [DURING_GAME],
      },
    ],
  },
  DeadlyAim: {
    effects: [
      {
        name: `Deadly Aim`,
        desc: ' The To Hit characteristic of this units missile weapons is 2+. BLOODPELT HUNTER only.',
        when: [SHOOTING_PHASE],
      },
    ],
  },
  'Killer Reputation': {
    effects: [
      {
        name: `Killer Reputation`,
        desc: `Before this general is set up for the first time, you can pick an additional big name for them. That big name cannot be the same as their first big name. Tyrant Only.`,
        when: [START_OF_SETUP],
      },
    ],
  },
  'Ex-mercenary': {
    effects: [
      {
        name: `Ex-mercenary`,
        desc: `Friendly MANEATERS units have the Battleline battlefield role.`,
        when: [DURING_GAME],
      },
      {
        name: `Ex-mercenary`,
        desc: `If this general is on the battlefield, roll a dice for each friendly MANEATERS unit that is eating. For each 3+, you receive 1 command point that can only be spent during that turn on a command received by a MANEATERS unit.`,
        when: [START_OF_HERO_PHASE],
      },
    ],
  },

  //BEASTCLAW RAIDERS HERO only.
  'Voice of the Avalanche': {
    effects: [
      {
        name: `Voice of the Avalanche`,
        desc: `This general can issue commands to any friendly units on the battlefield instead of only those wholly within 18* of them. In addition, once per battle, this general can issue a command without a command point being spent.`,
        when: [DURING_GAME],
      },
    ],
  },
  Beastmaster: {
    effects: [
      {
        name: `Beastmaster`,
        desc: `Once per battle, when this general is picked to fight, you can say that they will dig in their heels. If you do so, until the end of that phase, use the top row on this general's damage table, regardless of how many wounds they have suffered. STONEHORN HERO OF THUNDERTUSK HERO only.`,
        when: [DURING_GAME],
      },
    ],
  },
  'Touched by the Everwinter': {
    effects: [
      {
        name: `Touched by the Everwinter`,
        desc: `This general has the PRIEST keyword. If this general is already a PRIEST, they know all of the prayers from the Everwinter Prayers prayer scripture in addition to the other prayers they know.`,
        when: [HERO_PHASE],
      },
    ],
  },
  'Skal Packmaster': {
    effects: [
      {
        name: `Skal Packmaster`,
        desc: `When you use this general's Masters of Ambush ability, up to 3 FROST SABRES units can join this general in ambush instead of 1. ICEBROW HUNTER only.`,
        when: [DURING_SETUP],
      },
    ],
  },
  // The Roving Maw
  'Prime Gutserver': {
    effects: [
      {
        name: `Prime Gutserver`,
        desc: `This general knows all of the spells from the Lore of the Great Maw in addition to any other spells they know.`,
        when: [HERO_PHASE],
      },
    ],
  },
}

export default tagAs(CommandTraits, 'command_trait')

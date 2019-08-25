import { TTraits } from 'types/army'
import {
  CHARGE_PHASE,
  COMBAT_PHASE,
  DURING_GAME,
  END_OF_HERO_PHASE,
  HERO_PHASE,
  SHOOTING_PHASE,
} from 'types/phases'

const CommandTraits: TTraits = [
  {
    name: `Dread Harvester`,
    effects: [
      {
        name: `Dread Harvester`,
        desc: `You can re-roll hit rolls for attacks made with melee weapons by this general if this general made a charge move in the same turn.`,
        when: [COMBAT_PHASE],
      },
    ],
  },
  {
    name: `Gnarled Warrior`,
    effects: [
      {
        name: `Gnarled Warrior`,
        desc: `You can re-roll save rolls of 1 for attacks that target this general.`,
        when: [DURING_GAME],
      },
    ],
  },
  {
    name: `Gift of Ghyran`,
    effects: [
      {
        name: `Gift of Ghyran`,
        desc: `In your hero phase, you can heal 1 wound allocated to this general.`,
        when: [HERO_PHASE],
      },
    ],
  },
  {
    name: `Lord of Spites`,
    effects: [
      {
        name: `Lord of Spites`,
        desc: `You can re-roll wound rolls of 1 for attacks made by this general.`,
        when: [SHOOTING_PHASE, COMBAT_PHASE],
      },
    ],
  },
  {
    name: `Warsinger`,
    effects: [
      {
        name: `Warsinger`,
        desc: `Add 2 to charge rolls for friendly SYLVANETH units wholly within 12" of this general.`,
        when: [CHARGE_PHASE],
      },
    ],
  },
  {
    name: `Wisdom of the Ancients`,
    effects: [
      {
        name: `Wisdom of the Ancients`,
        desc: `Add 1 to the Bravery characteristic of friendly SYLVANETH units while they are wholly within 12" of this general.`,
        when: [DURING_GAME],
      },
    ],
  },
  {
    name: `Arcane Bounty (Wizard Only)`,
    effects: [
      {
        name: `Arcane Bounty (Wizard Only)`,
        desc: `This general knows 1 extra spell from the Lore of the Deepwood.`,
        when: [DURING_GAME],
      },
    ],
  },
  {
    name: `Mystic Regrowth (Wizard Only)`,
    effects: [
      {
        name: `Mystic Regrowth (Wizard Only)`,
        desc: `At the end of your hero phase, if this general successfully cast any spells in that phase that were not unbound, you can heal D3 wounds allocated to this general.`,
        when: [END_OF_HERO_PHASE],
      },
    ],
  },
  {
    name: `Voice of Warding (Wizard Only)`,
    effects: [
      {
        name: `Voice of Warding (Wizard Only)`,
        desc: `This general can attempt to unbind 1 extra spell in the enemy hero phase.`,
        when: [HERO_PHASE],
      },
    ],
  },
  {
    name: `Glade Lore (Wizard Only)`,
    effects: [
      {
        name: `Glade Lore (Wizard Only)`,
        desc: `Add 1 to casting rolls for this general while it is wholly within 6" of any AWAKENED WYLDWOODS.`,
        when: [HERO_PHASE],
      },
    ],
  },
  {
    name: `Spellsinger (Wizard Only)`,
    effects: [
      {
        name: `Spellsinger (Wizard Only)`,
        desc: `Add 6" to the range of each spell this general successfully casts.`,
        when: [HERO_PHASE],
      },
    ],
  },
  {
    name: `Radiant Spirit (Wizard Only)`,
    effects: [
      {
        name: `Radiant Spirit (Wizard Only)`,
        desc: `Each time this general is affected by a spell or endless spell, you can roll a D6. If you do so, on a 4+ ignore the effects of that spell or endless spell on this general.`,
        when: [HERO_PHASE],
      },
    ],
  },
]

export default CommandTraits

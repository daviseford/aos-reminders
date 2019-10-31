import { TTraits } from 'types/army'
import {
  START_OF_HERO_PHASE,
  BATTLESHOCK_PHASE,
  COMBAT_PHASE,
  START_OF_SETUP,
  DURING_GAME,
  CHARGE_PHASE,
  HERO_PHASE,
  SHOOTING_PHASE,
} from 'types/phases'

const CommandTraits: TTraits = [
  {
    name: `Furious Guzzler`,
    effects: [
      {
        name: `Furious Guzzler`,
        desc: `At the start of your hero phase, if this general is eating, you can heal up to D3 wounds allocated to them.`,
        when: [START_OF_HERO_PHASE],
      },
    ],
  },
  {
    name: `Prodigious Girth`,
    effects: [
      {
        name: `Prodigious Girth`,
        desc: `Add 2 to this general's Wounds characteristic.`,
        when: [DURING_GAME],
      },
    ],
  },
  {
    name: `Killer Reputation`,
    effects: [
      {
        name: `Killer Reputation`,
        desc: `Before this general is set up for the first time, you can pick a second big name for them. Their second big name cannot be the same as their first big name.`,
        when: [START_OF_SETUP],
      },
    ],
  },
  {
    name: `Mighty Bellower`,
    effects: [
      {
        name: `Mighty Bellower`,
        desc: `If an enemy unit fails a battleshock test within 6 of this general, add D3 to the number of models that flee.`,
        when: [BATTLESHOCK_PHASE],
      },
    ],
  },
  {
    name: `An Eye for Loot`,
    effects: [
      {
        name: `An Eye for Loot`,
        desc: `You can re-roll hit and wound rolls for attacks made with melee weapons by this general that target an enemy HERO with an artefact of power.`,
        when: [COMBAT_PHASE],
      },
    ],
  },
  {
    name: `Crushing Bulk`,
    effects: [
      {
        name: `Crushing Bulk`,
        desc: `This general is treated as a MONSTER for the purposes of the Trampling Charge battle trait.`,
        when: [CHARGE_PHASE],
      },
    ],
  },
  {
    name: `Questionable Hygiene`,
    effects: [
      {
        name: `Questionable Hygiene`,
        desc: `Subtract 1 from hit rolls for attacks made by enemy units while they are within 6" of this general.`,
        when: [SHOOTING_PHASE, COMBAT_PHASE],
      },
    ],
  },
  {
    name: `Herald of the Gulping God`,
    effects: [
      {
        name: `Herald of the Gulping God`,
        desc: `Friendly units do not take battleshock tests while they are wholly within 15" of this general and this general is eating.`,
        when: [BATTLESHOCK_PHASE],
      },
    ],
  },
  {
    name: `Growling Stomach`,
    effects: [
      {
        name: `Growling Stomach`,
        desc: `Subtract 2 from the Bravery characteristic of enemy units while they are within 12" of this general and this general is hungry.`,
        when: [BATTLESHOCK_PHASE],
      },
    ],
  },
  {
    name: `Gastromancer`,
    effects: [
      {
        name: `Gastromancer`,
        desc: `This general knows all spells from the Lore of Gutmagic.`,
        when: [HERO_PHASE],
      },
    ],
  },
  {
    name: `Rolls of Fat`,
    effects: [
      {
        name: `Rolls of Fat`,
        desc: `Add 2 to this general's Wounds characteristic.`,
        when: [DURING_GAME],
      },
    ],
  },
  {
    name: `Spell-eater`,
    effects: [
      {
        name: `Spell-eater`,
        desc: `Each time this general dispels an endless spell, you can heal any wounds allocated to them. If this general has no wounds allocated to them, you can instead add 1 to this general's Wounds characteristic until the end of the battle. In addition, each time this general dispels an endless spell, they can cast 1 additional spell in that phase.`,
        when: [HERO_PHASE],
      },
    ],
  },
  {
    name: ``,
    effects: [
      {
        name: ``,
        desc: ``,
        when: [],
      },
    ],
  },
  {
    name: ``,
    effects: [
      {
        name: ``,
        desc: ``,
        when: [],
      },
    ],
  },
  {
    name: ``,
    effects: [
      {
        name: ``,
        desc: ``,
        when: [],
      },
    ],
  },
  {
    name: ``,
    effects: [
      {
        name: ``,
        desc: ``,
        when: [],
      },
    ],
  },
  {
    name: ``,
    effects: [
      {
        name: ``,
        desc: ``,
        when: [],
      },
    ],
  },
  {
    name: ``,
    effects: [
      {
        name: ``,
        desc: ``,
        when: [],
      },
    ],
  },
  {
    name: ``,
    effects: [
      {
        name: ``,
        desc: ``,
        when: [],
      },
    ],
  },
  {
    name: ``,
    effects: [
      {
        name: ``,
        desc: ``,
        when: [],
      },
    ],
  },
  {
    name: ``,
    effects: [
      {
        name: ``,
        desc: ``,
        when: [],
      },
    ],
  },
  {
    name: ``,
    effects: [
      {
        name: ``,
        desc: ``,
        when: [],
      },
    ],
  },
  {
    name: ``,
    effects: [
      {
        name: ``,
        desc: ``,
        when: [],
      },
    ],
  },
  {
    name: ``,
    effects: [
      {
        name: ``,
        desc: ``,
        when: [],
      },
    ],
  },
  {
    name: ``,
    effects: [
      {
        name: ``,
        desc: ``,
        when: [],
      },
    ],
  },
]

export default CommandTraits

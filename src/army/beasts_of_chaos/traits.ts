import { TCommandTraits } from 'types/army'
import { HERO_PHASE } from 'types/phases'

const CommandTraits: TCommandTraits = [
  {
    name: `Bestial Cunning (Brayherd)`,
    effects: [
      {
        name: `Bestial Cunning (Brayherd)`,
        desc: `Up to half (rounding down) of the friendly reserve units set up in ambush (see Brayherd Ambush, page 61) can arrive in your second movement phase instead of your first.`,
        when: [],
      },
    ],
  },
  {
    name: `Indomitable Beast (Brayherd)`,
    effects: [
      {
        name: `Indomitable Beast (Brayherd)`,
        desc: `Add 1 to this general’s Wounds characteristic.`,
        when: [],
      },
    ],
  },
  {
    name: `Apex Predator (Brayherd)`,
    effects: [
      {
        name: `Apex Predator (Brayherd)`,
        desc: `Re-roll wound rolls of 1 for attacks made by this general.`,
        when: [],
      },
    ],
  },
  {
    name: `Malevolent Despoiler (Brayherd)`,
    effects: [
      {
        name: `Malevolent Despoiler (Brayherd)`,
        desc: `Enemy units cannot receive the benefit of cover while they are within 12" of this general.`,
        when: [],
      },
    ],
  },
  {
    name: `Oracle of the Dark Tongue (Brayherd)`,
    effects: [
      {
        name: `Oracle of the Dark Tongue (Brayherd)`,
        desc: `Subtract 1 from the Bravery characteristic of enemy units while they are within 12" of this general.`,
        when: [],
      },
    ],
  },
  {
    name: `Shadowpelt (Brayherd)`,
    effects: [
      {
        name: `Shadowpelt (Brayherd)`,
        desc: `Subtract 1 from hit rolls for attacks that target this general made by models more than 3" away from the general.`,
        when: [],
      },
    ],
  },
  {
    name: `Eater of Heroes (Warherd)`,
    effects: [
      {
        name: `Eater of Heroes (Warherd)`,
        desc: `You can re-roll failed hit rolls for attacks made by this general that target an enemy HERO.`,
        when: [],
      },
    ],
  },
  {
    name: `Rampant Juggernaut (Warherd)`,
    effects: [
      {
        name: `Rampant Juggernaut (Warherd)`,
        desc: `You can re-roll charge rolls made for friendly WARHERD units wholly within 12" of this general.`,
        when: [],
      },
    ],
  },
  {
    name: `Gorger (Warherd)`,
    effects: [
      {
        name: `Gorger (Warherd)`,
        desc: `Do not roll a D3 to determine the number of wounds healed by the Bloodgorge battle trait (pg 61) for friendly WARHERD units that are wholly within 12" of this general. Instead, the battle trait heals 3 wounds allocated to that unit.`,
        when: [],
      },
    ],
  },
  {
    name: `Gouge-tusks (Warherd)`,
    effects: [
      {
        name: `Gouge-tusks (Warherd)`,
        desc: `At the end of the combat phase, pick an enemy unit within 3" of this general and roll a dice. On a 1, nothing happens. On a 2-5, that unit suffers 1 mortal wound. On a 6 that unit suffers D3 mortal wounds.`,
        when: [],
      },
    ],
  },
  {
    name: `Roaring Brute (Warherd)`,
    effects: [
      {
        name: `Roaring Brute (Warherd)`,
        desc: `Subtract 1 from the Bravery characteristic of enemy units while they are within 12" of this general.`,
        when: [],
      },
    ],
  },
  {
    name: `Rugged Hide (Warherd)`,
    effects: [
      {
        name: `Rugged Hide (Warherd)`,
        desc: `Worsen the Rend characteristic of attacks that target this general by 1 (to a minimum of ‘-’).`,
        when: [],
      },
    ],
  },
  {
    name: `Tempestuous Tyrant (Thunderscorn)`,
    effects: [
      {
        name: `Tempestuous Tyrant (Thunderscorn)`,
        desc: `You can re-roll failed wound rolls for attacks made by this general that target a MONSTER.`,
        when: [],
      },
    ],
  },
  {
    name: `Magnetic Monstrosity (Thunderscorn)`,
    effects: [
      {
        name: `Magnetic Monstrosity (Thunderscorn)`,
        desc: `Enemy units cannot retreat while they are within 3" of this general.`,
        when: [],
      },
    ],
  },
  {
    name: `Father of the Storm (Thunderscorn)`,
    effects: [
      {
        name: `Father of the Storm (Thunderscorn)`,
        desc: `When you use the Creatures of the Storm battle trait, you can re-roll the dice that determines how far units can move if this general is on the battlefield.`,
        when: [],
      },
    ],
  },
  {
    name: `Lightning-fast Monstrosity (Thunderscorn)`,
    effects: [
      {
        name: `Lightning-fast Monstrosity (Thunderscorn)`,
        desc: `This general fights at the start of the combat phase if it made a charge move in the same turn, before the players start picking any other units to fight in that combat phase.`,
        when: [],
      },
    ],
  },
  {
    name: `Adamantine Scales (Thunderscorn)`,
    effects: [
      {
        name: `Adamantine Scales (Thunderscorn)`,
        desc: `Add 1 to the Save characteristic of this general.`,
        when: [],
      },
    ],
  },
  {
    name: `Ancient Beyond Knowing (Thunderscorn)`,
    effects: [
      {
        name: `Ancient Beyond Knowing (Thunderscorn)`,
        desc: `At the start of the first battle round, you receive D3 additional command points.`,
        when: [],
      },
    ],
  },
  
]

export default CommandTraits

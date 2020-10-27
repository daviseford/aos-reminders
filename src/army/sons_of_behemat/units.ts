import { TBattalions, TUnits } from 'types/army'
import { CHARGE_PHASE, COMBAT_PHASE, HERO_PHASE } from 'types/phases'

const AlmightyStompEffect = {
  name: `Almighty Stomp`,
  desc: `You can reroll hit rolls of 1 for Almighty Stomp attacks unless the target is a MONSTER.`,
  when: [COMBAT_PHASE],
}
const CrushingChargeEffect = {
  name: `Crushing Charge`,
  desc: `After this model makes a charge move, roll a dice for each enemy unit within 1" of this model. On a 24, that unit suffers D3 mortal wounds if it is a MONSTER, or D6 mortal wounds if it is not a MONSTER.`,
  when: [CHARGE_PHASE],
}
const DeathGripEffect = {
  name: `Death Grip`,
  desc: `You can reroll hit rolls of 1 for Death Grip attacks that target a MONSTER-`,
  when: [HERO_PHASE],
}

// Unit Names
export const Units: TUnits = [
  {
    name: `Kraken-eater Mega-Gargant`,
    effects: [
      AlmightyStompEffect,
      CrushingChargeEffect,
      {
        name: ``,
        desc: ``,
        when: [HERO_PHASE],
      },
    ],
  },
  {
    name: `Gatebreaker Mega-Gargant`,
    effects: [
      {
        name: ``,
        desc: ``,
        when: [HERO_PHASE],
      },
    ],
  },
  {
    name: `Warstomper Mega-Gargant`,
    effects: [
      {
        name: ``,
        desc: ``,
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
        when: [HERO_PHASE],
      },
    ],
  },
]

// Allied units (usually this will involve writing a function to grab units from another army)
// Check out Nurgle or Khorne for good examples
export const AlliedUnits: TUnits = []

// Battalions
export const Battalions: TBattalions = [
  {
    name: ``,
    effects: [
      {
        name: ``,
        desc: ``,
        when: [HERO_PHASE],
      },
    ],
  },
]

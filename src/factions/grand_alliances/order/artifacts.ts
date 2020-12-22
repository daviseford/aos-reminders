import { tagAs } from 'factions/metatagger'
import { COMBAT_PHASE, HERO_PHASE, START_OF_COMBAT_PHASE } from 'types/phases'

const OrderArtifacts = {
  'Quicksilver Potion (Order)': {
    effects: [
      {
        name: `Quicksilver Potion (Order)`,
        desc: `Once per battle, at the start of the combat phase, you can use this potion. If you do so, in that combat phase, the bearer (and its mount, if it has one) fights immediately, instead of fighting later in that combat phase.`,
        when: [START_OF_COMBAT_PHASE],
      },
    ],
  },
  'Obstinate Blade (Order)': {
    effects: [
      {
        name: `Obstinate Blade (Order)`,
        desc: `Pick one of the bearer's melee weapons. Improve the Rend characteristic of the weapon by 1.`,
        when: [COMBAT_PHASE],
      },
    ],
  },
  'Relic Blade (Order)': {
    effects: [
      {
        name: `Relic Blade (Order)`,
        desc: `Pick one of the bearer's melee weapons. Increase the Damage characteristic of that weapon by 1.`,
        when: [COMBAT_PHASE],
      },
    ],
  },
  'Hoarfrost (Order)': {
    effects: [
      {
        name: `Hoarfrost (Order)`,
        desc: `Pick one of the bearer's melee weapons. If an enemy model is allocated any wounds from this weapon and is not slain, subtract 1 from that model's hit rolls for the rest of the battle.`,
        when: [COMBAT_PHASE],
      },
    ],
  },
  'Talisman of Blinding Light (Order)': {
    effects: [
      {
        name: `Talisman of Blinding Light (Order)`,
        desc: `Once per battle, at the start of the combat phase, you can use this amulet. If you do so, in that combat phase, subtract 1 from hit rolls made for attacks that target the bearer.`,
        when: [START_OF_COMBAT_PHASE],
      },
    ],
  },
  'Phoenix Stone (Order)': {
    effects: [
      {
        name: `Phoenix Stone (Order)`,
        desc: `In each hero phase, you can heal 1 wound that has been allocated to the bearer.`,
        when: [HERO_PHASE],
      },
    ],
  },
}

export default tagAs(OrderArtifacts, 'artifact')

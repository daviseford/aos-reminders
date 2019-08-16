import { TArtifacts } from 'types/army'
import { COMBAT_PHASE, HERO_PHASE, START_OF_COMBAT_PHASE } from 'types/phases'
import { ORDER } from 'meta/alliances'

const OrderArtifacts: TArtifacts = [
  {
    name: `Quicksilver Potion (${ORDER})`,
    effects: [
      {
        name: `Quicksilver Potion (${ORDER})`,
        desc: `Once per battle, at the start of the combat phase, you can use this potion. If you do so, in that combat phase, the bearer (and its mount, if it has one) fights immediately, instead of fighting later in that combat phase.`,
        when: [START_OF_COMBAT_PHASE],
      },
    ],
  },
  {
    name: `Obstinate Blade (${ORDER})`,
    effects: [
      {
        name: `Obstinate Blade (${ORDER})`,
        desc: `Pick one of the bearer's melee weapons. Improve the Rend characteristic of the weapon by 1.`,
        when: [COMBAT_PHASE],
      },
    ],
  },
  {
    name: `Relic Blade (${ORDER})`,
    effects: [
      {
        name: `Relic Blade (${ORDER})`,
        desc: `Pick one of the bearer's melee weapons. Increase the Damage characteristic of that weapon by 1.`,
        when: [COMBAT_PHASE],
      },
    ],
  },
  {
    name: `Hoarfrost (${ORDER})`,
    effects: [
      {
        name: `Hoarfrost (${ORDER})`,
        desc: `Pick one of the bearer's melee weapons. If an enemy model is allocated any wounds from this weapon and is not slain, subtract 1 from that model's hit rolls for the rest of the battle.`,
        when: [COMBAT_PHASE],
      },
    ],
  },
  {
    name: `Talisman of Blinding Light (${ORDER})`,
    effects: [
      {
        name: `Talisman of Blinding Light (${ORDER})`,
        desc: `Once per battle, at the start of the combat phase, you can use this amulet. If you do so, in that combat phase, subtract 1 from hit rolls made for attacks that target the bearer.`,
        when: [START_OF_COMBAT_PHASE],
      },
    ],
  },
  {
    name: `Pheonix Stone (${ORDER})`,
    effects: [
      {
        name: `Pheonix Stone (${ORDER})`,
        desc: `In each hero phase, you can heal 1 wound that has been allocated to the bearer.`,
        when: [HERO_PHASE],
      },
    ],
  },
]

export default OrderArtifacts

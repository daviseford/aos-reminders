import { TArtifacts } from 'types/army'
import {
  BATTLESHOCK_PHASE,
  CHARGE_PHASE,
  COMBAT_PHASE,
  DURING_ROUND,
  HERO_PHASE,
  START_OF_COMBAT_PHASE,
  START_OF_HERO_PHASE,
} from 'types/phases'

const Artifacts: TArtifacts = [
  {
    name: `Signet of the First Court (Royal Treasury)`,
    effects: [
      {
        name: `Signet of the First Court (Royal Treasury)`,
        desc: `If the unmodified wound roll for an attack made by the bearer with a melee weapon is 6, add 1 to the damage inflicted by that attack.`,
        when: [COMBAT_PHASE],
      },
    ],
  },
  {
    name: `Splintervane Brooch (Royal Treasury)`,
    effects: [
      {
        name: `Splintervane Brooch (Royal Treasury)`,
        desc: `Subtract 1 from casting rolls for enemy WIZARDS while they are within 18" of the bearer.`,
        when: [HERO_PHASE],
      },
    ],
  },
  {
    name: `Blood-river Chalice (Royal Treasury)`,
    effects: [
      {
        name: `Blood-river Chalice (Royal Treasury)`,
        desc: `Once per battle, at the start of your hero phase, the bearer can use this artifact. If they do so, heal up to D6 wounds allocated to the bearer.`,
        when: [START_OF_HERO_PHASE],
      },
    ],
  },
  {
    name: `The Grim Garland (Royal Treasury)`,
    effects: [
      {
        name: `The Grim Garland (Royal Treasury)`,
        desc: `Subtract 2 from the Bravery characteristic of enemy units while they are within 6" of the bearer.`,
        when: [BATTLESHOCK_PHASE],
      },
    ],
  },
  {
    name: `The Dermal Robe (Royal Treasury)`,
    effects: [
      {
        name: `The Dermal Robe (Royal Treasury)`,
        desc: `Add 1 to casting, dispelling and unbinding rolls for the bearer.`,
        when: [HERO_PHASE],
      },
    ],
  },
  {
    name: `Heart of the Gargant (Royal Treasury)`,
    effects: [
      {
        name: `Heart of the Gargant (Royal Treasury)`,
        desc: `Once per battle, at the start of the combat phase, the bearer can use this artifact. If they do so, you can re-roll failed wound rolls for the bearer and their mount in that phase.`,
        when: [START_OF_COMBAT_PHASE],
      },
    ],
  },
  {
    name: `Keening Bone (Noble Heirlooms)`,
    effects: [
      {
        name: `Keening Bone (Noble Heirlooms)`,
        desc: `Pick one of the bearer's melee weapons. Increase the Range characteristic of that weapon to 3".`,
        when: [COMBAT_PHASE],
      },
    ],
  },
  {
    name: `Medal of Madness (Noble Heirlooms)`,
    effects: [
      {
        name: `Medal of Madness (Noble Heirlooms)`,
        desc: `Once per battle round, the bearer can use a command ability on their warscroll without a command point being spent, and they are treated as if they were a general when they do so.`,
        when: [DURING_ROUND],
      },
    ],
  },
  {
    name: `The Flayed Pennant (Noble Heirlooms)`,
    effects: [
      {
        name: `The Flayed Pennant (Noble Heirlooms)`,
        desc: `You can re-roll charge rolls for friendly FLESH- EATER COURTS units wholly within 12" of the bearer.`,
        when: [CHARGE_PHASE],
      },
    ],
  },
  {
    name: `Carrion Wand (Noble Heirlooms)`,
    effects: [
      {
        name: `Carrion Wand (Noble Heirlooms)`,
        desc: `In your hero phase, the bearer can attempt to cast the Arcane Bolt spell as if they were a WIZARD. If the bearer is a WIZARD, add 1 to the casting roll when they attempt to cast Arcane Bolt instead.`,
        when: [HERO_PHASE],
      },
    ],
  },
  {
    name: `The Fleshform Rament (Noble Heirlooms)`,
    effects: [
      {
        name: `The Fleshform Rament (Noble Heirlooms)`,
        desc: `Subtract 1 from the Bravery characteristic of enemy units while they are within 3" of the bearer.`,
        when: [BATTLESHOCK_PHASE],
      },
    ],
  },
  {
    name: `The Bilious Decanter (Noble Heirlooms)`,
    effects: [
      {
        name: `The Bilious Decanter (Noble Heirlooms)`,
        desc: `Once per battle, at the start of the combat phase, the bearer can use this artifact. If they do so, add 2 to the Attacks characteristic of the bearer's melee weapons in that phase.`,
        when: [START_OF_COMBAT_PHASE],
      },
    ],
  },
]

export default Artifacts

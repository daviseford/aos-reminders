import { tagAs } from 'factions/metatagger'
import {
  BATTLESHOCK_PHASE,
  CHARGE_PHASE,
  COMBAT_PHASE,
  DURING_ROUND,
  HERO_PHASE,
  SHOOTING_PHASE,
  START_OF_COMBAT_PHASE,
  START_OF_HERO_PHASE,
} from 'types/phases'

// Add individual artifacts here, and access them in other files!
const Artifacts = {
  'Signet of the First Court (Royal Treasury)': {
    effects: [
      {
        name: `Signet of the First Court (Royal Treasury)`,
        desc: `If the unmodified wound roll for an attack made by the bearer with a melee weapon is 6, add 1 to the damage inflicted by that attack.`,
        when: [COMBAT_PHASE],
      },
    ],
  },
  'Splintervane Brooch (Royal Treasury)': {
    effects: [
      {
        name: `Splintervane Brooch (Royal Treasury)`,
        desc: `Subtract 1 from casting rolls for enemy WIZARDS while they are within 18" of the bearer.`,
        when: [HERO_PHASE],
      },
    ],
  },
  'Blood-river Chalice (Royal Treasury)': {
    effects: [
      {
        name: `Blood-river Chalice (Royal Treasury)`,
        desc: `Once per battle, at the start of your hero phase, the bearer can use this artifact. If they do so, heal up to D6 wounds allocated to the bearer.`,
        when: [START_OF_HERO_PHASE],
      },
    ],
  },
  'The Grim Garland (Royal Treasury)': {
    effects: [
      {
        name: `The Grim Garland (Royal Treasury)`,
        desc: `Subtract 2 from the Bravery characteristic of enemy units while they are within 6" of the bearer.`,
        when: [BATTLESHOCK_PHASE],
      },
    ],
  },
  'The Dermal Robe (Royal Treasury)': {
    effects: [
      {
        name: `The Dermal Robe (Royal Treasury)`,
        desc: `Add 1 to casting, dispelling and unbinding rolls for the bearer.`,
        when: [HERO_PHASE],
      },
    ],
  },
  'Heart of the Gargant (Royal Treasury)': {
    effects: [
      {
        name: `Heart of the Gargant (Royal Treasury)`,
        desc: `Once per battle, at the start of the combat phase, the bearer can use this artifact. If they do so, you can reroll failed wound rolls for the bearer and their mount in that phase.`,
        when: [START_OF_COMBAT_PHASE],
      },
    ],
  },
  'Keening Bone (Noble Heirlooms)': {
    effects: [
      {
        name: `Keening Bone (Noble Heirlooms)`,
        desc: `Pick one of the bearer's melee weapons. Increase the Range characteristic of that weapon to 3".`,
        when: [COMBAT_PHASE],
      },
    ],
  },
  'Medal of Madness (Noble Heirlooms)': {
    effects: [
      {
        name: `Medal of Madness (Noble Heirlooms)`,
        desc: `Once per battle round, the bearer can use a command ability on their warscroll without a command point being spent, and they are treated as if they were a general when they do so.`,
        when: [DURING_ROUND],
      },
    ],
  },
  'The Flayed Pennant (Noble Heirlooms)': {
    effects: [
      {
        name: `The Flayed Pennant (Noble Heirlooms)`,
        desc: `You can reroll charge rolls for friendly FLESH-EATER COURTS units wholly within 12" of the bearer.`,
        when: [CHARGE_PHASE],
      },
    ],
  },
  'Carrion Wand (Noble Heirlooms)': {
    effects: [
      {
        name: `Carrion Wand (Noble Heirlooms)`,
        desc: `In your hero phase, the bearer can attempt to cast the Arcane Bolt spell as if they were a WIZARD. If the bearer is a WIZARD, add 1 to the casting roll when they attempt to cast Arcane Bolt instead.`,
        when: [HERO_PHASE],
      },
    ],
  },
  'The Fleshform Raiment (Noble Heirlooms)': {
    effects: [
      {
        name: `The Fleshform Raiment (Noble Heirlooms)`,
        desc: `Subtract 1 from the Bravery characteristic of enemy units while they are within 3" of the bearer.`,
        when: [BATTLESHOCK_PHASE],
      },
    ],
  },
  'The Bilious Decanter (Noble Heirlooms)': {
    effects: [
      {
        name: `The Bilious Decanter (Noble Heirlooms)`,
        desc: `Once per battle, at the start of the combat phase, the bearer can use this artifact. If they do so, add 2 to the Attacks characteristic of the bearer's melee weapons in that phase.`,
        when: [START_OF_COMBAT_PHASE],
      },
    ],
  },
  'Decrepit Coronet': {
    effects: [
      {
        name: `Decrepit Coronet`,
        desc: `Do not take battleshock tests for friendly MORGAUNT units while they are wholly within 12" of the bearer, or wholly within 18" of the bearer if the bearer is your general.`,
        when: [BATTLESHOCK_PHASE],
      },
    ],
  },
  'Corpsefane Gauntlet': {
    effects: [
      {
        name: `Corpsefane Gauntlet`,
        desc: `After this model makes a charge move, you can pick 1 enemy unit within 1" of this model and roll a D6. On a 2+ that enemy unit suffers D3 mortal wounds.`,
        when: [CHARGE_PHASE],
      },
    ],
  },
  'Eye of Hysh': {
    effects: [
      {
        name: `Eye of Hysh`,
        desc: `Subtract 1 from hit rolls for attacks made with missile weapons that target a friendly BLISTERSKIN unit wholly within 6" of the bearer.`,
        when: [SHOOTING_PHASE],
      },
    ],
  },
  'Ghurish Mawshard': {
    effects: [
      {
        name: `Ghurish Mawshard`,
        desc: `Once per battle, at the start of the combat phase, you can pick 1 enemy model within 1" of the bearer and roll a D6. If the roll is greater than that model's Wounds characteristic, that model is slain.`,
        when: [START_OF_COMBAT_PHASE],
      },
    ],
  },
}

// Always export using tagAs
export default tagAs(Artifacts, 'artifact')

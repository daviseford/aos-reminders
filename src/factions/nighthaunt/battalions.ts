import { tagAs } from 'factions/metatagger'
import {
  BATTLESHOCK_PHASE,
  COMBAT_PHASE,
  DURING_ROUND,
  END_OF_SETUP,
  HERO_PHASE,
  MOVEMENT_PHASE,
  SAVES_PHASE,
  WOUND_ALLOCATION_PHASE,
} from 'types/phases'

const Battalions = {
  'Nighthaunt Procession': {
    effects: [
      {
        name: `Nighthaunt Procession`,
        desc: `Roll a D6 each time you allocate a wound or mortal wound to a friendly NIGHTHAUNT model from this battalion within 12" of your general or a friendly NIGHTHAUNT HERO from the battalion. On a 6+ the wound is negated. If this battalion is part of a Nighthaunt army, this ability replaces the Deathless Spirits battle trait for all units in this battalion.`,
        when: [WOUND_ALLOCATION_PHASE],
      },
    ],
  },
  Shroudguard: {
    effects: [
      {
        name: `Shroudguard`,
        desc: `Roll a D6 each time you allocate a wound or mortal wound to a BLADEGHEIST REVENANT model from a unit in this battalion wholly within 12" of a KNIGHT OF SHROUDS or REIKENOR THE GRIMHAILER from the same battalion. On a 5+, that wound or mortal wound is negated. If you use this ability, you cannot also use the Deathless Spirits battle trait to try to negate the same wound or mortal wound.`,
        when: [WOUND_ALLOCATION_PHASE],
      },
    ],
  },
  Deathriders: {
    effects: [
      {
        name: `Deathriders`,
        desc: `Add 1 to charge rolls for units from this battalion. In addition, if you make an unmodified charge roll of 9+ for a unit from this battalion, it can fight immediately after you complete the charge move. This does not stop the unit from being picked to fight in the combat phase of the same turn. If this battalion is part of a Nighthaunt army, this ability replaces the Wave of Terror battle trait for all units in this battalion.`,
        when: [MOVEMENT_PHASE],
      },
    ],
  },
  'The Condemned': {
    effects: [
      {
        name: `The Condemned`,
        desc: `You can reroll failed hit rolls for attacks made by CHAINRASP HORDE units from this battalion while they are wholly within 16" of this battalion's SPIRIT TORMENT or CHAINGHASTS.`,
        when: [COMBAT_PHASE],
      },
    ],
  },
  Chainguard: {
    effects: [
      {
        name: `Chainguard`,
        desc: `Each time a CHAINRASP HORDE from this battalion is affected by a Spectral Lure or Temporal Translocation spell cast by this battalion's GUARDIAN OF SOULS, you can return D6 slain models to that unit (in addition to any models returned to the unit by the Spectral Lure)`,
        when: [HERO_PHASE],
      },
    ],
  },
  'Execution Horde': {
    effects: [
      {
        name: `Execution Horde`,
        desc: `Subtract 1 from hit rolls for attacks that target this battalion's LORD EXECUTIONER while a SPIRIT HOST unit from this battalion is within 6" of the attacker's unit. In addition, add 1 to hit rolls for attacks made by this battalion's LORD EXECUTIONER while any SPIRIT HOST units from this battalion are within 6" of the target unit.`,
        when: [COMBAT_PHASE],
      },
    ],
  },
  'Death Stalkers': {
    effects: [
      {
        name: `Death Stalkers`,
        desc: `After set-up is complete but before the battle begins, pick one enemy unit to be soul-marked by this battalion. Add 1 to hit and wound rolls for attacks made by units from this battalion that target the soul-marked unit.`,
        when: [END_OF_SETUP],
      },
    ],
  },
  'Shrieker Host': {
    effects: [
      {
        name: `Shrieker Host`,
        desc: `Reroll battleshock rolls of 1 for enemy units that are within 6" of any units from this battalion at the start of the battleshock phase. In addition, the Inspiring Presence command ability cannot be used on enemy units that are within 6" of any units from this battalion.`,
        when: [BATTLESHOCK_PHASE],
      },
    ],
  },
  'The Forgotten Scions': {
    effects: [
      {
        name: `Gharest Malcor, The Traitor Knight`,
        desc: `Add 1 to the Attacks characteristic of Malcor's Sword of Stolen Hours.`,
        when: [COMBAT_PHASE],
      },
      {
        name: `Gharest Malcor, The Traitor Knight`,
        desc: `Once per battle round, you can use the command ability on Malcor's warscroll without a command point being spent.`,
        when: [DURING_ROUND],
      },
    ],
  },
  'The Dolorous Guard': {
    effects: [
      {
        name: `Knights of Regret`,
        desc: `Add 1 to the Attacks characteristic of melee weapons used by units from this battalion that have made a charge move in the same turn.`,
        when: [COMBAT_PHASE],
      },
      {
        name: `Knights of Regret`,
        desc: `Roll a D6 before you allocate a wound or mortal wound to your general if your general is within 3" of any friendly units with this ability. On a 2+, you must allocate that wound or mortal wound to a friendly unit with this ability that is within 3" of your general, instead of to your general.`,
        when: [WOUND_ALLOCATION_PHASE],
      },
    ],
  },
  'The Emerald Host': {
    effects: [
      {
        name: `The Emerald Curse`,
        desc: `After armies are set up, but before the first battle round begins, you can pick 1 enemy HERO. Subtract 1 from save rolls for attacks that target that HERO.`,
        when: [END_OF_SETUP],
      },
      {
        name: `The Emerald Curse`,
        desc: `If active, subtract 1 from save rolls for attacks that target that HERO.`,
        when: [SAVES_PHASE],
      },
    ],
  },
}

// Always export using tagAs
export default tagAs(Battalions, 'battalion')

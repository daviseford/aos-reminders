import { tagAs } from 'factions/metatagger'
import { NIGHTHAUNT } from 'meta/factions'
import {
  BATTLESHOCK_PHASE,
  CHARGE_PHASE,
  COMBAT_PHASE,
  DURING_GAME,
  DURING_SETUP,
  END_OF_SETUP,
  HERO_PHASE,
  SAVES_PHASE,
  WOUND_ALLOCATION_PHASE,
} from 'types/phases'

const BattleTraits = {
  [NIGHTHAUNT]: {
    effects: [
      {
        name: `Aura of Dread`,
        desc: `Subtract 1 from the Bravery characteristic of enemy units while they are within 6" of any friendly NIGHTHAUNT units.`,
        when: [BATTLESHOCK_PHASE],
      },
      {
        name: `Deathless Spirit`,
        desc: `Roll a D6 each time you allocate a wound or mortal wound to a friendly NIGHTHAUNT model from a unit wholly within 12" of your general or a friendly NIGHTHAUNT HERO. On a 6+, that wound or mortal wound is negated.`,
        when: [WOUND_ALLOCATION_PHASE],
      },
      {
        name: `From the Underworlds They Come`,
        desc: `Instead of setting up a NIGHTHAUNT unit on the battlefield, you can place it to one side and say that it is set up in the underworlds as a reserve unit. You can set up one unit in the underworlds for each unit you set up on the battlefield. At the end of your movement phase you can set up any of these units more than 9" from any enemy models. This counts as their move for that turn. Any units which are not set up on the battlefield before the start of the fourth battle round are slain.`,
        when: [DURING_SETUP],
      },
      {
        name: `Feed On Terror`,
        desc: `Each time an enemy unit fails a battleshock test, pick one friendly NIGHTHAUNT HERO within 6" of that enemy unit. Heal 1 wound that has been allocated to that HERO.`,
        when: [BATTLESHOCK_PHASE],
      },
      {
        name: `Wave of Terror`,
        desc: `If you make an unmodified charge roll of 10+ for a friendly NIGHTHAUNT unit, it can fight immediately after you complete the charge move. This does not stop the unit from being picked to fight in the combat phase of the same turn.`,
        when: [CHARGE_PHASE],
      },
    ],
  },
  // The Emerald Host
  'The Emerald Curse': {
    effects: [
      {
        name: `The Emerald Curse`,
        desc: `Pick 1 enemy hero. Subtract 1 from the target's save rolls for the duration of the battle.`,
        when: [END_OF_SETUP],
      },
      {
        name: `The Emerald Curse`,
        desc: `Subtract 1 from the debuffed unit's save rolls.`,
        when: [SAVES_PHASE],
      },
    ],
  },
  'Knights of Regret': {
    effects: [
      {
        name: `Knights of Regret`,
        desc: `Add 1 to the melee attacks characteristic of Emerald Host Hexwraiths that have charged this turn.`,
        when: [CHARGE_PHASE, COMBAT_PHASE],
      },
      {
        name: `Knights of Regret`,
        desc: `If your general is within 3" of any friendly Emerald Host Hexwraiths, roll a D6 for each allocated wound applied to the general. On a 2+, you must allocate the wound to the Hexwraiths instead.`,
        when: [WOUND_ALLOCATION_PHASE],
      },
    ],
  },
  // Reikenor's Condemned
  'Unrelenting Taskmasters': {
    effects: [
      {
        name: `Unrelenting Taskmasters`,
        desc: `You can reroll failed hit rolls for Reikenor's Condemned Chainrasp Horde and Glaivewraith stalker units wholly within 15" of any friendly Reikenor's Condemned Spirit Torments or Chainghasts.`,
        when: [COMBAT_PHASE],
      },
      {
        name: `Unrelenting Taskmasters`,
        desc: `Each time a friendly Reikenor's Condemned Chainrasp Horde or Glaivewraith stalker unit is affected by Spectral Lure or Temporal Translocation cast from a Guardian of Souls, you can return D6 slain models in addition to any others.`,
        when: [HERO_PHASE],
      },
    ],
  },
  'Acolyte of the Grimhailer': {
    effects: [
      {
        name: `Acolyte of the Grimhailer`,
        desc: `Reikenor the Grimhailer counts as an additional general in your army.`,
        when: [DURING_GAME],
      },
    ],
  },
}

// Always export using tagAs
export default tagAs(BattleTraits, 'battle_trait')

import { tagAs } from 'factions/metatagger'
import meta_rule_sources from 'meta/rule_sources'
import {
  CHARGE_PHASE,
  DURING_GAME,
  END_OF_SETUP,
  HERO_PHASE,
  MOVEMENT_PHASE,
  SHOOTING_PHASE,
  START_OF_SETUP,
  END_OF_MOVEMENT_PHASE,
  START_OF_ANY_PHASE,
  START_OF_HERO_PHASE,
  COMBAT_PHASE,
  END_OF_HERO_PHASE,
} from 'types/phases'

const AllegianceCommandTraits = {
  'ARTYCLE: Honour is Everything': {
    effects: [
      {
        name: `ARTYCLE: Honour is Everything`,
        desc: `When a friendly KHARADRON OVERLORDS unit receives the Rally command, you can return 1 slain model to the unit for each 4+ instead of each 6.`,
        when: [HERO_PHASE],
      },
    ],
  },
  'ARTYCLE: Master the Skies': {
    effects: [
      {
        name: `ARTYCLE: Master the Skies`,
        desc: `Add 2" to the Move characteristic of friendly SKYVESSELS.`,
        when: [MOVEMENT_PHASE],
      },
    ],
  },
  'ARTYCLE: Settle the Grudges': {
    effects: [
      {
        name: `ARTYCLE: Settle the Grudges`,
        desc: `After deployment but before the first battle round begins, pick 1 enemy unit, add 1 to wound rolls for attacks made by friendly KHARADRON OVERLORDS units that target that unit.`,
        when: [END_OF_SETUP],
      },
    ],
  },
  'AMENDMENT: Always Take What You Are Owed': {
    effects: [
      {
        name: `AMENDMENT: Always Take What You Are Owed`,
        desc: `At the start of your hero phase, pick 1 friendly ARKANAUT COMPANY unit. Until the start of your next hero phase, each model in that unit counts as 2 models instead of 1 for the purposes of contesting objectives.`,
        when: [HERO_PHASE],
      },
    ],
  },
  'AMENDMENT: Prosecute Wars With All Haste': {
    effects: [
      {
        name: `AMENDMENT: Prosecute Wars With All Haste`,
        desc: `Once per turn in your movement phase, when you make a run roll for a KHARADRON OVERLORDS unit, you can roll 2D6 instead of a single dice.`,
        when: [MOVEMENT_PHASE],
      },
    ],
  },
  'AMENDMENT: Trust to Your Guns': {
    effects: [
      {
        name: `AMENDMENT: Trust to Your Guns`,
        desc: `Once per turn in your shooting phase, you can reroll 1 hit roll of 1 for an attack made by a friendly KHARADRON OVERLORDS unit.`,
        when: [SHOOTING_PHASE],
      },
    ],
  },
  "FOOTNOTE: There's No Reward Without Risk": {
    effects: [
      {
        name: `FOOTNOTE: There's No Reward Without Risk`,
        desc: `Once per battle, in your charge phase, you can attempt a charge with 1 friendly KHARADRON OVERLORDS unit within 18" of an enemy unit. If you do so, roll 3D6 for the charge roll instead of 2D6.`,
        when: [CHARGE_PHASE],
      },
    ],
  },
  "FOOTNOTE: There's No Trading With Some People": {
    effects: [
      {
        name: `FOOTNOTE: There's No Trading With Some People`,
        desc: `One per battle, at the end of the enemy shooting phase, pick 1 friendly SKYFARERS unit that was targeted by any shooting attacks in that phase. That unit can immediately shoot.`,
        when: [SHOOTING_PHASE],
      },
    ],
  },
  'FOOTNOTE: Without Our Ships, We Are Naught': {
    effects: [
      {
        name: `FOOTNOTE: Without Our Ships, We Are Naught`,
        desc: `Once per battle, at the start of any phase, pick 1 friendly SKYVESSEL. That unit can receive up to 2 commands in that phase instead of only 1.`,
        when: [START_OF_ANY_PHASE],
      },
    ],
  },
}

const CommandTraits = {
  Grudgebearer: {
    effects: [
      {
        name: `Grudgebearer`,
        desc: `After deployment but before the start of the first battle round, pick 1 enemy HERO. Double the damage inflicted by each successful attack made with this general's weapons that target that HERO.`,
        when: [END_OF_SETUP],
      },
    ],
  },
  'Cunning Fleetmaster': {
    effects: [
      {
        name: `Cunning Fleetmaster`,
        desc: `At the end of the enemy movement phase, you can pick 1 friendly SKYVESSEL within 12" of this general and more than 12" from all enemy units. That SKYVESSEL can make a normal move.`,
        when: [END_OF_MOVEMENT_PHASE],
      },
    ],
  },
  'A Scholar and an Arkanaut': {
    effects: [
      {
        name: `A Scholar and an Arkanaut`,
        desc: `You can pick 1 additional footnote for your army. You cannot pick a footnote your army already has.`,
        when: [START_OF_SETUP],
      },
    ],
  },
  'Old Skydog': {
    effects: [
      {
        name: `Old Skydog`,
        desc: `You can pick 1 additional Great Endrinwork for your army.`,
        when: [START_OF_SETUP],
      },
    ],
  },
  'Ex-Grundstok': {
    effects: [
      {
        name: `Ex-Grundstok`,
        desc: `Friendly GRUNDSTOK units have the Battleline battlefield role. In addition, once per turn, this general can issue a command to a friendly GRUNDSTOK unit without a command point being spent.`,
        when: [START_OF_SETUP, DURING_GAME],
      },
    ],
  },
  Stormcaller: {
    effects: [
      {
        name: `Stormcaller`,
        desc: `While this general is on the battlefield, you can reroll any of the dice rolled when a friendly AETHERIC NAVIGATOR reads the winds.`,
        when: [HERO_PHASE],
      },
    ],
  },

  // Grundstok Expeditionary Force
  'Back On Your Feet!': {
    effects: [
      {
        name: `Back On Your Feet!`,
        desc: `When a friendly GRUNDSTOK EXPEDITIONARY FORCE unit receives the Rally command (core rules, 7.2), you can return 1 slain model to the unit for each 4+ instead of each 6.`,
        when: [START_OF_HERO_PHASE],
        rule_sources: [meta_rule_sources.BOOK_DAWNBRINGERS_BOOK_2],
      },
    ],
  },
  'Entrenchment Expert': {
    effects: [
      {
        name: `Entrenchment Expert`,
        desc: `When this general issues the All-out Defence command to a friendly GRUNDSTOK EXPEDITIONARY FORCE unit, until the end of the phase, that unit has a ward of 5+.
        
        Designer's Note: This effect is in addition to the normal effect of All-out Defence.`,
        when: [SHOOTING_PHASE, COMBAT_PHASE],
        rule_sources: [meta_rule_sources.BOOK_DAWNBRINGERS_BOOK_2],
      },
    ],
  },
  'Grundcorps Technician': {
    effects: [
      {
        name: `Grundcorps Technician`,
        desc: `Once per battle, at the end of your hero phase, if a friendly GRUNDSTOK GUNHAULER has been destroyed, you can roll a dice and add the number of the current battle round to the roll. On a 6+, you can set up that GRUNDSTOK GUNHAULER again on the battlefield more than 9" from all enemy units and with 5 wounds allocated to it.`,
        when: [END_OF_HERO_PHASE],
        rule_sources: [meta_rule_sources.BOOK_DAWNBRINGERS_BOOK_2],
      },
    ],
  },
}

export default tagAs({ ...AllegianceCommandTraits, ...CommandTraits }, 'command_trait')

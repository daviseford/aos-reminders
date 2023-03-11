import { tagAs } from 'factions/metatagger'
import {
  BATTLESHOCK_PHASE,
  CHARGE_PHASE,
  DURING_GAME,
  END_OF_SETUP,
  HERO_PHASE,
  MOVEMENT_PHASE,
  SHOOTING_PHASE,
  START_OF_GAME,
  START_OF_HERO_PHASE,
  START_OF_SETUP,
  WOUND_ALLOCATION_PHASE,
} from 'types/phases'
import rule_sources from './rule_sources'

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
        when: [DURING_GAME],
      },
    ],
  },
}

const CommandTraits = {
  'Master Commander': {
    effects: [
      {
        name: `Master Commander`,
        desc: `If this general is part of your army and on the battlefield, each time you spend a command point to use a command ability on this general's warscroll, roll a D6. On a 5+, you receive 1 extra command point.`,
        when: [DURING_GAME],
      },
    ],
  },
  'Bearer of the Ironstar': {
    effects: [
      {
        name: `Bearer of the Ironstar`,
        desc: `The first time this general is slain, before removing them, roll a D6. On a 2+ they are not slain, you can heal up to D3 wounds allocated to them, and any wounds remaining to be allocated to them are negated.`,
        when: [WOUND_ALLOCATION_PHASE],
      },
    ],
  },
  'Opportunistic Privateers': {
    effects: [
      {
        name: `Opportunistic Privateers`,
        desc: `If this general is part of the garrison of a SKYVESSEL that is on the battlefield after armies are set up but before the first battle round begins, you can remove that SKYVESSEL from the battlefield and set it up again anywhere more than 9" from any enemy units. If you do so, that Skyvessel cannot make a normal move or retreat in the first battle round, and units in its garrison cannot leave the garrison in the first battle round.`,
        when: [END_OF_SETUP],
        rule_sources: [rule_sources.BATTLETOME_KHARADRON_OVERLORDS, rule_sources.ERRATA_JULY_2021],
      },
    ],
  },
  'Supremely Stubborn': {
    effects: [
      {
        name: `Supremely Stubborn`,
        desc: `When you use the Incredibly Stubborn ability for this general, they can fight on a roll of 2+ instead of 4+.`,
        when: [WOUND_ALLOCATION_PHASE],
      },
    ],
  },
  'Champion of Progress': {
    effects: [
      {
        name: `Champion of Progress`,
        desc: `Do not take battleshock for friendly BARAK-NAR units while they are wholly within 12" of this general.`,
        when: [BATTLESHOCK_PHASE],
      },
    ],
  },

  'Khemist Supreme': {
    effects: [
      {
        name: `Khemist Supreme`,
        desc: `Replace the rules for this general's Aetheric Augmentation ability with:

    "In your hero phase you can pick 2 friendly SKYFARERS units wholly within 12" of this model. Until your next hero phase, you can reroll wound rolls of 1 for attacks made by those units. This ability cannot be used by an AETHER-KHEMIST that is part of a garrison, or on a friendly unit that is part of a garrison.'`,
        when: [HERO_PHASE],
      },
    ],
  },

  Wealthy: {
    effects: [
      {
        name: `Wealthy`,
        desc: `This general starts the battle with 2 shares of aether-gold instead of 1.`,
        when: [START_OF_GAME],
      },
    ],
  },
  'Tough as Old Boots': {
    effects: [
      {
        name: `Tough as Old Boots`,
        desc: `Add 2 to this general's Wounds characteristic.`,
        when: [WOUND_ALLOCATION_PHASE],
      },
    ],
  },
  Grudgebearer: {
    effects: [
      {
        name: `Grudgebearer`,
        desc: `After armies are set up, pick 1 enemy HERO. Double the damage inflicted by weapons used by this general that target that HERO.`,
        when: [END_OF_SETUP],
      },
    ],
  },
  'Cunning Fleetmaster': {
    effects: [
      {
        name: `Cunning Fleetmaster`,
        desc: `After armies are set up, but before the first battle round begins, you can make a normal move with 1 friendly SKYVESSEL. It can fly high unless it is an ARKANAUT IRONCLAD.`,
        when: [END_OF_SETUP],
      },
    ],
  },
  'War Wound': {
    effects: [
      {
        name: `War Wound`,
        desc: `Roll a D6 for this general in your hero phase. On a 1, subtract 1 from hit rolls for this general until your next hero phase. On a 2+, you receive 1 command point.`,
        when: [HERO_PHASE],
      },
    ],
  },
  'A Scholar and an Arkanaut': {
    effects: [
      {
        name: `A Scholar and an Arkanaut`,
        desc: `You can pick an extra footnote for your army: You cannot pick a footnote your army already has.`,
        when: [START_OF_SETUP],
      },
    ],
  },
  Grandmaster: {
    effects: [
      {
        name: `Grandmaster`,
        desc: `When you use this general's Endrinmaster ability, add 1 to the number of wounds the ability allows you to heal.`,
        when: [START_OF_HERO_PHASE],
      },
    ],
  },
  'Great Tinkerer': {
    effects: [
      {
        name: `Great Tinkerer`,
        desc: `Add 2 to the Attacks characteristic of this general's Gaze of Grungni weapon.`,
        when: [SHOOTING_PHASE],
      },
    ],
  },
  Endrinprofessor: {
    effects: [
      {
        name: `Endrinprofessor`,
        desc: `Once in each of your hero phases, this general can use the By Grungni, I Have My Eye On You! command ability without a command point being spent.`,
        when: [HERO_PHASE],
      },
    ],
  },
  Stormcaller: {
    effects: [
      {
        name: `Stormcaller`,
        desc: `When this general uses their Aetherstorm ability; you can reroll the dice that determines what effect it has on the enemy unit.`,
        when: [HERO_PHASE],
      },
    ],
  },
  'Ride the Winds': {
    effects: [
      {
        name: `Ride the Winds`,
        desc: `Add 3" to the Move characteristic of a SKYVESSEL that has this general in its garrison.`,
        when: [MOVEMENT_PHASE],
      },
    ],
  },
  Sceptic: {
    effects: [
      {
        name: `Sceptic`,
        desc: `Add 1 to dispelling and unbinding rolls for this general.`,
        when: [HERO_PHASE],
      },
    ],
  },
  Diviner: {
    effects: [
      {
        name: `Diviner`,
        desc: `After armies are set up, pick 1 terrain feature or objective. Do not take battleshock tests for friendly KHARADRON OVERLORDS units while they are wholly within 12" of that terrain feature or objective.`,
        when: [END_OF_SETUP],
      },
    ],
  },
  'A Nose for Gold': {
    effects: [
      {
        name: `A Nose for Gold`,
        desc: `Roll a D6 for this general in your hero phase. On a 5+, they gain 1 share of aether-gold.`,
        when: [HERO_PHASE],
      },
    ],
  },
  'Genius in the Making': {
    effects: [
      {
        name: `Genius in the Making`,
        desc: `The range of this general's Aetheric Augmentation ability is 18" instead of 12".`,
        when: [HERO_PHASE],
      },
    ],
  },
  Collector: {
    effects: [
      {
        name: `Collector`,
        desc: `If you choose this general to have an artefact of power, you can choose 1 extra friendly HERO to have an artefact of power.`,
        when: [START_OF_SETUP],
      },
    ],
  },
}

export default tagAs({ ...AllegianceCommandTraits, ...CommandTraits }, 'command_trait')

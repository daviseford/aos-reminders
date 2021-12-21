import { keyPicker } from 'factions/metatagger'
import meta_rule_sources from 'meta/rule_sources'
import {
  BATTLESHOCK_PHASE,
  COMBAT_PHASE,
  DURING_GAME,
  DURING_SETUP,
  END_OF_MOVEMENT_PHASE,
  HERO_PHASE,
  MOVEMENT_PHASE,
  SAVES_PHASE,
  SHOOTING_PHASE,
  START_OF_HERO_PHASE,
  START_OF_SETUP,
  TURN_FOUR_START_OF_ROUND,
  TURN_ONE_DURING_ROUND,
  TURN_ONE_MOVEMENT_PHASE,
  TURN_ONE_START_OF_HERO_PHASE,
} from 'types/phases'
import command_abilities from './command_abilities'
import prayers from './prayers'
import rule_sources from './rule_sources'

const Flavors = {
  Hammerhal: {
    mandatory: {
      command_abilities: [keyPicker(command_abilities, ['Righteous Purpose'])],
    },
    effects: [
      {
        name: `Banners Held High`,
        desc: `At the start of your hero phase, roll a D6 for each friendly HAMMERHAL unit that includes any Standard Bearers. For each 6, you receive 1 extra command point.`,
        when: [START_OF_HERO_PHASE],
      },
      {
        name: `The Magister of Hammerhal`,
        desc: `If your army includes AVENTIS FIRESTRIKE and he is your general, you receive 1 extra command point.`,
        when: [TURN_ONE_START_OF_HERO_PHASE],
      },
      {
        name: `The Pride of Hammerhal`,
        desc: `Do not take battleshock tests for HAMMERHAL units that are wholly within their own territory.`,
        when: [BATTLESHOCK_PHASE],
        rule_sources: [rule_sources.BATTLETOME_CITIES_OF_SIGMAR, rule_sources.ERRATA_JULY_2021],
      },
    ],
  },
  'The Living City': {
    mandatory: {
      command_abilities: [keyPicker(command_abilities, ['Strike then Melt Away'])],
    },
    effects: [
      {
        name: `Hunters of the Hidden Paths`,
        desc: `You can set up 1 reserve unit on the hidden paths for each LIVING CITY unit you have set up on the battlefield. At the end of your movement phase, you can setup 1 or more of these units on the battlefield, wholly within 6" of the edge of the battlefield and more than 9" from any enemy units. Any reserve units on the hidden paths that are not set up on the battlefield before the start of the fourth battleround are destroyed.`,
        when: [DURING_SETUP],
      },
      {
        name: `Attuned to Nature`,
        desc: `You can heal 1 wound allocated to each friendly LIVING CITY unit.`,
        when: [START_OF_HERO_PHASE],
      },
    ],
  },
  'Greywater Fastness': {
    mandatory: {
      prayers: [keyPicker(prayers, ['Rune of Unfaltering Aim'])],
      command_abilities: [keyPicker(command_abilities, ['Salvo Fire'])],
    },
    effects: [
      {
        name: `Home of the Great Ironweld Guilds`,
        desc: `Increase the Range characteristic of missile weapons used by friendly GREYWATER FASTNESS IRONWELD ARSENAL units by 3" (this does not affect the weapon's minimum range, if it has one).`,
        when: [SHOOTING_PHASE],
      },
      {
        name: `Rune Lore`,
        desc: `GREYWATER FASTNESS RUNELORDS know the Rune of Unfaltering Aim prayer.`,
        when: [HERO_PHASE],
      },
    ],
  },
  'The Phoenicium': {
    mandatory: {
      command_abilities: [keyPicker(command_abilities, ['Living Idols'])],
    },
    effects: [
      {
        name: `Vengeful Revenants`,
        desc: `Add 1 to hit and wound rolls for attacks made with melee weapons by friendly PHOENICIUM units if any friendly PHOENICIUM units have been destroyed in the same phase.`,
        when: [COMBAT_PHASE],
      },
      {
        name: `Blood of the Ur-Phoenix`,
        desc: `Add 1 to the Wounds characteristic of PHOENICIUM FROSTHEART PHOENIXES and PHOENICIUM FLAMESPYRE PHOENIXES.`,
        when: [DURING_GAME],
      },
    ],
  },
  Anvilgard: {
    mandatory: {
      command_abilities: [keyPicker(command_abilities, ['Make an Example of the Weak (Anvilgard)'])],
    },
    effects: [
      {
        name: `Illicit Dealings`,
        desc: `When you choose an Anvilgard army, you can profit from one of the following benefits of illicit dealings:

        Black Market Bounty: 1 additional friendly ANVILGARD HERO can bear an artefact of power from the Anvilgard Artefacts of Power table.

        Dabblings in Sorcery: 1 additional friendly ANVILGARD DRAGON, ANVILGARD KHARIBDYSS or ANVILGARD WAR HYDRA can have a Drakeblood curse from the Drakeblood Curses table.

        Hidden Agents: You receive D3 extra command points.`,
        when: [START_OF_SETUP],
      },
      {
        name: `Drakeblood Curses`,
        desc: `If an Anvilgard army includes any DRAGONS, KHARIBDYSSES or WAR HYDRAS, 1 of those models has a Drakeblood curse. Choose which model will have the Drakeblood curse, then pick from or roll on the Drakeblood Curses table opposite.

        You can choose 1 additional friendly ANVILGARD DRAGON, ANVILGARD KHARIBDYSS or ANVILGARD WAR HYDRA to have a Drakeblood curse for each warscroll battalion in your army. A model cannot have more than 1 Drakeblood curse, and an army may not include duplicates of the same Drakeblood curse.`,
        when: [START_OF_SETUP],
      },
    ],
  },
  Hallowheart: {
    mandatory: {
      command_abilities: [keyPicker(command_abilities, ['Arcane Channelling'])],
    },
    effects: [
      {
        name: `Eldritch Attunement`,
        desc: `Each time a friendly HALLOWHEART unit is affected by a spell or endless spell, you can roll a D6. If you do so, on a 5+, ignore the effects of that spell or endless spell on that unit.`,
        when: [HERO_PHASE],
      },
      {
        name: `Mages of the Whitefire Court`,
        desc: `HALLOWHEART WIZARDS can attempt to cast 1 extra spell in your hero phase. In addition, HALLOWHEART WIZARDS know 2 spells from the Lore of Whitefire (pg 75) instead of 1.`,
        when: [HERO_PHASE],
        rule_source: [rule_sources.BATTLETOME_CITIES_OF_SIGMAR, rule_sources.ERRATA_AUGUST_2021],
      },
    ],
  },
  "Tempest's Eye": {
    mandatory: {
      command_abilities: [keyPicker(command_abilities, ['Rapid Redeploy'])],
    },
    effects: [
      {
        name: `Alert and Forewarned`,
        desc: `Add 3" to the Move characteristic of friendly TEMPEST'S EYE units until the end of the first battle round.`,
        when: [TURN_ONE_MOVEMENT_PHASE],
      },
      {
        name: `Alert and Forewarned`,
        desc: `Add 1 to save rolls for attacks that target friendly TEMPEST'S EYE units in the first battle round.`,
        when: [TURN_ONE_DURING_ROUND, SAVES_PHASE],
      },
      {
        name: `Outriders of the Realms`,
        desc: `Add 1 to run rolls for friendly TEMPEST'S EYE units.`,
        when: [MOVEMENT_PHASE],
      },
    ],
  },
  Misthavn: {
    mandatory: {
      command_abilities: [keyPicker(command_abilities, ['Shadowstrike'])],
    },
    effects: [
      {
        name: `Underhanded Tactics`,
        desc: `You may set up the following units in reserve (max size 10 models per unit): Misthavn Order Sepentis, Shadowblades or Scourge Privateers.
               1 unit may be in reserve for each Darkling Covens, Freeguild, or Duardin unit already on the battlefield.`,
        when: [DURING_SETUP],
      },
      {
        name: `Underhanded Tactics`,
        desc: `You may set up 1 or more units from reserve more than 9" from enemy units.`,
        when: [END_OF_MOVEMENT_PHASE],
      },
      {
        name: `Underhanded Tactics`,
        desc: `Any of your units still in reserve are slain.`,
        when: [TURN_FOUR_START_OF_ROUND],
      },
      {
        name: `Misthavn Narcotics`,
        desc: `An equipped hero can use its narcotic once per battle. It has no effect on the bearer's mount.`,
        when: [HERO_PHASE],
      },
    ],
  },
  'Har Kuron': {
    mandatory: {
      command_abilities: [keyPicker(command_abilities, ['Make an Example of the Weak (Har Kuron)'])],
      prayers: [keyPicker(prayers, ['Incitement to Murder'])],
    },
    effects: [
      {
        name: `Temples of Khaine`,
        desc: `In each of your hero phases, you can pick 1 friendly DAUGHTERS OF KHAINE PRIEST to chant the Incitement to Murder prayer in addition to the 1 other prayer that they can chant in that phase.`,
        when: [HERO_PHASE],
        rule_sources: [
          rule_sources.BATTLETOME_CITIES_OF_SIGMAR,
          meta_rule_sources.ERRATA_BROKEN_REALMS_MORATHI_JULY_2021,
        ],
      },
    ],
  },
  "Settler's Gain": {
    mandatory: {
      command_abilities: [keyPicker(command_abilities, ["Aelven Training (Settler's Gain)"])],
    },
    effects: [
      {
        name: `Lumineth Tutors`,
        desc: `You can add 1 to casting rolls for Settler's Gain Collegiate Arcane Wizards.`,
        when: [HERO_PHASE],
      },
    ],
  },
  Excelsis: {
    mandatory: {
      command_abilities: [keyPicker(command_abilities, ['Riposte (Excelsis)'])],
    },
    effects: [
      {
        name: `Gift of Prophecy`,
        desc: `Once per phase, when selecting a unit to shoot or fight, you can roll a D6. On a 1, subtract 1 from hit rolls made by the target. On a 2-6 add 1 to the target's hit rolls.`,
        when: [SHOOTING_PHASE, COMBAT_PHASE],
        rule_sources: [meta_rule_sources.BOOK_BROKEN_REALMS_KRAGNOS],
      },
    ],
  },
}

export default Flavors

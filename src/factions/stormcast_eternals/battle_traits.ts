import { tagAs } from 'factions/metatagger'
import meta_rule_sources from 'meta/rule_sources'
import {
  BATTLESHOCK_PHASE,
  COMBAT_PHASE,
  DURING_GAME,
  DURING_SETUP,
  END_OF_MOVEMENT_PHASE,
  SAVES_PHASE,
} from 'types/phases'
import rule_sources from './rule_sources'

const BattleTraits = {
  'Legends of the Living Tempest': {
    effects: [
      {
        name: `Scions of the Storm`,
        desc: `Set up 1 unit in the Celestial Realm for every unit you set up on the battlefield. At the end of your movement phase you can set up one or more reserve units more than 9" from the enemy. Any units not set up before the 4th Battleround are slain.`,
        when: [DURING_SETUP, END_OF_MOVEMENT_PHASE],
      },
      {
        name: `Shock and Awe`,
        desc: `Subtract 1 from hit rolls for attacks that target any unit set up this turn.`,
        when: [COMBAT_PHASE],
      },
    ],
  },
  'Celestial Sentinels': {
    effects: [
      {
        name: `Shield of Civilisation`,
        desc: `Add 1 to the bravery characteristic of friendly STORMCAST ETERNAL units wholly within 12" of any friendly LIBERATORS units.`,
        when: [DURING_GAME, BATTLESHOCK_PHASE],
      },
      {
        name: `Shield of Civilisation`,
        desc: `You can pick any friendly LIBERATORS units that did not move and were not set up this phase. Selected units can add 1 to hit and save rolls until your next movement phase.`,
        when: [END_OF_MOVEMENT_PHASE],
      },
      {
        name: `Shield of Civilisation`,
        desc: `If active, you can add 1 to hit rolls for affected LIBERATORS units.`,
        when: [COMBAT_PHASE],
      },
      {
        name: `Shield of Civilisation`,
        desc: `If active, you can add 1 to save rolls for affected LIBERATORS units.`,
        when: [SAVES_PHASE],
      },
      {
        name: `Mortal Auxiliaries`,
        desc: `Add 1 to the Bravery characteristic of friendly CITIES OF SIGMAR units while they are wholly within 12" of a friendly LIBERATORS unit.`,
        when: [BATTLESHOCK_PHASE],
        rule_sources: [
          rule_sources.BATTLETOME_STORMCAST_ETERNALS,
          meta_rule_sources.ERRATA_BROKEN_REALMS_MORATHI_JANUARY_2021,
          meta_rule_sources.ERRATA_BROKEN_REALMS_MORATHI_JULY_2021,
        ],
      },
      {
        name: `Mortal Auxiliaries`,
        desc: `When you use a command ability from Battletome: Stormcast Eternals and you pick a unit to receive a command, you can treat friendly CITIES OF SIGMAR units as if they were friendly STORMCAST ETERNALS units.`,
        when: [DURING_GAME],
        rule_sources: [
          rule_sources.BATTLETOME_STORMCAST_ETERNALS,
          meta_rule_sources.ERRATA_BROKEN_REALMS_MORATHI_JANUARY_2021,
          meta_rule_sources.ERRATA_BROKEN_REALMS_MORATHI_JULY_2021,
        ],
      },
    ],
  },
}

export default tagAs(BattleTraits, 'battle_trait')

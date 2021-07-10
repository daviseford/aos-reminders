import { tagAs } from 'factions/metatagger'
import meta_rule_sources from 'meta/rule_sources'
import {
  BATTLESHOCK_PHASE,
  COMBAT_PHASE,
  DURING_GAME,
  DURING_SETUP,
  END_OF_MOVEMENT_PHASE,
  SAVES_PHASE,
  WOUND_ALLOCATION_PHASE,
} from 'types/phases'
import rule_sources from './rule_sources'

const BattleTraits = {
  'Legends of the Living Tempest': {
    effects: [
      {
        name: `Scions of the Storm`,
        desc: `Instead of setting up a STORMCAST ETERNALS unit on the battlefield, you can place it to one side and say that it is set up in the Celestial Realm as a reserve unit. You can set up 1 unit in the Celestial Realm for each unit you have set up on the battlefield. At the end of your movement phase, you can set up 1 or more of the reserve units in the Celestial Realm on the battlefield, more than 9" from all enemy units.`,
        when: [DURING_SETUP],
      },
      {
        name: `Scions of the Storm`,
        desc: `At the end of your movement phase, you can set up 1 or more of the reserve units in the Celestial Realm on the battlefield, more than 9" from all enemy units.`,
        when: [END_OF_MOVEMENT_PHASE],
      },
      {
        name: `Blaze of Glory`,
        desc: `If a friendly STORMCAST ETERNALS model is slain within 1" of an enemy unit, before removing that model from play, pick 1 enemy unit within 1" of that model and roll a number of dice equal to the Wounds characteristic of that model. Add 1 to the number of dice you roll if the slain model has the THUNDERSTRIKE keyword. For each 6, the target suffers 1 mortal wound at the end of that phase.`,
        when: [WOUND_ALLOCATION_PHASE],
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

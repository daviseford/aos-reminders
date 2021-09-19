import { tagAs } from 'factions/metatagger'
import {
  BATTLESHOCK_PHASE,
  CHARGE_PHASE,
  DURING_GAME,
  DURING_SETUP,
  END_OF_MOVEMENT_PHASE,
  WOUND_ALLOCATION_PHASE,
} from 'types/phases'

const BattleTraits = {
  'Scions of the Storm': {
    effects: [
      {
        name: `Scions of the Storm`,
        desc: `During deployment, instead of setting up a SCIONS OF THE STORM STORMCAST ETERNALS unit on the battlefield, you can place it to one side and say that it is set up in the Celestial Realm as a reserve unit. You can set up 1 unit in the Celestial Realm for each SCIONS OF THE STORM STORMCAST ETERNALS unit you have set up on the battlefield. At the end of your movement phase, you can set up 1 or more of the reserve units in the Celestial Realm on the battlefield, more than 9" from all enemy units.`,
        when: [DURING_SETUP],
      },
      {
        name: `Scions of the Storm`,
        desc: `At the end of your movement phase, you can set up 1 or more of the reserve units in the Celestial Realm on the battlefield, more than 9" from all enemy units.`,
        when: [END_OF_MOVEMENT_PHASE],
      },
      {
        name: `Blaze of Glory`,
        desc: `If a friendly STORMCAST ETERNALS model is slain within 1" of an enemy unit, before removing that model from play, pick 1 enemy unit within 1" of that model and roll a number of dice equal to the Wounds characteristic of that slain model. Add 1 to the number of dice you roll if the slain model has the THUNDERSTRIKE keyword. For each 6+, the target suffers 1 mortal wound at the end of that phase.`,
        when: [WOUND_ALLOCATION_PHASE],
      },
    ],
  },
  Stormkeep: {
    effects: [
      {
        name: `Shield of Civilisation`,
        desc: `In the first and second battle rounds, if any friendly STORMKEEP REDEEMER units contest an objective that is partially or wholly within your territory, each model in that unit counts as 3 models for the purposes of contesting that objective. Starting from the third battle round, if any friendly STORMKEEP REDEEMER units contest an objective that is anywhere on the battlefield, each model in that unit counts as 3 models for the purposes of contesting that objective. In addition, if an enemy unit finishes a charge move within 1" of a friendly STORMKEEP REDEEMER unit that is within 6" of an objective you control, roll a dice. On a 3+, that unit suffers D3 mortal wounds.`,
        when: [DURING_GAME],
      },
      {
        name: `Shield of Civilisation`,
        desc: `If an enemy unit finishes a charge move within 1" of a friendly STORMKEEP REDEEMER unit that is within 6" of an objective you control, roll a dice. On a 3+, that unit suffers D3 mortal wounds.`,
        when: [CHARGE_PHASE],
      },
      {
        name: `Mortal Auxiliaries`,
        desc: `Add 1 to the Bravery characteristic of friendly STORMKEEP units wholly within 12" of any friendly STORMKEEP REDEEMER units.`,
        when: [BATTLESHOCK_PHASE],
      },
    ],
  },
}

export default tagAs(BattleTraits, 'battle_trait')

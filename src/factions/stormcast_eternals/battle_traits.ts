import { TItemDescriptions } from 'factions/factionTypes'
import { tagAs } from 'factions/metatagger'
import {
  BATTLESHOCK_PHASE,
  CHARGE_PHASE,
  DURING_GAME,
  DURING_SETUP,
  END_OF_MOVEMENT_PHASE,
  START_OF_COMBAT_PHASE,
  START_OF_HERO_PHASE,
  WOUND_ALLOCATION_PHASE,
} from 'types/phases'

const BlazeOfGloryEffect = {
  name: `Blaze of Glory`,
  desc: `If a friendly STORMCAST ETERNALS model is slain within 1" of an enemy unit, before removing that model from play, pick 1 enemy unit within 1" of that model and roll a number of dice equal to the Wounds characteristic of that slain model. Add 1 to the number of dice you roll if the slain model has the THUNDERSTRIKE keyword. For each 6+, the target suffers 1 mortal wound at the end of that phase.`,
  when: [WOUND_ALLOCATION_PHASE],
  shared: true,
}

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
      BlazeOfGloryEffect,
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
      BlazeOfGloryEffect,
    ],
  },

  'Draconith Skywing': {
    effects: [
      {
        name: `Draconith Echelon`,
        desc: `Friendly KRONDYS, KARAZAI, and STORMDRAKE GUARD units that have 2 models have the Battleline battlefield role.`,
        when: [DURING_GAME],
      },
      {
        name: `Draconith Guardians`,
        desc: `If a friendly IONUS CRYPTBORN is within 3" of any friendly STORMDRAKE GUARD units, before you allocate a wound or mortal wound to that HERO, or instead of making a ward roll for a wound or mortal wound that would be allocated to that HERO, roll a dice. On a 4+, that wound or mortal wound is allocated to 1 of those friendly units instead of IONUS CRYPTBORN and cannot be negated.`,
        when: [WOUND_ALLOCATION_PHASE],
      },
      {
        name: `Exemplars of Fury`,
        desc: `At the start of the combat phase, if there are 2 or more other friendly DRACONITH SKYWING units within 6" of a friendly HERO, add 1 to the Attacks characteristic of melee weapons used by that HERO'S mount until the end of that phase.`,
        when: [START_OF_COMBAT_PHASE],
      },
      {
        name: `Stormdrake Champions`,
        desc: `For each DRACONITH SKY WING HERO you include in your army, you can include 1 STORMDRAKE GUARD unit that has 1 model. That STORMDRAKE GUARD unit cannot have the Battleline battlefield role.`,
        when: [DURING_GAME],
      },
      {
        name: `Heroic Action: Thunderous Roars`,
        desc: `Pick 1 friendly DRACONITH SKYWING HERO and roll a dice. On a 2+, until the end of that turn, enemy units within 3" of that HERO cannot receive the Inspiring Presence command.`,
        when: [START_OF_HERO_PHASE],
      },
    ],
  },
} satisfies TItemDescriptions

export default tagAs(BattleTraits, 'battle_trait')

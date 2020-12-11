import { tagAs } from 'factions/metatagger'
import {
  END_OF_COMBAT_PHASE,
  HERO_PHASE,
  START_OF_CHARGE_PHASE,
  START_OF_COMBAT_PHASE,
  START_OF_SHOOTING_PHASE,
} from 'types/phases'

// Store Command Abilities here. You can add them to units, abilties, flavors, and subfactions later.
const CommandAbilities = {
  'Command Underlings': {
    effects: [
      {
        name: `Command Underlings`,
        desc: `Pick 1 friendly DARKLING COVEN unit wholly within 12" of a friendly DARKLING COVEN HERO with this command ability. Until your next hero phase, that unit can run and still shoot and/or charge later in the same turn.`,
        when: [HERO_PHASE],
      },
    ],
  },
  'Hold the Line': {
    effects: [
      {
        name: `Hold the Line`,
        desc: `Pick up to 3 friendly FREEGUILD units wholly within 18" of a friendly FREEGUILD HERO with this command ability. Until the start of your next hero phase, add 1 to hit and wound rolls for attacks made by those friendly units if they have not made a normal move or a charge move in the same turn. A unit cannot benefit from this command ability more than once per phase.`,
        when: [HERO_PHASE],
      },
    ],
  },
  'Rousing Battle Cry': {
    effects: [
      {
        name: `Rousing Battle Cry`,
        desc: `Pick 1 friendly FREEGUILD HERO with this CA. Until the end of that phase, add 1 to charge rolls for friendly FREEGUILD units while they are wholly within 12" of that HERO. In addition, in the next combat phase, add 1 to hit rolls for attacks made with melee weapons by friendly FREEGUILD units while they are wholly within 12" of that HERO. A unit cannot benefit from this command ability more than once per phase.`,
        when: [START_OF_CHARGE_PHASE],
      },
    ],
  },
  'Ancestral Grudge': {
    effects: [
      {
        name: `Ancestral Grudge`,
        desc: `Pick 1 enemy unit within 18" of a friendly HERO with this command ability. Until the end of that phase, add 1 to the Attacks characteristic of attacks made with melee weapons used by friendly DISPOSSESSED units that target that unit. A unit cannot benefit from this command ability more than once per phase.`,
        when: [START_OF_COMBAT_PHASE],
      },
    ],
  },
  'Target Sighted': {
    effects: [
      {
        name: `Target Sighted`,
        desc: `Pick 1 friendly IRONWELD ARSENEL HERO with this command ability and 1 enemy unit. Until the end of that phase, add 1 to hit rolls for attacks that target that enemy unit made by friendly STEAM TANKS while they are within 6" of that friendly IRONWELD ARSENEL HERO. A unit cannot benefit from this command ability more than once per phase.`,
        when: [START_OF_SHOOTING_PHASE],
      },
    ],
  },
  'Inspire Hatred': {
    effects: [
      {
        name: `Inspire Hatred`,
        desc: `Pick 1 friendly DARKLING COVEN unit wholly within 12" of a friendly DARKLING COVEN HERO with this command ability. You can reroll wound rolls of 1 for attacks made by that unit in that combat phase.`,
        when: [START_OF_COMBAT_PHASE],
      },
    ],
  },
  'Captain of the Phoenix Guard': {
    effects: [
      {
        name: `Captain of the Phoenix Guard`,
        desc: `You can use this command ability at the start of the combat phase. If you do so, pick 1 friendly HERO with this command ability. Until the end of that phase, you can reroll wound rolls for attacks made by friendly PHOENIX TEMPLE units while they are wholly within 12" of that HERO.`,
        when: [START_OF_COMBAT_PHASE],
      },
    ],
  },
  'Captain of the Phoenix Guard (Flamespyre)': {
    effects: [
      {
        name: `Captain of the Phoenix Guard`,
        desc: `You can use this command ability at the start of the combat phase. If you do so, pick 1 friendly FLAMESPYRE PHOENIX that includes an Anointed. Until the end of that phase, you can reroll wound rolls for attacks made by friendly PHOENIX TEMPLE units that are wholly within 12" of that FLAMESPYRE PHOENIX.`,
        when: [START_OF_COMBAT_PHASE],
      },
    ],
  },
  'Captain of the Phoenix Guard (Frostheart)': {
    effects: [
      {
        name: `Captain of the Phoenix Guard`,
        desc: `You can use this command ability at the start of the combat phase. If you do so, pick 1 friendly FROSTHEART PHOENIX that includes an Anointed. Until the end of that phase, you can reroll wound rolls for attacks made by friendly PHOENIX TEMPLE units that are wholly within 12" of that FROSTHEART PHOENIX.`,
        when: [START_OF_COMBAT_PHASE],
      },
    ],
  },
  'Do Not Disappoint Me': {
    effects: [
      {
        name: `Do Not Disappoint Me`,
        desc: `Pick 1 friendly HERO that knows this ability. Add 1 to wound rolls for attacks made by friendly ORDER SERPENTIS units that are wholly within 18" of that HERO. A unit cannot benefit from this command ability more than once per phase.`,
        when: [START_OF_COMBAT_PHASE],
      },
    ],
  },
  'At Them, You Curs!': {
    effects: [
      {
        name: `At Them, You Curs!`,
        desc: `Pick 1 friendly Scourge Privateers unit wholly within 12" of a friendly HERO with this command ability. Add 1 to the Attacks characteristic of that unit's melee weapons until the end of that phase. A unit cannot benefit from this command ability more than once per phase.`,
        when: [START_OF_COMBAT_PHASE],
      },
    ],
  },
  'Feast of Bones': {
    effects: [
      {
        name: `Feast of Bones`,
        desc: `At the end of the combat phase, if any enemy models were slain by wounds inflicted by this model's attacks in that combat phase, you can heal D3 wounds allocated to this model.`,
        when: [END_OF_COMBAT_PHASE],
      },
    ],
  },
  'Lord of the Deepwood Host': {
    effects: [
      {
        name: `Lord of the Deepwood Host`,
        desc: `Pick 1 friendly HERO with this command ability. Until the end of that phase, add 1 to hit rolls for attacks made by friendly WANDERER units while they are wholly within 12" of that HERO. A unit cannot benefit from this command ability more than once per phase.`,
        when: [START_OF_SHOOTING_PHASE],
      },
    ],
  },
}

// Always export using tagAs
export default tagAs(CommandAbilities, 'command_ability')

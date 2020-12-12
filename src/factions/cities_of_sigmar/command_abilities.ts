import { tagAs } from 'factions/metatagger'
import {
  END_OF_COMBAT_PHASE,
  END_OF_MOVEMENT_PHASE,
  END_OF_SHOOTING_PHASE,
  HERO_PHASE,
  SHOOTING_PHASE,
  START_OF_BATTLESHOCK_PHASE,
  START_OF_CHARGE_PHASE,
  START_OF_COMBAT_PHASE,
  START_OF_HERO_PHASE,
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
  'Righteous Purpose': {
    effects: [
      {
        name: `Righteous Purpose`,
        desc: `Pick 1 friendly HAMMERHAL unit that is wholly within enemy territory, wholly within 12" of a friendly HAMMERHAL HERO, and within 3" of an enemy unit. That friendly unit can fight. A unit cannot benefit from this command ability more than once per phase.`,
        when: [END_OF_COMBAT_PHASE],
      },
    ],
  },
  'Strike then Melt Away': {
    effects: [
      {
        name: `Strike then Melt Away`,
        desc: `Pick 1 friendly LIVING CITY unit that shot in that phase, is more than 9" from any enemy units and is wholly within 18" of af riendly LIVING CITY HERO. That unit can make a normal move (it cannot run). A unit cannot benefit from this command ability more than once per phase.`,
        when: [END_OF_SHOOTING_PHASE],
      },
    ],
  },
  'Salvo Fire': {
    effects: [
      {
        name: `Salvo Fire`,
        desc: `You can use this command ability in your shooting phase. If you do so, pick 1 friendly GREYWATER FASTNESS FREEGUILD HANDGUNNERS unit or 1 friendly GREYWATER FASTNESS IRONDRAKES unit wholly within 12" of a friendly GREYWATER FASTNESS HERO. Add 1 to hit rolls for attacks made with missile weapons by that unit until the end of that phase. A unit cannot benefit from this command ability more than once per phase.`,
        when: [SHOOTING_PHASE],
      },
    ],
  },
  'Living Idols': {
    effects: [
      {
        name: `Living Idols`,
        desc: `You can use this command ability at the start of the combat phase. If you do so, pick 1 friendly PHOENICIUM HERO FLAMESPYRE PHOENIX or 1 friendly PHOENICIUM HERO FROSTHEART PHOENIX. Until the end of that phase, if a friendly PHOENICIUM model is slain while it is within 12" of that HERO, that model can fight before it is removed from play.`,
        when: [START_OF_COMBAT_PHASE],
      },
    ],
  },
  'Make an Example of the Weak (Anvilgard)': {
    effects: [
      {
        name: `Make an Example of the Weak (Anvilgard)`,
        desc: `You can use this command ability at the start of the battleshock phase. If you do so, pick 1 friendly ANVILGARD unit wholly within 12" of a friendly ANVILGARD HERO. 1 model in that unit is slain. However, in that phase, you do not need to take battleshock tests for friendly ANVILGARD units wholly within 18" of that unit.`,
        when: [START_OF_BATTLESHOCK_PHASE],
      },
    ],
  },
  'Arcane Channelling': {
    effects: [
      {
        name: `Arcane Channelling`,
        desc: `You can use this command ability once per turn at the start of your hero phase. If you do so, pick 1 friendly HALLOWHEART WIZARD HERO and roll a D6. That WIZARD suffers a number of mortal wounds equal to that roll. In addition, until the start of your next hero phase, add the number of mortal wounds suffered by that WIZARD and not negated to casting rolls made by other friendly HALLOWHEART WIZARDS while they are within 12" of that WIZARD.`,
        when: [START_OF_HERO_PHASE],
      },
    ],
  },
  'Rapid Redeploy': {
    effects: [
      {
        name: `Rapid Redeploy`,
        desc: `You can use this command ability in your shooting phase. If you do so, pick 1 friendly TEMPEST'S EYE unit that is wholly within 12" of a friendly TEMPEST'S EYE HERO. That unit can shoot even if it ran in the same turn.`,
        when: [SHOOTING_PHASE],
      },
    ],
  },
  Shadowstrike: {
    effects: [
      {
        name: `Shadowstrike`,
        desc: `Once per turn, when you set up a flanking force from your reserve wholly within 12" of a friendly Misthavn hero, that unit can move up to D6" (it cannot run).`,
        when: [END_OF_MOVEMENT_PHASE],
      },
    ],
  },
  'Make an Example of the Weak (Har Kuron)': {
    effects: [
      {
        name: `Make an Example of the Weak (Har Kuron)`,
        desc: `Pick 1 friendly Har Kuron unit wholly within 12" of a friendly Har Kuron hero. 1 model in the target unit is slain. Friendly Har Kuron units within 18" of the targeted unit do not need to take battleshock tests.`,
        when: [START_OF_BATTLESHOCK_PHASE],
      },
    ],
  },
}

// Always export using tagAs
export default tagAs(CommandAbilities, 'command_ability')

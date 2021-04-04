import { tagAs } from 'factions/metatagger'
import {
  CHARGE_PHASE,
  COMBAT_PHASE,
  HERO_PHASE,
  MOVEMENT_PHASE,
  SHOOTING_PHASE,
  START_OF_BATTLESHOCK_PHASE,
  START_OF_CHARGE_PHASE,
  START_OF_COMBAT_PHASE,
  START_OF_HERO_PHASE,
} from 'types/phases'

const CommandAbilities = {
  // Reapers of Vengeance
  'Leave None Alive': {
    effects: [
      {
        name: `Leave None Alive`,
        desc: `You can use this command ability at the start of the combat phase. If you do so, pick 1 friendly REAPERS OF VENGEANCE DAEMON unit wholly within 8" of a friendly REAPERS OF VENGEANCE HERO with this command ability. After that unit has fought in the combat phase for the first time, if it is within 3" of an enemy unit it can immediately make a pile-in move and then attack with all of the melee weapons it is armed with for a second time.`,
        when: [START_OF_COMBAT_PHASE],
      },
    ],
  },
  // Bloodlords
  'First in His Sight': {
    effects: [
      {
        name: `First in His Sight`,
        desc: `You can use this command ability at the start of the hero phase. If you do so, pick a friendly model with this command ability. You can heal 1 wound allocated to each friendly BLOODLORDS DAEMON unit wholly within 16" of that model.`,
        when: [START_OF_HERO_PHASE],
      },
    ],
  },
  // Goretide
  'Ever Onwards': {
    effects: [
      {
        name: `Ever Onwards`,
        desc: `You can use this command ability before you make a run roll for 1 friendly GORETIDE BLOODREAVERS or GORETIDE BLOOD WARRIORS unit wholly within 16" of a friendly model with this command ability. If you do so, that run roll is treated as being 6. In addition, that unit can run and still charge later in the same turn.`,
        when: [MOVEMENT_PHASE],
      },
    ],
  },
  // Skullfiend Tribe
  'For the Brass Citadel': {
    effects: [
      {
        name: `For the Brass Citadel`,
        desc: `You can use this command ability at the start of the combat phase. If you do so, pick 1 friendly model with this command ability. Until the end of that phase, you can reroll hit and wound rolls for attacks made by friendly SKULLFIEND TRIBE KHORGORATH units wholly within 10" of that model.`,
        when: [START_OF_COMBAT_PHASE],
      },
    ],
  },
  // Unit command abilities
  'Rejoice in the Slaughter': {
    effects: [
      {
        name: `Rejoice in the Slaughter`,
        desc: `You can use this command ability at the start of the combat phase. If you do so, pick a friendly model with this command ability. Until the end of that combat phase friendly KHORNE DAEMON units wholly within 16" of that model are eligible to fight in that combat phase if they are within 6" of an enemy unit instead of 3", and can move an extra 3" when they pile in.`,
        when: [START_OF_COMBAT_PHASE],
      },
    ],
  },
  'Bloodthirsty Charge': {
    effects: [
      {
        name: `Bloodthirsty Charge`,
        desc: `You can use this command ability at the start of your charge phase. If you do so, pick a friendly model with this command ability. Until the end of that phase, you can reroll charge rolls for friendly KHORNE DAEMON units wholly within 16" of that model when the charge roll is made.`,
        when: [START_OF_CHARGE_PHASE],
      },
    ],
  },
  'Lord of the Blood Hunt': {
    effects: [
      {
        name: `Lord of the Blood Hunt`,
        desc: `You can use this command ability at the start of the combat phase. If you do so, pick 1 friendly KHORNE DAEMON unit wholly within 16" of a friendly model with this command ability. Until the end of the phase you can reroll hit rolls for attacks made by that unit.`,
        when: [START_OF_COMBAT_PHASE],
      },
    ],
  },
  'Heads Must Roll': {
    effects: [
      {
        name: `Heads Must Roll`,
        desc: `You can use this command ability at the start of the combat phase. If you do so, pick 1 friendly BLOODLETTERS unit wholly within 12" of a friendly model with this command ability. Until the end of that phase, you can reroll wound rolls of 1 for attacks made by that unit.`,
        when: [START_OF_COMBAT_PHASE],
      },
    ],
  },
  'Rejoice in Exalted Slaughter': {
    effects: [
      {
        name: `Rejoice in Exalted Slaughter`,
        desc: `You can use this command ability at the start of the combat phase. If you do so, pick a friendly model with this command ability. Until the end of that combat phase friendly Khorne Daemon units wholly within 18" of that model are eligible to fight in that combat phase if they are within 6" of an enemy unit instead of 3", and they can move an extra 3" when they pile-in.`,
        when: [START_OF_COMBAT_PHASE],
      },
    ],
  },
  "The Butcher's Due": {
    effects: [
      {
        name: `The Butcher's Due`,
        desc: `If this model is on the battlefield you can pick 1 friendly Khorne unit wholly within 18". You can reroll wound rolls of 1 for attacks made by that unit until your next hero phase.`,
        when: [START_OF_HERO_PHASE],
      },
      {
        name: `The Butcher's Due`,
        desc: `If active, you can reroll wound rolls of 1 for attacks made by the buffed unit.`,
        when: [SHOOTING_PHASE, COMBAT_PHASE],
      },
    ],
  },
  'Lord of the Goretide': {
    effects: [
      {
        name: `Lord of the Goretide`,
        desc: `If this model is your general you may use this ability. Until the end of that phase, you can reroll hit rolls of 1 for attacks made by friendly GORETIDE units wholly within 16" of that model.`,
        when: [START_OF_COMBAT_PHASE],
      },
    ],
  },
  'Murderous Paragon': {
    effects: [
      {
        name: `Murderous Paragon`,
        desc: `You can pick 1 friendly WRATHMONGERS unit wholly within 12" of a friendly model with this command ability. Until the end of that phase, if a model from that unit is slain, before that model is removed from play, that model can make a pile-in move and then attack with all of the melee weapons it is armed with.`,
        when: [START_OF_COMBAT_PHASE],
      },
    ],
  },
  'On Bloodstained Wings': {
    effects: [
      {
        name: `On Bloodstained Wings`,
        desc: `You can use this command ability in the hero phase. If you do so, pick 1 enemy unit that can fly and is within 16" of a friendly model with this command ability. Until the end of that turn, subtract 1 from hit rolls for attacks made by that unit. You cannot pick the same unit to benefit from this command ability more than once per hero phase.`,
        when: [HERO_PHASE],
      },
    ],
  },
  Gorelord: {
    effects: [
      {
        name: `Gorelord`,
        desc: `If you choose to activate this ability, until the end of the phase, you can reroll charge rolls for friendly KHORNE MORTAL units wholly within 16" of that model when the charge roll is made.`,
        when: [START_OF_CHARGE_PHASE],
      },
    ],
  },
  'Blood Stampede': {
    effects: [
      {
        name: `Blood Stampede`,
        desc: `If you choose to activate this ability, pick up to 3 friendly KHORNE MORTAL units that made a charge move in that turn and are wholly within 16" of a model with this command ability. You can reroll wound rolls of 1 for attacks made by those units in that combat phase.`,
        when: [START_OF_COMBAT_PHASE],
      },
    ],
  },
  'Slaughter Incarnate': {
    effects: [
      {
        name: `Slaughter Incarnate`,
        desc: `If you choose to activate this ability, until the end of the phase, add 1 to the Attacks characteristic of melee weapons used by friendly KHORNE MORTAL units while they are wholly within 12" of that model. A unit cannot benefit from this command ability more than once per phase.`,
        when: [START_OF_COMBAT_PHASE],
      },
    ],
  },
  'Brutal Command': {
    effects: [
      {
        name: `Brutal Command`,
        desc: `You can use this command ability at the start of the battleshock phase. If you do so, pick a friendly model with this command ability. Until the end of that phase, you do not have to take battleshock tests for friendly KHORNE MORTAL units that are wholly within 18" of that model.`,
        when: [START_OF_BATTLESHOCK_PHASE],
      },
    ],
  },
  'Call of the Skull Throne': {
    effects: [
      {
        name: `Call of the Skull Throne`,
        desc: `You can use this command ability at the start of your charge phase if this model is on the battlefield. If you do so, you can reroll charge rolls for friendly Khorne units while they are wholly within 12" of this model in that charge phase.`,
        when: [START_OF_CHARGE_PHASE],
      },
    ],
  },
  // Flayed
  Wrathspeaker: {
    effects: [
      {
        name: `Wrathspeaker`,
        desc: `Pick 1 friendly Flayed mortal unit wholly within 12" of a friendly Flayed mortal hero with this ability. Add 1 to the hit rolls for melee weapon attacks made by the selected unit if it made a charge move this turn.`,
        when: [START_OF_COMBAT_PHASE],
      },
      {
        name: `Wrathspeaker`,
        desc: `If a Flayed mortal unit makes a charge move this turn, you can selected it to be a target of the Wrathspeaker command ability.`,
        when: [CHARGE_PHASE],
      },
    ],
  },
  // Baleful Lords
  'Frenzied Annihilator': {
    effects: [
      {
        name: `Frenzied Annihilator`,
        desc: `Pick 1 friendly Baleful Lords Bloodthirster. Until the end of the phase the selected model is treated as though it has 0 wounds when referencing its damage table.`,
        when: [COMBAT_PHASE],
      },
    ],
  },
}

export default tagAs(CommandAbilities, 'command_ability')

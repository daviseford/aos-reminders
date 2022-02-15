import { DestructionUnits } from 'factions/grand_alliances'
import { keyPicker, tagAs } from 'factions/metatagger'
import {
  BATTLESHOCK_PHASE,
  CHARGE_PHASE,
  COMBAT_PHASE,
  DURING_GAME,
  END_OF_CHARGE_PHASE,
  END_OF_COMBAT_PHASE,
  END_OF_HERO_PHASE,
  HERO_PHASE,
  SAVES_PHASE,
  START_OF_CHARGE_PHASE,
  START_OF_COMBAT_PHASE,
  START_OF_HERO_PHASE,
} from 'types/phases'
import rule_sources from '../rule_sources'
import spells from './spells'

const StrengthFromVictoryEffect = {
  name: `Strength from Victory`,
  desc: `At the end of the combat phase, if any models were slain by a wound caused by an attack made by this unit in that combat phase, add 1 to this unit's Wounds characteristic and add 1 to the Attacks characteristic of this unit's melee weapons, excluding those of its mount.`,
  when: [END_OF_COMBAT_PHASE],
  shared: true,
}

const DestructiveBulkEffect = {
  name: `Destructive Bulk`,
  desc: `If you carry out a Stomp monstrous rampage with this unit and the enemy unit you picked suffers any mortal wounds, that enemy unit suffers an additional number of mortal wounds equal to the Destructive Bulk value on this unit's damage table. After all models slain by those mortal wounds have been removed from play, if there are no enemy models within 3" of this unit, you can move this unit D6" and then you can carry out another Stomp monstrous rampage with this unit even though you have already carried out the Stomp monstrous rampage in that phase.`,
  when: [END_OF_CHARGE_PHASE],
  shared: true,
}

const DuffUpdaBigThingEffect = {
  name: `Duff Up da Big Thing`,
  desc: `Add 1 to hit rolls for attacks made by this unit that target a unit with a Wounds characteristic of 4 or more.`,
  when: [COMBAT_PHASE],
  shared: true,
}

const IronjawzUnits = {
  'Gordrakk the Fist of Gork': {
    effects: [
      DestructiveBulkEffect,
      StrengthFromVictoryEffect,
      {
        name: `Smasha`,
        desc: `If the unmodified wound roll for an attack made with Smasha is 4+ and the target is a HERO but not a WIZARD, the target suffers 2 mortal wounds and the attack sequence ends (do not make a save roll).`,
        when: [COMBAT_PHASE],
      },
      {
        name: `Kunnin'`,
        desc: `If the unmodified wound roll for an attack made with Kunnin' is 4+ and the target is a WIZARD, the target suffers 2 mortal wounds and the attack sequence ends (do not make a save roll).`,
        when: [COMBAT_PHASE],
      },
      {
        name: `Voice of Gork`,
        desc: `This unit can issue the same command up to 3 times in the same phase. If it does so, no command point is spent the second and third times this unit issues that command in that phase.`,
        when: [DURING_GAME],
        rule_sources: [rule_sources.BATTLETOME_ORRUK_WARCLANS, rule_sources.ERRATA_OCTOBER_2021],
      },
    ],
  },
  'Megaboss on Maw-Krusha': {
    effects: [
      StrengthFromVictoryEffect,
      DestructiveBulkEffect,
      {
        name: `Skull-shaking Bellow`,
        desc: `This unit can issue the same command up to 3 times in the same phase. If it does so, each command must be received by a friendly IRONJAWZ unit. No command point is spent the second and third times this unit issues that command in that phase.`,
        when: [DURING_GAME],
        rule_sources: [rule_sources.BATTLETOME_ORRUK_WARCLANS, rule_sources.ERRATA_OCTOBER_2021],
      },
    ],
  },
  'Orruk Megaboss': {
    effects: [
      StrengthFromVictoryEffect,
      {
        name: `Ear-splitting Bellow`,
        desc: `When you pick this unit to issue a command, you can pick up to 2 friendly IRONJAWZ units to receive the command instead of only 1 friendly unit.`,
        when: [DURING_GAME],
      },
      {
        name: `Dead Fighty`,
        desc: `If this unit is destroyed in the combat phase and it has not fought in that combat phase, it can fight immediately, then it is removed from play.`,
        when: [COMBAT_PHASE],
      },
    ],
  },
  'Orruk Warchanter': {
    effects: [
      {
        name: `Warbeats`,
        desc: `When you pick this unit to be part of your army, you can pick 1 of the following warbeats (Fixin' Beat, Get 'Em Beat or Killa Beat) for it to know and write it on your army roster. A unit can only attempt the warbeat that it knows. When this unit attempts its warbeat, roll a dice. On a 3+, the attempt is successful. This unit cannot attempt a warbeat that has been attempted by another friendly unit in the same turn.`,
        when: [DURING_GAME],
      },
      {
        name: `Fixin' Beat`,
        desc: `This warbeat can be attempted in your hero phase. If the attempt is successful, pick 1 friendly model within 12" of this unit and heal up to D3 wounds allocated to that model.`,
        when: [HERO_PHASE],
      },
      {
        name: `Get 'Em Beat`,
        desc: `This warbeat can be attempted at the start of your charge phase. If the attempt is successful, pick 1 friendly IRONJAWZ unit wholly within 12" of this unit. In that charge phase, you can attempt a charge with that friendly IRONJAWZ unit if it is within 18" of an enemy unit instead of 12". In addition, roll 3D6 instead of 2D6 when making a charge roll for that unit in that charge phase.`,
        when: [START_OF_CHARGE_PHASE],
      },
      {
        name: `Killa Beat`,
        desc: `This warbeat can be attempted at the start of the combat phase. If the attempt is successful, pick 1 enemy unit within 12" of this unit. Add 1 to hit rolls for attacks made with melee weapons that target that enemy unit in that phase.`,
        when: [START_OF_COMBAT_PHASE],
      },
      {
        name: `Violent Fury`,
        desc: `In your hero phase, you can pick 1 friendly IRONJAWZ unit wholly within 15" of this unit. Until your next hero phase, add 1 to the damage inflicted by attacks made with melee weapons by that unit. A unit cannot benefit from this ability more than once per phase.`,
        when: [HERO_PHASE],
      },
    ],
  },
  'Orruk Weirdnob Shaman': {
    mandatory: {
      spells: [keyPicker(spells, ['Green Puke'])],
    },
    effects: [
      {
        name: `Brutal Power`,
        desc: `If this unit is within 12" of 10 or more other friendly IRONJAWZ models at the end of your hero phase, it can attempt to cast the Green Puke spell in addition to any other spells it can cast, and even if a WIZARD has already attempted to cast the Green Puke spell in that hero phase.`,
        when: [END_OF_HERO_PHASE],
      },
    ],
  },
  'Orruk Ardboys': {
    effects: [
      {
        name: `Champion`,
        desc: `1 model in this unit can be an Ardboy Boss. Add 1 to the Attacks characteristic of that model's melee weapons.`,
        when: [COMBAT_PHASE],
      },
      {
        name: `Musician`,
        desc: `1 in every 5 models in this unit can be a Waaagh! Drummer. You can add 1 to charge rolls for a unit that includes any Waaagh! Drummers.`,
        when: [CHARGE_PHASE],
      },
      {
        name: `Standard Bearer`,
        desc: `1 in every 5 models in this unit can be a Gorkamorka Glyph Bearer. Add 1 to the Bravery characteristic of a unit that includes any Gorkamorka Glyph Bearers.`,
        when: [BATTLESHOCK_PHASE],
      },
      {
        name: `Drawn to the Waaagh!`,
        desc: `If this unit's champion issues the Rally command to this unit while this unit is wholly within 12" of a friendly Warchanter, you can return 1 slain model to this unit for each roll of a 4+ instead of a 6.`,
        when: [START_OF_HERO_PHASE],
      },
      {
        name: `Orruk-forged Shields!`,
        desc: `A model that has an Orruk-forged Shield has a ward of 6+.`,
        when: [SAVES_PHASE],
      },
    ],
  },
  'Orruk Brutes': {
    effects: [
      DuffUpdaBigThingEffect,
      {
        name: `You Messin'?`,
        desc: `Enemy models with a Wounds characteristic of 1 that are within 3" of this unit cannot contest objectives.`,
        when: [DURING_GAME],
      },
    ],
  },
  'Orruk Gore-gruntas': {
    effects: [
      {
        name: `Gore-grunta Charge`,
        desc: `After a model in this unit finishes a charge move, roll a dice for each enemy unit within 1 " of that model. Add 1 to the roll if the model is armed with a Jagged Gore- hacka. On a 3+, that enemy unit suffers 1 mortal wound.

        If this unit has more than 1 model, roll to determine if mortal wounds are caused after each model finishes its charge move, but do not allocate the mortal wounds until after all of the models in the unit have finished their charge moves.`,
        when: [CHARGE_PHASE],
      },
    ],
  },
  "Ironskull's Boyz": {
    effects: [
      {
        name: `Dead 'Ard`,
        desc: `Gurzag Ironskull has a ward of 5+. The other models in this unit have a ward of 6+.`,
        when: [SAVES_PHASE],
      },
    ],
  },
  "Morgok's Krushas": {
    effects: [
      DuffUpdaBigThingEffect,
      {
        name: `Beastbashas`,
        desc: `The first time a MONSTER is destroyed by an attack made by this unit, add 1 to wound rolls for attacks made by this unit for the rest of the battle.`,
        when: [COMBAT_PHASE],
      },
    ],
  },
  ...keyPicker(DestructionUnits, ['Rogue Idol']),
}

export default tagAs(IronjawzUnits, 'unit')

import { keyPicker, tagAs } from 'factions/metatagger'
import { GenericEffects } from 'generic_rules'
import {
  BATTLESHOCK_PHASE,
  CHARGE_PHASE,
  COMBAT_PHASE,
  DURING_GAME,
  END_OF_CHARGE_PHASE,
  END_OF_COMBAT_PHASE,
  END_OF_HERO_PHASE,
  END_OF_TURN,
  HERO_PHASE,
  MOVEMENT_PHASE,
  START_OF_CHARGE_PHASE,
  START_OF_COMBAT_PHASE,
  START_OF_HERO_PHASE,
  WARDS_PHASE,
} from 'types/phases'
import rule_sources from '../rule_sources'
import spells from './spells'
import meta_rule_sources from 'meta/rule_sources'
import monstrous_rampages from './monstrous_rampages'
import { TItemDescriptions } from 'factions/factionTypes'

const MawGruntaSharedEffects = [
  {
    name: `Unstoppable Momentum`,
    desc: `Each time this unit finishes a run or charge move, add D3 to its momentum score. This unit's momentum score can never exceed 6 or go below 1. At the end of each turn, subtract 1 from this unit's momentum score (to a minimum of 1).`,
    when: [DURING_GAME],
    rule_sources: [rule_sources.BATTLETOME_SUPPLEMENT_IRONJAWZ],
    shared: true,
  },
  {
    name: `Unstoppable Momentum`,
    desc: `Each time this unit finishes a run add D3 to its momentum score. This unit's momentum score can never exceed 6.`,
    when: [MOVEMENT_PHASE],
    rule_sources: [rule_sources.BATTLETOME_SUPPLEMENT_IRONJAWZ],
    shared: true,
  },
  {
    name: `Unstoppable Momentum`,
    desc: `Each time this unit finishes a charge move, add D3 to its momentum score. This unit's momentum score can never exceed 6.`,
    when: [CHARGE_PHASE],
    rule_sources: [rule_sources.BATTLETOME_SUPPLEMENT_IRONJAWZ],
    shared: true,
  },
  {
    name: `Unstoppable Momentum`,
    desc: `Subtract 1 from this unit's momentum score (to a minimum of 1).`,
    when: [END_OF_TURN],
    rule_sources: [rule_sources.BATTLETOME_SUPPLEMENT_IRONJAWZ],
    shared: true,
  },
  {
    name: `Headlong Charger`,
    desc: `While this unit has a momentum score of 4 or more, this unit can charge even if it ran earlier in the turn.`,
    when: [CHARGE_PHASE],
    rule_sources: [rule_sources.BATTLETOME_SUPPLEMENT_IRONJAWZ],
    shared: true,
  },
]

const CarvePathEffect = {
  name: `Hack 'n' Charge`,
  desc: `Pick an enemy unit with a Wounds characteristic of 4 or less within 3" of this unit and roll a dice. If the roll is less than this unit's momentum score, that enemy unit suffers a number of mortal wounds equal to the roll and you can immediately attempt a charge with this unit even though it is within 3" of an enemy unit. When a unit charges in this manner, it can pass across enemy units with a Wounds characteristic of 4 or less in the same manner as a unit that can fly.`,
  when: [END_OF_CHARGE_PHASE],
  shared: true,
  rule_sources: [rule_sources.BATTLETOME_SUPPLEMENT_IRONJAWZ, meta_rule_sources.ERRATA_DAWNBRINGERS_BOOK_2],
}

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

const BerserkersEffect = {
  name: `Berserkers`,
  desc: `This unit can run and still charge later in the turn.`,
  when: [CHARGE_PHASE],
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
  'Ardboy Big Boss': {
    effects: [
      {
        name: `Iron-fisted Commander`,
        desc: `This unit can issue the Rally command up to 2 times in the same phase, eah commmand must be to a friendly ARDBOYS unit. No command point is spent the second time this unit issues that command in that phase. 
        In addition, when a friendly ARDBOYS unit receives the Rally command from a friendly unit with this ability, you can return 1 slain model to that unit for each 5+ instead of each 6.`,
        when: [START_OF_HERO_PHASE],
        rule_sources: [rule_sources.BATTLETOME_SUPPLEMENT_IRONJAWZ],
      },
      {
        name: `Get Bashin!'`,
        desc: `Add 1 to shield bash rolls made for friendly ARDBOYS units while they are wholly within 12" of any friendly units with this ability.`,
        when: [COMBAT_PHASE],
        rule_sources: [rule_sources.BATTLETOME_SUPPLEMENT_IRONJAWZ],
      },
    ],
  },
  'Orruk Ardboys': {
    effects: [
      {
        name: `Champion`,
        desc: `1 model in this unit can be an Ardboy Boss. Add 1 to the Attacks characteristic of that model's melee weapons.`,
        when: [COMBAT_PHASE],
        rule_sources: [rule_sources.BATTLETOME_SUPPLEMENT_IRONJAWZ],
      },
      {
        name: `Standard Bearer`,
        desc: `1 in every 10 models in this unit can be a Gorkamorka Glyph Bearer. Add 1 to the Bravery characteristic of a unit that includes any Gorkamorka Glyph Bearers.`,
        when: [BATTLESHOCK_PHASE],
        rule_sources: [rule_sources.BATTLETOME_SUPPLEMENT_IRONJAWZ],
      },
      {
        name: `'Ere We Go!`,
        desc: `Add 1 to the Attacks characteristic of this unit's Ardboy Choppas if this unit made a charge move in the same turn.`,
        when: [COMBAT_PHASE],
        rule_sources: [rule_sources.BATTLETOME_SUPPLEMENT_IRONJAWZ],
      },
      {
        name: `Da Stikkas`,
        desc: `Improve the Rend characteristic of this unit's Ardboy Stikkas by 1 if the target made a charge move in the same turn.`,
        when: [COMBAT_PHASE],
        rule_sources: [rule_sources.BATTLETOME_SUPPLEMENT_IRONJAWZ],
      },
      {
        name: `Shield Bash`,
        desc: `After all of this units attacks have been resolved, pick 1 enemy unit within 1" of this unit and roll a dice for each model in this unit within 1" of that unit. For roll of 6+, that enemy unit suffers 1 mortal wound.`,
        when: [COMBAT_PHASE],
        rule_sources: [rule_sources.BATTLETOME_SUPPLEMENT_IRONJAWZ],
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
        desc: `After a model in this unit finishes a charge move, roll a dice for each enemy unit within 1" of that model. Add 1 to the roll if the model is armed with a Jagged Gore-hacka. On a 3+, that enemy unit suffers 1 mortal wound.

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
        when: [WARDS_PHASE],
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
  'Tuskboss On Maw-Grunta': {
    effects: [
      ...MawGruntaSharedEffects,
      CarvePathEffect,
      {
        name: `Head of the Stampede`,
        desc: `If this unit makes a charge move, you can reroll charge rolls for all friendly MAW-GRUNTA units on the battlefield until the end of the phase.`,
        when: [CHARGE_PHASE],
        rule_sources: [rule_sources.BATTLETOME_SUPPLEMENT_IRONJAWZ],
      },
    ],
  },
  "Maw-Grunta with Hakkin' Krew": {
    effects: [...MawGruntaSharedEffects, CarvePathEffect],
  },
  'Maw-Grunta Gougers': {
    mandatory: {
      monstrous_rampages: [keyPicker(monstrous_rampages, ['Flattened into the Mud'])],
    },
    effects: [...MawGruntaSharedEffects],
  },
  'Zoggrok Anvilsmasha': {
    effects: [
      {
        name: `Power of Da Great Green God`,
        desc: `In your hero phase, pick 1 friendly IRONJAWZ unit wholly within 12" of this unit and roll a dice. On a 4+, unmodified hit rolls of 6 for attacks made with melee weapons by that unit cause 1 mortal wound in addition to any damage they inflict. Add 2 to the roll if this unit is armed with Grunta-tongs.`,
        when: [HERO_PHASE],
        rule_sources: [rule_sources.BATTLETOME_SUPPLEMENT_IRONJAWZ],
      },
      {
        name: `Power of Da Great Green God`,
        desc: `Unmodified hit rolls of 6 for attacks made with melee weapons by an effected unit cause 1 mortal wound in addition to any damage they inflict.`,
        when: [COMBAT_PHASE],
        rule_sources: [rule_sources.BATTLETOME_SUPPLEMENT_IRONJAWZ],
      },
      {
        name: `Ward-smashing Choppa`,
        desc: `If the unmodified hit roll for an attack made with this unit's Ward-smashing Choppa is 6 ward rolls cannot be made for that unit for the rest of the battle.`,
        when: [COMBAT_PHASE],
        rule_sources: [rule_sources.BATTLETOME_SUPPLEMENT_IRONJAWZ],
      },
    ],
  },
  'Brute Ragerz': {
    effects: [
      GenericEffects.Elite,
      BerserkersEffect,
      {
        name: `Bone-shattering Strike`,
        desc: `Unmodified hit rolls for attacks made with a Brute Crusha is 6, that attack causes 3 mortal wounds to the target and the attack sequence ends.`,
        when: [COMBAT_PHASE],
        rule_sources: [rule_sources.BATTLETOME_SUPPLEMENT_IRONJAWZ],
      },
    ],
  },
  'Weirdbrute Wrekkaz': {
    effects: [
      GenericEffects.Elite,
      BerserkersEffect,
      {
        name: `Green Rage`,
        desc: `If the unmodified hit roll for an attack made by this unit is 6 and the target unit has 10 or more models, that attack scores 2 hits on the target instead of 1. Make a wound roll and save roll for each hit.`,
        when: [COMBAT_PHASE],
        rule_sources: [rule_sources.BATTLETOME_SUPPLEMENT_IRONJAWZ],
      },
      {
        name: `Weirdbrute Masks`,
        desc: `This unit has a ward of 5+ while it is within 3" of any enemy units.`,
        when: [WARDS_PHASE],
        rule_sources: [rule_sources.BATTLETOME_SUPPLEMENT_IRONJAWZ],
      },
    ],
  },
} satisfies TItemDescriptions

export default tagAs(IronjawzUnits, 'unit')

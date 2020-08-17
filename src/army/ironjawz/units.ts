import { DestructionUnits } from 'army/grand_alliances'
import { TBattalions, TUnits } from 'types/army'
import {
  BATTLESHOCK_PHASE,
  CHARGE_PHASE,
  COMBAT_PHASE,
  DURING_GAME,
  END_OF_COMBAT_PHASE,
  END_OF_HERO_PHASE,
  HERO_PHASE,
  START_OF_COMBAT_PHASE,
  TURN_ONE_HERO_PHASE,
  WOUND_ALLOCATION,
} from 'types/phases'
import { filterUnits } from 'utils/filterUtils'

const getRogueIdol = () => filterUnits(DestructionUnits, [`Rogue Idol`])[0]

const MegabossEffects = [
  {
    name: `Rip-toof Fist`,
    desc: `If the unmodified save roll for an attack that targets this model is 6, the attacking unit suffers 1 mortal wound after all of its attacks have been resolved.`,
    when: [COMBAT_PHASE],
  },
  {
    name: `Strength from Victory`,
    desc: `If any enemy models were slain by wounds inflicted by this model's attacks in that combat phase, add 1 to this model's Wounds characteristic and add 1 to the Attacks characteristic of this model's Boss Choppa and Rip-toof Fist.`,
    when: [END_OF_COMBAT_PHASE],
  },
  {
    name: `Go on Ladz, Get Stuck In!`,
    desc: `Pick 1 friendly IRONJAWZ unit wholly within 12" of a friendly model with this command ability, or wholly within 18" of a friendly model with this command ability that is a MONSTER. Until the end of that phase, add 1 to hit rolls for attacks made by that unit. A unit cannot benefit from this command ability more than once per phase.`,
    when: [START_OF_COMBAT_PHASE],
    command_ability: true,
  },
]

const DuffUpdaBigThingEffect = {
  name: `Duff Up da Big Thing`,
  desc: `Add 1 to the hit rolls for attacks made by this unit that target a unit with a Wounds characteristic of 4+.`,
  when: [COMBAT_PHASE],
}

// Unit Names
export const Units: TUnits = [
  {
    name: `Gordrakk the Fist of Gork`,
    effects: [
      {
        name: `Smasha`,
        desc: `If the unmodified wound roll for an attack made by Smasha that targets a HERO that is not a WIZARD is 4+, that attack inflicts D3 mortal wounds on the target and the attack sequence ends (do not make a save roll or damage roll).`,
        when: [COMBAT_PHASE],
      },
      {
        name: `Kunnin'`,
        desc: `If the unmodified wound roll for an attack made by Kunnin' that targets a WIZARD is 4+, that attack inflicts D3 mortal wounds on the target and the attack sequence ends (do not make a save roll).`,
        when: [COMBAT_PHASE],
      },
      {
        name: `Massively Destructive Bulk`,
        desc: `After a Maw-krusha completes a charge move, pick an enemy unit within 1" and roll the number of dice shown for the Maw-krusha's Massively Destructive Bulk on the damage table above; the enemy unit suffers 1 mortal wound for each roll of 5+.

          In addition, after this model makes a charge move, you can pick 1 terrain feature within 1" of this model and rull a number of dice equal to the Massively Destructive Bulk table, if you score any 6+ then units no longer benefit from cover provided by that terrain feature.

          If the wounds inflicted by a Maw-krusha's Destructive Bulk attack mean that there are no enemy models left within 3" of it, then it can immediately make another charge move (and can make another Massively Destructive Bulk attack after the move if the charge is successfully carried out). A Maw-krusha can make any number of charge moves like this in a single turn, so long as each one results in all enemy models within 3" being slain.`,
        when: [CHARGE_PHASE],
      },
      {
        name: `Strength from Victory`,
        desc: `If any enemy models were slain by wounds inflicted by this model's attacks in that combat phase, add 1 to this model's Wounds characteristic and add 1 to the Attacks characteristic of Smasha and Kunnin'.`,
        when: [END_OF_COMBAT_PHASE],
      },
      {
        name: `Voice of Gork`,
        desc: `Pick up to 3 friendly DESTRUCTION units wholly within 24" of this model. Until the end of that phase, add 1 to hit rolls for attacks made by that unit. A unit cannot benefit from this command ability more than once per phase, and a unit cannot benefit from this ability and the Go on Ladz, Get Stuck In! ability in the same phase.`,
        when: [START_OF_COMBAT_PHASE],
        command_ability: true,
      },
    ],
  },
  {
    name: `Megaboss on Maw-Krusha`,
    effects: [
      ...MegabossEffects,
      {
        name: `Destructive Bulk`,
        desc: `After this model makes a charge move, you can pick 1 enemy unit within 1" of this model and roll a number of dice equal to the Destructive Bulk value on this model's damage table. For each 5+, that enemy unit suffers1 mortal wound.

        If the mortal wounds inflicted by this model's Destructive Bulk mean there are no enemy models left within 3" of it, then it can attempt to make another charge move, and it can make another Destructive Bulk attack after that move if the charge is successfully carried out. This model can attempt to make any number of charge moves in a single turn, so long as each one results in all enemy models within 3" being slain.`,
        when: [CHARGE_PHASE],
      },
    ],
  },
  {
    name: `Orruk Megaboss`,
    effects: [...MegabossEffects],
  },
  {
    name: `Orruk Warchanter`,
    effects: [
      {
        name: `Warchanter's Beat`,
        desc: `If the unmodified hit roll for an attack made with a Gorkstikk and Morkstikk is 6, that attack scores 2 hits on the target instead of 1. Make a wound and save roll for each hit.`,
        when: [COMBAT_PHASE],
      },
      {
        name: `Violent Fury`,
        desc: `You can pick 1 friendly IRONJAWZ unit wholly within 15" of this model. Until your next hero phase, add 1 to the damage inflicted by attacks made with melee weapons by that unit. A unit cannot benefit from this ability more than once per phase.`,
        when: [HERO_PHASE],
      },
    ],
  },
  {
    name: `Orruk Weirdnob Shaman`,
    effects: [
      {
        name: `Brutal Power`,
        desc: `If this model is wholly within 18" of a friendly IRONJAWZ unit with 10 or more models at the end of its hero phase, it can attempt to cast the Green Puke spell in addition to any other spells it can cast, and even if a WIZARD has already attempted to cast the Green Puke spell in that hero phase.`,
        when: [END_OF_HERO_PHASE],
      },
      {
        name: `Green Puke`,
        desc: `Casting value of 6. Pick 1 point on the battlefield within 2D6" of the caster that is visible to them, and draw an imaginary straight line 1mm wide between that point and the closest part of the caster's base. Each unit that has models passed across by this line suffers D3 mortal wounds.`,
        when: [HERO_PHASE],
        spell: true,
      },
    ],
  },
  {
    name: `Orruk Ardboys`,
    effects: [
      {
        name: `Waaagh! Drummers`,
        desc: `Add 2 to charge rolls for a unit while it includes any Waaagh! Drummers.`,
        when: [CHARGE_PHASE],
      },
      {
        name: `Gorkamorka Banner Bearer`,
        desc: `Add 2 to the Bravery characteristic of this unit while it includes any Gorkamorka Banner Bearers.`,
        when: [BATTLESHOCK_PHASE],
      },
      {
        name: `Gorkamorka Glyph Bearer`,
        desc: `Subtract 1 from the Bravery characteristic of enemy units while they are within 3" of any friendly Gorkamorka Glyph Bearers.`,
        when: [BATTLESHOCK_PHASE],
      },
      {
        name: `Orruk-forged Shields!`,
        desc: `Roll a D6 each time you allocate a wound to a model carrying an Orruk-forged Shield. On a 6, that wound is negated.`,
        when: [WOUND_ALLOCATION],
      },
    ],
  },
  {
    name: `Orruk Brutes`,
    effects: [DuffUpdaBigThingEffect],
  },
  {
    name: `Orruk Gore-gruntas`,
    effects: [
      {
        name: `Gore-grunta Charge`,
        desc: `Roll a D6 for each enemy unit that is within 1" of a model from this unit after the model from this unit finishesa charge move. On a 4+, that enemy unit suffers 1 mortal wound. If this unit has more than 1 model, roll to determine if mortal wounds are inflicted after each model completes its charge move, but do not allocate the mortal wounds until after all of the models in the unit have moved.
        
        In addition, add 1 to hit rolls and wound rolls for attacks made with this unit's Jagged Gore-hackas and Tusks and Hooves if this unit made a charge move in the same turn.`,
        when: [CHARGE_PHASE],
      },
    ],
  },
  {
    name: `Ironskull's Boyz`,
    effects: [
      {
        name: `Dead 'Ard`,
        desc: `Roll a D6 each time you allocate a wound or mortal wound to this unit. On a 6, the wound or mortal wound is negated. Wounds or mortal wounds allocated to Gurzag Ironskull are negated on a 5+ instead of a 6.`,
        when: [WOUND_ALLOCATION],
      },
      {
        name: `Paired Choppas`,
        desc: `Add 1 to hit rolls for attacks made with a Pair of Ardboy Choppas.`,
        when: [COMBAT_PHASE],
      },
    ],
  },
  {
    name: `Morgok's Krushas`,
    effects: [
      {
        name: `Morgok`,
        desc: `Add 1 to the Attacks characteristic of Morgok's Krusha Weapons.`,
        when: [COMBAT_PHASE],
      },
      DuffUpdaBigThingEffect,
      {
        name: `Beastbashas`,
        desc: `The first time an enemy Monster is destroyed by an attack from this unit, add 1 to this unit's wound rolls for the remainder of the battle.`,
        when: [COMBAT_PHASE],
      },
    ],
  },
  getRogueIdol(),
]

// Battalions
export const Battalions: TBattalions = [
  {
    name: `Ardfist`,
    effects: [
      {
        name: `Drawn to the Waaagh!`,
        desc: `You can use this command ability if the Orruk Warchanter from this battalion is on the battlefield when a unit from this battalion is destroyed. If you do so, roll a D6. On a 4+, a new unit identical to the one that was destroyed is added to your army. Set up the new unit wholly within 6" of the edge of the battlefield and more than 9" from any enemy units. You cannot use this command ability more than once per phase.`,
        when: [DURING_GAME],
        command_ability: true,
      },
    ],
  },
  {
    name: `BruteFist`,
    effects: [
      {
        name: `Brute Big Boss`,
        desc: `Pick 1 Brute Boss from a unit in this battalion to be the battalion's Big Boss. That model has a Wounds characteristic of 5 instead of 3.`,
        when: [DURING_GAME],
      },
      {
        name: `Green-skinned Battering Ram`,
        desc: `After a model from a unit in this battalion makes a charge move, you can pick 1 enemy unit within 1" of that model and roll a D6. On a 4+, that enemy unit suffers 1 mortal wound. If that model's unit has more than 1 model, roll to determine if a mortal wound is inflicted each time a model from that unit completes its charge move, but do not allocate the mortal wounds until all of the models in that unit have moved.`,
        when: [CHARGE_PHASE],
      },
    ],
  },
  {
    name: `Gorefist`,
    effects: [
      {
        name: `Gore-grunta Big Boss`,
        desc: `Pick 1 Gore-grunta Boss from a unit in this battalion to be the battalion's Big Boss. That model has a Wounds characteristic of 7 instead of 5.`,
        when: [DURING_GAME],
      },
      {
        name: `Da Boss's Big Idea`,
        desc: `Each unit from this battalion that is wholly within 18" of the Big Boss from the same battalion at the start of that hero phase can make a normal move, but cannot run.`,
        when: [TURN_ONE_HERO_PHASE],
      },
    ],
  },
  {
    name: `Ironfist`,
    effects: [
      {
        name: `Ironfist Big Boss`,
        desc: `Pick 1 Brute Boss or Gore-grunta Boss from a unit in this battalion to be the battalion's Big Boss. Add 2 to that model's Wounds characteristic.`,
        when: [DURING_GAME],
      },
      {
        name: `Up and At'Em`,
        desc: `Once in each of your hero phases, the Big Boss from this battalion can use the Mighty Destroyers command ability (pg 55) as if they were a MEGABOSS and without spending 1 command point.`,
        when: [HERO_PHASE],
      },
    ],
  },
  {
    name: `Weirdfist`,
    effects: [
      {
        name: `Weird Energy`,
        desc: `If the WEIRDNOB SHAMAN from this battalion is wholly within 18" of 2 or more units from the same battalion that each have 10 or more models, it can use its Brutal Power ability to attempt to cast Green Puke twice, in addition to any other spells it can cast, instead of only once.`,
        when: [END_OF_HERO_PHASE],
      },
    ],
  },
]

import { TBattalions, TUnits } from 'types/army'
import {
  BATTLESHOCK_PHASE,
  CHARGE_PHASE,
  COMBAT_PHASE,
  DURING_GAME,
  END_OF_COMBAT_PHASE,
  END_OF_HERO_PHASE,
  END_OF_SETUP,
  HERO_PHASE,
  MOVEMENT_PHASE,
  START_OF_COMBAT_PHASE,
  START_OF_GAME,
  START_OF_SETUP,
  TURN_ONE_HERO_PHASE,
} from 'types/phases'

// Unit Names
export const Units: TUnits = [
  {
    name: `Gordrakk the Fist of Gork`,
    effects: [
      {
        name: `Smasha`,
        desc: `Unmodified wound rolls of 4+ inflict D3 mortal wounds if the target is a HERO and not a WIZARD and the attack sequence ends.`,
        when: [COMBAT_PHASE],
      },
      {
        name: `Kunnin'`,
        desc: `Unmodified wound rolls of 4+ inflict D3 mortal wounds if the target is a WIZARD and the attack sequence ends.`,
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
        desc: `If any enemy models were slain by wounds inflicted by this model's attacks in the combat phase, add 1 to this model's Wounds characteristic and add 1 to the attacks of Smasha and Kunnin'.`,
        when: [END_OF_COMBAT_PHASE],
      },
      {
        name: `Voice of Gork`,
        desc: `Pick up to 3 friendly DESTRUCTION units wholly within 24", until the end of the combat phase add 1 to hit rolls for attacks made by those units. A unit cannot benefit from this CA multiple times, and this CA does not stack with 'Go on Ladz, Get Stuck In!'`,
        when: [START_OF_COMBAT_PHASE],
        command_ability: true,
      },
    ],
  },
  {
    name: `Megaboss on Maw-Krusha`,
    effects: [
      {
        name: `Strength from Victory`,
        desc: `If any enemy models were slain in this combat phase, add +1 attack to the Megaboss's weapon (not Mount) and add +1 to the models Wounds characteristic.`,
        when: [END_OF_COMBAT_PHASE],
      },
      {
        name: `Go on Ladz, Get Stuck In!`,
        desc: `Pick 1 friendly IRONJAWZ unit wholly within 12" of a friendly model with this command ability, or wholly within 18" of a friendly model with this command ability that is a MONSTER. Until the end of the phase, add 1 to hit rolls for attacks made by that unit. A unit cannot benefit from this command ability more than once per phase.`,
        when: [START_OF_COMBAT_PHASE],
        command_ability: true,
      },
      {
        name: `Destructive Bulk`,
        desc: `After a Maw-krusha completes a charge move, pick an enemy unit within 1" and roll the number of dice shown for the Maw-krusha's Destructive Bulk on the damage table above; the enemy unit suffers 1 mortal wound for each roll of 5+.
        
        In addition, after this model makes a charge move, you can pick 1 terrain feature within 1" of this model and rull a number of dice equal to the Destructive Bulk table, if you score any 6+ then units no longer benefit from cover provided by that terrain feature.
          
        If the wounds inflicted by a Maw-krusha's Destructive Bulk attack mean that there are no enemy models left within 3" of it, then it can immediately make another charge move (and can make another Destructive Bulk attack after the move if the charge is successfully carried out). A Maw-krusha can make any number of charge moves like this in a single turn, so long as each one results in all enemy models within 3" being slain.`,
        when: [CHARGE_PHASE],
      },
      {
        name: `Rip-toof First`,
        desc: `If the unmodified save roll for an attack that targets a model with a Rip-toof Fist is 6, the attacking unit suffers 1 mortal wound after all of its attacks have been resolved.`,
        when: [COMBAT_PHASE],
      },
    ],
  },
  {
    name: `Orruk Megaboss`,
    effects: [
      {
        name: `Rip-toof First`,
        desc: `If the unmodified save roll for an attack that targets a model with a Rip-toof Fist is 6, the attacking unit suffers 1 mortal wound after all of its attacks have been resolved.`,
        when: [COMBAT_PHASE],
      },
      {
        name: `Strength from Victory`,
        desc: `If any enemy models were slain in this combat phase, add +1 attack to the Megaboss's weapon (not Mount) and add +1 to the models Wounds characteristic.`,
        when: [END_OF_COMBAT_PHASE],
      },
      {
        name: `Go on Ladz, Get Stuck In!`,
        desc: `Pick 1 friendly IRONJAWZ unit wholly within 12" of a friendly model with this command ability, or wholly within 18" of a friendly model with this command ability that is a MONSTER. Until the end of the phase, add 1 to hit rolls for attacks made by that unit. A unit cannot benefit from this command ability more than once per phase.`,
        when: [START_OF_COMBAT_PHASE],
        command_ability: true,
      },
    ],
  },
  {
    name: `Orruk Warchanter`,
    effects: [
      {
        name: `Warchanter's Beat`,
        desc: `Each time you make a hit roll of 6 for a Warchanter's Gorkstikk and Morkstikk, you score 2 attacks instead of 1 with the weapon.`,
        when: [COMBAT_PHASE],
      },
      {
        name: `Frenzy of Violence`,
        desc: `Pick one IRONJAWZ unit that is wholly within 15" of the Warchanter in your hero phase. Add 1 to the damage inflicted by attacks made with melee weapons by that unit until your next hero phase. A unit cannot benefit from this ability more than once per phase.`,
        when: [HERO_PHASE],
      },
    ],
  },
  {
    name: `Orruk Weirdnob Shaman`,
    effects: [
      {
        name: `Brutal POwer`,
        desc: `If this model is wholly within 18" of a friendly IRONJAWZ unit with 10 or more models at the end of its hero phase, it can attempt to cast the Green Puke Spell in addition to any other spells it can cast, even if Green Puke was already attempted earlier in the phase.`,
        when: [END_OF_HERO_PHASE],
      },
      {
        name: `Green Puke`,
        desc: `Casting value 6. Pick 1 point on the battlefield within 2d6" of the caster that is visible, draw an imaginary straight line 1mm wide between that point and the closest part of the caster's base. Each unit that has models passed across by this line suffers D3 Mortal Wounds.`,
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
        desc: `Add 2 to charge rolls for a unit that includes any Waaagh! Drummers.`,
        when: [CHARGE_PHASE],
      },
      {
        name: `Gorkamorka Banner Bearer`,
        desc: `You can add 2 to the Bravery of all models in a unit that includes any Orruk Banners.`,
        when: [BATTLESHOCK_PHASE],
      },
      {
        name: `Gorkamorka Glyph Bearer`,
        desc: `Subtract 1 from the Bravery characteristic of enemy units while they are within 3" of any friendly Gorkamorka Glyph Bearers.`,
        when: [BATTLESHOCK_PHASE],
      },
      {
        name: `Orruk-forged Shields!`,
        desc: `Roll a dice before allocating a wound to a model with an Orruk-forged Shield. On a roll of 6 the wound is ignored.`,
        when: [COMBAT_PHASE],
      },
    ],
  },
  {
    name: `Orruk Brutes`,
    effects: [
      {
        name: `Duff Up da Big Thing`,
        desc: `Add 1 to hit rolls for an Orruk Brute if the target has a Wounds characteristic of 4+.`,
        when: [COMBAT_PHASE],
      },
    ],
  },
  {
    name: `Orruk Gore Gruntas`,
    effects: [
      {
        name: `Gore-grunta Charge`,
        desc: `Roll a dice for each enemy unit that is within 1" of a model from this unit after the model has finished a charge move. On a 4+, that enemy unit suffers 1 Mortal Wound. Allocate the Mortal Wounds after all models have completed their charge. 
          
          In addition, add 1 to hit rolls and wound rolls for attacks made with this unit's Jagged Gore-hackas and tucks and hooves if this unit made a charge move in the same turn.`,
        when: [CHARGE_PHASE],
      },
    ],
  },
  {
    name: `Ironskull's Boyz`,
    effects: [
      {
        name: `Dead 'Ard`,
        desc: `Roll a 1D6 each time you allocate a wound or mortal wound to this unit. On a 6+ the wound is negated. Wounds or mortal wounds allocated to Gurzag Ironskull are negated on a 5+ instead of a 6+.`,
        when: [DURING_GAME],
      },
      {
        name: `Paired Choppas`,
        desc: `Add 1 to hit rolls for attacks made with a Pair of Ardboy Choppas.`,
        when: [COMBAT_PHASE],
      },
    ],
  },
]

// Battalions
export const Battalions: TBattalions = [
  {
    name: `Ardfist`,
    effects: [
      {
        name: `Drawn to the Waaagh!`,
        desc: `Once per battle, if this battalion's Warchanter is on the battlefield, you can replace any units from this battalion that have been destroyed. The replacement unit is identical to the unit that was destroyed, and must be set up with all models within 6" of the edge of the battlefield, and more than 6" from any enemy units. The replacement unit must be deployed as close to the battalion's Warchanter as possible. This counts as the unit's move for the following movement phase.`,
        when: [HERO_PHASE],
      },
    ],
  },
  {
    name: `Brawl`,
    effects: [
      {
        name: `Big Waaagh!`,
        desc: `If the Megaboss of this battalion is within 10" of a Warchanter and a Weirdnob Shaman from the battalion in the hero phase, then the Megaboss can use the Big Waaagh! command ability.
        
        When a Megaboss calls a Big Waaagh!, all units from the Brawl that are within 15" of the Megaboss at the start of the following combat phase make 2 extra attacks with each of their melee weapons. Any units that don't receive this bonus but which are within 10" of a Big Boss from the Brawl make 1 extra attack instead with each of their melee weapons.`,
        when: [HERO_PHASE],
      },
    ],
  },
  {
    name: `Brute Fist`,
    effects: [
      {
        name: `Brute Big Boss`,
        desc: `Pick a Brute Boss from one of the units in this battalion to be the battalion's Big Boss. The model you pick has a Wounds characteristic of 5 rather than 3.`,
        when: [DURING_GAME],
      },
      {
        name: `Green-skinned Battering Ram`,
        desc: `In your hero phase, units from the battalion within 10" of its Brute Big Boss (including his own unit) can make a charge move as if it were the charge phase. If the charge is successful, pick one enemy unit within 3" of the unit that charged; it suffers D3 mortal wounds.`,
        when: [HERO_PHASE],
      },
    ],
  },
  {
    name: `Gorefist`,
    effects: [
      {
        name: `Gore-grunta Big Boss`,
        desc: `Pick a Gore-grunta Boss from one of the units in this battalion to be the battalion's Big Boss. The model you pick has a Wounds characteristic of 7 rather than 5.`,
        when: [DURING_GAME],
      },
      {
        name: `Gore-grunta Formations`,
        desc: `If all of the battalion's units are set up within 10" of the Big Boss' unit, all of the units in the battalion may make a move of 15" in the hero phase of their first turn. The move is made as if it were the movement phase, except that the units cannot run. It does not stop the units from moving again normally later in the turn. After the first turn, the formation dissolves, and the normal rules apply for the rest of the battle.`,
        when: [TURN_ONE_HERO_PHASE],
      },
    ],
  },
  {
    name: `Ironfist`,
    effects: [
      {
        name: `Ironfist Big Boss`,
        desc: `Pick a Brute Boss or Gore-grunta Boss from the battalion to be its Big Boss, and add 2 to their Wounds characteristic.`,
        when: [DURING_GAME],
      },
      {
        name: `'Ere We Go! 'Ere We Go! 'Ere We Go!`,
        desc: `In your hero phase, if this battalion's Big Boss is on the battlefield, roll a D6. Each unit from the same battalion can make a normal move of up to a number of inches equal to the roll (they cannot run or retreat).`,
        when: [HERO_PHASE],
      },
    ],
  },
  {
    name: `Weirdfist`,
    effects: [
      {
        name: `Weird Energy`,
        desc: `Roll one dice for each unit from the battalion that is within 10" of the Weirdnob when an Arcane Bolt, Green Puke, of Foot of Gork spell is successfully cast. Add 6" to the spell's range for each of these dice that rolls 1-3, and add 1 to the mortal wounds inflicted by the spell for each roll of 4-6. If the spell inflicts mortal wounds more than once, add the bonus each time!`,
        when: [HERO_PHASE],
      },
    ],
  },
  {
    name: `Bloodtoofs`,
    effects: [
      {
        name: `Hunt and Crush`,
        desc: `Add 1 to run and charge rolls for units from this battalion.`,
        when: [MOVEMENT_PHASE, CHARGE_PHASE],
      },
      {
        name: `Get Da Realmgate!`,
        desc: `After territories have been chosen but before armies are set up, you can set up 1 Baleful Realmgate terrain feature in your opponent's territory. Add 2 to the Bravery characteristic of units from this battalion while there are any Baleful Realmgates on the battlefield.`,
        when: [START_OF_SETUP],
      },
      {
        name: `Get Da Realmgate!`,
        desc: `If there are any Baleful Realmgate terrain features on the battlefield, each unit from this battalion counts as 2 units for the purposes of Zogbak Realmrippa's Mighty Waaagh ability.`,
        when: [START_OF_COMBAT_PHASE],
      },
    ],
  },
  {
    name: `Ironsunz`,
    effects: [
      {
        name: `Dakkbad's Cunning`,
        desc: `Roll a D6 after set-up is complete, but before the battle begins. On a 2+ subtract 1 from hit rolls for enemy units in the first battle round.`,
        when: [END_OF_SETUP],
      },
      {
        name: `Dakkbad's Bashing!`,
        desc: `For the purposes of his Strength from Victories ability Dakkbad Grotkicker counts as already having slain D3 enemy HEROES when the battle starts, with the weapon of your choice from those listed on his warscroll.`,
        when: [START_OF_GAME],
      },
    ],
  },
]

import { TBattalions, TUnits } from 'types/army'
import {
  HERO_PHASE,
  COMBAT_PHASE,
  SHOOTING_PHASE,
  CHARGE_PHASE,
  START_OF_COMBAT_PHASE,
  BATTLESHOCK_PHASE,
  DURING_GAME,
  TURN_ONE_HERO_PHASE,
  END_OF_SETUP,
  START_OF_GAME,
  MOVEMENT_PHASE,
  START_OF_SETUP,
} from 'types/phases'

// Unit Names
export const Units: TUnits = [
  {
    name: `Gordrakk the Fist of Gork`,
    effects: [
      {
        name: `Smasha`,
        desc: `Wound rolls of 6 or more inflict 1D3 mortal wounds if the target is a Hero instead of their normal damage.`,
        when: [COMBAT_PHASE],
      },
      {
        name: `Kunnin'`,
        desc: `Wound rolls of 4 or more inflict 1D3 mortal wounds if the target is a Wizard instead of their normal damage`,
        when: [COMBAT_PHASE, SHOOTING_PHASE],
      },
      {
        name: `Destructive Bulk`,
        desc: `After a Maw-krusha completes a charge move, pick an enemy unit within 1" and roll the number of dice shown for the Maw-krusha’s Destructive Bulk on the damage table above; the enemy unit suffers 1 mortal wound for each roll of 4 or more.`,
        when: [CHARGE_PHASE],
      },
      {
        name: `On the Rampage`,
        desc: `If the wounds inflicted by a Maw-krusha’s Destructive Bulk attack mean that there are no enemy models left within 3" of it, then it can immediately make another charge move (and can make another Destructive Bulk attack after the move if the charge is successfully carried out). A Maw-krusha can make any number of charge moves like this in a single turn, so long as each one results in all enemy models within 3" being slain.`,
        when: [CHARGE_PHASE],
      },
      {
        name: `Voice of Gork`,
        desc: `Once per battle, in your hero phase, you can use this command ability once per battle, in your hero phase. If you do so, pick a friendly Destruction unit wholly within 24" of Gordrakk . In the following charge phase, that unit can declare a charge if it is within 18" of the enemy, and you can roll three dice to determine the distance it can charge. In addition, the unit makes 2 extra attacks with each of its melee weapons in the following combat phase. If the unit you chose is part of a warscroll battalion, then these benefits also apply to all other units from the battalion.`,
        when: [HERO_PHASE],
        command: true,
      },
    ],
  },
  {
    name: `Megaboss on Maw-Krusha`,
    effects: [
      {
        name: `Strength from Victory`,
        desc: `If a Megaboss makes an attack with their Boss Gore-hac- ka, Scrap-tooth, Choppa or Rip-tooth Fist that slays an enemy Hero, add 1 to their Wounds characteristic and to the Attacks characteristic of the weapon that inflicted the killing wound.`,
        when: [COMBAT_PHASE],
      },
      {
        name: `Mighty Waaagh!`,
        desc: `If a Megaboss on Mawkrusha uses this ability, count up the number of Ironjawz units within 15" of them at the start of the combat phase of the turn, and roll a dice. If the roll is less than or equal to the number of units, then this model and all models in those units make 1 extra attack with each of their me- lee weapons in that combat phase. If the roll is a 6, and there are at least 6 Ironjawz units within 15" of this model, then make 2 extra attacks rather than 1.`,
        when: [START_OF_COMBAT_PHASE],
        command: true,
      },
      {
        name: `Destructive Bulk`,
        desc: `After a Maw-krusha completes a charge move, pick an enemy unit within 1" and roll the number of dice shown for the Maw-krusha’s Destructive Bulk on the damage table above; the enemy unit suffers 1 mortal wound for each roll of 4 or more.`,
        when: [CHARGE_PHASE],
      },
      {
        name: `On the Rampage`,
        desc: `If the wounds inflicted by a Maw-krusha’s Destructive Bulk attack mean that there are no enemy models left within 3" of it, then it can immediately make another charge move (and can make another Destructive Bulk attack after the move if the charge is successfully carried out). A Maw-krusha can make any number of charge moves like this in a single turn, so long as each one results in all enemy models within 3" being slain.`,
        when: [CHARGE_PHASE],
      },
    ],
  },
  {
    name: `Orruk Megaboss`,
    effects: [
      {
        name: `Go on Ladz, Get Stuck In!`,
        desc: `You can re-roll hit rolls of 1 for friendly units of Brutes that are within 5" of this model when they make their attacks in the combat phase.`,
        when: [COMBAT_PHASE],
      },
      {
        name: `Strength from Victory`,
        desc: `If a Megaboss makes an attack that slays an enemy Hero, add 1 to their Wounds characte- ristic and to the Attacks characteristic of their Boss Choppa.`,
        when: [COMBAT_PHASE],
      },
      {
        name: `Waaagh!`,
        desc: `If a Megaboss uses this ability, count up the number of Ironjawz units within 10" of them at the start of the combat phase of the turn, and roll a dice. If the roll is less than or equal to the number of units, then this model and all models in those units make 1 extra attack with their melee weapons in that combat phase. If the roll is 6 or more, and there are at least 6 IRONJAWZ units within 10" of this model, then make 2 extra attacks rather than 1.`,
        when: [START_OF_COMBAT_PHASE],
        command: true,
      },
    ],
  },
  {
    name: `Orruk Warchanter`,
    effects: [
      {
        name: `Warchanter's Beat`,
        desc: `Each time you make a hit roll of 6 for a Warchanter’s Gorkstikk and Morkstikk, you can make one additio- nal attack with the weapon.`,
        when: [COMBAT_PHASE],
      },
      {
        name: `Frenzy of Violence`,
        desc: `Pick one Ironjawz unit that is within 10" of the Warchanter in your hero phase. You can add 1 to all hit rolls made for that unit in the following combat phase.`,
        when: [HERO_PHASE],
      },
    ],
  },
  {
    name: `Orruk Weirdnob Shaman`,
    effects: [
      {
        name: `Power of the Waaagh!!`,
        desc: `Add 1 to a Weirdnob Shaman’s casting or unbinding rolls if there are 10 or more Orruk models within 10". Add 2 to the roll instead if there are 20 or more Orruk models within 10". However, if the casting or unbinding roll was a double, then the closest other friendly Orruk unit within 10" of the Weirdnob Shaman suffers 1D3 mortal wounds`,
        when: [HERO_PHASE],
      },
    ],
  },
  {
    name: `Orruk Ardboys`,
    effects: [
      {
        name: `Waaagh! Drummers`,
        desc: `Models in this unit may be Waaagh! Drummers. Add 2 to charge rolls for a unit that includes any Waaagh! Drummers.`,
        when: [CHARGE_PHASE],
      },
      {
        name: `Orruk Banner`,
        desc: `You can add 2 to the Bra- very of all models in a unit that includes any Orruk Banners, as long as the enemy are within 3" of the unit.`,
        when: [BATTLESHOCK_PHASE],
      },
      {
        name: `Icon of Gork`,
        desc: `If a model flees from a unit that includes any of these Icons, roll a dice on a 6 the Standard Bearer thumps the cowardly orruk – they return to the fight and don’t flee.`,
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
        desc: `You can re-roll failed hit rolls for an Orruk Brute if the target has a Wounds characteristic of 4 or more.`,
        when: [COMBAT_PHASE],
      },
      {
        name: `Da Grab an'Bash`,
        desc: `When you make attacks for a Brute Boss armed with a Boss Klaw and Brute Smasha, roll to hit with the Boss Klaw first. If it scores any hits, then a model from the target unit has been grabbed by the Klaw, and the Brute Smasha hits automatically as long as it is used to attack the same target unit.`,
        when: [COMBAT_PHASE],
      },
    ],
  },
  {
    name: `Orruk Gore Gruntas`,
    effects: [
      {
        name: `Gore-grunta Charge`,
        desc: `When you declare a charge with a unit of Gore-gruntas, measure the distance to the nearest enemy unit. If the distance is 8" or more and the charge is successful, the grunta’s Fanged Maw and Hooves have a Damage characteristic of 1D3 instead of 1 until the end of that turn.`,
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
        desc: `Once per battle, if this battalion’s Warchanter is on the battlefield, you can replace any units from this battalion that have been destroyed. The replacement unit is identical to the unit that was destroyed, and must be set up with all models within 6" of the edge of the battlefield, and more than 6" from any enemy units. The replacement unit must be deployed as close to the battalion's Warchanter as possible. This counts as the unit's move for the following movement phase.`,
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
        desc: `In your hero phase, if this battalion’s Big Boss is on the battlefield, roll a dice. Each unit from the same battalion can make a normal move of up to a number of inches equal to the roll (they cannot run or retreat).`,
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
        desc: `Add 1 to run and charge rolls for units in a Bloodtoofs battalion.`,
        when: [MOVEMENT_PHASE, CHARGE_PHASE],
      },
      {
        name: `Get Da Realmgate!`,
        desc: `You can set up a Baleful Realmgate in your opponent’s territory before they set up any units. Add 2 to the Bravery characteristic of units in a Bloodtoofs battalion while there are any Baleful Realmgates on the battlefield.`,
        when: [START_OF_SETUP],
      },
    ],
  },
  {
    name: `Ironsunz`,
    effects: [
      {
        name: `Dakkbad's Cunning`,
        desc: `Roll a dice after set-up is complete, but before the battle begins. On a 3+ subtract 1 from hit rolls for enemy units in the first battle round.`,
        when: [END_OF_SETUP],
      },
      {
        name: `Dakkbad's Bashing!`,
        desc: `For the purposes of his Strength from Victories ability Dakkbad Grotkicker counts as already having slain an enemy HERO when the battle starts, with the weapon of your choice from those listed on his warscroll.`,
        when: [START_OF_GAME],
      },
    ],
  },
]

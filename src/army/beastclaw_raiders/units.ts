import { TBattalions, TUnits } from 'types/army'
import {
  BATTLESHOCK_PHASE,
  CHARGE_PHASE,
  COMBAT_PHASE,
  DURING_GAME,
  DURING_SETUP,
  END_OF_COMBAT_PHASE,
  HERO_PHASE,
  MOVEMENT_PHASE,
  SHOOTING_PHASE,
  START_OF_CHARGE_PHASE,
  START_OF_SETUP,
} from 'types/phases'

// Unit Names
export const Units: TUnits = [
  {
    name: `Icebrow Hunter`,
    effects: [
      {
        name: `Masters of Ambush`,
        desc: `Instead of setting up this model on the battlefield, you can place him to one side and say that he is set up in ambush. In any of your hero phases, you can set him up on the battlefield more than 9" from any enemy models. This is his move for the following movement phase.`,
        when: [DURING_SETUP, HERO_PHASE],
      },
      {
        name: `Mighty Throw`,
        desc: `An Icebrow Hunter can make an attack with his Great Throwing Spear even if he made a run move in the same turn. Furthermore, if he does so, the Damage inflicted by the Great Throwing Spear is increased from D3 to D6, and its range from 9" to 18".`,
        when: [SHOOTING_PHASE],
      },
      {
        name: `Icy Breath`,
        desc: `Instead of attacking with his missile weapons in your shooting phase, an Icebrow Hunter can unleash his icy breath. If he does so, pick a visible unit within 6" of the Icebrow Hunter and roll a D6; on a 4 or more that unit suffers D3 mortal wounds as its warriors are frozen solid.`,
        when: [SHOOTING_PHASE],
      },
    ],
  },
  {
    name: `Frostlord on Stonehorn`,
    effects: [
      {
        name: `Earth-shattering Charge`,
        desc: `If a Frostlord on a Stonehorn is within 12" of any enemy models at the start of your charge phase, it must attempt to charge, even if it ran in the movement phase! After this model completes its charge move, pick an enemy unit within 1"; that unit suffers D6 mortal wounds.`,
        when: [START_OF_CHARGE_PHASE],
      },
      {
        name: `Stone Skeleton`,
        desc: `Halve the Damage characteristic (rounding up) of weapons that target this model. In addition, halve the number of mortal wounds this model suffers from a spell or ability (rounding up).`,
        when: [DURING_GAME],
      },
      {
        name: `Bellowing Voice`,
        desc: `If a Frostlord uses this ability, then until your next hero phase you can re-roll all charge rolls for friendly BEASTCLAW RAIDERS units that are within 14" when they charge.`,
        when: [CHARGE_PHASE],
        command_ability: true,
      },
    ],
  },
  {
    name: `Frostlord on Thundertusk`,
    effects: [
      {
        name: `Blasts of Frost-wreathed Ice`,
        desc: `In the shooting phase, pick a unit within 18" that is visible to the Thundertusk. Do not use the attack sequence for an attack made with Frost-wreathed Ice. Instead roll a D6. On a 1, nothing happens. On a 2+, the target unit suffers the number of mortal wounds shown on the damage table on the warscroll.`,
        when: [SHOOTING_PHASE],
      },
      {
        name: `Numbing Chill`,
        desc: `Your opponent must subtract 1 from any hit rolls that target this model in the combat phase.`,
        when: [COMBAT_PHASE],
      },
      {
        name: `Bellowing Voice`,
        desc: `If a Frostlord uses this ability, then until your next hero phase you can re-roll all charge rolls for friendly BEASTCLAW RAIDERS units that are within 14" when they charge.`,
        when: [CHARGE_PHASE],
        command_ability: true,
      },
    ],
  },
  {
    name: `Huskard on Stonehorn`,
    effects: [
      {
        name: `Earth-shattering Charge`,
        desc: `If a Huskard on a Stonehorn is within 12" of any enemy models at the start of your charge phase, it must attempt to charge, even if it ran in the movement phase! After this model completes its charge move, pick an enemy unit within 1"; that unit suffers D6 mortal wounds.`,
        when: [START_OF_CHARGE_PHASE],
      },
      {
        name: `Stone Skeleton`,
        desc: `Halve the Damage characteristic (rounding up) of weapons that target this model. In addition, halve the number of mortal wounds this model suffers from a spell or ability (rounding up).`,
        when: [DURING_GAME],
      },
      {
        name: `Line-breakers`,
        desc: `After a Huskard on Stonehorn attacks in the combat phase, you can pick a MOURNFANG PACK within 10". That unit can immediately pile in and attack if it is within 3" of the enemy and has not already attacked this phase.`,
        when: [COMBAT_PHASE],
      },
      {
        name: `Blood Vulture`,
        desc: `A Huskard with a Blood Vulture can release it to hunt in each of your shooting phases. When he does so, pick a unit within 30" of the Huskard. Your opponent then picks one of their own units within 30" of the Huskard. Roll a D6; on a 1, 2 or 3 the unit your opponent picked suffers a mortal wound. On a 4, 5 or 6 the unit you picked suffers a mortal wound.`,
        when: [SHOOTING_PHASE],
      },
    ],
  },
  {
    name: `Huskard on Thundertusk`,
    effects: [
      {
        name: `Blasts of Frost-wreathed Ice`,
        desc: `In the shooting phase, pick a unit within 18" that is visible to the Thundertusk. Do not use the attack sequence for an attack made with Frost-wreathed Ice. Instead roll a D6. On a 1, nothing happens. On a 2+, the target unit suffers the number of mortal wounds shown on the damage table on the warscroll.`,
        when: [SHOOTING_PHASE],
      },
      {
        name: `Numbing Chill`,
        desc: `Your opponent must subtract 1 from any hit rolls that target this model in the combat phase.`,
        when: [COMBAT_PHASE],
      },
      {
        name: `Blizzard-speaker`,
        desc: `In your hero phase, a Huskard on a Thundertusk can select a BEASTCLAW RAIDERS unit within 18" and roll a D6. Add one to the result for each other friendly THUNDERTUSK unit within 18" of the unit you picked. On a 4 or more, select one of the abilities from the list below to apply to the unit you picked.
        
        Winter's Endurance: A second skin of ice forms on the unit as it is rimed with a healing frost. One model in the unit heals D3 wounds.
        
        Winter's Strength: Winter winds howl through the unit, chilling their blood and lending them strength. You can re-roll wound rolls of 1 for the unit until the start of your next hero phase.`,
        when: [HERO_PHASE],
      },
      {
        name: `Blood Vulture`,
        desc: `A Huskard with a Blood Vulture can release it to hunt in each of your shooting phases. When he does so, pick a unit within 30" of the Huskard. Your opponent then picks one of their own units within 30" of the Huskard. Roll a D6; on a 1, 2 or 3 the unit your opponent picked suffers a mortal wound. On a 4, 5 or 6 the unit you picked suffers a mortal wound.`,
        when: [SHOOTING_PHASE],
      },
    ],
  },
  {
    name: `Frost Sabres`,
    effects: [
      {
        name: `Their Master's Voice`,
        desc: `If this unit is within 16" of a friendly ICEBROW HUNTER at the start of the charge phase, you can add 3 to any charge rolls made for it in that phase.`,
        when: [CHARGE_PHASE],
      },
      {
        name: `Their Master's Voice`,
        desc: `Whilst the Frost Sabres are within 16" of a friendly ICEBROW HUNTER they have a Bravery of 7 rather than 5.`,
        when: [BATTLESHOCK_PHASE],
      },
    ],
  },
  {
    name: `Mournfang Pack`,
    effects: [
      {
        name: `Horn Blower`,
        desc: `Models in this unit may be Horn Blowers. You can roll three dice and pick the two highest results when determining the charge distance for a unit if it includes any Horn Blowers.`,
        when: [CHARGE_PHASE],
      },
      {
        name: `Banner Bearer`,
        desc: `You can re-roll dice rolls of 6 when taking a battleshock test for a unit that includes any Raiding Banners. Furthermore, roll a D6 whenever an enemy model flees whilst its unit is within 6" of any Raiding Banner from your army. On a 6, another model immediately flees from that unit.`,
        when: [BATTLESHOCK_PHASE],
      },
      {
        name: `Iron Fists`,
        desc: `Each time you make a successful save roll of 6 or more for a Mournfang Pack armed with Iron Fists, and the attacking unit is within 1", the attacking unit suffers 1 mortal wound after all of its attacks have been made.`,
        when: [SHOOTING_PHASE, COMBAT_PHASE],
      },
      {
        name: `Mournfang Charge`,
        desc: `Each time a Mournfang Pack model completes a charge move, select an enemy model within 1". On a roll of 4 or more, that model's unit suffers a mortal wound.`,
        when: [CHARGE_PHASE],
      },
    ],
  },
  {
    name: `Icefall Yhetees`,
    effects: [
      {
        name: `Aura of Frost`,
        desc: `Your opponent must subtract 1 from any hit rolls that target an Icefall Yhetee in the combat phase.`,
        when: [COMBAT_PHASE],
      },
      {
        name: `Bounding Leaps`,
        desc: `Icefall Yhetees can be chosen to pile in and attack in the combat phase if they are within 6" of an enemy, and can move up to 6" when they pile in.`,
        when: [COMBAT_PHASE],
      },
      {
        name: `Invigorated by the Blizzard`,
        desc: `You can run and charge with Icefall Yhetees in the same turn if they are within 16" of any friendly THUNDERTUSKS when they charge.`,
        when: [MOVEMENT_PHASE, CHARGE_PHASE],
      },
    ],
  },
  {
    name: `Stonehorn Beastriders`,
    effects: [
      {
        name: `Earth-shattering Charge`,
        desc: `If a Stonehorn is within 12" of any enemy models at the start of your charge phase, it must attempt to charge, even if it ran in the movement phase! After a Stonehorn completes its charge move, pick an enemy unit within 1"; that unit suffers D6 mortal wounds.`,
        when: [START_OF_CHARGE_PHASE],
      },
      {
        name: `Stone Skeleton`,
        desc: `Halve the Damage characteristic (rounding up) of weapons that target this model. In addition, halve the number of mortal wounds this model suffers from a spell or ability (rounding up).`,
        when: [DURING_GAME],
      },
      {
        name: `Blood Vulture`,
        desc: `A Thegn with a Blood Vulture can release it to hunt in each of your shooting phases. When he does so, pick a unit within 30" of the Thegn. Your opponent then picks one of their own units within 30" of the Thegn. Roll a D6; on a 1, 2 or 3 the unit your opponent picked suffers a mortal wound. On a 4, 5 or 6 the unit you picked suffers a mortal wound.`,
        when: [SHOOTING_PHASE],
      },
    ],
  },
  {
    name: `Thundertusk Beastriders`,
    effects: [
      {
        name: `Blasts of Frost-wreathed Ice`,
        desc: `In the shooting phase, pick a unit within 18" that is visible to the Thundertusk. Do not use the attack sequence for an attack made with Frost-wreathed Ice. Instead roll a D6. On a 1, nothing happens. On a 2+, the target unit suffers the number of mortal wounds shown on the damage table on the warscroll.`,
        when: [SHOOTING_PHASE],
      },
      {
        name: `Numbing Chill`,
        desc: `Your opponent must subtract 1 from any hit rolls that target this model in the combat phase.`,
        when: [COMBAT_PHASE],
      },
      {
        name: `Blood Vulture`,
        desc: `A Thegn with a Blood Vulture can release it to hunt in each of your shooting phases. When he does so, pick a unit within 30" of the Thegn. Your opponent then picks one of their own units within 30" of the Thegn. Roll a D6; on 1, 2 or a 3 the unit your opponent picked suffers a mortal wound. On a 4, 5 or 6 the unit you picked suffers a mortal wound.`,
        when: [SHOOTING_PHASE],
      },
    ],
  },
]

// Battalions
export const Battalions: TBattalions = [
  {
    name: `Braggoth's Beast Hammer`,
    effects: [
      {
        name: `A Hardy Breed`,
        desc: `Add 1 to Braggoth's Wounds characteristic.`,
        when: [DURING_GAME],
      },
      {
        name: `Fierce Rivals`,
        desc: `You can add 1 to hit rolls made for any BEASTCLAW RAIDERS unit from this battalion whilst it is within 6" of an IRONJAWZ unit from this battalion, and vice versa.`,
        when: [SHOOTING_PHASE, COMBAT_PHASE],
      },
      {
        name: `Overrunning Stampede`,
        desc: `Once per battle, at the end of any of your combat phases, this battalion can make an Overrunning Stampede. When it does so, each unit in this battalion that charged successfully this turn can immediately pile in and attack again, in an order of your choice.`,
        when: [END_OF_COMBAT_PHASE],
      },
    ],
  },
  {
    name: `Olwyr Alfrostun`,
    effects: [
      {
        name: `Cunning and Wise`,
        desc: `An Olwyr general can have two command traits instead of one. If you choose to randomly generate your general's command trait, re-roll any duplicate results.`,
        when: [START_OF_SETUP],
      },
      {
        name: `Vicious Beasts`,
        desc: `Add 1 to all hit rolls made for an Olwyr Mournfang's Tusks.`,
        when: [COMBAT_PHASE],
      },
      {
        name: `Swiftstride`,
        desc: `You can re-roll run rolls for all Olwyr units.`,
        when: [MOVEMENT_PHASE],
      },
    ],
  },
  {
    name: `Svard Alfrostun`,
    effects: [
      {
        name: `A Hardy Breed`,
        desc: `Add 1 to the Wounds characteristic of all Svard STONEHORN models.`,
        when: [DURING_GAME],
      },
    ],
  },
  {
    name: `Eurlbad`,
    effects: [
      {
        name: `Crush, Mangle, Tenderise`,
        desc: `If you roll a wound roll of 6 or more for an Eurlbad model in the combat phase, that attack inflicts one mortal wound on the target in addition to the normal damage.`,
        when: [COMBAT_PHASE],
      },
      {
        name: `Eating Hand`,
        desc: `Add 1 to the Damage characteristic of all melee weapons used by the Eurlbad's Huskard.`,
        when: [COMBAT_PHASE],
      },
    ],
  },
  {
    name: `Torrbad`,
    effects: [
      {
        name: `Heart-numbing Chill`,
        desc: `Enemy units cannot retreat whilst they are within 3" of any Torrbad unit.`,
        when: [MOVEMENT_PHASE],
      },
      {
        name: `Heart-numbing Chill`,
        desc: `Roll a D6 in each of your hero phases for each enemy unit within 3" of at least one of your Torbadd Thundertusks. Add 1 to the result of this dice roll for each additional Torrbad Thundertusk that is within 3" of the unit being rolled for. On a 6 the unit suffers a mortal wound, on a 7 it suffers D3 mortal wounds and on an 8 or more it suffers D6 mortal wounds.`,
        when: [HERO_PHASE],
      },
    ],
  },
  {
    name: `Skal`,
    effects: [
      {
        name: `Hunting Pack`,
        desc: `During set-up, you can place units of Frost Sabres from the Skal to one side.`,
        when: [DURING_SETUP],
      },
      {
        name: `Hunting Pack`,
        desc: `In any of your hero phases, when an Icebrow Hunter from this battalion sets up from ambush (see the Icebrow Hunter's Masters of Ambush ability), you can also set up any units of Frost Sabres that you set to one side earlier - these units are set up anywhere on the battlefield that is within 18" of an ambushing Icebrow Hunter, but not within 9" of any enemy models. This is their move for the following movement phase.`,
        when: [HERO_PHASE],
      },
    ],
  },
  {
    name: `Alfrostun`,
    effects: [
      {
        name: `Alfrostun Avalanche`,
        desc: `On a turn in which they charged into combat, you can re-roll all failed wound rolls made for BEASTCLAW RAIDER models in the combat phase.`,
        when: [COMBAT_PHASE],
      },
    ],
  },
  {
    name: `Jorlbad`,
    effects: [
      {
        name: `Tip of the Hunting Spear`,
        desc: `Jorlbad units can run and charge in the same turn.`,
        when: [MOVEMENT_PHASE, CHARGE_PHASE],
      },
      {
        name: `Fighting Hand`,
        desc: `You can re-roll failed battleshock tests for friendly BEASTCLAW RAIDERS units that are within 12" of the Jorlbad's Huskard.`,
        when: [BATTLESHOCK_PHASE],
      },
    ],
  },
]

import { TBattalions, TUnits } from 'types/army'
import {
  CHARGE_PHASE,
  COMBAT_PHASE,
  DURING_GAME,
  END_OF_COMBAT_PHASE,
  HERO_PHASE,
  MOVEMENT_PHASE,
  SHOOTING_PHASE,
  START_OF_HERO_PHASE,
} from 'types/phases'

// Unit Names
export const Units: TUnits = [
  {
    name: `Wurrgog Prophet`,
    effects: [
      {
        name: `Beast Mask`,
        desc: `The Wurrgog Prophet is -1 to be hit in combat.`,
        when: [COMBAT_PHASE],
      },
      {
        name: `Prophet of da Waaagh!`,
        desc: `Select a Bonesplitterz unit within 15". That unit can immediately pile in and attack as if it were the combat phase. This does not prevent the unit from attacking again later. The same unit cannot be affected by this Command ability more than once per phase.`,
        when: [HERO_PHASE],
        command_ability: true,
      },
      {
        name: `Fists of Gork`,
        desc: `Casting value 8. Pick an enemy unit within 18". Roll one dice for each model in the unit that is visible to the caster. The unit suffers 1 mortal wound for each 6+. If the casting roll was a successful double then it does 1 mortal wound on a 5+.`,
        when: [HERO_PHASE],
        spell: true,
      },
    ],
  },
  {
    name: `Maniak Weirdnob`,
    effects: [
      {
        name: `Tusker Charge`,
        desc: `Re-roll failed wound rolls when attacking with this model's War Boar's tusks if it charged in the same turn.`,
        when: [COMBAT_PHASE],
      },
      {
        name: `Ju-Ju Squig`,
        desc: `Once per battle, a Maniak Weirdnob can choose to reroll a failed casting roll.`,
        when: [HERO_PHASE],
      },
      {
        name: `Bone Spirit`,
        desc: `Casting value 4. You can re-roll hit rolls of 1 for the caster and any friendly units of Bonesplitterz that are within 10" when they attack until your next Hero phase. If the casting roll was a double and the spell was cast, you can also reroll all failled hit rolls.`,
        when: [HERO_PHASE],
        spell: true,
      },
    ],
  },
  {
    name: `Savage Big Boss`,
    effects: [
      {
        name: `Let Me at 'Em`,
        desc: `After this model has fought in the combat phase for the first time, you can pick a friendly Bonesplitterz unit that has not yet fought in that combat phase and which is within 3" of an enemy unit and within 10" of this model. That unit fights immediately, before the opposing player picks a unit to fight in that combat phase.`,
        when: [COMBAT_PHASE],
      },
      {
        name: `Savage Attack`,
        desc: `You can select a Bonesplitterz unit within 10". Until your next hero phase, whenever you make a hit roll of 6 or more for a model in that unit, it can immediately make 1 extra attack using the same weapon.`,
        when: [COMBAT_PHASE, HERO_PHASE],
        command_ability: true,
      },
    ],
  },
  {
    name: `Wardokk`,
    effects: [
      {
        name: `Ritual Dance`,
        desc: ` Roll a dice for each Wardokk at the start of the hero phase.

          1-2: Grimdokk Dance: Pick a Bonesplitterz model within 10". That model heals D3 wounds.
          3-4: Ju-Ju Dance: Pick a Bonesplitterz unit within 10". You can re-roll save rolls of 1 for that unit until your next hero phase.
          5-6: Pick a Bonesplitterz Wizard within 10". Until your next hero phase, add 1 to the casting and unbinding rolls for that model.`,
        when: [START_OF_HERO_PHASE],
      },
    ],
  },
  {
    name: `Savage Orruks`,
    effects: [
      {
        name: `Skull Thumper`,
        desc: `Add 2 to the charge rolls of a unit of Savage Orruks with a skull thumpers.`,
        when: [CHARGE_PHASE],
      },
      {
        name: `Mad with the Power of the Waagh!`,
        desc: `Re-roll wound rolls of 1 for units of Savage Orruks that have at least 20 models. Re-roll all failed wound rolls if the unit has at least 30 models.`,
        when: [COMBAT_PHASE],
      },
      {
        name: `Bone Shield`,
        desc: `Savage Orruks have a 5+ save during the combat phase.`,
        when: [COMBAT_PHASE],
      },
    ],
  },
  {
    name: `Savage Boarboys`,
    effects: [
      {
        name: `Boar Thumper`,
        desc: `Add 2 to the charge rolls of a unit of Savage Boarboys with a skull thumpers.`,
        when: [CHARGE_PHASE],
      },
      {
        name: `Tusker Charge`,
        desc: `Re-roll failed wound rolls when attacking with War Boars' Tusks if this unit charged in the same turn.`,
        when: [COMBAT_PHASE],
      },
      {
        name: `Boar Stikka`,
        desc: `Boar stikkas deal 2 Damage against Monsters.`,
        when: [COMBAT_PHASE],
      },
      {
        name: `Hit & Run`,
        desc: `Boarboys can retreat and charge.`,
        when: [MOVEMENT_PHASE],
      },
      {
        name: `Bone Shield`,
        desc: `Boarboys have a 5+ save in the combat phase.`,
        when: [COMBAT_PHASE],
      },
    ],
  },
  {
    name: `Savage Big Stabbas`,
    effects: [
      {
        name: `Monster Hunters`,
        desc: `Add D3 to the Damage inflicted by a Gork Toof if the target is a monster.`,
        when: [COMBAT_PHASE],
      },
      {
        name: `Da Final Fling`,
        desc: `If slain, pick an enemy unit wihtin 3" of the Big Stabba team before the model is removed. That unit suffers D3 Mortal Wounds.`,
        when: [DURING_GAME],
      },
    ],
  },
  {
    name: `Savage Orruk Morboys`,
    effects: [
      {
        name: `Skull Thumper`,
        desc: `Add 2 to the charge rolls of a unit of Savage Orruks Morboys with a skull thumpers.`,
        when: [CHARGE_PHASE],
      },
      {
        name: `Power of the Beast Spirit`,
        desc: `Add 1 to the hit rolls for any Savage Orruk Morboys as soon as a Monster is slain in the battle.`,
        when: [COMBAT_PHASE],
      },
      {
        name: `Deff Ride`,
        desc: `In your hero phase, on model in this unit can attempt a Deff Ride. Pick an enemy Monster within 3" of the model and roll a dice. On a roll of 4+ the Monster sufferes D3 mortal wounds. The model that attempted the Deff Ride is then slain unless the monster was killed by the Deff Ride.`,
        when: [HERO_PHASE],
      },
    ],
  },
  {
    name: `Savage Boarboy Maniaks`,
    effects: [
      {
        name: `Boar Thumper`,
        desc: `Add 2 to the charge rolls of a unit of Savage Boarboys Maniaks with a skull thumpers.`,
        when: [CHARGE_PHASE],
      },
      {
        name: `Maniak Fury`,
        desc: `You can pile in and attack with this unit for a second time at the end of each of your own combat phases.`,
        when: [END_OF_COMBAT_PHASE],
      },
      {
        name: `Tusker Charge`,
        desc: `Re-roll failed wound rolls when attacking with War Boars' Tusks if this unit charged in the same turn.`,
        when: [COMBAT_PHASE],
      },
      {
        name: `Hack and Slash`,
        desc: `Re-roll hit rolls of 1 when attacking with this unit's chompas.`,
        when: [COMBAT_PHASE],
      },
    ],
  },
  {
    name: `Savage Orruk Arrowboys`,
    effects: [
      {
        name: `Skull Thumper`,
        desc: `Add 2 to the charge rolls of a unit of Savage Orruk Arrowboys with a skull thumpers.`,
        when: [CHARGE_PHASE],
      },
      {
        name: `Aim Fer Its Eyes`,
        desc: `Stinga Bows have a Rend of -1 against Monsters.`,
        when: [SHOOTING_PHASE],
      },
      {
        name: `Loads Arrows`,
        desc: `Make 1 extra attack with the Stinga Bows if their unit has 20 or more models.`,
        when: [SHOOTING_PHASE],
      },
    ],
  },
]

// Battalions
export const Battalions: TBattalions = [
  {
    name: `Kop Rukk`,
    effects: [
      {
        name: `Savage Waaagh! Energy`,
        desc: `Add 1 to all casting rolls made by a Kop Rukk Wardokk that is wthinin 12" of 20 or more Savage Orruk Morboys. Add 2 instead if within 12" of 30 or more Morboys. If the casting roll is a double, remove D3 models from the nearest unit of Savage Orruk Morboys.`,
        when: [HERO_PHASE],
      },
      {
        name: `Waaagh! Stomp`,
        desc: `Add 1 to any wound rolls for Morboys if its unit is wihtin 12" of at least two Wardokks from this battalion.`,
        when: [COMBAT_PHASE],
      },
    ],
  },
  {
    name: `Snaga Rukk`,
    effects: [
      {
        name: `Maniak Stampede`,
        desc: `A unit of Boarboy Maniaks can attempt to charge in the hero phase. You can re-roll this charge if a Weirdnob is within 10" of the charging unit. Roll a dice for each model that ends it's charge within 1" of an enemy model. On a 4+ the enemy suffers 1 mortal wound. If the roll is a 1, the Boarboys take 1 mortal wound instead.`,
        when: [HERO_PHASE],
      },
    ],
  },
  {
    name: `Brutal Rukk`,
    effects: [
      {
        name: `Savage Swiftness`,
        desc: `You can re-roll the dice when determining how far a unit from a Brutal Rukk runs. The Savage Big Boss and any unit that starts their move within 10" of the big boss always run 6.`,
        when: [MOVEMENT_PHASE],
      },
    ],
  },
  {
    name: `Kunnin' Rukk`,
    effects: [
      {
        name: `Dead Sneaky`,
        desc: `Pick one unit from the Kunnin' Rukk that is wihtin 10" of the battalion's Big Boss. That unit can move as if it were the movement phase (it is allowed to run), shoot as if it were the shooting phase, or pile in and attack as if it were the combat phase if within 3" of an enemy.`,
        when: [HERO_PHASE],
      },
    ],
  },
  {
    name: `Teef Rukk`,
    effects: [
      {
        name: `Crazed Monster Hunters`,
        desc: `Pick an enemy Monster. Each unit from a Teef Rukk that is within 6" of the Monster can pile in 6" and then make an attack as if it were the combat phase.`,
        when: [HERO_PHASE],
      },
    ],
  },
]

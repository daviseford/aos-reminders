import { TBattalions, TUnits } from 'types/army'
import {
  CHARGE_PHASE,
  COMBAT_PHASE,
  DURING_GAME,
  HERO_PHASE,
  MOVEMENT_PHASE,
  SHOOTING_PHASE,
  START_OF_HERO_PHASE,
  START_OF_COMBAT_PHASE,
} from 'types/phases'

// Unit Names
export const Units: TUnits = [
  {
    name: `Wurrgog Prophet`,
    effects: [
      {
        name: `Beast Mask`,
        desc: `The Wurrgog Prophet is -1 to be hit in melee combat.`,
        when: [COMBAT_PHASE],
      },
      {
        name: `Prophet of da Waaagh!`,
        desc: `Roll a dice. On a 4+, you receive 1 Command Point.`,
        when: [START_OF_HERO_PHASE],
      },
      {
        name: `Fists of Gork`,
        desc: `Casting value 5. Pick an enemy unit within 24" and visible. Roll one dice for each model in the unit. The unit suffers 1 mortal wound for each 6+. If the casting roll was a 10+ then it does 1 mortal wound on a 4+.`,
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
        desc: `Add 1 to hit rolls and would rolls for attacks made with this unit's Tusks and Hooves if this unit made a charge move in the same turn.`,
        when: [COMBAT_PHASE],
      },
      {
        name: `Weird Squig`,
        desc: `Once per turn, a Maniak Weirdnob can choose to reroll a casting, dispelling, or unbinding roll.`,
        when: [HERO_PHASE],
      },
      {
        name: `Bone Spirit`,
        desc: `Casting value 7. Pick 1 friendly Bonesplitterz unit wholly within 12" of the caster and visible. Until your next hero phase, if the unmodified hit roll for an attack made by that unit is 6, that attack scores 2 hits on the target instead of 1.`,
        when: [HERO_PHASE, COMBAT_PHASE, SHOOTING_PHASE],
        spell: true,
      },
    ],
  },
  {
    name: `Savage Big Boss`,
    effects: [
      {
        name: `Let Me at 'Em`,
        desc: `After this model has fought in the combat phase for the first time, you can pick a friendly Bonesplitterz unit that has not yet fought in that combat phase and which is within 3" of an enemy unit and wholly within 12" of this model. That unit fights immediately, before the opposing player picks a unit to fight in that combat phase.`,
        when: [COMBAT_PHASE],
      },
      {
        name: `Savage Attack`,
        desc: `You can select a Bonesplitterz unit wholly within 12". Until the end of that phase, whenever you make an unmodified hit roll of 6 for a model in that unit, that attack scores 2 hits on the target instead of 1. A unit cannot benefit from this command ability more than once per phase.`,
        when: [START_OF_COMBAT_PHASE],
        command_ability: true,
      },
    ],
  },
  {
    name: `Wardokk`,
    effects: [
      {
        name: `Ritual Dance`,
        desc: ` Roll a dice, on a 3+ pick one of the following effects.

          Grimdokk Dance: Pick a Bonesplitterz model wholly within 12". That model heals D3 wounds.
          Glyphdokk Dance: Pick a Bonesplitterz unit wholly within 12". Add 1 to save rolls for attacks that target that unit until your next hero phase. A unit cannot benefit from this ability more than once per phase.
          Weirddokk Dance: Pick a Bonesplitterz Wizard wholly within 12". Until your next hero phase, add 1 to the casting, dispelling, and unbinding rolls for that model. A unit cannot benefit from this ability more than once per phase.`,
        when: [START_OF_HERO_PHASE],
      },
    ],
  },
  {
    name: `Savage Orruks`,
    effects: [
      {
        name: `Skull Thumper`,
        desc: `Add 2 to the charge rolls of a unit with a Skull Thumper.`,
        when: [CHARGE_PHASE],
      },
      {
        name: `Bone Totem Bearer`,
        desc: `Add 1 to the Bravery characteristic of a unit while it includes any Bone Totem Bearers.`,
        when: [DURING_GAME],
      },
      {
        name: `Spirit of Gorkamorka`,
        desc: `Add 1 to the Attacks characteristic of melee weapons used by this unit while it has 15 or more models.`,
        when: [COMBAT_PHASE],
      },
      {
        name: `Bone Shield`,
        desc: `Add 1 to save rolls for attacks made with melee weapons that target this unit.`,
        when: [COMBAT_PHASE],
      },
    ],
  },
  {
    name: `Savage Boarboys`,
    effects: [
      {
        name: `Boar Thumper`,
        desc: `Add 2 to the charge rolls of a unit with a Boar Thumper.`,
        when: [CHARGE_PHASE],
      },
      {
        name: `Bone Totem Bearer`,
        desc: `Add 1 to the Bravery characteristic of a unit while it includes any Bone Totem Bearers.`,
        when: [DURING_GAME],
      },
      {
        name: `Boarboy Charge`,
        desc: `Add 1 to hit rolls and would rolls for attacks made with this unit's Savage Stikkas and Tusks and Hooves if this unit made a charge move in the same turn.`,
        when: [COMBAT_PHASE],
      },
      {
        name: `Bone Shield`,
        desc: `Add 1 to save rolls for attacks made with melee weapons that target this unit.`,
        when: [COMBAT_PHASE],
      },
    ],
  },
  {
    name: `Savage Big Stabbas`,
    effects: [
      {
        name: `The Bigger They Are...`,
        desc: `The Damage characteristic of an attack made with a Gorktoof is D6 if the target is a Monster.`,
        when: [COMBAT_PHASE],
      },
      {
        name: `Da Final Fling`,
        desc: `If a model is slain by a melee attack, pick an enemy unit wihtin 3" of the model before the model is removed and roll a dice. That unit suffers D3 Mortal Wounds on a 4+. Add 2 to this roll if the target is a Monster.`,
        when: [COMBAT_PHASE],
      },
      {
        name: `Savagely Enthusiastic`,
        desc: `This unit can run and still charge in the same turn.`,
        when: [MOVEMENT_PHASE],
      },
    ],
  },
  {
    name: `Savage Orruk Morboys`,
    effects: [
      {
        name: `Skull Thumper`,
        desc: `Add 2 to the charge rolls of a unit with a Skull Thumper.`,
        when: [CHARGE_PHASE],
      },
      {
        name: `Bone Totem Bearer`,
        desc: `Add 1 to the Bravery characteristic of a unit while it includes any Bone Totem Bearers.`,
        when: [DURING_GAME],
      },
      {
        name: `Power of the Beast Spirit`,
        desc: `Add 1 to the hit rolls for attacks made with melee weaspon by this unit if any enemy Monsters have been slain.`,
        when: [COMBAT_PHASE],
      },
      {
        name: `Spirit of Gorkamorka`,
        desc: `Add 1 to the Attacks characteristic of melee weapons used by this unit while it has 15 or more models.`,
        when: [COMBAT_PHASE],
      },
    ],
  },
  {
    name: `Savage Boarboy Maniaks`,
    effects: [
      {
        name: `Boar Thumper`,
        desc: `Add 2 to the charge rolls of a unit with a Boar Thumper.`,
        when: [CHARGE_PHASE],
      },
      {
        name: `Bone Totem Bearer`,
        desc: `Add 1 to the Bravery characteristic of a unit while it includes any Bone Totem Bearers.`,
        when: [DURING_GAME],
      },
      {
        name: `Maniak Fury`,
        desc: `Add 1 to the Attacks characteristic of this unit's Pairs of Chompas while it has 5 or more models.`,
        when: [COMBAT_PHASE],
      },
      {
        name: `Tusker Charge`,
        desc: `Add 1 to hit rolls and would rolls for attacks made with this unit's Tusks and Hooves if this unit made a charge move in the same turn.`,
        when: [COMBAT_PHASE],
      },
    ],
  },
  {
    name: `Savage Orruk Arrowboys`,
    effects: [
      {
        name: `Skull Thumper`,
        desc: `Add 2 to the charge rolls of a unit with a Skull Thumper.`,
        when: [CHARGE_PHASE],
      },
      {
        name: `Bone Totem Bearer`,
        desc: `Add 1 to the Bravery characteristic of a unit while it includes any Bone Totem Bearers.`,
        when: [DURING_GAME],
      },
      {
        name: `Aim Fer Its Eyes`,
        desc: `Stinga Bows have a Rend of -1 against Monsters.`,
        when: [SHOOTING_PHASE],
      },
      {
        name: `Loads Arrows`,
        desc: `Add 1 to the Attacks characteristic of the Stinga Bows if their unit has 15 or more models.`,
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

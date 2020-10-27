import { DestructionUnits } from 'army/grand_alliances'
import { TBattalions, TUnits } from 'types/army'
import {
  BATTLESHOCK_PHASE,
  CHARGE_PHASE,
  COMBAT_PHASE,
  HERO_PHASE,
  MOVEMENT_PHASE,
  SHOOTING_PHASE,
  START_OF_COMBAT_PHASE,
  START_OF_HERO_PHASE,
  WOUND_ALLOCATION_PHASE,
} from 'types/phases'
import { filterUnits } from 'utils/filterUtils'

const getRogueIdol = () => filterUnits(DestructionUnits, [`Rogue Idol`])[0]

const TuskerChargeEffect = {
  name: `Tusker Charge`,
  desc: `Add 1 to hit rolls and wound rolls for attacks made with this unit's Tusks and Hooves if this unit made a charge move in the same turn.`,
  when: [COMBAT_PHASE],
}
const SkullThumperEffect = {
  name: `Skull Thumper`,
  desc: `Add 2 to charge rolls for a unit while it includes any Skull Thumpers.`,
  when: [CHARGE_PHASE],
}
const BoarThumperEffect = {
  name: `Boar Thumper`,
  desc: `Add 2 to charge rolls for a unit while it includes any Boar Thumpers.`,
  when: [CHARGE_PHASE],
}
const BoneTotemBearerEffect = {
  name: `Bone Totem Bearer`,
  desc: `Add 1 to the Bravery characteristic of a unit while it includes any Bone Totem Bearers.`,
  when: [BATTLESHOCK_PHASE],
}
const SpiritOfGorkamorkaEffect = {
  name: `Spirit of Gorkamorka`,
  desc: `Add 1 to the Attacks characteristic of melee weapons used by this unit while it has 15 or more models.`,
  when: [COMBAT_PHASE],
}
const BoneShieldEffect = {
  name: `Bone Shield`,
  desc: `Add 1 to save rolls for attacks made with melee weapons that target this unit.`,
  when: [COMBAT_PHASE],
}

// Unit Names
export const Units: TUnits = [
  {
    name: `Wurrgog Prophet`,
    effects: [
      {
        name: `Beast Mask`,
        desc: `Subtract 1 from hit rolls for attacks made with melee weapons that target this model.`,
        when: [COMBAT_PHASE],
      },
      {
        name: `Prophet of da Waaagh!`,
        desc: `Roll a D6. On a 4+, you receive 1 command point.`,
        when: [START_OF_HERO_PHASE],
      },
      {
        name: `Fists of Gork`,
        desc: `Pick 1 enemy unit within 24" of the caster that is visible to them, and roll a number of dice equal to the number of models in that unit. For each 6, that unit suffers 1 mortal wound. If the casting roll was 10+, inflict 1 mortal wound for each 4+ instead of each 6.`,
        when: [HERO_PHASE],
        spell: true,
      },
    ],
  },
  {
    name: `Maniak Weirdnob`,
    effects: [
      TuskerChargeEffect,
      {
        name: `Weird Squig`,
        desc: `Once per turn, you can reroll a casting, dispelling or unbinding roll for this model.`,
        when: [HERO_PHASE],
      },
      {
        name: `Bone Spirit`,
        desc: `Casting value of 7. Pick 1 friendly BONESPLITTERZ unit wholly within 12" of the caster and visible to them. Until your next hero phase, if the unmodified hit roll for an attack made by that unit is 6, that attack scores 2 hits on the target instead of 1.`,
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
        desc: `After this model has fought in a combat phase for the first time, you can pick 1 friendly BONESPLITTERZ unit that has not yet fought in that combat phase, that is within 3" of an enemy unit and that is wholly within 12" of this model. That unit fights immediately, before the opposing player picks a unit to fight in that combat phase. That unit cannot fight again in that combat phase unless an ability or spell allows it to fight more than once.`,
        when: [COMBAT_PHASE],
      },
      {
        name: `Savage Attack`,
        desc: `Pick 1 friendly BONESPLITTERZ unit wholly within 12" of a friendly model with this command ability. Until the end of that phase, if the unmodified hit roll for an attack made by that unit is 6, that attack scores 2 hits on the target instead of 1. A unit cannot benefit from this command ability more than once per phase.`,
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
        desc: `At the start of your hero phase, you can say that this model is performing one of the following dances:

        Grimdokk Dance: Pick 1 friendly BONESPLITTERZ model within 12" of this model and roll a D6. On a 3+, you can heal up to D3 wounds allocated to that model.
        Glyphdokk Dance: Pick 1 friendly BONESPLITTERZ unit wholly within 12" of this model and roll a D6. On a 3+, add 1 to save rolls for attacks that target that unit until your next hero phase. A unit cannot benefit from this ability more than once per phase.
        Weirddokk Dance: Pick 1 friendly BONESPLITTERZ WIZARD wholly within 12" of this model and roll a D6. On a 3+, add 1 to casting, dispelling and unbinding rolls for that WIZARD until your next hero phase. A unit cannot benefit from this ability more than once per phase.`,
        when: [START_OF_HERO_PHASE],
      },
    ],
  },
  {
    name: `Savage Orruks`,
    effects: [SkullThumperEffect, BoneTotemBearerEffect, SpiritOfGorkamorkaEffect, BoneShieldEffect],
  },
  {
    name: `Savage Boarboys`,
    effects: [
      BoarThumperEffect,
      BoneTotemBearerEffect,
      {
        name: `Boarboy Charge`,
        desc: `Add 1 to hit rolls and would rolls for attacks made with this unit's Savage Stikkas and Tusks and Hooves if this unit made a charge move in the same turn.`,
        when: [COMBAT_PHASE],
      },
      BoneShieldEffect,
    ],
  },
  {
    name: `Savage Big Stabbas`,
    effects: [
      {
        name: `The Bigger They Are...`,
        desc: `The Damage characteristic of an attack made with a Gorktoof is D6 if the target is a MONSTER.`,
        when: [COMBAT_PHASE],
      },
      {
        name: `Da Final Fling`,
        desc: `Each time a model from this unit is slain by an attack made with a melee weapon, before the model is removed from play, pick 1 enemy unit within 3" of the slain model and roll a D6. Add 2 to the roll if that enemy unit is a MONSTER. On a 4+, that unit suffers D3 mortal wounds.`,
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
      SkullThumperEffect,
      BoneTotemBearerEffect,
      {
        name: `Power of the Beast Spirit`,
        desc: `Add 1 to the hit rolls for attacks made with melee weaspon by this unit if any enemy MONSTERS have been slain.`,
        when: [COMBAT_PHASE],
      },
      SpiritOfGorkamorkaEffect,
    ],
  },
  {
    name: `Savage Boarboy Maniaks`,
    effects: [
      BoarThumperEffect,
      BoneTotemBearerEffect,
      {
        name: `Maniak Fury`,
        desc: `Add 1 to the Attacks characteristic of this unit's Pairs of Chompas while it has 5 or more models.`,
        when: [COMBAT_PHASE],
      },
      TuskerChargeEffect,
    ],
  },
  {
    name: `Savage Orruk Arrowboys`,
    effects: [
      SkullThumperEffect,
      BoneTotemBearerEffect,
      {
        name: `Aim Fer Its Eyes`,
        desc: `Improve the Rend characteristic of an attack made with a Stinga Bow by 1 if the target is a MONSTER.`,
        when: [SHOOTING_PHASE],
      },
      {
        name: `Loads Arrows`,
        desc: `Add 1 to the Attacks characteristic of missile weapons used by this unit while it has 15 or more models.`,
        when: [SHOOTING_PHASE],
      },
    ],
  },
  getRogueIdol(),
]

// Battalions
export const Battalions: TBattalions = [
  {
    name: `Big Rukk`,
    effects: [
      {
        name: `Big Rukk Warpaint`,
        desc: `When you use the Warpaint battle trait for a unit from this battalion, you can reroll the dice that determines if a wound or mortal wound is negated.`,
        when: [WOUND_ALLOCATION_PHASE],
      },
    ],
  },
  {
    name: `Kop Rukk`,
    effects: [
      {
        name: `Savage Weird Power`,
        desc: `Pick 1 Wardokk from this battalion that is wholly within 18" of 2 or more units from this same battalion that each have 10 or more models. That Wardokk can attempt to cast the Fists of Gork spell from the Wurrgog Prophet warscroll in that phase in addtion to any other spells it can cast.`,
        when: [HERO_PHASE],
      },
    ],
  },
  {
    name: `Snaga Rukk`,
    effects: [
      {
        name: `Maniak Stampede`,
        desc: `You can reroll charge rolls for units in this battalion while they are wholly within 12" of the Maniak Weirdknob from this battalion.`,
        when: [CHARGE_PHASE],
      },
    ],
  },
  {
    name: `Brutal Rukk`,
    effects: [
      {
        name: `Savage Swiftness`,
        desc: `Units in this battalion that are wholly within 12" of the Savage Big Boxx at the start of the charge phase can charge even if they have run earlier in the turn.`,
        when: [CHARGE_PHASE],
      },
    ],
  },
  {
    name: `Kunnin' Rukk`,
    effects: [
      {
        name: `Dead Sneaky`,
        desc: `Pick one unit from the Kunnin' Rukk that is wholly within 12" of the battalion's Big Boss. That unit can move as if it were the movement phase, or shoot as if it were the shooting phase. Units in this battalion cannot have more than 20 models.`,
        when: [HERO_PHASE],
      },
    ],
  },
  {
    name: `Teef Rukk`,
    effects: [
      {
        name: `We're Da Best`,
        desc: `Add 1 to the attacks characteristic of melee weapons use by units from this battalion while they are wholly within 12" of the Savage Big Boss from this battalion.`,
        when: [COMBAT_PHASE],
      },
    ],
  },
]

import { DestructionUnits } from 'factions/grand_alliances'
import { keyPicker, tagAs } from 'factions/metatagger'
import {
  BATTLESHOCK_PHASE,
  CHARGE_PHASE,
  COMBAT_PHASE,
  HERO_PHASE,
  SAVES_PHASE,
  SHOOTING_PHASE,
  START_OF_HERO_PHASE,
  WOUND_ALLOCATION_PHASE,
} from 'types/phases'
import spells from './spells'

const PrimalSurgeEffect = {
  name: `Primal Surge`,
  desc: `Add 1 to wound rolls for attacks made by this unit if this unit made a charge move in the same turn.`,
  when: [COMBAT_PHASE],
  shared: true,
}
const TuskerChargeEffect = {
  name: `Tusker Charge`,
  desc: `Add 1 to hit rolls and wound rolls for attacks made with Tusks and Hooves by this unit if this unit made a charge move in the same turn.`,
  when: [COMBAT_PHASE],
  shared: true,
}
const SkullThumperEffect = {
  name: `Musician`,
  desc: `You can add 1 to charge rolls for a unit that includes any Skull Thumpers.`,
  when: [CHARGE_PHASE],
  shared: true,
}
const BoneTotemBearerEffect = {
  name: `Standard Bearer`,
  desc: `Add 1 to the Bravery characteristic of a unit that includes any Bone Totem Bearers.`,
  when: [BATTLESHOCK_PHASE],
  shared: true,
}

const BonesplitterzUnits = {
  'Wurrgog Prophet': {
    mandatory: {
      spells: [keyPicker(spells, ['Fists of Gork'])],
    },
    effects: [
      {
        name: `Wurrgog Mask`,
        desc: `At the start of your hero phase, instead of attempting to dispel an endless spell or cast any spells with this unit in that phase, you can pick 1 enemy unit within 12" of this unit that is visible it and roll a dice. On a 3+, that enemy unit suffers D3 mortal wounds.

        If you wish, you can say that this unit will continue staring at the enemy unit. If you do so, roll an additional dice. On a 3+, the enemy unit suffers D3 mortal wounds, but on a 1-2, this unit suffers D6 mortal wounds. You can keep rolling additional dice in this way until the enemy unit is destroyed, this unit is destroyed or you decide to stop.`,
        when: [START_OF_HERO_PHASE],
      },
    ],
  },
  'Maniak Weirdnob': {
    mandatory: {
      spells: [keyPicker(spells, ['Bone Spirit'])],
    },
    effects: [
      TuskerChargeEffect,
      {
        name: `Weird Squig`,
        desc: `Once per turn, you can reroll a casting, dispelling or unbinding roll for this model.`,
        when: [HERO_PHASE],
      },
    ],
  },
  'Savage Big Boss': {
    effects: [
      {
        name: `Let Me at 'Em`,
        desc: `After this unit has fought in the combat phase for the first time, you can pick 1 friendly BONESPLITTERZ unit that has not yet fought in that combat phase, that is within 3" of an enemy unit and that is wholly within 12" of this unit. That unit fights immediately.`,
        when: [COMBAT_PHASE],
      },
    ],
  },
  Wardokk: {
    effects: [
      {
        name: `Ritual Dance`,
        desc: `At the start of your hero phase, instead of attempting to dispel an endless spell or cast any spells with this unit in that phase, you can say that it is performing 1 of the following dances:

        Grimdokk Dance: Pick 1 friendly BONESPLITTERZ model within 12" of this unit and roll a dice. On a 3+, heal up to D3 wounds allocated to that model.

        Glyphdokk Dance: Pick 1 friendly BONESPLITTERZ unit wholly within 12" of this unit and roll a dice. On a 3+, add 1 to save rolls for attacks that target that unit until your next hero phase. A unit cannot be affected by this dance more than once per phase.

        Weirddokk Dance: Pick 1 friendly BONESPLITTERZ WIZARD within 12" of this unit and roll a dice. On a 3+, add 1 to casting, dispelling and unbinding rolls for that WIZARD until your next hero phase. A unit cannot be affected by this dance more than once per phase.`,
        when: [START_OF_HERO_PHASE],
      },
      {
        name: `Glyphdokk Dance`,
        desc: `If active, add 1 to save rolls for attacks that target that unit until your next hero phase.`,
        when: [SAVES_PHASE],
      },
      {
        name: `Weirddokk Dance`,
        desc: `If active, add 1 to casting, dispelling and unbinding rolls for that WIZARD until your next hero phase.`,
        when: [HERO_PHASE],
      },
    ],
  },
  'Savage Orruks': {
    effects: [
      SkullThumperEffect,
      BoneTotemBearerEffect,
      {
        name: `Champion`,
        desc: `1 model in this unit can be a Savage Boss. Add 1 to the Attacks characteristic of that model's melee weapons.`,
        when: [COMBAT_PHASE],
      },
      PrimalSurgeEffect,
    ],
  },
  'Savage Boarboys': {
    effects: [
      BoneTotemBearerEffect,
      SkullThumperEffect,
      TuskerChargeEffect,
      {
        name: `Champion`,
        desc: `1 model in this unit can be a Savage Boar Boss. Add 1 to the Attacks characteristic of that model's melee weapons, excluding those of its mount.`,
        when: [COMBAT_PHASE],
      },
    ],
  },
  'Savage Big Stabbas': {
    effects: [
      {
        name: `Da Final Fling`,
        desc: `Each time a model in this unit is slain by an attack made with a melee weapon, before the model is removed from play, pick 1 enemy unit within 3" of the slain model and roll a dice. Add 2 to the roll if that enemy unit is a MONSTER. On a 4+, that enemy unit suffers D3 mortal wounds.`,
        when: [WOUND_ALLOCATION_PHASE],
      },
    ],
  },
  'Savage Orruk Morboys': {
    effects: [
      SkullThumperEffect,
      BoneTotemBearerEffect,
      {
        name: `Champion`,
        desc: `1 model in this unit can be a Savage Morboy Boss. Add 1 to the Attacks characteristic of that model's melee weapons.`,
        when: [COMBAT_PHASE],
      },
      {
        name: `Morboy Fury`,
        desc: `Add 1 to the Attacks characteristic of this unit's melee weapons if this unit made a charge move in the same turn.`,
        when: [COMBAT_PHASE],
      },
    ],
  },
  'Savage Boarboy Maniaks': {
    effects: [
      BoneTotemBearerEffect,
      SkullThumperEffect,
      TuskerChargeEffect,
      {
        name: `Champion`,
        desc: `1 model in this unit can be a Savage Boar Boss Maniak. Add 1 to the Attacks characteristic of that model's melee weapons, excluding those of its mount.`,
        when: [COMBAT_PHASE],
      },
      {
        name: `Maniak Fury`,
        desc: `Add 1 to the Attacks characteristic of this unit's Chompas if this unit made a charge move in the same turn.`,
        when: [COMBAT_PHASE],
      },
    ],
  },
  'Savage Orruk Arrowboys': {
    effects: [
      SkullThumperEffect,
      BoneTotemBearerEffect,
      {
        name: `Champion`,
        desc: `1 model in this unit can be a Savage Arrow Boss. Replace that model's Bone Shiv with a Chompa.`,
        when: [COMBAT_PHASE],
      },
      {
        name: `Aim Fer Its Eyes`,
        desc: `Improve the Rend characteristic of an attack made with a Stinga Bow by 1 if the target is a MONSTER.`,
        when: [SHOOTING_PHASE],
      },
    ],
  },
  'Hedrakka, Gob of Gork': {
    mandatory: {
      spells: [keyPicker(spells, ['Bone Krusha'])],
    },
    effects: [
      {
        name: `Wizard`,
        desc: `This unit can attempt to cast 2 spells in your hero phase and attempt to unbind 2 spells in the enemy hero phase.`,
        when: [HERO_PHASE],
      },
      {
        name: `Gobby Mask`,
        desc: `Subtract 1 from hit rolls for attacks made with melee weapons that target this unit.`,
        when: [COMBAT_PHASE],
      },
      {
        name: `An Eye for Weakness`,
        desc: `In your hero phase, you can pick 1 enemy unit within 18" of this unit and visible to it. Until your next hero phase, add 1 to hit rolls for attacks made by this unit that target that enemy unit. In addition, until your next hero phase, add 1 to hit rolls for attacks made by a friendly Hedkrakka's Madmob unit that target that enemy unit.`,
        when: [HERO_PHASE],
      },
      {
        name: `Venomous Bite`,
        desc: `If the unmodified hit roll for an attack made with this unit's Fanged Maw is 6, the target suffers 1 mortal wound and the attack sequence ends (do not make a wound roll or save roll).`,
        when: [COMBAT_PHASE],
      },
    ],
  },
  "Hedrakka's Madmob": {
    effects: [
      PrimalSurgeEffect,
      {
        name: `Da Mad Mob`,
        desc: `If a friendly Hedkrakka is within 3" of this unit, before you allocate a wound or mortal wound to him, or instead of making a ward roll for him, you can roll a dice. On a 4+, that wound is allocated to this unit instead and cannot be negated.`,
        when: [WOUND_ALLOCATION_PHASE],
      },
    ],
  },

  ...keyPicker(DestructionUnits, ['Rogue Idol']),
}

export default tagAs(BonesplitterzUnits, 'unit')

import { TTraits } from 'types/army'
import {
  BATTLESHOCK_PHASE,
  CHARGE_PHASE,
  COMBAT_PHASE,
  END_OF_SETUP,
  DURING_GAME,
  SHOOTING_PHASE,
  START_OF_HERO_PHASE,
} from 'types/phases'

const CommandTraits: TTraits = [
  {
    name: `Fury of the Fyreslayers`,
    effects: [
      {
        name: `Fury of the Fyreslayers`,
        desc: `+1 to charges for friendly FYRESLAYERS units wholly within 18" of this general.`,
        when: [CHARGE_PHASE],
      },
    ],
  },
  {
    name: `Honour of the Ancestors`,
    effects: [
      {
        name: `Honour of the Ancestors`,
        desc: `Do not take battleshock tests for friendly FYRESLAYERS units wholly within 12" of this general.`,
        when: [BATTLESHOCK_PHASE],
      },
    ],
  },
  {
    name: `Spirit of Grimnir`,
    effects: [
      {
        name: `Spirit of Grimnir`,
        desc: `If this general is on the battlefield, when you roll to activate an ur-gold rune, it has the enhanced effect on a 5+.`,
        when: [START_OF_HERO_PHASE],
      },
    ],
  },
  {
    name: `Blood of the Berzerker`,
    effects: [
      {
        name: `Blood of the Berzerker`,
        desc: `Once per battle in the combat phase, after this general has fought in that phase for the first time, if they are within 3" of an enemy unit, they and their mount (if they have one) can immediately make a pile-in move and then attack with all of the melee weapons they are armed with for a second time.`,
        when: [COMBAT_PHASE],
      },
    ],
  },
  {
    name: `Iron Will of the Guardian`,
    effects: [
      {
        name: `Iron Will of the Guardian`,
        desc: `Add 1 to save rolls for attacks that target this general.`,
        when: [COMBAT_PHASE, SHOOTING_PHASE],
      },
    ],
  },
  {
    name: `Destroyer of Foes`,
    effects: [
      {
        name: `Destroyer of Foes`,
        desc: `Add 1 to the Damage characteristic of this general's melee weapons.`,
        when: [COMBAT_PHASE],
      },
    ],
  },
  {
    name: `Fyremantle`,
    effects: [
      {
        name: `Fyremantle`,
        desc: `-1 to hit to enemy units within 3" of this general.`,
        when: [SHOOTING_PHASE, COMBAT_PHASE],
      },
    ],
  },
  {
    name: `Wisdom and Authority`,
    effects: [
      {
        name: `Wisdom and Authority`,
        desc: `At the start of the first battle round you receive D3 additional command points.`,
        when: [END_OF_SETUP],
      },
    ],
  },
  {
    name: `Oathslayer`,
    effects: [
      {
        name: `Oathslayer`,
        desc: `Add 1 to bravery of friendly DUARDIN units while wholly within 18" of this general.`,
        when: [DURING_GAME, BATTLESHOCK_PHASE],
      },
    ],
  },
  {
    name: `Ash-beard`,
    effects: [
      {
        name: `Ash-beard`,
        desc: `This general knows 2 prayers from the Zharrgrim Blessings table.`,
        when: [DURING_GAME],
      },
    ],
  },
  {
    name: `Fyresteel Weaponsmith`,
    effects: [
      {
        name: `Fyresteel Weaponsmith`,
        desc: `Improve the rend characteristic of this general's weapons by 1.`,
        when: [SHOOTING_PHASE, COMBAT_PHASE],
      },
    ],
  },
  {
    name: `Master Priest`,
    effects: [
      {
        name: `Master Priest`,
        desc: `Once per battle, at the start of your hero phase, if this general is on the battlefield, you can activate one ur-gold rune that has already been activated, instead of one that has not been activated.`,
        when: [START_OF_HERO_PHASE],
      },
    ],
  },
  {
    name: `Cinder-crest Youngblood`,
    effects: [
      {
        name: `Cinder-crest Youngblood`,
        desc: `When you use this model's Lashing Tail ability subtract 1 from the dice roll that determines if the target unit suffers D3 mortal wounds. If this model made a charge move in the same turn, subtract 2 instead.`,
        when: [COMBAT_PHASE],
        mount_trait: true,
      },
    ],
  },
  {
    name: `Flame-scale Youngblood`,
    effects: [
      {
        name: `Flame-scale Youngblood`,
        desc: `After this model has made a charge move, pick 1 enemy unit within 1" of this model and roll a number of dice equal to the charge roll for that charge move. For each 6 that enemy unit suffers 1 mortal wound.`,
        when: [CHARGE_PHASE],
        mount_trait: true,
      },
    ],
  },
  {
    name: `Fire-claw Adult`,
    effects: [
      {
        name: `Fire-claw Adult`,
        desc: `If the unmodified wound roll for an attack made with this mount's melee weapons is 6, that attack has a rend characteristic of -3.`,
        when: [COMBAT_PHASE],
        mount_trait: true,
      },
    ],
  },
  {
    name: `Lava-Tongue Adult`,
    effects: [
      {
        name: `Lava-Tongue Adult`,
        desc: `When you use this model's Roaring Fyrestream ability, subtract 1 from the dice roll that determines if the target unit suffers mortal wounds. If this model is wholly within your territory or within 6" of an objective, subtract 2 instead.`,
        when: [SHOOTING_PHASE],
        mount_trait: true,
      },
    ],
  },
  {
    name: `Coal-heart Ancient`,
    effects: [
      {
        name: `Coal-heart Ancient`,
        desc: `Worsen the rend of melee weapons that attack this target by 1 to a minimum of 0.`,
        when: [COMBAT_PHASE],
        mount_trait: true,
      },
    ],
  },
  {
    name: `Ash-horn Ancient`,
    effects: [
      {
        name: `Ash-horn Ancient`,
        desc: `You can re-roll save rolls of 1 for attacks that target this model and friendly MAGMADROTHS within 6".`,
        when: [SHOOTING_PHASE, COMBAT_PHASE],
        mount_trait: true,
      },
    ],
  },
]

export default CommandTraits

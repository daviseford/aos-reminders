import { TBattalions, TUnits } from 'types/army'
import {
  COMBAT_PHASE,
  HERO_PHASE,
  START_OF_COMBAT_PHASE,
  BATTLESHOCK_PHASE,
  SHOOTING_PHASE,
  DURING_GAME,
  START_OF_BATTLESHOCK_PHASE,
} from 'types/phases'

const getSunmetalWeaponsEffect = (weapon: string) => {
  return {
    name: `Sunmetal Weapons`,
    desc: `If the unmodified hit roll for an attack made with a ${weapon} is 6, that attack inflicts 1 mortal wound on the target and the attack sequence ends (do not make a wound or save roll).`,
    when: [COMBAT_PHASE],
  }
}
const PowerOfHyshEffect = {
  name: `Power of Hysh`,
  desc: `Casting value of 6. Until your next hero phase, the Sunmetal Weapons ability for the caster and/or the unit they are part of causes mortal wounds to be inflicted on an unmodified hit roll of 5+ instead of 6. Any number of LUMINETH REALM-LORDS WIZARDS can attempt to cast Power of Hysh in the same hero phase.`,
  when: [HERO_PHASE, COMBAT_PHASE],
  spell: true,
}

// Unit Names
export const Units: TUnits = [
  {
    name: `Vanari Auralan Wardens`,
    effects: [
      {
        name: `Moonfire Flask`,
        desc: `Once per battle, you can pick 1 enemy unit within 3" of this unit's High Warden and roll a dice. On a 2+, that enemy unit suffers D3 mortal wounds.`,
        when: [START_OF_COMBAT_PHASE],
      },
      getSunmetalWeaponsEffect(`Warden's Pike`),
      {
        name: `Wall of Blades`,
        desc: `If the target unit made a charge move in the same turn, add 1 to wound rolls for attacks made with this unit's Warden's Pikes and improve the Rend characteristic of that weapon by 1.`,
        when: [COMBAT_PHASE],
      },
      {
        name: `Magic`,
        desc: `This unit is a WIZARD while it has 5 or more models. They can attempt to cast 1 spell in your hero phase and attempt to unbind 1 spell in the enemy hero phase. They know the Power of Hysh spell.`,
        when: [HERO_PHASE],
      },
      PowerOfHyshEffect,
    ],
  },
  {
    name: `Vanari Dawnriders`,
    effects: [
      {
        name: `Deathly Furrows`,
        desc: `If you use this ability, you can either add 1 to the Attacks characteristic of this unit's melee weapons, but it can only target units that have a Wounds characteristic of 1 or 2 and do not have a mount, or you can add 2 to the Attacks characteristic of this unit's melee weapons, but it can only target units that have a Wounds characteristic of 1 and do not have a mount.`,
        when: [START_OF_COMBAT_PHASE],
      },
      {
        name: `Standard Bearer`,
        desc: `You can re-roll battleshock tests for units that include any Standard Bearers.`,
        when: [BATTLESHOCK_PHASE],
      },
      {
        name: `Lances of the Dawn`,
        desc: `If this unit made a charge move in the same turn, add 1 to wound rolls for attacks made with this unit's Sunmetal Lances and improve the Rend characteristic of that weapon by 1.`,
        when: [COMBAT_PHASE],
      },
      getSunmetalWeaponsEffect(`Sunmetal Lance`),
      {
        name: `Magic`,
        desc: `This unit is a WIZARD while it has 3 or more models. They can attempt to cast 1 spell in your hero phase and attempt to unbind 1 spell in the enemy hero phase. They know the Power of Hysh spell.`,
        when: [HERO_PHASE],
      },
      PowerOfHyshEffect,
    ],
  },
  {
    name: `The Light of Eltharion`,
    effects: [
      {
        name: `Celennari Blade`,
        desc: `You can pick 1 enemy HERO within 3" of this model. If you do so, add 1 to the damage inflicted by successful attacks made with this model's Celennari Blade that target that HERO in that phase.`,
        when: [START_OF_COMBAT_PHASE],
      },
      {
        name: `Fangsword of Eltharion`,
        desc: `Add 1 to wound rolls for attacks made with this model's Fangsword of Eltharion if this model made a charge move in the same turn. In addition, if the unmodified wound roll for an attack made with this model's Fangsword of Eltharion is 6, that attack inflicts 1 mortal wound on the target in addition to any normal damage.`,
        when: [COMBAT_PHASE],
      },
      {
        name: `Searing Darts of Light`,
        desc: `In your shooting phase, you can pick 1 enemy unit within 18" of this model that is visible to them and roll a dice. On a 1, nothing happens. On a 2-4, that unit suffers D3 mortal wounds. On a 5+, that unit suffers D6 mortal wounds.`,
        when: [SHOOTING_PHASE],
      },
      {
        name: `Spirit Armour`,
        desc: `Ignore modifiers (positive or negative) when making save rolls for attacks that target this model. In addition, halve the damage inflicted by attacks made with missile weapons or melee weapons that target this model (rounding up).`,
        when: [DURING_GAME],
      },
      {
        name: `Supreme Swordmaster`,
        desc: `Ignore negative modifiers when making hit rolls for attacks made by this model. In addition, if the unmodified hit roll for an attack made by this model is 6, that attack scores 2 hits on the target instead of 1. Make a wound and save roll for each hit.`,
        when: [COMBAT_PHASE],
      },
      {
        name: `Unflinching Valour`,
        desc: `You can use this command ability at the start of the battleshock phase. If you do so, pick 1 friendly model with this command ability. Until the end of that phase, all friendly LUMINETH REALM-LORDS units wholly within 24" of that model are treated as having a Bravery characteristic of 10.`,
        when: [START_OF_BATTLESHOCK_PHASE],
        command_ability: true,
      },
    ],
  },
]

// Allied units (usually this will involve writing a function to grab units from another army)
// Check out Nurgle or Khorne for good examples
export const AlliedUnits: TUnits = []

// Battalions
export const Battalions: TBattalions = [
  {
    name: ``,
    effects: [
      {
        name: ``,
        desc: ``,
        when: [HERO_PHASE],
      },
    ],
  },
]

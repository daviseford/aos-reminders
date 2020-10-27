import idoneth from 'army/idoneth_deepkin'
import { TBattalions, TUnits } from 'types/army'
import {
  CHARGE_PHASE,
  COMBAT_PHASE,
  HERO_PHASE,
  MOVEMENT_PHASE,
  SHOOTING_PHASE,
  START_OF_BATTLESHOCK_PHASE,
  START_OF_COMBAT_PHASE,
  START_OF_SHOOTING_PHASE,
  WOUND_ALLOCATION_PHASE,
} from 'types/phases'
import * as CommonUnitEffects from './commonUnitEffects'

export const Units: TUnits = [
  {
    name: `Archmage Teclis`,
    effects: [
      {
        name: `Archmage`,
        desc: `At the start of your hero phase, say if you're going to cast 1, 2 or 4 spells. If this model will cast 1 spell, when it attempts to cast that spell, it is automatically cast with a casting roll of 12 that cannot be modified (do not roll 2D6) and it cannot be unbound. If casting 2 spells, each is automatically cast with a casting roll of 12, and they can be unbound. If casting 4 spells, each is automatically cast with a casting roll of 10, and they can be unbound.`,
        when: [HERO_PHASE],
      },
      {
        name: `Aura of Celennar`,
        desc: `Add 1 to casting and unbind rolls for friendly LUMINETH REALM-LORDS in range of this models Aura of Celennar ability.`,
        when: [HERO_PHASE],
      },
      {
        name: `Discs of the Aelementari`,
        desc: `In your hero phase, you can automatically dispel 1 endless spell. In the enemy hero phase, you can automatically unbind 1 enemy spell.`,
        when: [HERO_PHASE],
      },
      {
        name: `Seeing Stone of Celennar`,
        desc: `Each time a friendly model within range of this model's Aura of Celennar ability is affected by a spell or endless spell cast by an enemy WIZARD, you can roll a D6. On a 4+, ignore the effects. Then, pick 1 enemy unit within 18" of that unit. That enemy unit suffers D3 mortal wounds.`,
        when: [WOUND_ALLOCATION_PHASE],
      },
      {
        name: `Protection of Teclis`,
        desc: `Casting value of 10. Until your next hero phase, roll a D6 each time you allocate a wound or mortal wound to a friendly unit wholly within 18" of the caster. On a 5+ the wound or mortal wound is negated. Cannot be used in the same hero phase as Protection of Hysh.`,
        when: [HERO_PHASE, WOUND_ALLOCATION_PHASE],
        spell: true,
      },
      {
        name: `Storm of Searing White Light`,
        desc: `Casting value of 10. Roll a D6 for each enemy unit within 18" of the caster and visible to them. On a 1, nothing happens. On a 2-4 that unit suffers D3 mortal wounds. On a 5+ that unit suffers D6 mortal wounds.`,
        when: [HERO_PHASE],
        spell: true,
      },
    ],
  },
  {
    name: `Vanari Auralan Wardens`,
    effects: [
      {
        name: `Moonfire Flask`,
        desc: `Once per battle, you can pick 1 enemy unit within 3" of this unit's High Warden and roll a D6. On a 2+, that enemy unit suffers D3 mortal wounds.`,
        when: [START_OF_COMBAT_PHASE],
      },
      CommonUnitEffects.getSunmetalWeaponsEffect(`Warden's Pike`),
      {
        name: `Wall of Blades`,
        desc: `If the target unit made a charge move in the same turn, add 1 to wound rolls for attacks made with this unit's Warden's Pikes and improve the Rend characteristic of that weapon by 1.`,
        when: [COMBAT_PHASE],
      },
      CommonUnitEffects.getVanariWizardsEffect(5),
      CommonUnitEffects.PowerOfHyshEffect,
    ],
  },
  {
    name: `Vanari Auralan Sentinels`,
    effects: [
      CommonUnitEffects.getVanariWizardsEffect(5),
      CommonUnitEffects.getSunmetalWeaponsEffect(`Auralan Bow`),
      CommonUnitEffects.PowerOfHyshEffect,
      {
        name: `Scryhawk Lantern`,
        desc: `Pick one enemy unit within 30" of this unit's High Sentinel that is not visible to them. Choose the Lofted missile weapon characteristic for this unit's Auralan Bows in that phase, but that enemy unit is treated as being visible to all friendly models from that unit until the end of the phase.`,
        when: [START_OF_SHOOTING_PHASE],
      },
      {
        name: `Many-stringed Weapon`,
        desc: `Before attacking with Auralan Bows, choose the Aimed or Lofted missile weapon characteristic for all shooting attacks made by this unit in that phase.`,
        when: [SHOOTING_PHASE],
      },
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
        name: `Lances of the Dawn`,
        desc: `If this unit made a charge move in the same turn, add 1 to wound rolls for attacks made with this unit's Sunmetal Lances and improve the Rend characteristic of that weapon by 1.`,
        when: [COMBAT_PHASE],
      },
      CommonUnitEffects.getSunmetalWeaponsEffect(`Sunmetal Lance`),
      CommonUnitEffects.getVanariWizardsEffect(3),
      CommonUnitEffects.PowerOfHyshEffect,
      CommonUnitEffects.StandardBearerEffect,
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
        desc: `In your shooting phase, you can pick 1 enemy unit within 18" of this model that is visible to them and roll a D6. On a 1, nothing happens. On a 2-4, that unit suffers D3 mortal wounds. On a 5+, that unit suffers D6 mortal wounds.`,
        when: [SHOOTING_PHASE],
      },
      {
        name: `Spirit Armour`,
        desc: `Ignore modifiers (positive or negative) when making save rolls for attacks that target this model. In addition, halve the damage inflicted by attacks made with missile weapons or melee weapons that target this model (rounding up).`,
        when: [WOUND_ALLOCATION_PHASE],
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
  {
    name: `Scinari Cathallar`,
    effects: [
      {
        name: `Emotional Transference`,
        desc: `Pick one friendly LUMINETH REALM-LORDS unit wholly within 18" of this model and roll a D6. On a 2+, do not take a battle shock test for that unit. In addition, if any model from that unit were slain during that turn, you can pick one enemy unit within 18" of this model that has to take a battleshock test in that phase. Add the number of models from the friendly unit that were slain during that turn to the battleshock roll for that enemy unit.`,
        when: [START_OF_BATTLESHOCK_PHASE],
      },
      {
        name: `Darkness of the Soul`,
        desc: `Casting value of 7. Pick 1 enemy unit within 18" of the caster and visible to them. Until your next hero phase roll 2D6 each time that unit makes a normal move, charge move, shoots or fights. If the roll is greater than the unit's Bravery, that unit cannot perform that action in that phase.`,
        when: [HERO_PHASE, MOVEMENT_PHASE, CHARGE_PHASE, COMBAT_PHASE, SHOOTING_PHASE],
        spell: true,
      },
    ],
  },
  {
    name: `Alarith Stonemage`,
    effects: [
      {
        name: `Stonemage stance`,
        desc: `This model and any friendly ALARITH STONEGUARD units wholly within 12" of this model cannot make a pile-in move this phase. However until the end of the phase, improve the Rend characteristic of melee weapons used by this model and those friendly units by 1.`,
        when: [START_OF_COMBAT_PHASE],
      },
      {
        name: `Gravitic Reduction`,
        desc: `Casting value of 5. The caster can fly. In addition pick 1 enemy unit within 18" of the caster. The unit suffers 1 mortal wound and, until your next hero phase, its Movement characteristic is halved and it cannot fly.`,
        when: [HERO_PHASE, MOVEMENT_PHASE],
        spell: true,
      },
    ],
  },
  {
    name: `Alarith Stoneguard`,
    effects: [
      CommonUnitEffects.StandardBearerEffect,
      {
        name: `Crushing Blow`,
        desc: `Unmodified hit rolls of 6 with Stone Mallets add 1 to the damage inflicted if the attack is successful.`,
        when: [COMBAT_PHASE],
      },
      {
        name: `Diamondpick Hammer`,
        desc: `Unmodified hit rolls of 6 with Diamondpick Hammers inflict 1 mortal wound on the target and the attack sequence ends.`,
        when: [COMBAT_PHASE],
      },
      {
        name: `Pair of Stratum Hammers`,
        desc: `Reroll to hit rolls for a Pair of Stratum Hammers.`,
        when: [COMBAT_PHASE],
      },
    ],
  },
  {
    name: `Alarith Spirit of the Mountain`,
    effects: [
      CommonUnitEffects.StonemageSymbiosisEffect,
      CommonUnitEffects.AllButImmovableEffect,
      CommonUnitEffects.alarithSpiritFreeCommandAbilityEffect(`Ponderous Advice`, 3),
      CommonUnitEffects.alarithSpiritExtraAttackCommandAbilityEffect(`Faith of the Mountains`, `1`, 18),
      {
        name: `Stoneheart Shockwave`,
        desc: `Pick 1 enemy unit within range of this ability that is visible to this model. Subtract 1 from to hit rolls until the end of that phase. A unit cannot be affected by this ability more than once per phase.`,
        when: [START_OF_COMBAT_PHASE, START_OF_SHOOTING_PHASE],
      },
    ],
  },
  {
    name: `Avalenor, the Stoneheart King`,
    effects: [
      CommonUnitEffects.StonemageSymbiosisEffect,
      CommonUnitEffects.AllButImmovableEffect,
      CommonUnitEffects.alarithSpiritFreeCommandAbilityEffect(`Eldar Wisdom`, 6),
      CommonUnitEffects.alarithSpiritExtraAttackCommandAbilityEffect(
        `Unshakeable Faith of the Mountains`,
        `D3`,
        24
      ),
      {
        name: `Firestealer Hammers`,
        desc: `Unmodified hit rolls of 6 with Firestealer hammers inflict 1 mortal wound in addition to any normal damage.`,
        when: [COMBAT_PHASE],
      },
      {
        name: `Guardian of Hysh`,
        desc: `Subtract 1 from hit rolls for attacks made by enemy models within range of this ability.`,
        when: [COMBAT_PHASE, SHOOTING_PHASE],
      },
    ],
  },
]

export const AlliedUnits: TUnits = idoneth.Units

export const Battalions: TBattalions = [
  {
    name: `Alarith Temple`,
    effects: [
      {
        name: `Skin to Stone`,
        desc: `Any friendly STONEGUARD units from this battalion that are wholly within 12" of a friendly HERO from the same battalion can turn their skin to stone until the end of the phase. Reroll save rolls for attacks that target a unit that has turned its skin to stone. Models in the unit that has turned its skin to stone can only move 1" when they pile in.`,
        when: [START_OF_COMBAT_PHASE],
      },
    ],
  },
  {
    name: `Auralan Legion`,
    effects: [
      {
        name: `Shield of Light`,
        desc: `You can reroll save rolls of 1 for attacks that target a friendly unit from this battalion whilst it is within 3" of any other friendly unit from the same battalion.`,
        when: [WOUND_ALLOCATION_PHASE],
      },
    ],
  },
  {
    name: `Dawnrider Lance`,
    effects: [
      {
        name: `Shafts of Light`,
        desc: `Reroll hit rolls of 1 for attacks made with melee weapons by friendly units from this battalion that made a charge move in the same turn.`,
        when: [COMBAT_PHASE],
      },
    ],
  },
  {
    name: `Teclian Vanguard`,
    effects: [
      {
        name: `Blessing of Teclis`,
        desc: `Roll a D6 each time you allocate a wound or mortal wound to a friendly unit from this battalion while it is wholly within its own territory. On a 6, that wound or mortal wound is negated.`,
        when: [WOUND_ALLOCATION_PHASE],
      },
    ],
  },
]

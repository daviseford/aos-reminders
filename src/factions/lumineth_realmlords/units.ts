import { keyPicker, tagAs } from 'factions/metatagger'
import {
  BATTLESHOCK_PHASE,
  CHARGE_PHASE,
  COMBAT_PHASE,
  DURING_GAME,
  END_OF_HERO_PHASE,
  HERO_PHASE,
  SAVES_PHASE,
  SHOOTING_PHASE,
  START_OF_BATTLESHOCK_PHASE,
  START_OF_COMBAT_PHASE,
  START_OF_HERO_PHASE,
  START_OF_SHOOTING_PHASE,
  WOUND_ALLOCATION_PHASE,
} from 'types/phases'
import command_abilities from './command_abilities'
import spells from './spells'

const getSunmetalWeaponsEffect = (weapon: string) => ({
  name: `Sunmetal Weapons`,
  desc: `If the unmodified hit roll for an attack made with a ${weapon} is 6, that attack inflicts 1 mortal wound on the target and the attack sequence ends (do not make a wound or save roll).`,
  when: [COMBAT_PHASE],
})

const getVanariWizardsEffect = (minimumModelCountToBeWizard: number) => ({
  name: `Magic`,
  desc: `This unit is a WIZARD while it has ${minimumModelCountToBeWizard} or more models. They can attempt to cast 1 spell in your hero phase and attempt to unbind 1 spell in the enemy hero phase. They know the Power of Hysh spell.`,
  when: [HERO_PHASE],
})

const alarithSpiritFreeCommandAbilityEffect = (effectName: string, effectRange: number) => ({
  name: effectName,
  desc: `Pick 1 friendly LUMINETH REALM-LORDS AELF HERO within ${effectRange}" of this model. If that model is within ${effectRange}" of this model at the start of your next hero phase, then that model can use a command ability in that turn without spending any command points.`,
  when: [END_OF_HERO_PHASE],
})

const StandardBearerEffect = {
  name: `Standard Bearer`,
  desc: `You can reroll battleshock tests for units that include any Standard Bearers.`,
  when: [BATTLESHOCK_PHASE],
}

const AllButImmovableEffect = {
  name: `All but Immovable`,
  desc: `If this model doesnt not make a charge move in your charge phase, add 1 to the Attacks characteristic of this model's melee weapons until your next movement phase.`,
  when: [CHARGE_PHASE, COMBAT_PHASE],
}

const StonemageSymbiosisEffect = {
  name: `Stonemage Symbiosis`,
  desc: `When looking at this model's damage table, if it is within 12" of a friendly STONEMAGE, it is treated as if it has suffered 0 wounds.`,
  when: [DURING_GAME],
}

const Units = {
  'Archmage Teclis': {
    mandatory: {
      spells: [keyPicker(spells, ['Protection of Teclis', 'Storm of Searing White Light'])],
    },
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
    ],
  },
  'Vanari Auralan Wardens': {
    mandatory: {
      spells: [keyPicker(spells, ['Power of Hysh'])],
    },
    effects: [
      getSunmetalWeaponsEffect(`Warden's Pike`),
      getVanariWizardsEffect(5),
      {
        name: `Moonfire Flask`,
        desc: `Once per battle, you can pick 1 enemy unit within 3" of this unit's High Warden and roll a D6. On a 2+, that enemy unit suffers D3 mortal wounds.`,
        when: [START_OF_COMBAT_PHASE],
      },
      {
        name: `Wall of Blades`,
        desc: `If the target unit made a charge move in the same turn, add 1 to wound rolls for attacks made with this unit's Warden's Pikes and improve the Rend characteristic of that weapon by 1.`,
        when: [COMBAT_PHASE],
      },
    ],
  },
  'Vanari Auralan Sentinels': {
    mandatory: {
      spells: [keyPicker(spells, ['Power of Hysh'])],
    },
    effects: [
      getVanariWizardsEffect(5),
      getSunmetalWeaponsEffect(`Auralan Bow`),
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
  'Vanari Dawnriders': {
    mandatory: {
      spells: [keyPicker(spells, ['Power of Hysh'])],
    },
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
      getSunmetalWeaponsEffect(`Sunmetal Lance`),
      getVanariWizardsEffect(3),
      StandardBearerEffect,
    ],
  },
  'The Light of Eltharion': {
    mandatory: {
      command_abilities: [keyPicker(command_abilities, ['Unflinching Valour'])],
    },
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
        desc: `Halve the damage inflicted by attacks made with missile weapons or melee weapons that target this model (rounding up).`,
        when: [WOUND_ALLOCATION_PHASE],
      },
      {
        name: `Spirit Armour`,
        desc: `Ignore modifiers (positive or negative) when making save rolls for attacks that target this model.`,
        when: [SAVES_PHASE],
      },
      {
        name: `Supreme Swordmaster`,
        desc: `Ignore negative modifiers when making hit rolls for attacks made by this model. In addition, if the unmodified hit roll for an attack made by this model is 6, that attack scores 2 hits on the target instead of 1. Make a wound and save roll for each hit.`,
        when: [COMBAT_PHASE],
      },
    ],
  },
  'Scinari Cathallar': {
    mandatory: {
      spells: [keyPicker(spells, ['Darkness of the Soul'])],
    },
    effects: [
      {
        name: `Emotional Transference`,
        desc: `Pick one friendly LUMINETH REALM-LORDS unit wholly within 18" of this model and roll a D6. On a 2+, do not take a battle shock test for that unit. In addition, if any model from that unit were slain during that turn, you can pick one enemy unit within 18" of this model that has to take a battleshock test in that phase. Add the number of models from the friendly unit that were slain during that turn to the battleshock roll for that enemy unit.`,
        when: [START_OF_BATTLESHOCK_PHASE],
      },
    ],
  },
  'Alarith Stonemage': {
    mandatory: {
      spells: [keyPicker(spells, ['Gravitic Reduction'])],
    },
    effects: [
      {
        name: `Stonemage stance`,
        desc: `This model and any friendly ALARITH STONEGUARD units wholly within 12" of this model cannot make a pile-in move this phase. However until the end of the phase, improve the Rend characteristic of melee weapons used by this model and those friendly units by 1.`,
        when: [START_OF_COMBAT_PHASE],
      },
    ],
  },
  'Alarith Stoneguard': {
    effects: [
      StandardBearerEffect,
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
  'Alarith Spirit of the Mountain': {
    mandatory: {
      command_abilities: [keyPicker(command_abilities, ['Faith of the Mountains'])],
      spells: [keyPicker(spells, ['Power of Hysh'])],
    },
    effects: [
      StonemageSymbiosisEffect,
      AllButImmovableEffect,
      alarithSpiritFreeCommandAbilityEffect(`Ponderous Advice`, 3),
      {
        name: `Stoneheart Shockwave`,
        desc: `Pick 1 enemy unit within range of this ability that is visible to this model. Subtract 1 from to hit rolls until the end of that phase. A unit cannot be affected by this ability more than once per phase.`,
        when: [START_OF_COMBAT_PHASE, START_OF_SHOOTING_PHASE],
      },
    ],
  },
  'Avalenor, the Stoneheart King': {
    mandatory: {
      command_abilities: [keyPicker(command_abilities, ['Unshakeable Faith of the Mountains'])],
    },
    effects: [
      StonemageSymbiosisEffect,
      AllButImmovableEffect,
      alarithSpiritFreeCommandAbilityEffect(`Eldar Wisdom`, 6),
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
  'Myari Lightcaller': {
    mandatory: {
      spells: [keyPicker(spells, ['Dazzling Light'])],
    },
    effects: [
      {
        name: `Scryowl Familiar`,
        desc: `Add 1 to casting, unbinding, and dispelling rolls for this model.`,
        when: [HERO_PHASE],
      },
      {
        name: `Scryowl Familiar`,
        desc: `You can pick 1 enemy unit within 24" and not visible. The target becomes visible.`,
        when: [START_OF_HERO_PHASE, START_OF_SHOOTING_PHASE],
      },
      {
        name: `Magic`,
        desc: `This model is a wizard. Can attempt to cast 1 spell and attempt to unbind 1 spell. Knows Arcane Bolt, Mystic Shield, and Dazzling Light.`,
        when: [HERO_PHASE],
      },
    ],
  },
  "Myari's Purifiers": {
    effects: [
      {
        name: `Crushing Blow`,
        desc: `Unmodified hits of 6 made with Stone Mallet add 1 to the damage inflicted if successful.`,
        when: [COMBAT_PHASE],
      },
      {
        name: `Guardians`,
        desc: `Roll a D6 for each wound or mortal wound allocated to a friendly Myari Lightcaller within 3". On a 2+, this unit is allocated the wound instead.`,
        when: [WOUND_ALLOCATION_PHASE],
      },
      {
        name: `Sunmetal Weapons`,
        desc: `Unmodified hits of 6 for Sunmetal Greatsword or Auralan Bow attacks inflict 1 mortal wound and the attack sequence ends.`,
        when: [COMBAT_PHASE, SHOOTING_PHASE],
      },
    ],
  },
}

export default tagAs(Units, 'unit')

import { tagAs } from 'factions/metatagger'
import {
  CHARGE_PHASE,
  COMBAT_PHASE,
  DURING_GAME,
  HERO_PHASE,
  SHOOTING_PHASE,
  START_OF_COMBAT_PHASE,
  START_OF_HERO_PHASE,
} from 'types/phases'

const Artifacts = {
  'Master Rune of Unbreakable Resolve': {
    effects: [
      {
        name: `Master Rune of Unbreakable Resolve`,
        desc: `Once per battle, at the start of a phase, you can say that the bearer will use their master rune. If you do so, the bearer has a ward of 3+ until the end of that phase.`,
        when: [DURING_GAME],
      },
    ],
  },
  'Magnetised Runes': {
    effects: [
      {
        name: `Magnetised Runes`,
        desc: `Add 2 to charge rolls made for the bearer.`,
        when: [CHARGE_PHASE],
      },
    ],
  },
  'The Fiery Ring': {
    effects: [
      {
        name: `The Fiery Ring`,
        desc: `Once per battle, in your shooting phase, you can pick 1 enemy unit within 6" of the bearer and roll a dice. On a 2+, that unit suffers D6 mortal wounds.`,
        when: [SHOOTING_PHASE],
      },
    ],
  },
  'Draught of Magmalt Ale': {
    effects: [
      {
        name: `Draught of Magmalt Ale`,
        desc: `Once per battle, at the start of the combat phase, you can say that the bearer will drink their magmalt ale. If you do so, double the Attacks characteristic of the bearer's melee weapons until the end of that phase.`,
        when: [START_OF_COMBAT_PHASE],
      },
    ],
  },
  'The Axe of Grimnir': {
    effects: [
      {
        name: `The Axe of Grimnir`,
        desc: `Pick 1 of the bearer's melee weapons. Improve the Rend characteristic of that weapon by 1 and add 1 to the Damage characteristic of that weapon.`,
        when: [COMBAT_PHASE],
      },
    ],
  },
  'Ash-cloud Rune': {
    effects: [
      {
        name: `Ash-cloud Rune`,
        desc: `Once per battle, at the start of the enemy hero phase, you can say that the bearer will call down a column of soot. If you do so, until the end of that phase, units wholly within 12" of the bearer are not visible to enemy units attempting to cast a spell.`,
        when: [START_OF_HERO_PHASE],
      },
    ],
  },
  'Volatile Brazier': {
    effects: [
      {
        name: `Volatile Brazier`,
        desc: `When the bearer attempts to summon an invocation, you can reroll chanting rolls for the bearer and the range of the prayer is doubled.`,
        when: [HERO_PHASE],
      },
    ],
  },
  'Droth-helm': {
    effects: [
      {
        name: `Droth-helm`,
        desc: `Add 1 to wound rolls for attacks made with Claws and Horns by friendly MAGMADROTHS wholly within 12" of the bearer.`,
        when: [COMBAT_PHASE],
      },
    ],
  },
  'The Daemon Slayer': {
    effects: [
      {
        name: `The Daemon Slayer`,
        desc: `Pick 1 of the bearer's melee weapons. Ward rolls cannot be made for wounds and mortal wounds caused by attacks made with that weapon.`,
        when: [COMBAT_PHASE],
      },
    ],
  },
  'Nulsidian Icon': {
    effects: [
      {
        name: `Nulsidian Icon`,
        desc: `This artefact of power can only be given to a BATTLESMITH. Each time a friendly FYRESLAYERS unit wholly within 12" of the bearer is affected by a spell or the abilities of an endless spell, you can roll a dice. On a 4+, ignore the effect of that spell or the effects of that endless spell's abilities on that unit.`,
        when: [HERO_PHASE],
      },
    ],
  },

  // Drakeslayer: {
  //   effects: [
  //     {
  //       name: `Drakeslayer`,
  //       desc: `Once per battle instead of this unit throwing a Fyresteel throwing axe, they throw Drakeslayer. If they do so pick an enemy MONSTER within 8" of the bearer and roll a D6. On a 6 that MONSTER suffers 3D6 mortal wounds.`,
  //       when: [SHOOTING_PHASE],
  //     },
  //   ],
  // },
  // 'Obsidian Glowhelm': {
  //   effects: [
  //     {
  //       name: `Obsidian Glowhelm`,
  //       desc: `Roll a D6 if the bearer is on the battlefield. On a 4+ you receive 1 additional command point.`,
  //       when: [START_OF_HERO_PHASE],
  //     },
  //   ],
  // },
  // 'Shimmering Blade': {
  //   effects: [
  //     {
  //       name: `Shimmering Blade`,
  //       desc: `Pick one of the bearer's melee weapons. Improve the weapon's rend by 1. In addition, unmodified hits of 6 gain an additional 1 damage.`,
  //       when: [COMBAT_PHASE],
  //     },
  //   ],
  // },
  // Beastslayer: {
  //   effects: [
  //     {
  //       name: `Beastslayer`,
  //       desc: `Pick one of the bearer's melee weapons. Hits on MONSTERS from that weapon inflict 2 hits instead of 1.`,
  //       when: [COMBAT_PHASE],
  //     },
  //   ],
  // },
  // 'Bracers of Ember Iron': {
  //   effects: [
  //     {
  //       name: `Bracers of Ember Iron`,
  //       desc: `Add 1 to save rolls for attacks that target the bearer.`,
  //       when: [SAVES_PHASE],
  //     },
  //   ],
  // },
  // 'Rune of Blazing Fury': {
  //   effects: [
  //     {
  //       name: `Rune of Blazing Fury`,
  //       desc: `Once per battle, you can awaken this rune. If you do so reroll hit and wound rolls made by the bearer until the end of that phase.`,
  //       when: [START_OF_COMBAT_PHASE],
  //     },
  //   ],
  // },
  // 'Salamander Cloak': {
  //   effects: [
  //     {
  //       name: `Salamander Cloak`,
  //       desc: `On a 5+ ignore wounds or mortal wounds allocated to the bearer.`,
  //       when: [DURING_GAME],
  //     },
  //   ],
  // },
  // 'Ancestor Helm': {
  //   effects: [
  //     {
  //       name: `Ancestor Helm`,
  //       desc: `If an enemy unit fails a battleshock test within 12" of the bearer, add D3 to the number of models that flee.`,
  //       when: [BATTLESHOCK_PHASE],
  //     },
  //   ],
  // },
  // 'Emberstone Rune': {
  //   effects: [
  //     {
  //       name: `Emberstone Rune`,
  //       desc: `Add 1 to chanting rolls for prayers chanted by the bearer that summon an invocation.`,
  //       when: [HERO_PHASE],
  //     },
  //   ],
  // },
  // 'Icon of the Ancestors': {
  //   effects: [
  //     {
  //       name: `Icon of the Ancestors`,
  //       desc: `The range of this Battlesmith's icon of Grimnir and None Shall Defile the Icon abilities is 18" instead of 12".`,
  //       when: [DURING_GAME],
  //     },
  //   ],
  // },
  // "Icon of Grimnir's Condemnation": {
  //   effects: [
  //     {
  //       name: `Icon of Grimnir's Condemnation`,
  //       desc: `The bearer can attempt to unbind 1 spell in the same manner as a WIZARD. In addition if the bearer unbinds a spell roll a D6. On a 2+ the caster suffers 1 mortal wound.`,
  //       when: [HERO_PHASE],
  //     },
  //   ],
  // },
  // // Vostarg
  // Vosaxe: {
  //   effects: [
  //     {
  //       name: `Vosaxe`,
  //       desc: `Pick a melee weapon at the start of the battle. Improve its rend by 1. In addition, unmodified hits of 6 gain an additional 1 damage.`,
  //       when: [COMBAT_PHASE],
  //     },
  //   ],
  // },
  // // Greyfyrd
  // 'Helm of Obsidia': {
  //   effects: [
  //     {
  //       name: `Helm of Obsidia`,
  //       desc: `Add 2 to the Wounds characteristic of the bearer.`,
  //       when: [DURING_GAME],
  //     },
  //   ],
  // },
  // // Hermdar
  // 'Tyrant Slayer': {
  //   effects: [
  //     {
  //       name: `Tyrant Slayer`,
  //       desc: `Pick one of the bearer's melee weapons. You can reroll wound rolls for attacks made by that weapon that target an enemy HERO. In addition if the unmodified hit roll for an attack by this weapon against an enemy HERO is a 6 that attack inflicts 1 mortal wound as well as any normal damage.`,
  //       when: [COMBAT_PHASE],
  //     },
  //   ],
  // },
  // // LOFNIR
  // 'Igneous Battle-throne': {
  //   effects: [
  //     {
  //       name: `Igneous Battle-throne`,
  //       desc: `6+ to ignore wounds or mortal wounds allocated to the bearer.`,
  //       when: [WOUND_ALLOCATION_PHASE],
  //     },
  //   ],
  // },
}

export default tagAs(Artifacts, 'artifact')

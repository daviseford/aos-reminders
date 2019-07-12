import { TCommandTraits } from 'types/army'
import {
  COMBAT_PHASE,
  SHOOTING_PHASE,
  START_OF_HERO_PHASE,
  START_OF_MOVEMENT_PHASE,
  DURING_GAME,
  HERO_PHASE,
  DURING_SETUP,
  END_OF_MOVEMENT_PHASE,
  MOVEMENT_PHASE,
} from 'types/phases'

const CommandTraits: TCommandTraits = [
  {
    name: `Chosen Guardians (Grand Host of Nagash)`,
    effects: [
      {
        name: `Chosen Guardians (Grand Host of Nagash)`,
        desc: `Add 1 attack to all melee weapons used by GRAND HOST OF NAGASH MORGHAST units`,
        when: [DURING_GAME],
      },
    ],
  },
  {
    name: `Legions Innumerable (Grand Host of Nagash)`,
    effects: [
      {
        name: `Legions Innumerable (Grand Host of Nagash)`,
        desc: `Roll a dice for each friendly GRAND HOST OF NAGASH SUMMONABLE unit, on a 5+ heal d3 wounds. If no wounds are allocated, return a number of models with a combined wounds characteristic of d3 or less.`,
        when: [HERO_PHASE],
      },
    ],
  },
  {
    name: `Magic (Grand Host of Nagash)`,
    effects: [
      {
        name: `Magic (Grand Host of Nagash)`,
        desc: `All WIZARDS in a GRAND HOST OF NAGASH army know an additional spell from the Lores of the Dead. Nagash knows an additional three`,
        when: [DURING_GAME],
      },
    ],
  },
  {
    name: `Magic (Legion of Sacrament, Blood or Night)`,
    effects: [
      {
        name: `Magic (Legion of Sacrament, Blood or Night)`,
        desc: `All WIZARDS know an additional spell from the Lores of the Dead.`,
        when: [DURING_GAME],
      },
    ],
  },
  {
    name: `Magic (Soulblight)`,
    effects: [
      {
        name: `Magic (Soulblight)`,
        desc: `All WIZARDS in a SOULBLIGHT army know an additional spell from Lore of the Vampires`,
        when: [DURING_GAME],
      },
    ],
  },
  {
    name: `Aura of Grief (Legion of Grief)`,
    effects: [
      {
        name: `Aura of Grief (Legion of Grief)`,
        desc: `Subtract 1 from the Bravery Characteristic of enemy units when they are within 6" of any LEGION OF GRIEF units`,
        when: [DURING_GAME],
      },
    ],
  },
  {
    name: `The Master's Teachings (Legin of Sacrament)`,
    effects: [
      {
        name: `The Master's Teachings (Legin of Sacrament)`,
        desc: `When an enemy unit is destroyed, before the last model is removed, pick a gravesite within 6". On a 4+ you may return a destroyed friendly SUMMONABLE unit to the battlefield within 9" of the gravesite and more than 9" from enemy models.`,
        when: [DURING_GAME],
      },
    ],
  },
  {
    name: `The Black Desciples (Legion of Sacrament)`,
    effects: [
      {
        name: `The Black Desciples (Legion of Sacrament)`,
        desc: `Friendly LEGION OF SACRAMENT wizards get +1 to cast.`,
        when: [HERO_PHASE],
      },
    ],
  },
  {
    name: `Immortal Majesty (Legion of Blood)`,
    effects: [
      {
        name: `Immortal Majesty (Legion of Blood)`,
        desc: `Enemy Units -1 Bravery within 6" of any LEGION OF BLOOD units.`,
        when: [DURING_GAME],
      },
    ],
  },
  {
    name: `Favoured Retainers (Legion of Blood)`,
    effects: [
      {
        name: `Favoured Retainers (Legion of Blood)`,
        desc: `+1 Attack for all melee weapons used by friendly LEGION OF BLOOD VAMPIRE LORDS and LEGION OF BLOOD BLOOD KNIGHTS`,
        when: [COMBAT_PHASE],
      },
    ],
  },
  {
    name: `The Bait (Legion of Night)`,
    effects: [
      {
        name: `The Bait (Legion of Night)`,
        desc: `Add 1 to save rolls for friendly LEGION OF NIGHT DEATHRATTLE units that are wholly within your territory.`,
        when: [SHOOTING_PHASE, COMBAT_PHASE],
      },
    ],
  },
  {
    name: `Ageless Cunning (Legion of Night)`,
    effects: [
      {
        name: `Ageless Cunning (Legion of Night)`,
        desc: `Instead of deploying a unit, you can set it up in ambush. Up to three units. At the end of any movement phase you can set them up wholly within 6" of any battlefield edge and more than 9" away from enemy models`,
        when: [DURING_SETUP, END_OF_MOVEMENT_PHASE],
      },
    ],
  },
  {
    name: `Deathless Thralls (Soulblight)`,
    effects: [
      {
        name: `Deathless Thralls (Soulblight)`,
        desc: `Friendly SOULBLIGHT units within 6" of a SOULBLIGHT HERO or your general negate wounds or mortal wounds on a 6+`,
        when: [DURING_GAME],
      },
    ],
  },
  {
    name: `The Bloodlines: Dragon Warriors (Soulblight)`,
    effects: [
      {
        name: `The Bloodlines: Dragon Warriors (Soulblight)`,
        desc: `Friendly SOULBLIGHT units reroll hit rolls of 1 if they charged in the same turn.`,
        when: [COMBAT_PHASE],
      },
    ],
  },
  {
    name: `The Bloodlines: Lords of Night (Soulblight)`,
    effects: [
      {
        name: `The Bloodlines: Lords of Night (Soulblight)`,
        desc: `Friendly SOULBLIGHT units benefit from Deathless Thralls even if they're not within 6" of a SOULBLIGHT HERO.`,
        when: [DURING_GAME],
      },
    ],
  },
  {
    name: `The Bloodlines: Necromantic (Soulblight)`,
    effects: [
      {
        name: `The Bloodlines: Necromantic (Soulblight)`,
        desc: `+1 to casting and unbinding for Necromantic Bloodline WIZARDS. In addition, -1 bravery for enemy units within 6" of any models with the Necromantic Bloodline`,
        when: [HERO_PHASE, DURING_GAME],
      },
    ],
  },
  {
    name: `The Bloodlines: Swift Death (Soulblight)`,
    effects: [
      {
        name: `The Bloodlines: Swift Death (Soulblight)`,
        desc: `Add 2" to movement for all models with Swift Death Bloodline. In addition, all Swift Death models move as if they had Fly`,
        when: [MOVEMENT_PHASE],
      },
    ],
  },
]

export default CommandTraits

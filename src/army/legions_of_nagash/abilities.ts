import {
  START_OF_HERO_PHASE,
  DURING_GAME,
  HERO_PHASE,
  BATTLESHOCK_PHASE,
  CHARGE_PHASE,
  COMBAT_PHASE,
  DURING_SETUP,
  START_OF_MOVEMENT_PHASE,
  END_OF_MOVEMENT_PHASE,
  SHOOTING_PHASE,
  MOVEMENT_PHASE,
} from 'types/phases'
import { IEffects } from 'types/data'

// General Allegiance Abilities (always active regardless of army composition)
const Abilities: IEffects[] = [
  {
    name: `Deathless Minions`,
    desc: `Roll a dice each time you allocate a wound or mortal wound to a friendly DEATH unit within 6" of your general or a friendly DEATH HERO. On a 6+, that wound or mortal wound is negated.`,
    when: [DURING_GAME],
  },
  {
    name: `The Unquiet Dead`,
    desc: `After territories are determined, but before deployment, you may set up up to four gravesites. Two in your territory, two anywhere. When deploying a unit you may say it is set up In The Grave instead. You can do this as many times as you wish. At the end of any movement phase a DEATH HERO within 9" of a gravesite can set up a unit from In The Grave. Set it up wholly within 9" of the gravesite, more than 9" from enemy models.`,
    when: [DURING_SETUP, END_OF_MOVEMENT_PHASE],
  },
  {
    name: `Invigorating Aura`,
    desc: `Gravesites have the following ability. Pick a friendly SUMMONABLE unit within 9" of this gravesite. Heal d3 wounds to it, or if no wounds are allocated you can return a number of models with a combined wounds characteristic of d3 or less.`,
    when: [START_OF_HERO_PHASE],
  },
  {
    name: `Chosen Guardians (Grand Host of Nagash)`,
    desc: `Add 1 attack to all melee weapons used by GRAND HOST OF NAGASH MORGHAST units`,
    when: [DURING_GAME],
  },
  {
    name: `Legions Innumerable (Grand Host of Nagash)`,
    desc: `Roll a dice for each friendly GRAND HOST OF NAGASH SUMMONABLE unit, on a 5+ heal d3 wounds. If no wounds are allocated, return a number of models with a combined wounds characteristic of d3 or less.`,
    when: [HERO_PHASE],
  },
  {
    name: `Endless Legions`,
    desc: `Pick a gravesite within 9" of your general. You may return a destroyed friendly SUMMONABLE unit to the battlefield within 9" of the gravesite and more than 9" from enemy models.`,
    when: [END_OF_MOVEMENT_PHASE],
    command: true,
  },
  {
    name: `Magic (Grand Host of Nagash)`,
    desc: `All WIZARDS in a GRAND HOST OF NAGASH army know an additional spell from the Lores of the Dead. Nagash knows an additional three`,
    when: [DURING_GAME],
  },
  {
    name: `Magic (Legion of Sacrament, Blood or Night)`,
    desc: `All WIZARDS know an additional spell from the Lores of the Dead.`,
    when: [DURING_GAME],
  },
  {
    name: `Magic (Soulblight)`,
    desc: `All WIZARDS in a SOULBLIGHT army know an additional spell from Lore of the Vampires`,
    when: [DURING_GAME],
  },
  {
    name: `Aura of Grief (Legion of Grief)`,
    desc: `Subtract 1 from the Bravery Characteristic of enemy units when they are within 6" of any LEGION OF GRIEF units`,
    when: [DURING_GAME],
  },
  {
    name: `The Master's Teachings (Legin of Sacrament)`,
    desc: `When an enemy unit is destroyed, before the last model is removed, pick a gravesite within 6". On a 4+ you may return a destroyed friendly SUMMONABLE unit to the battlefield within 9" of the gravesite and more than 9" from enemy models.`,
    when: [DURING_GAME],
  },
  {
    name: `The Black Desciples (Legion of Sacrament)`,
    desc: `Friendly LEGION OF SACRAMENT wizards get +1 to cast.`,
    when: [HERO_PHASE],
  },
  {
    name: `Immortal Majesty (Legion of Blood)`,
    desc: `Enemy Units -1 Bravery within 6" of any LEGION OF BLOOD units.`,
    when: [DURING_GAME],
  },
  {
    name: `Favoured Retainers (Legion of Blood)`,
    desc: `+1 Attack for all melee weapons used by friendly LEGION OF BLOOD VAMPIRE LORDS and LEGION OF BLOOD BLOOD KNIGHTS`,
    when: [COMBAT_PHASE],
  },
  {
    name: `The Bait (Legion of Night)`,
    desc: `Add 1 to save rolls for friendly LEGION OF NIGHT DEATHRATTLE units that are wholly within your territory.`,
    when: [SHOOTING_PHASE, COMBAT_PHASE],
  },
  {
    name: `Ageless Cunning (Legion of Night)`,
    desc: `Instead of deploying a unit, you can set it up in ambush. Up to three units. At the end of any movement phase you can set them up wholly within 6" of any battlefield edge and more than 9" away from enemy models`,
    when: [DURING_SETUP, END_OF_MOVEMENT_PHASE],
  },
  {
    name: `Deathless Thralls (Soulblight)`,
    desc: `Friendly SOULBLIGHT units within 6" of a SOULBLIGHT HERO or your general negate wounds or mortal wounds on a 6+`,
    when: [DURING_GAME],
  },
  {
    name: `The Bloodlines: Dragon Warriors (Soulblight)`,
    desc: `Friendly SOULBLIGHT units reroll hit rolls of 1 if they charged in the same turn.`,
    when: [COMBAT_PHASE],
  },
  {
    name: `The Bloodlines: Lords of Night (Soulblight)`,
    desc: `Friendly SOULBLIGHT units benefit from Deathless Thralls even if they're not within 6" of a SOULBLIGHT HERO.`,
    when: [DURING_GAME],
  },
  {
    name: `The Bloodlines: Necromantic (Soulblight)`,
    desc: `+1 to casting and unbinding for Necromantic Bloodline WIZARDS. In addition, -1 bravery for enemy units within 6" of any models with the Necromantic Bloodline`,
    when: [HERO_PHASE, DURING_GAME],
  },
  {
    name: `The Bloodlines: Swift Death (Soulblight)`,
    desc: `Add 2" to movement for all models with Swift Death Bloodline. In addition, all Swift Death models move as if they had Fly`,
    when: [MOVEMENT_PHASE],
  },
]

export default Abilities

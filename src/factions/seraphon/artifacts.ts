import { tagAs } from 'factions/metatagger'
import {
  COMBAT_PHASE,
  DURING_GAME,
  END_OF_SETUP,
  HERO_PHASE,
  MOVEMENT_PHASE,
  SAVES_PHASE,
  SHOOTING_PHASE,
  START_OF_HERO_PHASE,
  WOUND_ALLOCATION_PHASE,
} from 'types/phases'

const Artifacts = {
  'Zoetic Dial': {
    effects: [
      {
        name: `Zoetic Dial`,
        desc: `After set-up is complete but before the battle begins, secretly record the number of a battle round. At the start of that battle round, reveal the information and then heal all wounds allocated to the bearer. In addition, during that battle round, you can reroll save rolls for attacks that target the bearer.`,
        when: [END_OF_SETUP],
      },
    ],
  },
  'Incandescent Rectrices': {
    effects: [
      {
        name: `Incandescent Rectrices`,
        desc: `The first time bearer is slain, before removing them from the battlefield, roll a D6. On a 1-3, the bearer is slain. On a 4-6, the bearer is not slain, all wounds allocated to them are healed, and any wounds that currently remain to be allocated to them are negated.`,
        when: [WOUND_ALLOCATION_PHASE],
      },
    ],
  },
  'Blade of Realities': {
    effects: [
      {
        name: `Blade of Realities`,
        desc: `Pick 1 of the bearer's melee weapons. Improve the Rend characteristic of that weapon by 1. In addition, add 1 to the damage inflicted by each successful attack made with that weapon that targets a HERO.`,
        when: [COMBAT_PHASE],
      },
    ],
  },
  'Light of Dracothion': {
    effects: [
      {
        name: `Light of Dracothion`,
        desc: `Once per battle, you can automatically unbind 1 spell cast by an enemy WIZARD within 15" of the bearer, or automatically dispel 1 endless spell within 15" of the bearer.`,
        when: [HERO_PHASE],
      },
    ],
  },
  'Prism of Amyntok': {
    effects: [
      {
        name: `Prism of Amyntok`,
        desc: `Once per the battle, at the start of any phase, pick 1 enemy unit within 12" of the bearer and roll a D6. On a 1, that unit suffers 1 mortal wound. On a 2-5, that unit suffers D3 mortal wounds. On a 6, that unit suffers D6 mortal wounds.`,
        when: [DURING_GAME],
      },
    ],
  },
  'Itxi Grubs': {
    effects: [
      {
        name: `Itxi Grubs`,
        desc: `At the start of each hero phase, you can heal 1 wound allocated to the bearer.`,
        when: [START_OF_HERO_PHASE],
      },
      {
        name: `Itxi Grubs`,
        desc: `In your hero phase you can reroll 1 casting or dispelling roll for the bearer, and in the enemy hero phase you can reroll 1 unbinding roll for the bearer.`,
        when: [HERO_PHASE],
      },
    ],
  },
  'Plaque of Dominion': {
    effects: [
      {
        name: `Plaque of Dominion`,
        desc: `In your hero phase, you can pick 1 enemy HERO within 12" of the bearer and visible to them. Until your next hero phase, that HERO fights at the end of the combat phase. In addition, if that HERO is a WIZARD, until your next hero phase, subtract 1 from casting, dispelling and unbinding rolls for that HERO.`,
        when: [HERO_PHASE],
      },
    ],
  },
  'Throne of the Lost Gods': {
    effects: [
      {
        name: `Throne of the Lost Gods`,
        desc: `Add 1 to the bearer's Wounds characteristic.`,
        when: [WOUND_ALLOCATION_PHASE],
      },
      {
        name: `Throne of the Lost Gods`,
        desc: `Add 4" to the bearer's Move characteristic.`,
        when: [MOVEMENT_PHASE],
      },
    ],
  },
  'Sigils of the Prime Hunter': {
    effects: [
      {
        name: `Sigils of the Prime Hunter`,
        desc: `Each time the bearer fights, after all of the bearer's attacks have been resolved, you can pick 1 enemy unit within 1" of the bearer and roll a D6. On a 1, nothing happens. On a 2-5, that enemy unit suffers 1 mortal wound. On a 6, that enemy unit suffers D3 mortal wounds.`,
        when: [COMBAT_PHASE],
      },
    ],
  },
  'Bloodrage Pendant': {
    effects: [
      {
        name: `Bloodrage Pendant`,
        desc: `Add 1 to the Attacks characteristic of the bearer's melee weapons if the number of wounds allocated to the bearer is equal to or greater than half of the bearer's Wounds characteristic (rounding up)`,
        when: [COMBAT_PHASE],
      },
    ],
  },
  'Cloak of Feathers': {
    effects: [
      {
        name: `Cloak of Feathers`,
        desc: `Subtract 1 from hit rolls for attacks that target the bearer.`,
        when: [SHOOTING_PHASE, COMBAT_PHASE],
      },
      {
        name: `Cloak of Feathers`,
        desc: `Add 4" to the bearer's Move characteristic, and the bearer can fly.`,
        when: [MOVEMENT_PHASE],
      },
    ],
  },
  'Sacred Stegadon Helm': {
    effects: [
      {
        name: `Sacred Stegadon Helm`,
        desc: `Add 1 to save rolls for attacks that target the bearer.`,
        when: [SAVES_PHASE],
      },
      {
        name: `Sacred Stegadon Helm`,
        desc: `Add 1 to the Damage characteristic of melee weapons used by the bearer if they made a charge move in the same turn.`,
        when: [COMBAT_PHASE],
      },
    ],
  },

  'Godbeast Pendant': {
    effects: [
      {
        name: `Godbeast Pendant`,
        desc: `The first time the bearer is slain, before removing them from the battlefield, roll a D6. On a 1-3, the bearer is slain. On a 4-6, the bearer is not slain, all wounds allocated to them are healed, and any wounds that currently remain to be allocated to them are negated.`,
        when: [WOUND_ALLOCATION_PHASE],
      },
    ],
  },
  'Serpent God Dagger': {
    effects: [
      {
        name: `Serpent God Dagger`,
        desc: `Pick 1 of the bearer's melee weapons. At the end of any phase, if any wounds inflicted by that weapon in that phase were allocated to an enemy model and not negated, and that enemy model has not been slain, roll a D6. On a 5+, that enemy model is slain.`,
        when: [DURING_GAME],
      },
    ],
  },
  'Eviscerating Blade': {
    effects: [
      {
        name: `Eviscerating Blade`,
        desc: `Pick 1 of the bearer's melee weapons. If the unmodified hit roll for an attack made with that weapon is 6, that attack inflicts 2 mortal wounds on the target in addition to any normal damage.`,
        when: [COMBAT_PHASE],
      },
    ],
  },
  'Fusil of Conflagration': {
    effects: [
      {
        name: `Fusil of Conflagration`,
        desc: `In your shooting phase, you can pick 1 enemy unit within 12" of the bearer and visible to them and roll a D6. On a 1, this artefact cannot be used again for the rest of the battle. On a 2-3, nothing happens. On a 4-5 that enemy unit suffers D3 mortal wounds. On a 6, that enemy unit suffers D6 mortal wounds.`,
        when: [SHOOTING_PHASE],
      },
    ],
  },
}

export default tagAs(Artifacts, 'artifact')

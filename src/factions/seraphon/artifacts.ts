import { TItemDescriptions } from 'factions/factionTypes'
import { tagAs } from 'factions/metatagger'
import {
  COMBAT_PHASE,
  DURING_GAME,
  END_OF_ANY_PHASE,
  END_OF_MOVEMENT_PHASE,
  END_OF_SETUP,
  HERO_PHASE,
  MOVEMENT_PHASE,
  SAVES_PHASE,
  SHOOTING_PHASE,
  START_OF_ANY_PHASE,
  START_OF_HERO_PHASE,
} from 'types/phases'

const Artifacts = {
  'Zoetic Dial': {
    effects: [
      {
        name: `Zoetic Dial`,
        desc: `After deployment but before the first battle round begins, secretly record the number of a battle round on a piece of paper. At the start of that battle round, reveal the information and then heal all wounds allocated to the bearer. In addition, during that battle round, add 1 to save rolls for attacks that target the bearer.`,
        when: [END_OF_SETUP],
      },
    ],
  },
  'Relocation Orb': {
    effects: [
      {
        name: `Relocation Orb`,
        desc: `Once per battle, at the end of a phase, if the bearer has had any wounds allocated to them in that phase, you can remove the bearer from the battlefield and set them up anywhere wholly within 12" of a friendly cosmic node and more than 9" from all enemy units.`,
        when: [END_OF_ANY_PHASE],
      },
    ],
  },
  'Incandescent Rectrices': {
    effects: [
      {
        name: `Incandescent Rectrices`,
        desc: `At the start of each of your hero phases, you can heal up to D3 wounds allocated to the bearer.`,
        when: [START_OF_HERO_PHASE],
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
  'Prism of Amyntok': {
    effects: [
      {
        name: `Prism of Amyntok`,
        desc: `Once per battle, at the start of a phase, pick 1 enemy unit within 12" of the bearer and roll a dice. On a 1, nothing happens. On a 2+, that enemy unit suffers a number of mortal wounds equal to the roll.`,
        when: [START_OF_ANY_PHASE],
      },
    ],
  },
  "Spacefolder's Stave": {
    effects: [
      {
        name: `Spacefolder's Stave`,
        desc: `Once per turn, at the end of your movement phase, if the bearer is on the battlefield, you can say that they will guide the arrival of their celestial reinforcements. If you do so, the next friendly STARBORNE unit to be set up on the battlefield can be set up more than 7" from all enemy units instead of more than 9".`,
        when: [END_OF_MOVEMENT_PHASE],
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
        desc: `In your hero phase, you can reroll 1 casting roll or 1 dispelling roll for the bearer, and in the enemy hero phase, you can reroll 1 unbinding roll for the bearer.`,
        when: [HERO_PHASE],
      },
    ],
  },
  'Bloodrage Pendant': {
    effects: [
      {
        name: `Bloodrage Pendant`,
        desc: `Add 1 to the Attacks characteristic of the bearer's melee weapons. If the number of wounds allocated to the bearer is equal to or greater than half of the bearer's Wounds characteristic (rounding up), add 2 instead.`,
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
  'Serpent God Dagger': {
    effects: [
      {
        name: `Serpent God Dagger`,
        desc: `Pick 1 of the bearer's melee weapons. At the end of any phase, if any wounds inflicted by that weapon in that phase were allocated to an enemy model and not negated, and that enemy model has not been slain, roll a D6. On a 5+, that enemy model is slain.`,
        when: [END_OF_ANY_PHASE],
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
  'Crystalline Skull': {
    effects: [
      {
        name: `Crystalline Skull`,
        desc: `The bearer starts with a power reserve of 0. Each time the bearer successfully casts a spell that is not unbound, increase the bearer's power reserve by 1. Once per battle, in your hero phase, you can say that the bearer will shatter the crystalline skull. If you do so, pick 1 enemy unit within 12" of the bearer and roll a number of dice equal to the power reserve. For each 3+, that unit suffers 1 mortal wound.`,
        when: [HERO_PHASE],
      },
    ],
  },
  'Coati Familiar': {
    effects: [
      {
        name: `Coati Familiar`,
        desc: `Once per battle, at the start of your hero phase, you can say that the bearer will be blessed by Tepok. If you do so, the bearer can attempt to cast 1 additional spell in that hero phase, and that spell can be any spell from the Lore of Ancient Domains.`,
        when: [START_OF_HERO_PHASE],
      },
    ],
  },
  "Sotek's Gaze": {
    effects: [
      {
        name: `Sotek's Gaze`,
        desc: `Enemy models with a Wounds characteristic of 1 or 2 cannot contest objectives while they are within 6" of the bearer.`,
        when: [DURING_GAME],
      },
    ],
  },
} satisfies TItemDescriptions

export default tagAs(Artifacts, 'artifact')

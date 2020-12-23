import { TEntry } from 'types/data'
import {
  COMBAT_PHASE,
  END_OF_HERO_PHASE,
  END_OF_MOVEMENT_PHASE,
  HERO_PHASE,
  SHOOTING_PHASE,
  START_OF_COMBAT_PHASE,
  START_OF_HERO_PHASE,
  START_OF_ROUND,
} from 'types/phases'
import {
  AQSHY,
  CHAMON,
  CHARRWIND,
  EIGHTPOINTS,
  GHUR,
  GHYRAN,
  HELLEFlUX,
  HYSH,
  SHYISH,
  STYGXX,
  ULGU,
  UMBRAL,
  VARANTHAX,
} from 'types/realmscapes'

// Realm specific command abilities.
const CommandAbilities: TEntry[] = [
  {
    name: `Blazing Fervour (${AQSHY})`,
    effects: [
      {
        name: `Blazing Fervour (${AQSHY})`,
        desc: `Pick 1 friendly unit wholly within 12" of a friendly HERO. Add 1 to run and charge rolls made for that unit until your next hero phase. The same unit cannot benefit from this command ability more than once per phase.`,
        when: [START_OF_HERO_PHASE],
      },
    ],
  },
  {
    name: `Living Blades (${CHAMON})`,
    effects: [
      {
        name: `Living Blades (${CHAMON})`,
        desc: `Pick 1 friendly unit wholly within 12" of a friendly HERO. Until your next hero phase, add 1 to hit rolls for attacks made with melee weapons by that unit if it made a charge move in the same turn.`,
        when: [START_OF_COMBAT_PHASE],
      },
    ],
  },
  {
    name: `Feral Roar (${GHUR})`,
    effects: [
      {
        name: `Feral Roar (${GHUR})`,
        desc: `Pick 1 friendly MONSTER wholly within 12" of a friendly HERO. Until the end of the battle round, when you look up a value on that model's damage table, that MONSTER is treated as if it has suffered 0 wounds.`,
        when: [HERO_PHASE],
      },
    ],
  },
  {
    name: `Command the Land (${GHYRAN})`,
    effects: [
      {
        name: `Command the Land (${GHYRAN})`,
        desc: `One friendly HERO can attempt to cast Shield of Thorns even if they are not a WIZARD and even if the spell has already been attempted in the same hero phase. If that HERO is a WIZARD, using this command ability allows them to attempt to cast Shield of Thorns in addition to any other spells they have already attempted to cast and even if Shield of Thorns has been attempted in the same hero phase.`,
        when: [END_OF_HERO_PHASE],
      },
    ],
  },
  {
    name: `All-seeing Enlightenment (${HYSH})`,
    effects: [
      {
        name: `All-seeing Enlightenment (${HYSH})`,
        desc: `Pick 1 friendly unit wholly within 12" of a friendly HERO. Do not apply the cover modifier to save rolls for attacks made by that unit until the start of your next hero phase.`,
        when: [HERO_PHASE],
      },
    ],
  },
  {
    name: `On Me! (${ULGU})`,
    effects: [
      {
        name: `On Me! (${ULGU})`,
        desc: `You can use this command ability once per battle, at the end of your movement phase. If you do so, pick 1 friendly unit wholly within 18" of a friendly HERO. Remove that unit from the battlefield and then set it up again wholly within 6" of that friendly HERO and more than 9" from any enemy units.`,
        when: [END_OF_MOVEMENT_PHASE],
      },
    ],
  },
  {
    name: `Amethyst Aura (${SHYISH})`,
    effects: [
      {
        name: `Amethyst Aura (${SHYISH})`,
        desc: `Pick 1 friendly unit wholly within 12" of a friendly HERO. Until the end of that battle round, roll a D6 each time you allocate a wound or mortal wound to that unit. On a 6, that wound or mortal wound is negated.`,
        when: [HERO_PHASE],
      },
    ],
  },
  {
    name: `Honour the Dead (${STYGXX})`,
    effects: [
      {
        name: `Honour the Dead (${STYGXX})`,
        desc: `Pick a friendly unit within 3" of a hero (12" of a general) and roll a D6. If the roll is less than the number of models that have been slain from the selected unit, you can add 1 to the attacks characteristic of that unit.`,
        when: [START_OF_COMBAT_PHASE],
      },
    ],
  },
  {
    name: `Soul-force Sacrifice (${STYGXX})`,
    effects: [
      {
        name: `Soul-force Sacrifice (${STYGXX})`,
        desc: `Pick a friendly unit within 3" of your general. Allocate any number of wounds to selected unit and heal that many wounds from the general.`,
        when: [START_OF_HERO_PHASE],
      },
    ],
  },
  {
    name: `Forced by the Aether (${EIGHTPOINTS})`,
    effects: [
      {
        name: `Forced by the Aether (${EIGHTPOINTS})`,
        desc: `Pick 1 predatory endless spell within 12" of a friendly wizard and add D6" to the movement range of the target until the end of the battle round.`,
        when: [START_OF_ROUND],
      },
    ],
  },
  {
    name: `On Me! (${UMBRAL})`,
    effects: [
      {
        name: `On Me! (${UMBRAL})`,
        desc: `Once per battle, you can pick 1 friendly unit wholly within 18" of a friendly hero. The target may be removed and set up wholly within 6" of that hero more than 9" from enemy units.`,
        when: [END_OF_MOVEMENT_PHASE],
      },
    ],
  },
  {
    name: `Unseen Killers (${HELLEFlUX})`,
    effects: [
      {
        name: `Unseen Killers (${HELLEFlUX})`,
        desc: `Pick a unit wholly within 12" of a friendly hero and wholly within 3" of a terrain feature. Add 1 to the target's hit rolls until the end of the phase.`,
        when: [SHOOTING_PHASE, COMBAT_PHASE],
      },
    ],
  },
  {
    name: `Misthunters (${CHARRWIND})`,
    effects: [
      {
        name: `Misthunters (${CHARRWIND})`,
        desc: `Pick 1 friendly unit wholly within 12" of a friendly hero. Do not subtract 1 from hit rolls by the target due to Sweltering Mists.`,
        when: [SHOOTING_PHASE],
      },
    ],
  },
  {
    name: `Self-sacrifice (${VARANTHAX})`,
    effects: [
      {
        name: `Self-sacrifice (${VARANTHAX})`,
        desc: `Pick 1 friendly unit wholly within 12" of a friendly hero. Until the end of the phase, add 1 to hit rolls and subtract 1 from save rolls for the target.`,
        when: [START_OF_COMBAT_PHASE],
      },
    ],
  },
]

export default CommandAbilities

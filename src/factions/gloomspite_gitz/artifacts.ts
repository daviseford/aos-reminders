import { tagAs } from 'factions/metatagger'
import {
  COMBAT_PHASE,
  DURING_GAME,
  END_OF_COMBAT_PHASE,
  HERO_PHASE,
  SAVES_PHASE,
  SHOOTING_PHASE,
  START_OF_COMBAT_PHASE,
  START_OF_HERO_PHASE,
  WARDS_PHASE,
  WOUND_ALLOCATION_PHASE,
} from 'types/phases'

const Artifacts = {
  "Backstabber's Blade": {
    effects: [
      {
        name: `Backstabber's Blade`,
        desc: `Once per battle, at the end of the combat phase, you can say the bearer will use the Backstabber's Blade. If you do so, pick 1 enemy unit within 1" of the bearer and roll a dice. On a 2+, that unit suffers D6 mortal wounds that cannot be negated.`,
        when: [END_OF_COMBAT_PHASE],
      },
    ],
  },
  'The Clammy Cowl': {
    effects: [
      {
        name: `The Clammy Cowl`,
        desc: `Subtract 1 from hit rolls for attacks that target the bearer.`, // updated for 2023
        when: [DURING_GAME],
      },
    ],
  },
  'Leering Gitshield': {
    effects: [
      {
        name: `Leering Gitshield`,
        desc: `Unmodified hit rolls of 1 for attacks that target the bearer cause 1 mortal wound to the attacking unit after all of that unit's attacks have been resolved. In addition, if the bearer is slain by an attack made by an enemy unit, subtract 1 from hit rolls for attacks made by that unit until the end of the battle.`,
        when: [DURING_GAME],
      },
    ],
  },
  'Loonstone Teefcaps': {
    effects: [
      {
        name: `Loonstone Teefcaps`,
        desc: `SQUIG HERO with mount or companion only. Improve the Rend characteristic of the bearer's Fang-filled Gob, Massive Fang-filled Gob or Huge Fang-filled Gobs by 1.`,
        when: [COMBAT_PHASE],
      },
    ],
  },
  'Moonface Mommet': {
    effects: [
      {
        name: `Moonface Mommet`,
        desc: `WIZARD only. At the start of the combat phase, pick 1 enemy unit within 12" of the bearer. Subtract 1 from save rolls for attacks that target that unit until the end of the phase.`,
        when: [START_OF_COMBAT_PHASE],
      },
      {
        name: `Moonface Mommet`,
        desc: `If active, subtract 1 from save rolls for attacks that target that unit until the end of the phase.`,
        when: [SAVES_PHASE],
      },
    ],
  },
  'Staff of Sneaky Stealin': {
    effects: [
      {
        name: `Staff of Sneaky Stealin'`,
        desc: `WIZARD only. Add 1 to casting rolls for the bearer. Each time the bearer unbinds a spell, add 1 to casting rolls for the bearer for the rest of the battle.`,
        when: [HERO_PHASE],
      },
    ],
  },
  'Totem of the Spider God': {
    effects: [
      {
        name: `Totem of the Spider God`,
        desc: `While other friendly SPIDERFANG units are wholly within 12" of the bearer, add 1 to the number of mortal wounds caused by the Spider Venom ability of those units if the unmodified hit roll was 6.

        Designer's Note: If a unit is affected by the Light of the Bad Moon, this artefact of power does not affect unmodified hit rolls of 5; it only affects unmodified hit rolls of 6.`,
        when: [COMBAT_PHASE],
      },
    ],
  },
  'Headdress of Many Eyes': {
    effects: [
      {
        name: `Headdress of Many Eyes`,
        desc: `SCUTTLEBOSS only. Only unmodified hit rolls of 5 or 6 successfully score a hit for attacks that target the bearer.`,
        when: [SHOOTING_PHASE, COMBAT_PHASE],
      },
    ],
  },
  "Nibbla's 'Itty Ring": {
    effects: [
      {
        name: `Nibbla's 'Itty Ring`,
        desc: `WIZARD only. Once per battle, at the start of your hero phase, you can say the bearer will call upon the ring's power. If you do so, roll a dice and add the result to casting rolls made by the bearer until the end of the phase.`,
        when: [START_OF_HERO_PHASE],
      },
    ],
  },

  'Glowy Howzit': {
    effects: [
      {
        name: `Glowy Howzit`,
        desc: `The bearer has a ward of 4+. At the end of each phase, if the bearer was allocated any wounds in that phase that were not negated, roll a dice. On a 1, the bearer eats the Glowy Howzit and it cannot be used again for the rest of the battle.`,
        when: [WARDS_PHASE, DURING_GAME],
      },
    ],
  },
  'Speaky-skull Fetish': {
    effects: [
      {
        name: `Speaky-skull Fetish`,
        desc: `At the start of your hero phase roll 3 dice. For each 6, you receive 1 extra command point. In addition, the bearer can issue the same command up to 2 times in the same phase (a command point is spent each time a command is issued by the bearer as normal).`,
        when: [START_OF_HERO_PHASE],
      },
    ],
  },
  'Pet Gribbly': {
    effects: [
      {
        name: `Pet Gribbly`,
        desc: `Add 1 to the bearer's Wounds characteristic. In addition, each time a wound is allocated to the bearer and not negated, roll a dice. On a 1, the Pet Gribbly is squished. When the Pet Gribbly is squished, the bearer becomes enraged for the rest of the battle. Add 1 to hit rolls and wound rolls for attacks made by the bearer while they are enraged.`,
        when: [WOUND_ALLOCATION_PHASE],
      },
    ],
  },
}

export default tagAs(Artifacts, 'artifact')

import { tagAs } from 'factions/metatagger'
import {
  DURING_GAME,
  HERO_PHASE,
  START_OF_CHARGE_PHASE,
  START_OF_COMBAT_PHASE,
  START_OF_SHOOTING_PHASE,
} from 'types/phases'

const CommandAbilities = {
  'The Unstoppable Feast': {
    effects: [
      {
        name: `The Unstoppable Feast`,
        desc: `You can use this command ability at the start of the combat phase. If you do so, pick 1 friendly MEATFIST HERO. Until the end of that phase, add 1 to the Attacks characteristic of friendly MEATFIST OGOR GLUTTONS units' Gulping Bite while they are wholly within 18" of that HERO. You cannot pick the same unit to benefit from this command ability more than once per combat phase.`,
        when: [START_OF_COMBAT_PHASE],
      },
    ],
  },
  Bloodbath: {
    effects: [
      {
        name: `Bloodbath`,
        desc: `You can use this command ability at the start of the combat phase. If you do so, pick 1 friendly BLOODGULLET BUTCHER. Until the end of that phase, you can reroll wound rolls for attacks made with melee weapons by friendly BLOODGULLET OGOR GLUTTONS units that are wholly within 12" of that BLOODGULLET BUTCHER.`,
        when: [START_OF_COMBAT_PHASE],
      },
    ],
  },
  'Thunderous Salvo': {
    effects: [
      {
        name: `Thunderous Salvo`,
        desc: `You can use this command ability at the start of your shooting phase. If you do so, pick 1 friendly UNDERGUTS HERO. Until the end of that phase, add 1 to the Attacks characteristic of missile weapons used by friendly UNDERGUTS IRONBLASTER units wholly within 12" of that UNDERGUTS HERO. You can only use this command ability once per shooting phase.`,
        when: [START_OF_SHOOTING_PHASE],
      },
    ],
  },
  'Dig Deep your Heels!': {
    effects: [
      {
        name: `Dig Deep your Heels!`,
        desc: `You can use this command ability at the start of any phase. If you do so, pick 1 friendly BOULDERHEAD HERO that has a mount. Until the end of that phase, use the top row on that unit's damage table, regardless of how many wounds it has suffered.`,
        when: [DURING_GAME],
      },
    ],
  },
  'Rip and Tear': {
    effects: [
      {
        name: `Rip and Tear`,
        desc: `You can use this command ability at the start of the combat phase. If you do so, pick 1 enemy unit with 1 or more wounds allocated to it that is within 6" of a THUNDERBELLIES HERO. Until the end of the phase, you can reroll wound rolls for attacks made by friendly THUNDERBELLIES MOURNFANG PACK units that target that enemy unit.`,
        when: [START_OF_COMBAT_PHASE],
      },
    ],
  },
  'Howl of the Wild': {
    effects: [
      {
        name: `Howl of the Wild`,
        desc: `You can use this command ability at the start of the combat phase. If you do so, pick 1 friendly WINTERBITE HERO. Friendly WINTERBITE FROST SABRES units and WINTERBITE ICEFALL YHETEES units wholly within 12" of that WINTERBITE HERO can fight at the start of that combat phase. These units cannot fight again in that combat phase unless an ability or spell allows them to fight more than once.`,
        when: [START_OF_COMBAT_PHASE],
      },
    ],
  },
  'Bellowing Voice': {
    effects: [
      {
        name: `Bellowing Voice`,
        desc: `You can use this command ability at the start of your charge phase. If you do so, pick 1 friendly model with this command ability. Until the end of that phase, you can reroll charge rolls for friendly Beastclaw Raiders units that are wholly within 12" of that model when the charge roll is made.`,
        when: [START_OF_CHARGE_PHASE],
      },
    ],
  },
  'Line-breakers': {
    effects: [
      {
        name: `Line-breakers`,
        desc: `You can use this command ability at the start of the combat phase. If you do so, pick 1 friendly Mournfang Pack unit that made a charge move in the same turn and is wholly within 12" of a model with this command ability. If you use that unit's Mournfang Charge ability in that phase, add 2 to the damage inflicted by attacks made with that unit's Tusks instead of 1.`,
        when: [START_OF_COMBAT_PHASE],
      },
    ],
  },
  'Lead the Skal': {
    effects: [
      {
        name: `Lead the Skal`,
        desc: `You can use this command ability at the start of the combat phase. If you do so, pick 1 friendly Frost Sabres unit that is wholly within 12" of a friendly model with this command ability. Until the end of that phase, add 1 to the Attacks characteristics of that unit's melee weapons.`,
        when: [START_OF_COMBAT_PHASE],
      },
    ],
  },
  'Bully of the First Degree': {
    effects: [
      {
        name: `Bully of the First Degree`,
        desc: `You can use this command ability in your hero phase. If you do so, pick 1 friendly Gutbusters unit within 3" of a friendly model with this command ability. That unit suffers D3 mortal wounds, but you do not have to take battleshock tests for that unit for the rest of the battle.`,
        when: [HERO_PHASE],
      },
    ],
  },
}

export default tagAs(CommandAbilities, 'command_ability')

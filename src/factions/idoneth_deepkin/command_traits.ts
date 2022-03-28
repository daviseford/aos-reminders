import { tagAs } from 'factions/metatagger'
import {
  BATTLESHOCK_PHASE,
  COMBAT_PHASE,
  DURING_GAME,
  END_OF_BATTLESHOCK_PHASE,
  END_OF_CHARGE_PHASE,
  HERO_PHASE,
  SHOOTING_PHASE,
  START_OF_COMBAT_PHASE,
} from 'types/phases'

const CommandTraits = {
  'Merciless Raider': {
    effects: [
      {
        name: `Merciless Raider`,
        desc: `If the unmodified hit roll for an attack made by this general is 6, that attack automatically wounds the target (do not make a wound roll).`,
        when: [COMBAT_PHASE, SHOOTING_PHASE],
      },
    ],
  },
  'Hunter of Souls': {
    effects: [
      {
        name: `Hunter of Souls`,
        desc: `At the start of the combat phase, if this general is within 3" of an enemy HERO or enemy unit champion, you can roll a dice. On a 3+, that enemy HERO or unit champion suffers D3 mortal wounds.`,
        when: [START_OF_COMBAT_PHASE],
      },
    ],
  },
  'Unstoppable Fury': {
    effects: [
      {
        name: `Unstoppable Fury`,
        desc: `While this general is affected by the High Tide ability from the Tides of Death table (pg 64), for each enemy unit within 3" of them during the combat phase, add 2 to the Attacks characteristic of their melee weapons until the end of that phase.`,
        when: [COMBAT_PHASE],
      },
    ],
  },
  'Born From Agony': {
    effects: [
      {
        name: `Born From Agony`,
        desc: `At the end of the battleshock phase, you can roll a dice for this general. On a 6, heal all wounds allocated to this general.`,
        when: [END_OF_BATTLESHOCK_PHASE],
      },
    ],
  },
  'Teachings of the Turscoll': {
    effects: [
      {
        name: `Teachings of the Turscoll`,
        desc: `If this general is on the battlefield at the start of the first battle round, before priority is determined, you can declare that the Tides of Death table will be reversed for your army. If you do so, the Ebb Tide ability applies in the first battle round, the High Tide ability applies in the second battle round, the Flood Tide ability applies in the third battle round, and the Low Tide ability applies in the fourth battle round, From the fifth battle round, the four Tides of Death steps are repeated in this order, starting with Ebb Tide.`,
        when: [DURING_GAME],
      },
    ],
  },
  'Lord of Storm and Sea': {
    effects: [
      {
        name: `Lord of Storm and Sea`,
        desc: `Do not take battleshock tests for friendly IDONETH DEEPKIN units wholly within 12" of this general.`,
        when: [BATTLESHOCK_PHASE],
      },
    ],
  },
  'Ancient Pride': {
    effects: [
      {
        name: `Ancient Pride`,
        desc: `If the unmodified hit roll for an attack made with a melee weapon that targets this general is 1 or 2, that attack fails and the attack sequence ends.`,
        when: [COMBAT_PHASE],
      },
    ],
  },
  'Nightmare Legacy': {
    effects: [
      {
        name: `Nightmare Legacy`,
        desc: `At the end of the charge phase, you can pick this general to carry out a monstrous rampage even though it is not a MONSTER.`,
        when: [END_OF_CHARGE_PHASE],
      },
    ],
  },
  'Endless Sea Storm': {
    effects: [
      {
        name: `Endless Sea Storm`,
        desc: `If this general successfully casts a an unmodified casting roll of 7+, this general can attempt to cast 1 extra spell in that phase.`,
        when: [HERO_PHASE],
      },
    ],
  },
  // Ionrach Enclave
  // 'Emissary of the Deep Places': {
  //   effects: [
  //     {
  //       name: `Emissary of the Deep Places`,
  //       desc: `Allied units in an Ionrach army are treated as having the Tides of Death battle trait and can therefore use abilities from the Tides of Death table each battle round.`,
  //       when: [DURING_GAME],
  //     },
  //   ],
  // },
}

export default tagAs(CommandTraits, 'command_trait')

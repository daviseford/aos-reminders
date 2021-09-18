import { tagAs } from 'factions/metatagger'
import { BATTLESHOCK_PHASE, COMBAT_PHASE, DURING_GAME, MOVEMENT_PHASE, START_OF_GAME } from 'types/phases'

const BonesplitterzCommandTraits = {
  'Killa Instinkt': {
    effects: [
      {
        name: `Killa Instinkt`,
        desc: `If the unmodified hit roll for an attack made with a melee weapon by this general is 6, that attack causes 1 mortal wound to the target in addition to any damage it inflicts.`,
        when: [COMBAT_PHASE],
      },
    ],
  },
  'Great Hunter': {
    effects: [
      {
        name: `Great Hunter`,
        desc: `If this general is part of your army, when you use the Tireless Trackers battle trait, you can move eligible units up to 8" instead of 5".`,
        when: [START_OF_GAME],
      },
    ],
  },
  'One Wiv Da Beast': {
    effects: [
      {
        name: `One Wiv Da Beast`,
        desc: `You can pick 1 extra spell for this general from the Lore of the Savage Beast (pg 91).`,
        when: [DURING_GAME],
      },
    ],
  },
  'Voice of Da Great Green God': {
    effects: [
      {
        name: `Voice of Da Great Green God`,
        desc: `When this general issues a command, it can be received by a friendly unit wholly within 24" of them instead of 18".`,
        when: [DURING_GAME],
      },
    ],
  },
  'Monster Killa': {
    effects: [
      {
        name: `Monster Killa`,
        desc: `In the combat phase, after this general has fought for the first time in that phase, they can fight for a second time if they are within 3" of an enemy MONSTER.`,
        when: [COMBAT_PHASE],
      },
    ],
  },
  'A Right Monster': {
    effects: [
      {
        name: `A Right Monster`,
        desc: `Enemy units within 12" of this general subtract 1 from their Bravery characteristic.`,
        when: [BATTLESHOCK_PHASE],
      },
    ],
  },
  'Pure-bred War Boar': {
    effects: [
      {
        name: `Pure-bred War Boar`,
        desc: `Add 2" to the move characteristic of the bearer. Also add 1 to hit and wound rolls for the boar attacks.`,
        when: [MOVEMENT_PHASE, COMBAT_PHASE],
      },
    ],
  },

  // Removed in 2021
  // 'Waaagh!-monger': {
  //   effects: [
  //     {
  //       name: `Waaagh!-monger`,
  //       desc: `If your general is alive, roll a D6 at the start of the hero phase, on a 4+ you get 1 CP.`,
  //       when: [START_OF_HERO_PHASE],
  //     },
  //   ],
  // },
  // "Dead Kunnin'": {
  //   effects: [
  //     {
  //       name: `Dead Kunnin'`,
  //       desc: `At the start of the game, gain an additional D3 command points.`,
  //       when: [START_OF_GAME],
  //     },
  //   ],
  // },
  // 'Master of the Weird': {
  //   effects: [
  //     {
  //       name: `Master of the Weird`,
  //       desc: `This general has +1 to cast, unbind, and dispell attempts.`,
  //       when: [HERO_PHASE],
  //     },
  //   ],
  // },
  // 'Fuelled by the Spirits': {
  //   effects: [
  //     {
  //       name: `Fuelled by the Spirits`,
  //       desc: `Pick 1 extra spell from the Lore of the Savage Beast table. This general may also cast 1 additional spell.`,
  //       when: [HERO_PHASE],
  //     },
  //   ],
  // },
}

export default tagAs(BonesplitterzCommandTraits, 'command_trait')

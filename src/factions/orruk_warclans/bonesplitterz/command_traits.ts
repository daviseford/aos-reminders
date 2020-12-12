import { tagAs } from 'factions/metatagger'
import {
  BATTLESHOCK_PHASE,
  COMBAT_PHASE,
  DURING_GAME,
  HERO_PHASE,
  MOVEMENT_PHASE,
  START_OF_GAME,
  START_OF_HERO_PHASE,
} from 'types/phases'

// Store Command Traits here. You can add them to units, abilties, flavors, and subfactions later.
const BonesplitterzCommandTraits = {
  'Killa Instinkt': {
    effects: [
      {
        name: `Killa Instinkt`,
        desc: `Attacks with an unmodified 6 wound roll do 1 mortal wound in addition to normal damage.`,
        when: [COMBAT_PHASE],
      },
    ],
  },
  'Waaagh!-monger': {
    effects: [
      {
        name: `Waaagh!-monger`,
        desc: `If your general is alive, roll a D6 at the start of the hero phase, on a 4+ you get 1 CP.`,
        when: [START_OF_HERO_PHASE],
      },
    ],
  },
  'Great Hunter': {
    effects: [
      {
        name: `Great Hunter`,
        desc: `When using the Tireless Trackers trait, move up to 8" instead of 5" for all eligible units at the start of the game.`,
        when: [START_OF_GAME],
      },
    ],
  },
  'Power of the Beast': {
    effects: [
      {
        name: `Power of the Beast`,
        desc: `Add 2 to the wounds characteristic of this general.`,
        when: [DURING_GAME],
      },
    ],
  },
  'Voice of da Gods': {
    effects: [
      {
        name: `Voice of da Gods`,
        desc: `Add +2 to the bravery for friendly units wholly within 18".`,
        when: [BATTLESHOCK_PHASE],
      },
    ],
  },
  'Monster Killa': {
    effects: [
      {
        name: `Monster Killa`,
        desc: `If the general has fought for the first time in the combat phase and is within 3" of an enemy MONSTER, it can immediately pile in and attack for a second time.`,
        when: [COMBAT_PHASE],
      },
    ],
  },
  "Dead Kunnin'": {
    effects: [
      {
        name: `Dead Kunnin'`,
        desc: `At the start of the game, gain an additional D3 command points.`,
        when: [START_OF_GAME],
      },
    ],
  },
  'Master of the Weird': {
    effects: [
      {
        name: `Master of the Weird`,
        desc: `This general has +1 to cast, unbind, and dispell attempts.`,
        when: [HERO_PHASE],
      },
    ],
  },
  'Fuelled by the Spirits': {
    effects: [
      {
        name: `Fuelled by the Spirits`,
        desc: `Pick 1 extra spell from the Lore of the Savage Beast table. This general may also cast 1 additional spell.`,
        when: [HERO_PHASE],
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
}

export default tagAs(BonesplitterzCommandTraits, 'command_trait')

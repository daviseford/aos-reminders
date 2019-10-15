import { TTraits } from 'types/army'
import {
  BATTLESHOCK_PHASE,
  COMBAT_PHASE,
  DURING_GAME,
  HERO_PHASE,
  START_OF_HERO_PHASE,
  START_OF_GAME,
} from 'types/phases'

const CommandTraits: TTraits = [
  {
    name: `Killa Instinkt`,
    effects: [
      {
        name: `Killa Instinkt`,
        desc: `Attacks with an unmodified 6 wound roll do 1 mortal wound in addition to normal damage.`,
        when: [COMBAT_PHASE],
      },
    ],
  },
  {
    name: `Waaagh!-monger`,
    effects: [
      {
        name: `Waaagh!-monger`,
        desc: `If your general is alive, roll a dice at the start of the hero phase, on a 4+ you get 1 CP.`,
        when: [START_OF_HERO_PHASE],
      },
    ],
  },
  {
    name: `Great Hunter`,
    effects: [
      {
        name: `Great Hunter`,
        desc: `When using the Tireless Trackers trait, move up to 8" instead of 5" for all eligible units at the start of the game.`,
        when: [START_OF_GAME],
      },
    ],
  },
  {
    name: `Power of the Beast`,
    effects: [
      {
        name: `Power of the Beast`,
        desc: `Add 2 to the wounds characteristic of this general.`,
        when: [DURING_GAME],
      },
    ],
  },
  {
    name: `Voice of da Gods`,
    effects: [
      {
        name: `Voice of da Gods`,
        desc: `Add +2 to the bravery for friendly units wholly within 18".`,
        when: [BATTLESHOCK_PHASE],
      },
    ],
  },
  {
    name: `Monster Killa`,
    effects: [
      {
        name: `Monster Killa`,
        desc: `If the general has fought for the first time in the combat phase and is within 3" of an enemy Monster, it can immediately pile in and attack for a second time.`,
        when: [COMBAT_PHASE],
      },
    ],
  },
  {
    name: `Dead Kunnin'`,
    effects: [
      {
        name: `Dead Kunnin'`,
        desc: `At the start of the game, gain an additional D3 command points.`,
        when: [START_OF_GAME],
      },
    ],
  },
  {
    name: `Master of the Weird`,
    effects: [
      {
        name: `Master of the Weird`,
        desc: `This general has +1 to cast, unbind, and dispell attempts.`,
        when: [HERO_PHASE],
      },
    ],
  },
  {
    name: `Fuelled by the Spirits`,
    effects: [
      {
        name: `Fuelled by the Spirits`,
        desc: `Pick 1 extra spell from the Lore of the Savage Beast table. This general may also cast 1 addtional spell.`,
        when: [HERO_PHASE],
      },
    ],
  },
]

export default CommandTraits

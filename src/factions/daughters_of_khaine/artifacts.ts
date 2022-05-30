import { tagAs } from 'factions/metatagger'
import {
  COMBAT_PHASE,
  HERO_PHASE,
  MOVEMENT_PHASE,
  START_OF_HERO_PHASE,
  WOUND_ALLOCATION_PHASE,
} from 'types/phases'

const Artifacts = {
  'Crown of Woe': {
    effects: [
      {
        name: `Crown of Woe`,
        desc: `Enemy units cannot receive the Rally or Inspiring Presence commands while they are within 9" of the bearer. In addition, if any enemy models are slain by wounds caused by the bearer's attacks, increase the range of this ability to 15" for the remainder of the battle.`,
        when: [START_OF_HERO_PHASE, WOUND_ALLOCATION_PHASE],
      },
    ],
  },
  'Crone Blade': {
    effects: [
      {
        name: `Crone Blade`,
        desc: `Pick 1 of the bearer's melee weapons. If the unmodified hit roll for an attack made with that weapon is a 6, you can heal 1 wound allocated to the bearer after all of the bearer's attacks have been resolved.`,
        when: [COMBAT_PHASE],
      },
    ],
  },
  'Bloodbane Venom': {
    effects: [
      {
        name: `Bloodbane Venom`,
        desc: `Pick 1 of the bearer's melee weapons. After the bearer fights, if any wounds caused by attacks made with that weapon in that phase were allocated to an enemy model and that enemy model has not been slain, roll a dice. If the roll is equal to or greater than that model's Wounds characteristic, that model is slain.`,
        when: [COMBAT_PHASE],
      },
    ],
  },
  'Shadow Stone': {
    effects: [
      {
        name: `Shadow Stone`,
        desc: `Add 1 to casting rolls for the bearer when they attempt to cast a spell from the Lore of Shadows (pg 70).`,
        when: [HERO_PHASE],
      },
    ],
  },
  'Sevenfold Shadow': {
    effects: [
      {
        name: `Sevenfold Shadow`,
        desc: `Once per battle, in your movement phase, instead of making a normal move with the bearer, you can remove the bearer from the battlefield and set them up again anywhere on the battlefield more than 9" from all enemy units.`,
        when: [MOVEMENT_PHASE],
      },
    ],
  },
  'Crystal Heart': {
    effects: [
      {
        name: `Crystal Heart`,
        desc: `When the bearer attempts to cast a spell that summons an endless spell, the range of that spell is doubled.`,
        when: [HERO_PHASE],
      },
    ],
  },
  'Blood Sigil': {
    effects: [
      {
        name: `Blood Sigil`,
        desc: `You can pick 1 extra prayer for the bearer from the Prayers of the Khainite Cult (pg 71).`,
        when: [HERO_PHASE],
      },
    ],
  },
  'Rune of Khaine': {
    effects: [
      {
        name: `Rune of Khaine`,
        desc: `The first time the bearer is slain, the bearer can fight before they are removed from play.`,
        when: [WOUND_ALLOCATION_PHASE],
      },
    ],
  },
  'Khainite Pendant': {
    effects: [
      {
        name: `Khainite Pendant`,
        desc: `Once per battle, before the bearer chants a prayer, you can say that they will call upon the power of the pendant. If you do so, that prayer is automatically answered (do not make a chanting roll).`,
        when: [HERO_PHASE],
      },
    ],
  },
}

export default tagAs(Artifacts, 'artifact')

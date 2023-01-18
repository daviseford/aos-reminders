import { tagAs } from 'factions/metatagger'
import {
  CHARGE_PHASE,
  COMBAT_PHASE,
  DURING_GAME,
  END_OF_COMBAT_PHASE,
  MOVEMENT_PHASE,
  SHOOTING_PHASE,
  WARDS_PHASE,
} from 'types/phases'

const Artifacts = {
  //GUTBUSTERS HERO only.
  'Gruesome Trophy Rack': {
    effects: [
      {
        name: `Gruesome Trophy Rack`,
        desc: `Add 1 to hit rolls for attacks made by friendly GUTBUSTERS units wholly within 12" of the bearer that target a MONSTER or HERO.`,
        when: [COMBAT_PHASE, SHOOTING_PHASE],
      },
    ],
  },
  'Splatter-cleaver': {
    effects: [
      {
        name: `Splatter-cleaver`,
        desc: `Pick 1 of the bearer's melee weapons. At the end of the combat phase, if any wounds inflicted by that weapon in that phase were allocated to an enemy unit, you can heal D3 wounds allocated to each friendly OGOR unit wholly within 12" of the bearer (roll separately for each unit).`,
        when: [END_OF_COMBAT_PHASE],
      },
    ],
  },
  'The Fang of Ghur': {
    effects: [
      {
        name: `The Fang of Ghur`,
        desc: `TYRANT only. The bearer's Beastskewer Glaive has a Rend characteristic of -3 instead of -1.`,
        when: [COMBAT_PHASE],
      },
    ],
  },
  'Flask of Stonehorn Blood': {
    effects: [
      {
        name: `Flask of Stonehorn Blood`,
        desc: `Once per battle, at the start of a phase, you can say that the bearer will drink this potion. The bearer has a ward of 3+ until the end of that phase.`,
        when: [DURING_GAME, WARDS_PHASE],
      },
    ],
  },

  //BEASTCLAW RAIDERS HERO only,
  'Elixir of Frostwyrm': {
    effects: [
      {
        name: `Elixir of Frostwyrm`,
        desc: `Once per battle, in your shooting phase, you can pick 1 enemy unit within 6" of the bearer and roll a dice. On a 2+, that unit suffers D6 mortal wounds.`,
        when: [SHOOTING_PHASE],
      },
    ],
  },
  'Frost-talon Shardbolts': {
    effects: [
      {
        name: `Frost-talon Shardbolts`,
        desc: `If the unmodified hit roll for an attack made with the bearer's Hunter's Crossbow is 6, that attack causes D3 mortal wounds to the target in addition to any damage it inflicts.`,
        when: [SHOOTING_PHASE],
      },
    ],
  },
  'Carvalox Flank': {
    effects: [
      {
        name: `Carvalox Flank`,
        desc: `Friendly ICEFALL YHETEE units wholly within 12" of the bearer at the start of the movement phase can move an extra 2" when they make a normal move during that phase.`,
        when: [MOVEMENT_PHASE],
      },
    ],
  },
  'The Seat of Alvagr': {
    effects: [
      {
        name: `The Seat of Alvagr`,
        desc: `Once per battle, in the charge phase, you can carry out a second monstrous rampage with the bearer. The second monstrous rampage cannot be monstrous rampage you have already carried out in that phase.`,
        when: [CHARGE_PHASE],
      },
    ],
  },
}

export default tagAs(Artifacts, 'artifact')

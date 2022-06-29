import { tagAs } from 'factions/metatagger'
import { COMBAT_PHASE, DURING_GAME, END_OF_CHARGE_PHASE, HERO_PHASE, WARDS_PHASE } from 'types/phases'

const OrrukWarclanMountTraits = {
  "Tough 'Un": {
    effects: [
      {
        name: `Tough 'Un`,
        desc: `MONSTER only. Unless this model has a number of wounds allocated to it that exceeds half its Wounds characteristic, use the top row on its damage table, regardless of how many wounds it has suffered.`,
        when: [DURING_GAME],
      },
    ],
  },
  "Fast 'Un": {
    effects: [
      {
        name: `Fast 'Un`,
        desc: `Once per battle, in your hero phase, this model can make a normal move.`,
        when: [HERO_PHASE],
      },
    ],
  },
  "Mean 'Un": {
    effects: [
      {
        name: `Mean 'Un`,
        desc: `MONSTER only. When you carry out the Stomp monstrous rampage with this model, the enemy unit you pick suffers D6 mortal wounds on a 2+ instead of D3.`,
        when: [END_OF_CHARGE_PHASE],
      },
    ],
  },
  "Loud 'Un": {
    effects: [
      {
        name: `Loud 'Un`,
        desc: `MONSTER only. When you carry out the Roar monstrous rampage with this model, pick all enemy units within 3" of this model instead of 1.`,
        when: [END_OF_CHARGE_PHASE],
      },
    ],
  },
  "Weird 'Un": {
    effects: [
      {
        name: `Weird 'Un`,
        desc: `This model has a ward of 4+ against mortal wounds caused by spells and the abilities of endless spells.`,
        when: [WARDS_PHASE, HERO_PHASE],
      },
    ],
  },
  "Smelly 'Un": {
    effects: [
      {
        name: `Smelly 'Un`,
        desc: `Subtract 1 from hit rolls for attacks made with melee weapons that target this model if it has not made a charge move in the same turn.`,
        when: [COMBAT_PHASE],
      },
    ],
  },
}

export default tagAs(OrrukWarclanMountTraits, 'mount_trait')

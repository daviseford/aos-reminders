import { TItemDescriptions } from 'factions/factionTypes'
import { tagAs } from 'factions/metatagger'
import {
  CHARGE_PHASE,
  COMBAT_PHASE,
  DURING_SETUP,
  HERO_PHASE,
  MOVEMENT_PHASE,
  SHOOTING_PHASE,
  TURN_ONE_END_OF_MOVEMENT_PHASE,
} from 'types/phases'

const MountTraits = {
  'Gruesome Bite': {
    effects: [
      {
        name: `Gruesome Bite`,
        desc: `Add 1 to the Attacks characteristic of this unit's Fanged Maw.`,
        when: [COMBAT_PHASE],
      },
    ],
  },

  'Baneful Breath': {
    effects: [
      {
        name: `Baneful Breath`,
        desc: `Improve the Rend characteristic of this unit's Pestilential Breath by 1.`,
        when: [SHOOTING_PHASE],
      },
    ],
  },
  'Horribly Resilient': {
    effects: [
      {
        name: `Horribly Resilient`,
        desc: `This unit's Royal Blood ability heals up to 2D3 wounds instead of up to D3 wounds.`,
        when: [HERO_PHASE],
      },
    ],
  },

  'Death From The Skies': {
    effects: [
      {
        name: `Death From The Skies`,
        desc: `Instead of setting up this unit on the battlefield, you can place it to one side and say that it is soaring in the skies in reserve. If you do so, at the end of your first movement phase, you must set up this unit on the battlefield more than 9" from all enemy units.`,
        when: [DURING_SETUP, TURN_ONE_END_OF_MOVEMENT_PHASE],
      },
    ],
  },
  'Venerated Zombie Dragon': {
    effects: [
      {
        name: `Venerated Zombie Dragon`,
        desc: `Add 1 to hit rolls for friendly FLESH-EATER COURTS MONSTERs while they are wholly within 12" of this unit.`,
        when: [COMBAT_PHASE, SHOOTING_PHASE],
      },
    ],
  },
  "Morbheg's Swiftness": {
    effects: [
      {
        name: `Morbheg's Swiftness`,
        desc: `This unit can retreat and still charge later in the turn.`,
        when: [MOVEMENT_PHASE, CHARGE_PHASE],
      },
    ],
  },
} satisfies TItemDescriptions

export default tagAs(MountTraits, 'mount_trait')

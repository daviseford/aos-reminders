import { tagAs } from 'factions/metatagger'
import {
  CHARGE_PHASE,
  COMBAT_PHASE,
  SHOOTING_PHASE,
  START_OF_COMBAT_PHASE,
  START_OF_HERO_PHASE,
  WOUND_ALLOCATION_PHASE,
} from 'types/phases'

const MountTraits = {
  Fleshgreed: {
    effects: [
      {
        name: `Fleshgreed`,
        desc: `At the start of each hero phase, if this model is eating, you can heal D3 wound allocated to it.`,
        when: [START_OF_HERO_PHASE],
      },
    ],
  },
  'Rimefrost Hide': {
    effects: [
      {
        name: `Rimefrost Hide`,
        desc: `This unit has a ward of 5+.`,
        when: [WOUND_ALLOCATION_PHASE],
      },
    ],
  },
  Matriarch: {
    effects: [
      {
        name: `Matriarch`,
        desc: `Add 1 to charge rolls for friendly THUNDERTUSKS wholly within 12" of this model.`,
        when: [CHARGE_PHASE],
      },
    ],
  },
  Metalcruncher: {
    effects: [
      {
        name: `Metalcruncher`,
        desc: `At the start of the combat phase, pick 1 enemy WAR MACHINE, or 1 enemy unit with a Save characteristic of 3+ or 2+, that is within 3" of this model. That enemy unit immediately suffers D6 mortal wounds.`,
        when: [START_OF_COMBAT_PHASE],
      },
    ],
  },
  'Belligerent Charger': {
    effects: [
      {
        name: `Belligerent Charger`,
        desc: `Charge rolls for this unit of less than 7 are treated as 7 for the purposes of the Trampling Charge battle trait.`,
        when: [CHARGE_PHASE],
      },
    ],
  },
  'Rockmane Elder': {
    effects: [
      {
        name: `Rockmane Elder`,
        desc: `Subtract 1 from wound rolls for attacks tha target this unit.`,
        when: [SHOOTING_PHASE, COMBAT_PHASE],
      },
    ],
  },
}

export default tagAs(MountTraits, 'mount_trait')

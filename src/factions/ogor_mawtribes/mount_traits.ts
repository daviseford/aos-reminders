import { tagAs } from 'factions/metatagger'
import {
  CHARGE_PHASE,
  DURING_GAME,
  SAVES_PHASE,
  START_OF_COMBAT_PHASE,
  START_OF_HERO_PHASE,
} from 'types/phases'

const MountTraits = {
  'Fleet of Hoof': {
    effects: [
      {
        name: `Fleet of Hoof`,
        desc: 'You can reroll one or both of the dice when making charge rolls for this model.',
        when: [CHARGE_PHASE],
      },
    ],
  },
  Fleshgreed: {
    effects: [
      {
        name: `Fleshgreed`,
        desc: `At the start of each hero phase, if this model is eating, you can heal 1 wound allocated to this model.`,
        when: [START_OF_HERO_PHASE],
      },
    ],
  },
  'Rimefrost Hide': {
    effects: [
      {
        name: `Rimefrost Hide`,
        desc: `Worsen the Rend characteristic of melee weapons that target this model by 1 (to a minimum of '-').`,
        when: [SAVES_PHASE],
      },
    ],
  },
  Gvarnak: {
    effects: [
      {
        name: `Gvarnak`,
        desc: "Add 1 to this model's Wounds characteristic.",
        when: [DURING_GAME],
      },
    ],
  },
  Matriarch: {
    effects: [
      {
        name: `Matriarch`,
        desc: `Add 1 to charge rolls for friendly THUNDERTUSKS while they are wholly within 12" of this model.`,
        when: [CHARGE_PHASE],
      },
    ],
  },
  'Alvagr Ancient': {
    effects: [
      {
        name: `Alvagr Ancient`,
        desc: `If this model has not made a charge move in the same turn, enemy units that are within 3" of this model at the start of the combat phase fight at the end of that combat phase.`,
        when: [START_OF_COMBAT_PHASE],
      },
    ],
  },
}

export default tagAs(MountTraits, 'mount_trait')

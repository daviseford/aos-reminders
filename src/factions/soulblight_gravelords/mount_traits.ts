import { tagAs } from 'factions/metatagger'
import {
  CHARGE_PHASE,
  HERO_PHASE,
  MOVEMENT_PHASE,
  SHOOTING_PHASE,
  START_OF_COMBAT_PHASE,
  START_OF_HERO_PHASE,
} from 'types/phases'
import rule_sources from './rule_sources'

const MountTraits = {
  // Avengorii Dynasty (Cursed Mutations)
  'Maddening Hunger (Cursed Mutation)': {
    effects: [
      {
        name: `Maddening Hunger (Cursed Mutation)`,
        desc: `Once per turn, at the start of the combat phase, you can pick 1 enemy model with a Wounds characteristic of 1 that is within 3" of this model. If you do so, that enemy model is slain and you can heal 1 wound allocated to this model.`,
        when: [START_OF_COMBAT_PHASE],
      },
    ],
  },
  'Urges of Atrocity (Cursed Mutation)': {
    effects: [
      {
        name: `Urges of Atrocity (Cursed Mutation)`,
        desc: `Once per battle, this model can run and still charge later in the same turn.`,
        when: [MOVEMENT_PHASE, CHARGE_PHASE],
      },
    ],
  },
  'Nullblood Construct (Cursed Mutation)': {
    effects: [
      {
        name: `Nullblood Construct (Cursed Mutation)`,
        desc: `Reroll successful casting rolls for enemy WIZARDS within 9" of this model.`,
        when: [HERO_PHASE],
      },
    ],
  },

  'Locus of Death': {
    effects: [
      {
        name: `Locus of Death`,
        desc: `When you use the Deathly Invocation ability, if you pick this unit as the HERO that determines the number of units affected by the ability, then you can add 1 to the number of units that are affected.`,
        when: [START_OF_HERO_PHASE],
        rule_sources: [rule_sources.WHITE_DWARF_DECEMBER_2021],
      },
    ],
  },
  'Foetid Miasma': {
    effects: [
      {
        name: `Foetid Miasma`,
        desc: `When this unit attacks with its Pestilential Breath, you can reroll the dice that determines the Damage characteristic for that attack.`,
        when: [SHOOTING_PHASE],
        rule_sources: [rule_sources.WHITE_DWARF_DECEMBER_2021],
      },
    ],
  },
}

// Always export using tagAs
export default tagAs(MountTraits, 'mount_trait')

import { tagAs } from 'factions/metatagger'
import { CHARGE_PHASE, HERO_PHASE, MOVEMENT_PHASE, START_OF_COMBAT_PHASE } from 'types/phases'

// Store Mount Traits here. You can add them to units, abilties, flavors, and subfactions later.
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
}

// Always export using tagAs
export default tagAs(MountTraits, 'mount_trait')

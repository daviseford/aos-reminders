import { tagAs } from 'factions/metatagger'
import { BATTLESHOCK_PHASE, DURING_GAME, HERO_PHASE } from 'types/phases'

// Store Command Traits here. You can add them to units, abilties, flavors, and subfactions later.
const CommandTraits = {
  'Raven Priest': {
    effects: [
      {
        name: `Raven Priest`,
        desc: `This general gains the Priest keyword. If the model is already a priest, it knows two Prayers of Morrda instead of 1.`,
        when: [HERO_PHASE],
      },
    ],
  },
  'Solemn Soul': {
    effects: [
      {
        name: `Solemn Soul`,
        desc: `Do not take battleshock tests for friendly Lethisian Defender units wholly within 12" of this general.`,
        when: [BATTLESHOCK_PHASE],
      },
    ],
  },
  'Sinister Aura': {
    effects: [
      {
        name: `Sinister Aura`,
        desc: `Add 1 to the general's wounds characteristic. Subtract 1 from the bravery characteristic of enemy units within 6" of this general.`,
        when: [DURING_GAME],
      },
    ],
  },
}

// Always export using tagAs
export default tagAs(CommandTraits, 'command_trait')

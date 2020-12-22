import { tagAs } from 'factions/metatagger'
import { BATTLESHOCK_PHASE } from 'types/phases'

const ChaosCommandAbilities = {
  'Lord of the Monstrous Host': {
    effects: [
      {
        name: `Lord of the Monstrous Host`,
        desc: `If the Troggoth King uses this ability, then until your next hero phase all friendly Chaos Troggoths and Chaos Ogors may use this model's Bravery characteristic instead of their own.`,
        when: [BATTLESHOCK_PHASE],
      },
    ],
  },
}

export default tagAs(ChaosCommandAbilities, 'command_ability')

import { tagAs } from 'factions/metatagger'
import { BATTLESHOCK_PHASE, END_OF_BATTLESHOCK_PHASE } from 'types/phases'

// Store Command Abilities here. You can add them to units, abilties, flavors, and subfactions later.
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
  // Legion of the First Prince Flavor
  'The Shadow Legion': {
    effects: [
      {
        name: `The Shadow Legion`,
        desc: `Once per turn you can use this ability if Be'lakor is your general an on the battlefield. Roll a D6 for each friendly Legion of the First Prince Bloodletters, Plaguebearers, Daemonettes, and Horrors of Tzeentch unit on the battlefield. On a 3+ you can return D3 slain models to that unit.`,
        when: [END_OF_BATTLESHOCK_PHASE],
      },
    ],
  },
}

// Always export using tagAs
export default tagAs(ChaosCommandAbilities, 'command_ability')

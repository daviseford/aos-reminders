import { keyPicker, tagAs } from 'factions/metatagger'
import { BATTLESHOCK_PHASE, COMBAT_PHASE, END_OF_SETUP, HERO_PHASE, SHOOTING_PHASE } from 'types/phases'
import Units from './units'

const RegularBattalions = {
  'Blackshard Warhost': {
    mandatory: {
      units: [
        keyPicker(Units, [
          'Infernal Guard Castellan',
          'Infernal Guard Battle Standard Bearer',
          'Infernal Guard Ironsworn',
          'Infernal Guard Fireglaives',
        ]),
      ],
    },
    effects: [
      {
        name: `Unyielding Slaughterers`,
        desc: `Add 1 to the Bravery characteristic of units from this battalion. In addition, you can reroll hit rolls of 1 for attacks made with melee weapons by models from this battalion if that model has not made a move in the same turn.`,
        when: [COMBAT_PHASE, BATTLESHOCK_PHASE],
      },
    ],
  },
  'Hashut`s Wrath Artillery Train': {
    mandatory: {
      units: [keyPicker(Units, ['Daemonsmith', 'Iron Daemon War Engine'])],
    },
    effects: [
      {
        name: `Murderous Barrage`,
        desc: `Units from this battalion with the Infernal Engineers ability can benefit from that ability as long as the Daemonsmith from the same battalion is on the battlefield (even if the Daemonsmith is not within 3" of the model using the Infernal Engineers ability).`,
        when: [SHOOTING_PHASE],
      },
    ],
  },
  'Execution Herd': {
    mandatory: {
      units: [
        keyPicker(Units, ['Shar`Tor the Executioner', 'Bull Centaur Taur`Ruk', 'Bull Centaur Renders']),
      ],
    },
    effects: [
      {
        name: `Marked for Death`,
        desc: `After set-up is complete, but before the battle begins, pick 1 enemy unit to be marked for death. You can reroll hit rolls for attacks made by units from this battalion that target that unit. If that unit is destroyed, you can choose a new unit to be marked for death in your next hero phase.`,
        when: [END_OF_SETUP, COMBAT_PHASE, HERO_PHASE],
      },
    ],
  },
}

const Battalions = { ...RegularBattalions }
export default tagAs(Battalions, 'battalion')

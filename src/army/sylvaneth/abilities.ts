import { TAbilities } from 'types/army'
import { BATTLESHOCK_PHASE, DURING_SETUP, END_OF_MOVEMENT_PHASE, MOVEMENT_PHASE } from 'types/phases'

// General Allegiance Abilities (always active regardless of army composition)
const Abilities: TAbilities = [
  {
    name: `Forest Spirits`,
    desc: `Instead of setting up a SYLVANETH unit on the battlefield, you can place it to one side and say that it is set up in the hidden enclaves as a reserve unit. You can set up one reserve unit in the hidden enclaves for each unit you set up on the battlefield.`,
    when: [DURING_SETUP],
  },
  {
    name: `Forest Spirits`,
    desc: `At the end of your movement phase, you can set up one or more of the reserve units that are in the hidden enclaves on the battlefield wholly within 6" of an AWAKENED WYLDWOOD and more than 9" from any enemy units. Any reserve units in the hidden enclaves that are not set up on the battlefield before the start of the fourth battle round are slain.`,
    when: [END_OF_MOVEMENT_PHASE],
  },
  {
    name: `Navigate Realmroots`,
    desc: `Instead of making a normal move in your movement phase, 1 friendly SYLVANETH unit wholly within 6" of an AWAKENED WYLDWOOD can navigate the realmroots. If it does so, remove that unit from the battlefield and then set it up again wholly within 6" of another AWAKENED WYLDWOOD and more than 9" from any enemy units.`,
    when: [MOVEMENT_PHASE],
  },
  {
    name: `Places of Power`,
    desc: `After territories have been chosen but before armies are set up, you can pick 1 terrain feature on the battlefield that was not set up by your opponent as part of their army. Do not take battleshock tests for friendly SYLVANETH units while they are wholly within 6" of that terrain feature.`,
    when: [DURING_SETUP],
  },
  {
    name: `Places of Power`,
    desc: `Do not take battleshock tests for friendly SYLVANETH units while they are wholly within 6" of the Place of Power terrain feature.`,
    when: [BATTLESHOCK_PHASE],
  },
]

export default Abilities

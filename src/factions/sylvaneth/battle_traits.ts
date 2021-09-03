import { tagAs } from 'factions/metatagger'
import { SYLVANETH } from 'meta/factions'
import { BATTLESHOCK_PHASE, DURING_SETUP, END_OF_MOVEMENT_PHASE } from 'types/phases'
import rule_sources from './rule_sources'

const BattleTraits = {
  [SYLVANETH]: {
    effects: [
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
        name: `Places of Power`,
        desc: `After territories have been chosen but before armies are set up, you can pick 1 terrain feature on the battlefield that was not set up by your opponent as part of their army. Do not take battleshock tests for friendly SYLVANETH units while they are wholly within 6" of that terrain feature.`,
        when: [DURING_SETUP],
      },
      {
        name: `Places of Power`,
        desc: `Do not take battleshock tests for friendly SYLVANETH units while they are wholly within 6" of the Place of Power terrain feature.`,
        when: [BATTLESHOCK_PHASE],
      },
      {
        name: `Navigate Realmroots`,
        desc: `At the end of your movement phase, if there is a friendly SYLVANETH unit wholly within 6" of an Awakened Wyldwood, you can remove that unit from the battlefield and set it up wholly within 6" of a different Awakened Wyldwood in your army and more than 9" from all enemy models. You can only transport up to 1 friendly unit in this way per battle round, regardless of the number of Awakened Wyldwoods in your army.`,
        when: [END_OF_MOVEMENT_PHASE],
        rule_sources: [rule_sources.ERRATA_SYLVANETH_SEPTEMBER_2021],
      },
    ],
  },
}

export default tagAs(BattleTraits, 'battle_trait')

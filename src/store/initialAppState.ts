import { SUPPORTED_FACTIONS } from 'meta/factions'
import { Game } from 'meta/game_structure'
import { IStore } from 'types/store'

const DefaultAppState: IStore = {
  factionNames: {
    factionName: SUPPORTED_FACTIONS[0],
    subFactionName: '', // TODO: Can we fetch this?
  },
  selections: {
    selections: {
      artifacts: [],
      battalions: [],
      battle_tactics: [],
      command_abilities: [],
      command_traits: [],
      core_rules: [],
      endless_spells: [],
      flavors: [],
      grand_strategies: [],
      incarnates: [],
      monstrous_rampages: [],
      mount_traits: [],
      prayers: [],
      scenery: [],
      spells: [],
      triumphs: [],
      units: [],
    },
    allySelections: {},
    sideEffects: {},
  },
  army: {
    army: {
      Artifacts: [],
      Battalions: [],
      BattleTactics: [],
      BattleTraits: [],
      CommandAbilities: [],
      CommandTraits: [],
      CoreRules: [],
      EndlessSpells: [],
      Flavors: [],
      FlavorType: '',
      Game: Game,
      GrandStrategies: [],
      Incarnates: [],
      MonstrousRampages: [],
      MountTraits: [],
      Prayers: [],
      Scenery: [],
      Spells: [],
      SubFaction: {
        name: '',
        effects: [],
      },
      Triumphs: [],
      Units: [],
    },
    allyArmies: {},
  },
  realmscape: {
    origin_realm: null,
    realmscape: null,
    realmscape_feature: null,
  },
  notes: { notes: [] },
  visibility: {
    allies: [],
    reminders: [],
    selectors: [],
    when: [],
  },
}

export default DefaultAppState

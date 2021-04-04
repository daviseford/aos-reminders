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
      command_abilities: [],
      command_traits: [],
      endless_spells: [],
      flavors: [],
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
      BattleTraits: [],
      CommandAbilities: [],
      CommandTraits: [],
      EndlessSpells: [],
      Flavors: [],
      FlavorType: '',
      Game: Game,
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

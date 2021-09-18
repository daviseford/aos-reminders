import GreenskinzUnits from '../greenskinz/units'
import { keyPicker, pickEffects } from '../metatagger'
import OrrukWarclansBattleTraits from './battle_traits'
import BigWaaaghBattleTraits from './big_waaagh/battle_traits'
import BigWaaaghCommandAbilities from './big_waaagh/command_abilities'
import BonesplitterzArtifacts from './bonesplitterz/artifacts'
import BonesplitterzBattalions from './bonesplitterz/battalions'
import BonesplitterzBattleTraits from './bonesplitterz/battle_traits'
import BonesplitterzCommandAbilities from './bonesplitterz/command_abilities'
import BonesplitterzCommandTraits from './bonesplitterz/command_traits'
import BonesplitterzFlavors from './bonesplitterz/flavors'
import BonesplitterzSpells from './bonesplitterz/spells'
import BonesplitterzUnits from './bonesplitterz/units'
import OrrukWarclansGrandStrategies from './grand_strategies'
import IronjawzArtifacts from './ironjawz/artifacts'
import IronjawzBattalions from './ironjawz/battalions'
import IronjawzBattleTraits from './ironjawz/battle_traits'
import IronjawzCommandAbilities from './ironjawz/command_abilities'
import IronjawzCommandTraits from './ironjawz/command_traits'
import IronjawzFlavors from './ironjawz/flavors'
import IronjawzMountTraits from './ironjawz/mount_traits'
import IronjawzPrayers from './ironjawz/prayers'
import IronjawzSpells from './ironjawz/spells'
import IronjawzUnits from './ironjawz/units'
import KruleboyzArtifacts from './kruleboyz/artifacts'
import KruleboyzBattleTraits from './kruleboyz/battle_traits'
import KruleboyzCommandTraits from './kruleboyz/command_traits'
import KruleboyzFlavors from './kruleboyz/flavors'
import KruleboyzSpells from './kruleboyz/spells'
import KruleboyzUnits from './kruleboyz/units'

const subFactions = {
  'Big Waaagh': {
    effects: [
      ...pickEffects(BigWaaaghBattleTraits, ['Big Waaagh']),
      ...pickEffects(OrrukWarclansBattleTraits, ['Battle Tactics']),
    ],
    available: {
      allied_units: [GreenskinzUnits, IronjawzUnits, BonesplitterzUnits, KruleboyzUnits],
      artifacts: [IronjawzArtifacts, BonesplitterzArtifacts],
      battalions: [IronjawzBattalions, BonesplitterzBattalions],
      command_traits: [IronjawzCommandTraits, BonesplitterzCommandTraits],
      grand_strategies: [keyPicker(OrrukWarclansGrandStrategies, ['Waaagh!', "Krump 'Em All!"])],
      mount_traits: [IronjawzMountTraits],
      prayers: [IronjawzPrayers],
      spells: [IronjawzSpells, BonesplitterzSpells, KruleboyzSpells],
    },
    mandatory: {
      command_abilities: [keyPicker(BigWaaaghCommandAbilities, ['Da Big Waaagh!!!'])],
    },
  },

  Bonesplitterz: {
    effects: [
      ...pickEffects(BonesplitterzBattleTraits, [
        'Bonesplitterz Waaagh!',
        'Spirit of Gorkamorka',
        'Tireless Trackers',
        'Warpaint',
      ]),
      ...pickEffects(OrrukWarclansBattleTraits, ['Battle Tactics']),
    ],
    available: {
      artifacts: [BonesplitterzArtifacts],
      battalions: [BonesplitterzBattalions],
      command_abilities: [BonesplitterzCommandAbilities],
      command_traits: [BonesplitterzCommandTraits],
      flavors: [BonesplitterzFlavors],
      grand_strategies: [
        keyPicker(OrrukWarclansGrandStrategies, ['Get Dem Bones!', 'Waaagh!', "Krump 'Em All!"]),
      ],
      spells: [BonesplitterzSpells],
      units: [BonesplitterzUnits],
    },
    mandatory: {
      command_abilities: [keyPicker(BonesplitterzCommandAbilities, ['Bonesplitterz Waaagh!'])],
    },
  },

  Ironjawz: {
    effects: [
      ...pickEffects(IronjawzBattleTraits, ['Smashing and Bashing', 'Mad as Hell', 'Eager for Battle']),
      ...pickEffects(OrrukWarclansBattleTraits, ['Battle Tactics']),
    ],
    available: {
      artifacts: [IronjawzArtifacts],
      battalions: [IronjawzBattalions],
      command_abilities: [IronjawzCommandAbilities],
      command_traits: [IronjawzCommandTraits],
      flavors: [IronjawzFlavors],
      grand_strategies: [
        keyPicker(OrrukWarclansGrandStrategies, ["Show 'Em Who's Boss!", 'Waaagh!', "Krump 'Em All!"]),
      ],
      mount_traits: [IronjawzMountTraits],
      prayers: [IronjawzPrayers],
      spells: [IronjawzSpells],
      units: [IronjawzUnits],
    },
    mandatory: {
      command_abilities: [keyPicker(IronjawzCommandAbilities, ['Mighty Destroyers', 'Ironjawz Waaaagh!'])],
    },
  },

  Kruleboyz: {
    effects: [
      ...pickEffects(KruleboyzBattleTraits, ['Venom-encrusted Weapons', 'Dirty Tricks', 'Kruleboyz Waaagh!']),
      ...pickEffects(OrrukWarclansBattleTraits, ['Battle Tactics']),
    ],
    available: {
      artifacts: [KruleboyzArtifacts],
      command_traits: [KruleboyzCommandTraits],
      flavors: [KruleboyzFlavors],
      grand_strategies: [
        keyPicker(OrrukWarclansGrandStrategies, ['In and Out, Ladz', 'Waaagh!', "Krump 'Em All!"]),
      ],
      spells: [KruleboyzSpells],
      units: [KruleboyzUnits],
    },
  },
}

export default subFactions

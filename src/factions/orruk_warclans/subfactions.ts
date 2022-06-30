import GreenskinzUnits from '../greenskinz/units'
import { keyPicker, pickEffects } from '../metatagger'
import OrrukWarclansBattalions from './battalions'
import OrrukWarclansBattleTraits from './battle_traits'
import BigWaaaghBattleTraits from './big_waaagh/battle_traits'
import BonesplitterzArtifacts from './bonesplitterz/artifacts'
import BonesplitterzBattleTraits from './bonesplitterz/battle_traits'
import BonesplitterzCommandAbilities from './bonesplitterz/command_abilities'
import BonesplitterzCommandTraits from './bonesplitterz/command_traits'
import BonesplitterzFlavors from './bonesplitterz/flavors'
import BonesplitterzSpells from './bonesplitterz/spells'
import BonesplitterzUnits from './bonesplitterz/units'
import OrrukWarclansGrandStrategies from './grand_strategies'
import IronjawzArtifacts from './ironjawz/artifacts'
import IronjawzBattleTraits from './ironjawz/battle_traits'
import IronjawzCommandAbilities from './ironjawz/command_abilities'
import IronjawzCommandTraits from './ironjawz/command_traits'
import IronjawzFlavors from './ironjawz/flavors'
import IronjawzSpells from './ironjawz/spells'
import IronjawzUnits from './ironjawz/units'
import KruleboyzArtifacts from './kruleboyz/artifacts'
import KruleboyzBattleTraits from './kruleboyz/battle_traits'
import KruleboyzCommandTraits from './kruleboyz/command_traits'
import KruleboyzFlavors from './kruleboyz/flavors'
import KruleboyzSpells from './kruleboyz/spells'
import KruleboyzUnits from './kruleboyz/units'
import OrrukWarclansMountTraits from './mount_traits'

const subFactions = {
  'Big Waaagh': {
    effects: [
      ...pickEffects(BigWaaaghBattleTraits, [
        'The Power of the Waaagh!',
        "'Ere We Go, 'Ere We Go, 'Ere We Go!",
        'Battle Tactics',
      ]),
      ...pickEffects(BonesplitterzBattleTraits, ['Warpaint']),
      ...pickEffects(KruleboyzBattleTraits, ['Venom-encrusted Weapons']),
      ...pickEffects(OrrukWarclansBattleTraits, ['Battle Tactics']),
    ],
    available: {
      allied_units: [GreenskinzUnits, IronjawzUnits, BonesplitterzUnits, KruleboyzUnits],
      artifacts: [IronjawzArtifacts, BonesplitterzArtifacts, KruleboyzArtifacts],
      battalions: [OrrukWarclansBattalions],
      command_abilities: [BonesplitterzCommandAbilities, IronjawzCommandAbilities],
      command_traits: [IronjawzCommandTraits, BonesplitterzCommandTraits, KruleboyzCommandTraits],
      grand_strategies: [keyPicker(OrrukWarclansGrandStrategies, ['Waaagh!', "Krump 'Em All!"])],
      mount_traits: [OrrukWarclansMountTraits],
      spells: [IronjawzSpells, BonesplitterzSpells, KruleboyzSpells],
    },
    mandatory: {
      command_abilities: [keyPicker(IronjawzCommandAbilities, ['Mighty Destroyers'])],
    },
  },

  Bonesplitterz: {
    effects: [
      ...pickEffects(BonesplitterzBattleTraits, [
        'Bonesplitterz Waaagh!',
        'Spirit of Gorkamorka',
        'Tireless Trackers',
        'Warpaint',
        'Battle Tactics',
      ]),
      ...pickEffects(OrrukWarclansBattleTraits, ['Battle Tactics']),
    ],
    available: {
      artifacts: [BonesplitterzArtifacts],
      battalions: [keyPicker(OrrukWarclansBattalions, ['Bonesplitterz Rukk'])],
      command_abilities: [BonesplitterzCommandAbilities],
      command_traits: [BonesplitterzCommandTraits],
      flavors: [BonesplitterzFlavors],
      grand_strategies: [
        keyPicker(OrrukWarclansGrandStrategies, ['Get Dem Bones!', 'Waaagh!', "Krump 'Em All!"]),
      ],
      mount_traits: [OrrukWarclansMountTraits],
      spells: [BonesplitterzSpells],
      units: [BonesplitterzUnits],
    },
    mandatory: {
      command_abilities: [keyPicker(BonesplitterzCommandAbilities, ['Bonesplitterz Waaagh!'])],
    },
  },

  Ironjawz: {
    effects: [
      ...pickEffects(IronjawzBattleTraits, ['Smashing and Bashing', 'Ironjawz Waaaagh!', 'Battle Tactics']),
      ...pickEffects(OrrukWarclansBattleTraits, ['Battle Tactics']),
    ],
    available: {
      artifacts: [IronjawzArtifacts],
      battalions: [keyPicker(OrrukWarclansBattalions, ['Ironjawz Fist'])],
      command_abilities: [IronjawzCommandAbilities],
      command_traits: [IronjawzCommandTraits],
      flavors: [IronjawzFlavors],
      grand_strategies: [
        keyPicker(OrrukWarclansGrandStrategies, ["Show 'Em Who's Boss!", 'Waaagh!', "Krump 'Em All!"]),
      ],
      mount_traits: [OrrukWarclansMountTraits],
      spells: [IronjawzSpells],
      units: [IronjawzUnits],
    },
    mandatory: {
      command_abilities: [keyPicker(IronjawzCommandAbilities, ['Mighty Destroyers'])],
    },
  },

  Kruleboyz: {
    effects: [
      ...pickEffects(KruleboyzBattleTraits, [
        'Venom-encrusted Weapons',
        'Dirty Tricks',
        'Kruleboyz Waaagh!',
        'Battle Tactics',
      ]),
      ...pickEffects(OrrukWarclansBattleTraits, ['Battle Tactics']),
    ],
    available: {
      artifacts: [KruleboyzArtifacts],
      battalions: [keyPicker(OrrukWarclansBattalions, ['Kruleboyz Finga'])],
      command_traits: [KruleboyzCommandTraits],
      flavors: [KruleboyzFlavors],
      grand_strategies: [
        keyPicker(OrrukWarclansGrandStrategies, ['In and Out, Ladz', 'Waaagh!', "Krump 'Em All!"]),
      ],
      mount_traits: [OrrukWarclansMountTraits],
      spells: [KruleboyzSpells],
      units: [KruleboyzUnits],
    },
  },
}

export default subFactions

import { TItemDescriptions } from 'factions/factionTypes'
import { keyPicker, pickEffects } from '../metatagger'
import BigWaaaghArtifacts from './big_waaagh_new/artifacts'
import BigWaaaghBattalions from './big_waaagh_new/battalions'
import BigWaaaghBattleTraits from './big_waaagh_new/battle_traits'
import BigWaaaghCommandAbilities from './big_waaagh_new/command_abilities'
import BigWaaaghCommandTraits from './big_waaagh_new/command_traits'
import BigWaaaghSpells from './big_waaagh_new/spells'
import BigWaaaghUnits from './big_waaagh_new/units'
import BonesplitterzArtifacts from './bonesplitterz_new/artifacts'
import BonesplitterzBattalions from './bonesplitterz_new/battalions'
import BonesplitterzBattleTraits from './bonesplitterz_new/battle_traits'
import BonesplitterzCommandAbilities from './bonesplitterz_new/command_abilities'
import BonesplitterzCommandTraits from './bonesplitterz_new/command_traits'
import BonesplitterzFlavors from './bonesplitterz_new/flavors'
import BonesplitterzSpells from './bonesplitterz_new/spells'
import BonesplitterzUnits from './bonesplitterz_new/units'
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

const subFactions: TItemDescriptions = {
  Ironjawz: {
    effects: pickEffects(IronjawzBattleTraits, ['Smashing and Bashing', 'Mad as Hell', 'Eager for Battle']),
    available: {
      artifacts: [IronjawzArtifacts],
      battalions: [IronjawzBattalions],
      command_abilities: [IronjawzCommandAbilities],
      command_traits: [IronjawzCommandTraits],
      flavors: [IronjawzFlavors],
      mount_traits: [IronjawzMountTraits],
      prayers: [IronjawzPrayers],
      spells: [IronjawzSpells],
      units: [IronjawzUnits],
    },
    mandatory: {
      command_abilities: [keyPicker(IronjawzCommandAbilities, ['Mighty Destroyers', 'Ironjawz Waaaagh!'])],
    },
  },
  Bonesplitterz: {
    effects: pickEffects(BonesplitterzBattleTraits, []),
    available: {
      artifacts: [BonesplitterzArtifacts],
      battalions: [BonesplitterzBattalions],
      command_abilities: [BonesplitterzCommandAbilities],
      command_traits: [BonesplitterzCommandTraits],
      flavors: [BonesplitterzFlavors],
      spells: [BonesplitterzSpells],
      units: [BonesplitterzUnits],
    },
  },
  'Big Waaagh': {
    effects: pickEffects(BigWaaaghBattleTraits, []),
    available: {
      artifacts: [BigWaaaghArtifacts],
      battalions: [BigWaaaghBattalions],
      command_abilities: [BigWaaaghCommandAbilities],
      command_traits: [BigWaaaghCommandTraits],
      spells: [BigWaaaghSpells],
      units: [BigWaaaghUnits],
    },
  },
}

export default subFactions

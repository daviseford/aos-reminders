import GreenskinzUnits from '../greenskinz/units'
import { keyPicker, pickEffects } from '../metatagger'
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

const subFactions = {
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
    effects: pickEffects(BonesplitterzBattleTraits, [
      'Monster Hunters',
      'Spirit of the Beast',
      'Tireless Trackers',
      'Warpaint',
    ]),
    available: {
      artifacts: [BonesplitterzArtifacts],
      battalions: [BonesplitterzBattalions],
      command_abilities: [BonesplitterzCommandAbilities],
      command_traits: [BonesplitterzCommandTraits],
      flavors: [BonesplitterzFlavors],
      spells: [BonesplitterzSpells],
      units: [BonesplitterzUnits],
    },
    mandatory: {
      command_abilities: [keyPicker(BonesplitterzCommandAbilities, ['Bonesplitterz Waaagh!'])],
    },
  },
  'Big Waaagh': {
    effects: pickEffects(BigWaaaghBattleTraits, ['Big Waaagh']),
    available: {
      allied_units: [GreenskinzUnits, IronjawzUnits, BonesplitterzUnits],
      artifacts: [IronjawzArtifacts, BonesplitterzArtifacts],
      battalions: [IronjawzBattalions, BonesplitterzBattalions],
      command_traits: [IronjawzCommandTraits, BonesplitterzCommandTraits],
      mount_traits: [IronjawzMountTraits],
      spells: [IronjawzSpells, BonesplitterzSpells],
    },
    mandatory: {
      command_abilities: [keyPicker(BigWaaaghCommandAbilities, ['Da Big Waaagh!!!'])],
    },
  },
}

export default subFactions

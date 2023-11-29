import { keyPicker, pickEffects } from '../metatagger'
import BigWaaaghBattleTactics from './big_waaagh/battle_tactics'
import BigWaaaghBattleTraits from './big_waaagh/battle_traits'
import BonesplitterzArtifacts from './bonesplitterz/artifacts'
import BonesplitterzBattleTactics from './bonesplitterz/battle_tactics'
import BonesplitterzBattleTraits from './bonesplitterz/battle_traits'
import BonesplitterzCommandAbilities from './bonesplitterz/command_abilities'
import BonesplitterzCommandTraits from './bonesplitterz/command_traits'
import BonesplitterzFlavors from './bonesplitterz/flavors'
import BonesplitterzSpells from './bonesplitterz/spells'
import BonesplitterzUnits from './bonesplitterz/units'
import GreenskinzUnits from '../greenskinz/units'
import GruntaStampedeArtifacts from './grunta_stampede/artifacts'
import GruntaStampedeBattleTactics from './grunta_stampede/battle_tactics'
import GruntaStampedeBattleTraits from './grunta_stampede/battle_traits'
import GruntaStampedeCommandTraits from './grunta_stampede/command_traits'
import GruntaStampedeGrandStrategies from './grunta_stampede/grand_strategies'
import GruntaStampedeMonstrousRampages from './grunta_stampede/monstrous_rampages'
import GruntaStampedeMountTraits from './grunta_stampede/mount_traits'
import IronjawzArtifacts from './ironjawz/artifacts'
import IronjawzBattleTactics from './ironjawz/battle_tactics'
import IronjawzBattleTraits from './ironjawz/battle_traits'
import IronjawzCommandAbilities from './ironjawz/command_abilities'
import IronjawzCommandTraits from './ironjawz/command_traits'
import IronjawzFlavors from './ironjawz/flavors'
import IronjawzMonstrousRampages from './ironjawz/monstrous_rampages'
import IronjawzSpells from './ironjawz/spells'
import IronjawzUnits from './ironjawz/units'
import KruleboyzArtifacts from './kruleboyz/artifacts'
import KruleboyzBattleTactics from './kruleboyz/battle_tactics'
import KruleboyzBattleTraits from './kruleboyz/battle_traits'
import KruleboyzCommandTraits from './kruleboyz/command_traits'
import KruleboyzFlavors from './kruleboyz/flavors'
import KruleboyzSpells from './kruleboyz/spells'
import KruleboyzUnits from './kruleboyz/units'
import OrrukWarclansBattalions from './battalions'
import OrrukWarclansBattleTactics from './battle_tactics'
import OrrukWarclansGrandStrategies from './grand_strategies'
import OrrukWarclansMountTraits from './mount_traits'
import { TItemDescriptions } from 'factions/factionTypes'

const subFactions = {
  'Big Waaagh': {
    effects: [
      ...pickEffects(BigWaaaghBattleTraits, [
        'The Power of the Waaagh!',
        "'Ere We Go, 'Ere We Go, 'Ere We Go!",
      ]),
      ...pickEffects(BonesplitterzBattleTraits, ['Warpaint']),
      ...pickEffects(KruleboyzBattleTraits, ['Venom-encrusted Weapons']),
    ],
    available: {
      allied_units: [GreenskinzUnits, IronjawzUnits, BonesplitterzUnits, KruleboyzUnits],
      artifacts: [IronjawzArtifacts, BonesplitterzArtifacts, KruleboyzArtifacts],
      battalions: [OrrukWarclansBattalions],
      battle_tactics: [OrrukWarclansBattleTactics, BigWaaaghBattleTactics],
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
    effects: pickEffects(BonesplitterzBattleTraits, [
      'Bonesplitterz Waaagh!',
      'Spirit of Gorkamorka',
      'Tireless Trackers',
      'Warpaint',
    ]),
    available: {
      artifacts: [BonesplitterzArtifacts],
      battalions: [keyPicker(OrrukWarclansBattalions, ['Bonesplitterz Rukk'])],
      battle_tactics: [OrrukWarclansBattleTactics, BonesplitterzBattleTactics],
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
  },

  Ironjawz: {
    effects: pickEffects(IronjawzBattleTraits, ['Smashing and Bashing', 'Ironjawz Waaaagh!']),
    available: {
      artifacts: [IronjawzArtifacts],
      battalions: [keyPicker(OrrukWarclansBattalions, ['Ironjawz Fist'])],
      battle_tactics: [OrrukWarclansBattleTactics, IronjawzBattleTactics],
      command_abilities: [IronjawzCommandAbilities],
      command_traits: [IronjawzCommandTraits],
      flavors: [IronjawzFlavors],
      grand_strategies: [
        keyPicker(OrrukWarclansGrandStrategies, ["Show 'Em Who's Boss!", 'Waaagh!', "Krump 'Em All!"]),
      ],
      mount_traits: [OrrukWarclansMountTraits],
      monstrous_rampages: [IronjawzMonstrousRampages],
      spells: [IronjawzSpells],
      units: [IronjawzUnits],
    },
    mandatory: {
      command_abilities: [keyPicker(IronjawzCommandAbilities, ['Mighty Destroyers'])],
    },
  },

  Kruleboyz: {
    effects: pickEffects(KruleboyzBattleTraits, [
      'Venom-encrusted Weapons',
      'Dirty Tricks',
      'Kruleboyz Waaagh!',
    ]),
    available: {
      artifacts: [KruleboyzArtifacts],
      battalions: [keyPicker(OrrukWarclansBattalions, ['Kruleboyz Finga'])],
      battle_tactics: [OrrukWarclansBattleTactics, KruleboyzBattleTactics],
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

  'Grunta Stampede': {
    effects: pickEffects(GruntaStampedeBattleTraits, ['Grunta Waaagh!', 'Hogs of War', "'Ere We Come!"]),
    available: {
      units: [GreenskinzUnits, IronjawzUnits, BonesplitterzUnits, KruleboyzUnits],
      artifacts: [GruntaStampedeArtifacts],
      battle_tactics: [GruntaStampedeBattleTactics],
      command_traits: [GruntaStampedeCommandTraits],
      grand_strategies: [GruntaStampedeGrandStrategies],
      mount_traits: [GruntaStampedeMountTraits],
      monstrous_rampages: [GruntaStampedeMonstrousRampages],
    },
  },
} satisfies TItemDescriptions

export default subFactions

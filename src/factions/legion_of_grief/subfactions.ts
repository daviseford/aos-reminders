import { TItemDescriptions } from 'factions/factionTypes'
import { LEGION_OF_GRIEF } from 'meta/factions'
import LegionsOfNagashUnits from '../legions_of_nagash/units'
import { keyPicker, pickEffects } from '../metatagger'
import NighthauntEndlessSpells from '../nighthaunt/endless_spells'
import NighthauntUnits from '../nighthaunt/units'
import Artifacts from './artifacts'
import BattleTraits from './battle_traits'
import CommandAbilities from './command_abilities'
import CommandTraits from './command_traits'
import Spells from './spells'

const subFactions: TItemDescriptions = {
  [LEGION_OF_GRIEF]: {
    effects: pickEffects(BattleTraits, [LEGION_OF_GRIEF]),
    available: {
      artifacts: [Artifacts],
      command_abilities: [CommandAbilities],
      command_traits: [CommandTraits],
      endless_spells: [NighthauntEndlessSpells],
      spells: [Spells],
      units: [
        NighthauntUnits,
        keyPicker(LegionsOfNagashUnits, [
          'Arkhan the Black, Mortarch of Sacrament',
          'Black Knights',
          'Corpse Cart w/ Balefire Brazier',
          'Corpse Cart w/ Unholy Lodestone',
          'Dire Wolves',
          'Grave Guard',
          'Mannfred, Mortarch of Night',
          'Morghast Archai',
          'Morghast Harbingers',
          'Mortis Engine',
          'Nagash, Supreme Lord of the Undead',
          'Necromancer',
          'Neferata, Mortarch of Blood',
          'Skeleton Warriors',
          'Wight King with Baleful Tomb Blade',
          'Wight King with Black Axe',
          'Zombies',
        ]),
      ],
    },
    mandatory: {
      command_abilities: [keyPicker(CommandAbilities, ['Endless Legions'])],
    },
  },
}

export default subFactions

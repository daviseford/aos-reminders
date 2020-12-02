import { pickEffects } from 'factions/metatagger'
import Artifacts from './artifacts'
import { BattleTraits } from './battle_traits'
import CommandAbilities from './command_abilities'
import CommandTraits from './command_traits'

const Flavors = {
  'Lurid Haze': {
    effects: [
      ...pickEffects(BattleTraits, ['Lurid Haze']),
      ...pickEffects(CommandTraits, ['Lurid Haze']),
      ...pickEffects(Artifacts, ['Lurid Haze']),
      ...pickEffects(CommandAbilities, ['Intoxicating Pall']),
    ],
  },
  'Faultless Blades': {
    effects: [
      ...pickEffects(BattleTraits, ['Faultless Blades']),
      ...pickEffects(CommandTraits, ['Faultless Blades']),
      ...pickEffects(Artifacts, ['Faultless Blades']),
      ...pickEffects(CommandAbilities, ['Armour of Arrogance']),
    ],
  },
  'Scarlet Cavalcade': {
    effects: [
      ...pickEffects(BattleTraits, ['Scarlet Cavalcade']),
      ...pickEffects(CommandTraits, ['Scarlet Cavalcade']),
      ...pickEffects(Artifacts, ['Scarlet Cavalcade']),
      ...pickEffects(CommandAbilities, ['Vicious Spurs']),
    ],
  },
}

export default Flavors

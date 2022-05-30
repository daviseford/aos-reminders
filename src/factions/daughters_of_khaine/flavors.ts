import { keyPicker, pickEffects } from 'factions/metatagger'
import BattleTraits from './battle_traits'
import CommandAbilities from './command_abilities'

const Flavors = {
  'Hagg Nar': {
    effects: [...pickEffects(BattleTraits, ['Daughters of the First Temple'])],
  },
  'Draichi Ganeth': {
    effects: [...pickEffects(BattleTraits, ['Bladed Killers'])],
  },
  'The Kraith': {
    effects: [...pickEffects(BattleTraits, ['Disciples of Slaughter'])],
  },
  Khailebron: {
    mandatory: {
      command_abilities: [keyPicker(CommandAbilities, ['Masters of the Shadowpaths'])],
    },
    effects: [],
  },
  'Khelt Nar': {
    effects: [...pickEffects(BattleTraits, ['Strike and Fade'])],
  },
  'Zainthar Kai': {
    effects: [...pickEffects(BattleTraits, ["Khaine's Essence"])],
  },
}

export default Flavors

import { tagAs } from 'factions/metatagger'
import {
  SlayersBattalionEffect,
  StrategistsBattalionEffect,
  SwiftBattalionEffect,
} from 'generic_rules/core_battalions'

const OrrukWarclansBattalions = {
  'Ironjawz Fist': {
    effects: [SlayersBattalionEffect],
  },
  'Kruleboyz Finga': {
    effects: [StrategistsBattalionEffect],
  },
  'Bonesplitterz Rukk': {
    effects: [SwiftBattalionEffect],
  },
}

export default tagAs(OrrukWarclansBattalions, 'battalion')

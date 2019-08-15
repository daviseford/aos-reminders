import { TBattalions, TUnits } from 'types/army'
import BeastclawRaiders from 'army/beastclaw_raiders'
import GloomspiteGitz from 'army/gloomspite'
import Gutbusters from 'army/gutbusters'
import Ironjawz from 'army/ironjawz'

// Unit Names
export const Units: TUnits = [
  ...BeastclawRaiders.Units,
  ...GloomspiteGitz.Units,
  ...Gutbusters.Units,
  ...Ironjawz.Units,
]
export const Battalions: TBattalions = []

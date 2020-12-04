import { Faction } from 'factions/factionClass'
import { ORDER } from 'meta/alliances'
import { SAMPLE } from 'meta/factions'
import SubFactions from './subfactions'

export const SampleFaction = new Faction(SAMPLE, ORDER, SubFactions, 'Idk yet', 'Sample Flavors')

console.log(SampleFaction)

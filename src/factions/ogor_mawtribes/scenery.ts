import { tagAs } from 'factions/metatagger'
import { GenericEffects } from 'generic_rules'
import { HERO_PHASE, START_OF_SETUP, WOUND_ALLOCATION_PHASE } from 'types/phases'
import rule_sources from './rule_sources'

const Scenery = {
  'Great Mawpot': {
    effects: [
      {
        name: `Setup`,
        desc: `After territories are determined, you can set up this faction terrain feature wholly within your territory and more than 3" from all objectives and other terrain features. If both players can set up faction terrain features at the same time, they must roll off and the winner chooses who sets up their faction terrain features first.`,
        when: [START_OF_SETUP],
        rule_sources: [rule_sources.BATTLETOME_OGOR_MAWTRIBES, rule_sources.ERRATA_OGOR_MAWTRIBES_JULY_2021],
      },
      GenericEffects.Impassable,
      {
        name: `Vessel of the Gulping God`,
        desc: `Add 1 to casting, unbinding and dispelling rolls for friendly OGOR WIZARDS that are within 1" of this terrain feature.`,
        when: [HERO_PHASE],
        rule_sources: [rule_sources.BATTLETOME_OGOR_MAWTRIBES, rule_sources.ERRATA_OGOR_MAWTRIBES_JULY_2021],
      },
      {
        name: `Battlebroth`,
        desc: `A Great Mawpot is either full or empty. At the start of the battle, it is full. In your hero phase, 1 friendly OGOR HERO within 6" of a full Great Mawpot in your army can spend all of that Great Mawpot's magic. If they do so, you can heal D3 wounds allocated to each friendly OGOR unit wholly within 36" of that Great Mawpot (roll separately for each unit). Once all of the Great Mawpot's magic has been spent, it is empty.`,
        when: [HERO_PHASE],
        rule_sources: [rule_sources.BATTLETOME_OGOR_MAWTRIBES, rule_sources.ERRATA_OGOR_MAWTRIBES_JULY_2021],
      },
      {
        name: `Throw 'Em In`,
        desc: `If an enemy model is slain within 6" of
        an empty Great Mawpot in your army,
        it becomes full.`,
        when: [WOUND_ALLOCATION_PHASE],
        rule_sources: [rule_sources.BATTLETOME_OGOR_MAWTRIBES, rule_sources.ERRATA_OGOR_MAWTRIBES_JULY_2021],
      },
    ],
  },
}

export default tagAs(Scenery, 'scenery')

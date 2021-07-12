import { tagAs } from 'factions/metatagger'
import { GenericEffects } from 'generic_rules'
import { CHARGE_PHASE, START_OF_HERO_PHASE } from 'types/phases'
import rule_sources from './rule_sources'

const Scenery = {
  'Feculent Gnarlmaw': {
    effects: [
      GenericEffects.FactionTerrainSetup,
      GenericEffects.Impassable,
      {
        name: `Entropic Chimes`,
        desc: `In the charge phase of their commanding player, NURGLE units that are within 7" of any Feculent Gnarlmaws can attempt a charge even if they ran in the same turn.`,
        when: [CHARGE_PHASE],
        rule_sources: [rule_sources.ERRATA_NURGLE_JULY_2021],
      },
      {
        name: `Sickness Blossoms`,
        desc: `At the start of the hero phase, roll a dice for each unit within 3" of any Feculent Gnarlmaws. On a 4+ that unit suffers 1 mortal wound. This scenery rule has no effect on NURGLE UNITS.`,
        when: [START_OF_HERO_PHASE],
        rule_sources: [rule_sources.ERRATA_NURGLE_JULY_2021],
      },
    ],
  },
}

export default tagAs(Scenery, 'scenery')

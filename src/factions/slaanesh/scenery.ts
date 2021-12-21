import { tagAs } from 'factions/metatagger'
import { GenericEffects } from 'generic_rules'
import { END_OF_MOVEMENT_PHASE, START_OF_HERO_PHASE } from 'types/phases'
import rule_sources from './rule_sources'

const Scenery = {
  'Fane of Slaanesh': {
    effects: [
      GenericEffects.FactionTerrainSetup,
      GenericEffects.Impassable,
      {
        name: `Power of Slaanesh`,
        desc: `If you spend depravity points to summon a SLAANESH DAEMON unit to the battlefield, you can set up that unit wholly within 12" of this terrain feature and more than 9" from all enemy units instead of wholly within 12" of a SLAANESH HERO and more than 9" from all enemy units.`,
        when: [END_OF_MOVEMENT_PHASE],
        rule_sources: [rule_sources.BATTLETOME_SLAANESH, rule_sources.ERRATA_JULY_2021],
      },
      {
        name: `Damned Conduit`,
        desc: `At the start of your hero phase, you can pick 1 friendly SLAANESH HERO within 6" of this terrain feature to make a sacrifice. If you do so, that HERO suffers 1 mortal wound and you must roll a dice. On a 1, nothing happens. On a 2+, add 1 to hit rolls for attacks made by that HERO until your next hero phase.
        
        If the HERO you picked has an artefact of power, instead of suffering 1 mortal wound, they can sacrifice that artefact of power. If they do so, that artefact of power can no longer be used and you must roll a dice. On a 1, nothing happens. On a 2+, add 1 to hit rolls for attacks made by that HERO for the rest of the battle.

        Designer's Note: You can sacrifice an artefact that can only be used a limited number of times during a battle and which has already been used. If a weapon was picked when the artefact of power was selected, that weapon reverts to normal.`,
        when: [START_OF_HERO_PHASE],
        rule_sources: [rule_sources.BATTLETOME_SLAANESH, rule_sources.ERRATA_JULY_2021],
      },
    ],
  },
}

export default tagAs(Scenery, 'scenery')

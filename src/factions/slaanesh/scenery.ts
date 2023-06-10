import { tagAs } from 'factions/metatagger'
import { GenericEffects } from 'generic_rules'
import { END_OF_MOVEMENT_PHASE, START_OF_HERO_PHASE } from 'types/phases'

const Scenery = {
  'Fane of Slaanesh': {
    effects: [
      GenericEffects.FactionTerrainSetup,
      GenericEffects.Impassable,
      {
        name: `Power of Slaanesh`,
        desc: `If you spend depravity points to summon a Hedonites of Slaanesh Daemon unit to the battlefield, you can set up that unit wholly within 12" of this terrain feature and more than 9" from all enemy units instead of wholly within 12" of a Hedonites of Slaanesh Hero and more than 9" from all enemy units.`,
        when: [END_OF_MOVEMENT_PHASE],
      },
      {
        name: `Damned Conduit`,
        desc: `At the start of your hero phase, you can pick 1 friendly Hedonites of Slaanesh Hero within 6" of this terrain feature to make a sacrifice. If you do so, that Hero suffers 1 mortal wound and you must roll a dice. On a 2+, add 1 to wound rolls for attacks made by that Hero until your next hero phase.

        If the Hero you picked has an artefact of power, instead of suffering 1 mortal wound, they can sacrifice that artefact of power. If they do so, that artefact of power can no longer be used and you must roll a dice. On a 2+, add 1 to wound rolls for attacks made by that Hero for the rest of the battle.

        Designer's Note: You can sacrifice any artefacts of power, including those that can only be used a limited number of times during a battle and those that have already been used. If the artefact of power was used to enhance a weapon, that weapon reverts to its normal form. `,
        when: [START_OF_HERO_PHASE],
      },
    ],
  },
}

export default tagAs(Scenery, 'scenery')

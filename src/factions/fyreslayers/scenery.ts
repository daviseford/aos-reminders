import { tagAs } from 'factions/metatagger'
import { END_OF_SETUP, START_OF_HERO_PHASE } from 'types/phases'

const Scenery = {
  'Magmic Battleforge': {
    effects: [
      {
        name: `Magmic Battleforge`,
        desc: `After armies are set up, but before combat begins, you can set up the Magmic Battleforge within 6" of a friendly FYRESLAYERS PRIEST wholly within your territory and more than 3" from any other terrain features and 1" from any objectives.`,
        when: [END_OF_SETUP],
      },
      {
        name: `Molten Blessing`,
        desc: `1 friendly FYRESLAYERS priest within 6" of the Magmic Battleforge can control the magmic energies. If they do so, until the end of that phase, add 1 to prayer rolls for friendly FYRESLAYERS priests while they are within 18" of that forge.`,
        when: [START_OF_HERO_PHASE],
      },
      {
        name: `Spending the Forge`,
        desc: `Once per battle, at the start of your hero phase, 1 friendly FYRESLAYERS Priest within 6" of the Magmic Battleforge can spend all of the forge's energy. If they do so, until the start of your next hero phase, you can reroll save rolls of 1 for friendly FYRESLAYERS units on the battlefield. Once spent, you can no longer use any features from the forge.

        You cannot use the Molten Blessing ability and the Spending the Forge ability for the same Magmic Battleforge in the same phase.`,
        when: [START_OF_HERO_PHASE],
      },
    ],
  },
}

export default tagAs(Scenery, 'scenery')

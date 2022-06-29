import { tagAs } from 'factions/metatagger'
import { DURING_GAME, END_OF_CHARGE_PHASE, START_OF_SETUP } from 'types/phases'

const Scenery = {
  'Awakened Wyldwood': {
    effects: [
      {
        name: `Setup`,
        desc: `After territories are determined, you can set up this faction terrain feature wholly within your territory and more than 3" from all objectives and other terrain features. If both players can set up faction terrain features at the same time, they must roll off and the winner chooses who sets up their faction terrain features first.

        When you set up this terrain feature, it can be set up as small, medium, or large Awakened Wyldwood. Small consists of 1 scenery piece, medium consists of 2 scenery pieces, and large consists of 3 scenery pieces. 

        If this terrain feature is set up as medium or large, all of its scenery pieces must be set up touching so that they form a circle with an area of open ground inside the circle. This area is considered to be part of the terrain feature.
        
        Abilities that allow you to add Awakened Wyldwood terrain features to the battlefield will tell you how to set them up, and they may also specify the maximum number of pieces. In addition, it must be set up more than 3" from all models, objectives, other terrain features, endless spells and invocations, unless noted otherwise.`,
        when: [START_OF_SETUP],
      },
      {
        name: `Overgrown Wilderness`,
        desc: `Visibility from units with the SYLVANETH keyword is not blocked by this terrain feature.`,
        when: [DURING_GAME],
      },
      {
        name: `Vengeful Forest Spirits`,
        desc: `At the end of the charge phase, roll a dice for each unit that does not have the SYLVANETH keyword that is within 1" of any Awakend Wyldwood. Add 2 to the roll if any WIZARDS or endless spells are within 6" of any Awakend Wyldwood. On a 6+, that unit suffers D3 mortal wounds.`,
        when: [END_OF_CHARGE_PHASE],
      },
    ],
  },
}

export default tagAs(Scenery, 'scenery')

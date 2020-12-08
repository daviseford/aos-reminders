import { tagAs } from 'factions/metatagger'
import { DURING_GAME, END_OF_CHARGE_PHASE, HERO_PHASE, START_OF_SETUP } from 'types/phases'

const Scenery = {
  'Awakened Wyldwood': {
    effects: [
      {
        name: `Setup`,
        desc: `After territories have been chosen but before armies are set up, you can set up the AWAKENED WYLDWOOD anywhere on the battlefield that is more than 3" from any other terrain features, more than 1" from enemy territory and more than 6" away from any objectives.`,
        when: [START_OF_SETUP],
      },
      {
        name: `Overgrown Wilderness`,
        desc: `Models are not visible to each other if an imaginary straight line 1mm wide drawn between the closest points of the two models crosses over more than 1" of an AWAKENED WYLDWOOD. This scenery rule does not apply if either model can fly.`,
        when: [DURING_GAME],
      },
      {
        name: `Roused by Magic`,
        desc: `In the hero phase, if a spell is successfully cast by a WIZARD wholly within 6" of an AWAKENED WYLDWOOD and not unbound, roll a D6 for each unit within 1" of that AWAKENED WYLDWOOD which does not have the SYLVANETH keyword. On a 5+ that unit suffers D3 mortal wounds after that spell's effects have been resolved.`,
        when: [HERO_PHASE],
      },
      {
        name: `Wyldwood`,
        desc: `At the end of the charge phase, roll a D6 for each unit within 1" of an AWAKENED WYLDWOOD which does not have the SYLVANETH keyword. On a 6, that unit suffers D3 mortal wounds.`,
        when: [END_OF_CHARGE_PHASE],
      },
    ],
  },
}

export default tagAs(Scenery, 'scenery')

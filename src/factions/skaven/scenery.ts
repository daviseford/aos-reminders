import { tagAs } from 'factions/metatagger'
import { GenericEffects } from 'generic_rules'
import { END_OF_MOVEMENT_PHASE, HERO_PHASE, START_OF_SETUP } from 'types/phases'

const Scenery = {
  Gnawhole: {
    effects: [
      {
        name: `Setup`,
        desc: `After territories are determined, you can set up this faction terrain feature more than 3" from all objectives and other terrain features, more than 18" from all other Gnawholes in your army, and wholly within 8" of the battlefield edge. If both players can set up faction terrain features at the same time, they must roll off and the winner chooses who sets up their faction terrain features first.`,
        when: [START_OF_SETUP],
      },
      GenericEffects.Impassable,
      {
        name: `Tunnels Through Reality`,
        desc: `Once per turn, at the end of your movement phase, you can pick 1 friendly Skaven unit wholly within 6" of this terrain feature and remove it from the battlefield. Set up that unit again wholly within 6" of a different Gnawhole in your army that does not have any enemy units within 3" of it, and more than 9" from all enemy units.

        Designer's Note: You can use this ability once per turn with each Gnawhole faction terrain feature in your army that is on the battlefield.`,
        when: [END_OF_MOVEMENT_PHASE],
      },
      {
        name: `Aura of the Horned Rat`,
        desc: `Add 1 to chanting rolls for friendly Skaven Priests within 3" of this terrain feature, and add 1 to casting, dispelling and unbinding rolls for friendly Skaven Wizards within 3" of this terrain feature.`,
        when: [HERO_PHASE],
      },
    ],
  },
}

export default tagAs(Scenery, 'scenery')

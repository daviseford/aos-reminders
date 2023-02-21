import { tagAs } from 'factions/metatagger'
import { GenericEffects } from 'generic_rules'
import { DURING_GAME, END_OF_TURN } from 'types/phases'

const Scenery = {
  'Bad Moon Loonshrine': {
    effects: [
      GenericEffects.FactionTerrainSetup_Removable,
      GenericEffects.Impassable,
      {
        name: `Moonclan Lairs`,
        desc: `At the end of each of your turns, you can pick 1 friendly Gloomspite Gitz unit that has been destroyed. The unit picked cannot be a Hero, cannot be Unique, and must have a Wounds characteristic of 5 or less. After you pick a unit that has been destroyed, roll a dice. On a 4+, a replacement unit with half of the models from the unit that was destroyed (rounding up) is added to your army. Set up that unit wholly within 1 2" of a Bad Moon Loonshrine in your army and more than 3" from all enemy units. Each destroyed unit can only be replaced once, and replacement units cannot themselves be replaced. Replacement Moonclan Stabbas and Moonclan Shootas can include up to half as many Netters as the destroyed unit (rounding up).`,
        when: [END_OF_TURN],
      },
      {
        name: `Effigy of Da Bad Moon`,
        desc: `Gloomspite Gitz units are affected by the light of the Bad Moon while they are wholly within 12" of this terrain feature.`,
        when: [DURING_GAME],
      },
    ],
  },
}

export default tagAs(Scenery, 'scenery')

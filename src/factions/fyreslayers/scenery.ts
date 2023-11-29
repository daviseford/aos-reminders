import { TItemDescriptions } from 'factions/factionTypes'
import { tagAs } from 'factions/metatagger'
import { GenericEffects } from 'generic_rules'
import { START_OF_HERO_PHASE } from 'types/phases'

const Scenery = {
  'Magmic Battleforge': {
    effects: [
      GenericEffects.FactionTerrainSetup,
      GenericEffects.Impassable,
      {
        name: `Molten Blessing`,
        desc: `At the start of your hero phase, you can pick 1 friendly FYRESLAYERS PRIEST within 6" of this terrain feature to control its magmic energies. If you do so, until the end of that phase, add 1 to chanting rolls for friendly FYRESLAYERS PRIESTS within 18" of this terrain feature. You cannot use this terrain feature's Molten Blessing ability and its Spending the Forge ability in the same phase.`,
        when: [START_OF_HERO_PHASE],
      },
      {
        name: `Spending the Forge`,
        desc: `Once per battle, at the start of your hero phase, instead of using this terrain feature's Molten Blessing ability, you can pick 1 friendly FYRESLAYERS PRIEST within 6" of this terrain feature to spend all of its energy. If you do so, until the start of your next hero phase, friendly FYRESLAYERS units on the battlefield have a ward of 6+. However, for the rest of the battle, FYRESLAYERS PRIESTS can no longer use this terrain feature's Molten Blessing ability.`,
        when: [START_OF_HERO_PHASE],
      },
    ],
  },
} satisfies TItemDescriptions

export default tagAs(Scenery, 'scenery')

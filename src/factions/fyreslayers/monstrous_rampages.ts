import { TItemDescriptions } from 'factions/factionTypes'
import { tagAs } from 'factions/metatagger'
import { END_OF_CHARGE_PHASE } from 'types/phases'

const MonstrousRampages = {
  'Rearing Punches': {
    effects: [
      {
        name: `Rearing Punches`,
        desc: `Pick 1 enemy unit within 3" of this unit and roll 2 dice. Add 2 to each roll if that unit is a MONSTER. For each 5+, that unit suffers D3 mortal wounds.`,
        when: [END_OF_CHARGE_PHASE],
      },
    ],
  },
  'Magma-fuelled Grasp': {
    effects: [
      {
        name: `Magma-fuelled Grasp`,
        desc: `Pick 1 enemy MONSTER within 3" of this unit and roll a dice. On a 3+, improve the Rend characteristic of melee weapons used by other friendly LOFNIR DROTHKEEPERS units that target that MONSTER by 1 in the following combat phase.`,
        when: [END_OF_CHARGE_PHASE],
      },
    ],
  },
  'Eruption of Ferocity': {
    effects: [
      {
        name: `Eruption of Ferocity`,
        desc: `Pick 1 enemy unit within 3" of this unit and roll a dice. On a 2+, ward rolls cannot be made for models in that unit in the following combat phase.`,
        when: [END_OF_CHARGE_PHASE],
      },
    ],
  },
} satisfies TItemDescriptions

export default tagAs(MonstrousRampages, 'monstrous_rampage')

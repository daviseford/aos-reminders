import { tagAs } from 'factions/metatagger'
import {
  COMBAT_PHASE,
  DURING_GAME,
  END_OF_MOVEMENT_PHASE,
  HERO_PHASE,
  WARDS_PHASE,
  WOUND_ALLOCATION_PHASE,
} from 'types/phases'
import { TItemDescriptions } from 'factions/factionTypes'

const CommandTraits = {
  'Shadowy Obfuscation': {
    effects: [
      {
        name: `Shadowy Obfuscation`,
        desc: `This general is not visible to enemy models that are more than 12" away from them.`,
        when: [DURING_GAME],
      },
    ],
  },
  'Feverish Scholar': {
    effects: [
      {
        name: `Feverish Scholar`,
        desc: `Add 1 to casting rolls, dispelling rolls and unbinding rolls for this general. If this general has 6 noble deeds points, add 2 to casting rolls, dispelling rolls and unbinding rolls for this general instead of 1.`,
        when: [HERO_PHASE],
      },
    ],
  },
  'Master of the Menagerie': {
    effects: [
      {
        name: `Master of the Menagerie`,
        desc: `When using the Summon Loyal Subjects battle trait, you can pick 1 friendly FLESH-EATER COURTS MONSTER that is not a HERO and that has been destroyed, instead of a unit of SERFS or KNIGHTS. Set up a replacement unit as described in the battle trait and allocate 6 wounds to that replacement MONSTER that cannot be negated. In addition, when that unit is set up, it can be set up wholly within 7" of the edge of the battlefield instead of 6".`,
        when: [END_OF_MOVEMENT_PHASE],
      },
    ],
  },
  'Stronger in Madness': {
    effects: [
      {
        name: `Stronger in Madness`,
        desc: `Add 2 to this general's Wounds characteristic.`,
        when: [WOUND_ALLOCATION_PHASE],
      },
      {
        name: `Stronger in Madness`,
        desc: `While this general has 6 noble deeds points, they have a ward of 5+.`,
        when: [WARDS_PHASE],
      },
    ],
  },

  'Savage Beyond Reason': {
    effects: [
      {
        name: `Savage Beyond Reason`,
        desc: `If the unmodified hit roll for an attack made with a melee weapon by this general is 6, that attack scores 2 hits on the target instead of 1. If this general has 6 noble deeds points, that attack scores 3 hits on the target instead of 2.`,
        when: [COMBAT_PHASE],
      },
    ],
  },

  'Cruel Taskmaster': {
    effects: [
      {
        name: `Cruel Taskmaster`,
        desc: `If this general uses the Muster Guard ability to return models to a unit, reduce the noble deeds cost of each returned model by 1, or if the cost was already 1, you can bring back 1 additional model instead.`,
        when: [END_OF_MOVEMENT_PHASE],
      },
    ],
  },
} satisfies TItemDescriptions

// Always export using tagAs
export default tagAs(CommandTraits, 'command_trait')

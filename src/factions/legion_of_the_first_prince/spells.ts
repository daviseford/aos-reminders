import { TItemDescriptions } from 'factions/factionTypes'
import { tagAs } from 'factions/metatagger'
import { COMBAT_PHASE, HERO_PHASE } from 'types/phases'

const Spells = {
  "The Master's Command": {
    effects: [
      {
        name: `The Master's Command`,
        desc: `Casting value of 7. Pick 1 friendly Legion of the First Prince unit wholly within 12" of the caster and visible. Until the next battle round, if a model from that unit is slain by a melee attack, that model can fight before it is removed from play.`,
        when: [HERO_PHASE],
      },
      {
        name: `The Master's Command`,
        desc: `If a model from the buffed unit is slain by a melee attack that model can fight before it is removed from play.`,
        when: [COMBAT_PHASE],
      },
    ],
  },
} satisfies TItemDescriptions

export default tagAs(Spells, 'spell')

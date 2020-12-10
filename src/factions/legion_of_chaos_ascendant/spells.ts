import { tagAs } from 'factions/metatagger'
import { COMBAT_PHASE, HERO_PHASE, WOUND_ALLOCATION_PHASE } from 'types/phases'

const Spells = {
  // Legion of Chaos Ascendant
  'Bolt of Ruin': {
    effects: [
      {
        name: `Bolt of Ruin`,
        desc: `Casting value of 7. Pick 1 enemy unit within 18" of the caster and visible. Roll a D6. The target suffers D3 mortal wounds if the roll is less than the number of models in the target.`,
        when: [HERO_PHASE],
      },
    ],
  },
  'Echo of Hatred': {
    effects: [
      {
        name: `Echo of Hatred`,
        desc: `Casting value of 7. Pick 1 friendly Chaos Ascendant Daemon unit wholly within 12" and visible. Until the end of the battle round, if a model from the target unit is slain, it may fight before it is removed from play.`,
        when: [HERO_PHASE],
      },
      {
        name: `Echo of Hatred`,
        desc: `If active, when a model from the buffed unit is slain it may fight before it is removed from play.`,
        when: [WOUND_ALLOCATION_PHASE],
      },
    ],
  },
  'Spirit Gouge': {
    effects: [
      {
        name: `Spirit Gouge`,
        desc: `Casting value of 7. Pick 1 enemy unit within 12" and visible. If that unit has the Death keyword, you can reroll melee hit and wound rolls for attacks made against the target by Chaos Ascendant Daemon units until your next hero phase.`,
        when: [HERO_PHASE],
      },
      {
        name: `Spirit Gouge`,
        desc: `If active, you can reroll melee hit and wound rolls for attacks made against the debuffed unit by Chaos Ascendant Daemon units.`,
        when: [COMBAT_PHASE],
      },
    ],
  },
  // Legion of the First Prince Flavor
  'The Master`s Command': {
    effects: [
      {
        name: `The Master's Command`,
        desc: `Casting value of 7. Pick 1 friendly Legion of the First Prince Bloodletters, Plaguebearers, Daemonettes, or Horrors of Tzeentch unit wholly within 12" of the caster and visible. Until the start of your next hero phase, if a model from that unit is slain by a melee attack, that model can fight before it is removed from play.`,
        when: [HERO_PHASE],
      },
      {
        name: `The Master's Command`,
        desc: `If a model from the buffed unit is slain by a melee attack that model can fight before it is removed from play.`,
        when: [COMBAT_PHASE],
      },
    ],
  },
}

export default tagAs(Spells, 'spell')

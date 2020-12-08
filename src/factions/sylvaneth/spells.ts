import { tagAs } from 'factions/metatagger'
import { COMBAT_PHASE, HERO_PHASE } from 'types/phases'

const Spells = {
  Metamorphosis: {
    effects: [
      {
        name: `Metamorphosis`,
        desc: `Casting value of 7. Pick 1 enemy unit within 16" of the caster that is visible to them and roll a number of dice equal to the casting roll. For each 4+ that unit suffers 1 mortal wound. In addition, if that unit is destroyed by the mortal wounds inflicted by this spell, you can set up 1 AWAKENED WYLDWOOD terrain feature wholly within 12" of the last model from that unit to be slain, and more than 3" from terrain features or 1" from any other model or objective, and add it to your army.`,
        when: [HERO_PHASE],
      },
    ],
  },
  'Primal Terror': {
    effects: [
      {
        name: `Primal Terror`,
        desc: `Casting value of 6. Roll 2D6. Each enemy unit within 10" of the caster with a Bravery characteristic lower than this roll suffers D3 mortal wounds (roll separately for each unit)`,
        when: [HERO_PHASE],
      },
    ],
  },
  'Awakening the Wood': {
    effects: [
      {
        name: `Awakening the Wood`,
        desc: `Casting value of 6. Pick 1 friendly AWAKENED WYLDWOOD that is wholly within 30" of the caster. Each enemy unit within 3" of that AWAKENED WYLDWOOD suffers D3 mortal wounds (roll separately for each unit)`,
        when: [HERO_PHASE],
      },
    ],
  },
  'Unleash Spites': {
    effects: [
      {
        name: `Unleash Spites`,
        desc: `Casting value of 5. Roll a number of dice equal to the casting roll for each enemy unit within 9" of the caster. For each 6, that enemy unit suffers 1 mortal wound.`,
        when: [HERO_PHASE],
      },
    ],
  },
  'Roused to Wrath': {
    effects: [
      {
        name: `Roused to Wrath`,
        desc: `Casting value of 7. You can summon 1 unit of 10 DRYADS and add it to your army. The summoned unit must be set up more than 9" from any enemy units, and wholly within 1" of an AWAKENED WYLDWOOD that is within 12" of the caster. The summoned unit cannot move in the following movement phase.`,
        when: [HERO_PHASE],
      },
    ],
  },
  'The Reaping': {
    effects: [
      {
        name: `The Reaping`,
        desc: `Casting value of 6. Pick 1 enemy unit within 12" of the caster that is visible to them and roll 6 dice. For each 5+ that unit suffers 1 mortal wound.`,
        when: [HERO_PHASE],
      },
    ],
  },
  'Might of Kurnoth': {
    effects: [
      {
        name: `Might of Kurnoth`,
        desc: `Casting value of 7. Pick 1 friendly Sylvaneth unit within 12" of the caster that is visible to them. Add 1 to wound rolls for attacks made with melee weapons until the start of your next hero phase.`,
        when: [HERO_PHASE, COMBAT_PHASE],
      },
    ],
  },
}

export default tagAs(Spells, 'spell')

import { HERO_PHASE } from 'types/phases'
import { TSpells } from 'types/army'

// Spells, Prayers, etc. go here
const Spells: TSpells = [
  {
    name: `Wings of Fire (Hammerhal)`,
    effects: [
      {
        name: `Wings of Fire (Hammerhal)`,
        desc: `Casting value 6+. Pick 1 friendly unit that is visible to the caster. Add 1 to run and charge rolls for that unit until the start of your next hero phase. In addition, until the start of your next hero phase, that unit can fly.`,
        when: [HERO_PHASE],
        spell: true,
      },
    ],
  },
  {
    name: `Cindercloud (Hammerhal)`,
    effects: [
      {
        name: `Cindercloud (Hammerhal)`,
        desc: `Casting value 7+. Until the start of your next hero phase, subtract 1 from hit rolls for attacks that target friendly units wholly within 9" of the caster.`,
        when: [HERO_PHASE],
        spell: true,
      },
    ],
  },
  {
    name: `Twin-Tailed Comet (Hammerhal)`,
    effects: [
      {
        name: `Twin-Tailed Comet (Hammerhal)`,
        desc: `Casting value 7+. Pick 1 enemy unit within 18" of the caster that is visible to them. That unit suffers D3 mortal wounds. If that unit has 10 or more models, it suffers D6 mortal wounds instead.`,
        when: [HERO_PHASE],
        spell: true,
      },
    ],
  },
]

export default Spells

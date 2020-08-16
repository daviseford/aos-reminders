import { TSpells } from 'types/army'
import { HERO_PHASE } from 'types/phases'

const Spells: TSpells = [
  // Lore of the Underworlds
  {
    name: `Soul Cage`,
    effects: [
      {
        name: `Soul Cage`,
        desc: `Casting value of 6. Pick an enemy unit within 12" of the caster that is visible to them. Until the start of your next hero phase, that unit cannot retreat. In addition, until your next hero phase, that unit fights at the end of the combat phase.`,
        when: [HERO_PHASE],
      },
    ],
  },
  {
    name: `Spirit Drain`,
    effects: [
      {
        name: `Spirit Drain`,
        desc: `Casting value of 4. Pick an enemy model within 18" of the caster that is visible to them. Roll a number of dice equal to that model's Wounds characteristic. For each 6+, that model's unit suffers 1 mortal wound.`,
        when: [HERO_PHASE],
      },
    ],
  },
  {
    name: `Lifestealer`,
    effects: [
      {
        name: `Lifestealer`,
        desc: `Casting value of 7. Pick an enemy unit within 12" of the caster that is visible to them. That unit suffers D3 mortal wounds. For each mortal wound suffered by the enemy unit, you can heal 1 wound allocated to the caster.`,
        when: [HERO_PHASE],
      },
    ],
  },
  {
    name: `Reaping Scythe`,
    effects: [
      {
        name: `Reaping Scythe`,
        desc: `Casting value of 4. Pick one of the caster's weapons. Until the start of your next hero phase, you can re-roll failed hit and wound rolls for attacks made with that weapon.`,
        when: [HERO_PHASE],
      },
    ],
  },
  {
    name: `Shademist`,
    effects: [
      {
        name: `Shademist`,
        desc: `Casting value of 6. Pick a friendly NIGHTHAUNT unit wholly within 12" of the caster that is visible to them. Subtract 1 from wound rolls for attacks that target that unit until the start of your next hero phase.`,
        when: [HERO_PHASE],
      },
    ],
  },
  {
    name: `Spectral Tether`,
    effects: [
      {
        name: `Spectral Tether`,
        desc: `Casting value of 6. Pick a friendly NIGHTHAUNT HERO within 12" of the caster. Heal D3 wounds that have been allocated to that unit.`,
        when: [HERO_PHASE],
      },
    ],
  },
]

export default Spells

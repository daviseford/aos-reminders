import { TAllegiances } from 'types/army'
import { DURING_GAME, HERO_PHASE, MOVEMENT_PHASE } from 'types/phases'

// This is where we store sub-allegiances such as
// Grand Courts, Hosts, Clans, Glades, Lodges, etc
const Allegiances: TAllegiances = [
  {
    name: `Ymetrica`,
    effects: [
      {
        name: `Overwhelming Heat`,
        desc: `All ZAITREC WIZARDS know Overwhelming Heat. Casting value of 7. Pick 1 enemy unit wholly within 24" of the caster and visible to them. ` + 
        `Halve the Move characteristic of that unit until your next hero phase. ` + 
        `Roll a dice, if the roll is equal to or greater than the unit's Save characteristic, that unit suffers D3 mortal wounds.`,
        when: [HERO_PHASE, MOVEMENT_PHASE]
      }
    ],
  },
  {
    name: `Syar`,
    effects: [
      {
        name: `Overwhelming Heat`,
        desc: `All ZAITREC WIZARDS know Overwhelming Heat. Casting value of 7. Pick 1 enemy unit wholly within 24" of the caster and visible to them. ` + 
        `Halve the Move characteristic of that unit until your next hero phase. ` + 
        `Roll a dice, if the roll is equal to or greater than the unit's Save characteristic, that unit suffers D3 mortal wounds.`,
        when: [HERO_PHASE, MOVEMENT_PHASE]
      }
    ],
  },
  {
    name: `Iliatha`,
    effects: [
      {
        name: `Overwhelming Heat`,
        desc: `All ZAITREC WIZARDS know Overwhelming Heat. Casting value of 7. Pick 1 enemy unit wholly within 24" of the caster and visible to them. ` + 
        `Halve the Move characteristic of that unit until your next hero phase. ` + 
        `Roll a dice, if the roll is equal to or greater than the unit's Save characteristic, that unit suffers D3 mortal wounds.`,
        when: [HERO_PHASE, MOVEMENT_PHASE]
      }
    ],
  },
  {
    name: `Zaitrec`,
    effects: [
      {
        name: `Overwhelming Heat`,
        desc: `All ZAITREC WIZARDS know Overwhelming Heat. Casting value of 7. Pick 1 enemy unit wholly within 24" of the caster and visible to them. ` + 
        `Halve the Move characteristic of that unit until your next hero phase. ` + 
        `Roll a dice, if the roll is equal to or greater than the unit's Save characteristic, that unit suffers D3 mortal wounds.`,
        when: [HERO_PHASE, MOVEMENT_PHASE],
        spell: true
      }
    ],
  },
]

export default Allegiances

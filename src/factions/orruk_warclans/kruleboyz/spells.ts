import { tagAs } from 'factions/metatagger'
import { CHARGE_PHASE, HERO_PHASE } from 'types/phases'

const KruleboyzSpells = {
  // Lore of the Swamp
  'Summon Boggy Mist': {
    effects: [
      {
        name: `Summon Boggy Mist`,
        desc: `Casting value of 7. If successfully cast, until your next hero phase, add 1 to charge rolls for friendly KRULEBOYZ ORRUK units on the battlefield and subtract 1 from charge rolls for other units on the battlefield.`,
        when: [HERO_PHASE],
      },
      {
        name: `Summon Boggy Mist`,
        desc: `If active, until your next hero phase, add 1 to charge rolls for friendly KRULEBOYZ ORRUK units on the battlefield and subtract 1 from charge rolls for other units on the battlefield.`,
        when: [CHARGE_PHASE],
      },
    ],
  },
  'Da Black Pit': {
    effects: [
      {
        name: `Da Black Pit`,
        desc: `Casting value of 7 and a range of 12". If successfully cast, pick 1 enemy unit within range and visible to the caster. Roll a dice for each model in that unit. For each 6, and for each other roll that is equal to or greater than that unit's Save characteristic, that unit suffers 1 mortal wound.`,
        when: [HERO_PHASE],
      },
    ],
  },
  'Choking Mist': {
    effects: [
      {
        name: `Choking Mist`,
        desc: `Casting value of 7 and a range of 24". If successfully cast, pick a point on the battlefield within range and visible to the caster. All units within 6" of that point are affected by choking mist until the start of your next hero phase. While a unit is affected by choking mist, subtract 1 from the Attacks characteristic of melee weapons used by it (to a minimum of 1), and it cannot run.`,
        when: [HERO_PHASE],
      },
    ],
  },
  'Sneaky Miasma': {
    effects: [
      {
        name: `Sneaky Miasma`,
        desc: `Casting value of 6 and a range of 18". If successfully cast, pick 1 friendly KRULEBOYZ MONSTER within range and visible to the caster. That MONSTER can make a normal move.`,
        when: [HERO_PHASE],
      },
    ],
  },
  'Nasty Hex': {
    effects: [
      {
        name: `Nasty Hex`,
        desc: `Casting value of 7 and a range of 12". If successfully cast, pick 1 enemy unit within range and visible to the caster. Until the end of your turn, ward rolls cannot be made for models in that unit.`,
        when: [HERO_PHASE],
      },
    ],
  },
}

export default tagAs(KruleboyzSpells, 'spell')

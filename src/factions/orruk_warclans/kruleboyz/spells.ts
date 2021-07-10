import { tagAs } from 'factions/metatagger'
import { CHARGE_PHASE, HERO_PHASE } from 'types/phases'

const IronjawzSpells = {
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
}

export default tagAs(IronjawzSpells, 'spell')

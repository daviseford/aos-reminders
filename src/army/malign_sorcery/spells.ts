import { HERO_PHASE } from 'types/phases'
import { TSpells } from 'types/army'
import { SHYISH } from 'types/realmscapes'

// Realm Spells
const Spells: TSpells = [
  {
    name: `Sample Spell (${SHYISH})`,
    effects: [
      {
        name: `Something from the spell`,
        desc: `yadda yadda.`,
        when: [HERO_PHASE],
      },
    ],
  },
]

export default Spells

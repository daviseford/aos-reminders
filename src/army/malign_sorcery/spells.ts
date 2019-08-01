import { IEffects, IEntry } from 'types/data'
import { HERO_PHASE } from 'types/phases'
import { TRealms, GHYRAN } from 'types/realmscapes'

interface IRealmEffect extends IEffects {
  tag: TRealms
}

interface IRealmSpell extends IEntry {
  effects: IRealmEffect[]
}

// Realm Spells
// Be sure to set the `tag` property to a given realm
const Spells: IRealmSpell[] = [
  {
    name: ``,
    effects: [
      {
        name: ``,
        desc: ``,
        when: [HERO_PHASE],
        tag: GHYRAN,
      },
    ],
  },
]

export default Spells

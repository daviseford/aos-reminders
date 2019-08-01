import { IEffects } from 'types/data'
import { HERO_PHASE } from 'types/phases'
import { TRealms, GHYRAN } from 'types/realmscapes'

interface IRealmSpell extends IEffects {
  tag: TRealms
}

// Realm Spells
// Be sure to set the `tag` property to a given realm
const Spells: IRealmSpell[] = [
  {
    name: ``,
    desc: ``,
    when: [HERO_PHASE],
    tag: GHYRAN,
  },
]

export default Spells

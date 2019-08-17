import { uniqBy } from 'lodash'
import { Battalions, Units } from './units'
import Abilities from './abilities'
import Artifacts from './artifacts'
import Scenery from './scenery'
import Spells from './spells'
import Traits from './traits'
import { Battalions as TamurkhansBattalions, Units as TamurkhansUnits } from 'army/tamurkhans_horde/units'

export default {
  Abilities,
  Artifacts,
  Battalions: uniqBy([...Battalions, ...TamurkhansBattalions], 'name'),
  Scenery,
  Spells,
  Traits,
  Units: uniqBy([...Units, ...TamurkhansUnits], 'name'),
}

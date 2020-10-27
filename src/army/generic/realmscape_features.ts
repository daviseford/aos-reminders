import { TEffects } from 'types/data'
import {
  CHARGE_PHASE,
  DURING_GAME,
  HERO_PHASE,
  MOVEMENT_PHASE,
  START_OF_HERO_PHASE,
  WOUND_ALLOCATION_PHASE,
} from 'types/phases'
import { AQSHY, CHAMON, GHUR, GHYRAN, HYSH, SHYISH, ULGU } from 'types/realmscapes'
import { DEADLY, ENTANGLING, HEALING, MYSTICAL, NULLIFICATION, OVERGROWN, VOLCANIC } from 'types/terrain'

const RealmscapeFeatures: TEffects[] = [
  {
    name: `Terminal Lands (${SHYISH})`,
    desc: `Terrain features (including faction terrain) have the ${NULLIFICATION} scenery rule in addition to any other scenery rules that they have.`,
    when: [HERO_PHASE],
  },
  {
    name: `Burning Lands (${AQSHY})`,
    desc: `Terrain features (including faction terrain) have the ${VOLCANIC} scenery rule in addition to any other scenery rules that they have.`,
    when: [START_OF_HERO_PHASE],
  },
  {
    name: `Transmutative Lands (${CHAMON})`,
    desc: `Terrain features (including faction terrain) have the ${ENTANGLING} scenery rule in addition to any other scenery rules that they have.`,
    when: [MOVEMENT_PHASE, CHARGE_PHASE],
  },
  {
    name: `Savage Lands (${GHUR})`,
    desc: `Terrain features (including faction terrain) have the ${DEADLY} scenery rule in addition to any other scenery rules that they have.`,
    when: [MOVEMENT_PHASE, CHARGE_PHASE],
  },
  {
    name: `Verdant Lands (${GHYRAN})`,
    desc: `Terrain features (including faction terrain) have the ${HEALING} scenery rule in addition to any other scenery rules that they have.`,
    when: [START_OF_HERO_PHASE],
  },
  {
    name: `Dazzling Lands (${HYSH})`,
    desc: `Terrain features (including faction terrain) have the ${MYSTICAL} scenery rule in addition to any other scenery rules that they have.`,
    when: [WOUND_ALLOCATION_PHASE],
  },
  {
    name: `Dazzling Lands (${ULGU})`,
    desc: `Terrain features (including faction terrain) have the ${OVERGROWN} scenery rule in addition to any other scenery rules that they have.`,
    when: [DURING_GAME],
  },
]

export default RealmscapeFeatures

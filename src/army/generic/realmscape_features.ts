import { TEffects } from 'types/data'
import {
  BATTLESHOCK_PHASE,
  DURING_GAME,
  END_OF_COMBAT_PHASE,
  END_OF_SETUP,
  HERO_PHASE,
  MOVEMENT_PHASE,
  SHOOTING_PHASE,
  START_OF_CHARGE_PHASE,
  START_OF_HERO_PHASE,
  START_OF_MOVEMENT_PHASE,
  CHARGE_PHASE,
} from 'types/phases'
import { AQSHY, CHAMON, GHUR, GHYRAN, HYSH, SHYISH, STYGXX, ULGU } from 'types/realmscapes'
import { ENTANGLING, VOLCANIC, DEADLY, HEALING } from 'types/terrain'

const RealmscapeFeatures: TEffects[] = [
  {
    name: `Life Leeching (${SHYISH})`,
    desc: `Roll a D6. On a 6+, pick an enemy unit. That unit suffers D3 mortal wounds.`,
    when: [START_OF_HERO_PHASE],
  },
  {
    name: `The Winds of Death (${SHYISH})`,
    desc: `Roll a D6. On a 6+, pick an enemy unit, and then roll a D6 for each model in it. For each 5+, that unit suffers 1 mortal wound.`,
    when: [START_OF_HERO_PHASE],
  },
  {
    name: `Haunted Realm (${SHYISH})`,
    desc: `Terrain features have the Sinister scenery rule, in addition to any other scenery rules that they have.`,
    when: [DURING_GAME],
  },
  {
    name: `Eternal War (${SHYISH})`,
    desc: `Add 1 to the Bravery characteristic of all units.`,
    when: [BATTLESHOCK_PHASE],
  },
  { name: `Aetherquake Aftershock (${SHYISH})`, desc: `Add 1 to casting rolls.`, when: [HERO_PHASE] },
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
    name: `Dazzling Glow (${HYSH})`,
    desc: `Subtract 1 from hit rolls made for attacks that target units that are in cover.`,
    when: [DURING_GAME],
  },
  {
    name: `Speed of Light (${HYSH})`,
    desc: `Roll a D6. On a 6+, you can pick a friendly unit. Remove that unit from the battlefield, and then set up it anywhere on the battlefield that is more than 9" from any enemy models. This counts as that unit's move for that movement phase.`,
    when: [START_OF_MOVEMENT_PHASE],
  },
  {
    name: `Domain of Symmetry and Purity (${HYSH})`,
    desc: `Subtract 1 from the Bravery characteristic of CHAOS, DESTRUCTION and DEATH units.`,
    when: [BATTLESHOCK_PHASE],
  },
  {
    name: `Wilderness of Broken Dreams (${HYSH})`,
    desc: `Subtract 1 from the Bravery characteristic of ORDER units.`,
    when: [BATTLESHOCK_PHASE],
  },
  {
    name: `Aetheric Beams of Light (${HYSH})`,
    desc: `One friendly WIZARD can craft an aetherquartz prism instead of attempting to cast any spells in that phase. If they do so, they can attempt to cast one extra spell in each of their future hero phases, and attempt to unbind one extra spell in each future enemy hero phase. A WIZARD cannot craft more than one aetherquartz prism per battle (though your other wizards can do so in future hero phases).`,
    when: [HERO_PHASE],
  },
  {
    name: `Impenetrable Gloom (${ULGU})`,
    desc: `The maximum range of attacks or spells is 6".`,
    when: [DURING_GAME],
  },
  {
    name: `Perpetual Dusk (${ULGU})`,
    desc: `The maximum range of attacks or spells is 12".`,
    when: [DURING_GAME],
  },
  {
    name: `Darkly Shaded (${ULGU})`,
    desc: `The maximum range of attacks or spells is 18".`,
    when: [DURING_GAME],
  },
  {
    name: `Shadowed Mansions (${ULGU})`,
    desc: `Pick one friendly unit that is part of a garrison. You can immediately transfer that unit to a different terrain feature that can have a garrison. The unit cannot be transferred to a terrain feature that is garrisoned by an enemy unit, or if doing so would result in the number of models that can garrison the terrain feature being exceeded. Then roll a D6 for each model you transfer; on a 1 the model being rolled for becomes lost in the shadows and is slain.`,
    when: [START_OF_HERO_PHASE],
  },
  {
    name: `Shadow Realms (${ULGU})`,
    desc: `Pick one friendly unit that has all of its models within 6" of any edge of the battlefield. You can remove that unit from the battlefield, and then set it up more than 9" from any enemy units, and with all models within 6" of a different edge of the battlefield. Then roll a D6 for each model you moved; on a 1 the model being rolled for becomes lost in the shadows and is slain. The unit may not move in the subsequent movement phase.`,
    when: [START_OF_HERO_PHASE],
  },
  {
    name: `Energies of the Midnight Tomb (${STYGXX})`,
    desc: `If the casting roll for a spell is a double, that spell is successfully cast and cannot be unbound.`,
    when: [HERO_PHASE],
  },
]

export default RealmscapeFeatures

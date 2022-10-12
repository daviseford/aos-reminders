import { tagAs } from 'factions/metatagger'
import { LUMINETH_REALMLORDS } from 'meta/factions'
import {
  BATTLESHOCK_PHASE,
  COMBAT_PHASE,
  DURING_GAME,
  HERO_PHASE,
  SAVES_PHASE,
  SHOOTING_PHASE,
  START_OF_HERO_PHASE,
} from 'types/phases'

const BattleTraits = {
  [LUMINETH_REALMLORDS]: {
    effects: [
      {
        name: `Aetherquartz Reserve`,
        desc: `Each Lumineth Realm-Lords unit in your army starts the battle with 1 aetherquartz reserve. Once per phase you can say a unit will use its reserve to trigger 1 aetherquartz ability. However, if you do so, subtract 1 from the unit's Bravery characteristic for the remainder of the battle.`,
        when: [DURING_GAME],
      },
      {
        name: `Aetherquartz Reserve`,
        desc: `If a unit has triggered an aetherquartz ability, subtract 1 from the unit's Bravery characteristic for the remainder of the battle.`,
        when: [BATTLESHOCK_PHASE],
      },
      {
        name: `Aetherquartz Reserve - Heightened Reflexes`,
        desc: `You can say that a unit will use this ability when it is picked to be the target of an attack. If you do so, until the end of that phase, add 1 to save rolls for attacks that target the unit until the end of the phase.`,
        when: [SAVES_PHASE],
      },
      {
        name: `Aetherquartz Reserve - Heightened Senses`,
        desc: `You can say that a unit will use this ability when it is picked to shoot or fight. If you do so, add 1 to hit rolls for attacks made by that unit until the end of the phase.`,
        when: [COMBAT_PHASE, SHOOTING_PHASE],
      },
      {
        name: `Aetherquartz Reserve - Magical Boost`,
        desc: `You can say that a unit will use this ability after it has attempted to cast a spell but before any unbinding rolls are made for that spell. If you do so, you can either add 1 to the casting roll or reroll that casting roll.`,
        when: [HERO_PHASE],
      },
    ],
  },

  'Battle Tactics': {
    effects: [
      {
        name: `Priority Target`,
        desc: `Pick 1 enemy Monster on the battlefield. You complete this tactic if that Monster is slain in this turn by attacks made by any friendly Starshard Ballistas.`,
        when: [START_OF_HERO_PHASE],
      },
      {
        name: `Conserve Aetherquartz`,
        desc: `Pick 1 enemy unit on the battlefield and 1 friendly Lumineth Realm-Lords unit that has at least 1 aetherquartz reserve. You complete this tactic if that enemy unit is destroyed by that Lumineth Realm-Lords unit in this turn and that Lumineth Realm-Lords still has at least 1 aetherquartz reserve at the end of this turn.`,
        when: [START_OF_HERO_PHASE],
      },
      {
        name: `Blind the Enemy`,
        desc: `You complete this tactic if 4 or more spells are successfully cast with different friendly Lumineth Realm-Lords units in this turn.`,
        when: [START_OF_HERO_PHASE],
      },
      {
        name: `Elemental Supremacy`,
        desc: `Pick 1 enemy Hero on the battlefield and 1 friendly Aelementiri unit that has at least 1 aetherquartz reserve. You complete this tactc if that Hero is slain by that Aelementiri unit in this turn.`,
        when: [START_OF_HERO_PHASE],
      },
      {
        name: `Hysh Made Manifest`,
        desc: `You complete this tactic if there are 2 or more endless spells from your army on the battlefield at the end of this turn.`,
        when: [START_OF_HERO_PHASE],
      },
      {
        name: `Ignore the Odds`,
        desc: `When you reveal this battle tactic, pick 1 friendly Lumineth Realm-Lords unit and 1 enemy unit that are within 1" of each other. You complete this tactic if that enemy unit is destroyed in this turn and the Lumineth Realm-Lords unit you picked has not been destroyed.`,
        when: [START_OF_HERO_PHASE],
      },
    ],
  },
}
// Always export using tagAs
export default tagAs(BattleTraits, 'battle_trait')

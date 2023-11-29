import { TItemDescriptions } from 'factions/factionTypes'
import { tagAs } from 'factions/metatagger'
import { START_OF_HERO_PHASE } from 'types/phases'

const BattleTactics = {
  'Priority Target': {
    effects: [
      {
        name: `Priority Target`,
        desc: `Pick 1 enemy Monster on the battlefield. You complete this tactic if that Monster is slain in this turn by attacks made by any friendly Starshard Ballistas.`,
        when: [START_OF_HERO_PHASE],
      },
    ],
  },
  'Conserve Aetherquartz': {
    effects: [
      {
        name: `Conserve Aetherquartz`,
        desc: `Pick 1 enemy unit on the battlefield and 1 friendly Lumineth Realm-Lords unit that has at least 1 aetherquartz reserve. You complete this tactic if that enemy unit is destroyed by that Lumineth Realm-Lords unit in this turn and that Lumineth Realm-Lords still has at least 1 aetherquartz reserve at the end of this turn.`,
        when: [START_OF_HERO_PHASE],
      },
    ],
  },
  'Blind the Enemy': {
    effects: [
      {
        name: `Blind the Enemy`,
        desc: `You complete this tactic if 4 or more spells are successfully cast with different friendly Lumineth Realm-Lords units in this turn.`,
        when: [START_OF_HERO_PHASE],
      },
    ],
  },
  'Elemental Supremacy': {
    effects: [
      {
        name: `Elemental Supremacy`,
        desc: `Pick 1 enemy Hero on the battlefield and 1 friendly Aelementiri unit that has at least 1 aetherquartz reserve. You complete this tactc if that Hero is slain by that Aelementiri unit in this turn.`,
        when: [START_OF_HERO_PHASE],
      },
    ],
  },
  'Hysh Made Manifest': {
    effects: [
      {
        name: `Hysh Made Manifest`,
        desc: `You complete this tactic if there are 2 or more endless spells from your army on the battlefield at the end of this turn.`,
        when: [START_OF_HERO_PHASE],
      },
    ],
  },
  'Ignore the Odds': {
    effects: [
      {
        name: `Ignore the Odds`,
        desc: `When you reveal this battle tactic, pick 1 friendly Lumineth Realm-Lords unit and 1 enemy unit that are within 1" of each other. You complete this tactic if that enemy unit is destroyed in this turn and the Lumineth Realm-Lords unit you picked has not been destroyed.`,
        when: [START_OF_HERO_PHASE],
      },
    ],
  },
} satisfies TItemDescriptions

export default tagAs(BattleTactics, 'battle_tactic')

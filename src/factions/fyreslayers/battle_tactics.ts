import { tagAs } from 'factions/metatagger'
import { START_OF_HERO_PHASE } from 'types/phases'

const BattleTactics = {
  'Circle the Magmadroths': {
    effects: [
      {
        name: `Circle the Magmadroths`,
        desc: `You complete this tactic if, at the end of this turn, any friendly LOFNIR DROTHKEEPERS units are within 6" of the centre of the battlefield and there are 1 or more friendly LOFNIR DROTHKEEPERS units wholly within each large quarter of the battlefield.`,
        when: [START_OF_HERO_PHASE],
      },
    ],
  },
  'Sulphur Seam': {
    effects: [
      {
        name: `Sulphur Seam`,
        desc: `Pick 1 objective that is partially or wholly within enemy territory and 1 terrain feature or faction terrain feature that is partially or wholly within enemy territory and more than 6" from that objective. You complete this tactic if you control both that objective and that terrain feature at the end of this turn.`,
        when: [START_OF_HERO_PHASE],
      },
    ],
  },
  'Igneous Wranglers': {
    effects: [
      {
        name: `Igneous Wranglers`,
        desc: `Pick 1 objective partially or wholly in enemy territory and 1 other objective anywhere on the battlefield. You complete this tactic if you control both objectives at the end of this turn and both are contested by friendly VULKYN FLAMESEEKERS units.`,
        when: [START_OF_HERO_PHASE],
      },
    ],
  },
  'Settle a Grudge': {
    effects: [
      {
        name: `Settle a Grudge`,
        desc: `Each time a friendly unit is destroyed by wounds caused by an attack, make a note of the enemy unit that made that attack (in a 'Book of Grudges', if you wish). When you pick this battle tactic, pick 1 of those enemy units that is still on the battlefield. You complete this tactic if that unit is destroyed during this turn.`,
        when: [START_OF_HERO_PHASE],
      },
    ],
  },
  Beastslayer: {
    effects: [
      {
        name: `Beastslayer`,
        desc: `Pick 1 enemy MONSTER and 1 friendly HERO. You complete this tactic if that MONSTER is slain by wounds caused by attacks made by that HERO during this turn.`,
        when: [START_OF_HERO_PHASE],
      },
    ],
  },
  'Grimnir Knows No Mercy': {
    effects: [
      {
        name: `Grimnir Knows No Mercy`,
        desc: `You complete this tactic at the end of this turn if there are any friendly VULKITE BERZERKERS units on the battlefield and all of them are within 3" of any enemy units.`,
        when: [START_OF_HERO_PHASE],
      },
    ],
  },
  'An Honourable Death': {
    effects: [
      {
        name: `An Honourable Death`,
        desc: `Pick 1 friendly HERO. You complete this tactic if that friendly HERO is slain during this turn and any enemy models were also slain by wounds caused by attacks made by that HERO during this turn.`,
        when: [START_OF_HERO_PHASE],
      },
    ],
  },
  'Seize by Force': {
    effects: [
      {
        name: `Seize by Force`,
        desc: `You can pick this tactic only if you control fewer objectives than your opponent. You complete this tactic if you control more objectives than your opponent at the end of this turn.`,
        when: [START_OF_HERO_PHASE],
      },
    ],
  },
  'An Ignominious Death': {
    effects: [
      {
        name: `An Ignominious Death`,
        desc: `Pick 1 enemy HERO. You complete this tactic if that enemy HERO is slain by wounds caused by an attack made with a Fyresteel Throwing Axe during this turn.`,
        when: [START_OF_HERO_PHASE],
      },
    ],
  },
}

export default tagAs(BattleTactics, 'battle_tactic')

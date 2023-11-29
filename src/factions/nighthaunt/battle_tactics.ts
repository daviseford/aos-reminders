import { tagAs } from 'factions/metatagger'
import { START_OF_HERO_PHASE } from 'types/phases'

const BattleTactics = {
  'Overwhelmed with Dread': {
    effects: [
      {
        name: `Overwhelmed with Dread`,
        desc: `When you reveal this battle tactic, pick 1 enemy unit on the battlefield. You complete this tactic if that unit is affected by the Shriek, Stun and Petrify effects of the Wave of Terror battle trait (pg 58) during this turn.`,
        when: [START_OF_HERO_PHASE],
      },
    ],
  },
  'Tides of Terror': {
    effects: [
      {
        name: `Tides of Terror`,
        desc: `You complete this tactic if at least 2 friendly NIGHTHAUNT units are within 1/2" of the same enemy unit at the end of this turn.`,
        when: [START_OF_HERO_PHASE],
      },
    ],
  },
  'Mass Panic': {
    effects: [
      {
        name: `Mass Panic`,
        desc: `You complete this tactic at the end of this turn if 3 or more enemy units on the battlefield are terrified.`,
        when: [START_OF_HERO_PHASE],
      },
    ],
  },
  'Death by a Thousand Cuts': {
    effects: [
      {
        name: `Death by a Thousand Cuts`,
        desc: `You complete this tactic if an enemy HERO or MONSTER is destroyed by attacks made by a friendly CHAINRASPS or SPIRIT HOST unit during this turn.`,
        when: [START_OF_HERO_PHASE],
      },
    ],
  },
  'One Stop, No Return': {
    effects: [
      {
        name: `One Stop, No Return`,
        desc: `When you reveal this battle tactic, pick 1 objective marker on the battlefield that your opponent controls. You complete this battle tactic if you control that objective marker at the end of this turn and there is a friendly BLACK COACH within 3" of that objective.`,
        when: [START_OF_HERO_PHASE],
      },
    ],
  },
  'Ceaseless Nightmares': {
    effects: [
      {
        name: `Ceaseless Nightmares`,
        desc: `You complete this tactic if 2 or more terrified enemy units fail a battleshock test during this turn.`,
        when: [START_OF_HERO_PHASE],
      },
    ],
  },
}

export default tagAs(BattleTactics, 'battle_tactic')

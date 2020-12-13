import { tagAs } from 'factions/metatagger'
import {
  COMBAT_PHASE,
  DURING_SETUP,
  END_OF_MOVEMENT_PHASE,
  HERO_PHASE,
  SAVES_PHASE,
  START_OF_HERO_PHASE,
  START_OF_MOVEMENT_PHASE,
  WOUND_ALLOCATION_PHASE,
} from 'types/phases'

const RegularBattalions = {
  'The First Cohort': {
    effects: [
      {
        name: `Ceaseless Vigil`,
        desc: `Before you allocate a wound or mortal wound to Nagash, you can pick a friendly Morghast unit from this battalion within 3" of Nagash and roll a D6. On a 3+ the wound or mortal wound is allocated to that unit instead.`,
        when: [WOUND_ALLOCATION_PHASE],
      },
      {
        name: `Eternal Servitude`,
        desc: `If Nagash uses his Deathly Invocation ability on any SUMMONABLE unit from the First Cohort, you can treat the D3 result as 3 instead of rolling the dice.`,
        when: [START_OF_HERO_PHASE],
      },
    ],
  },
  'Lords of Sacrament': {
    effects: [
      {
        name: `Unearthly Focus`,
        desc: `In your hero phase, each WIZARD from the Lords of Sacrament may cast an additional spell whilst they are within 6" of the battalion's Mortis Engine.`,
        when: [HERO_PHASE],
      },
      {
        name: `Swirling Spirits`,
        desc: `In the shooting phase, add 1 to save rolls for units from the Lords of Sacrament whilst they are within 6" of the battalion's Mortis Engine.`,
        when: [SAVES_PHASE],
      },
    ],
  },
  Deathmarch: {
    effects: [
      {
        name: `Unbreaking Ranks`,
        desc: `At the start of your hero phase, you can return 1 slain model to each Deathmarch unit that is within 9" of the battalion's WIGHT KING.`,
        when: [START_OF_HERO_PHASE],
      },
      {
        name: `March of the Dead`,
        desc: `At the start of your hero phase, each unit from this battalion wholly within 12" of the battalion's Wight King and more than 3" from any enemy units can move 4". The units cannot run, or move within 3" of an enemy unit, and the distance to the Wight King must be measured before any of the moves are made.`,
        when: [START_OF_HERO_PHASE],
      },
    ],
  },
  'Castellans of the Crimson Keep': {
    effects: [
      {
        name: `The Shifting Keep`,
        desc: `At the start of the game, after territories have been determined, but before any units have been set up, pick a battlefield edge. Instead of setting up this battalion, you may place it to one side and say that it is set up in the Crimson Keep. At the end of any of your movement phases you may set up any units from this battalion wholly within 6" of the chosen battlefield edge and more than 9" from enemy models.`,
        when: [DURING_SETUP, END_OF_MOVEMENT_PHASE],
      },
      {
        name: `In the Shadow of the Keep`,
        desc: `Whilst they are within 15" of the battlefield edge picked as described in the Shifting Keep ability above, you can reroll failed hit rolls for the Templar Lances or Blades used by units of Blood Knights in this battalion.`,
        when: [COMBAT_PHASE],
      },
    ],
  },
  'Court of Nulahmia': {
    effects: [
      {
        name: `The Adevore`,
        desc: `Whilst she is within 9" of this battalion's Bloodseeker Palanquin, you may reroll failed hit rolls for Neferata if the target is an enemy HERO.`,
        when: [COMBAT_PHASE],
      },
      {
        name: `Scent of Blood`,
        desc: `At the start of your movement phase, units from the Court of Nulahmia that are within 9" of the battalion's Bloodseeker Palanquin may add 4" to their Move characteristic until the end of the phase.`,
        when: [START_OF_MOVEMENT_PHASE],
      },
    ],
  },
  'Nightfall Pack': {
    effects: [
      {
        name: `Swooping Predators`,
        desc: `On any turn in which they completed a successful charge move, add 1 to the Attacks characteristic of the Murderous Fangs and Talons of this battalion's Vargheists.`,
        when: [COMBAT_PHASE],
      },
      {
        name: `Call of the Night`,
        desc: `If Mannfred uses his Deathly Invocation ability on any Skeleton Warriors unit from the Nightfall Pack, you may reroll the D3 result for that unit.`,
        when: [START_OF_HERO_PHASE],
      },
    ],
  },
}

const SuperBattalions = {}

const Battalions = { ...RegularBattalions, ...SuperBattalions }

export default tagAs(Battalions, 'battalion')

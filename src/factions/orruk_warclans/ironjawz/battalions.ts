import { keyPicker, tagAs } from 'factions/metatagger'
import {
  CHARGE_PHASE,
  COMBAT_PHASE,
  DURING_GAME,
  END_OF_HERO_PHASE,
  HERO_PHASE,
  START_OF_HERO_PHASE,
  START_OF_SETUP,
  TURN_ONE_HERO_PHASE,
} from 'types/phases'
import IronjawzCommandAbilities from './command_abilities'

const IronjawzBattalions = {
  Ardfist: {
    mandatory: {
      command_abilities: [keyPicker(IronjawzCommandAbilities, ['Drawn to the Waaagh!'])],
    },
    effects: [],
  },
  BruteFist: {
    effects: [
      {
        name: `Brute Big Boss`,
        desc: `Pick 1 Brute Boss from a unit in this battalion to be the battalion's Big Boss. That model has a Wounds characteristic of 5 instead of 3.`,
        when: [DURING_GAME],
      },
      {
        name: `Green-skinned Battering Ram`,
        desc: `After a model from a unit in this battalion makes a charge move, you can pick 1 enemy unit within 1" of that model and roll a D6. On a 4+, that enemy unit suffers 1 mortal wound. If that model's unit has more than 1 model, roll to determine if a mortal wound is inflicted each time a model from that unit completes its charge move, but do not allocate the mortal wounds until all of the models in that unit have moved.`,
        when: [CHARGE_PHASE],
      },
    ],
  },
  Gorefist: {
    effects: [
      {
        name: `Gore-grunta Big Boss`,
        desc: `Pick 1 Gore-grunta Boss from a unit in this battalion to be the battalion's Big Boss. That model has a Wounds characteristic of 7 instead of 5.`,
        when: [DURING_GAME],
      },
      {
        name: `Da Boss's Big Idea`,
        desc: `Each unit from this battalion that is wholly within 18" of the Big Boss from the same battalion at the start of that hero phase can make a normal move, but cannot run.`,
        when: [TURN_ONE_HERO_PHASE],
      },
    ],
  },
  Ironfist: {
    effects: [
      {
        name: `Ironfist Big Boss`,
        desc: `Pick 1 Brute Boss or Gore-grunta Boss from a unit in this battalion to be the battalion's Big Boss. Add 2 to that model's Wounds characteristic.`,
        when: [DURING_GAME],
      },
      {
        name: `Up and At'Em`,
        desc: `Once in each of your hero phases, the Big Boss from this battalion can use the Mighty Destroyers command ability (pg 55) as if they were a MEGABOSS and without spending 1 command point.`,
        when: [HERO_PHASE],
      },
    ],
  },
  Weirdfist: {
    effects: [
      {
        name: `Weird Energy`,
        desc: `If the WEIRDNOB SHAMAN from this battalion is wholly within 18" of 2 or more units from the same battalion that each have 10 or more models, it can use its Brutal Power ability to attempt to cast Green Puke twice, in addition to any other spells it can cast, instead of only once.`,
        when: [END_OF_HERO_PHASE],
      },
    ],
  },
  'Ironjawz Smasha Boyz': {
    effects: [
      {
        name: `Smash 'em`,
        desc: `You can add 1 to all hit rolls made for Smasha Boyz units in the combat phase whilst they are within 10" of their Warchanter. Note that if the Warchanter uses his Frenzy of Violence ability on a Smasha Boyz unit, you would add 2 to their hit rolls instead.`,
        when: [COMBAT_PHASE],
      },
    ],
  },
  'Da Bossfist': {
    effects: [
      {
        name: `Da Boss 'Imself`,
        desc: `Dakkbad must have the Right Fist of Dakkbad command trait.`,
        when: [START_OF_SETUP],
      },
      {
        name: `Da Boss 'Imself`,
        desc: `If Dakkbad is on the battlefield at the start of your hero phase, roll a D6. On a 4+, you receive 1 extra command point.`,
        when: [START_OF_HERO_PHASE],
      },
      {
        name: `Battlescarred Veterans`,
        desc: `Add 1 to the Attacks characteristic of melee weapons used by models in this battalion (including those used by their mounts).`,
        when: [COMBAT_PHASE],
      },
    ],
  },
}

// Always export using tagAs
export default tagAs(IronjawzBattalions, 'battalion')

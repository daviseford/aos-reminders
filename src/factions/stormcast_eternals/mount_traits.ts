import { tagAs } from 'factions/metatagger'
import {
  COMBAT_PHASE,
  DURING_GAME,
  DURING_SETUP,
  END_OF_COMBAT_PHASE,
  MOVEMENT_PHASE,
  SHOOTING_PHASE,
  START_OF_COMBAT_PHASE,
} from 'types/phases'

const MountTraits = {
  'Lithe-Limbed': {
    effects: [
      {
        name: `Lithe-Limbed`,
        desc: `Add 1 to the move characteristic of this model.`,
        when: [MOVEMENT_PHASE],
      },
    ],
  },
  'Keen-clawed': {
    effects: [
      {
        name: `Keen-clawed`,
        desc: `If the unmodified wound roll for an attack made with this mount's melee weapons is 6, that attack has a rend characteristic of -3.`,
        when: [COMBAT_PHASE],
      },
    ],
  },
  'Savage Loyalty': {
    effects: [
      {
        name: `Savage Loyalty`,
        desc: `If this model is slain by wounds or mortal wounds inflicted by an attack made with an enemy unit's melee weapons, roll a D6. On a 4+ that enemy unit suffers D3 mortal wounds.`,
        when: [COMBAT_PHASE],
      },
    ],
  },
  'Drake-kin': {
    effects: [
      {
        name: `Drake-kin`,
        desc: `Before determining damage for an attack that targets this model that has a Damage characteristic of any value other than 1, roll a D6. On a 5+ change the Damage characteristic of that attack to 1.`,
        when: [DURING_GAME],
      },
    ],
  },
  'Thunder Caller': {
    effects: [
      {
        name: `Thunder Caller`,
        desc: `This model's Storm Breath ability has a range of 16" rather than 12".`,
        when: [SHOOTING_PHASE],
      },
    ],
  },
  'Pack Leader': {
    effects: [
      {
        name: `Pack Leader`,
        desc: `Add 2 to the Attacks characteristic of this model's Claws and Fangs while this model is within 6" of any friendly DRACOTHIAN GUARD models.`,
        when: [COMBAT_PHASE],
      },
    ],
  },
  'Storm-winged': {
    effects: [
      {
        name: `Storm-winged`,
        desc: `After this model has moved, you can pick 1 enemy unit that has any models that this model passed across, and roll a D6. On a 2+ that unit suffers D3 mortal wounds.`,
        when: [MOVEMENT_PHASE],
      },
    ],
  },
  Thunderlord: {
    effects: [
      {
        name: `Thunderlord`,
        desc: `The Roiling Thunderhead from this model's Lord of the Heavens ability has a range of 24" instead of 18".`,
        when: [SHOOTING_PHASE],
      },
    ],
  },
  'Star-branded': {
    effects: [
      {
        name: `Star-branded`,
        desc: `Subtract 1 from the number of wounds allocated to this model (to a minimum of 0) when determining which row on its damage table to use.`,
        when: [COMBAT_PHASE],
      },
    ],
  },
  'Wind Runner': {
    effects: [
      {
        name: `Wind Runner`,
        desc: `When this model Rides the Winds Aetheric, roll an extra dice when determining the distance it can move.`,
        when: [MOVEMENT_PHASE],
      },
    ],
  },
  'Aethereal Stalker': {
    effects: [
      {
        name: `Aethereal Stalker`,
        desc: `When this model is set up, choose an enemy unit. You can reroll failed hit and wound rolls for attacks made with this model's Gryph-charger's Razor Beak and Claws that target that enemy unit.`,
        when: [DURING_SETUP, COMBAT_PHASE],
      },
    ],
  },
  Indefatigable: {
    effects: [
      {
        name: `Indefatigable`,
        desc: `You can reroll run rolls for this model.`,
        when: [MOVEMENT_PHASE],
      },
    ],
  },
  Swiftwing: {
    effects: [
      {
        name: `Swiftwing`,
        desc: `You can reroll run rolls for this model.`,
        when: [MOVEMENT_PHASE],
      },
    ],
  },
  'Lashing Tail': {
    effects: [
      {
        name: `Lashing Tail`,
        desc: `At the end of the combat phase, you can pick an enemy unit within 3" of this model and roll a D6. On a 4+ that unit suffers 1 mortal wound.`,
        when: [END_OF_COMBAT_PHASE],
      },
    ],
  },
  'Steel Pinions': {
    effects: [
      {
        name: `Steel Pinions`,
        desc: `On a 6+, an allocated wound or mortal wound is negated.`,
        when: [DURING_GAME],
      },
    ],
  },
  'Bounding Leap': {
    effects: [
      {
        name: `Bounding Leap`,
        desc: `This model is eligible to fight in the combat phase if it is within 6" of an enemy unit instead of 3", and it can move an extra 3" when it piles in.`,
        when: [COMBAT_PHASE],
      },
    ],
  },
  'Pride Leader': {
    effects: [
      {
        name: `Pride Leader`,
        desc: `Add 1 to hit rolls for attacks made by friendly DRACOLINE units while they are wholly within 9" of this model.`,
        when: [COMBAT_PHASE],
      },
    ],
  },
  'Ear-bursting Roar': {
    effects: [
      {
        name: `Ear-bursting Roar`,
        desc: `At the start of the combat phase you can pick an enemy unit within 3" of this model and roll a D6. On a 4+ subtract 1 from hit rolls for attacks made by that unit until the end of that phase.`,
        when: [START_OF_COMBAT_PHASE],
      },
    ],
  },
}

export default tagAs(MountTraits, 'mount_trait')

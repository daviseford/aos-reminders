import { TArtifacts } from 'types/army'
import {
  BATTLESHOCK_PHASE,
  CHARGE_PHASE,
  COMBAT_PHASE,
  END_OF_COMBAT_PHASE,
  HERO_PHASE,
  SAVES_PHASE,
  SHOOTING_PHASE,
  START_OF_COMBAT_PHASE,
  WOUND_ALLOCATION_PHASE,
} from 'types/phases'
import CommonSonsOfBehematData from './common'

const { BreakerTag, TakerTag, StomperTag } = CommonSonsOfBehematData.TRIBES

const Artifacts: TArtifacts = [
  // Taker Tribe
  {
    name: `Jaws of the Mogalodon ${TakerTag}`,
    effects: [
      {
        name: `Jaws of the Mogalodon ${TakerTag}`,
        desc: `Once per phase, you can reroll 1 hit roll or 1 wound roll for an attack made by the bearer, or 1 save roll for an attack that targets the bearer. You cannot use this ability to reroll more than one dice for the bearer in the same phase.`,
        when: [HERO_PHASE, COMBAT_PHASE, SHOOTING_PHASE],
      },
    ],
  },
  {
    name: `Wallopin' Tentacle ${TakerTag}`,
    effects: [
      {
        name: `Wallopin' Tentacle ${TakerTag}`,
        desc: `At the start of the combat phase, you can pick 1 enemy HERO within 3" of the bearer and roll a dice, On a 4+, that HERO suffers 1 mortal wound, and you can reroll hit rolls of 1 for attacks that target that HERO until the end of that phase,`,
        when: [START_OF_COMBAT_PHASE],
      },
    ],
  },
  {
    name: `Jar of Burny Grog ${TakerTag}`,
    effects: [
      {
        name: `Jar of Burny Grog ${TakerTag}`,
        desc: `Once per battle, at the start of the combat phase, you can pick 1 enemy unit within 3" of the bearer and roll a dice. On a 2+, that unit suffers D3 mortal wounds and, until the end of that phase, you can reroll wounds rolls for attacks made by friendly GARGANTS that target that unit. On a 1, the bearer suffers mortal wounds.`,
        when: [START_OF_COMBAT_PHASE],
      },
    ],
  },
  {
    name: `Net of the Beast-reaver ${TakerTag}`,
    effects: [
      {
        name: `Net of the Beast-reaver ${TakerTag}`,
        desc: `At the start of the combat phase, you can pick 1 enemy MONSTER within 3" of the bearer and roll a dice. On a 4+, until the end of that phase, subtract 1 from hit rolls for attacks made by that MONSTER, and you can add 1 to hit rolls for attacks that target that MONSTER.`,
        when: [START_OF_COMBAT_PHASE],
      },
    ],
  },
  {
    name: `Glowy Lantern ${TakerTag}`,
    effects: [
      {
        name: `Glowy Lantern ${TakerTag}`,
        desc: `The bearer can attempt to cast 1 spell in your hero phase and unbind 1 spell in the enemy hero phase, in the same manner as a WIZARD. The bearer knows the Arcane Bolt and Mystic Shield spells.`,
        when: [HERO_PHASE],
      },
    ],
  },
  {
    name: `Krakenskin Sandals ${TakerTag}`,
    effects: [
      {
        name: `Krakenskin Sandals ${TakerTag}`,
        desc: `The bearer's Almighty Stomp has an Attacks characteristic of 3 instead of 2, a Rend characteristic of -3 instead of -2, and a Damage characteristic of 3 instead of D3,`,
        when: [COMBAT_PHASE],
      },
    ],
  },
  // Stomper Tribe
  {
    name: `Ironweld Cestus ${StomperTag}`,
    effects: [
      {
        name: `Ironweld Cestus ${StomperTag}`,
        desc: `You can reroll save rolls for attacks that target the bearer. In addition, if the rerolled save roll is an unmodified 6 and the attack was made with a melee weapon, the attacking unit suffers 1 mortal wound after all of its attacks have been resolved.`,
        when: [SAVES_PHASE],
      },
    ],
  },
  {
    name: `Club of the First Oak ${StomperTag}`,
    effects: [
      {
        name: `Club of the First Oak ${StomperTag}`,
        desc: `In your hero phase, you can heal 1 wound allocated to the bearer.`,
        when: [HERO_PHASE],
      },
      {
        name: `Club of the First Oak ${StomperTag}`,
        desc: `If the bearer is slain, roll a dice before the bearer's model is removed from play. On a 4+, the wound or mortal wound is negated and the bearer is not slain, and any wounds that remain to be allocated to the bearer are negated.`,
        when: [WOUND_ALLOCATION_PHASE],
      },
    ],
  },
  {
    name: `Mantle of the Destroyer ${StomperTag}`,
    effects: [
      {
        name: `Mantle of the Destroyer ${StomperTag}`,
        desc: `Friendly GARGANTS have a Bravery characteristic of 10 while they are within 12" of the bearer.`,
        when: [BATTLESHOCK_PHASE],
      },
      {
        name: `Mantle of the Destroyer ${StomperTag}`,
        desc: `You can reroll charge rolls for friendly GARGANTS that are within 12" of the bearer.`,
        when: [CHARGE_PHASE],
      },
    ],
  },
  // Breaker Tribe
  {
    name: `Enchanted Portcullis ${BreakerTag}`,
    effects: [
      {
        name: `Enchanted Portcullis ${BreakerTag}`,
        desc: `Roll a dice each time you allocate a wound or mortal wound to the bearer. On a 6, that wound or mortal wound is negated.`,
        when: [WOUND_ALLOCATION_PHASE],
      },
    ],
  },
  {
    name: `The Great Wrecka ${BreakerTag}`,
    effects: [
      {
        name: `The Great Wrecka ${BreakerTag}`,
        desc: `If the unmodified hit roll for an attack made with the bearer's Fortcrusha Flail is 6, that attack inflicts 1 mortal wound on the target in addition to any normal damage.`,
        when: [COMBAT_PHASE],
      },
      {
        name: `The Great Wrecka ${BreakerTag}`,
        desc: `When you use the bearer's Smash Down ability, you can add 1 to the dice roll that determines if the terrain feature is reduced to rubble.`,
        when: [END_OF_COMBAT_PHASE],
      },
    ],
  },
  {
    name: `Kingslaughter Cowl ${BreakerTag}`,
    effects: [
      {
        name: `Kingslaughter Cowl ${BreakerTag}`,
        desc: `You can reroll wound rolls of 1 for attacks made by the bearer that target a HERO. In addition, you can reroll wound rolls for attacks made by the bearer that target a general.`,
        when: [COMBAT_PHASE, SHOOTING_PHASE],
      },
    ],
  },
]

export default Artifacts

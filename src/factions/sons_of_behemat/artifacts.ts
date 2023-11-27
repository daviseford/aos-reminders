import { tagAs } from 'factions/metatagger'
import {
  BATTLESHOCK_PHASE,
  CHARGE_PHASE,
  COMBAT_PHASE,
  DURING_GAME,
  HERO_PHASE,
  SHOOTING_PHASE,
  START_OF_COMBAT_PHASE,
  WARDS_PHASE,
} from 'types/phases'

const Artifacts = {
  'Extra-calloused Feet': {
    effects: [
      {
        name: `Extra-calloused Feet`,
        desc: `Model armed with an Almighty Stomp only. The bearer's Almighty Stomp has an Attacks characteristic of 3 instead of 2, a Rend characteristic of -3 instead of -2, and a Damage characteristic of 3 instead of d3.`,
        when: [COMBAT_PHASE],
      },
    ],
  },
  'Glowy Shield of Protectiness': {
    effects: [
      {
        name: `Glowy Shield of Protectiness`,
        desc: `When this unit is targeted by an attack, if the weapon used for that attack has a Rend characteristic of -1, change the Rend characteristic for that attack to '-'. In addition, if the unmodified save roll for an attack made with a melee weapon that targets the bearer is 6, the attacking unit suffers 1 mortal wound after all of its attacks have been resolved.`,
        when: [COMBAT_PHASE, SHOOTING_PHASE],
      },
    ],
  },
  'Scavenger Wake': {
    effects: [
      {
        name: `Scavenger Wake`,
        desc: `Once per battle,at the start of the combat phase, you can pick 1 enemy unit within 3" of the bearer and roll a number of dice equal to the number of models in that unit(to a maximum of 10). For each 4+, that enemy unit suffers 1 mortal wound.`,
        when: [START_OF_COMBAT_PHASE],
      },
    ],
  },
  'Amberbone Totem': {
    effects: [
      {
        name: `Amberbone Totem`,
        desc: `The bearer can attempt a charge even if they ran in the same turn.`,
        when: [COMBAT_PHASE, SHOOTING_PHASE],
      },
    ],
  },
  "Wallopin' Tentacle (Taker Tribe)": {
    effects: [
      {
        name: `Wallopin' Tentacle (Taker Tribe)`,
        desc: `Kraken-Eater only. At the start of the combat phase, you can pick 1 enemy HERO within 3"of the bearer and roll a dice. On a 4+, that HERO suffers D3 mortal wounds and  the strike-last effect applies to that HERO until the end of that phase.`,
        when: [START_OF_COMBAT_PHASE],
      },
    ],
  },
  'Glowy Lantern (Taker Tribe)': {
    effects: [
      {
        name: `Glowy Lantern (Taker Tribe)`,
        desc: `Kraken-Eater only. In your hero phase, the bearer can attempt to cast 1 spell that summons an endless spell in the same manner as a Wizard. When they do so, the range of that spell is doubled.`,
        when: [HERO_PHASE],
      },
    ],
  },
  // Stomper Tribe
  'Club of the First Oak (Stomper Tribe)': {
    effects: [
      {
        name: `Club of the First Oak (Stomper Tribe)`,
        desc: `Warstomper only. In your hero phase, you can heal 1 wound allocated to the bearer. In addition, while the bearer has 25 or more wounds allocated to them, they have a ward of 5+.`,
        when: [HERO_PHASE, WARDS_PHASE],
      },
      {
        name: `Club of the First Oak (Stomper Tribe)`,
        desc: `Warstomper only. In addition, while the bearer has 25 or more wounds allocated to them, they have a ward of 5+.`,
        when: [WARDS_PHASE],
      },
    ],
  },
  'Mantle of the Destroyer (Stomper Tribe)': {
    effects: [
      {
        name: `Mantle of the Destroyer (Stomper Tribe)`,
        desc: `Warstomper only. Friendly Sons of Behemat units within 12" of the bearer have a Bravery characteristic of 10.`,
        when: [BATTLESHOCK_PHASE],
      },
    ],
  },
  // Smasher Tribe
  'The Shatterer (Smasher Tribe)': {
    effects: [
      {
        name: `The Shatterer (Smasher Tribe)`,
        desc: `Beast-Smasher Only. If the unmodified wound roll for an attack made with the bearer's Menhir Club that targets an enemy Hero, Monster, or War Machine is 6, that unit's armour has been shattered. If a unit's armor has been shattered, until the end of the battle, ignore positive modifiers to save rolls for attacks that target that unit.`,
        when: [COMBAT_PHASE, DURING_GAME],
      },
    ],
  },
  'Mantle of Tusks and Horns (Smasher Tribe)': {
    effects: [
      {
        name: `Mantle of Tusks and Horns (Smasher Tribe)`,
        desc: `Beast-Smasher Only. Once per battle, at the start of the combat phase, you can say that the bearer will channel the Waaagh!. If you do so, add 1 to hit rolls for attacks made with melee weapons by friendly Sons of Behemat units until the end of that phase.`,
        when: [START_OF_COMBAT_PHASE],
      },
    ],
  },
  // Breaker Tribe
  'The Great Wrecka (Breaker Tribe)': {
    effects: [
      {
        name: `The Great Wrecka (Breaker Tribe)`,
        desc: `Gatebreaker Only. If the unmodified hit roll for an attack made with the bearer's Fortcrusha Flail is 6, that attack causes D3 mortal wounds to the target in addition to any damage it inflicts.`,
        when: [COMBAT_PHASE],
      },
    ],
  },
  'Kingslaughter Cowl (Breaker Tribe)': {
    effects: [
      {
        name: `Kingslaughter Cowl (Breaker Tribe)`,
        desc: `Gatebreaker Only. Add 1 to wound rolls for attacks made by the bearer that target an enemy Hero.`,
        when: [COMBAT_PHASE, SHOOTING_PHASE],
      },
    ],
  },

  // King Brodd's Stomp Army of Renown
  'Brand of the Gargant King': {
    effects: [
      {
        name: `Brand of the Gargant King`,
        desc: `If the bearer makes a charge move and the unmodified charge roll was 8+, the strike-first effect applies to them until the end of the turn.`,
        when: [CHARGE_PHASE],
      },
    ],
  },
  'Lucky Shiny Hat': {
    effects: [
      {
        name: `Lucky Shiny Hat`,
        desc: `The bearer has a ward of 5+ against mortal wounds.`,
        when: [WARDS_PHASE],
      },
    ],
  },
  'Crafty Creepers': {
    effects: [
      {
        name: `Crafty Creepers`,
        desc: `At the start of the combat phase, you can pick 1 enemy HERO that has an artefact of power and is within 1" of the bearer and roll a dice. On a 5+, that artefact of power can no longer be used (if a weapon was picked when the artefact of power was selected, that weapon reverts to normal).`,
        when: [START_OF_COMBAT_PHASE],
      },
    ],
  },
}

export default tagAs(Artifacts, 'artifact')

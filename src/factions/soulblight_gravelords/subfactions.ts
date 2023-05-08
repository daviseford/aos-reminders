import {
  CHARGE_PHASE,
  COMBAT_PHASE,
  DURING_GAME,
  END_OF_COMBAT_PHASE,
  HERO_PHASE,
  START_OF_COMBAT_PHASE,
  START_OF_HERO_PHASE,
} from 'types/phases'

import Artifacts from './artifacts'
import CommandTraits from './command_traits'
import GrandStrategies from './grand_strategies'
import MountTraits from './mount_traits'
import Spells from './spells'
import Units from './units'

const subFactionBase = {
  artifacts: [Artifacts],
  command_abilities: [],
  command_traits: [CommandTraits],
  grand_strategies: [GrandStrategies],
  mount_traits: [MountTraits],
  spells: [Spells],
  units: [Units],
}

const subFactions = {
  'Legion of Blood': {
    effects: [
      {
        name: `Unparalleled Expertise`,
        desc: `If a friendly LEGION OF BLOOD VAMPIRE HERO is within 3" of any enemy units, it is bloodthirsty. If a friendly LEGION OF BLOOD VAMPIRE HERO is more than 3" from all enemy units, it is empowered. Add 1 to the Attacks characteristic of melee weapons used by a unit that is bloodthirsty. Add 1 to casting, dispelling and unbinding rolls for a unit that is empowered.`,
        when: [DURING_GAME],
      },
      {
        name: `Unparalleled Expertise (Bloodthirsty)`,
        desc: `Add 1 to the Attacks characteristic of melee weapons used by a unit that is bloodthirsty.`,
        when: [COMBAT_PHASE],
      },
      {
        name: `Unparalleled Expertise (Empowered)`,
        desc: `Add 1 to casting, dispelling and unbinding rolls for a unit that is empowered.`,
        when: [HERO_PHASE],
      },
      {
        name: `Heroic Action: Premeditated Bloodshed`,
        desc: `Pick 1 friendly LEGION OF BLOOD VAMPIRE HERO. Until the end of this turn, ward rolls cannot be made for wounds and mortal wounds caused by attacks made by this HERO.`,
        when: [START_OF_HERO_PHASE],
      },
      {
        name: `Heroic Action: Immortal Majesty`,
        desc: `Pick 1 friendly LEGION OF BLOOD VAMPIRE HERO. Until the end of this turn, your opponent must spend 2 command points instead of 1 to issue the All-out Defence and Inspiring Presence commands to enemy units within 12" of that HERO.`,
        when: [START_OF_HERO_PHASE],
      },
    ],
    available: { ...subFactionBase },
  },

  'Legion of Night': {
    effects: [
      {
        name: `Ageless Cunning`,
        desc: `Once per turn, during the enemy charge phase, after an enemy unit finishes a charge move, you can pick 1 friendly LEGION OF NIGHT unit within 12" of that enemy unit and more than 3" from all enemy units. That unit can attempt a charge.`,
        when: [CHARGE_PHASE],
      },
      {
        name: `Heroic Action: Swift Form`,
        desc: `At the start of the hero phase, you can carry out this heroic action with a friendly LEGION OF NIGHT VAMPIRE HERO instead of any other heroic action you can carry out with that HERO. Pick 1 friendly LEGION OF NIGHT VAMPIRE HERO more than 3" from all enemy units. Remove that unit from the battlefield and set it up again on the battlefield more than 9" from all enemy units. That HERO cannot move in the following movement phase.`,
        when: [START_OF_HERO_PHASE],
      },
    ],
    available: { ...subFactionBase },
  },

  'Vyrkos Dynasty': {
    effects: [
      {
        name: `The Strength of the Wolf is the Pack`,
        desc: `In the combat phase, after a friendly VYRKOS HERO has fought for the first time in that phase, you can pick 1 friendly VYRKOS unit that has not yet fought in that combat phase, that is within 3" of an enemy unit and that is wholly within 12" of that friendly VYRKOS HERO. That unit fights immediately.

        Designer's Note: If the unit you pick to fight immediately is a VYRKOS HERO, after that unit has fought, you cannot then use this ability to pick another friendly VYRKOS unit to fight immediately.`,
        when: [COMBAT_PHASE],
      },
      {
        name: `Heroic Action: Pack Alpha`,
        desc: `Pick 1 friendly VYRKOS VAMPIRE HERO. Then, pick 1 friendly VYRKOS DEADWALKERS unit within 12" of that HERO and visible to them. You can add D3 models to that unit.

        Designer's Note: This ability allows a friendly VYRKOS DEADWALKERS unit to be taken above its maximum unit size.`,
        when: [START_OF_HERO_PHASE],
      },
      {
        name: `Heroic Action: Kin of the Wolf`,
        desc: `Pick 1 friendly VYRKOS VAMPIRE HERO. If you do so, you can add 1 unit of 10 Dire Wolves to your army. The unit must be set up wholly within 9" of the HERO carrying out this heroic action and more than 9" from all enemy units. That DIRE WOLVES unit cannot move in the following movement phase. You cannot carry out this heroic action more than once per battle.`,
        when: [START_OF_HERO_PHASE],
      },
    ],
    available: { ...subFactionBase },
  },

  'Kastelai Dynasty': {
    effects: [
      {
        name: `Might of the Crimson Keep`,
        desc: `At the end of the combat phase, if any enemy models were slain by attacks made with melee weapons by a friendly KASTELAI VAMPIRE unit in that phase, you can pick 1 relevant ability below to apply to that friendly unit for the rest of the battle. If more than 1 of the abilities below would apply to that unit, you must pick which ability that unit gains. A unit cannot gain the same ability more than once per battle.

        If the slain model was a HERO or MONSTER:

        Bloodied Strength: Add 1 to the Damage characteristic of that unit's melee weapons (excluding those of its mounts).

        If the slain model had a Wounds characteristic of 3 or more and was not a HERO or MONSTER:

        Seized Fervour: Add 1 to the Attacks characteristic of that unit's melee weapons (excluding those of its mounts).

        If the slain model had a Wounds characteristic of 2 or less:
        
        Absorbed Speed: Add 1" to that unit's Move characteristic.`,
        when: [END_OF_COMBAT_PHASE],
      },
      {
        name: `Heroic Action: Masters of Retaliation`,
        desc: `At the start of the hero phase, you can carry out this heroic action with a friendly KASTELAI VAMPIRE HERO instead of any other heroic action you can carry out with that HERO. Pick 1 friendly KASTELAI VAMPIRE HERO. Until the end of that turn, at the end of each phase, if any wounds or mortal wounds were allocated to that HERO in that phase and that HERO was not slain, roll a dice for each enemy unit within 3" of that HERO. On a 2+, that unit suffers D3 mortal wounds.`,
        when: [START_OF_HERO_PHASE],
      },
    ],
    available: { ...subFactionBase },
  },

  'Avengorii Dynasty': {
    effects: [
      {
        name: `Cursed Abominations`,
        desc: `Once per turn, at the start of the combat phase, you can pick 1 friendly AVENGORII MONSTER within 3" of any enemy units. Until the end of that phase, use the top row on that unit's damage table, regardless of how many wounds it has suffered.`,
        when: [START_OF_COMBAT_PHASE],
      },
    ],
    available: { ...subFactionBase },
  },
}

export default subFactions

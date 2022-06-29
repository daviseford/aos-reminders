import { tagAs } from 'factions/metatagger'
import {
  BATTLESHOCK_PHASE,
  COMBAT_PHASE,
  DURING_GAME,
  END_OF_COMBAT_PHASE,
  HERO_PHASE,
  MOVEMENT_PHASE,
  SHOOTING_PHASE,
  START_OF_HERO_PHASE,
  START_OF_SHOOTING_PHASE,
  WOUND_ALLOCATION_PHASE,
} from 'types/phases'

const CommandTraits = {
  'Verminus Valour': {
    effects: [
      {
        name: `Verminus Valour`,
        desc: `CLANS VERMINUS HERO only. If this general is within 3" of another friendly SKAVEN unit, before you allocate a wound or mortal wound to this general, or instead of making a ward roll for a wound or mortal wound that would be allocated to this general, you can roll a dice. On a 3+, that wound or mortal wound is allocated to that friendly unit instead of this general.`,
        when: [WOUND_ALLOCATION_PHASE],
      },
    ],
  },
  'Savage Overlord': {
    effects: [
      {
        name: `Savage Overlord`,
        desc: `CLANS VERMINUS HERO only. If a friendly SKAVEN unit within 3" of this general fails a battleshock test, you can say that they will restore order with savage brutality. If you do so, that unit has not failed that battleshock test, but it suffers D3 mortal wounds.`,
        when: [BATTLESHOCK_PHASE],
      },
    ],
  },
  'Supreme Manipulator': {
    effects: [
      {
        name: `Supreme Manipulator`,
        desc: `MASTERCLAN HERO only. If you carry out the Heroic Leadership heroic action (core rules, 7.1) with this general, you can reroll the dice that determines whether you receive 1 command point.`,
        when: [START_OF_HERO_PHASE],
      },
    ],
  },
  'Master of Magic': {
    effects: [
      {
        name: `Master of Magic`,
        desc: `MASTERCLAN HERO only. You can reroll casting, dispelling and unbinding rolls for this general.`,
        when: [HERO_PHASE],
      },
    ],
  },
  'Diabolical Schemer': {
    effects: [
      {
        name: `Diabolical Schemer`,
        desc: `MASTERCLAN HERO only. Roll a dice each time an enemy model issues a command within 13" of this general. On a 5+, that command is not received, the command point spent is lost and you receive 1 command point.`,
        when: [DURING_GAME],
      },
    ],
  },
  'Cunning Mutator': {
    effects: [
      {
        name: `Cunning Mutator`,
        desc: `CLANS MOULDER HERO only. If this general is within 3" of another friendly CLANS MOULDER unit, before you allocate a wound or mortal wound to this general, or instead of making a ward roll for a wound or mortal wound that would be allocated to this general, you can roll a dice. On a 3+, that wound or mortal wound is allocated to that friendly unit instead of this general.`,
        when: [WOUND_ALLOCATION_PHASE],
      },
    ],
  },
  'Masterful Scavenger': {
    effects: [
      {
        name: `Masterful Scavenger`,
        desc: `CLANS SKRYRE HERO only. Add 2 to the number of warpstone sparks you can use during a battle if your army includes this general.`,
        when: [DURING_GAME],
      },
    ],
  },
  'Deranged Inventor': {
    effects: [
      {
        name: `Deranged Inventor`,
        desc: `CLANS SKRYRE HERO only At the start of your shooting phase, you can pick 1 friendly CLANS SKRYRE unit wholly within 13" of this general. Add 1 to hit rolls for attacks made with missile weapons by that unit until the end of that phase.`,
        when: [START_OF_SHOOTING_PHASE],
      },
    ],
  },
  'Overseer of Destruction': {
    effects: [
      {
        name: `Overseer of Destruction`,
        desc: `CLANS SKRYRE HERO only. If a friendly unit within 13" of this general that is hiding a WEAPON TEAM is destroyed, the hidden WEAPON TEAM is not destroyed. Instead, before removing the last slain model in the destroyed unit from play, you can set up the hidden WEAPON TEAM wholly within 3" of that model and more than 3" from all enemy units.`,
        when: [WOUND_ALLOCATION_PHASE],
      },
    ],
  },
  'Master of Rot and Ruin': {
    effects: [
      {
        name: `Master of Rot and Ruin`,
        desc: `CLANS PESTILENS HERO only. Add 1 to chanting rolls for this general.`,
        when: [HERO_PHASE],
      },
    ],
  },
  'Architect of Death': {
    effects: [
      {
        name: `Architect of Death`,
        desc: `CLANS PESTILENS HERO only. Add 1 to the Damage characteristic of missile weapons used by friendly PLAGUECLAW units wholly within 18" of this general.`,
        when: [SHOOTING_PHASE],
      },
    ],
  },
  'Ridden with Poxes': {
    effects: [
      {
        name: `Ridden with Poxes`,
        desc: `CLANS PESTILENS HERO only. At the end of the combat phase, roll a dice if this general is within 3" of any enemy units. On a 4+, each enemy unit within 3" of this general suffers D3 mortal wounds.`,
        when: [END_OF_COMBAT_PHASE],
      },
    ],
  },
  'Powerful Alpha': {
    effects: [
      {
        name: `Powerful Alpha`,
        desc: `CLANS VERMINUS HERO only. The first 2 wounds or mortal wounds caused to this general in each phase are negated.`,
        when: [WOUND_ALLOCATION_PHASE],
      },
    ],
  },
  'Devious Adversary': {
    effects: [
      {
        name: `Devious Adversary`,
        desc: `In the combat phase, if this general fights within 3" of an enemy unit that has not yet fought in that phase, add 2 to the Attacks characteristic of this general's melee weapon until the end of that phase.`,
        when: [COMBAT_PHASE],
      },
    ],
  },
  'Moulder Supreme': {
    effects: [
      {
        name: `Moulder Supreme`,
        desc: `CLANS MOULDER HERO only. Add 1 to hit rolls and wound rolls for attacks made by friendly FIGHTING BEAST units wholly within 13" of this general.`,
        when: [COMBAT_PHASE],
      },
    ],
  },
  Hordemaster: {
    effects: [
      {
        name: `Hordemaster`,
        desc: `CLANS MOULDER HERO only. Once per battle, if this general is on the battlefield when a friendly PACK unit is destroyed, you can say that they will call more of their creatures to the fore. If you do so, roll a dice. On a 3+, a new replacement unit identical to the unit that was destroyed is added to your army. Set that unit wholly within 13" of this general and than 9" from all enemy units, A destroyed unit can only be replaced once - replacement units cannot themselves be replaced.`,
        when: [WOUND_ALLOCATION_PHASE],
      },
    ],
  },
  'Unrivalled Killer': {
    effects: [
      {
        name: `Unrivalled Killer`,
        desc: `CLANS ESHIN HERO only. This general counts as 2 CLANS ESHIN HEROES for the purposes of the Masters of Murder battle trait.`,
        when: [COMBAT_PHASE, SHOOTING_PHASE],
      },
    ],
  },
  Shadowmaster: {
    effects: [
      {
        name: `Shadowmaster`,
        desc: `CLANS ESHIN HERO only. This general cannot be picked as the target of attacks made with missile weapons while they are within 1" of a terrain feature.`,
        when: [DURING_GAME],
      },
    ],
  },
  'Incredible Agility': {
    effects: [
      {
        name: `Incredible Agility`,
        desc: `CLANS ESHIN HERO only. This general can fly.`,
        when: [MOVEMENT_PHASE],
      },
      {
        name: `Incredible Agility`,
        desc: `CLANS ESHIN HERO only. You can carry out the Their Finest Hour heroic action (core rules, 7.1) with this general twice in the same battle instead of once.`,
        when: [START_OF_HERO_PHASE],
      },
    ],
  },
}

export default tagAs(CommandTraits, 'command_trait')

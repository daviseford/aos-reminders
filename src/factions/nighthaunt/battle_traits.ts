import { tagAs } from 'factions/metatagger'
import { NIGHTHAUNT } from 'meta/factions'
import {
  CHARGE_PHASE,
  COMBAT_PHASE,
  END_OF_MOVEMENT_PHASE,
  END_OF_SETUP,
  MOVEMENT_PHASE,
  SAVES_PHASE,
  SHOOTING_PHASE,
  START_OF_BATTLESHOCK_PHASE,
  START_OF_ROUND,
} from 'types/phases'

const BattleTraits = {
  [NIGHTHAUNT]: {
    effects: [
      {
        name: `Aura of Dread`,
        desc: `Enemy units are terrified while they are within 3" of any friendly NIGHTHAUNT units. While a unit is terrified, it cannot issue or receive the Inspiring Presence command, This ability has no effect on NIGHTHAUNT units.`,
        when: [START_OF_BATTLESHOCK_PHASE],
      },
      {
        name: `Ethereal`,
        desc: `Friendly NIGHTHAUNT units have a ward of 6+. Ignore modifiers (positive and negative) to save rolls for attacks that target friendly NIGHTHAUNT units.`,
        when: [SAVES_PHASE],
      },
      {
        name: `Ethereal`,
        desc: `Friendly NIGHTHAUNT units can retreat and still charge in the same turn.`,
        when: [MOVEMENT_PHASE, CHARGE_PHASE],
      },
      {
        name: `Frightful Touch`,
        desc: `If the unmodified hit roll for an attack made by a friendly NIGHTHAUNT unit is 6, that attack wounds the target automatically (do not make a wound roll).`,
        when: [COMBAT_PHASE, SHOOTING_PHASE],
      },
      {
        name: `Vanishing Phantasms`,
        desc: `At the end of deployment, before determining control of objectives, you can remove up to 3 friendly NIGHTHAUNT units from the battlefield and place them to one side to be set up in ambush as reserve units. At the end of your movement phase, you can set up 1 or more of the reserve units in ambush on the battlefield, more than 9" from all enemy units.`,
        when: [END_OF_SETUP],
      },
      {
        name: `Vanishing Phantasms`,
        desc: `At the end of your movement phase, you can set up 1 or more of the reserve units in ambush on the battlefield, more than 9" from all enemy units.`,
        when: [END_OF_MOVEMENT_PHASE],
      },
      {
        name: `Wave of Terror`,
        desc: `After a friendly NIGHTHAUNT unit finishes a charge move, you can look up the unmodified charge roll for the charging unit on the Wave of Terror table below, pick 1 enemy unit within 1" of that NIGHTHAUNT unit, and then apply the effect from the table to that enemy unit. If you prefer, you can pick an effect for a lower unmodified charge roll (e.g. if you rolled an 8, you could to apply the Shriek effect instead of the Stun effect).
        
        4-7 | Shriek: Subtract 1 from hit rolls for attacks made by that unit in the following combat phase.
        8-9 | Stun: Subtract 1 from save rolls for attacks that target that unit in the following combat phase.
        10+ | Petrify: The strike-last effect applies to that unit in the following combat.

        Designer's Note: An enemy unit can be affected multiple times by Wave of Terror effects, as long as each effect is applied by an unmodified charge for a different charging NIGHTHAUNT unit. `,
        when: [CHARGE_PHASE],
      },
    ],
  },
  // The Emerald Host
  'The Emerald Host': {
    effects: [
      {
        name: `The Emerald Curse`,
        desc: `After armies have been set up but before the first battle round begins, you can pick up to D3+1 different enemy units on the battlefield. At the end of each battle round, roll a dice for each unit you picked that is on the battlefield. On a 2+, that unit suffers D3 mortal wounds. If that unit is a MONSTER, it suffers D3+1 mortal wounds instead of D3.`,
        when: [END_OF_SETUP],
      },
      {
        name: `The Emerald Curse`,
        desc: `At the end of each battle round, roll a dice for each unit you picked that is on the battlefield. On a 2+, that unit suffers D3 mortal wounds. If that unit is a MONSTER, it suffers D3+1 mortal wounds instead of D3.`,
        when: [START_OF_ROUND],
      },
    ],
  },
  // The Scarlet Doom
  'The Scarlet Doom': {
    effects: [
      {
        name: `Vortex of Frenzied Violence`,
        desc: `After a friendly SCARLET DOOM BLADEGHEIST REVENANTS unit makes a charge move, you can pick 1 enemy unit within of that unit. If you do so, roll a number of dice equal to the number of models from the charging unit. For each 5+, the target suffers 1 mortal wound.`,
        when: [CHARGE_PHASE],
      },
    ],
  },
  // The Quicksilver Dead
  'The Quicksilver Dead': {
    effects: [
      {
        name: `Artisans of Harrowing Death`,
        desc: `Ward rolls cannot be made for wounds caused by attacks made with melee weapons by friendly QUICKSILVER DEAD DREADSCYTHE HARRIDANS units.`,
        when: [SAVES_PHASE],
      },
    ],
  },
  // The Grieving Legion
  'The Grieving Legion': {
    effects: [
      {
        name: `Dragged into Grave`,
        desc: `Enemy units cannot retreat while they are within 3" of any friendly GRIEVING LEGION units with 10 or more models.`,
        when: [MOVEMENT_PHASE],
      },
    ],
  },
}

// Always export using tagAs
export default tagAs(BattleTraits, 'battle_trait')

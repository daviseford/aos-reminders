import { tagAs } from 'factions/metatagger'
import {
  BATTLESHOCK_PHASE,
  CHARGE_PHASE,
  COMBAT_PHASE,
  DURING_GAME,
  END_OF_COMBAT_PHASE,
  END_OF_MOVEMENT_PHASE,
  HERO_PHASE,
  MOVEMENT_PHASE,
  START_OF_COMBAT_PHASE,
  START_OF_HERO_PHASE,
  WOUND_ALLOCATION_PHASE,
} from 'types/phases'

// Store Command Traits here. You can add them to units, abilties, flavors, and subfactions later.
const CommandTraits = {
  // Legion of Blood
  'Premeditated Violence': {
    effects: [
      {
        name: `Premeditated Violence`,
        desc: `If the unmodified hit roll for an attack made with a melee weapon by this general is 6, that attack scores 2 hits on the target instead of 1, Make a wound and save roll for each hit.`,
        when: [COMBAT_PHASE],
      },
    ],
  },
  'Soul-crushing Contempt': {
    effects: [
      {
        name: `Soul-crushing Contempt`,
        desc: `Subtract 1 from the Bravery characteristic of enemy units while they are within 3" of this general.`,
        when: [BATTLESHOCK_PHASE],
      },
    ],
  },
  'Aristocracy of Blood': {
    effects: [
      {
        name: `Aristocracy of Blood`,
        desc: `You can reroll charge rolls for friendly LEGION OF BLOOD units while they are wholly within 12" of this general.`,
        when: [CHARGE_PHASE],
      },
    ],
  },
  'Aura of Dark Majesty': {
    effects: [
      {
        name: `Aura of Dark Majesty`,
        desc: `Subtract 1 from hit rolls for attacks made with melee weapons that target this general.`,
        when: [COMBAT_PHASE],
      },
    ],
  },
  'Walking Death': {
    effects: [
      {
        name: `Walking Death`,
        desc: `If the unmodified wound roll for an attack made with a melee weapon by this general is 6, that attack inflicts a number of mortal wounds equal to the Damage characteristic of the weapon used for the attack and the attack sequence ends (do not make a save roll).`,
        when: [COMBAT_PHASE],
      },
    ],
  },
  'Sanguine Blur': {
    effects: [
      {
        name: `Sanguine Blur`,
        desc: `Friendly units that start a pile-in move wholly within 12" of this general can move an extra 3" when they pile in.`,
        when: [COMBAT_PHASE],
      },
    ],
  },

  // Legion of Night
  'Above Suspicion': {
    effects: [
      {
        name: `Above Suspicion`,
        desc: `If this general is set up in ambush using the Ageless Cunning battle trait, at the end of your movement phase, you can set up this general anywhere on the battlefield more than 9" from all enemy units, instead of wholly within 6" of the battlefield edge.`,
        when: [END_OF_MOVEMENT_PHASE],
      },
    ],
  },

  'Swift Form': {
    effects: [
      {
        name: `Swift Form`,
        desc: `Add 2 to run and charge rolls for this general.`,
        when: [MOVEMENT_PHASE, CHARGE_PHASE],
      },
    ],
  },
  'Unbending Will': {
    effects: [
      {
        name: `Unbending Will`,
        desc: `Do not take battleshock tests for friendly LEGION OF NIGHT units while they are wholly within 12" of this general.`,
        when: [BATTLESHOCK_PHASE],
      },
    ],
  },
  'Merciless Hunter': {
    effects: [
      {
        name: `Merciless Hunter`,
        desc: `Add 1 to wound rolls for attacks made with melee weapons by this general.`,
        when: [COMBAT_PHASE],
      },
    ],
  },
  'Unholy Impetus': {
    effects: [
      {
        name: `Unholy Impetus`,
        desc: `In the combat phase, if any enemy models are slain by attacks made with melee weapons by this general in that phase, add 1 to the Attacks characteristic of melee weapons used by friendly LEGION OF NIGHT units wholly within 12" of this general until the end of that phase.`,
        when: [COMBAT_PHASE],
      },
    ],
  },
  'Terrifying Visage': {
    effects: [
      {
        name: `Terrifying Visage`,
        desc: `Subtract 1 from wound rolls for attacks made with melee weapons that target this general.`,
        when: [COMBAT_PHASE],
      },
    ],
  },

  // Vyrkos Dynasty
  'Pack Alpha': {
    effects: [
      {
        name: `Pack Alpha`,
        desc: `Once per turn, this general can use a command ability without a command point being spent.`,
        when: [DURING_GAME],
      },
    ],
  },
  'Driven by Deathstench': {
    effects: [
      {
        name: `Driven by Deathstench`,
        desc: `You can reroll charge rolls for friendly VYRKOS DYNASTY units wholly within 9" of this general.`,
        when: [CHARGE_PHASE],
      },
    ],
  },
  'Kin of the Wolf': {
    effects: [
      {
        name: `Kin of the Wolf`,
        desc: `Once per battle, at the end of your movement
        phase, you can say that this general will
        summon a pack of Dire Wolves to the
        battlefield. If you do so, you can add 1 unit of
        up to 5 DIRE WOLVES to your army. Set up that
        unit wholly within 9" of this general and more
        than 9" from all enemy units.`,
        when: [END_OF_MOVEMENT_PHASE],
      },
    ],
  },
  "Hunter's Snare": {
    effects: [
      {
        name: `Hunter's Snare`,
        desc: `If this general contests an objective, the number of models this general counts as is equal to their Wounds characteristic.`,
        when: [DURING_GAME],
      },
    ],
  },
  'Spoor Trackers': {
    effects: [
      {
        name: `Spoor Trackers`,
        desc: `At the start of your hero phase, friendly VYRKOS DYNASTY DEADWALKERS units wholly within 9" of this general can make a normal move of up to 3" (they cannot run).`,
        when: [START_OF_HERO_PHASE],
      },
    ],
  },
  'United by Blood': {
    effects: [
      {
        name: `United by Blood`,
        desc: `This general can attempt to unbind 1 spell in the enemy hero phase in the same manner as a WIZARD. If this general is already a WIZARD, they can attempt to unbind 1 extra spell in the enemy hero phase.`,
        when: [HERO_PHASE],
      },
    ],
  },

  // Kastelai Dynasty
  'Beacon of Bloodshed': {
    effects: [
      {
        name: `Beacon of Bloodshed`,
        desc: `After this general makes a charge move, you can pick 1 enemy unit within of this general and roll a dice. On a 3+, that unit suffers D3 mortal wounds.`,
        when: [CHARGE_PHASE],
      },
    ],
  },
  'Master of Retaliation': {
    effects: [
      {
        name: `Master of Retaliation`,
        desc: `At the end of the combat phase, if any wounds or mortal wounds were allocated to this general in that phase and this general was not slain, you can pick 1 enemy unit within 1" of them and roll a dice. On a 2+, that unit suffers D3 mortal wounds.`,
        when: [END_OF_COMBAT_PHASE],
      },
    ],
  },
  'Power in the Blood': {
    effects: [
      {
        name: `Power in the Blood`,
        desc: `If an enemy unit is destroyed within 6" of this general, this general gains the relevant ability from the Might of the Crimson Keep battle trait, even if the enemy unit was not destroyed by this general.`,
        when: [WOUND_ALLOCATION_PHASE],
      },
    ],
  },
  'Rousing Commander': {
    effects: [
      {
        name: `Rousing Commander`,
        desc: `Once per battle, at the start of the combat phase, you can say that this general will rouse their warriors. If you do so, until the end of that phase, friendly KASTELAI DYNASTY VAMPIRE units wholly within 12" of this general benefit from the Bloodied Strength and Stolen Vitality abilities from the Might of the Crimson Keep battle trait (if they have not already gained one or both of them),`,
        when: [START_OF_COMBAT_PHASE],
      },
    ],
  },
  'Swift and Deadly': {
    effects: [
      {
        name: `Swift and Deadly`,
        desc: `You can reroll charge rolls for friendly KASTELAI DYNASTY units while they are wholly within 12" of this general.`,
        when: [CHARGE_PHASE],
      },
    ],
  },
  'A Craving for Massacre': {
    effects: [
      {
        name: `A Craving for Massacre`,
        desc: `This general can run and still charge later in the same turn.`,
        when: [MOVEMENT_PHASE, CHARGE_PHASE],
      },
    ],
  },

  // Avengorii Dynasty
  'Avengorii Dynasty': {
    effects: [
      {
        name: ``,
        desc: ``,
        when: [],
      },
    ],
  },
}

// Always export using tagAs
export default tagAs(CommandTraits, 'command_trait')

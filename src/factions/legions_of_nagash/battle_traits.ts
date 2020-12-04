import { tagAs } from 'factions/metatagger'
import {
  COMBAT_PHASE,
  DURING_GAME,
  DURING_SETUP,
  END_OF_MOVEMENT_PHASE,
  HERO_PHASE,
  SAVES_PHASE,
  START_OF_HERO_PHASE,
  WOUND_ALLOCATION_PHASE,
} from 'types/phases'

const BattleTraits = {
  'Core Legions': {
    effects: [
      {
        name: `Deathless Minions`,
        desc: `Roll a D6 each time you allocate a wound or mortal wound to a friendly DEATH unit within 6" of your general or another friendly DEATH HERO. On a 6+ the wound is negated.`,
        when: [WOUND_ALLOCATION_PHASE],
      },
      {
        name: `The Unquiet Dead`,
        desc: `After territories have been determined, but before any units have been set up, you may pick up to 2 points in your territory and up to 2 points anywhere on the battlefield to be gravesites. You may wish to place suitable markers on these points. Instead of setting up a SUMMONABLE unit on the battlefield, you can place it to one side and say that it is set up in the grave. You can do this with as many units as you wish.`,
        when: [DURING_SETUP],
      },
      {
        name: `The Unquiet Dead`,
        desc: `At the end of your movement phase, for each friendly Death Hero within 9" of a gravesite, you may pick a single friendly unit in the grave and set it up wholly within 9" of the gravesite and more than 9" from any enemy models. Any model that is unable to be set up in this way is slain. If a unit is still in the grave at the end of the battle, it is considered to be slain.`,
        when: [END_OF_MOVEMENT_PHASE],
      },
      {
        name: `Invigorating Aura`,
        desc: `At the start of your hero phase, pick a friendly SUMMONABLE unit within 9" of this gravesite. You can either heal D3 wounds that have been allocated to it or, if no wounds are currently allocated to the unit, you may return a number of slain models to it that have a combined Wounds characteristic equal to or less than the roll of a D3.`,
        when: [START_OF_HERO_PHASE],
      },
      {
        name: `Locus of Shyish`,
        desc: `When you cast any spell from any lore and the unmodified casting roll is 9+, then resolve the spell effect twice.`,
        when: [HERO_PHASE],
      },
    ],
  },
  'Grand Host of Nagash': {
    effects: [
      {
        name: `Chosen Guardians`,
        desc: `Add 1 to the Attacks characteristic of all melee weapons used by GRAND HOST OF NAGASH MORGHAST units.`,
        when: [COMBAT_PHASE],
      },
      {
        name: `Legions Innumerable`,
        desc: `In your hero phase, you may roll a D6 for each friendly GRAND HOST OF NAGASH SUMMONABLE unit on the battlefield. On a 5+ you can heal up to D3 wounds that have been allocated to it. For units with a Wounds characteristic of 1, return 1 slain model to the unit for each wound that would have been healed.`,
        when: [HERO_PHASE],
      },
      {
        name: `Grand Host of Nagash`,
        desc: `This is Nagash's Legion/new overall Death force and it can include any units in the battletome. If it includes Nagash he must be the general.`,
        when: [DURING_SETUP],
      },
    ],
  },
  'Legion of Blood': {
    effects: [
      {
        name: `Favored Retainers`,
        desc: `Legion of Blood Vampire Lords and Blood Knights gain +1 attack.`,
        when: [COMBAT_PHASE],
      },
      {
        name: `Immortal Majesty`,
        desc: `Subtract 1 from bravery for any enemy unit within 6" of any Legion of Blood units.`,
        when: [DURING_GAME],
      },
      {
        name: `Legion of Blood`,
        desc: `This is Neferata's legion, if she is included in this army, she MUST be the army general and if you include any Mortarch units she has to be one of them.`,
        when: [DURING_SETUP],
      },
    ],
  },
  'Legion of Night': {
    effects: [
      {
        name: `The Bait`,
        desc: `Add 1 to save rolls for friendly LEGION OF NIGHT DEATHRATTLE units that are wholly within your territory.`,
        when: [SAVES_PHASE],
      },
      {
        name: `Ageless Cunning`,
        desc: `Instead of setting up a LEGION OF NIGHT unit on the battlefield, you can place it to one side and say that it is set up in ambush. You can do this with up to 3 units.`,
        when: [DURING_SETUP],
      },
      {
        name: `Ageless Cunning`,
        desc: `At the end of any of your movement phases, you can set up any of the units in ambush wholly within 6" of any battlefield edge and more than 9" away from any enemy models.`,
        when: [END_OF_MOVEMENT_PHASE],
      },
      {
        name: `Legion of Night`,
        desc: `This is Mannfred's legion, if he is included in this army he MUST be the army general and if you include any Mortarch units he has to be one of them.`,
        when: [DURING_SETUP],
      },
    ],
  },
  'Legion of Sacrament': {
    effects: [
      {
        name: `The Master's Teachings`,
        desc: `Whenever an enemy unit is destroyed, before removing the last model, you may pick one of your gravesites within 6" of that model. Roll a D6, then remove the model. On a 4+, you may pick a friendly SUMMONABLE unit that has been destroyed and set it up again wholly within 9" of that gravesite and more than 9" from any enemy models.`,
        when: [DURING_GAME],
      },
      {
        name: `The Black Disciples`,
        desc: `Friendly LEGION OF SACRAMENT WIZARDS may add +1 to casting rolls.`,
        when: [HERO_PHASE],
      },
      {
        name: `Legion of Sacrament`,
        desc: `This is Arkhan's legion, if he is included in this army he MUST be the army general and if you include any Mortarch units he has to be one of them.`,
        when: [DURING_SETUP],
      },
    ],
  },
  Soulblight: {
    effects: [
      {
        name: `Locus of Shyish`,
        desc: `When you cast any spell from any lore and the unmodified casting roll is 9+, then resolve the spell effect twice.`,
        when: [HERO_PHASE],
      },
      {
        name: `Deathless Thralls`,
        desc: `Roll a D6 each time you allocate a wound or mortal wound to a friendly SOULBLIGHT unit within 6" of your general or another SOULBLIGHT HERO from your army. On a 6+ the wound is negated.`,
        when: [WOUND_ALLOCATION_PHASE],
      },
    ],
  },
}

// Always export using tagAs
export default tagAs(BattleTraits, 'battle_trait')

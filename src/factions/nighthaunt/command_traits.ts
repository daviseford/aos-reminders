import { tagAs } from 'factions/metatagger'
import {
  COMBAT_PHASE,
  END_OF_COMBAT_PHASE,
  END_OF_MOVEMENT_PHASE,
  SHOOTING_PHASE,
  WARDS_PHASE,
} from 'types/phases'

// Store Command Traits here. You can add them to units, abilities, flavors, and subfactions later.
const CommandTraits = {
  'Hatred of the Living': {
    effects: [
      {
        name: `Hatred of the Living`,
        desc: `You can reroll hit and wound rolls for attacks made with melee weapons by this general that target an enemy unit that does not have the DEATH keyword.`,
        when: [COMBAT_PHASE],
      },
    ],
  },
  'Lingering Spirit': {
    effects: [
      {
        name: `Lingering Spirit`,
        desc: `This general has a ward of 4+ for damage inflicted by mortal wounds.`,
        when: [WARDS_PHASE],
      },
    ],
  },
  'Spiteful Spirit': {
    effects: [
      {
        name: `Spiteful Spirit`,
        desc: `At the end of the combat phase, if this general was allocated any wounds that were not negated during that phase, you can roll a number of dice equal to the Wounds characteristic of this general. For each 4+, each enemy unit within 6" of this general suffers 1 mortal wound.`,
        when: [END_OF_COMBAT_PHASE],
      },
    ],
  },
  'Cloaked in Shadow': {
    effects: [
      {
        name: `Cloaked in Shadow`,
        desc: `This general cannot be picked as the target of a shooting or combat attack by more than 1 unit per phase.`,
        when: [SHOOTING_PHASE, COMBAT_PHASE],
      },
    ],
  },
  'Ruler of the Spectral Hosts': {
    effects: [
      {
        name: `Ruler of the Spectral Hosts`,
        desc: `Once per battle, at the end of your movement phase, you can pick 1 friendly NIGHTHAUNT SUMMONABLE unit that has been destroyed. After you pick a unit that has been destroyed, roll a dice. On a 4+, a new replacement unit with half of the models from the unit that was destroyed (rounding up) is added to your army. Set up that unit wholly within 12" of this general and more than 3" from all enemy units.`,
        when: [END_OF_MOVEMENT_PHASE],
      },
    ],
  },
}

// Always export using tagAs
export default tagAs(CommandTraits, 'command_trait')

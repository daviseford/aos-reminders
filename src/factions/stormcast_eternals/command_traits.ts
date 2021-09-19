import { tagAs } from 'factions/metatagger'
import {
  CHARGE_PHASE,
  COMBAT_PHASE,
  END_OF_MOVEMENT_PHASE,
  SHOOTING_PHASE,
  WOUND_ALLOCATION_PHASE,
} from 'types/phases'

const CommandTraits = {
  // Aspects of Azyr
  'Shock and Awe': {
    effects: [
      {
        name: `Shock and Awe`,
        desc: `If your army is a Scions of the Storm army and this general is on the battlefield at the end of your movement phase, subtract 1 from hit rolls for attacks that target friendly SCIONS OF THE STORM units that were set up in that phase until the end of that turn.`,
        when: [END_OF_MOVEMENT_PHASE, SHOOTING_PHASE, COMBAT_PHASE],
      },
    ],
  },
  'Staunch Defender': {
    effects: [
      {
        name: `Staunch Defender`,
        desc: `You can reroll the dice that determines the number of mortal wounds caused to an enemy unit by a friendly STORMKEEP REDEEMER unit using the Shield of Civilisation battle trait (pg 107) if that friendly unit is wholly within 12" of this general.`,
        when: [CHARGE_PHASE],
      },
    ],
  },
  'Envoy of the Heavens': {
    effects: [
      {
        name: `Envoy of the Heavens`,
        desc: `If a friendly STORMCAST ETERNALS model is slain wholly within 12" of this general, you can add 1 to save rolls for attacks that target the slain model's unit until the end of that phase. The same unit cannot benefit from this ability more than once per turn.`,
        when: [WOUND_ALLOCATION_PHASE],
      },
    ],
  },
  'Master of the Celestial Menagerie': {
    effects: [
      {
        name: `Master of the Celestial Menagerie`,
        desc: `If this general is a MONSTER and is on the battlefield, subtract 1 from wound rolls for attacks made with melee weapons that target friendly STORMCAST ETERNALS MONSTERS.`,
        when: [COMBAT_PHASE],
      },
    ],
  },

 
}

export default tagAs(CommandTraits, 'command_trait')

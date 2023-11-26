import { tagAs } from 'factions/metatagger'
import {
  CHARGE_PHASE,
  COMBAT_PHASE,
  END_OF_MOVEMENT_PHASE,
  SHOOTING_PHASE,
  WOUND_ALLOCATION_PHASE,
} from 'types/phases'
import rule_sources from './rule_sources'

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
        desc: `If this general has the Behemoth battlefield role and is on the battlefield, subtract 1 from wound rolls for attacks made with melee weapons that target friendly STORMCAST ETERNALS units that have the Behemoth battlefield role.`,
        when: [COMBAT_PHASE],
        rule_sources: [rule_sources.BATTLETOME_STORMCAST_ETERNALS, rule_sources.ERRATA_OCTOBER_2021],
      },
    ],
  },
  'Favour the Bold': {
    effects: [
      {
        name: `Favour the Bold`,
        desc: `After this general has fought for the first time in the combat phase, if there are no enemy units within 3" of this general, roll a dice. On a 2+, this general can immediately make a D6" move and can finish that move within 3" of any enemy units.`,
        when: [COMBAT_PHASE],
      },
    ],
  },
}

export default tagAs(CommandTraits, 'command_trait')

import { tagAs } from 'factions/metatagger'
import { CHARGE_PHASE, COMBAT_PHASE, END_OF_MOVEMENT_PHASE, HERO_PHASE } from 'types/phases'

const CommandAbilities = {
  // DoK Allegiance Ability
  'All-out Slaughter': {
    effects: [
      {
        name: `All-out Slaughter`,
        desc: `You can use this command ability when a friendly DAUGHTERS OF KHAINE unit is picked to fight in the combat phase. The command must be issued by a friendly DAUGHTERS OF KHAINE unit and received by the unit that has been picked to fight. If the unmodified hit roll for an attack made by that unit in that phase is a 6, that attack scores 2 hits on the target instead of 1. Make a wound roll and save roll for each hit.`,
        when: [COMBAT_PHASE],
      },
    ],
  },

  // Unit command abilities
  'Orgy of Slaughter': {
    effects: [
      {
        name: `Orgy of Slaughter`,
        desc: `You can use this command ability in your hero phase if this unit is part of your army and on the battlefield. The command can only be issued by this unit, and the unit that receives the command must be a friendly Daughters of Khaine unit within 3" of any enemy units. That unit can fight.`,
        when: [HERO_PHASE],
      },
    ],
  },
  'Worship Through Bloodshed': {
    effects: [
      {
        name: `Worship Through Bloodshed`,
        desc: `You can use this command ability in your hero phase if this unit is part of your army and on the battlefield. The command can only be issued by this unit, and the unit that receives the command must be a friendly Daughters of Khaine unit. That unit can shoot or, if it is within 3" of any enemy units, it can fight.`,
        when: [HERO_PHASE],
      },
    ],
  },
  'Wrath of the Scathborn': {
    effects: [
      {
        name: `Wrath of the Scathborn`,
        desc: `You can use this command ability in your charge phase if this unit is part of your army and on the battlefield. The command can only be issued by this unit, and the unit that receives the command must be a friendly Melusai unit. That unit can attempt a charge even if it ran or shot in the same turn.`,
        when: [CHARGE_PHASE],
      },
    ],
  },
  // Khailebron Flavor
  'Masters of the Shadowpaths': {
    effects: [
      {
        name: `Masters of the Shadowpaths`,
        desc: `You can use this command ability at the end of your movement phase. The command can only be issued by a friendly KHAILEBRON HERO, and the unit that receives the command must be a friendly KHAILEBRON unit. Remove the unit that receives this command from the battlefield and set it up again on the battlefield more than 9" from all enemy units.`,
        when: [END_OF_MOVEMENT_PHASE],
      },
    ],
  },
}

export default tagAs(CommandAbilities, 'command_ability')

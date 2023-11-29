import { tagAs } from 'factions/metatagger'
import { COMBAT_PHASE, START_OF_CHARGE_PHASE, START_OF_COMBAT_PHASE } from 'types/phases'
import rule_sources from './rule_sources'
import { TItemDescriptions } from 'factions/factionTypes'

const CommandAbilities = {
  //MARKS OF CHAOS
  'Let the Blood Flow': {
    effects: [
      {
        name: `Let the Blood Flow`,
        desc: `A friendly KHORNE SLAVES TO DARKNESS unit must receive this command from a KHORNE SLAVES TO DARKNESS HERO. After that unit makes a charge move, pick an enemy unit within 1" and roll a dice. On a 2+ that enemy unit suffers D3 mortal wounds.`,
        when: [START_OF_CHARGE_PHASE],
      },
    ],
  },
  'Bestow Contagion': {
    effects: [
      {
        name: `Bestow Contagion`,
        desc: `A friendly NURGLE SLAVES TO DARKNESS unit must receive this command from a NURGLE SLAVES TO DARKNESS HERO. After this unit fights for the first time in that phase, roll a dice for each enemy unit within 3" of this unit. On a 3+, that unit suffers D3 mortal wounds.`,
        when: [COMBAT_PHASE],
      },
    ],
  },
  'Close in for the Kill': {
    effects: [
      {
        name: `Close in for the Kill`,
        desc: `You can use this command ability at the start of your charge phase. A friendly SLAANESH SLAVES TO DARKNESS unit must receive this command from a SLAANESH SLAVES TO DARKNESS HERO. That unit can run and still charge later in the same turn.`,
        when: [START_OF_CHARGE_PHASE],
      },
    ],
  },
  'Slay Worthy Foes': {
    effects: [
      {
        name: `Slay Worthy Foes`,
        desc: `A friendly Undivided Slaves to Darkness unit must receive this command from a UNDIVIDED SLAVES TO DARKNESS HERO. Until the end of that phase, add 1 to wound rolls for attacks made with melee weapons by that unit that target an enemy Hero or Monster.`,
        when: [START_OF_COMBAT_PHASE],
        rule_sources: [rule_sources.ERRATA_JANUARY_2023],
      },
    ],
  },

  //UNITS
  'By My Will': {
    effects: [
      {
        name: `By My Will`,
        desc: `This is a command ability this unit can issue at the start of the combat phase. Another friendly CHAOS unit must receive it (this unit cannot issue this command to itself). Until the end of that phase, each time a model in the receiving unit is slain it can fight.`,
        when: [START_OF_COMBAT_PHASE],
      },
    ],
  },
} satisfies TItemDescriptions

export default tagAs(CommandAbilities, 'command_ability')

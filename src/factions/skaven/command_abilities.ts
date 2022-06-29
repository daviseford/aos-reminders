import { tagAs } from 'factions/metatagger'
import { COMBAT_PHASE, WOUND_ALLOCATION_PHASE } from 'types/phases'

const CommandAbilities = {
  'Gnash-gnaw on their Bones!': {
    effects: [
      {
        name: `Gnash-gnaw on their Bones!`,
        desc: `You can use this command ability when you pick a friendly Clans Verminus unit to fight in the combat phase. That unit must receive the command. Add 1 to the Attacks characteristic of that unit's melee weapons in that phase.`,
        when: [COMBAT_PHASE],
      },
    ],
  },
  'The Rat King': {
    effects: [
      {
        name: `The Rat King`,
        desc: `You can use this command ability when you pick a friendly Skaven unit to fight in the combat phase. That unit must receive the command. Add 1 to hit rolls and wound rolls for attacks made by that unit until the end of that phase.`,
        when: [COMBAT_PHASE],
      },
    ],
  },
  'Tyrant of Battle': {
    effects: [
      {
        name: `Tyrant of Battle`,
        desc: `You can use this command ability when you pick a friendly Clans Verminus unit to fight in the combat phase. That unit must receive the command. Add 1 to hit rolls and wound rolls for attacks made by that unit until the end of that phase.`,
        when: [COMBAT_PHASE],
      },
    ],
  },
  'Lord of Pestilence': {
    effects: [
      {
        name: `Lord of Pestilence`,
        desc: `You can use this command ability when you pick a friendly Clans Pestilens unit to fight in the combat phase. That unit must receive the command. Add 1 to hit rolls and wound rolls for attacks made by that unit until the end of that phase.`,
        when: [COMBAT_PHASE],
      },
    ],
  },
  'Lord of Assassins': {
    effects: [
      {
        name: `Lord of Assassins`,
        desc: `You can use this command ability when you pick a friendly Clans Eshin unit to fight in the combat phase. That unit must receive the command. Add 1 to hit rolls and wound rolls for attacks made by that unit until the end of that phase.`,
        when: [COMBAT_PHASE],
      },
    ],
  },
  'Unleash More-more Beasts!': {
    effects: [
      {
        name: `Unleash More-more Beasts!`,
        desc: `You can use this command ability if this unit is on the battlefield when a friendly Clans Moulder Pack unit is destroyed. If you do so, roll a dice. On a 3+, a new replacement unit identical to the one that was destroyed is added to your army. Set up that unit wholly within 12" of this unit and more than 9" from all enemy units. Each destroyed unit can only be replaced once - replacement units cannot themselves be replaced.`,
        when: [WOUND_ALLOCATION_PHASE],
      },
    ],
  },
}

export default tagAs(CommandAbilities, 'command_ability')

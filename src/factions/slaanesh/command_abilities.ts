import { tagAs } from 'factions/metatagger'
import { CHARGE_PHASE, COMBAT_PHASE, START_OF_BATTLESHOCK_PHASE, START_OF_COMBAT_PHASE } from 'types/phases'

const CommandAbilities = {
  'Excess of Violence': {
    effects: [
      {
        name: `Excess of Violence`,
        desc: `When it is your turn to pick a unit to fight with, select 1 friendly Hedonite unit that has already fought once in that combat phase and is wholly within 12. That unit can be selected to fight for a second time if it is within 3" of any enemy units. You cannot pick the same unit to benefit from this command ability more than once in the same combat phase."`,
        when: [COMBAT_PHASE],
      },
    ],
  },
  'Regal Authority': {
    effects: [
      {
        name: `Regal Authority`,
        desc: `If this model is your general and is on the battlefield, until the end of this phase, you can reroll hit rolls of 1 for friendly Chaos Slaanesh units while they are wholly with 18" of this model.`,
        when: [START_OF_COMBAT_PHASE],
      },
      {
        name: `Regal Authority`,
        desc: `If this model is your general and is on the battlefield, until the end of that phase, do not take battleshock tests for friendly Chaos Slaanesh units while they are wholly with 18" of this model.`,
        when: [START_OF_BATTLESHOCK_PHASE],
      },
    ],
  },
  'Paragon of Depravity': {
    effects: [
      {
        name: `Paragon of Depravity`,
        desc: `You may pick 1 friendly Hedonite mortal unit wholly within 12". The target unit may reroll hit rolls in this phase.`,
        when: [COMBAT_PHASE],
      },
    ],
  },
  // Lurid Haze Flavor
  'Intoxicating Pall': {
    effects: [
      {
        name: `Intoxicating Pall`,
        desc: `You can use this ability once per turn in this phase. Pick 1 friendly Lurid Haze Invaders Host unit wholly within 12" of a friendly Lurid Haze Invaders Host hero with this ability. Until the end of the phase, add 1 to the save rolls for attacks that target the selected unit. The same unit cannot benefit from this more than once per turn.`,
        when: [COMBAT_PHASE],
      },
    ],
  },
  // Faultless Blades Flavor
  'Armour of Arrogance': {
    effects: [
      {
        name: `Armour of Arrogance`,
        desc: `You can use this ability once per turn. Pick 1 friendly Faultless Blades Pretenders Host unit wholly within 12" of a friendly Faultless Blades Pretenders Host hero with this ability. The first 2 wounds allocated to that unit in this phase are negated.`,
        when: [COMBAT_PHASE],
      },
    ],
  },
  // Scarlet Cavalcade Flavor
  'Vicious Spurs': {
    effects: [
      {
        name: `Vicious Spurs`,
        desc: `Pick 1 friendly Scarlet Cavalcade Godseekers Host unit that made a charge move this turn wholly within 12" of a friendly Scarlet Cavalcade Godseekers Host hero. Until the end of the phase, if the unmodified save roll for an attack that targets the unit is a 6, the attacking unit suffers 1 mortal wound after all its attacks have resolved.`,
        when: [START_OF_COMBAT_PHASE],
      },
      {
        name: `Vicious Spurs`,
        desc: `A unit that charges in this phase will be an eligible target for Vicious Spurs if it is wholly within 12" of a Scarlet Cavalcade Godseekers hero.`,
        when: [CHARGE_PHASE],
      },
    ],
  },
}

export default tagAs(CommandAbilities, 'command_ability')

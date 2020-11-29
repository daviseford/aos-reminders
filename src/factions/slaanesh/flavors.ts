import {
  BATTLESHOCK_PHASE,
  CHARGE_PHASE,
  COMBAT_PHASE,
  DURING_GAME,
  END_OF_SETUP,
  MOVEMENT_PHASE,
  START_OF_CHARGE_PHASE,
  START_OF_COMBAT_PHASE,
  TURN_ONE_END_OF_MOVEMENT_PHASE,
  WOUND_ALLOCATION_PHASE,
} from 'types/phases'

const Flavors = {
  'Lurid Haze': {
    effects: [
      {
        name: `Billowing Mists`,
        desc: `After set up is complete before the first battle round, you can remove D3 friendly Lurid Haze Invaders Host units from the battlefield and say that they are in ambush as reserves (following any battleplan set-up restrictions). At the end of your first movement phase, you must set up these reserves within 6" of a battlefield edge and more than 9" away from any enemy units.`,
        when: [END_OF_SETUP],
      },
      {
        name: `Billowing Mists`,
        desc: `You must set up the selected reserves within 6" of a battlefield edge and more than 9" away from any enemy units.`,
        when: [TURN_ONE_END_OF_MOVEMENT_PHASE],
      },
      {
        name: `Intoxicating Pall`,
        desc: `You can use this ability once per turn in this phase. Pick 1 friendly Lurid Haze Invaders Host unit wholly within 12" of a friendly Lurid Haze Invaders Host hero with this ability. Until the end of the phase, add 1 to the save rolls for attacks that target the selected unit. The same unit cannot benefit from this more than once per turn.`,
        when: [COMBAT_PHASE],
        command_ability: true,
      },
      {
        name: `Feverish Anticipation`,
        desc: `You can reroll run rolls for friendly Lurid Haze Invaders Host units that are wholly within 12" of this general before the run roll is made.`,
        when: [MOVEMENT_PHASE],
        command_trait: true,
      },
      {
        name: `Oil of Exultation`,
        desc: `Add 1 to the wounds characteristic of the bearer.`,
        when: [WOUND_ALLOCATION_PHASE],
        artifact: true,
      },
    ],
  },
  'Faultless Blades': {
    effects: [
      {
        name: `Send Me Your Best`,
        desc: `Add 1 to the hit rolls for melee attacks made by friendly Faultless Blades Pretenders Host units that target a hero if that friendly unit made a charge move this turn.`,
        when: [CHARGE_PHASE, COMBAT_PHASE],
      },
      {
        name: `Armour of Arrogance`,
        desc: `You can use this ability once per turn. Pick 1 friendly Faultless Blades Pretenders Host unit wholly within 12" of a friendly Faultless Blades Pretenders Host hero with this ability. The first 2 wounds allocated to that unit in this phase are negated.`,
        when: [COMBAT_PHASE],
        command_ability: true,
      },
      {
        name: `Contest of Cruelty`,
        desc: `Friendly Faultless Blades Pretenders Host units that start a pile-in move wholly within 12" of this general can move an extra 3" when they pile in.`,
        when: [COMBAT_PHASE],
        command_trait: true,
      },
      {
        name: `Contemptuous Brand`,
        desc: `Add 1 to the wound rolls for melee attacks made with this weapon that target a hero.`,
        when: [COMBAT_PHASE],
        artifact: true,
      },
    ],
  },
  'Scarlet Cavalcade': {
    effects: [
      {
        name: `Excessive Swiftness`,
        desc: `If 2 friendly Scarlet Cavalcade Godseekers Host units that each have 10 or more models are within 6" of each other, you can make 1 charge roll to determine the distance for both units.`,
        when: [START_OF_CHARGE_PHASE],
      },
      {
        name: `Vicious Spurs`,
        desc: `Pick 1 friendly Scarlet Cavalcade Godseekers Host unit that made a charge move this turn wholly within 12" of a friendly Scarlet Cavalcade Godseekers Host hero. Until the end of the phase, if the unmodified save roll for an attack that targets the unit is a 6, the attacking unit suffers 1 mortal wound after all its attacks have resolved.`,
        when: [START_OF_COMBAT_PHASE],
        command_ability: true,
      },
      {
        name: `Vicious Spurs`,
        desc: `A unit that charges in this phase will be an eligible target for Vicious Spurs if it is wholly within 12" of a Scarlet Cavalcade Godseekers hero.`,
        when: [CHARGE_PHASE],
      },
      {
        name: `Embodiment of Haste`,
        desc: `You can reroll battleshock tests for friendly Scarlet Cavalcade Godseekers Host units wholly within 12" of this general.`,
        when: [BATTLESHOCK_PHASE],
        command_trait: true,
      },
      {
        name: `Helm of the Last Rider`,
        desc: `Add 1 to the bravery characteristic of friendly Scarlet Cavalcade Godseekers Host units while they are wholly within 12" of the bearer.`,
        when: [DURING_GAME, BATTLESHOCK_PHASE],
        artifact: true,
      },
    ],
  },
}

export default Flavors

import { TBattalions, TUnits } from 'types/army'
import {
  BATTLESHOCK_PHASE,
  CHARGE_PHASE,
  COMBAT_PHASE,
  DURING_GAME,
  DURING_SETUP,
  END_OF_COMBAT_PHASE,
  END_OF_MOVEMENT_PHASE,
  HERO_PHASE,
  SHOOTING_PHASE,
  TURN_ONE_END_OF_MOVEMENT_PHASE,
} from 'types/phases'

// Unit Names
export const Units: TUnits = [
  {
    name: `Abhorrant Ghoul King`,
    effects: [
      {
        name: `Royal Blood`,
        desc: `In your hero phase, you can heal up to D3 wounds allocated to this model.`,
        when: [HERO_PHASE],
      },
      {
        name: `Summon Men-at-arms`,
        desc: `You can use this command ability at the end of your movement phase. If you do so, pick a friendly model that has this command ability and has not used it before in the battle. That model summons 1 unit of 10 Crypt Ghouls to the battlefield. The summoned unit is added to your army, and must be set up wholly within 6" of the edge of the battlefield and more than 9" from any enemy units.`,
        when: [END_OF_MOVEMENT_PHASE],
        command_ability: true,
      },
    ],
  },
  {
    name: `Abhorrant Ghoul King on Royal Terrorgheist`,
    effects: [
      {
        name: `Death Shriek`,
        desc: `Do not use the attack sequence for an attack made with this model's Death Shriek. Instead roll a D6 and add the Death Shriek value shown on this model's damage table. If the total is higher than the target unit's Bravery characteristic, the target unit suffers a number of mortal wounds equal to the difference between its Bravery characteristic and the total.`,
        when: [SHOOTING_PHASE],
      },
      {
        name: `Gaping Maw`,
        desc: `If the unmodified hit roll for an attack made with this model's Fanged Maw is 6, that attack inflicts 6 mortal wounds on the target unit and the attack sequence ends (do not make a wound or save roll).`,
        when: [COMBAT_PHASE],
      },
      {
        name: `Infested`,
        desc: `If this model is slain, before this model is removed from play each unit within 3" of this model suffers D3 mortal wounds.`,
        when: [DURING_GAME],
      },
      {
        name: `Royal Blood`,
        desc: `In your hero phase, you can heal up to D3 wounds allocated to this model.`,
        when: [HERO_PHASE],
      },
      {
        name: `Summon Royal Guard`,
        desc: `You can use this command ability at the end of your movement phase. If you do so, pick a friendly model that has this command ability and has not used it before in the battle. That model summons 1 unit of 3 Crypt Horrors or 1 unit of 3 Crypt Flayers to the battlefield. The summoned unit is added to your army, and must be set up wholly within 6" of the edge of the battlefield and more than 9" from any enemy units.`,
        when: [END_OF_MOVEMENT_PHASE],
        command_ability: true,
      },
    ],
  },
  {
    name: `Abhorrant Ghoul King on Royal Zombie Dragon`,
    effects: [
      {
        name: `Royal Blood`,
        desc: `In your hero phase, you can heal up to D3 wounds allocated to this model.`,
        when: [HERO_PHASE],
      },
      {
        name: `Summon Courtier`,
        desc: `You can use this command ability at the end of your movement phase. If you do so, pick a friendly model that has this command ability and has not used it before in the battle. That model summons 1 Courtier unit to the battlefield. The summoned unit is added to your army, and must be set up wholly within 6" of the edge of the battlefield and more than 9" from any enemy units.`,
        when: [END_OF_MOVEMENT_PHASE],
        command_ability: true,
      },
      {
        name: `Pestilential Breath`,
        desc: `When you attack with this model's Pestilential Breath, roll a D6 before making the hit roll for the attack. If the roll is less than or equal to the number of models in the target unit, the attack scores a hit without needing to make a hit roll.`,
        when: [SHOOTING_PHASE],
      },
    ],
  },
  {
    name: `Crypt Ghast Courtier`,
    effects: [
      {
        name: `Muster Men-at-arms`,
        desc: `In your hero phase, you can roll 6 dice for each friendly Crypt Ghast Courtier on the battlefield. If you do so, for each 2+, you can return 1 slain model to a friendly Crypt Ghouls unit that is within 10" of that Crypt Ghast Courtier. Slain models can be returned to more than one unit if you wish, but each successful dice roll can only be used to return a model to a single unit.`,
        when: [HERO_PHASE],
      },
      {
        name: `Trophy Hunter`,
        desc: `If any enemy models are slain by wounds inflicted by this model's attacks, until the end of the phase in which the attacks were made add 1 to the Attacks characteristic of melee weapons used by friendly SERFS units while they are wholly within 16" of this model.`,
        when: [COMBAT_PHASE],
      },
    ],
  },
  {
    name: `Crypt Haunter Courtier`,
    effects: [
      {
        name: `Noble Blood`,
        desc: `In your hero phase, you can heal 1 wound allocated to this model.`,
        when: [HERO_PHASE],
      },
      {
        name: `Chosen of the King`,
        desc: `You can re-roll hit rolls for attacks made by this model while it is within 18" of any friendly ABHORRANTS.`,
        when: [COMBAT_PHASE],
      },
      {
        name: `Muster King's Chosen`,
        desc: `In your hero phase, you can roll 6 dice for each friendly Crypt Haunter Courtier on the battlefield. If you do so, for each 5+, you can return 1 slain model to a friendly Crypt Horrors unit that is within 10" of that Crypt Haunter Courtier. Slain models can be returned to more than one unit if you wish, but each successful dice roll can only be used to return a model to a single unit.`,
        when: [HERO_PHASE],
      },
    ],
  },
  {
    name: `Crypt Infernal Courtier`,
    effects: [
      {
        name: `Skewering Strike`,
        desc: `If the unmodified hit roll for an attack made with Skewering Talons is 6, that attack inflicts 1 mortal wound on the target in addition to any normal damage.`,
        when: [COMBAT_PHASE],
      },
      {
        name: `Muster Royal Guard`,
        desc: `In your hero phase, you can roll 6 dice for each friendly Crypt Infernal Courtier on the battlefield. If you do so, for each 5+, you can return 1 slain model to a friendly Crypt Flayers unit that is within 10" of that Crypt Infernal Courtier. Slain models can be returned to more than one unit if you wish, but each successful dice roll can only be used to return a model to a single unit.`,
        when: [HERO_PHASE],
      },
    ],
  },
  {
    name: `Varghulf Courtier`,
    effects: [
      {
        name: `To the King!`,
        desc: `In your hero phase, you can roll 6 dice for each friendly Varghulf Courtier on the battlefield. For each 2+, you can return 1 slain model to a friendly Crypt Ghouls unit that is within 10" of that Varghulf Courtier. For each 5+, you can return 1 slain model to a friendly Crypt Horrors or Crypt Flayers unit that is within 10" of that Varghulf Courtier instead. Slain models can be returned to more than one unit if you wish, but each successful dice roll can only be used to return a model to a single unit.`,
        when: [HERO_PHASE],
      },
      {
        name: `Feed on Dark Magic`,
        desc: `If a friendly ABHORRANT within 18" of this model successfully casts a spell, and it is not unbound, you can re-roll hit rolls for this model until the start of your next hero phase.`,
        when: [COMBAT_PHASE],
      },
      {
        name: `King's Champion`,
        desc: `Add 2 to the Attacks characteristic of this model's Immense Claws if it is within 3" of 10 or more enemy models when you pick the target unit(s) for its attacks.`,
        when: [COMBAT_PHASE],
      },
      {
        name: `Victory Feast`,
        desc: `At the end of the combat phase, if any enemy models were slain by wounds inflicted by this model's attacks in that combat phase, you can heal up to D3 wounds allocated to this model.`,
        when: [END_OF_COMBAT_PHASE],
      },
    ],
  },
  {
    name: `Abhorrant Archregent`,
    effects: [
      {
        name: `Imperial Blood`,
        desc: `In your hero phase, you can heal up to 3 wounds allocated to this model.`,
        when: [HERO_PHASE],
      },
      {
        name: `Summon Imperial Guard`,
        desc: `You can use this command ability at the end of your movement phase. If you do so, pick 1 friendly model that has this command ability and has not used it before in the battle. That model summons 1 of the following units to the battlefield: 1 COURTIER; or 1 unit of up to 3 KNIGHTS; or 1 unit of up to 20 SERFS. The summoned unit is added to your army, and must be set up wholly within 6" of the edge of the battlefield and more than 9" from any enemy units.`,
        when: [END_OF_MOVEMENT_PHASE],
        command_ability: true,
      },
    ],
  },
  {
    name: `Crypt Ghouls`,
    effects: [
      {
        name: `Boundless Ferocity`,
        desc: `Add 1 to the Attacks characteristic of this unit's Sharpened Teeth and Filthy Claws while this unit has 20 or more models.`,
        when: [COMBAT_PHASE],
      },
      {
        name: `Royal Approval`,
        desc: `You can re-roll hit rolls of 1 for attacks made by this unit while it is wholly within 18" of any friendly ABHORRANTS.`,
        when: [COMBAT_PHASE],
      },
    ],
  },
  {
    name: `Crypt Horrors`,
    effects: [
      {
        name: `Chosen of the King`,
        desc: `You can re-roll hit rolls for attacks made by this unit while it is wholly within 18" of any friendly ABHORRANT.`,
        when: [COMBAT_PHASE],
      },
      {
        name: `Noble Blood`,
        desc: `In your hero phase, you can heal 1 wound allocated to this unit.`,
        when: [HERO_PHASE],
      },
      {
        name: `Warrior Elite`,
        desc: `If the unmodified wound roll for an attack made with a Club and Septic Talons is 6, that attack has a Damage characteristic of 3 instead of 2.`,
        when: [COMBAT_PHASE],
      },
    ],
  },
  {
    name: `Crypt Flayers`,
    effects: [
      {
        name: `Death Scream`,
        desc: `Do not use the attack sequence for an attack made with a Death Scream. Instead roll 2D6. Subtract 2 if the target unit is more than 3" from the attacking model. If the result is higher than the target unit's Bravery characteristic, the target unit suffers a number of mortal wounds equal to the difference between its Bravery characteristic and the result.`,
        when: [SHOOTING_PHASE],
      },
      {
        name: `Skewering Strike`,
        desc: `If the unmodified hit roll for an attack made with Piercing Talons is 6, that attack inflicts 1 mortal wound on the target in addition to any normal damage.`,
        when: [COMBAT_PHASE],
      },
    ],
  },
  {
    name: `Royal Terrorgheist`,
    effects: [
      {
        name: `Death Shriek`,
        desc: `Do not use the attack sequence for an attack made with this model's Death Shriek. Instead roll a D6 and add the Death Shriek value shown on this model's damage table. If the total is higher than the target unit's Bravery characteristic, the target unit suffers a number of mortal wounds equal to the difference between its Bravery characteristic and the total.`,
        when: [SHOOTING_PHASE],
      },
      {
        name: `Gaping Maw`,
        desc: `If the unmodified hit roll for an attack made with this model's Fanged Maw is 6, that attack inflicts 6 mortal wounds on the target unit and the attack sequence ends (do not make a wound or save roll).`,
        when: [COMBAT_PHASE],
      },
      {
        name: `Infested`,
        desc: `If this model is slain, before this model is removed from play each unit within 3" of this model suffers D3 mortal wounds.`,
        when: [DURING_GAME],
      },
      {
        name: `Royal Menagerie`,
        desc: `In your hero phase, you can heal up to D3 wounds allocated to this model if this model is within 6" of a friendly ABHORRANT.`,
        when: [HERO_PHASE],
      },
    ],
  },
  {
    name: `Royal Zombie Dragon`,
    effects: [
      {
        name: `Pestilential Breath`,
        desc: `When you attack with this model's Pestilential Breath, roll a D6 before making the hit roll for the attack. If the roll is less than or equal to the number of models in the target unit, the attack scores a hit without needing to make a hit roll.`,
        when: [SHOOTING_PHASE],
      },
    ],
  },
]

// Battalions
export const Battalions: TBattalions = [
  {
    name: `Abattoir`,
    effects: [
      {
        name: `Body-part Acquisition`,
        desc: `At the end of the combat phase, roll 1 dice for each enemy model within 3" of any models from this battalion. For each 6, that enemy model's unit suffers 1 mortal wound.`,
        when: [END_OF_COMBAT_PHASE],
      },
    ],
  },
  {
    name: `Attendants at Court`,
    effects: [
      {
        name: `Loyal Subjects`,
        desc: `You can re-roll hit rolls for attacks made by models from this battalion if your general is an ABHORRANT ARCHREGENT or ABHORRANT GHOUL KING and has not been slain.`,
        when: [COMBAT_PHASE, SHOOTING_PHASE],
      },
    ],
  },
  {
    name: `Deadwatch`,
    effects: [
      {
        name: `The Lord's Own`,
        desc: `In your hero phase, 1 unit from this battalion that is within 3" of an enemy unit can make a pile-in move and then attack with all of the melee weapons it is armed with.`,
        when: [HERO_PHASE],
      },
    ],
  },
  {
    name: `Cannibal Court`,
    effects: [
      {
        name: `Dark Master`,
        desc: `If your general is an ABHORRANT ARCHREGENT or ABHORRANT GHOUL KING from this battalion, treat their warscroll as having the command abilities found on the warscrolls of any other units included in this battalion. 'If your general is from this battalion, he knows all of the command abilities on the warscrolls and battalions included in this battalion. In addition, you start the battle with 3 command points for having this battalion in your army instead of 1.`,
        when: [DURING_GAME],
      },
    ],
  },
  {
    name: `Ghoul Patrol`,
    effects: [
      {
        name: `On Patrol`,
        desc: `Instead of setting up a unit from this battalion on the battlefield, you can place it to one side and say that it is on patrol in reserve. At the end of your first movement phase, you must set up all of the units from this battalion that are in reserve. Set up each unit wholly within 6" of the edge of the battlefield and more than 9" from any enemy units.`,
        when: [DURING_SETUP, TURN_ONE_END_OF_MOVEMENT_PHASE],
      },
    ],
  },
  {
    name: `King's Ghouls`,
    effects: [
      {
        name: `Guardians of the Court`,
        desc: `Do not take battleshock tests for units from this battalion while they are wholly within 18" of the Crypt Ghast Courtier from the same battalion.`,
        when: [BATTLESHOCK_PHASE],
      },
    ],
  },
  {
    name: `Royal Family`,
    effects: [
      {
        name: `Lords of the Manor`,
        desc: `When a friendly COURTIER within 10" of any models from this battalion uses a Muster ability, you can roll 1 extra dice for that COURTIER when determining how many slain models the Muster ability allows you to return (usually this will mean that you roll 7 dice instead of 6 dice).`,
        when: [HERO_PHASE],
      },
    ],
  },
  {
    name: `Royal Menagerie`,
    effects: [
      {
        name: `Monstrous Ensemble`,
        desc: `In your hero phase, you can heal up to D3 wounds allocated to each model from this battalion that is within 5" of any other models from the same battalion.`,
        when: [HERO_PHASE],
      },
    ],
  },
  {
    name: `Royal Mordants`,
    effects: [
      {
        name: `Delusional Discipline`,
        desc: `In your hero phase, pick 1 unit from this battalion wholly within 16" of the Varghulf Courtier from the same battalion. That unit can make a normal move.`,
        when: [HERO_PHASE],
      },
    ],
  },
  {
    name: `The Arcasanctorian Guard`,
    effects: [
      {
        name: `The Arcasanctorian Guard`,
        desc: `Units from this battalion re-roll failed charges and do not take battleshock tests.`,
        when: [CHARGE_PHASE, BATTLESHOCK_PHASE],
      },
    ],
  },
]

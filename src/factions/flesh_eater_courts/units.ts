import { keyPicker, tagAs } from 'factions/metatagger'
import GenericBattleTraits from 'generic_rules/battle_traits'
import {
  COMBAT_PHASE,
  END_OF_COMBAT_PHASE,
  HERO_PHASE,
  SHOOTING_PHASE,
  WOUND_ALLOCATION_PHASE,
} from 'types/phases'
import command_abilities from './command_abilities'
import spells from './spells'

const NobleBloodEffect = {
  name: `Noble Blood`,
  desc: `In your hero phase, you can heal 1 wound allocated to this unit.`,
  when: [HERO_PHASE],
}
const RoyalBloodEffect = {
  name: `Royal Blood`,
  desc: `In your hero phase, you can heal up to D3 wounds allocated to this model.`,
  when: [HERO_PHASE],
}
const ChosenOfTheKingEffect = {
  name: `Chosen of the King`,
  desc: `You can reroll hit rolls for attacks made by this unit while it is wholly within 18" of any friendly ABHORRANT.`,
  when: [COMBAT_PHASE],
}

const Units = {
  'Abhorrant Ghoul King': {
    mandatory: {
      command_abilities: [keyPicker(command_abilities, ['Summon Men-at-arms'])],
      spells: [keyPicker(spells, ['Black Hunger'])],
    },
    effects: [RoyalBloodEffect],
  },
  'Abhorrant Ghoul King on Royal Terrorgheist': {
    mandatory: {
      command_abilities: [keyPicker(command_abilities, ['Summon Royal Guard'])],
      spells: [keyPicker(spells, ['Unholy Vitality'])],
    },
    effects: [...GenericBattleTraits.Terrorgheist, RoyalBloodEffect],
  },
  'Abhorrant Ghoul King on Royal Zombie Dragon': {
    mandatory: {
      command_abilities: [keyPicker(command_abilities, ['Summon Courtier'])],
      spells: [keyPicker(spells, ['Malefic Hunger'])],
    },
    effects: [RoyalBloodEffect, ...GenericBattleTraits.ZombieDragon],
  },
  'Crypt Ghast Courtier': {
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
  'Crypt Haunter Courtier': {
    effects: [
      NobleBloodEffect,
      ChosenOfTheKingEffect,
      {
        name: `Muster King's Chosen`,
        desc: `In your hero phase, you can roll 6 dice for each friendly Crypt Haunter Courtier on the battlefield. If you do so, for each 5+, you can return 1 slain model to a friendly Crypt Horrors unit that is within 10" of that Crypt Haunter Courtier. Slain models can be returned to more than one unit if you wish, but each successful dice roll can only be used to return a model to a single unit.`,
        when: [HERO_PHASE],
      },
    ],
  },
  'Crypt Infernal Courtier': {
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
  'Varghulf Courtier': {
    effects: [
      {
        name: `Muster Royal Household`,
        desc: `In your hero phase, you can roll 6 dice for each friendly Varghulf Courtier on the battlefield. For each 2+, you can return 1 slain model to a friendly Serfs unit that is within 10" of that Varghulf Courtier. For each 5+, you can return 1 slain model to a friendly Knights unit that is within 10" of that Varghulf Courtier instead. Slain models can be returned to more than one unit if you wish, but each successful dice roll can only be used to return a model to a single unit.`,
        when: [HERO_PHASE],
      },
      {
        name: `Feed on Dark Magic`,
        desc: `If a friendly ABHORRANT within 18" of this model successfully casts a spell, and it is not unbound, you can reroll hit rolls for this model until the start of your next hero phase.`,
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
  'Abhorrant Archregent': {
    mandatory: {
      command_abilities: [keyPicker(command_abilities, ['Summon Imperial Guard'])],
      spells: [keyPicker(spells, ['Ferocious Hunger'])],
    },
    effects: [
      {
        name: `Imperial Blood`,
        desc: `In your hero phase, you can heal up to 3 wounds allocated to this model.`,
        when: [HERO_PHASE],
      },
    ],
  },
  'Crypt Ghouls': {
    effects: [
      {
        name: `Boundless Ferocity`,
        desc: `Add 1 to the Attacks characteristic of this unit's Sharpened Teeth and Filthy Claws while this unit has 20 or more models.`,
        when: [COMBAT_PHASE],
      },
      {
        name: `Royal Approval`,
        desc: `You can reroll hit rolls of 1 for attacks made by this unit while it is wholly within 18" of any friendly ABHORRANTS.`,
        when: [COMBAT_PHASE],
      },
    ],
  },
  'Crypt Horrors': {
    effects: [
      ChosenOfTheKingEffect,
      NobleBloodEffect,
      {
        name: `Warrior Elite`,
        desc: `If the unmodified wound roll for an attack made with a Club and Septic Talons is 6, that attack has a Damage characteristic of 3 instead of 2.`,
        when: [COMBAT_PHASE],
      },
    ],
  },
  'Crypt Flayers': {
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
  'Duke Crakmarrow': {
    effects: [
      {
        name: `Muster the Grymwatch`,
        desc: `Pick 1 friendly Grymwatch unit within 3" of this model and roll 6 dice. For each 2+ you can return 1 slain model to that unit.`,
        when: [HERO_PHASE],
      },
      {
        name: `Gallant Champion`,
        desc: `Add 1 to the damage inflicted by each successful attack made by this model that targets a monster.`,
        when: [COMBAT_PHASE],
      },
    ],
  },
  'The Grymwatch': {
    effects: [
      {
        name: `Royal Retinue`,
        desc: `Roll a D6 before you allocate a wound or mortal wound to a friendly Duke Crakmarrow while he is within 3" of this unit. On a 4+, that wound is allocate to this unit instead.`,
        when: [WOUND_ALLOCATION_PHASE],
      },
      {
        name: `Quest to Slay the Monster`,
        desc: `Add 1 to the damage inflicted by each successful attack made by this unit that targets a monster.`,
        when: [COMBAT_PHASE],
      },
    ],
  },
  'Royal Terrorgheist': {
    effects: [
      ...GenericBattleTraits.Terrorgheist,
      {
        name: `Royal Menagerie`,
        desc: `In your hero phase, you can heal up to D3 wounds allocated to this model if this model is within 6" of a friendly ABHORRANT.`,
        when: [HERO_PHASE],
      },
    ],
  },
  'Royal Zombie Dragon': {
    effects: [...GenericBattleTraits.ZombieDragon],
  },
}

export default tagAs(Units, 'unit')

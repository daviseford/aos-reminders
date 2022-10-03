import { tagAs } from 'factions/metatagger'
import {
  COMBAT_PHASE,
  DURING_GAME,
  HERO_PHASE,
  SAVES_PHASE,
  SHOOTING_PHASE,
  WOUND_ALLOCATION_PHASE,
} from 'types/phases'
const Spells = {
  // Common
  'Bolt of Tzeentch': {
    effects: [
      {
        name: `Bolt of Tzeentch`,
        desc: `Casting value of 7 and a range of 18". Pick 1 enemy unit within range and visible to the caster. That unit suffers D6 mortal wounds. This spell cannot be cast more than once per turn, even though it appears in both the Lore of Fate and the Lore of Change.`,
        when: [HERO_PHASE],
      },
    ],
  },
  // Lore of Fate - Mortal/Arcanite Only
  'Arcane Suggestion': {
    effects: [
      {
        name: `Arcane Suggestion`,
        desc: `Arcane Suggestion is a spell that has a casting value of 8 and a range of 18". If successfully cast, pick 1 enemy unit within range and visible to the caster, and pick one of the following effects:
        
        - It's Hopeless - That unit cannot issue or receive commands until your next hero phase.
        - Drop Your Weapons - Subtract 1 from hit and would rolls for attacks made by that unit until your next hero phase.
        - Kneel - Subtract 1 from save rolls for attacks that target that unit until your next hero phase.`,
        when: [HERO_PHASE],
      },
      {
        name: `Arcane Suggestion - It's Hopeless`,
        desc: `That unit cannot issue or receive commands until your next hero phase.`,
        when: [DURING_GAME],
      },
      {
        name: `Arcane Suggestion - Drop Your Weapons`,
        desc: `Subtract 1 from hit and would rolls for attacks made by that unit until your next hero phase.`,
        when: [SHOOTING_PHASE, COMBAT_PHASE],
      },
      {
        name: `Arcane Suggestion - Kneel`,
        desc: `Subtract 1 from save rolls for attacks that target that unit until your next hero phase.`,
        when: [SHOOTING_PHASE, COMBAT_PHASE],
      },
    ],
  },
  'Shield of Fate': {
    effects: [
      {
        name: `Shield of Fate`,
        desc: `Shield of Fate is a spell that has a casting value of 6 and a range of 18". If successfully cast, pick a friendly Tzeentch unit wholly within range and visible to the caster. Until the start of your next hero phase, that unit gains one of the following effects based on the number of your remaining Destiny Dice at the time that the effect is applied:
        
        1-3 - That unit has a ward of 6+.
        4-6 - That unit has a ward of 5+.
        7-9 - That unit has a ward of 5+. In addition, each time that unit is affected by a spell or the abilities of an endless spell, you can roll a dice. On a 4+ ignore the effect of that spell or the effects of that endless spell's abilities on that unit.`,
        when: [HERO_PHASE],
      },
      {
        name: `Shield of Fate`,
        desc: `Effect based on the number of your Destiny Dice at the time that the effect is applied:

        1-3 - That unit has a ward of 6+.
        4-6 - That unit has a ward of 5+.
        7-9 - That unit has a ward of 5+. In addition, each time that unit is affected by a spell or the abilities of an endless spell, you can roll a dice. On a 4+ ignore the effect of that spell or the effects of that endless spell's abilities on that unit.`,
        when: [SAVES_PHASE],
      },
    ],
  },
  'Glimpse the Future': {
    effects: [
      {
        name: `Glimpse the Future`,
        desc: `Casting value of 7. If successfully cast, if you have fewer than 9 Destiny Dice, you can roll a dice and add it to your Destiny Dice.`,
        when: [HERO_PHASE],
      },
    ],
  },
  'Infusion Arcanum': {
    effects: [
      {
        name: `Infusion Arcanum`,
        desc: `Casting value of 5. If successfully cast, add 1 to hit and wound rolls for attacks made by the caster until your next hero phase.`,
        when: [HERO_PHASE],
      },
      {
        name: `Infusion Arcanum`,
        desc: `If active, add 1 to hit and wound rolls for attacks made by the caster until your next hero phase.`,
        when: [COMBAT_PHASE],
      },
    ],
  },
  'Treacherous Bond': {
    effects: [
      {
        name: `Treacherous Bond`,
        desc: `Casting value of 5 and a range of 9". Pick 1 friendly Tzeentch Mortal unit wholly within range and visible to the caster. Until your next hero phase, while that unit is within 9" of the caster, before you allocate a wound or mortal wound to the caster, or instead of making a ward roll for the caster, you can roll a dice. On a 3+, that wound or mortal wound is allocated to the Tzeentch Mortal unit you picked and cannot be negated.`,
        when: [HERO_PHASE],
      },
      {
        name: `Treacherous Bond`,
        desc: `If active, roll a dice before allocating wounds/mortal wounds to the caster. On a 3+, you must allocate those wounds to the bonded friendly unit instead.`,
        when: [WOUND_ALLOCATION_PHASE],
      },
    ],
  },
  // Lore of Change - Daemons Only
  'Treason of Tzeentch': {
    effects: [
      {
        name: `Treason of Tzeentch`,
        desc: `Casting value of 7 and a range of 18". Pick 1 enemy unit that has 2 or more models and is wholly within range and visible to the caster. Roll a number of dice equal to the number of models in that unit. For each 6, that unit suffers 1 mortal wound. In additioni, subtract 1 from hit rolls for attacks made by that unit until your next hero phase.`,
        when: [HERO_PHASE],
      },
      {
        name: `Treason of Tzeentch`,
        desc: `If active, subtract 1 from hit rolls for attacks made by this unit.`,
        when: [DURING_GAME],
      },
    ],
  },
  'Unchecked Mutation': {
    effects: [
      {
        name: `Unchecked Mutation`,
        desc: `Casting value of 6 and a range of 18". Pick 1 enemy unit within range and visible to the caster. That unit suffers D3 mortal wounds. If any models are slain by this spell, you can roll a dice. On a 3+, that unit suffers an additional D3 mortal wounds.`,
        when: [HERO_PHASE],
      },
    ],
  },
  'Fold Reality': {
    effects: [
      {
        name: `Fold Reality`,
        desc: `Casting value of 7 and a range of 18". Pick 1 friendly Tzeentch Daemon unit wholly within range and visible to the caster, and roll a dice. On a 1, that unit is destroyed. On a 2+, you can return a number of slain models equal to that roll to that unit.`,
        when: [HERO_PHASE],
      },
    ],
  },
  "Tzeentch's Firestorm": {
    effects: [
      {
        name: `Tzeentch's Firestorm`,
        desc: `Casting value of 9 and a range of 12". Pick 1 enemy unit that is within range and visible to the caster, and roll 9 dice. For each 6, that unit suffers D3 mortal wounds.`,
        when: [HERO_PHASE],
      },
    ],
  },
  // Unit spells

  'Infernal Gateway': {
    effects: [
      {
        name: `Infernal Gateway`,
        desc: `Casting value of 7 and range of 18". Pick 1 enemy unit within range and visible to the caster, and roll 9 dice. That enemy unit suffers 1 mortal wound for each roll that is equal to or greater than the Infernal Gateway value shown on the caster's damage table.`,
        when: [HERO_PHASE],
      },
    ],
  },
  "Tzeentch's Firestorm (Fateskimmer)": {
    effects: [
      {
        name: `Tzeentch's Firestorm`,
        desc: `Casting value of 9 and a range of 9". If successfully cast, roll a dice for each enemy unit within range and visible to the caster. On a 2+, that unit suffers D3 mortal wounds.`,
        when: [HERO_PHASE],
      },
    ],
  },
  'Infernal Flames': {
    effects: [
      {
        name: `Infernal Flames`,
        desc: `Casting value of 7 and a range of 12". Pick 1 enemy unit within range and visible to the caster. Roll 1 dice for each model in that unit. For each 5+, that unit suffers 1 mortal wound. If that unit is a Monster or War Machine, roll 5 dice for each model instead.`,
        when: [HERO_PHASE],
      },
    ],
  },
  'Blue Fire of Tzeentch': {
    effects: [
      {
        name: `Blue Fire of Tzeentch`,
        desc: `Casting value of 8 and a range of 18". Pick 1 enemey unit within range and visible to the caster, and roll 9 dice. For each 5+, that enemy unit suffers 1 mortal wound and the caster's army receives 1 Fate Point if it is a Disciples of Tzeentch Army.`,
        when: [HERO_PHASE],
      },
    ],
  },
  'Pink Fire of Tzeentch': {
    effects: [
      {
        name: `Pink Fire of Tzeentch`,
        desc: `Casting value of 7 and a range of 18". Pick 1 enemy unit within range and visible to the caster. Subtract 1 from save rolls for attacks that target that unit until your next hero phase.`,
        when: [HERO_PHASE],
      },
    ],
  },
  'Boon of Tzeentch': {
    effects: [
      {
        name: `Boon of Tzeentch`,
        desc: `Casting value of 4. You can reroll casting rolls for friendly TZEENTCH WIZARDS wholly within 18" of the caster for the rest of that phase.`,
        when: [HERO_PHASE],
      },
    ],
  },
  'Bolt of Change': {
    effects: [
      {
        name: `Bolt of Change`,
        desc: `Casting value of 7 and a range of 18". Pick 1 enemy unit within range and visible to the caster. That unit suffers D3 mortal wounds. You can say that the first enemy model slain by this spell each time it is cast is transformed into a Spawn instead of being slain (pg 65).`,
        when: [HERO_PHASE],
      },
    ],
  },
  'Glean Magic': {
    effects: [
      {
        name: `Glean Magic`,
        desc: `Casting value of 4 and a range of 30". If successfully cast, pick 1 enemy Wizard within range and visible to the caster. Pick 1 spell from that Wizard's warscroll that is possible for this unit to cast and roll a dice. On a 2+, the caster knows that spell for the rest of the battle. 
        
        Designer's Note: Spells that require the caster to have a specific keyword, refer to a damage table, or require an endless spell to be a part of their army cannot be picked with this ability.`,
        when: [HERO_PHASE],
      },
    ],
  },
  'Sorcerous Insight': {
    effects: [
      {
        name: `Sorcerous Insight`,
        desc: `Casting value of 5. If successfully cast, you receive 1 command point that can only be spent to allow the caster to issue a command.`,
        when: [HERO_PHASE],
      },
    ],
  },
  'Choking Tendrils': {
    effects: [
      {
        name: `Choking Tendrils`,
        desc: `Casting value of 7 and a range of 18". Pick 1 enemy unit range and visible to the caster. That unit suffers D6 mortal wounds. For each model that is slain by mortal wounds inflicted by this spell, you can heal 1 wound allocated to this model.`,
        when: [HERO_PHASE],
      },
    ],
  },
  'Boon of Mutation': {
    effects: [
      {
        name: `Boon of Mutation`,
        desc: `Casting value of 7 and a range of 18". Pick 1 enemy unit within range and visible to the caster. That unit suffers D3 mortal wounds. For each model that is slain by a mortal wound caused by this spell, you can add 1 Tzaangor model that is not a Tzaangor Champion or Tzaangor Mutant to a friendly Tzaangor Host within 12" of the caster. Set up models that are added to a unit one at a time within 1" of the unit they are being added to. Models that are added to a unit can only be set up within 3" of an enemy unit if a model from their unit is already within 3" of that enemy unit. The models added to a unit can take it above its maximum size.`,
        when: [HERO_PHASE],
      },
    ],
  },
  'Gestalt Sorcery': {
    effects: [
      {
        name: `Gestalt Sorcery`,
        desc: `Casting value of 6. Pick 1 friendly Kairic Acolytes unit wholly within 9" of the caster. Until your next hero phase, improve the Rend characteristic of that unit's Sorcerous Bolt attack by 1. A unit cannot benefit from this spell more than once per turn.`,
        when: [HERO_PHASE],
      },
      {
        name: `Gestalt Sorcery`,
        desc: `If active, improve the Rend characteristic of the buffed unit's Sorcerous Bolt attack by 1.`,
        when: [SHOOTING_PHASE],
      },
    ],
  },

  'The Parchment Curse': {
    effects: [
      {
        name: `The Parchment Curse`,
        desc: `The Parchment Curse is a spell that is known by the model that summoned this endless spell while this endless spell is on the battlefield. It has a casting value of 8 and range of 18". if successfully cast, pick 1 enemy unit within range and visible to the caster, and roll a dice. On a 3+, that unit suffers D3 mortal wounds. In addition, for each model slain by those mortal wounds, subtract 1 from the Bravery characteristic of that model's unit (to a minimum of 1) for the rest of the battle.`,
        when: [HERO_PHASE],
      },
    ],
  },
}

export default tagAs(Spells, 'spell')

import { tagAs } from 'factions/metatagger'
import {
  COMBAT_PHASE,
  DURING_GAME,
  HERO_PHASE,
  MOVEMENT_PHASE,
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
        desc: `Casting value of 7. Pick an enemy unit within 18" of the caster that is visible to them. That unit suffers D6 mortal wounds.`,
        when: [HERO_PHASE],
      },
    ],
  },
  // Lore of Fate - Mortal/Arcanite Only
  'Arcane Suggestion': {
    effects: [
      {
        name: `Arcane Suggestion`,
        desc: `Casting value of 8. Pick an enemy unit within 18" of the caster that is visible to them and pick one of the following:

        - The unit suffers D3 mortal wounds.
        - Subtract 1 from hit and wound rolls made by that unit until your next hero phase.
        - Subtract 1 from save rolls for attacks that target that unit until your next hero phase`,
        when: [HERO_PHASE],
      },
      {
        name: `Arcane Suggestion`,
        desc: `If active, subtract 1 from the hit and wound rolls from the debuffed unit.`,
        when: [SHOOTING_PHASE, COMBAT_PHASE],
      },
      {
        name: `Arcane Suggestion`,
        desc: `If active, subtract 1 from the save rolls made by the debuffed unit.`,
        when: [DURING_GAME],
      },
    ],
  },
  'Glimpse the Future': {
    effects: [
      {
        name: `Glimpse the Future`,
        desc: `Casting value of 7. Roll a D6 and add it to your Destiny Dice pool.`,
        when: [HERO_PHASE],
      },
    ],
  },
  'Shield of Fate': {
    effects: [
      {
        name: `Shield of Fate`,
        desc: `Casting value of 6. Pick a friendly Tzeentch unit wholly within 18" of the caster and visible. Until the start of your next hero phase, the selected unit gains a benefit based on the number of destiny dice left in your pool.`,
        when: [HERO_PHASE],
      },
      {
        name: `Shield of Fate`,
        desc: `Effect based on number of destiny dice in pool:
               1-3: You can reroll save rolls of 1 for attacks that target that unit.
               4-6: You can reroll save rolls for attacks that target that unit.
               7-9: You can roll a D6 each time that unit is affected by a spell or endless spell. On a 4+, ignore the effects of that spell or endless spell. In addition, you can reroll save rolls for attacks that target that unit.`,
        when: [HERO_PHASE, SAVES_PHASE],
      },
    ],
  },
  'Infusion Arcanum': {
    effects: [
      {
        name: `Infusion Arcanum`,
        desc: `Casting value of 5. Until your next hero phase you can add 1 to all hit and wound rolls for the caster.`,
        when: [HERO_PHASE],
      },
      {
        name: `Infusion Arcanum`,
        desc: `If active, you can add 1 to all hit and wound rolls on the buffed unit.`,
        when: [COMBAT_PHASE],
      },
    ],
  },
  'Treacherous Bond': {
    effects: [
      {
        name: `Treacherous Bond`,
        desc: `Casting value of 5. Pick 1 friendly Tzeentch Mortal unit wholly within 9" of the caster and visible to them. Until your next hero phase, roll a D6 before you allocate any wounds or mortal wounds to the caster. On a 3+, you must allocate those wounds or mortal wounds to that friendly unit instead.`,
        when: [HERO_PHASE],
      },
      {
        name: `Treacherous Bond`,
        desc: `If active, roll a D6 before allocating wounds/mortal wounds to the caster. On a 3+, you must allocate those wounds to the bonded friendly unit instead.`,
        when: [WOUND_ALLOCATION_PHASE],
      },
    ],
  },
  // Lore of Change - Daemons Only
  'Treason of Tzeentch': {
    effects: [
      {
        name: `Treason of Tzeentch`,
        desc: `Casting value of 5. Pick 1 enemy unit within 18" of the caster and visible to them. Roll a number of dice equal to the number of models in that unit. For each 6, that unit suffers 1 mortal wound. if any models are slain by this spell, subtract 1 from hit rolls for attacks made by that unit until your next hero phase.`,
        when: [HERO_PHASE],
      },
      {
        name: `Treason of Tzeentch`,
        desc: `If any models had been slain by this spell subtract 1 from hit rolls for attacks made by that unit.`,
        when: [DURING_GAME],
      },
    ],
  },
  'Arcane Transformation': {
    effects: [
      {
        name: `Arcane Transformation`,
        desc: `Casting value of 6. Pick a friendly Tzeentch hero wholly within 18" of the caster and visible to them. Until your next hero phase, you can either add 1 to that Hero's move and bravery characteristic or add 1 to the Attacks characteristic of one of that Hero's melee weapons.`,
        when: [HERO_PHASE],
      },
      {
        name: `Arcane Transformation`,
        desc: `If active, add 1 to the buffed hero's move and bravery characteristic.`,
        when: [DURING_GAME, MOVEMENT_PHASE],
      },
      {
        name: `Arcane Transformation`,
        desc: `If active, add 1 to the buffed hero's melee Attacks characteristic for one weapon.`,
        when: [COMBAT_PHASE],
      },
    ],
  },
  'Unchecked Mutation': {
    effects: [
      {
        name: `Unchecked Mutation`,
        desc: `Casting value of 6. Pick 1 enemy unit within 18" of the caster and visible to them. That unit suffers D3 mortal wounds. If any models are slain by this spell, you can roll a D6. On a 3+, that unit suffers an additional D3 mortal wounds and this spell ends.`,
        when: [HERO_PHASE],
      },
    ],
  },
  'Fold Reality': {
    effects: [
      {
        name: `Fold Reality`,
        desc: `Casting value of 7. Pick a friendly unit of Tzeentch Daemons wholly within 18" of the caster and visible to them, and roll a D6. On a 1, that unit is destroyed. On a 2+, you can return a number of slaim models equal to that roll to that unit. Set up the models one at a time 1" of a model from that unit that has not been returned in that phase. The models can only be set up within 3" of an enemy unit if the friendly unit was within 3" of that enemy unit before any models were returned.`,
        when: [HERO_PHASE],
      },
    ],
  },
  'Tzeentch`s Firestorm': {
    effects: [
      {
        name: `Tzeentch's Firestorm.`,
        desc: `Casting value of 9. Pick an enemy unit within 18" of the caster and visible to them. Roll 9 dice - for each 6 the unit targeted suffers D3 mortal wounds.`,
        when: [HERO_PHASE],
      },
    ],
  },
  // Flavor spells

  // Unit spells
  'Infernal Gateway': {
    effects: [
      {
        name: `Infernal Gateway`,
        desc: `Casting value of 7. Pick a visible enemy within 18" of the caster and roll 9 dice. That unit suffers 1 mortal wound for each roll that is equal to or greater than the Infernal Gateway value shown on the caster's damage table.`,
        when: [HERO_PHASE],
      },
    ],
  },
  'Gift of Change': {
    effects: [
      {
        name: `Gift of Change`,
        desc: `Casting value of 8. Pick 1 enemy unit within 18" of the caster and visible to them. That unit suffers a number of mortal wounds equal to the Gift of Change value shown on the caster's damage table. If any models were slain by this spell, before removing the first slain model, you can add a Tzeentch Chaos Spawn to your army and set it up within 3" of the slain model's unit.`,
        when: [HERO_PHASE],
      },
    ],
  },
  'Infernal Flames': {
    effects: [
      {
        name: `Infernal Flames`,
        desc: `Casting value of 7. Pick 1 enemy unit within 12" of the caster that is visible to them, and roll 1 dice for each model in that unit. For each 5+, that unit suffers 1 mortal wound. If that unit is a Monster or War Machine, roll 3 dice for each model instead.`,
        when: [HERO_PHASE],
      },
    ],
  },
  'Blue Fire of Tzeentch': {
    effects: [
      {
        name: `Blue Fire of Tzeentch`,
        desc: `Casting value of 5. Pick 1 enemy unit within 18" of the caster and visible to them, and roll 9 dice. For each 6, that unit suffers 1 mortal wound.`,
        when: [HERO_PHASE],
      },
    ],
  },
  'Pink Fire of Tzeentch': {
    effects: [
      {
        name: `Pink Fire of Tzeentch`,
        desc: `Casting value of 9. Pick an enemy unit within 18" of the caster that is visible and deal D6 mortal wounds.`,
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
  'Channelled Pink Fire': {
    effects: [
      {
        name: `Channelled Pink Fire`,
        desc: `Casting value of 6. Pick 1 friendly Horrors of Tzeentch unit wholly within 6" of the caster and visible to them. Add 1 to hit rolls for attacks made by that unit until the start of your next hero phase. A unit cannot benefit from this spell more than once per phase.`,
        when: [HERO_PHASE],
      },
      {
        name: `Channelled Pink Fire`,
        desc: `If active, add 1 to hit rolls for attacks made by the buffed unit.`,
        when: [SHOOTING_PHASE, COMBAT_PHASE],
      },
    ],
  },
  'Bolt of Change': {
    effects: [
      {
        name: `Bolt of Change`,
        desc: `Casting value of 7. Pick 1 enemy unit within 18" of the caster and visible to them. That unit suffers D3 mortal wounds. If any models were slain by this spell, before removing the first slain model, you can add 1 Tzeentch Chaos Spawn to your army and set it up within 3" of the slain model's unit.`,
        when: [HERO_PHASE],
      },
    ],
  },
  'Glean Magic': {
    effects: [
      {
        name: `Glean Magic`,
        desc: `Casting value of 3. Pick 1 enemy Wizard within 24" of the caster and visible to them. Pick 1 spell from that Wizard's warscroll that is possible for this model to cast and roll a D6. On a 3+, the caster knows that spell for the rest of the battle.`,
        when: [HERO_PHASE],
      },
    ],
  },
  'Sorcerous Insight': {
    effects: [
      {
        name: `Sorcerous Insight`,
        desc: `Casting value of 5. You receive 1 extra command point. This extra command point can only be spent by picking this model to use the At the Double, Forward to Victory or Inspiring Presence command ability.`,
        when: [HERO_PHASE],
      },
    ],
  },
  'Choking Tendrils': {
    effects: [
      {
        name: `Choking Tendrils`,
        desc: `Casting value of 7. Pick 1 enemy unit within 18" of the caster and visible to them. That unit suffers D6 mortal wounds. For each model that is slain by mortal wounds inflicted by this spell, you can heal 1 wound allocated to this model.`,
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
}

export default tagAs(Spells, 'spell')

import { TSpells } from 'types/army'
import {
  COMBAT_PHASE,
  DURING_GAME,
  HERO_PHASE,
  MOVEMENT_PHASE,
  SHOOTING_PHASE,
  WOUND_ALLOCATION_PHASE,
} from 'types/phases'

// Spell Lores of Tzeentch
const Spells: TSpells = [
  // Lord of Fate
  {
    name: `Bolt of Tzeentch`,
    effects: [
      {
        name: `Bolt of Tzeentch`,
        desc: `Casting value of 7. Pick an enemy unit within 18" of the caster that is visible to them. That unit suffers D6 mortal wounds.`,
        when: [HERO_PHASE],
      },
    ],
  },
  {
    name: `Arcane Suggestion`,
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
  {
    name: `Glimpse the Future`,
    effects: [
      {
        name: `Glimpse the Future`,
        desc: `Casting value of 7. Roll a D6 and add it to your Destiny Dice pool.`,
        when: [HERO_PHASE],
      },
    ],
  },
  {
    name: `Shield of Fate`,
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
        when: [HERO_PHASE, DURING_GAME],
      },
    ],
  },
  {
    name: `Infusion Arcanum`,
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
  {
    name: `Treacherous Bond`,
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
  // Lore of Change.
  {
    name: `Treason of Tzeentch`,
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
  {
    name: `Arcane Transformation`,
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
  {
    name: `Unchecked Mutation`,
    effects: [
      {
        name: `Unchecked Mutation`,
        desc: `Casting value of 6. Pick 1 enemy unit within 18" of the caster and visible to them. That unit suffers D3 mortal wounds. If any models are slain by this spell, you can roll a D6. On a 3+, that unit suffers an additional D3 mortal wounds and this spell ends.`,
        when: [HERO_PHASE],
      },
    ],
  },
  {
    name: `Fold Reality`,
    effects: [
      {
        name: `Fold Reality`,
        desc: `Casting value of 7. Pick a friendly unit of Tzeentch Daemons wholly within 18" of the caster and visible to them, and roll a D6. On a 1, that unit is destroyed. On a 2+, you can return a number of slaim models equal to that roll to that unit. Set up the models one at a time 1" of a model from that unit that has not been returned in that phase. The models can only be set up within 3" of an enemy unit if the friendly unit was within 3" of that enemy unit before any models were returned.`,
        when: [HERO_PHASE],
      },
    ],
  },
  {
    name: `Tzeentch's Firestorm`,
    effects: [
      {
        name: `Tzeentch's Inferno.`,
        desc: `Casting value of 9. Pick an enemy unit within 18" of the caster and visible to them. Roll 9 dice - for each 6 the unit targeted suffers D3 mortal wounds.`,
        when: [HERO_PHASE],
      },
    ],
  },
]

export default Spells

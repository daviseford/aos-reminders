// Spell Lores of Slaves to Darkness - Lore of the Damned
import { tagAs } from 'factions/metatagger'
import {
  CHARGE_PHASE,
  COMBAT_PHASE,
  DURING_GAME,
  END_OF_COMBAT_PHASE,
  HERO_PHASE,
  MOVEMENT_PHASE,
} from 'types/phases'
import rule_sources from './rule_sources'

const Spells = {
  //Spell Lore
  'Binding Damnation': {
    effects: [
      {
        name: `Binding Damnation`,
        desc: `Casting value of 7. Pick 1 enemy unit within 12" and visible. Until your next hero phas, the strike-last effect applies to that unit.`,
        when: [HERO_PHASE],
      },
      {
        name: `Binding Damnation`,
        desc: `Affected unit fights during this phase.`,
        when: [END_OF_COMBAT_PHASE],
      },
    ],
  },
  'Spite-tongue Curse': {
    effects: [
      {
        name: `Spite-tongue Curse`,
        desc: `Casting value of 3. Pick 1 enemy unit within 12" and visible. That unit suffers 3 mortal wounds. If the casting roll fails or the spell is unbound, the caster suffers 3 mortal wounds.`,
        when: [HERO_PHASE],
      },
    ],
  },
  'Chaotic Conduit': {
    effects: [
      {
        name: `Chaotic Conduit`,
        desc: `Casting value of 7. Pick 1 friendly EYE OF THE GODS unit within 12" and visible. You can immediately roll on the Eye of the Gods table for that unit.`,
        when: [HERO_PHASE],
      },
    ],
  },
  'Ruinous Vigour': {
    effects: [
      {
        name: `Ruinous Vigour`,
        desc: `Casting value of 6. Pick 1 friendly Slaves to Darkness MONSTER wholly within 12" and visible. Until your next hero phase the MONSTER uses the 0 wounds suffered row of its damage table.`,
        when: [HERO_PHASE],
      },
      {
        name: `Ruinous Vigour`,
        desc: `The affected MONSTER uses the 0 wounds suffered row of its damage table.`,
        when: [DURING_GAME],
      },
    ],
  },
  'Daemonic Speed': {
    effects: [
      {
        name: `Daemonic Speed`,
        desc: `Casting value of 7. Pick 1 friendly Slaves to Darkness unit that has a mount wholly within 12" and visible. Until the start of your next hero phase, you can charge with that unit if it is within 18" and roll 3D6 for charge rolls.`,
        when: [HERO_PHASE],
        rule_sources: [rule_sources.ERRATA_JANUARY_2023],
      },
      {
        name: `Daemonic Speed`,
        desc: `The affected unit can charge from 18" and roll 3D6.`,
        when: [CHARGE_PHASE],
      },
    ],
  },
  'Warp Reality': {
    effects: [
      {
        name: `Warp Reality`,
        desc: `All Tzeentch Slaves to Darkness Wizards know this spell. Casting value of 6 and a range of 9". Pick 1 friendly Tzeentch Slaves to Darkness unit visible to the caster. Remove that unit from the battlefield and set it up again wholly within range of the caster and more than 9" from all enemy units. That unit cannot move in the next movement phase.`,
        when: [HERO_PHASE],
        rule_sources: [rule_sources.ERRATA_JANUARY_2023],
      },
    ],
  },

  //UNITS
  'Enfeeble Foe': {
    effects: [
      {
        name: `Enfeeble Foe`,
        desc: `Casting value of 6. Pick one visible enemy unit within 18" of the caster. Until your next hero phase, subtract 1 from the melee wound rolls made by the target.`,
        when: [HERO_PHASE],
      },
      {
        name: `Enfeeble Foe`,
        desc: `If active, subtract 1 from the wound rolls made by the target in the combat phase.`,
        when: [COMBAT_PHASE],
      },
    ],
  },
  'Infernal Flames': {
    effects: [
      {
        name: `Infernal Flames`,
        desc: `Casting value of 7. Pick 1 enemy unit within 12" of the caster that is visible to them, and roll 1 dice for each model in that unit. For each 5+, that unit suffers 1 mortal wound. If that unit is a MONSTER or War Machine, roll 5 dice for each model instead.`,
        when: [HERO_PHASE],
      },
    ],
  },
  'Winds of Chaos': {
    effects: [
      {
        name: `Winds of Chaos`,
        desc: `Casting value of 8. Pick 1 enemy unit within 18" and visible. Roll a number of dice equal to the number of models in the target unit. For each 5, the target suffers 1 mortal wound. For each 6, the target suffers 2 mortal wounds.`,
        when: [HERO_PHASE],
      },
    ],
  },
  'Daemonic Power': {
    effects: [
      {
        name: `Daemonic Power`,
        desc: `Casting value of 6. Select a friendly MORTAL SLAVES TO DARKNESS unit wholly within 18" and visible. Until your next hero phase, add 1 to hit and wound rolls for melee weapons for the targeted unit.`,
        when: [HERO_PHASE],
      },
      {
        name: `Daemonic Power`,
        desc: `If active, you can add 1 to hit and wound rolls for melee weapons for the targeted unit.`,
        when: [COMBAT_PHASE],
      },
    ],
  },
  Enfeeblement: {
    effects: [
      {
        name: `Enfeeblement`,
        desc: `Casting value of 6. Pick 1 enemy unit within 12" and visible to the caster. Subtract 1 from wound rolls for attacks made with melee weapons by that unit until your next hero phase.`,
        when: [HERO_PHASE],
      },
    ],
  },
  'Mask of Darkness': {
    effects: [
      {
        name: `Mask of Darkness`,
        desc: `Casting value of 6 and a range of 12". Pick 1 friendly KHAGRA's RAVAGERS unit wholly within range and visible to the caster. Remove that unit from the battlefield and set it up again anywhere on the battlefield wholly within 24" of the caster and more than 9" from all enemy units.`,
        when: [HERO_PHASE],
      },
      {
        name: `Mask of Darkness`,
        desc: `Affected units cannot move in this phase.`,
        when: [MOVEMENT_PHASE],
      },
    ],
  },
}

export default tagAs(Spells, 'spell')

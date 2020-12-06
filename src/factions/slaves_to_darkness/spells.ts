// Spell Lores of Slaves to Darkness - Lore of the Damned
import { tagAs } from 'factions/metatagger'
import {
  COMBAT_PHASE,
  DURING_GAME,
  END_OF_COMBAT_PHASE,
  HERO_PHASE,
  MOVEMENT_PHASE,
  SHOOTING_PHASE,
} from 'types/phases'

const Spells = {
  'Binding Damnation': {
    effects: [
      {
        name: `Binding Damnation`,
        desc: `Casting value of 7. Pick 1 enemy unit within 12" and visible. Until your next hero phase that unit fights at the end of the combat phase.`,
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
  'Whispers of Chaos': {
    effects: [
      {
        name: `Whispers of Chaos`,
        desc: `Casting value of 7. Pick 1 enemy unit within 12" and visible. Roll a number of dice equal to the number of models in the target unit. For each 6, that unit suffers 1 mortal wound. If any models are slain by this spell, that unit cannot move until the start of your next hero phase.`,
        when: [HERO_PHASE],
      },
      {
        name: `Whispers of Chaos`,
        desc: `Affected units cannot move until the start of your next hero phase.`,
        when: [MOVEMENT_PHASE],
      },
    ],
  },
  'Mask of Darkness': {
    effects: [
      {
        name: `Mask of Darkness`,
        desc: `Casting value of 7. Pick 1 friendly mortal Slaves to Darkness unit wholly within 12" and visible. Remove that unit from the battlefield and set it up again anywhere on the battlefield more than 9" from enemy units. The friendly unit cannot move in the following movement phase.`,
        when: [HERO_PHASE],
      },
      {
        name: `Mask of Darkness`,
        desc: `Affected units cannot move in this phase.`,
        when: [MOVEMENT_PHASE],
      },
    ],
  },
  'Call to Glory': {
    effects: [
      {
        name: `Call to Glory`,
        desc: `Casting value of 5. Pick 1 friendly Slaves to Darkness hero wholly within 12" and visible. You can reroll hit and wound rolls for attacks made by the hero if the target is a hero or monster until your next hero phase.`,
        when: [HERO_PHASE],
      },
      {
        name: `Call to Glory`,
        desc: `You can reroll hit and wound rolls for attacks made by the affected hero if the target is a hero or monster.`,
        when: [SHOOTING_PHASE, COMBAT_PHASE],
      },
    ],
  },
  'Ruinous Vigour': {
    effects: [
      {
        name: `Ruinous Vigour`,
        desc: `Casting value of 6. Pick 1 friendly Slaves to Darkness monster wholly within 12" and visible. Until your next hero phase the monster uses the 0 wounds suffered row of its damage table.`,
        when: [HERO_PHASE],
      },
      {
        name: `Ruinous Vigour`,
        desc: `The affected monster uses the 0 wounds suffered row of its damage table.`,
        when: [DURING_GAME],
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
  'Winds of Chaos': {
    effects: [
      {
        name: `Winds of Chaos`,
        desc: `Casting value of 7. Pick 1 enemy unit within 18" and visible. Roll a number of dice equal to the number of models in the target. For each 5, the target suffers 1 mortal wound. For each 6, the target suffers D3 mortal wounds.`,
        when: [HERO_PHASE],
      },
    ],
  },
  'Daemonic Power': {
    effects: [
      {
        name: `Daemonic Power`,
        desc: `Casting value of 6. Select a friendly unit wholly within 18" of the caster and visible. Until your next hero phase, you can reroll hit and wound rolls for the targeted unit.`,
        when: [HERO_PHASE],
      },
      {
        name: `Daemonic Power`,
        desc: `If active, you can reroll hit and wound rolls for the targeted unit.`,
        when: [SHOOTING_PHASE, COMBAT_PHASE],
      },
    ],
  },
  Enfeeblement: {
    effects: [
      {
        name: `Enfeeblement`,
        desc: `Casting value of 6. Pick 1 enemy unit within 12" and visible to the caster. Subtract 1 from wound rolls for attacks made by the target's melee weapons until your next hero phase.`,
        when: [HERO_PHASE],
      },
    ],
  },
  'Traitor`s Mist': {
    effects: [
      {
        name: `Traitor's Mist`,
        desc: `Casting value of 7. Pick 1 friendly Slaves to Darkness unit wholly within 15" and visible to the caster. Remove that unit from the battlefield and set it up again anywhere on the battlefield more than 9" from enemy units. It cannot move in the subsequent move phase.`,
        when: [HERO_PHASE],
      },
    ],
  },
  'Enfeeble Foe': {
    effects: [
      {
        name: `Enfeeble Foe`,
        desc: `Casting value of 6. Pick one visible enemy unit within 18" of the caster. Until your next hero phase, subtract 1 from the wound rolls made by the target in the combat phase.`,
        when: [HERO_PHASE],
      },
      {
        name: `Enfeeble Foe`,
        desc: `If active, subtract 1 from the wound rolls made by the target in the combat phase.`,
        when: [COMBAT_PHASE],
      },
    ],
  },
  'Stolen Sting': {
    effects: [
      {
        name: `Stolen Sting`,
        desc: `Casting value of 7. Select an enemy unit within 18" of the caster and visible. Worsen the rend characteristic of the target's melee weapons by 1 until your next hero phase. A unit can only be affected by this spell once per turn.`,
        when: [HERO_PHASE],
      },
    ],
  },
  // Cabalists Spell
  'Crippling Ruin': {
    effects: [
      {
        name: `Crippling Ruin`,
        desc: `Casting value of 7. Pick 1 enemy unit within 18" and visible. That unit suffers D3 mortal wounds. In addition, reduce the move characteristic of that unit by the number of mortal wounds inflicted by this spell until your next hero phase.`,
        when: [HERO_PHASE],
      },
      {
        name: `Crippling Ruin`,
        desc: `Affected units reduce their move characteristic by the number of mortal wounds inflicted by this spell until your next hero phase.`,
        when: [MOVEMENT_PHASE],
      },
    ],
  },
}

export default tagAs(Spells, 'spell')

import { TSpells } from 'types/army'
import {
  COMBAT_PHASE,
  DURING_GAME,
  END_OF_COMBAT_PHASE,
  HERO_PHASE,
  MOVEMENT_PHASE,
  SHOOTING_PHASE,
} from 'types/phases'

// Spell Lores of Slaves to Darkness - Lore of the Damned
const Spells: TSpells = [
  {
    name: `Binding Damnation (Slaves)`,
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
  {
    name: `Spite-tongue Curse (Slaves)`,
    effects: [
      {
        name: `Spite-tongue Curse`,
        desc: `Casting value of 3. Pick 1 enemy unit within 12" and visible. That unit suffers 3 mortal wounds. If the casting roll fails or the spell is unbound, the caster suffers 3 mortal wounds.`,
        when: [HERO_PHASE],
      },
    ],
  },
  {
    name: `Whispers of Chaos (Slaves)`,
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
  {
    name: `Mask of Darkness (Slaves)`,
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
  {
    name: `Call to Glory (Slaves)`,
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
  {
    name: `Ruinous Vigour (Slaves)`,
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
]

export default Spells

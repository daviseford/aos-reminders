import { tagAs } from 'factions/metatagger'
import { COMBAT_PHASE, HERO_PHASE, MOVEMENT_PHASE } from 'types/phases'

const CommandAbilities = {
  // Unit command abilities
  'Orgy of Slaughter': {
    effects: [
      {
        name: `Orgy of Slaughter`,
        desc: `If this model is your general, you can use this ability. If you do, pick a friendly Daughters of Khaine unit within 14" of this model. If that unit is within 3" of an enemy unit, it can pile in and attack as if it were the combat phase. The same unit cannot be picked to benefit from this command ability more than once per hero phase.`,
        when: [HERO_PHASE],
      },
    ],
  },
  'Worship Through Bloodshed': {
    effects: [
      {
        name: `Worship Through Bloodshed`,
        desc: `If this model is on the battlefield, you can pick 1 other friendly Daughters of Khaine unit wholly within 24". The target can shoot or fight if it is within 3" of enemy units. Cannot be used more than once in the same phase.`,
        when: [HERO_PHASE],
      },
    ],
  },
  'Wrath of the Scathborn': {
    effects: [
      {
        name: `Wrath of the Scathborn`,
        desc: `Once per turn you can pick 1 friendly Melusai unit wholly within 12". Until your next hero phase, the target can run using 2D6 distance and still shoot and/or charge in the same turn.`,
        when: [HERO_PHASE],
      },
      {
        name: `Wrath of the Scathborn`,
        desc: `If active, unit can roll 2D6 when making the run roll. Unit may still shoot and/or charge in subsequent phases this turn.`,
        when: [MOVEMENT_PHASE],
      },
    ],
  },
  // Zainthar Kai Flavor
  'Zainthar Kai': {
    effects: [
      {
        name: `Power in the Blood`,
        desc: `Once per phase, you can use this ability when you select a friendly Zainthar Kai Melusai or Khinerai Harpies unit to fight wholly within 12" of a Zainthar Kai hero. Add 1 to the attacks characteristic of melee weapons used by the target.`,
        when: [COMBAT_PHASE],
      },
    ],
  },
}

export default tagAs(CommandAbilities, 'command_ability')

import { tagAs } from 'factions/metatagger'
import {
  BATTLESHOCK_PHASE,
  CHARGE_PHASE,
  COMBAT_PHASE,
  HERO_PHASE,
  MOVEMENT_PHASE,
  SAVES_PHASE,
  SHOOTING_PHASE,
  WOUND_ALLOCATION_PHASE,
} from 'types/phases'

const Spells = {
  'Speed of Hysh': {
    effects: [
      {
        name: `Speed of Hysh`,
        desc: `Casting value of 5. Pick 1 friendly LUMINETH REALM-LORDS unit wholly within 18" of the caster and visible to them. Double the move characteristic of the unit until your next hero phase.`,
        when: [HERO_PHASE, MOVEMENT_PHASE],
      },
    ],
  },
  'Solar Flare': {
    effects: [
      {
        name: `Solar Flare`,
        desc: `Casting value of 8. Pick a point on the battlefield within 10" of the caster and visible to them. If there is an endless spell at that point, it is dispelled. If there is a unit at that point. Roll a number of dice equal to the number of models in the unit. On a 6+ the unit suffers a mortal wound. If there are WIZARDS within 12", subject 2 from casting and dispell rolls until your next hero phase.`,
        when: [HERO_PHASE],
      },
    ],
  },
  'Lambent Light': {
    effects: [
      {
        name: `Lambent Light`,
        desc: `Casting value of 8. Pick 1 enemy unit wholly within 18" and visible to them. Until your next hero phase, reroll missile weapon attacks that target the unit.`,
        when: [HERO_PHASE, SHOOTING_PHASE],
      },
    ],
  },
  'Etheral Blessings': {
    effects: [
      {
        name: `Etheral Blessings`,
        desc: `Casting value of 6. Pick 1 friendly LUMINETH REALM-LORDS unit wholly within 18" and visible to them. Until your next hero phase, ignore modifiers (positive and negative) when making saving throws for attacks that target the unit.`,
        when: [HERO_PHASE],
      },
      {
        name: `Etheral Blessings`,
        desc: `If active, until your next hero phase, ignore modifiers (positive and negative) when making saving throws for attacks that target the unit.`,
        when: [SAVES_PHASE],
      },
    ],
  },
  'Total Eclipse': {
    effects: [
      {
        name: `Total Eclipse`,
        desc: `Casting value of 8. Until your next hero phase, your opponent must spend 2 command points to use a command ability.`,
        when: [HERO_PHASE],
      },
    ],
  },
  'Protection of Hysh': {
    effects: [
      {
        name: `Protection of Hysh`,
        desc: `Casting value of 8. Until your next hero phase, roll a D6 each time you allocate a wound or mortal wound to a friendly unit wholly within 9" of the caster. On a 5+ the wound or mortal wound is negated. Cannot be saved in the same hero phase as Protection of Teclis.`,
        when: [HERO_PHASE],
      },
      {
        name: `Protection of Hysh`,
        desc: `If active, until your next hero phase, roll a D6 each time you allocate a wound or mortal wound to a friendly unit wholly within 9" of the caster. On a 5+ the wound or mortal wound is negated. Cannot be saved in the same hero phase as Protection of Teclis.`,
        when: [WOUND_ALLOCATION_PHASE],
      },
    ],
  },
  'Unyielding Calm': {
    effects: [
      {
        name: `Unyielding Calm`,
        desc: `Casting value of 4. Pick 1 friendly LUMINETH REALM-LORDS unit wholly within 18" of the caster. Until your next hero phase, do not take battleshock tests for that unit.`,
        when: [HERO_PHASE],
      },
      {
        name: `Unyielding Calm`,
        desc: `If active, until your next hero phase, do not take battleshock tests for that unit.`,
        when: [BATTLESHOCK_PHASE],
      },
    ],
  },
  'Crippling Vertigo': {
    effects: [
      {
        name: `Crippling Vertigo`,
        desc: `Casting value of 6. Pick 1 enemy unit wholly within 18" of the caster and visible to them. Until your next hero phase, roll 2D6 before that unit makes a normal move, charge move or pile-in move. If the roll is greater than that unit's bravery, it cannot make that move.`,
        when: [HERO_PHASE],
      },
      {
        name: `Crippling Vertigo`,
        desc: `If active, until your next hero phase, roll 2D6 before that unit makes a normal move, charge move or pile-in move. If the roll is greater than that unit's bravery, it cannot make that move.`,
        when: [MOVEMENT_PHASE, CHARGE_PHASE, COMBAT_PHASE],
      },
    ],
  },
  'Voice of the Mountains': {
    effects: [
      {
        name: `Voice of the Mountains`,
        desc: `Casting value of 6. Until the end of the turn, subtract 2 from the bravery of all enemy units. Then, until your next hero phase, subtract 1 from the bravery of all enemy units.`,
        when: [HERO_PHASE, BATTLESHOCK_PHASE],
      },
    ],
  },
  'Living Fissure': {
    effects: [
      {
        name: `Living Fissure`,
        desc: `Casting value of 6. Pick one point on the battlefield within 9" of the caster and visible to them. Draw a straight line 1mm wide between that point and the closest part of the caster's base. Roll a D6 for each unt that has models passed by the line. On a 2+ the unit suffers D3 mortal wounds.`,
        when: [HERO_PHASE],
      },
    ],
  },
  Entomb: {
    effects: [
      {
        name: `Entomb`,
        desc: `Casting value of 7. Pick one enemy model within 18" of the caster and visible to them. Roll a D6, if the roll is greater than the model's Wounds characteristic, that model is slain. If the roll is 6 but not greater than the model's Wounds characteristic, the model suffers D6 mortal wounds.`,
        when: [HERO_PHASE],
      },
    ],
  },
  'Assault of Stone': {
    effects: [
      {
        name: `Assault of Stone`,
        desc: `Casting value of 8. Pick one enemy model within 24" of the caster and visible to them. Roll a number of dice equal to the casting roll. For each roll that is less than the units Save characteristic, that unit suffers 1 mortal wound. Rolls of 1 or 2 always fail. A Save characteristic of '-' counts as a 6.`,
        when: [HERO_PHASE],
      },
    ],
  },
  'Protection of Teclis': {
    effects: [
      {
        name: `Protection of Teclis`,
        desc: `Casting value of 10. Until your next hero phase, roll a D6 each time you allocate a wound or mortal wound to a friendly unit wholly within 18" of the caster. On a 5+ the wound or mortal wound is negated. Cannot be used in the same hero phase as Protection of Hysh.`,
        when: [HERO_PHASE, WOUND_ALLOCATION_PHASE],
      },
    ],
  },
  'Storm of Searing White Light': {
    effects: [
      {
        name: `Storm of Searing White Light`,
        desc: `Casting value of 10. Roll a D6 for each enemy unit within 18" of the caster and visible to them. On a 1, nothing happens. On a 2-4 that unit suffers D3 mortal wounds. On a 5+ that unit suffers D6 mortal wounds.`,
        when: [HERO_PHASE],
      },
    ],
  },
  'Darkness of the Soul': {
    effects: [
      {
        name: `Darkness of the Soul`,
        desc: `Casting value of 7. Pick 1 enemy unit within 18" of the caster and visible to them. Until your next hero phase roll 2D6 each time that unit makes a normal move, charge move, shoots or fights. If the roll is greater than the unit's Bravery, that unit cannot perform that action in that phase.`,
        when: [HERO_PHASE, MOVEMENT_PHASE, CHARGE_PHASE, COMBAT_PHASE, SHOOTING_PHASE],
      },
    ],
  },
  'Gravitic Reduction': {
    effects: [
      {
        name: `Gravitic Reduction`,
        desc: `Casting value of 5. The caster can fly. In addition pick 1 enemy unit within 18" of the caster. The unit suffers 1 mortal wound and, until your next hero phase, its Movement characteristic is halved and it cannot fly.`,
        when: [HERO_PHASE, MOVEMENT_PHASE],
      },
    ],
  },
  'Dazzling Light': {
    effects: [
      {
        name: `Dazzling Light`,
        desc: `Casting value of 6. Until your next hero phase, subtract 1 from hit rolls targeting the caster and subtract 1 from missle weapon attacks targeting friendly units wholly within 6" of the caster.`,
        when: [HERO_PHASE],
      },
      {
        name: `Dazzling Light`,
        desc: `If active subtract, 1 from hit rolls targeting friendly units wholly within 6" of the caster.`,
        when: [SHOOTING_PHASE],
      },
      {
        name: `Dazzling Light`,
        desc: `If active subtract 1 from hit rolls targeting the caster.`,
        when: [COMBAT_PHASE],
      },
    ],
  },
  'Power of Hysh': {
    effects: [
      {
        name: `Power of Hysh`,
        desc: `Casting value of 6. Until your next hero phase, the Sunmetal Weapons ability for the caster and/or the unit they are part of causes mortal wounds to be inflicted on an unmodified hit roll of 5+ instead of 6. Any number of LUMINETH REALM-LORDS WIZARDS can attempt to cast Power of Hysh in the same hero phase.`,
        when: [HERO_PHASE, COMBAT_PHASE],
      },
    ],
  },
  'Overwhelming Heat': {
    effects: [
      {
        name: `Overwhelming Heat`,
        desc: `All ZAITREC WIZARDS know Overwhelming Heat. Casting value of 7. Pick 1 enemy unit wholly within 24" of the caster and visible to them. Halve the Move characteristic of that unit until your next hero phase. Roll a D6, if the roll is equal to or greater than the unit's Save characteristic, that unit suffers D3 mortal wounds.`,
        when: [HERO_PHASE, MOVEMENT_PHASE],
      },
    ],
  },
}

export default tagAs(Spells, 'spell')

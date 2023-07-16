import { tagAs } from 'factions/metatagger'
import {
  CHARGE_PHASE,
  COMBAT_PHASE,
  HERO_PHASE,
  MOVEMENT_PHASE,
  SAVES_PHASE,
  SHOOTING_PHASE,
  WOUND_ALLOCATION_PHASE,
} from 'types/phases'

const Spells = {
  //Lore of Hysh
  'Speed of Hysh': {
    effects: [
      {
        name: `Speed of Hysh`,
        desc: `Casting value of 5 and a range of 18". Pick 1 friendly Lumineth Realm-Lords unit wholly within range and visible to the caster. Double the move characteristic of that unit until your next hero phase.`,
        when: [HERO_PHASE, MOVEMENT_PHASE],
      },
    ],
  },
  'Solar Flare': {
    effects: [
      {
        name: `Solar Flare`,
        desc: `Casting value of 8 and a range of 10". Pick a point on the battlefield within range and visible to the caster. If there is an endless spell at that point, it is dispelled, and if there is a unit at that point, roll a number of dice equal to the number of models in that unit. For each 6, that unit suffers 1 mortal wound.`,
        when: [HERO_PHASE],
      },
    ],
  },
  'Protection of Hysh': {
    effects: [
      {
        name: `Protection of Hysh`,
        desc: `Casting value of 8 and a range of 9". Until your next hero phase, friendly units have a ward of 5+ while they are wholly within range of the caster. This spell cannot be cast in the same hero phase as Protection of Teclis.`,
        when: [HERO_PHASE],
      },
      {
        name: `Protection of Hysh`,
        desc: `If active, until your next hero phase, friendly units wholly within range of the caster have a ward of 5+.`,
        when: [WOUND_ALLOCATION_PHASE],
      },
    ],
  },
  'Overwhelming Heat': {
    effects: [
      {
        name: `Overwhelming Heat`,
        desc: `Casting value of 7 and a range of 24". Pick 1 enemy unit wholly within range and visible to the caster. Halve the Move characteristic of that unit until your next hero phase. Then roll a dice. If the roll is equal to or greater than the unit's Save characteristic, that unit suffers D3 mortal wounds.`,
        when: [HERO_PHASE, MOVEMENT_PHASE],
      },
    ],
  },
  'Etheral Blessings': {
    effects: [
      {
        name: `Etheral Blessings`,
        desc: `Casting value of 6 and a range of 18". Pick 1 friendly Lumineth Realm-Lords unit wholly within range and visible to the caster. Until your next hero phase, ignore modifiers (positive and negative) when making save rolls for attacks that target that unit.`,
        when: [HERO_PHASE],
      },
      {
        name: `Etheral Blessings`,
        desc: `If active, until your next hero phase, ignore modifiers (positive and negative) when making save rolls for attacks that target that unit.`,
        when: [SAVES_PHASE],
      },
    ],
  },
  'Total Eclipse': {
    effects: [
      {
        name: `Total Eclipse`,
        desc: `Casting value of 9. If successfully cast, until your next hero phase, your opponent must spend 2 command points to issue a command instead of 1.`,
        when: [HERO_PHASE],
      },
    ],
  },
  //Hurakan
  'Howling Gale': {
    effects: [
      {
        name: `Howling Gale`,
        desc: `Casting value of 7 and a range of 12". Pick 1 enemy unit within range and visible to the caster. That unit cannot issue or receive commands until your next hero phase.`,
        when: [HERO_PHASE],
      },
    ],
  },
  'Healing Zephyr': {
    effects: [
      {
        name: `Healing Zephyr`,
        desc: `Casting value of 6 and a range of 18". Pick 1 friendly Lumineth Realm-Lords unit wholly within range and visible to the caster. You can heal up to D3 wounds allocated to that unit.`,
        when: [HERO_PHASE],
      },
    ],
  },
  'Transporting Vortex': {
    effects: [
      {
        name: `Transporting Vortex`,
        desc: `Casting value of 8 and a range of 12". Pick 1 friendly Lumineth Realm-Lords unit wholly within range and visible to the caster. Remove that unit from the battlefield and set it up again on the battlefield more than 9" from all enemy units. That unit cannot move in the next movement phase.`,
        when: [HERO_PHASE],
      },
    ],
  },
  //Alarith
  'Unbreakable Stoicism': {
    effects: [
      {
        name: `Unbreakable Stoicism`,
        desc: `Casting value of 7 and a range of 12". Pick 1 friendly Stoneguard unit wholly within range and visible to the caster. Unitl your next hero phase, that unit's Crushing Blow ability causes mortal wounds on an unmodified hit roll of 5+ instead of 6.`,
        when: [HERO_PHASE, COMBAT_PHASE],
      },
    ],
  },
  'Crippling Vertigo': {
    effects: [
      {
        name: `Crippling Vertigo`,
        desc: `Casting value of 6 and a range of 18". Pick 1 enemy unit wholly within  range and visible to the caster. Until your next hero phase, roll 2D6 before that unit makes a normal move, runs, retreats, makes a charge move or makes a pile-in move. If the roll is greater than that unit's bravery, it cannot make that move.`,
        when: [HERO_PHASE],
      },
      {
        name: `Crippling Vertigo`,
        desc: `If active, until your next hero phase, roll 2D6 before that unit makes a normal move, runs, retreats, makes a charge move or makes a pile-in move. If the roll is greater than that unit's bravery, it cannot make that move.`,
        when: [MOVEMENT_PHASE, CHARGE_PHASE, COMBAT_PHASE],
      },
    ],
  },
  'Living Fissure': {
    effects: [
      {
        name: `Living Fissure`,
        desc: `Casting value of 7 and a range of 18". Pick one point on the battlefield within range of the caster that is visible to them and draw a straight line between that point and the closest part of the caster's base. Roll a dice for each unt that has models passed across by this line. On a 2+, that unit suffers D3 mortal wounds.`,
        when: [HERO_PHASE],
      },
    ],
  },

  //Units???

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
        desc: `Casting value of 10 and a range of 18". Until your next hero phase, friendly units have a ward of 5+ while they are wholly within range of the caster. This spell cannot be cast in the same phase as Protection of Hysh.`,
        when: [HERO_PHASE, WOUND_ALLOCATION_PHASE],
      },
    ],
  },
  'Storm of Searing White Light': {
    effects: [
      {
        name: `Storm of Searing White Light`,
        desc: `Casting value of 10 and a range of 18". If successfully cast, roll a dice for each enemy unit within range and visible to the caster.. On a 1, nothing happens. On a 2-4 that unit suffers D3 mortal wounds. On a 5+ that unit suffers D6 mortal wounds.`,
        when: [HERO_PHASE],
      },
    ],
  },
  'Darkness of the Soul': {
    effects: [
      {
        name: `Darkness of the Soul`,
        desc: `Casting value of 7 and a range of 18". Pick 1 enemy unit within range and visible to the caster. Until your next hero phase, roll 2D6 each time that unit makes a normal move, runs, retreats, makes a charge move, shoots or fights. Make the roll before the action is carried out. If the roll is greater than that unit's Bravery characteristic, that unit cannot perform that action in that phase.`,
        when: [HERO_PHASE],
      },
      {
        name: `Darkness of the Soul`,
        desc: `If active, until your next hero phase, roll 2D6 each time that unit makes a normal move, runs, retreats, makes a charge move, shoots or fights. Make the roll before the action is carried out. If the roll is greater than that unit's Bravery characteristic, that unit cannot perform that action in that phase.`,
        when: [MOVEMENT_PHASE, CHARGE_PHASE, COMBAT_PHASE, SHOOTING_PHASE],
      },
    ],
  },
  'Gravitic Redirection': {
    effects: [
      {
        name: `Gravitic Redirection`,
        desc: `Casting value of 5 and a range of 18". If successfully cast, until your next hero phase, the caster can fly. In addition, you can pick 1 enemy unit within range and visible to the caster. If you do so, until your next hero phase, that unit's Move characteristic is halved and it cannot fly.`,
        when: [HERO_PHASE, MOVEMENT_PHASE],
      },
    ],
  },
  'Power of Hysh': {
    effects: [
      {
        name: `Power of Hysh`,
        desc: `Casting value of 6. Until your next hero phase, the Sunmetal Weapons ability for the caster and/or the unit they are part of causes mortal wounds to be inflicted on an unmodified hit roll of 5+ instead of 6. Any number of LUMINETH REALM-LORDS WIZARDS can attempt to cast Power of Hysh in the same hero phase.`,
        when: [HERO_PHASE, COMBAT_PHASE, SHOOTING_PHASE],
      },
    ],
  },
  'Windblast Vortex': {
    effects: [
      {
        name: `Windblast Vortex`,
        desc: `Casting value of 5. Pick 1 enemy unit within 9" of the caster. Roll a dice, on a 2+ the unit suffers D3 mortal wounds.`,
        when: [HERO_PHASE, SHOOTING_PHASE],
      },
    ],
  },
  'Salvation of Hysh': {
    effects: [
      {
        name: `Salvation of Hysh`,
        desc: `Casting value of 6. If successfully cast, the caster has a ward of 5+ until your next hero phase.`,
        when: [HERO_PHASE],
      },
      {
        name: `Salvation of Hysh`,
        desc: `If active, until your next hero phase, the caster has a ward of 5+.`,
        when: [WOUND_ALLOCATION_PHASE],
      },
    ],
  },
  Erasure: {
    effects: [
      {
        name: `Erasure`,
        desc: `Casting value of 7. Pick 1 enemy HERO within 24" of the caster. You can either inflict D3 mortal wounds on that HERO or mark them for erasure. If the HERO is already marked for erasure, they instead suffer D6 mortal wounds and are no longer marked for erasure.`,
        when: [HERO_PHASE],
      },
    ],
  },
  'Greater Power of Hysh': {
    effects: [
      {
        name: `Greater Power of Hysh`,
        desc: `Casting value of 7 and a range of 18". Pick up to D3 friendly Lumineth Realm-Lords units with the Sunmetal Weapons ability wholly within range and visible to the caster. Until your next hero phase, the Sunmetal Weapons ability of those units causes mortal wounds on an unmodified hit roll of 5+ instead of 6.`,
        when: [HERO_PHASE, COMBAT_PHASE, SHOOTING_PHASE],
      },
    ],
  },
  'Twinned Tether': {
    effects: [
      {
        name: `Twinned Tether`,
        desc: `Casting value of 6 and a range of 12". Pick 1 enemy unit within range and visible to the caster. Until your next hero phase, each time a wound or mortal wound is allocated to the caster, your opponent must allocate a wound to that enemy unit.`,
        when: [HERO_PHASE],
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
}
export default tagAs(Spells, 'spell')

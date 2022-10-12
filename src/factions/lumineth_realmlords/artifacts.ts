import { tagAs } from 'factions/metatagger'
import {
  CHARGE_PHASE,
  COMBAT_PHASE,
  HERO_PHASE,
  MOVEMENT_PHASE,
  SHOOTING_PHASE,
  START_OF_COMBAT_PHASE,
  START_OF_GAME,
  WOUND_ALLOCATION_PHASE,
} from 'types/phases'

// Add individual artifacts here, and access them in other files!
const Artifacts = {
  //Vanari
  'Syari Pommel': {
    effects: [
      {
        name: `Syari Pommel`,
        desc: `The bearer starts the battle with 1 extra Aetherquartz reserve.`,
        when: [START_OF_GAME],
      },
    ],
  },
  'Senlui Amulet': {
    effects: [
      {
        name: `Senlui Amulet`,
        desc: `The bearer can run and still charge in the same turn.`,
        when: [MOVEMENT_PHASE, CHARGE_PHASE],
      },
    ],
  },
  Waystone: {
    effects: [
      {
        name: `Waystone`,
        desc: `Once per battle in your movement phase, instead of making a normal move with the bearer, you can pick a point on the battlefield within 12" of them. If you do so, remove the bearer from the battlefield and set them up agani within 1" of that point and more than 3" from all enemy units.`,
        when: [MOVEMENT_PHASE],
      },
    ],
  },
  //Scinari
  'Pheonix Stone': {
    effects: [
      {
        name: `Pheonix Stone`,
        desc: `Once per battle, before you allocate a wound or mortal wound to another friendly Lumineth Realm-Lords Hero within 12" of the bearer, and that wound or mortal wound would cause that Hero to be slain, you can roll a dice. On a 3+, that wound or mortal wound is negated, you can heal up to D3 wounds allocated to that Hero and any wounds that remain to be allocated to it are negated.`,
        when: [WOUND_ALLOCATION_PHASE],
      },
    ],
  },
  'Silver Wand': {
    effects: [
      {
        name: `Silver Wand`,
        desc: `The bearer can attempt to cast 1 extra spell in your hero phase.`,
        when: [HERO_PHASE],
      },
    ],
  },
  'Rune of Senthoi': {
    effects: [
      {
        name: `Rune of Senthoi`,
        desc: `Add 1 to unbinding and dispelling rolls for the bearer for each friendly Scinari Hero within 6" of the bearer.`,
        when: [HERO_PHASE],
      },
    ],
  },
  //Windmage
  'Windblast Fan': {
    effects: [
      {
        name: `Windblast Fan`,
        desc: `Once per battle, at the start of the enemy movement phase, you can pick 1 enemy unit within 3" of the bearer. That unit must retreat.`,
        when: [MOVEMENT_PHASE],
      },
    ],
  },
  'Wind Stone': {
    effects: [
      {
        name: `Windstone`,
        desc: `Once per battle, in your shooting phase, you can pick 1 enemy unit within 18" of the bearer and visible to them and roll a dice. On a 1, that unit suffers 1 mortal wound. On a 2-4, that unit suffers 2 mortal wounds. On a 5+, that unit suffers 4 mortal wounds.`,
        when: [SHOOTING_PHASE],
      },
    ],
  },
  'Buffeting Aspiragillum': {
    effects: [
      {
        name: `Buffeting Aspiragillum`,
        desc: `Once per battle, at the start of the combat phase, you can pick 1 enemy unit within 3" of the bearer. If you do so, subtract 1 from hit rolls and wound rolls for attacks made by that unit until the end of the phase.`,
        when: [START_OF_COMBAT_PHASE],
      },
    ],
  },
  //Stonemage
  'Hearthstone Amulet': {
    effects: [
      {
        name: `Hearthstone Amulet`,
        desc: `The bearer has a ward of 4+ against mortal wounds.`,
        when: [WOUND_ALLOCATION_PHASE],
      },
    ],
  },
  'Molten Talisman': {
    effects: [
      {
        name: `Molten Talisman'`,
        desc: `Add 1 to wound rolls for attacks made with melee weapons by friendly Alarith units wholly within 12" of the bearer if the bearer did not charge in the same turn.`,
        when: [COMBAT_PHASE],
      },
    ],
  },
  'Magmic Hammer': {
    effects: [
      {
        name: `Magmic Hammer`,
        desc: `Add 1 to the number of mortal wounds caused by Arcane Bolt spells that are cast by the bearer.`,
        when: [HERO_PHASE],
      },
    ],
  },
}

// Always export using tagAs
export default tagAs(Artifacts, 'artifact')

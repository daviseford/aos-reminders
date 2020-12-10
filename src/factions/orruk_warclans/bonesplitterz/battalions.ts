import { tagAs } from 'factions/metatagger'
import { CHARGE_PHASE, COMBAT_PHASE, HERO_PHASE, WOUND_ALLOCATION_PHASE } from 'types/phases'

const BonesplitterzBattalions = {
  'Big Rukk': {
    effects: [
      {
        name: `Big Rukk Warpaint`,
        desc: `When you use the Warpaint battle trait for a unit from this battalion, you can reroll the dice that determines if a wound or mortal wound is negated.`,
        when: [WOUND_ALLOCATION_PHASE],
      },
    ],
  },
  'Kop Rukk': {
    effects: [
      {
        name: `Savage Weird Power`,
        desc: `Pick 1 Wardokk from this battalion that is wholly within 18" of 2 or more units from this same battalion that each have 10 or more models. That Wardokk can attempt to cast the Fists of Gork spell from the Wurrgog Prophet warscroll in that phase in addtion to any other spells it can cast.`,
        when: [HERO_PHASE],
      },
    ],
  },
  'Snaga Rukk': {
    effects: [
      {
        name: `Maniak Stampede`,
        desc: `You can reroll charge rolls for units in this battalion while they are wholly within 12" of the Maniak Weirdknob from this battalion.`,
        when: [CHARGE_PHASE],
      },
    ],
  },
  'Brutal Rukk': {
    effects: [
      {
        name: `Savage Swiftness`,
        desc: `Units in this battalion that are wholly within 12" of the Savage Big Boxx at the start of the charge phase can charge even if they have run earlier in the turn.`,
        when: [CHARGE_PHASE],
      },
    ],
  },
  "Kunnin' Rukk": {
    effects: [
      {
        name: `Dead Sneaky`,
        desc: `Pick one unit from the Kunnin' Rukk that is wholly within 12" of the battalion's Big Boss. That unit can move as if it were the movement phase, or shoot as if it were the shooting phase. Units in this battalion cannot have more than 20 models.`,
        when: [HERO_PHASE],
      },
    ],
  },
  'Teef Rukk': {
    effects: [
      {
        name: `We're Da Best`,
        desc: `Add 1 to the attacks characteristic of melee weapons use by units from this battalion while they are wholly within 12" of the Savage Big Boss from this battalion.`,
        when: [COMBAT_PHASE],
      },
    ],
  },
}

// Always export using tagAs
export default tagAs(BonesplitterzBattalions, 'battalion')

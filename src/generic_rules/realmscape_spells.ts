// Realm Spells
import { TEntry } from 'types/data'
import {
  CHARGE_PHASE,
  COMBAT_PHASE,
  DURING_GAME,
  HERO_PHASE,
  MOVEMENT_PHASE,
  SAVES_PHASE,
  SHOOTING_PHASE,
} from 'types/phases'
import {
  AQSHY,
  CHAMON,
  CHARRWIND,
  EIGHTPOINTS,
  GHUR,
  GHYRAN,
  HELLEFlUX,
  HYSH,
  SHYISH,
  STYGXX,
  ULGU,
  UMBRAL,
  VARANTHAX,
} from 'types/realmscapes'

const Spells: TEntry[] = [
  {
    name: `Fireball (${AQSHY})`,
    effects: [
      {
        name: `Fireball (${AQSHY})`,
        desc: `Casting value of 5. Pick an enemy unit within 18" and visible to the caster. If the enemy unit has 1 model, it suffers 1 mortal wound. 2-9 models, it suffers D3 mortal wounds. 10+ models, it suffers D6 mortal wounds.`,
        when: [HERO_PHASE],
      },
    ],
  },
  {
    name: `Metamorphic Warding (${CHAMON})`,
    effects: [
      {
        name: `Metamorphic Warding (${CHAMON})`,
        desc: `Casting value of 7. Pick 1 friendly unit wholly within 12" of the caster and visible to them. Add 1 to save rolls for attacks that target that unit until the start of your next hero phase.`,
        when: [HERO_PHASE],
      },
      {
        name: `Metamorphic Warding (${CHAMON})`,
        desc: `If active, add 1 to save rolls for attacks that target the buffed unit.`,
        when: [SAVES_PHASE],
      },
    ],
  },
  {
    name: `Wildform (${GHUR})`,
    effects: [
      {
        name: `Wildform (${GHUR})`,
        desc: `Casting value of 5. Pick a friendly unit within 12" and visible to the caster. Add 2 to the charge and run rolls made for the targeted unit until your next hero phase.`,
        when: [HERO_PHASE],
      },
      {
        name: `Wildform (${GHUR})`,
        desc: `If active, add 2 to the run rolls made for the buffed unit.`,
        when: [MOVEMENT_PHASE],
      },
      {
        name: `Wildform (${GHUR})`,
        desc: `If active, add 2 to the charge rolls made for the buffed unit.`,
        when: [CHARGE_PHASE],
      },
    ],
  },
  {
    name: `Shield of Thorns (${GHYRAN})`,
    effects: [
      {
        name: `Shield of Thorns (${GHYRAN})`,
        desc: `Casting value of 5. Pick a friendly unit within 18" and visible to the caster. Until your next hero phase, any enemy unit that finishes a charge move within 3" of the target suffers D3 mortal wounds. The same friendly unit cannot be picked as the target of this spell more than once per turn.`,
        when: [HERO_PHASE],
      },
      {
        name: `Shield of Thorns (${GHYRAN})`,
        desc: `If active, any enemy unit that finishes a charge move within 3" of the buffed unit suffers D3 mortal wounds.`,
        when: [CHARGE_PHASE],
      },
    ],
  },
  {
    name: `Purity of Defence (${HYSH})`,
    effects: [
      {
        name: `Purity of Defence (${HYSH})`,
        desc: `Casting value of 5. Pick 1 friendly unit wholly within 12" of the caster and visible to them. You can reroll save rolls of 1 for attacks that target that unit until the start of your next hero phase.`,
        when: [HERO_PHASE],
      },
      {
        name: `Purity of Defence (${HYSH})`,
        desc: `If active, you can reroll save rolls of 1 for attacks that target the buffed unit.`,
        when: [SAVES_PHASE],
      },
    ],
  },
  {
    name: `Ripples of the Necroquake (${SHYISH})`,
    effects: [
      {
        name: `Ripples of the Necroquake (${SHYISH})`,
        desc: `Casting value of 7. Until the end of this phase, add 1 to casting rolls made for friendly WIZARDS if the casting roll is for an endless spell.`,
        when: [HERO_PHASE],
      },
    ],
  },
  {
    name: `Judgement of Shadow (${ULGU})`,
    effects: [
      {
        name: `Judgement of Shadow (${ULGU})`,
        desc: `Casting value of 7. Pick 1 enemy unit within 12" of the caster that is visible to them and roll 7 dice. For each roll that is less than that unit's unmodified Save characteristic, that unit suffers 1 mortal wound. If the target has an unmodified Save characteristic of '-', it suffers 1 mortal wound for each 2+ instead.`,
        when: [HERO_PHASE],
      },
    ],
  },
  {
    name: `Pall of Doom (${STYGXX})`,
    effects: [
      {
        name: `Pall of Doom (${STYGXX})`,
        desc: `Casting value of 6. Pick an enemy unit within 18" and visible to the caster. Subtract 2 from the bravery characteristic of the target until the end of your next hero phase.`,
        when: [HERO_PHASE],
      },
      {
        name: `Pall of Doom (${STYGXX})`,
        desc: `If active, subtract 2 from the bravery characteristic of the affected unit.`,
        when: [DURING_GAME],
      },
    ],
  },
  // This will probably have to move to a realmscape_prayers.ts file in 4.0 (assuming we're separating spells from prayers at the lowest level).
  {
    name: `Communion with the Ancient Dead (Priest) (${STYGXX})`,
    effects: [
      {
        name: `Communion with the Ancient Dead (Priest) (${STYGXX})`,
        desc: `Select a priest to roll a D6. On a 1, the priest suffers a mortal wound. On a 2-5, nothing happens. On a 6, receive 1 command point. Can only be attempted once per turn.`,
        when: [HERO_PHASE],
      },
    ],
  },
  {
    name: `Marked Quarry (${EIGHTPOINTS})`,
    effects: [
      {
        name: `Marked Quarry (${EIGHTPOINTS})`,
        desc: `Casting value of 7. Pick an enemy unit within 18" and visible to the caster. Until the start of your next hero phase, Roaming Monsters must make any normal (non-retreat) or charge moves towards the target unit. Any shooting attacks by Roaming Monsters must target the selected unit (even if selected unit is not the closest).`,
        when: [HERO_PHASE],
      },
      {
        name: `Marked Quarry (${EIGHTPOINTS})`,
        desc: `If active, Roaming Monsters must make any normal (non-retreat) or charge moves towards the affected unit.`,
        when: [MOVEMENT_PHASE, CHARGE_PHASE],
      },
      {
        name: `Marked Quarry (${EIGHTPOINTS})`,
        desc: `If active, any shooting attacks by Roaming Monsters must target the affected unit (even if selected unit is not the closest).`,
        when: [SHOOTING_PHASE],
      },
    ],
  },
  {
    name: `Judgement of Shadow (${UMBRAL})`,
    effects: [
      {
        name: `Judgement of Shadow (${UMBRAL})`,
        desc: `Casting value of 7. Pick an enemy unit within 12" and visible to the caster. Roll 7 dice. For each roll that is less than the target's save characteristic inflict 1 mortal wound. 1's always fail on target and save characteristics of '-' count as a 6.`,
        when: [HERO_PHASE],
      },
    ],
  },
  {
    name: `Umbral Leap (${HELLEFlUX})`,
    effects: [
      {
        name: `Umbral Leap (${HELLEFlUX})`,
        desc: `Casting value of 8. Remove the caster and set up again more than 9" from enemy units. If cast and not unbound, the caster cannot move in this movement phase.`,
        when: [HERO_PHASE],
      },
      {
        name: `Umbral Leap (${HELLEFlUX})`,
        desc: `If active, the caster cannot move in this movement phase.`,
        when: [MOVEMENT_PHASE],
      },
    ],
  },
  {
    name: `Scalehide (${CHARRWIND})`,
    effects: [
      {
        name: `Scalehide (${CHARRWIND})`,
        desc: `Casting value of 7. Pick a mountless friendly unit within 12" and visible to the caster. Add 1 to the target's save rolls until your next hero phase.`,
        when: [HERO_PHASE],
      },
      {
        name: `Scalehide (${CHARRWIND})`,
        desc: `If active, add 1 to the target's save rolls.`,
        when: [SAVES_PHASE],
      },
    ],
  },
  {
    name: `Fleshwarp (${VARANTHAX})`,
    effects: [
      {
        name: `Fleshwarp (${VARANTHAX})`,
        desc: `Casting value of 8. Pick an enemy hero within 12" and visible to the caster. Subtract 1 from the target's hit rolls for the rest of the battle. The same hero cannot be targeted more than once and its mount is unaffected.`,
        when: [HERO_PHASE],
      },
      {
        name: `Fleshwarp (${VARANTHAX})`,
        desc: `If active, subtract 1 from the target's hit rolls for the rest of the battle. The mount is unaffected.`,
        when: [SHOOTING_PHASE, COMBAT_PHASE],
      },
    ],
  },
]

export default Spells

import { TSpells } from 'types/army'
import { CHARGE_PHASE, COMBAT_PHASE, HERO_PHASE, MOVEMENT_PHASE, SHOOTING_PHASE } from 'types/phases'
import { AQSHY, CHAMON, GHUR, GHYRAN, HYSH, SHYISH, ULGU } from 'types/realmscapes'

// Realm Spells
const Spells: TSpells = [
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
        when: [COMBAT_PHASE, SHOOTING_PHASE],
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
        desc: `Casting value of 5. Pick 1 friendly unit wholly within 12" of the caster and visible to them. You can re-roll save rolls of 1 for attacks that target that unit until the start of you next hero phase.`,
        when: [HERO_PHASE],
      },
      {
        name: `Purity of Defence (${HYSH})`,
        desc: `If active, you can re-roll save rolls of 1 for attacks that target the buffed unit.`,
        when: [COMBAT_PHASE, SHOOTING_PHASE],
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
]

export default Spells

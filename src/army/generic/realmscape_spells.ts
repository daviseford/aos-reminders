import {
  BATTLESHOCK_PHASE,
  CHARGE_PHASE,
  COMBAT_PHASE,
  DURING_GAME,
  HERO_PHASE,
  MOVEMENT_PHASE,
  SHOOTING_PHASE,
} from 'types/phases'
import { TSpells } from 'types/army'
import { AQSHY, CHAMON, GHUR, GHYRAN, HYSH, SHYISH, STYGXX, ULGU } from 'types/realmscapes'

// Realm Spells
const Spells: TSpells = [
  {
    name: `Fireball (${AQSHY})`,
    effects: [
      {
        name: `Fireball (${AQSHY})`,
        desc: `Casting value of 5. If successfully cast, pick an enemy unit within 18" and visible to the caster. If the enemy unit has 1 model, it suffers 1 mortal wound. 2-9 models, it suffers D3 mortal wounds. 10+ models, it suffers D6 mortal wounds.`,
        when: [HERO_PHASE],
      },
    ],
  },
  {
    name: `Stoke Rage (${AQSHY})`,
    effects: [
      {
        name: `Stoke Rage (${AQSHY})`,
        desc: `Casting value of 6. If successfully cast, pick a friendly unit within 12" of the caster that is visible to them. Add 1 to wound rolls and charge rolls for that unit until your next hero phase.`,
        when: [HERO_PHASE],
      },
    ],
  },
  {
    name: `Inferno Blades (${AQSHY})`,
    effects: [
      {
        name: `Inferno Blades (${AQSHY})`,
        desc: `Casting value of 6. If successfully cast, pick a friendly unit within 12" of the caster. Add 1 to the Damage characteristic of melee weapons used by that unit until your next hero phase.`,
        when: [HERO_PHASE, COMBAT_PHASE],
      },
    ],
  },
  {
    name: `Fiery Blast (${AQSHY})`,
    effects: [
      {
        name: `Fiery Blast (${AQSHY})`,
        desc: `Casting value of 7. If successfully cast, pick a point on the battlefield within 18" of the caster that is visible to them. Roll a D6 for each unit (friend or foe) within 3" of this point. On a 4+ that unit suffers D3 mortal wounds.`,
        when: [HERO_PHASE],
      },
    ],
  },
  {
    name: `Glare of Vulcatrix (${AQSHY})`,
    effects: [
      {
        name: `Glare of Vulcatrix (${AQSHY})`,
        desc: `Casting value of 8. If successfully cast, pick an enemy unit within 9" of the caster that is visible to them. Roll a D6; if the result is higher than the unit's Wounds characteristic, a model from that unit is slain.`,
        when: [HERO_PHASE],
      },
    ],
  },
  {
    name: `Parch (${AQSHY})`,
    effects: [
      {
        name: `Parch (${AQSHY})`,
        desc: `Casting value of 6. If successfully cast, pick an enemy unit within 18" of the caster. That unit must halve its Move characteristic until your next hero phase.`,
        when: [HERO_PHASE, MOVEMENT_PHASE],
      },
      {
        name: `Parch (${AQSHY})`,
        desc: `If successfully cast, roll a D6 each time that unit completes a charge move until your next hero phase. On a 5+ the unit suffers D3 mortal wounds.`,
        when: [CHARGE_PHASE],
      },
    ],
  },
  {
    name: `Incandescent Form (${AQSHY})`,
    effects: [
      {
        name: `Incandescent Form (${AQSHY})`,
        desc: `Casting value of 6. If successfully cast, subtract 1 from hit rolls for attacks that target the caster until your next hero phase.`,
        when: [HERO_PHASE, COMBAT_PHASE, SHOOTING_PHASE],
      },
    ],
  },
  {
    name: `Transmutation of Lead (${CHAMON})`,
    effects: [
      {
        name: `Transmutation of Lead (${CHAMON})`,
        desc: `Casting value of 7. If successfully cast, pick an enemy unit within 18" and visible to the caster. Until your next hero phase, halve the move characteristic of the target rounding up and, if the unit has a save characterstic of 2+, 3+, or 4+, re-roll hit rolls of 1 against the targeted unit.`,
        when: [HERO_PHASE],
      },
      {
        name: `Transmutation of Lead (${CHAMON})`,
        desc: `If active, halve the move characteristic of the debuffed unit rounding up and, if the unit has a save characterstic of 2+, 3+, or 4+, re-roll hit rolls of 1 against the debuffed unit.`,
        when: [DURING_GAME],
      },
    ],
  },
  {
    name: `Rain of Lead (${CHAMON})`,
    effects: [
      {
        name: `Rain of Lead (${CHAMON})`,
        desc: `Casting value of 6. If successfully cast, pick an enemy unit within 18" of the caster that is visible to them. That unit suffers D3 mortal wounds.`,
        when: [HERO_PHASE],
      },
      {
        name: `Rain of Lead (${CHAMON})`,
        desc: `If successfully cast, subtract 1" from that unit's Move characteristic until your next hero phase.`,
        when: [MOVEMENT_PHASE],
      },
    ],
  },
  {
    name: `Curse of Rust (${CHAMON})`,
    effects: [
      {
        name: `Curse of Rust (${CHAMON})`,
        desc: `Casting value of 7. If successfully cast, pick an enemy unit within 12" of the caster that is visible to them. Subtract 1 from hit rolls and save rolls for that unit until your next hero phase.`,
        when: [HERO_PHASE, SHOOTING_PHASE, COMBAT_PHASE],
      },
    ],
  },
  {
    name: `Molten Gaze (${CHAMON})`,
    effects: [
      {
        name: `Molten Gaze (${CHAMON})`,
        desc: `Casting value of 6. If successfully cast, pick a point on the battlefield within 12" of the caster that is visible to them and draw an imaginary straight line 1mm wide between that point and the closest part of the caster. Each unit other than the caster that has models passed across by this line suffers 1 mortal wound.`,
        when: [HERO_PHASE],
      },
    ],
  },
  {
    name: `Rule of Burning Iron (${CHAMON})`,
    effects: [
      {
        name: `Rule of Burning Iron (${CHAMON})`,
        desc: `Casting value of 8. If successfully cast, pick an enemy unit within 12" of the caster that is visible to them. Roll a D6 for each model in that unit. For each 6+ that unit suffers 1 mortal wound.`,
        when: [HERO_PHASE],
      },
    ],
  },
  {
    name: `Glittering Robe (${CHAMON})`,
    effects: [
      {
        name: `Glittering Robe (${CHAMON})`,
        desc: `Casting value of 6. If successfully cast, re-roll save rolls of 1 for the caster until your next hero phase.`,
        when: [HERO_PHASE, SHOOTING_PHASE, COMBAT_PHASE],
      },
    ],
  },
  {
    name: `Transmutation (${CHAMON})`,
    effects: [
      {
        name: `Transmutation (${CHAMON})`,
        desc: `Casting value of 7. If successfully cast, pick an enemy unit within 18" of the caster that is visible to them and roll 3 dice. For each roll that is greater than that unit's Wounds characteristic, 1 model from that unit is slain.`,
        when: [HERO_PHASE],
      },
    ],
  },
  {
    name: `Wildform (${GHUR})`,
    effects: [
      {
        name: `Wildform (${GHUR})`,
        desc: `Casting value of 5. If successfully cast, pick a friendly unit within 12" and visible to the caster. Add 2 to the charge and run rolls made for the targeted unit until your next hero phase.`,
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
    name: `The Amber Spears (${GHUR})`,
    effects: [
      {
        name: `The Amber Spears (${GHUR})`,
        desc: `Casting value of 6. If successfully cast, pick a point on the battlefield within 12" of the caster that is visible to them and draw an imaginary straight line 1mm wide between that point and the closest part of the caster. Each unit other than the caster that has models passed across by this line suffers 1 mortal wound.`,
        when: [HERO_PHASE],
      },
    ],
  },
  {
    name: `Bestial Spirit (${GHUR})`,
    effects: [
      {
        name: `Bestial Spirit (${GHUR})`,
        desc: `Casting value of 6. If successfully cast, pick an enemy unit within 18" of the caster that is visible to them. That unit suffers D3 mortal wounds. In addition, if the unit suffers 3 mortal wounds from this spell, subtract 1 from its Bravery characteristic until your next hero phase.`,
        when: [HERO_PHASE],
      },
      {
        name: `Bestial Spirit (${GHUR})`,
        desc: `If a unit suffers 3 mortal wounds from this spell, subtract 1 from its Bravery characteristic until your next hero phase.`,
        when: [BATTLESHOCK_PHASE],
      },
    ],
  },
  {
    name: `Flock of Doom (${GHUR})`,
    effects: [
      {
        name: `Flock of Doom (${GHUR})`,
        desc: `Casting value of 6. If successfully cast, pick an enemy unit within 18" of the caster that is visible to them and roll 12 dice. For each 6+ that enemy unit suffers 1 mortal wound.`,
        when: [HERO_PHASE],
      },
    ],
  },
  {
    name: `Impenetrable Hide (${GHUR})`,
    effects: [
      {
        name: `Impenetrable Hide (${GHUR})`,
        desc: `Casting value of 6. If successfully cast, you can re-roll failed save rolls for the caster until the start of your next hero phase.`,
        when: [HERO_PHASE],
      },
    ],
  },
  {
    name: `Cower (${GHUR})`,
    effects: [
      {
        name: `Cower (${GHUR})`,
        desc: `Casting value of 6. If successfully cast, pick an enemy MONSTER within 12" of the caster that is visible to them and roll 2D6. If the result is higher than that MONSTER's Bravery characteristic, it cannot make a charge move in your opponent's next turn.`,
        when: [HERO_PHASE],
      },
    ],
  },
  {
    name: `Primal Hunter (${GHUR})`,
    effects: [
      {
        name: `Primal Hunter (${GHUR})`,
        desc: `Casting value of 8. If successfully cast, pick a friendly HERO within 12" of the caster that is visible to them.`,
        when: [HERO_PHASE],
      },
      {
        name: `Primal Hunter (${GHUR})`,
        desc: `If successfully cast, Re-roll failed charge rolls and hit rolls for that HERO until your next hero phase.`,
        when: [CHARGE_PHASE, SHOOTING_PHASE, COMBAT_PHASE],
      },
    ],
  },
  {
    name: `Shield of Thorns (${GHYRAN})`,
    effects: [
      {
        name: `Shield of Thorns (${GHYRAN})`,
        desc: `Casting value of 5. If successfully cast, pick a friendly unit within 18" and visible to the caster. Until your next hero phase, any enemy unit that finishes a charge move within 3" of the target suffers D3 mortal wounds.`,
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
    name: `Whipvines (${GHYRAN})`,
    effects: [
      {
        name: `Whipvines (${GHYRAN})`,
        desc: `Casting value of 5. If successfully cast, pick a point on the battlefield within 18" of the caster that is visible to them. Roll a D6 for each enemy unit within 3" of this point. On a 4+ the unit being rolled for suffers 1 mortal wound.`,
        when: [HERO_PHASE],
      },
    ],
  },
  {
    name: `Mirrorpool (${GHYRAN})`,
    effects: [
      {
        name: `Mirrorpool (${GHYRAN})`,
        desc: `Casting value of 6. If successfully cast, remove the caster from the battlefield and set them up again anywhere within 18" of their previous position, more than 9" from any enemy models.`,
        when: [HERO_PHASE],
      },
    ],
  },
  {
    name: `Realmblood (${GHYRAN})`,
    effects: [
      {
        name: `Realmblood (${GHYRAN})`,
        desc: `Casting value of 7. If successfully cast, heal D3 wounds allocated to the caster.`,
        when: [HERO_PHASE],
      },
    ],
  },
  {
    name: `Briarstorm (${GHYRAN})`,
    effects: [
      {
        name: `Briarstorm (${GHYRAN})`,
        desc: `Casting value of 6. If successfully cast, pick a point on the battlefield within 18" of the caster. Until your next hero phase, any unit that finishes a move within 3" of that point suffers D3 mortal wounds.`,
        when: [HERO_PHASE],
      },
    ],
  },
  {
    name: `Flesh to Stone (${GHYRAN})`,
    effects: [
      {
        name: `Flesh to Stone (${GHYRAN})`,
        desc: `Casting value of 7. If successfully cast, re-roll successful wound rolls for attacks that target the caster until your next hero phase.`,
        when: [HERO_PHASE],
      },
    ],
  },
  {
    name: `Sicklewind (${GHYRAN})`,
    effects: [
      {
        name: `Sicklewind (${GHYRAN})`,
        desc: `Casting value of 7. If successfully cast, pick a point on the battlefield within 12" of the caster that is visible to them and draw an imaginary straight line 1mm wide between that point and the closest part of the caster. Each unit other than the caster that has models passed across by this line suffers D3 mortal wounds.`,
        when: [HERO_PHASE],
      },
    ],
  },
  {
    name: `Pha's Protection (${HYSH})`,
    effects: [
      {
        name: `Pha's Protection (${HYSH})`,
        desc: `Casting value of 5. If successfully cast, pick a friendly unit within 18" and visible to the caster. Subtract 1 from hit rolls made against the target until your next hero phase.`,
        when: [HERO_PHASE],
      },
      {
        name: `Pha's Protection (${HYSH})`,
        desc: `If active, subtract 1 from hit rolls made against the buffed unit.`,
        when: [DURING_GAME],
      },
    ],
  },
  {
    name: `Exorcising Beam (${HYSH})`,
    effects: [
      {
        name: `Exorcising Beam (${HYSH})`,
        desc: `Casting value of 6. If successfully cast, pick an enemy unit within 12" of the caster that is visible to them. That unit suffers D3 mortal wounds. If the enemy unit is a DAEMON or DEATH unit, it suffers D6 mortal wounds instead.`,
        when: [HERO_PHASE],
      },
    ],
  },
  {
    name: `Light of Battle (${HYSH})`,
    effects: [
      {
        name: `Light of Battle (${HYSH})`,
        desc: `Casting value of 5. If successfully cast, pick a friendly unit within 18" of the caster. Do not take battleshock tests for that unit until your next hero phase.`,
        when: [HERO_PHASE, BATTLESHOCK_PHASE],
      },
    ],
  },
  {
    name: `Vengeful Illumination (${HYSH})`,
    effects: [
      {
        name: `Vengeful Illumination (${HYSH})`,
        desc: `Casting value of 7. If successfully cast, pick an enemy unit within 18" of the caster that is visible to them. Add 1 to hit rolls for attacks made with missile weapons that target that unit until your next hero phase.`,
        when: [HERO_PHASE, SHOOTING_PHASE],
      },
    ],
  },
  {
    name: `Aetheric Net (${HYSH})`,
    effects: [
      {
        name: `Aetheric Net (${HYSH})`,
        desc: `Casting value of 6. If successfully cast, pick a point on the battlefield within 18" of the caster. Roll a D6 for each unit (friend or foe) within 3" of that point. On a 4+ that unit suffers 1 mortal wound, and its Move characteristic is halved until your next hero phase.`,
        when: [HERO_PHASE, MOVEMENT_PHASE],
      },
    ],
  },
  {
    name: `Healing Glow (${HYSH})`,
    effects: [
      {
        name: `Healing Glow (${HYSH})`,
        desc: `Casting value of 7. If successfully cast, pick a friendly unit within 6" of the caster that is visible to them. Heal D3 wounds allocated to that unit.`,
        when: [HERO_PHASE],
      },
    ],
  },
  {
    name: `Banishment (${HYSH})`,
    effects: [
      {
        name: `Banishment (${HYSH})`,
        desc: `Casting value of 8. If successfully cast, pick 1 enemy unit within 12" of the caster that is visible to them. Your opponent must remove that unit from the battlefield and then set it up again, anywhere on the battlefield more than 24" from the caster and more than 9" from any other models from the caster's army.`,
        when: [HERO_PHASE],
      },
    ],
  },
  {
    name: `Pall of Doom (${SHYISH}) (${STYGXX})`,
    effects: [
      {
        name: `Pall of Doom (${SHYISH}) (${STYGXX})`,
        desc: `Casting value of 6. If successfully cast, pick an enemy unit within 18" and visible to the caster. Subtract 2 from the bravery characteristic of the target until the end of your next hero phase.`,
        when: [HERO_PHASE],
      },
      {
        name: `Pall of Doom (${SHYISH}) (${STYGXX})`,
        desc: `If active, subtract 2 from the bravery characteristic of the affected unit.`,
        when: [DURING_GAME],
      },
    ],
  },
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
    name: `Word of Ending (${SHYISH})`,
    effects: [
      {
        name: `Word of Ending (${SHYISH})`,
        desc: `Casting value of 6. If successfully cast, pick an enemy HERO within 12" of the caster that is visible to them and roll a D6. If the result is more than the number of wounds allocated to that model, it suffers D3 mortal wounds.`,
        when: [HERO_PHASE],
      },
    ],
  },
  {
    name: `Night's Touch (${SHYISH})`,
    effects: [
      {
        name: `Night's Touch (${SHYISH})`,
        desc: `Casting value of 8. If successfully cast, pick a friendly unit within 6" of the caster that is visible to them. Ignore modifiers (positive and negative) when making save rolls for that unit until your next hero phase.`,
        when: [HERO_PHASE, COMBAT_PHASE, SHOOTING_PHASE],
      },
    ],
  },
  {
    name: `Soulshroud (${SHYISH})`,
    effects: [
      {
        name: `Soulshroud (${SHYISH})`,
        desc: `Casting value of 6. If successfully cast, pick a friendly unit within 12" of the caster that is visible to them. That unit is not affected by other spells until your next hero phase.`,
        when: [HERO_PHASE],
      },
    ],
  },
  {
    name: `Unnatural Darkness (${SHYISH})`,
    effects: [
      {
        name: `Unnatural Darkness (${SHYISH})`,
        desc: `Casting value of 6. If successfully cast, pick a friendly unit within 12" of the caster that is visible to them. Subtract 1 from hit rolls for attacks that target that unit until your next hero phase.`,
        when: [HERO_PHASE, COMBAT_PHASE, SHOOTING_PHASE],
      },
    ],
  },
  {
    name: `Soulflay (${SHYISH})`,
    effects: [
      {
        name: `Soulflay (${SHYISH})`,
        desc: `Casting value of 7. If successfully cast, pick an enemy HERO within 12" of the caster that is visible to them. That unit suffers D3 mortal wounds.`,
        when: [HERO_PHASE],
      },
      {
        name: `Soulflay (${SHYISH})`,
        desc: `If the unit suffers 3 mortal wounds from this spell, subtract 2 from its Bravery characteristic until your next hero phase.`,
        when: [BATTLESHOCK_PHASE],
      },
    ],
  },
  {
    name: `Ethereal Guide (${SHYISH})`,
    effects: [
      {
        name: `Ethereal Guide (${SHYISH})`,
        desc: `Casting value of 6. If successfully cast, add 1 to hit rolls for attacks made by the caster until your next hero phase.`,
        when: [HERO_PHASE, COMBAT_PHASE, SHOOTING_PHASE],
      },
    ],
  },
  {
    name: `Mystifying Miasma (${ULGU})`,
    effects: [
      {
        name: `Mystifying Miasma (${ULGU})`,
        desc: `Casting value of 4. If successfully cast, pick an enemy unit within 18" and visible to the caster. The unit cannot run and subtracts 2 from its charge rolls until your next hero phase.`,
        when: [HERO_PHASE],
      },
      {
        name: `Mystifying Miasma (${ULGU})`,
        desc: `If active, the debuffed unit cannot run.`,
        when: [MOVEMENT_PHASE],
      },
      {
        name: `Mystifying Miasma (${ULGU})`,
        desc: `If active, the debuffed unit subtracts 2 from its charge rolls.`,
        when: [CHARGE_PHASE],
      },
    ],
  },
  {
    name: `Labyrinth of Sorrows (${ULGU})`,
    effects: [
      {
        name: `Labyrinth of Sorrows (${ULGU})`,
        desc: `Casting value of 5. If successfully cast, pick an enemy unit within 12" of the caster that is visible to them. Halve the Move characteristic of that unit until your next hero phase.`,
        when: [HERO_PHASE, MOVEMENT_PHASE],
      },
    ],
  },
  {
    name: `Crown of Asphyxiation (${ULGU})`,
    effects: [
      {
        name: `Crown of Asphyxiation (${ULGU})`,
        desc: `Casting value of 6. If successfully cast, roll a D6 for each enemy unit within 3" of the caster. On a 4+ that unit suffers 1 mortal wound.`,
        when: [HERO_PHASE],
      },
    ],
  },
  {
    name: `The Enfeebling (${ULGU})`,
    effects: [
      {
        name: `The Enfeebling (${ULGU})`,
        desc: `Casting value of 6. If successfully cast, pick an enemy unit within 12" of the caster. Re-roll failed wound rolls for attacks that target this unit until your next hero phase.`,
        when: [HERO_PHASE],
      },
    ],
  },
  {
    name: `Phantasmal Guardian (${ULGU})`,
    effects: [
      {
        name: `Phantasmal Guardian (${ULGU})`,
        desc: `Casting value of 6. If successfully cast, roll a D6 each time you allocate a wound or mortal wound to the caster until your next hero phase. On a 5+ the wound is negated.`,
        when: [HERO_PHASE],
      },
    ],
  },
  {
    name: `Bridge of Shadows (${ULGU})`,
    effects: [
      {
        name: `Bridge of Shadows (${ULGU})`,
        desc: `Casting value of 6. If successfully cast, pick a friendly unit wholly within 12" of the caster and remove it from the battlefield. Set it up anywhere on the battlefield that is wholly within 24" of the caster and more than 9" from any enemy models. It may not move in the subsequent movement phase.`,
        when: [HERO_PHASE],
      },
    ],
  },
  {
    name: `Aetheric Tendrils (${ULGU})`,
    effects: [
      {
        name: `Aetheric Tendrils (${ULGU})`,
        desc: `Casting value of 6. If successfully cast, pick an enemy unit within 12" of the caster that is visible to them. That unit suffers D3 mortal wounds. If that unit is a HERO or MONSTER, you can make a normal move with that unit as if it had a Move characteristic of 4".`,
        when: [HERO_PHASE],
      },
    ],
  },
]

export default Spells

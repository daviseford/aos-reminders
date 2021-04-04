import { tagAs } from 'factions/metatagger'
import { HERO_PHASE } from 'types/phases'

const Spells = {
  // Lore of the Deathmages
  'Overwhelming Dread (Deathmages)': {
    effects: [
      {
        name: `Overwhelming Dread (Deathmages)`,
        desc: `Casting value of 5. Pick an enemy unit within 18" of the caster that is visible to them. Until your next hero phase, subtract 1 from hit rolls for that unit and subtract 1 from that unit's Bravery characteristic.`,
        when: [HERO_PHASE],
      },
    ],
  },
  'Fading Vigour (Deathmages)': {
    effects: [
      {
        name: `Fading Vigour (Deathmages)`,
        desc: `Casting value of 6. Pick an enemy unit within 18" of the caster that is visible to them. Until the start of your next hero phase, subtract 1 from the Attacks characteristic of that unit's melee weapons (to a minimum of 1), and roll only a single dice when making charge rolls for it.`,
        when: [HERO_PHASE],
      },
    ],
  },
  'Spectral Grasp (Deathmages)': {
    effects: [
      {
        name: `Spectral Grasp (Deathmages)`,
        desc: `Casting value of 6. Pick a terrain feature within 18" of the caster that is visible to them. Until your next hero phase, halve the Move characteristic (rounding down) of enemy units within 3" of any terrain features affected by any Spectral Grasp spells at the start of their movement phase.`,
        when: [HERO_PHASE],
      },
    ],
  },
  'Prison of Grief (Deathmages)': {
    effects: [
      {
        name: `Prison of Grief (Deathmages)`,
        desc: `Casting value of 7. Pick an enemy unit within 12" of the caster that is visible to them. Until your next hero phase, before a unit affected by any Prison of Grief spells moves, roll a D6. On a 5+ the unit may not move in that phase.`,
        when: [HERO_PHASE],
      },
    ],
  },
  'Decrepify (Deathmages)': {
    effects: [
      {
        name: `Decrepify (Deathmages)`,
        desc: `Casting value of 6. Pick an enemy HERO within 18" of the caster that is visible to them. Until your next hero phase, subtract 1 from wound rolls made for that model and subtract 1 from the Damage characteristics of that model's melee weapons (to a minimum of 1).`,
        when: [HERO_PHASE],
      },
    ],
  },
  'Soul Harvest (Deathmages)': {
    effects: [
      {
        name: `Soul Harvest (Deathmages)`,
        desc: `Casting value of 7. Each enemy unit within 3" of the caster suffers D3 mortal wounds. Then, roll a D6 for each mortal wound that was allocated to an enemy unit and not negated. For each 5+, heal 1 wound that has been allocated to the caster.`,
        when: [HERO_PHASE],
      },
    ],
  },
  // Lore of the Vampires
  'Blades of Shyish (Vampires)': {
    effects: [
      {
        name: `Blades of Shyish (Vampires)`,
        desc: `Casting value of 5. Roll a D6 for each enemy unit within 12" of the caster. On a 5+ that unit suffers 1 mortal wound.`,
        when: [HERO_PHASE],
      },
    ],
  },
  'Spirit Gale (Vampires)': {
    effects: [
      {
        name: `Spirit Gale (Vampires)`,
        desc: `Casting value of 6. Pick an enemy unit within 12" of the caster that is visible to them and roll 3 dice. For each 5+, that unit suffers 1 mortal wound. In addition, if 2 of these dice show the same number, subtract 1 from hit rolls for that unit until your next hero phase. If all 3 dice show the same number, subtract 1 from hit and wound rolls for that unit until your next hero phase instead.`,
        when: [HERO_PHASE],
      },
    ],
  },
  'Vile Transference (Vampires)': {
    effects: [
      {
        name: `Vile Transference (Vampires)`,
        desc: `Casting value of 7. Pick an enemy unit within 12" of the caster that is visible to them, and a friendly DEATH unit within 6" of that enemy unit. The enemy unit suffers D3 mortal wounds. Then, for each of these wounds that was allocated and not negated, you can heal 1 wound allocated to the friendly unit.`,
        when: [HERO_PHASE],
      },
    ],
  },
  'Amethystine Pinions (Vampires)': {
    effects: [
      {
        name: `Amethystine Pinions (Vampires)`,
        desc: `Casting value of 5. Until your next hero phase add 5" to the caster's Move characteristic and the caster can fly.`,
        when: [HERO_PHASE],
      },
    ],
  },
  'Soulpike (Vampires)': {
    effects: [
      {
        name: `Soulpike (Vampires)`,
        desc: `Casting value of 6. Pick an enemy unit within 18" of the caster that is visible to them. Until your next hero phase, after a unit affected by any Soulpike spells makes a charge move, roll a number of dice equal to the result of their charge roll. For each 5+, that unit suffers 1 mortal wound.`,
        when: [HERO_PHASE],
      },
    ],
  },
  'Amaranthine Orb (Vampires)': {
    effects: [
      {
        name: `Amaranthine Orb (Vampires)`,
        desc: `Casting value of 7. Pick a point on the battlefield within 12" of the caster and draw an imaginary straight line 1mm wide between that point and the closest part of the caster. Roll a D6 for each unit (friend or foe, apart from the caster) that has any models beneath this line. On a 4+ that unit suffers D6 mortal wounds.`,
        when: [HERO_PHASE],
      },
    ],
  },
  'Hand of Dust': {
    effects: [
      {
        name: `Hand of Dust`,
        desc: `Casting value of 8. Pick an enemy model within 3" the caster. Then, take a dice and hide it in one of your hands. Your opponent must pick one of your hands. If they pick the one holding the dice, the spell has no effect. If they pick the empty hand, the enemy model is slain.`,
        when: [HERO_PHASE],
      },
    ],
  },
  'Soul Stealer': {
    effects: [
      {
        name: `Soul Stealer`,
        desc: `Casting value of 6. Pick an enemy unit within 24" of the caster that is visible to them and roll two dice. If the total is greater than that unit's Bravery characteristic, it suffers D3 mortal wounds. If the total is at least double the unit's Bravery, it suffers D6 mortal wounds instead. For each mortal wound inflicted on the target and not negated, heal 1 wound that has been allocated to the caster.`,
        when: [HERO_PHASE],
      },
    ],
  },

  'Curse of Years': {
    effects: [
      {
        name: `Curse of Years`,
        desc: `Casting value of 6. Pick an enemy unit within 18" of the caster that is visible to them and roll ten dice. For each roll of 6, that unit suffers a mortal wound and you can roll an extra dice. For each roll of 5+ on these extra dice, the target suffers another mortal wound and you can roll another dice. Now, for each roll of 4+, the target suffers another mortal wound and you can roll another dice. Keep rolling dice in this way, inflicting mortal wounds and reducing the roll needed to cause them by 1 each time, until either no wounds are inflicted or the target unit is destroyed. A roll of 1 always fails to inflict a mortal wound.

        The target can roll mortal wound negation as the effects are applied, if any are negated then you do not roll a new dice for that wound.`,
        when: [HERO_PHASE],
      },
    ],
  },

  'Wind of Death': {
    effects: [
      {
        name: `Wind of Death`,
        desc: `Casting value of 7. Pick an enemy model within 18" of the caster that is visible to them. Each enemy unit within 6" of that model suffers 1 mortal wound, while the model's own unit suffers D3 mortal wounds.`,
        when: [HERO_PHASE],
      },
    ],
  },
  'Dark Mist': {
    effects: [
      {
        name: `Dark Mist`,
        desc: `Casting value of 6. Pick a friendly DEATH unit within 18" of the caster. Until your next hero phase, that unit can fly and you must ignore modifiers (positive or negative) when making save rolls for the unit.`,
        when: [HERO_PHASE],
      },
    ],
  },
  Quickblood: {
    effects: [
      {
        name: `Quickblood`,
        desc: `Casting value of 7. Add 1 to hit and wound rolls for the caster until your next hero phase.`,
        when: [HERO_PHASE],
      },
    ],
  },
  'Blood Boil': {
    effects: [
      {
        name: `Blood Boil`,
        desc: `Casting value of 6. Pick an enemy unit within 18" of the caster that is visible to them. That unit suffers a mortal wound. If a model was allocated any wounds caused by this spell but was not slain, roll another dice. On a 4+ that model suffers another mortal wound. If the model is still not slain, roll another dice. It will suffer another mortal wound on a 4+. Keep rolling dice in this way until either the model is slain or you fail to cause a mortal wound.`,
        when: [HERO_PHASE],
      },
    ],
  },
  'Blood Siphon': {
    effects: [
      {
        name: `Blood Siphon`,
        desc: `Casting value of 6. Pick an enemy HERO within 12" of the caster that is visible to them and roll a D6. On a 1-3 the hero suffers a mortal wound. On a 4-5 the hero suffers D3 mortal wounds. On a 6 the hero suffers D6 mortal wounds.`,
        when: [HERO_PHASE],
      },
    ],
  },
  Beguile: {
    effects: [
      {
        name: `Beguile`,
        desc: `Casting value of 6. Pick an enemy unit within 12" of the caster that is visible to them and roll three dice. If the total is higher than that unit's Bravery, then until your next hero phase the caster cannot be selected as the target of any attacks made by that unit or spells cast by that unit.`,
        when: [HERO_PHASE],
      },
    ],
  },
  "Vanhel's Danse Macabre": {
    effects: [
      {
        name: `Vanhel's Danse Macabre`,
        desc: `Casting value of 6. Pick a friendly SUMMONABLE unit within 18" of the caster. That unit can be chosen to pile in and attack twice in your next combat phase.`,
        when: [HERO_PHASE],
      },
    ],
  },
}

export default tagAs(Spells, 'spell')

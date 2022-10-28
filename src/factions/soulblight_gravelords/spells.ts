import { tagAs } from 'factions/metatagger'
import { CHARGE_PHASE, HERO_PHASE, SAVES_PHASE } from 'types/phases'
import rule_sources from './rule_sources'

const Spells = {
  // Every Soulblight hero knows this spell!
  'Invigorating Aura': {
    effects: [
      {
        name: `Invigorating Aura`,
        desc: `Casting value of 8. Add 1 to the roll for each friendly SOULBLIGHT GRAVELORDS HERO on the battlefield. Pick 1 friendly SOULBLIGHT GRAVELORDS SUMMONABLE unit wholly within 18" of the caster. You can either heal up to 3 wounds allocated to that unit or, if no wounds are allocated to it, you can return a number of slain models to that unit that have a combined Wounds characteristic of 3 or less. The same unit cannot benefit from this spell more than once per turn.`,
        when: [HERO_PHASE],
      },
    ],
  },

  // Lore of the Vampires
  'Blades of Shyish': {
    effects: [
      {
        name: `Blades of Shyish`,
        desc: `Casting value of 5. If successfully cast, roll a dice for each enemy unit within 12" of the caster. On a 3+, that unit suffers 1 mortal wound.`,
        when: [HERO_PHASE],
      },
    ],
  },
  'Spirit Gale': {
    effects: [
      {
        name: `Spirit Gale`,
        desc: `Casting value of 5. Pick 1 enemy unit within 18" of the caster that is visible to them and roll 2D6. If the roll is greater than that unit's Bravery characteristic, that unit suffers a number of mortal wounds equal to the difference between its Bravery characteristic and the roll.`,
        when: [HERO_PHASE],
      },
    ],
  },
  Soulpike: {
    effects: [
      {
        name: `Soulpike`,
        desc: `Casting value of 6. Pick 1 enemy unit within 18" of the caster that is visible to them. Until your next hero phase, if that unit makes a charge move, roll a number of dice equal to the charge roll for that unit. For each 4+, that unit suffers 1 mortal wound. The same unit cannot be affected by this spell more than once per turn.`,
        when: [HERO_PHASE],
      },
    ],
  },
  'Amethystine Pinions': {
    effects: [
      {
        name: `Amethystine Pinions`,
        desc: `Casting value of 5. If successfully cast, until your next hero phase, add 6" to the caster's Move characteristic. The same unit cannot benefit from this spell more than once per turn.`,
        when: [HERO_PHASE],
      },
    ],
  },
  'Vile Transference': {
    effects: [
      {
        name: `Vile Transference`,
        desc: `Casting value of 7. Pick 1 enemy unit within 3" of the caster that is visible to them. Roll a number of dice equal to that enemy unit's Wounds characteristic. For each 6, that unit suffers 1 mortal wound and you can heal 1 wound allocated to the caster.`,
        when: [HERO_PHASE],
        rule_sources: [rule_sources.BATTLETOME_SOULBLIGHT_GRAVELORDS, rule_sources.ERRATA_AUGUST_2021],
      },
    ],
  },
  'Amaranthine Orb': {
    effects: [
      {
        name: `Amaranthine Orb`,
        desc: `Casting value of 6. Pick 1 point on the battlefield within 9" of the caster that is visible to them and draw an imaginary straight line 1mm wide between that point and the closest part of the caster's base. Roll a dice for each unit that has models passed across by this line. On a 2+, that unit suffers D3 mortal wounds. DEATH units are not affected by this spell.`,
        when: [HERO_PHASE],
      },
    ],
  },

  // Lore of the Deathmages
  'Overwhelming Dread': {
    effects: [
      {
        name: `Overwhelming Dread`,
        desc: `Casting value of 5. Pick 1 enemy unit within 18" of the caster that is visible to them. Until your next hero phase, subtract 1 from hit rolls for attacks made by that unit.`,
        when: [HERO_PHASE],
      },
    ],
  },
  'Fading Vigour': {
    effects: [
      {
        name: `Fading Vigour`,
        desc: `Casting value of 6. Pick 1 enemy unit within 18" of the caster that is visible to them. Subtract 1 from the Attacks characteristic of that unit's melee weapons (to a minimum of 1) until your next hero phase.`,
        when: [HERO_PHASE],
      },
    ],
  },
  'Spectral Grasp': {
    effects: [
      {
        name: `Spectral Grasp`,
        desc: `Casting value of 6. Pick 1 terrain feature wholly within 18" of the caster that is visible to them. Until your next hero phase, if an enemy unit starts a normal move within 3" of that terrain feature, halve the Move characteristic (rounding down) of that unit until your next hero phase.`,
        when: [HERO_PHASE],
        rule_sources: [rule_sources.BATTLETOME_SOULBLIGHT_GRAVELORDS, rule_sources.ERRATA_OCTOBER_2022],
      },
    ],
  },
  'Prison of Grief': {
    effects: [
      {
        name: `Prison of Grief`,
        desc: `Casting value of 6. Pick 1 enemy unit within 12" of the caster that is visible to them. Until your next hero phase, roll a dice each time that unit attempts to move. On a 5+, that unit cannot move in that phase. The same unit cannot be affected by this spell more than once per turn.`,
        when: [HERO_PHASE],
      },
    ],
  },
  Decrepify: {
    effects: [
      {
        name: `Decrepify`,
        desc: `Casting value of 6. Pick 1 enemy HERO within 18" of the caster that is visible to them. Until your next hero phase, subtract 1 from wound rolls for attacks made by that model and subtract 1 from the Damage characteristic of that model's melee weapons (to a minimum of 1).`,
        when: [HERO_PHASE],
      },
    ],
  },
  'Soul Harvest': {
    effects: [
      {
        name: `Soul Harvest`,
        desc: `Casting value of 7. If successfully cast, each enemy unit within 3" of the caster suffers mortal wounds. In addition, for each mortal wound inflicted by this spell and not negated, roll a dice. For each 5+, you can heal 1 wound allocated to the caster.`,
        when: [HERO_PHASE],
      },
    ],
  },

  // Individual unit spells
  'Wind of Death': {
    effects: [
      {
        name: `Wind of Death`,
        desc: `Casting value of 7. Pick 1 enemy unit within 18" of the caster that is visible to them, and roll a dice for that enemy unit and each other enemy unit within 6" of that enemy unit. On a 3+, that unit suffers D3 mortal wounds.`,
        when: [HERO_PHASE],
      },
    ],
  },
  'Dark Mist': {
    effects: [
      {
        name: `Dark Mist`,
        desc: `Casting value of 6. Pick 1 friendly SOUL-BLIGHT GRAVELORDS unit wholly within 12" of the caster. Ignore negative modifiers when making save rolls for attacks that target that unit until your next hero phase.`,
        when: [HERO_PHASE],
      },
      {
        name: `Dark Mist`,
        desc: `If active, ignore negative modifiers when making save rolls for attacks that target that unit until your next hero phase.`,
        when: [SAVES_PHASE],
      },
    ],
  },
  Quickblood: {
    effects: [
      {
        name: `Quickblood`,
        desc: `Casting value of 7. If successfully cast, add 1 to hit and wound rolls for attacks made with melee weapons by the caster until your next hero phase.`,
        when: [HERO_PHASE],
      },
    ],
  },
  'Fiendish Lure': {
    effects: [
      {
        name: `Fiendish Lure`,
        desc: `Casting value of 5. Pick 1 enemy unit within 6" of the caster that is visible to them. Add 1 to hit rolls for attacks that target that unit until your next hero phase.`,
        when: [HERO_PHASE],
      },
    ],
  },
  "Death's Downpour": {
    effects: [
      {
        name: `Death's Downpour`,
        desc: `Casting value of 8. If successfully cast, charge rolls made for enemy units within 12" of this model are halved until your next hero phase.`,
        when: [HERO_PHASE],
      },
      {
        name: `Death's Downpour`,
        desc: `If active, charge rolls made for enemy units within 12" of this model are halved until your next hero phase.`,
        when: [CHARGE_PHASE],
      },
    ],
  },
  'Clotted Deluge': {
    effects: [
      {
        name: `Clotted Deluge`,
        desc: `Casting value of 6. Pick 1 enemy unit within 12" of the caster that is visible to them. Add 1 to wound rolls for attacks made with melee weapons that target that unit until your next hero phase.`,
        when: [HERO_PHASE],
      },
    ],
  },
  'Under a Killing Moon': {
    effects: [
      {
        name: `Under a Killing Moon`,
        desc: `Casting value of 6. If successfully cast, until your next hero phase, if the unmodified hit roll for an attack made with a melee weapon by a friendly SOULBLIGHT GRAVELORDS unit wholly within 12" of the caster is 6, that attack inflicts 2 hits on the target instead of 1. Make a wound and save roll for each hit.`,
        when: [HERO_PHASE],
      },
    ],
  },
  Lycancurse: {
    effects: [
      {
        name: `Lycancurse`,
        desc: `Casting value of 7. If successfully cast, pick 1 enemy unit within 18" of the caster that is visible to them. That unit suffers D3 mortal wounds.

        If any models in that unit were slain by this spell, before removing the last slain model, you can add 1 unit of DIRE WOLVES to your army. The number of models in the new unit must be equal to the number ofmodels in the enemy unit that were slain by this spell. Set up the new unit within 3" of the slain model's unit, and then remove the slain model from play.`,
        when: [HERO_PHASE],
      },
    ],
  },
  'Necrotising Bolt': {
    effects: [
      {
        name: `Necrotising Bolt`,
        desc: `Casting value of 6. Pick 1 enemy unit within 18" of the caster that is visible to them. Subtract 1 from hit rolls for attacks made by that unit until your next hero phase.`,
        when: [HERO_PHASE],
      },
    ],
  },
  'Curse of Exsanguination': {
    effects: [
      {
        name: `Curse of Exsanguination`,
        desc: `Casting value of 6. Pick 1 enemy unit within 18" of the caster that is visible to them. That unit suffers 1 mortal wound. If that mortal wound is allocated to a model in that unit and not negated and that model is not slain by that mortal wound, you can roll a dice. On a 4+, that model suffers 1 mortal wound, and you can roll another dice if that mortal wound is allocated and not negated and the model is not slain. Keep rolling dice in this way until either no mortal wounds are inflicted, the mortal wound is negated or the model is slain.`,
        when: [HERO_PHASE],
      },
    ],
  },
  'Blood Siphon': {
    effects: [
      {
        name: `Blood Siphon`,
        desc: `Casting value of 6. Pick 1 enemy HERO within 12" of the caster that is visible to them and roll a dice. On a 1-2, the target suffers 1 mortal wound. On a 3-4, the target suffers D3 mortal wounds. On a 5-6, the target suffers D6 mortal wounds.`,
        when: [HERO_PHASE],
      },
    ],
  },
  Shudder: {
    effects: [
      {
        name: `Shudder`,
        desc: `Casting value of 6. Pick 1 enemy unit within 12" of the caster that is visible to them and roll 3D6. If the roll is greater than that unit's Bravery characteristic, this model cannot be picked to be the target of any attacks made, spells cast or abilities used by that unit until your next hero phase.`,
        when: [HERO_PHASE],
      },
    ],
  },
  "Vanhel's Danse Macabre": {
    effects: [
      {
        name: `Vanhel's Danse Macabre`,
        desc: `Casting value of 6. Pick 1 friendly SOUL-BLIGHT GRAVELORDS SUMMONABLE unit wholly within 18" of the caster. Until your next hero phase, if that unit has fought only once in the combat phase, when it is your turn to pick a unit to fight, that unit can be picked to fight for a second time if it is within 3" of any enemy units.`,
        when: [HERO_PHASE],
      },
    ],
  },
  'Retribution or Salvation': {
    effects: [
      {
        name: `Retribution or Salvation`,
        desc: `Casting value of 6 and a range of 18". Pick 1 unit within range and visible to the caster. If that unit is an enemy unit, it suffers D3 mortal wounds. If that enemy unit has the Chaos keyword, it suffers 3 mortal wounds instead of D3. If that unit is a friendly Soulblight Gravelords Summonable unit, you can heal up to D3 wounds allocated to that unit or, if no wounds are allocated to that unit, you can return a number of slain models to it that have a combined Wounds characteristic of D3 or less.`,
        when: [HERO_PHASE],
      },
    ],
  },
  // '': {
  //   effects: [
  //     {
  //       name: ``,
  //       desc: ``,
  //       when: [HERO_PHASE],
  //     },
  //   ],
  // },
}

export default tagAs(Spells, 'spell')

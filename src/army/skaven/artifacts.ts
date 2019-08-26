import { TArtifacts } from 'types/army'
import {
  BATTLESHOCK_PHASE,
  COMBAT_PHASE,
  DURING_GAME,
  END_OF_COMBAT_PHASE,
  END_OF_MOVEMENT_PHASE,
  END_OF_ROUND,
  HERO_PHASE,
  MOVEMENT_PHASE,
  SHOOTING_PHASE,
  START_OF_COMBAT_PHASE,
  START_OF_HERO_PHASE,
  START_OF_MOVEMENT_PHASE,
  START_OF_ROUND,
  START_OF_SHOOTING_PHASE,
} from 'types/phases'

const Artifacts: TArtifacts = [
  {
    name: `Warpstorm Scroll (Masterclan)`,
    effects: [
      {
        name: `Warpstorm Scroll (Masterclan)`,
        desc: `Once per battle, in your hero phase, the bearer can use this scroll. If they do so, roll 1 dice for each enemy unit within 13" of the bearer. On a 4+ that unit suffers D3 mortal wounds.`,
        when: [HERO_PHASE],
      },
    ],
  },
  {
    name: `Suspicious Stone (Masterclan)`,
    effects: [
      {
        name: `Suspicious Stone (Masterclan)`,
        desc: `Roll a D6 each time you allocate a wound or mortal wound to the bearer. On a 5+ that wound or mortal wound is negated.`,
        when: [DURING_GAME],
      },
    ],
  },
  {
    name: `The Gnawshard (Masterclan)`,
    effects: [
      {
        name: `The Gnawshard (Masterclan)`,
        desc: `Pick 1 of the bearer's melee weapons. If any wounds inflicted by that weapon are allocated to an enemy model and not negated, that enemy model suffers 1 mortal wound at the end of each battle round (even if the wounds inflicted by the Gnawshard are subsequently healed).`,
        when: [END_OF_ROUND],
      },
    ],
  },
  {
    name: `Skavenbrew (Masterclan)`,
    effects: [
      {
        name: `Skavenbrew (Masterclan)`,
        desc: `Once per battle, in your hero phase, you can pick 1 friendly SKAVENTIDE unit within 3" of the bearer. That unit suffers D3 mortal wounds, but you can add 1 to the Attacks characteristic of melee weapons used by that unit until your next hero phase.`,
        when: [HERO_PHASE],
      },
    ],
  },
  {
    name: `Snoutgrovel Robes (Masterclan)`,
    effects: [
      {
        name: `Snoutgrovel Robes (Masterclan)`,
        desc: `Do not take battleshock tests for friendly SKAVENTIDE units while they are wholly within 13" of the bearer.`,
        when: [BATTLESHOCK_PHASE],
      },
    ],
  },
  {
    name: `Staff of Rightful Supremacy (Masterclan)`,
    effects: [
      {
        name: `Staff of Rightful Supremacy (Masterclan)`,
        desc: `Subtract 1 from the casting rolls of enemy WIZARDS while they are within 13" of the bearer. In addition, once per battle, you can dispel one endless spell within 13" of the caster (you do not have to roll 2D6, the dispel is automatically successful).`,
        when: [HERO_PHASE],
      },
    ],
  },
  {
    name: `The Brass Orb (Skryre)`,
    effects: [
      {
        name: `The Brass Orb (Skryre)`,
        desc: `Once per battle, at the start of your hero phase, you can roll a D6. On a 6 the closest enemy model within 6" of the bearer is slain. If several enemy models are equally close, you can pick which one is slain.`,
        when: [START_OF_HERO_PHASE],
      },
    ],
  },
  {
    name: `Warpstone Armour (Skryre)`,
    effects: [
      {
        name: `Warpstone Armour (Skryre)`,
        desc: `Roll a D6 each time a wound inflicted by a melee weapon is allocated to the bearer and not negated. On a 5+ the attacking unit suffers 1 mortal wound.`,
        when: [COMBAT_PHASE],
      },
    ],
  },
  {
    name: `Esoteric Warp Resonator (Skryre)`,
    effects: [
      {
        name: `Esoteric Warp Resonator (Skryre)`,
        desc: `At the start of each battle round you receive 1 extra warpstone spark if the bearer is on the battlefield. That warpstone spark can only be used to perform a warpstone spark ability with the bearer in that battle round. If it is not used before the end of the battle round in which it was received, it is lost.`,
        when: [START_OF_ROUND],
      },
    ],
  },
  {
    name: `Skryre's-breath Bellows (Skryre)`,
    effects: [
      {
        name: `Skryre's-breath Bellows (Skryre)`,
        desc: `At the start of your hero phase, the bearer can pump the bellows. If they do so, roll a D6 for each unit other than the bearer that is within 3" of the bearer. On a 4+ that unit suffers D3 mortal wounds.`,
        when: [START_OF_HERO_PHASE],
      },
    ],
  },
  {
    name: `Vial of the Fulminator (Skryre)`,
    effects: [
      {
        name: `Vial of the Fulminator (Skryre)`,
        desc: `At the start of your movement phase, you can pick 1 friendly CLANS SKRYRE WAR MACHINE within 3" of the bearer. Double that unit's Move characteristic until the end of that phase. At the end of that phase, roll a D6. On a 4+ that unit suffers D3 mortal wounds.`,
        when: [START_OF_MOVEMENT_PHASE],
      },
    ],
  },
  {
    name: `Vigordust Injector (Skryre)`,
    effects: [
      {
        name: `Vigordust Injector (Skryre)`,
        desc: `In your hero phase, you can pick 1 friendly SKAVENTIDE unit wholly within 12" of the bearer. Add 1 to charge rolls and hit rolls for that unit until your next hero phase. However, at the start of your next hero phase that unit suffers D3 mortal wounds.`,
        when: [HERO_PHASE],
      },
    ],
  },
  {
    name: `Blade of Corruption (Pestilens)`,
    effects: [
      {
        name: `Blade of Corruption (Pestilens)`,
        desc: `Pick 1 of the bearer's melee weapons. You can re-roll wound rolls for attacks made with that weapon.`,
        when: [COMBAT_PHASE],
      },
    ],
  },
  {
    name: `The Foul Pendant (Pestilens)`,
    effects: [
      {
        name: `The Foul Pendant (Pestilens)`,
        desc: `The bearer can attempt to unbind 1 spell in 5 each enemy hero phase in the same manner as a WIZARD.`,
        when: [HERO_PHASE],
      },
    ],
  },
  {
    name: `Brooding Blade (Pestilens)`,
    effects: [
      {
        name: `Brooding Blade (Pestilens)`,
        desc: `Pick 1 of the bearer's melee weapons. At the end of the combat phase, roll a D6 for each model wounded by this weapon but not slain. On a 2+ that model's unit suffers D3 mortal wounds.`,
        when: [END_OF_COMBAT_PHASE],
      },
    ],
  },
  {
    name: `The Fumigatous (Pestilens)`,
    effects: [
      {
        name: `The Fumigatous (Pestilens)`,
        desc: `At the start of each combat phase, you can pick 1 enemy unit within 6" of the bearer and roll a D6. On a 2+ that unit suffers 1 mortal wound. On a 5+ that unit suffers D3 mortal wounds instead of 1.`,
        when: [START_OF_COMBAT_PHASE],
      },
    ],
  },
  {
    name: `Blistrevous, the Living Cyst (Pestilens)`,
    effects: [
      {
        name: `Blistrevous, the Living Cyst (Pestilens)`,
        desc: `Add 2" to the bearer's Move characteristic. In addition, you can re-roll hit rolls for attacks made by the bearer. Starting from the second battle round, at the start of your hero phase, if there are any other friendly CLANS PESTILENS HEROES within 13" of the bearer, you must transfer this artifact to one of them, even if they already carry an artifact of power.`,
        when: [MOVEMENT_PHASE],
      },
      {
        name: `Blistrevous, the Living Cyst (Pestilens)`,
        desc: `You can re-roll hit rolls for attacks made by the bearer.`,
        when: [COMBAT_PHASE],
      },
      {
        name: `Blistrevous, the Living Cyst (Pestilens)`,
        desc: `Starting from the second battle round, at the start of your hero phase, if there are any other friendly CLANS PESTILENS HEROES within 13" of the bearer, you must transfer this artifact to one of them, even if they already carry an artifact of power.`,
        when: [START_OF_HERO_PHASE],
      },
    ],
  },
  {
    name: `Liber Bubonicus (Pestilens)`,
    effects: [
      {
        name: `Liber Bubonicus (Pestilens)`,
        desc: `The bearer can use the Plague Prayers ability from the Plague Priest warscroll. If the bearer is a PLAGUE PRIEST, then it can use the Plague Prayers ability twice in your hero phase.`,
        when: [HERO_PHASE],
      },
    ],
  },
  {
    name: `Things-Bane (Verminus)`,
    effects: [
      {
        name: `Things-Bane (Verminus)`,
        desc: `Pick 1 of the bearer's melee weapons. Add 1 to the Damage characteristic of that weapon.`,
        when: [COMBAT_PHASE],
      },
    ],
  },
  {
    name: `Shield of Distraction (Verminus)`,
    effects: [
      {
        name: `Shield of Distraction (Verminus)`,
        desc: `Re-roll save rolls of 1 for attacks that target the bearer.`,
        when: [DURING_GAME],
      },
      {
        name: `Shield of Distraction (Verminus)`,
        desc: `At the start of the combat phase, pick 1 enemy model within 3" of the bearer. Subtract 1 from hit rolls for attacks made with melee weapons by that model in that combat phase.`,
        when: [START_OF_COMBAT_PHASE],
      },
    ],
  },
  {
    name: `Screechskull Trophies (Verminus)`,
    effects: [
      {
        name: `Screechskull Trophies (Verminus)`,
        desc: `Subtract 1 from the Bravery characteristic of enemy units while they are within 13" of the bearer.`,
        when: [BATTLESHOCK_PHASE],
      },
    ],
  },
  {
    name: `Flaypelt (Verminus)`,
    effects: [
      {
        name: `Flaypelt (Verminus)`,
        desc: `You can re-roll hit and wound rolls of 1 for attacks made with melee weapons by the bearer.`,
        when: [COMBAT_PHASE],
      },
    ],
  },
  {
    name: `Rustcursed Armour (Verminus)`,
    effects: [
      {
        name: `Rustcursed Armour (Verminus)`,
        desc: `Re-roll save rolls of 1 for attacks that target the bearer.`,
        when: [DURING_GAME],
      },
      {
        name: `Rustcursed Armour (Verminus)`,
        desc: `At the start of the combat phase, you can pick 1 enemy HERO with an artifact of power that is within 3" of the bearer and roll 3D6. If the roll is exactly 13, that artifact of power can no longer be used (if a weapon was picked when the artifact of power was selected, that weapon reverts to normal).`,
        when: [START_OF_COMBAT_PHASE],
      },
    ],
  },
  {
    name: `Warpstone Charm (Verminus)`,
    effects: [
      {
        name: `Warpstone Charm (Verminus)`,
        desc: `At the start of your hero phase, pick 1 unit within 3" of the bearer and roll a D6. On a 2-5 that unit suffers 1 mortal wound. On a 6 that unit suffers D3 mortal wounds. (Note that if there are no enemy units within 3" you must pick either a friendly unit or the bearer to be the target.)`,
        when: [START_OF_HERO_PHASE],
      },
    ],
  },
  {
    name: `Lash of Fangs (Moulder)`,
    effects: [
      {
        name: `Lash of Fangs (Moulder)`,
        desc: `Pick 1 of the bearer's melee weapons. If the unmodified hit roll for an attack made with that weapon is 6, that attack inflicts 1 mortal wound on the target in addition to any normal damage.`,
        when: [COMBAT_PHASE],
      },
    ],
  },
  {
    name: `Foulhide (Moulder)`,
    effects: [
      {
        name: `Foulhide (Moulder)`,
        desc: `In your hero phase, you can heal up to D3 wounds allocated to the bearer.`,
        when: [HERO_PHASE],
      },
    ],
  },
  {
    name: `Snap-snap Snarepole (Moulder)`,
    effects: [
      {
        name: `Snap-snap Snarepole (Moulder)`,
        desc: `At the start of the combat phase, pick 1 enemy model within 3" of the bearer. Subtract 1 from hit rolls for attacks made by that model in that combat phase.`,
        when: [START_OF_COMBAT_PHASE],
      },
    ],
  },
  {
    name: `Rat-tail Snake (Moulder)`,
    effects: [
      {
        name: `Rat-tail Snake (Moulder)`,
        desc: `If the unmodified save roll for an attack that targets the bearer is 6, the attacking unit suffers 1 mortal wound after all of its attacks have been resolved.`,
        when: [SHOOTING_PHASE, COMBAT_PHASE],
      },
    ],
  },
  {
    name: `Rabid Crown (Moulder)`,
    effects: [
      {
        name: `Rabid Crown (Moulder)`,
        desc: `You can re-roll wound rolls for attacks made by friendly CLANS MOULDER PACK units while they are wholly within 13" of the bearer.`,
        when: [COMBAT_PHASE],
      },
    ],
  },
  {
    name: `Fleshgift Vial (Moulder)`,
    effects: [
      {
        name: `Fleshgift Vial (Moulder)`,
        desc: `Once per battle, in your shooting phase, you can pick 1 enemy unit within 6" of the bearer and roll a D6. On a 1, the bearer suffers 1 mortal wound. On a 2-5, that enemy unit suffers D3 mortal wounds. On a 6 that enemy unit suffers D6 mortal wounds.`,
        when: [SHOOTING_PHASE],
      },
    ],
  },
  {
    name: `Shadow Magnet Trinket (Eshin)`,
    effects: [
      {
        name: `Shadow Magnet Trinket (Eshin)`,
        desc: `Once per battle, the bearer can fight at the start of the combat phase, before the players pick any other units to fight in that combat phase. The bearer cannot fight again in that combat phase unless an ability or spell allows it to fight more than once.`,
        when: [START_OF_COMBAT_PHASE],
      },
    ],
  },
  {
    name: `Farskitter Cloak (Eshin)`,
    effects: [
      {
        name: `Farskitter Cloak (Eshin)`,
        desc: `Once per battle, at the end of your movement phase, you can remove the bearer from the battlefield and set them up again anywhere on the battlefield more than 9" from any enemy units.`,
        when: [END_OF_MOVEMENT_PHASE],
      },
    ],
  },
  {
    name: `The Three Fangs (Eshin)`,
    effects: [
      {
        name: `The Three Fangs (Eshin)`,
        desc: `Once per battle, at the start of your shooting phase, you can pick 1 enemy HERO within 6" of the bearer and roll 3 dice. If all 3 rolls are 3+, and the combined value of the 3 dice is greater than that enemy model's Wounds characteristic, that enemy model is slain.`,
        when: [START_OF_SHOOTING_PHASE],
      },
    ],
  },
  {
    name: `Warpweeper Stars (Eshin)`,
    effects: [
      {
        name: `Warpweeper Stars (Eshin)`,
        desc: `Pick 1 of the bearer's missile weapons. If the unmodified wound roll for an attack made with that weapon is 6, that attack inflicts D3 mortal wounds on the target in addition to any normal damage.`,
        when: [SHOOTING_PHASE],
      },
    ],
  },
  {
    name: `The Cube of Mists (Eshin)`,
    effects: [
      {
        name: `The Cube of Mists (Eshin)`,
        desc: `Once per battle, at the start of the combat phase, you can pick 1 enemy unit within 6" of the bearer. That unit cannot make a pile-in move in that combat phase. In addition, subtract 1 from hit rolls for attacks made by that unit in that combat phase.`,
        when: [START_OF_COMBAT_PHASE],
      },
    ],
  },
  {
    name: `Gnawbomb (Eshin)`,
    effects: [
      {
        name: `Gnawbomb (Eshin)`,
        desc: `Once per battle, in your hero phase, you can pick 1 terrain feature within 6" of the bearer. Until your next hero phase, that terrain feature has the scenery rules from the Gnawhole warscroll in addition to the scenery rules it already has.`,
        when: [HERO_PHASE],
      },
    ],
  },
]

export default Artifacts

import { TItemDescriptions } from 'factions/factionTypes'
import { tagAs } from 'factions/metatagger'
import {
  COMBAT_PHASE,
  DURING_GAME,
  END_OF_MOVEMENT_PHASE,
  HERO_PHASE,
  SAVES_PHASE,
  SHOOTING_PHASE,
  START_OF_COMBAT_PHASE,
  START_OF_HERO_PHASE,
  START_OF_MOVEMENT_PHASE,
  START_OF_ROUND,
  WOUND_ALLOCATION_PHASE,
} from 'types/phases'

const Artifacts = {
  'The Gnawshard': {
    effects: [
      {
        name: `The Gnawshard`,
        desc: `MASTERCLAN HERO only. Pick 1 of the bearer's melee weapons. If any wounds caused by attacks made with that weapon are allocated to an enemy unit, that unit suffers 1 mortal wound at the end of each turn (even if those wounds are subsequently healed)`,
        when: [WOUND_ALLOCATION_PHASE],
      },
    ],
  },
  Skavenbrew: {
    effects: [
      {
        name: `Skavenbrew`,
        desc: `MASTERCLAN HERO only. Once per turn, in your hero phase, you can pick 1 other friendly SKAVEN unit within 3" of the bearer. That unit suffers D3 mortal wounds. but you can add 1 to the Attacks characteristic of melee weapons used by that unit until your next hero phase.`,
        when: [HERO_PHASE],
      },
    ],
  },
  'Staff of Rightful Supremacy': {
    effects: [
      {
        name: `Staff of Rightful Supremacy`,
        desc: `MASTERCLAN HERO only. Subtract 1 from casting rolls for enemy WIZARDS within 13" of the bearer. In addition, once per battle, in your hero phase, when a friendly unit attempts to dispel an endless spell that is within 13" of the bearer, that endless spell is automatically dispelled (do not make a dispelling roll)`,
        when: [HERO_PHASE],
      },
    ],
  },
  'The Brass Orb': {
    effects: [
      {
        name: `The Brass Orb`,
        desc: `CLANS SKRYRE HERO only. Once per battle, at the start of your hero phase, you can pick 1 enemy unit within 6" of the bearer and roll a dice. On a 3+, remove that unit from the battlefield. At the end of that turn, your opponent must set up that unit again on the battlefield, wholly within their territory and more than 9" from all enemy units.`,
        when: [START_OF_HERO_PHASE],
      },
    ],
  },
  'Esoteric Warp Resonator': {
    effects: [
      {
        name: `Esoteric Warp Resonator`,
        desc: `CLANS SKRYRE HERO only. At the start of each battle round, you receive 1 extra warpstone spark if the bearer is on the battlefield. That warpstone spark can only be used to carry out a warpstone spark ability with the bearer in that battle round. If it is not used before the end of the battle round in which it was received, it is lost.`,
        when: [START_OF_ROUND],
      },
    ],
  },
  'Vial of the Fulminator': {
    effects: [
      {
        name: `Vial of the Fulminator`,
        desc: `CLANS SKRYRE HERO only. At the start of your movement phase, you can pick 1 friendly CLANS SKRYRE WAR MACHINE within 6" of the bearer. Double that unit's Move characteristic until the end of that phase. At the end of that phase, roll a dice. On a 1, that unit suffers D3 mortal wounds.`,
        when: [START_OF_MOVEMENT_PHASE],
      },
    ],
  },
  'Blade of Corruption': {
    effects: [
      {
        name: `Blade of Corruption`,
        desc: `CLANS PESTILENS HERO only. Pick 1 of the bearer's melee weapons. If the unmodified wound roll for an attack made with that weapon is 6, that weapon has a Rend characteristic of -3 and a Damage characteristic of 6 for that attack.`,
        when: [COMBAT_PHASE],
      },
    ],
  },
  'The Fumigatous': {
    effects: [
      {
        name: `The Fumigatous`,
        desc: `CLANS PESTILENS HERO only. At the start of the combat phase, you can pick 1 enemy unit within of the bearer and roll a dice. On a 1-2. nothing happens. On a 3-4 that unit suffers D3 mortal wounds. On a 5-6. that unit suffers D6 mortal wounds.`,
        when: [START_OF_COMBAT_PHASE],
      },
    ],
  },
  'Blistrevous, the Living Cyst': {
    effects: [
      {
        name: `Blistrevous, the Living Cyst`,
        desc: `CLANS PESTILENS HERO only. The strike-first effect applies to the bearer if it made a charge move in the same turn.`,
        when: [COMBAT_PHASE],
      },
      {
        name: `Blistrevous, the Living Cyst`,
        desc: `CLANS PESTILENS HERO only. Starting from the second battle round, at the start of your hero phase, you must transfer this artefact to another friendly CLANS PESTILENS HERO on the battlefield if it is possible to do so, even if that HERO already has an artefact of power.`,
        when: [START_OF_HERO_PHASE],
      },
    ],
  },
  'Shield of Distraction': {
    effects: [
      {
        name: `Shield of Distraction`,
        desc: `CLANS VERMINUS HERO only. The bearer cannot be picked as the target of a combat attack by more than 1 unit per phase.`,
        when: [DURING_GAME],
      },
    ],
  },
  'Rustcursed Armour': {
    effects: [
      {
        name: `Rustcursed Armour`,
        desc: `CLANS VERMINUS HERO only. Add 1 to save rolls for attacks that target the bearer.`,
        when: [SAVES_PHASE],
      },
      {
        name: `Rustcursed Armour`,
        desc: `CLANS VERMINUS HERO only. At the start of your combat phase, you can pick 1 enemy HERO that has an artefact of power within 3" of the bearer and roll 2D6. If the roll is greater than that HERO's Bravery characteristic, that HERO no longer bears that artefact of power (if a weapon was picked when the artefact of power was given to that HERO, that weapon reverts to normal).`,
        when: [START_OF_COMBAT_PHASE],
      },
    ],
  },
  'Warpstone Charm': {
    effects: [
      {
        name: `Warpstone Charm`,
        desc: `CLANS VERMINUS HERO only. Subtract 1 from save rolls for enemy units within 3" of the bearer.`,
        when: [SAVES_PHASE],
      },
      {
        name: `Warpstone Charm`,
        desc: `CLANS VERMINUS HERO only. At the start of your hero phase, roll a dice. On a 1, the bearer suffers D3 mortal wounds.`,
        when: [START_OF_HERO_PHASE],
      },
    ],
  },
  'Lash of Fangs': {
    effects: [
      {
        name: `Lash of Fangs`,
        desc: `CLANS MOULDER HERO only. Pick 1 of the bearer's melee weapons. If the unmodified hit roll for an made with that weapon is 6, that attack causes D3 mortal wounds to the target in addition to any damage it inflicts.`,
        when: [COMBAT_PHASE],
      },
    ],
  },
  Foulhide: {
    effects: [
      {
        name: `Foulhide`,
        desc: `CLANS MOULDER HERO only. The bearer has a Wounds characteristic of 10.`,
        when: [DURING_GAME],
      },
      {
        name: `Foulhide`,
        desc: `CLANS MOULDER HERO only. At the start of your hero phase, you can heal 1 wound allocated to the bearer.`,
        when: [START_OF_HERO_PHASE],
      },
    ],
  },
  'Rabid Crown': {
    effects: [
      {
        name: `Rabid Crown`,
        desc: `CLANS MOULDER HERO only. Add 1 to hit rolls for attacks made by friendly CLANS MOULDER FIGHTING BEAST and CLANS MOULDER PACK units wholly within 13" of the bearer.`,
        when: [COMBAT_PHASE],
      },
    ],
  },
  'Fleshgift Vial (Moulder)': {
    effects: [
      {
        name: `Fleshgift Vial (Moulder)`,
        desc: `Once per battle, in your shooting phase, you can pick 1 enemy unit within 6" of the bearer and roll a D6. On a 1, the bearer suffers 1 mortal wound. On a 2-5, that enemy unit suffers D3 mortal wounds. On a 6 that enemy unit suffers D6 mortal wounds.`,
        when: [SHOOTING_PHASE],
      },
    ],
  },
  'Shadow Magnet Trinket': {
    effects: [
      {
        name: `Shadow Magnet Trinket`,
        desc: `CLANS ESHIN HERO only. Once per battle, at the start of the combat phase, you can say that the bearer will use this artefact. If you do so, the strike-first effect applies to the bearer until your next hero phase.`,
        when: [START_OF_COMBAT_PHASE],
      },
    ],
  },
  'Farskitter Cloak': {
    effects: [
      {
        name: `Farskitter Cloak`,
        desc: `CLANS ESHIN HERO only. Once per battle, at the end of your movement phase, you can remove the bearer from the battlefield and set them up again on the battlefield more than 9" from all enemy units.`,
        when: [END_OF_MOVEMENT_PHASE],
      },
    ],
  },
  Gnawbomb: {
    effects: [
      {
        name: `Gnawbomb`,
        desc: `CLANS ESHIN HERO only. Once per battle, in hero phase, you can pick 1 terrain feature within 6" of the bearer. Until your next hero phase, that terrain feature has the scenery rules from the Gnawhole warscroll (pg 118) in addition to any other scenery rules that it may have.`,
        when: [HERO_PHASE],
      },
    ],
  },
} satisfies TItemDescriptions

export default tagAs(Artifacts, 'artifact')

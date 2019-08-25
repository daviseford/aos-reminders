import { TArtifacts } from 'types/army'
import {
  COMBAT_PHASE,
  END_OF_COMBAT_PHASE,
  HERO_PHASE,
  MOVEMENT_PHASE,
  START_OF_COMBAT_PHASE,
  START_OF_SHOOTING_PHASE,
} from 'types/phases'

const Artifacts: TArtifacts = [
  {
    name: `Shadow's Edge`,
    effects: [
      {
        name: `Shadow's Edge`,
        desc: `Pick one of the bearer's melee weapons. If the unmodified hit roll for an attack made with that weapon is 6, that attack inflicts D3 mortal wounds and the attack sequence ends (do not make a wound or save roll).`,
        when: [COMBAT_PHASE],
      },
    ],
  },
  {
    name: `Reaper of Sorrows`,
    effects: [
      {
        name: `Reaper of Sorrows`,
        desc: `Pick one of the bearer's melee weapons. Before attacking with that weapon, roll 2D6. If the roll is higher than the target unit's Bravery, that weapon's Rend characteristic is -3 for attacks made against that unit.`,
        when: [START_OF_COMBAT_PHASE],
      },
    ],
  },
  {
    name: `Balefire Blade`,
    effects: [
      {
        name: `Balefire Blade`,
        desc: `Pick one of the bearer's melee weapons. Add 1 to that weapon's Damage characteristic.`,
        when: [COMBAT_PHASE],
      },
    ],
  },
  {
    name: `Slitter`,
    effects: [
      {
        name: `Slitter`,
        desc: `After picking the bearer to fight, before they pile in you can pick one enemy model within 1" of the bearer and roll a D6; if the roll is greater than the model's Wounds characteristic, it is slain.`,
        when: [START_OF_COMBAT_PHASE],
      },
    ],
  },
  {
    name: `Headsman's Judgement`,
    effects: [
      {
        name: `Headsman's Judgement`,
        desc: `Pick one of the bearer's melee weapons. Add 1 to hit and wound rolls for attacks made with that weapon.`,
        when: [COMBAT_PHASE],
      },
    ],
  },
  {
    name: `Shrieking Blade`,
    effects: [
      {
        name: `Shrieking Blade`,
        desc: `Subtract 1 from hit rolls for attacks made with melee weapons that target the bearer.`,
        when: [COMBAT_PHASE],
      },
    ],
  },
  {
    name: `Cloak of the Waxing Moon`,
    effects: [
      {
        name: `Cloak of the Waxing Moon`,
        desc: `The Deathless Spirits battle trait negates wounds inflicted by melee weapons that are allocated to the bearer on a 5+ instead of 6+.`,
        when: [COMBAT_PHASE],
      },
    ],
  },
  {
    name: `Pendant of the Fell Wind`,
    effects: [
      {
        name: `Pendant of the Fell Wind`,
        desc: `You can add 3" to normal moves made by friendly NIGHTHAUNT units that are wholly within 12" of the bearer at the start of that normal move.`,
        when: [MOVEMENT_PHASE],
      },
    ],
  },
  {
    name: `Dreadbolt Ring`,
    effects: [
      {
        name: `Dreadbolt Ring`,
        desc: `When the bearer fights, if they inflict one or more wounds with their melee weapons, you can inflict D3 mortal wounds on one enemy unit within 3" of the bearer after all of the bearer's attacks have been made.`,
        when: [END_OF_COMBAT_PHASE],
      },
    ],
  },
  {
    name: `Mirror of Screaming Souls`,
    effects: [
      {
        name: `Mirror of Screaming Souls`,
        desc: `At the start of your shooting phase, roll 2D6 for each enemy unit within 8" of the bearer. If the roll is higher than that unit's Bravery characteristic, it suffers 1 mortal wound.`,
        when: [START_OF_SHOOTING_PHASE],
      },
    ],
  },
  {
    name: `Midnight Tome`,
    effects: [
      {
        name: `Midnight Tome`,
        desc: `The bearer becomes a WIZARD and knows the Arcane Bolt and Mystic Shield spells, as well as one spell from the Lore of the Underworlds (pg 55, Death Battletome: Nighthaunt). They can attempt to cast one spell in each of your hero phases, and attempt to unbind one spell in each enemy hero phase. If the bearer was already a WIZARD, they can attempt to cast 1 additional spell in each of your hero phases instead.`,
        when: [HERO_PHASE],
      },
    ],
  },
  {
    name: `Covetous Familiar`,
    effects: [
      {
        name: `Covetous Familiar`,
        desc: `At the start of the combat phase, roll a D6 for each enemy unit within 3" of the bearer. On a 2+, that unit suffers 1 mortal wound.`,
        when: [START_OF_COMBAT_PHASE],
      },
    ],
  },
  {
    name: `Lightshard of the Harvest Moon`,
    effects: [
      {
        name: `Lightshard of the Harvest Moon`,
        desc: `Once per battle, at the start of the combat phase, the bearer can use this artifact. If they do so, you can re-roll failed hit rolls for attacks made by friendly NIGHTHAUNT units that are wholly within 12" of the bearer when they attack in that combat phase.`,
        when: [START_OF_COMBAT_PHASE],
      },
    ],
  },
  {
    name: `Wychlight Lantern`,
    effects: [
      {
        name: `Wychlight Lantern`,
        desc: `Add 1 to casting rolls for the bearer.`,
        when: [HERO_PHASE],
      },
    ],
  },
  {
    name: `Beacon of Nagashizzar`,
    effects: [
      {
        name: `Beacon of Nagashizzar`,
        desc: `If the bearer successfully casts the Spectral Lure spell and it is not unbound, instead of the normal effects of the spell, you can either heal D6+3 wounds that have been allocated to the target unit or, if no wounds have been allocated to that unit, you can return a number of slain models to it that have a combined Wounds characteristic equal to or less than D6+3.`,
        when: [HERO_PHASE],
      },
    ],
  },
]

export default Artifacts

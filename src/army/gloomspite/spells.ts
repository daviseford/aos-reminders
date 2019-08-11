import {
  BATTLESHOCK_PHASE,
  CHARGE_PHASE,
  COMBAT_PHASE,
  HERO_PHASE,
  MOVEMENT_PHASE,
  SHOOTING_PHASE,
} from 'types/phases'
import { TSpells } from 'types/army'

const Spells: TSpells = [
  {
    name: `Vindictive Glare`,
    effects: [
      {
        name: `Vindictive Glare`,
        desc: `Casting value of 5. If successfully cast, pick 1 enemy unit within 12" of the caster and visible to them. That unit suffers D3 mortal wounds.`,
        when: [HERO_PHASE],
      },
    ],
  },
  {
    name: `Itchy Nuisance`,
    effects: [
      {
        name: `Itchy Nuisance`,
        desc: `Casting value of 6. If successfully cast, pick 1 enemy unit within 18" of the caster and visible to them. That unit fights at the end of the next combat phase, after the players have picked any other units to fight in that combat phase.`,
        when: [HERO_PHASE, COMBAT_PHASE],
      },
    ],
  },
  {
    name: `The Great Green Spite`,
    effects: [
      {
        name: `The Great Green Spite`,
        desc: `Casting value of 7. If successfully cast, pick 1 friendly GLOOMSPITE GITZ unit wholly within 18" of the caster, and an enemy unit within 24" of the caster and visible to them. The enemy unit suffers 1 mortal wound if the friendly unit has fewer than 10 models, D3 mortal wounds if the friendly unit has 10 to 20 models, and D6 mortal wounds if it has more than 20 models.`,
        when: [HERO_PHASE],
      },
    ],
  },
  {
    name: `The Hand of Gork`,
    effects: [
      {
        name: `The Hand of Gork`,
        desc: `Casting value of 7. If successfully cast, pick 1 friendly GLOOMSPITE GITZ unit wholly within 24" of the caster, visible to them and more than 3" from any enemy units. Remove that unit from the battlefield and set it up again anywhere on the battlefield more than 9" from any enemy units. It may not move in the subsequent movement phase.`,
        when: [HERO_PHASE, MOVEMENT_PHASE],
      },
    ],
  },
  {
    name: `Squig Lure`,
    effects: [
      {
        name: `Squig Lure`,
        desc: `Casting value of 5. If successfully cast, pick up to D3 friendly SQUIG units wholly within 18" of the caster and visible to them. Those units can run and still charge later in the same turn.`,
        when: [HERO_PHASE, CHARGE_PHASE],
      },
    ],
  },
  {
    name: `Call da Moon`,
    effects: [
      {
        name: `Call da Moon`,
        desc: `Casting value of 8. If successfully cast, pick 1 enemy unit visible to the caster. That unit suffers D3 mortal wounds. If that unit is wholly affected by the light of the Bad Moon, you can re-roll the D3 that determines the number of mortal wounds.`,
        when: [HERO_PHASE],
      },
    ],
  },
  {
    name: `Deadly Webbing`,
    effects: [
      {
        name: `Deadly Webbing`,
        desc: `Casting value of 5. If successfully cast, pick 1 terrain feature within 24" of the caster that is visible to them. Until your next hero phase, that terrain feature has the Deadly and Sinister scenery rules in addition to any other scenery rules it already has. SPIDERFANG units ignore the effects of this spell.`,
        when: [HERO_PHASE, BATTLESHOCK_PHASE, CHARGE_PHASE, MOVEMENT_PHASE],
      },
    ],
  },
  {
    name: `Venomous Spiderlings`,
    effects: [
      {
        name: `Venomous Spiderlings`,
        desc: `Casting value of 6. If successfully cast, pick 1 enemy unit within 12" of the caster and visible to them and roll a number of dice equal to the number of models in that unit. For each 6+ that unit suffers 1 mortal wound.`,
        when: [HERO_PHASE],
      },
    ],
  },
  {
    name: `Scuttling Terrors`,
    effects: [
      {
        name: `Scuttling Terrors`,
        desc: `Casting value of 7. If successfully cast, pick 1 friendly SPIDERFANG unit wholly within 24" of the caster. That unit can run and still shoot and/or charge later in the same turn.`,
        when: [HERO_PHASE, CHARGE_PHASE, SHOOTING_PHASE],
      },
    ],
  },
  {
    name: `Sneaky Distraction`,
    effects: [
      {
        name: `Sneaky Distraction`,
        desc: `Casting value of 7. If successfully cast, until your next hero phase subtract 1 from hit rolls for attacks made by enemy units while they are wholly within 12" of the caster.`,
        when: [HERO_PHASE, COMBAT_PHASE, SHOOTING_PHASE],
      },
    ],
  },
  {
    name: `Curse of da Spider God`,
    effects: [
      {
        name: `Curse of da Spider God`,
        desc: `Casting value of 7. If successfully cast, pick 1 enemy unit within 24" of the caster and visible to them. Until your next hero phase, hit rolls made for attacks by that unit always fail on an unmodified roll of 1 or 2 instead of only on a 1, and save rolls made for attacks that target that unit always fail on an unmodified roll of 1 or 2 instead of only on a 1.`,
        when: [HERO_PHASE, COMBAT_PHASE, SHOOTING_PHASE],
      },
    ],
  },
  {
    name: `Gift of da Spider God`,
    effects: [
      {
        name: `Gift of da Spider God`,
        desc: `Casting value of 8. If successfully cast, pick 1 friendly SPIDERFANG MONSTER within 12" of the caster that is visible to them. You can heal D6 wounds allocated to that unit.`,
        when: [HERO_PHASE],
      },
    ],
  },
]

export default Spells

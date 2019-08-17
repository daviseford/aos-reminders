import { TScenery } from 'types/army'
import { getSceneryEffects } from 'types/terrain'
import {
  DURING_GAME,
  DURING_SETUP,
  START_OF_SETUP,
  START_OF_HERO_PHASE,
  START_OF_ROUND,
  TURN_ONE_START_OF_ROUND,
  HERO_PHASE,
  MOVEMENT_PHASE,
  CHARGE_PHASE,
  SHOOTING_PHASE,
  START_OF_MOVEMENT_PHASE,
} from 'types/phases'
import {
  DAMNED,
  ARCANE,
  INSPIRING,
  DEADLY,
  MYSTICAL,
  SINISTER,
  OVERGROWN,
  ENGTANGLING,
  VOLCANIC,
  COMMANDING,
  HEALING,
  NULLIFICATION,
  OBSTACLE,
  GARRISONS,
} from 'types/terrain'

// Default scenery effects for most games and custom scenery.
export const DefaultScenery: TScenery = [
  {
    name: DAMNED,
    effects: [
      {
        name: `Damned`,
        desc: `You can pick 1 friendly unit within 1" of this terrain to take D3 mortal wounds.`,
        when: [START_OF_HERO_PHASE],
      },
      {
        name: `Damned`,
        desc: `If active, buffed unit can re-roll hits of 1.`,
        when: [DURING_GAME],
      },
    ],
  },
  {
    name: ARCANE,
    effects: [
      {
        name: `Arcane`,
        desc: `Add 1 to casting and unbinding rolls for wizards within 1" of this terrain.`,
        when: [HERO_PHASE],
      },
    ],
  },
  {
    name: INSPIRING,
    effects: [
      {
        name: `Inspiring`,
        desc: `Add 1 to the bravery characteristic of units within 1" of this terrain.`,
        when: [DURING_GAME],
      },
    ],
  },
  {
    name: DEADLY,
    effects: [
      {
        name: `Deadly`,
        desc: `Roll a dice whenever a unit finishes a normal move or charge move within 1" of this terrain.  On a 1, the unit suffers D3 mortal wounds.`,
        when: [MOVEMENT_PHASE, CHARGE_PHASE],
      },
    ],
  },
  {
    name: MYSTICAL,
    effects: [
      {
        name: `Mystical`,
        desc: `Roll a dice each time a unit within 1" of this terrain suffers a wound or mortal wound.  On a 6+ the wound is negated.`,
        when: [DURING_GAME],
      },
    ],
  },
  {
    name: SINISTER,
    effects: [
      {
        name: `Sinister`,
        desc: `Subtract 1 from the bravery characteristic of units within 1" of this terrain.`,
        when: [DURING_GAME],
      },
    ],
  },
  {
    name: OVERGROWN,
    effects: [
      {
        name: `Overgrown`,
        desc: `Units are not visible if a 1mm immaginary line drawn from the closest points of two models crosses more than 1" of this terrain.  Does not apply if either unit can fly.`,
        when: [DURING_GAME],
      },
    ],
  },
  {
    name: ENGTANGLING,
    effects: [
      {
        name: `Entangling`,
        desc: `Subtract 2 from run and charge rolls (to a minimum of 0) for units that are within 1" of this terrain.`,
        when: [MOVEMENT_PHASE, CHARGE_PHASE],
      },
    ],
  },
  {
    name: VOLCANIC,
    effects: [
      {
        name: `Volcanic`,
        desc: `Roll a dice for each instance of this terrain.  On a 6, each unit within 1" of the terrain rolled for suffers D3 mortal wounds.`,
        when: [START_OF_HERO_PHASE],
      },
    ],
  },
  {
    name: COMMANDING,
    effects: [
      {
        name: `Commanding`,
        desc: `If your general and no enemy general are within 1" of this terrain, add 1 to the number of command points you receive.`,
        when: [START_OF_HERO_PHASE],
      },
    ],
  },
  {
    name: HEALING,
    effects: [
      {
        name: `Healing`,
        desc: `Roll a dice for each friendly unit within 1" of any Healing terrain.  On a 6 you can heal D3 wounds to that unit.`,
        when: [START_OF_HERO_PHASE],
      },
    ],
  },
  {
    name: NULLIFICATION,
    effects: [
      {
        name: `Nullification`,
        desc: `If a hero is within 1" of this terrain it can attempt to unbind 1 spell.  Wizards get this unbind in addition to any others they have.`,
        when: [HERO_PHASE],
      },
      {
        name: `Nullification`,
        desc: `If an endless spell is set up or finishes a move within 1" of this terrain it is dispelled.  Any affects from the spell are applied before the model is removed.`,
        when: [DURING_GAME],
      },
    ],
  },
  {
    name: OBSTACLE,
    effects: [
      {
        name: `Obstacle`,
        desc: `If a unit has all of its models within 1" of this terrain is targeted for a shooting attack, the unit receives cover if the attacking model is closer to the terrain than the targeted unit.`,
        when: [SHOOTING_PHASE],
      },
    ],
  },
  {
    name: GARRISONS,
    effects: [
      {
        name: `Garrisons`,
        desc: `Units can be set up as a garrison if this terrain is wholly within your territory.
              
               The models garrisoning this terrain feature must have a combined wounds characteristic of 30 or less.`,
        when: [DURING_SETUP],
      },
      {
        name: `Garrisons`,
        desc: `A unit that is wholly within 6" of this terrain and no enemy models within 3" of this terrain may garrison instead of moving.
        
               A unit may exit the terrain if it can be set up wholly within 6" of the terrain and more than 3" from enemy models.  This counts as the unit's move.
               
               The models garrisoning this terrain feature must have a combined wounds characteristic of 30 or less.`,
        when: [MOVEMENT_PHASE],
      },
      {
        name: `Garrisons`,
        desc: `A garrisoned unit is assumed to be in cover.  In addition, subtract 1 from hit rolls against a garrisoned unit.
              
              Models cannot finish any move onto this terrain feature.`,
        when: [DURING_GAME],
      },
    ],
  },
]

// Faction scenery available to all armies and all other official models potentially a part of each battle.
const OfficialScenery: TScenery = [
  {
    name: `Penumbral Engine`,
    effects: [
      {
        name: `Penumbral Engine`,
        desc: `After territories have been chosen, but before armies have been set up, you can set up this model wholly within your territory.  It must be more than 12" from enemy territory, at least 3" away from other terrain features, and at least 1" away from any objectives.  If both players can place a terrain features at this time, roll off to see who places first.`,
        when: [START_OF_SETUP],
      },
      {
        name: `Repercussions of the Necroquake`,
        desc: `After determining who has the first turn, roll a dice to determine the function of this model for the duration of the battle:                 
               
               1-3: Orrery of Obfuscation.
               4-6: Orrery of Illumination`,
        when: [TURN_ONE_START_OF_ROUND],
      },
      {
        name: `Orrery of Obfuscation`,
        desc: `Re-roll save rolls of 1 for units wholly within 12" any Penumbral terrain features.`,
        when: [DURING_GAME],
      },
      {
        name: `Orrery of Illumination`,
        desc: `At the start of your hero phase, you receive 1 extra command point if any friendly Heroes are within 12" of any Penumbral terrain features.`,
        when: [START_OF_HERO_PHASE],
      },
      {
        name: `Deteriorating State`,
        desc: `Applies from start of Round 2 onwards.  Roll a dice.  On a 1-4 nothing happens.  On a 5-6, the currently active Orrey function switches to the other option.`,
        when: [START_OF_ROUND],
      },
    ],
  },
  {
    name: `Arcane Ruin`,
    effects: [...getSceneryEffects(OBSTACLE), ...getSceneryEffects(ARCANE)],
  },
  {
    name: `Azyrite Ruins`,
    effects: [...getSceneryEffects(OBSTACLE)],
  },
  {
    name: `Baleful Realmgate`,
    effects: [
      {
        name: `Spirit Journey`,
        desc: `You may remove a unit wholly within 6" of this terrain and set it up wholly within 6" of another Baleful Realmgate.  This can only be activated if a priest or wizard is within 6" of the starting gate.`,
        when: [START_OF_MOVEMENT_PHASE],
      },
      ...getSceneryEffects(OBSTACLE),
    ],
  },
  {
    name: `Barbed Venomgorse`,
    effects: [
      {
        name: `Barbed Venomgorse`,
        desc: `This terrain consists of 3 models each set up within 1" of at least one other model from the group.`,
        when: [START_OF_SETUP],
      },
      ...getSceneryEffects(DEADLY),
      ...getSceneryEffects(OBSTACLE),
    ],
  },
  {
    name: `Citadel Wood`,
    effects: [...getSceneryEffects(OVERGROWN), ...getSceneryEffects(OBSTACLE)],
  },
  {
    name: `Dragonfate Dais`,
    effects: [...getSceneryEffects(DAMNED), ...getSceneryEffects(OBSTACLE)],
  },
  {
    name: `Magewrath Throne`,
    effects: [...getSceneryEffects(COMMANDING), ...getSceneryEffects(OBSTACLE)],
  },
  {
    name: `Numinous Occulum`,
    effects: [...getSceneryEffects(MYSTICAL), ...getSceneryEffects(OBSTACLE)],
  },
  {
    name: `Ophidian Archway`,
    effects: [...getSceneryEffects(SINISTER), ...getSceneryEffects(OBSTACLE)],
  },
  {
    name: `Shardwrack Spines`,
    effects: [
      {
        name: `Shardwrack Spines`,
        desc: `This terrain consists of 2-5 models with all model's bases touching at least one other model's base from the group.`,
        when: [START_OF_SETUP],
      },
      ...getSceneryEffects(DEADLY),
      ...getSceneryEffects(OBSTACLE),
    ],
  },
  {
    name: `Sigmarite Mausoleum`,
    effects: [
      {
        name: `Sigmarite Mausoleum`,
        desc: `This terrain consists of 3-6 crypt models, 1-2 statue models, 1-2 gate models, and 7-14 wall section models.  All model's bases must be touching at least two other model's bases from the group.`,
        when: [START_OF_SETUP],
      },
      {
        name: `Domain of the Dead`,
        desc: `This terrain is treated as an additional gravesite as specified in Battletome: Legions of Nagash.`,
        when: [DURING_GAME],
      },
      ...getSceneryEffects(GARRISONS),
    ],
  },
  {
    name: `Walls and Fences`,
    effects: [
      {
        name: `Walls and Fences`,
        desc: `This terrain feature consists of 2-10 wall and/or fence models and is set up with all model's bases touching at least one other model's base from the group.`,
        when: [START_OF_SETUP],
      },
      ...getSceneryEffects(OBSTACLE),
    ],
  },
  {
    name: `Warscryer Citadel`,
    effects: [
      {
        name: `Celestium Construct`,
        desc: `If any heroes from your army are garrisoning this terrain you can roll a dice.  On a 2+, add 1 to the number of command points you receive this phase.  On a 1, subtract 1 from the number of command points your receive instead.`,
        when: [START_OF_HERO_PHASE],
      },
      {
        name: `Domed Arcanoscope`,
        desc: `If any heroes from your army are garrisoning this terrain with a domed arcanoscope, one of them can attempt to unbind 1 spell.  Wizards get this unbind in addition to any others they have.`,
        when: [HERO_PHASE],
      },
      {
        name: `Crenellated Battlements`,
        desc: `A model with a wounds characteristic of 10+ cannot garrison this terrain unless the terrain has crenellated battlements.
              
               If this terrain has crenellated battlements, it can be garrisoned by a single monster that can fly in addtion to the other models that can garrison it.`,
        when: [DURING_SETUP, MOVEMENT_PHASE],
      },
      ...getSceneryEffects(GARRISONS),
    ],
  },
]

// Combine all scenery rules into generic scenery export for use by any army.
const GenericScenery: TScenery = [...DefaultScenery, ...OfficialScenery]
export default GenericScenery

import { TBattalions, TUnits } from 'types/army'
import {
  BATTLESHOCK_PHASE,
  CHARGE_PHASE,
  COMBAT_PHASE,
  DURING_GAME,
  END_OF_COMBAT_PHASE,
  HERO_PHASE,
  MOVEMENT_PHASE,
  SHOOTING_PHASE,
  START_OF_CHARGE_PHASE,
  START_OF_COMBAT_PHASE,
  START_OF_MOVEMENT_PHASE,
  START_OF_ROUND,
  START_OF_SETUP,
  TURN_ONE_START_OF_ROUND,
  END_OF_CHARGE_PHASE,
  DURING_SETUP,
} from 'types/phases'

// Unit Names
export const Units: TUnits = [
  {
    name: `Awakened Wyldwood`,
    effects: [
      {
        name: `Overgrown Wilderness`,
        desc: `Models are not visible to each other if an imaginary straight line 1mm wide drawn between the closest points of the two models crosses over more than 1" of an AWAKENED WYLDWOOD. This scenery rule does not apply if either model can fly.`,
        when: [DURING_GAME],
      },
      {
        name: `Roused by Magic`,
        desc: `In the hero phase, if a spell is successfully cast by a WIZARD wholly within 6" of an AWAKENED WYLDWOOD and not unbound, roll a dice for each unit within 1" of that AWAKENED WYLDWOOD which does not have the SYLVANETH keyword. On a 5+ that unit suffers D3 mortal wounds after that spell's effects have been resolved.`,
        when: [HERO_PHASE],
      },
      {
        name: `Wyldwood`,
        desc: `At the end of the charge phase, roll a dice for each unit within 1" of an AWAKENED WYLDWOOD which does not have the SYLVANETH keyword. On a 6, that unit suffers D3 mortal wounds.`,
        when: [END_OF_CHARGE_PHASE],
      },
    ],
  },
  {
    name: `Alarielle The Everqueen`,
    effects: [
      {
        name: `Talon of the Dwindling`,
        desc: `If the unmodified hit roll for an attack made by the Talon of the Dwindling is 6, that attack inflicts D3 mortal wounds on the target in addition to any normal damage.`,
        when: [COMBAT_PHASE],
      },
      {
        name: `Lifebloom`,
        desc: `In your hero phase, you can heal up to D3 wounds allocated to each friendly SYLVANETH unit wholly within 30" of this model (roll separately for each unit)`,
        when: [HERO_PHASE],
      },
      {
        name: `Sweeping Blows`,
        desc: `Add 1 to hit rolls for attacks made with this model's Great Antlers if the target unit contains 5 or more model.`,
        when: [COMBAT_PHASE],
      },
      {
        name: `Living Battering Ram`,
        desc: `Roll a dice for each enemy unit that is within 1" of this model after this model makes a charge move. On a 4+ that unit suffers D3 mortal wounds.`,
        when: [CHARGE_PHASE],
      },
      {
        name: `Soul Amphorae`,
        desc: `Once per battle, at the end of your movement phase, you can summon 1 of the following units to the battlefield:
• 20 Dryads
• 10 Tree-Revenants
• 10 Spite-Revenants
• 3 Kurnoth Hunters
• 1 Branchwych
• 1 Treelord
The summoned unit is added to your army, and must be set up wholly within 9" of this model and more than 9" from any enemy units`,
        when: [],
      },
      {
        name: ``,
        desc: ``,
        when: [],
      },
      {
        name: ``,
        desc: ``,
        when: [],
      },
      {
        name: ``,
        desc: ``,
        when: [],
      },
    ],
  },
  {
    name: ``,
    effects: [
      {
        name: ``,
        desc: ``,
        when: [],
      },
    ],
  },
  {
    name: ``,
    effects: [
      {
        name: ``,
        desc: ``,
        when: [],
      },
    ],
  },
  {
    name: ``,
    effects: [
      {
        name: ``,
        desc: ``,
        when: [],
      },
    ],
  },
  {
    name: ``,
    effects: [
      {
        name: ``,
        desc: ``,
        when: [],
      },
    ],
  },
  {
    name: `Branchwraith`,
    effects: [
      {
        name: `Blessings of the Forest`,
        desc: `Subtract 1 from all hit rolls made against a Branchwraith if she is within 3" of a Sylvaneth Wyldwood.`,
        when: [DURING_GAME],
      },
    ],
  },
  {
    name: ``,
    effects: [
      {
        name: ``,
        desc: ``,
        when: [],
      },
    ],
  },
  {
    name: ``,
    effects: [
      {
        name: ``,
        desc: ``,
        when: [],
      },
    ],
  },
  {
    name: ``,
    effects: [
      {
        name: ``,
        desc: ``,
        when: [],
      },
    ],
  },
  {
    name: ``,
    effects: [
      {
        name: ``,
        desc: ``,
        when: [],
      },
    ],
  },
  {
    name: ``,
    effects: [
      {
        name: ``,
        desc: ``,
        when: [],
      },
    ],
  },
  {
    name: ``,
    effects: [
      {
        name: ``,
        desc: ``,
        when: [],
      },
    ],
  },
  {
    name: ``,
    effects: [
      {
        name: ``,
        desc: ``,
        when: [],
      },
    ],
  },
  {
    name: ``,
    effects: [
      {
        name: ``,
        desc: ``,
        when: [],
      },
    ],
  },
  {
    name: ``,
    effects: [
      {
        name: ``,
        desc: ``,
        when: [],
      },
    ],
  },
  {
    name: ``,
    effects: [
      {
        name: ``,
        desc: ``,
        when: [],
      },
    ],
  },
]

// Battalions
export const Battalions: TBattalions = [
  {
    name: `Wargrove`,
    effects: [
      {
        name: `Mighty Wyldwood`,
        desc: `When you choose a Sylvaneth army, you can include 2 AWAKENED WYLDWOOD terrain features instead of 1 if your army includes this battalion.`,
        when: [DURING_SETUP],
      },
    ],
  },
  {
    name: `Free Spirits`,
    effects: [
      {
        name: `Swift Vengeance`,
        desc: `In your movement phase, if you declare a unit from this battalion will run, do not make a run roll. Instead, add 6" to the Move characteristic of that unit for that phase.`,
        when: [HERO_PHASE],
      },
    ],
  },
  {
    name: `Lords of the Clan`,
    effects: [
      {
        name: `Deadly Chorus`,
        desc: `In your shooting phase, roll a dice for each enemy unit that is within 6" of 2 or more models from this battalion. On a 2+ that enemy unit suffers D3 mortal wounds.`,
        when: [SHOOTING_PHASE],
      },
    ],
  },
  {
    name: `Household`,
    effects: [
      {
        name: `Discipline of the Ages`,
        desc: `Enemy units within 3" of any units from this battalion cannot retreat.`,
        when: [MOVEMENT_PHASE],
      },
    ],
  },
  {
    name: `Forest Folk`,
    effects: [
      {
        name: `Swift as the Breeze`,
        desc: `Units from this battalion can retreat and still charge later in the same turn.`,
        when: [CHARGE_PHASE],
      },
    ],
  },
  {
    name: `Outcasts`,
    effects: [
      {
        name: `Feat the Forest-kin`,
        desc: `If an enemy unit fails a battleshock test within 3" of any units from this battalion, add D3 to the number of models that flee.`,
        when: [BATTLESHOCK_PHASE],
      },
    ],
  },
]

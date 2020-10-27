import { TArtifacts } from 'types/army'
import {
  CHARGE_PHASE,
  COMBAT_PHASE,
  DURING_GAME,
  HERO_PHASE,
  MOVEMENT_PHASE,
  SHOOTING_PHASE,
  START_OF_HERO_PHASE,
  START_OF_SHOOTING_PHASE,
  TURN_ONE_START_OF_HERO_PHASE,
  WOUND_ALLOCATION_PHASE,
} from 'types/phases'

const Artifacts: TArtifacts = [
  {
    name: `Headmasher`,
    effects: [
      {
        name: `Headmasher`,
        desc: `The bearer's Thundermace has a Damage characteristic of 4 instead of 3.`,
        when: [COMBAT_PHASE],
      },
    ],
  },
  {
    name: `Grawl's Gut-plate`,
    effects: [
      {
        name: `Grawl's Gut-plate`,
        desc: `Add 4" to the bearer's Move characteristic while they are hungry instead of 2".`,
        when: [MOVEMENT_PHASE],
      },
    ],
  },
  {
    name: `Gruesome Trophy Rack`,
    effects: [
      {
        name: `Gruesome Trophy Rack`,
        desc: `Add 1 to hit rolls for attacks made by friendly GUTBUSTERS units wholly within 12" of the bearer that target a MONSTER or HERO.`,
        when: [SHOOTING_PHASE, COMBAT_PHASE],
      },
    ],
  },
  {
    name: `Flask of Stonehorn Blood`,
    effects: [
      {
        name: `Flask of Stonehorn Blood`,
        desc: `Once per battle, at the start of any phase, the bearer can use this artefact. If they do so, until the end of that turn, roll a D6 each time you allocate a wound or mortal wound to the bearer. On a 4+, that wound or mortal wound is negated.`,
        when: [DURING_GAME],
      },
      {
        name: `Flask of Stonehorn Blood`,
        desc: `If active, roll a D6 each time you allocate a wound or mortal wound to the bearer. On a 4+, that wound or mortal wound is negated.`,
        when: [WOUND_ALLOCATION_PHASE],
      },
    ],
  },
  {
    name: `Sky-Titan Scatter Pistols`,
    effects: [
      {
        name: `Sky-Titan Scatter Pistols`,
        desc: `The bearer's Ogor Pistols have an Attacks characteristic of 6 instead of 2.`,
        when: [SHOOTING_PHASE],
      },
    ],
  },
  {
    name: `The Fang of Ghur`,
    effects: [
      {
        name: `The Fang of Ghur`,
        desc: `The bearer's Beastskewer Glaive has a Rend characteristic of -3 instead of -l.`,
        when: [COMBAT_PHASE],
      },
    ],
  },
  {
    name: `Dracoline Heart`,
    effects: [
      {
        name: `Dracoline Heart`,
        desc: `Once per battle, at the start of your hero phase, the bearer can use this artefact. If they do so, pick 1 GREAT MAWPOT terrain feature that is part of your army, within 6" of the bearer and empty. Tlat GREAT MAWPOT is now full.`,
        when: [START_OF_HERO_PHASE],
      },
    ],
  },
  {
    name: `Shrunken Priest Head`,
    effects: [
      {
        name: `Shrunken Priest Head`,
        desc: `Roll a D6 each time you allocate a wound or mortal wound to the bearer. On a 5+, that wound or mortal wound is negated.`,
        when: [WOUND_ALLOCATION_PHASE],
      },
    ],
  },
  {
    name: `Wizardflesh Apron`,
    effects: [
      {
        name: `Wizardflesh Apron`,
        desc: `The bearer can cast 1 additional spell in each of your hero phases.`,
        when: [HERO_PHASE],
      },
    ],
  },
  {
    name: `Bloodrock Talisman`,
    effects: [
      {
        name: `Bloodrock Talisman`,
        desc: `Add 2 to the roll when the bearer attempts to unbind or dispel an endless spell.`,
        when: [HERO_PHASE],
      },
    ],
  },
  {
    name: `Grease-smeared Tusks`,
    effects: [
      {
        name: `Grease-smeared Tusks`,
        desc: `Add 1 to charge rolls for friendly MONSTERS while they are within 9" of the bearer.`,
        when: [CHARGE_PHASE],
      },
    ],
  },
  {
    name: `Rotting Dankhold Spores`,
    effects: [
      {
        name: `Rotting Dankhold Spores`,
        desc: `Once per battle, at the start of your hero phase, the bearer can use this artefact. If they do so, pick 1 enemy unit within 6" of the bearer and roll a number of dice equal to the number of models in that unit. For each 4+, that unit suffers 1 mortal wound.`,
        when: [START_OF_HERO_PHASE],
      },
    ],
  },
  {
    name: `The Rime Shroud`,
    effects: [
      {
        name: `The Rime Shroud`,
        desc: `Reroll unmodified hit rolls of 6 for attacks made with missile weapons that target the bearer.`,
        when: [SHOOTING_PHASE],
      },
    ],
  },
  {
    name: `Blade of All-Frost`,
    effects: [
      {
        name: `Blade of All-Frost`,
        desc: `Pick 1 of the bearer's melee weapons. If any wounds inflicted by this weapon are allocated to an enemy HERO or MONSTER model and that model is not slain, subtract 1 from hit and wound rolls for attacks made with melee weapons by that model for the rest of the battle.`,
        when: [COMBAT_PHASE],
      },
    ],
  },
  {
    name: `Carvalox Flank`,
    effects: [
      {
        name: `Carvalox Flank`,
        desc: `Friendly ICEFALL YHETEE units that are wholly within 12" of the bearer at the start of the movement phase can move an extra 2" when they make a normal move during that phase.`,
        when: [MOVEMENT_PHASE],
      },
    ],
  },
  {
    name: `Alvagr Rune-tokens`,
    effects: [
      {
        name: `Alvagr Rune-tokens`,
        desc: `Once per battle, at the start of your hero phase, the bearer can use this artefact. If they do so, until the start of your next hero phase, you can reroll hit and wound rolls for attacks made by the bearer and reroll save rolls for attacks that target the bearer.`,
        when: [START_OF_HERO_PHASE],
      },
    ],
  },
  {
    name: `Skullshards of Dragaar`,
    effects: [
      {
        name: `Skullshards of Dragaar`,
        desc: `Once per battle, the bearer can attempt to unbind 1 spell in the enemy hero phase as if they were a WIZARD. If they do so, that spell is automatically unbound (do not roll 2D6).`,
        when: [HERO_PHASE],
      },
    ],
  },
  {
    name: `Elixir of Frostwyrm`,
    effects: [
      {
        name: `Elixir of Frostwyrm`,
        desc: `Once per battle, at the start of your shooting phase, the bearer can use this artefact. If they do so, pick 1 enemy unit within 9" of the bearer that is visible to them. That unit suffers D6 mortal wounds. The bearer then suffers D3 mortal wounds.`,
        when: [START_OF_SHOOTING_PHASE],
      },
    ],
  },
  {
    name: `The Pelt of Charngar`,
    effects: [
      {
        name: `The Pelt of Charngar`,
        desc: `In your hero phase, you can heal up to D3 wounds allocated to the bearer.`,
        when: [HERO_PHASE],
      },
    ],
  },
  {
    name: `Kattanak Browplate`,
    effects: [
      {
        name: `Kattanak Browplate`,
        desc: `Add 1 to save rolls for attacks that target the bearer.`,
        when: [SHOOTING_PHASE, DURING_GAME],
      },
      {
        name: `Kattanak Browplate`,
        desc: `At the start of your first hero phase, you receive 1 additional command point.`,
        when: [TURN_ONE_START_OF_HERO_PHASE],
      },
    ],
  },
  {
    name: `Frost-talon Shardbolts`,
    effects: [
      {
        name: `Frost-talon Shardbolts`,
        desc: `If the unmodified hit roll for an attack made with the bearer's Hunter's Crossbow is 6, that attack inflicts D3 mortal wounds on the target in addition to any normal damage.`,
        when: [SHOOTING_PHASE],
      },
    ],
  },
]

export default Artifacts

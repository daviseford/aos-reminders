import { tagAs } from 'factions/metatagger'
import {
  CHARGE_PHASE,
  COMBAT_PHASE,
  DURING_GAME,
  END_OF_COMBAT_PHASE,
  HERO_PHASE,
  MOVEMENT_PHASE,
  SAVES_PHASE,
  SHOOTING_PHASE,
  START_OF_HERO_PHASE,
  START_OF_ROUND,
  START_OF_SHOOTING_PHASE,
  TURN_ONE_START_OF_HERO_PHASE,
  WOUND_ALLOCATION_PHASE,
} from 'types/phases'

const Artifacts = {
  'Gut-plate of Ghur': {
    effects: [
      {
        name: `Gut-plate of Ghur`,
        desc: `You can reroll save rolls of 1 for attacks that target the bearer.`,
        when: [SAVES_PHASE],
      },
    ],
  },

  'Splatter-cleaver': {
    effects: [
      {
        name: `Splatter-cleaver`,
        desc: `Pick 1 of the bearer's melee weapons. At the end of the combat phase, if any wounds inflicted by that weapon in that phase were allocated to an enemy model and not negated, you can heal D3 wounds allocated to each friendly BLOODGULLET OGOR unit wholly within 12" of the bearer (roll separately for each unit).`,
        when: [END_OF_COMBAT_PHASE],
      },
    ],
  },

  'Gnoblar Blast Keg': {
    effects: [
      {
        name: `Gnoblar Blast Keg`,
        desc: `Once per battle, at the start of your shooting phase, you can use the Gnoblar Blast Keg. If you do so, pick 1 enemy unit within 9" of the bearer that is visible to them and roll 6 dice. Add 1 to each roll for every 10 models in the target unit. For each 6+, that enemy unit suffers D3 mortal wounds.`,
        when: [START_OF_SHOOTING_PHASE],
      },
    ],
  },

  'Brand of the Svard': {
    effects: [
      {
        name: `Brand of the Svard`,
        desc: `If the bearer has a mount, add 1 to hit rolls for attacks made with that mount's melee weapons.`,
        when: [COMBAT_PHASE],
      },
    ],
  },

  Shatterstone: {
    effects: [
      {
        name: `Shatterstone`,
        desc: `Enemy units treat terrain features within 12" of the bearer as having the Deadly scenery rule in addition to any other scenery rules they may have.`,
        when: [DURING_GAME],
      },
    ],
  },

  Frostfang: {
    effects: [
      {
        name: `Frostfang`,
        desc: `Pick 1 of the bearer's melee weapons. At the start of each battle round, roll a D6. On a 5+, add 1 to the damage inflicted by attacks made with that weapon for the rest of the battle. This effect is cumulative.`,
        when: [START_OF_ROUND],
      },
    ],
  },

  Headmasher: {
    effects: [
      {
        name: `Headmasher`,
        desc: `The bearer's Thundermace has a Damage characteristic of 4 instead of 3.`,
        when: [COMBAT_PHASE],
      },
    ],
  },

  "Grawl's Gut-plate": {
    effects: [
      {
        name: `Grawl's Gut-plate`,
        desc: `Add 4" to the bearer's Move characteristic while they are hungry instead of 2".`,
        when: [MOVEMENT_PHASE],
      },
    ],
  },

  'Gruesome Trophy Rack': {
    effects: [
      {
        name: `Gruesome Trophy Rack`,
        desc: `Add 1 to hit rolls for attacks made by friendly GUTBUSTERS units wholly within 12" of the bearer that target a MONSTER or HERO.`,
        when: [SHOOTING_PHASE, COMBAT_PHASE],
      },
    ],
  },

  'Flask of Stonehorn Blood': {
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

  'Sky-Titan Scatter Pistols': {
    effects: [
      {
        name: `Sky-Titan Scatter Pistols`,
        desc: `The bearer's Ogor Pistols have an Attacks characteristic of 6 instead of 2.`,
        when: [SHOOTING_PHASE],
      },
    ],
  },

  'The Fang of Ghur': {
    effects: [
      {
        name: `The Fang of Ghur`,
        desc: `The bearer's Beastskewer Glaive has a Rend characteristic of -3 instead of -l.`,
        when: [COMBAT_PHASE],
      },
    ],
  },

  'Dracoline Heart': {
    effects: [
      {
        name: `Dracoline Heart`,
        desc: `Once per battle, at the start of your hero phase, the bearer can use this artefact. If they do so, pick 1 GREAT MAWPOT terrain feature that is part of your army, within 6" of the bearer and empty. Tlat GREAT MAWPOT is now full.`,
        when: [START_OF_HERO_PHASE],
      },
    ],
  },

  'Shrunken Priest Head': {
    effects: [
      {
        name: `Shrunken Priest Head`,
        desc: `Roll a D6 each time you allocate a wound or mortal wound to the bearer. On a 5+, that wound or mortal wound is negated.`,
        when: [WOUND_ALLOCATION_PHASE],
      },
    ],
  },

  'Wizardflesh Apron': {
    effects: [
      {
        name: `Wizardflesh Apron`,
        desc: `The bearer can cast 1 additional spell in each of your hero phases.`,
        when: [HERO_PHASE],
      },
    ],
  },

  'Bloodrock Talisman': {
    effects: [
      {
        name: `Bloodrock Talisman`,
        desc: `Add 2 to the roll when the bearer attempts to unbind or dispel an endless spell.`,
        when: [HERO_PHASE],
      },
    ],
  },

  'Grease-smeared Tusks': {
    effects: [
      {
        name: `Grease-smeared Tusks`,
        desc: `Add 1 to charge rolls for friendly MONSTERS while they are within 9" of the bearer.`,
        when: [CHARGE_PHASE],
      },
    ],
  },

  'Rotting Dankhold Spores': {
    effects: [
      {
        name: `Rotting Dankhold Spores`,
        desc: `Once per battle, at the start of your hero phase, the bearer can use this artefact. If they do so, pick 1 enemy unit within 6" of the bearer and roll a number of dice equal to the number of models in that unit. For each 4+, that unit suffers 1 mortal wound.`,
        when: [START_OF_HERO_PHASE],
      },
    ],
  },

  'The Rime Shroud': {
    effects: [
      {
        name: `The Rime Shroud`,
        desc: `Reroll unmodified hit rolls of 6 for attacks made with missile weapons that target the bearer.`,
        when: [SHOOTING_PHASE],
      },
    ],
  },

  'Blade of All-Frost': {
    effects: [
      {
        name: `Blade of All-Frost`,
        desc: `Pick 1 of the bearer's melee weapons. If any wounds inflicted by this weapon are allocated to an enemy HERO or MONSTER model and that model is not slain, subtract 1 from hit and wound rolls for attacks made with melee weapons by that model for the rest of the battle.`,
        when: [COMBAT_PHASE],
      },
    ],
  },

  'Carvalox Flank': {
    effects: [
      {
        name: `Carvalox Flank`,
        desc: `Friendly ICEFALL YHETEE units that are wholly within 12" of the bearer at the start of the movement phase can move an extra 2" when they make a normal move during that phase.`,
        when: [MOVEMENT_PHASE],
      },
    ],
  },

  'Alvagr Rune-tokens': {
    effects: [
      {
        name: `Alvagr Rune-tokens`,
        desc: `Once per battle, at the start of your hero phase, the bearer can use this artefact. If they do so, until the start of your next hero phase, you can reroll hit and wound rolls for attacks made by the bearer and reroll save rolls for attacks that target the bearer.`,
        when: [START_OF_HERO_PHASE],
      },
      {
        name: `Alvagr Rune-tokens`,
        desc: `If active, you can reroll hit and wound rolls for attacks made by the bearer.`,
        when: [COMBAT_PHASE],
      },
      {
        name: `Alvagr Rune-tokens`,
        desc: `If active, you can reroll save rolls for attacks that target the bearer.`,
        when: [SAVES_PHASE],
      },
    ],
  },

  'Skullshards of Dragaar': {
    effects: [
      {
        name: `Skullshards of Dragaar`,
        desc: `Once per battle, the bearer can attempt to unbind 1 spell in the enemy hero phase as if they were a WIZARD. If they do so, that spell is automatically unbound (do not roll 2D6).`,
        when: [HERO_PHASE],
      },
    ],
  },

  'Elixir of Frostwyrm': {
    effects: [
      {
        name: `Elixir of Frostwyrm`,
        desc: `Once per battle, at the start of your shooting phase, the bearer can use this artefact. If they do so, pick 1 enemy unit within 9" of the bearer that is visible to them. That unit suffers D6 mortal wounds. The bearer then suffers D3 mortal wounds.`,
        when: [START_OF_SHOOTING_PHASE],
      },
    ],
  },

  'The Pelt of Charngar': {
    effects: [
      {
        name: `The Pelt of Charngar`,
        desc: `In your hero phase, you can heal up to D3 wounds allocated to the bearer.`,
        when: [HERO_PHASE],
      },
    ],
  },

  'Kattanak Browplate': {
    effects: [
      {
        name: `Kattanak Browplate`,
        desc: `Add 1 to save rolls for attacks that target the bearer.`,
        when: [SAVES_PHASE],
      },
      {
        name: `Kattanak Browplate`,
        desc: `At the start of your first hero phase, you receive 1 additional command point.`,
        when: [TURN_ONE_START_OF_HERO_PHASE],
      },
    ],
  },

  'Frost-talon Shardbolts': {
    effects: [
      {
        name: `Frost-talon Shardbolts`,
        desc: `If the unmodified hit roll for an attack made with the bearer's Hunter's Crossbow is 6, that attack inflicts D3 mortal wounds on the target in addition to any normal damage.`,
        when: [SHOOTING_PHASE],
      },
    ],
  },
}

export default tagAs(Artifacts, 'artifact')

import { TFlavors } from 'types/army'
import {
  CHARGE_PHASE,
  COMBAT_PHASE,
  DURING_GAME,
  END_OF_COMBAT_PHASE,
  HERO_PHASE,
  MOVEMENT_PHASE,
  SAVES_PHASE,
  SHOOTING_PHASE,
  START_OF_COMBAT_PHASE,
  START_OF_HERO_PHASE,
  START_OF_ROUND,
  START_OF_SHOOTING_PHASE,
} from 'types/phases'

const Allegiances: TFlavors = [
  {
    name: `Meatfist (Mawtribe)`,
    effects: [
      {
        name: `Fleshy Stampede`,
        desc: `You can roll 1 additional dice when a MEATFIST unit uses the Trampling Charge battle trait.`,
        when: [CHARGE_PHASE],
        allegiance_ability: true,
      },
      {
        name: `The Unstoppable Feast`,
        desc: `You can use this command ability at the start of the combat phase. If you do so, pick 1 friendly MEATFIST HERO. Until the end of that phase, add 1 to the Attacks characteristic of friendly MEATFIST OGOR GLUTTONS units' Gulping Bite while they are wholly within 18" of that HERO. You cannot pick the same unit to benefit from this command ability more than once per combat phase.`,
        when: [START_OF_COMBAT_PHASE],
        command_ability: true,
      },
      {
        name: `Food for Thought`,
        desc: `At the start of your hero phase, if this general is eating, you gain 1 additional command point.`,
        when: [START_OF_HERO_PHASE],
        command_trait: true,
      },
      {
        name: `Gut-plate of Ghur`,
        desc: `You can reroll save rolls of 1 for attacks that target the bearer.`,
        when: [SAVES_PHASE],
        artifact: true,
      },
    ],
  },
  {
    name: `Bloodgullet (Mawtribe)`,
    effects: [
      {
        name: `Heralds of the Gulping God`,
        desc: `BLOODGULLET BUTCHERS know 1 extra spell from the Lore of Gutmagic. In addition, friendly BLOODGULLET BUTCHERS can attempt to cast 1 extra spell in your hero phase.`,
        when: [HERO_PHASE],
        allegiance_ability: true,
      },
      {
        name: `Bloodbath`,
        desc: `You can use this command ability at the start of the combat phase. If you do so, pick 1 friendly BLOODGULLET BUTCHER. Until the end of that phase, you can reroll wound rolls for attacks made with melee weapons by friendly BLOODGULLET OGOR GLUTTONS units that are wholly within 12" of that BLOODGULLET BUTCHER.`,
        when: [START_OF_COMBAT_PHASE],
        command_ability: true,
      },
      {
        name: `'Nice Drop of the Red Stuff!'`,
        desc: `Friendly units that start a pile-in move wholly within 12" of this general can move an extra 3" when they pile in.`,
        when: [COMBAT_PHASE],
        command_trait: true,
      },
      {
        name: `Splatter-cleaver`,
        desc: `Pick 1 of the bearer's melee weapons. At the end of the combat phase, if any wounds inflicted by that weapon in that phase were allocated to an enemy model and not negated, you can heal D3 wounds allocated to each friendly BLOODGULLET OGOR unit wholly within 12" of the bearer (roll separately for each unit).`,
        when: [END_OF_COMBAT_PHASE],
        artifact: true,
      },
    ],
  },
  {
    name: `Underguts (Mawtribe)`,
    effects: [
      {
        name: `Gunmasters`,
        desc: `Leadbelcher Guns used by UNDERGUTS LEADBELCHERS units have a Range characteristic of 18" instead of 12".`,
        when: [SHOOTING_PHASE],
        allegiance_ability: true,
      },
      {
        name: `Thunderous Salvo`,
        desc: `You can use this command ability at the start of your shooting phase. If you do so, pick 1 friendly UNDERGUTS HERO. Until the end of that phase, add 1 to the Attacks characteristic of missile weapons used by friendly UNDERGUTS IRONBLASTER units wholly within 12" of that UNDERGUTS HERO. You can only use this command ability once per shooting phase.`,
        when: [START_OF_SHOOTING_PHASE],
        command_ability: true,
      },
      {
        name: `Mass of Scars`,
        desc: `Subtract 1 from wound rolls for attacks made with missile weapons that target this general.`,
        when: [SHOOTING_PHASE],
        command_trait: true,
      },
      {
        name: `Gnoblar Blast Keg`,
        desc: `Once per battle, at the start of your shooting phase, you can use the Gnoblar Blast Keg. If you do so, pick 1 enemy unit within 9" of the bearer that is visible to them and roll 6 dice. Add 1 to each roll for every 10 models in the target unit. For each 6+, that enemy unit suffers D3 mortal wounds.`,
        when: [START_OF_SHOOTING_PHASE],
        artifact: true,
      },
    ],
  },
  {
    name: `Boulderhead (Mawtribe)`,
    effects: [
      {
        name: `Fearsome Breed`,
        desc: `Add 1 to the Wounds characteristic of friendly BOULDERHEAD MONSTERS. In addition, each BOULDERHEAD HERO on STONEHORN or THUNDERTUSK, instead of only 1, can be given a mount trait.`,
        when: [DURING_GAME],
        allegiance_ability: true,
      },
      {
        name: `Dig Deep your Heels!`,
        desc: `You can use this command ability at the start of any phase. If you do so, pick 1 friendly BOULDERHEAD HERO that has a mount. Until the end of that phase, use the top row on that unit's damage table, regardless of how many wounds it has suffered.`,
        when: [DURING_GAME],
        command_ability: true,
      },
      {
        name: `Lord of Beasts`,
        desc: `Friendly BOULDERHEAD MONSTERS that are wholly within 12" of this general at the start of the movement phase can move an extra 1" when they make a normal move during that phase.`,
        when: [MOVEMENT_PHASE],
        command_trait: true,
      },
      {
        name: `Brand of the Svard`,
        desc: `If the bearer has a mount, add 1 to hit rolls for attacks made with that mount's melee weapons.`,
        when: [COMBAT_PHASE],
        artifact: true,
      },
    ],
  },
  {
    name: `Thunderbellies (Mawtribe)`,
    effects: [
      {
        name: `Swift Outflank`,
        desc: `Friendly THUNDERBELLIES MOURNFANG PACK units wholly within 12" of the edge of the battlefield at the start of your charge phase can charge in that charge phase even if they ran in the same turn.`,
        when: [CHARGE_PHASE],
        allegiance_ability: true,
      },
      {
        name: `Riders of the Hurricane`,
        desc: `Add 1 to prayer rolls for Keening Gale when a THUNDERBELLIES PRIEST is chanting that prayer.`,
        when: [HERO_PHASE],
        allegiance_ability: true,
      },
      {
        name: `Rip and Tear`,
        desc: `You can use this command ability at the start of the combat phase. If you do so, pick 1 enemy unit with 1 or more wounds allocated to it that is within 6" of a THUNDERBELLIES HERO. Until the end of the phase, you can reroll wound rolls for attacks made by friendly THUNDERBELLIES MOURNFANG PACK units that target that enemy unit.`,
        when: [START_OF_COMBAT_PHASE],
        command_ability: true,
      },
      {
        name: `Storm Chaser`,
        desc: `Add 1 to charge rolls for friendly THUNDERBELLIES units while they are wholly within 18" of this general.`,
        when: [CHARGE_PHASE],
        command_trait: true,
      },
      {
        name: `Shatterstone`,
        desc: `Enemy units treat terrain features within 12" of the bearer as having the Deadly scenery rule in addition to any other scenery rules they may have.`,
        when: [DURING_GAME],
        artifact: true,
      },
    ],
  },
  {
    name: `Winterbite (Mawtribe)`,
    effects: [
      {
        name: `Ghosts in the Blizzard`,
        desc: `Subtract 1 from hit rolls for attacks made with missile weapons that target friendly WINTERBITE units that are wholly within your territory.`,
        when: [SHOOTING_PHASE],
        allegiance_ability: true,
      },
      {
        name: `Call of the Endless White`,
        desc: `Add 1 to prayer rolls for Call of the Blizzard when a WINTERBITE PRIEST is chanting that prayer.`,
        when: [HERO_PHASE],
        allegiance_ability: true,
      },
      {
        name: `Howl of the Wild`,
        desc: `You can use this command ability at the start of the combat phase. If you do so, pick 1 friendly WINTERBITE HERO. Friendly WINTERBITE FROST SABRES units and WINTERBITE ICEFALL YHETEES units wholly within 12" of that WINTERBITE HERO can fight at the start of that combat phase. These units cannot fight again in that combat phase unless an ability or spell allows them to fight more than once.`,
        when: [START_OF_COMBAT_PHASE],
        command_ability: true,
      },
      {
        name: `Wintertouched`,
        desc: `Add 1 to wound rolls for attacks made with melee weapons by friendly WINTERBITE FROST SABRES units and WINTERBITE ICEFALL YHETEES units while they are wholly within 12" of this general.`,
        when: [COMBAT_PHASE],
        command_trait: true,
      },
      {
        name: `Frostfang`,
        desc: `Pick 1 of the bearer's melee weapons. At the start of each battle round, roll a D6. On a 5+, add 1 to the damage inflicted by attacks made with that weapon for the rest of the battle. This effect is cumulative.`,
        when: [START_OF_ROUND],
        artifact: true,
      },
    ],
  },
]

export default Allegiances

import { TItemDescriptions } from 'factions/factionTypes'
import { tagAs } from 'factions/metatagger'
import {
  BATTLESHOCK_PHASE,
  CHARGE_PHASE,
  COMBAT_PHASE,
  DURING_GAME,
  DURING_ROUND,
  DURING_SETUP,
  HERO_PHASE,
  MOVEMENT_PHASE,
  SHOOTING_PHASE,
  START_OF_COMBAT_PHASE,
  START_OF_HERO_PHASE,
  START_OF_SETUP,
  WOUND_ALLOCATION_PHASE,
} from 'types/phases'

const CommandTraits: TItemDescriptions = {
  'Food for Thought': {
    effects: [
      {
        name: `Food for Thought`,
        desc: `At the start of your hero phase, if this general is eating, you gain 1 additional command point.`,
        when: [START_OF_HERO_PHASE],
      },
    ],
  },

  "'Nice Drop of the Red Stuff!'": {
    effects: [
      {
        name: `'Nice Drop of the Red Stuff!'`,
        desc: `Friendly units that start a pile-in move wholly within 12" of this general can move an extra 3" when they pile in.`,
        when: [COMBAT_PHASE],
      },
    ],
  },

  'Mass of Scars': {
    effects: [
      {
        name: `Mass of Scars`,
        desc: `Subtract 1 from wound rolls for attacks made with missile weapons that target this general.`,
        when: [SHOOTING_PHASE],
      },
    ],
  },

  'Lord of Beasts': {
    effects: [
      {
        name: `Lord of Beasts`,
        desc: `Friendly BOULDERHEAD MONSTERS that are wholly within 12" of this general at the start of the movement phase can move an extra 1" when they make a normal move during that phase.`,
        when: [MOVEMENT_PHASE],
      },
    ],
  },
  'Storm Chaser': {
    effects: [
      {
        name: `Storm Chaser`,
        desc: `Add 1 to charge rolls for friendly THUNDERBELLIES units while they are wholly within 18" of this general.`,
        when: [CHARGE_PHASE],
      },
    ],
  },
  Wintertouched: {
    effects: [
      {
        name: `Wintertouched`,
        desc: `Add 1 to wound rolls for attacks made with melee weapons by friendly WINTERBITE FROST SABRES units and WINTERBITE ICEFALL YHETEES units while they are wholly within 12" of this general.`,
        when: [COMBAT_PHASE],
      },
    ],
  },
  'Furious Guzzler': {
    effects: [
      {
        name: `Furious Guzzler`,
        desc: `At the start of your hero phase, if this general is eating, you can heal up to D3 wounds allocated to them.`,
        when: [START_OF_HERO_PHASE],
      },
    ],
  },
  'Prodigious Girth': {
    effects: [
      {
        name: `Prodigious Girth`,
        desc: "Add 2 to this general's Wounds characteristic.",
        when: [DURING_GAME],
      },
    ],
  },
  'Killer Reputation': {
    effects: [
      {
        name: `Killer Reputation`,
        desc: `Before this general is set up for the first time, you can pick a second big name for them. Their second big name cannot be the same as their first big name.`,
        when: [START_OF_SETUP],
      },
    ],
  },
  'Mighty Bellower': {
    effects: [
      {
        name: `Mighty Bellower`,
        desc: `If an enemy unit fails a battleshock test within 6 of this general, add D3 to the number of models that flee.`,
        when: [BATTLESHOCK_PHASE],
      },
    ],
  },
  'An Eye for Loot': {
    effects: [
      {
        name: `An Eye for Loot`,
        desc: `You can reroll hit and wound rolls for attacks made with melee weapons by this general that target an enemy HERO with an artefact of power.`,
        when: [COMBAT_PHASE],
      },
    ],
  },
  'Crushing Bulk': {
    effects: [
      {
        name: `Crushing Bulk`,
        desc: 'This general is treated as a MONSTER for the purposes of the Trampling Charge battle trait.',
        when: [CHARGE_PHASE],
      },
    ],
  },
  'Questionable Hygiene': {
    effects: [
      {
        name: `Questionable Hygiene`,
        desc: `Subtract 1 from hit rolls for attacks made by enemy units while they are within 6" of this general.`,
        when: [SHOOTING_PHASE, COMBAT_PHASE],
      },
    ],
  },
  'Herald of the Gulping God': {
    effects: [
      {
        name: `Herald of the Gulping God`,
        desc: `Friendly units do not take battleshock tests while they are wholly within 15" of this general and this general is eating.`,
        when: [BATTLESHOCK_PHASE],
      },
    ],
  },
  'Growling Stomach': {
    effects: [
      {
        name: `Growling Stomach`,
        desc: `Subtract 2 from the Bravery characteristic of enemy units while they are within 12" of this general and this general is hungry.`,
        when: [BATTLESHOCK_PHASE],
      },
    ],
  },
  Gastromancer: {
    effects: [
      {
        name: `Gastromancer`,
        desc: 'This general knows all spells from the Lore of Gutmagic.',
        when: [HERO_PHASE],
      },
    ],
  },
  'Rolls of Fat': {
    effects: [
      { name: `Rolls of Fat`, desc: `Add 2 to this general's Wounds characteristic.`, when: [DURING_GAME] },
    ],
  },
  'Spell-eater': {
    effects: [
      {
        name: `Spell-eater`,
        desc: `Each time this general dispels an endless spell, you can heal any wounds allocated to them. If this general has no wounds allocated to them, you can instead add 1 to this general's Wounds characteristic until the end of the battle. In addition, each time this general dispels an endless spell, they can cast 1 additional spell in that phase.`,
        when: [HERO_PHASE],
      },
    ],
  },
  'Nomadic Raider': {
    effects: [
      {
        name: `Nomadic Raider`,
        desc: `You can reroll wound rolls for attacks made with melee weapons by this general (including their mount) while this general is wholly within enemy territory.`,
        when: [COMBAT_PHASE],
      },
    ],
  },
  'Voice of the Avalanche': {
    effects: [
      {
        name: `Voice of the Avalanche`,
        desc: `Once per battle round, this general can use a command ability on their warscroll without spending 1 command point.`,
        when: [DURING_ROUND],
      },
    ],
  },
  'Frostfell Aura': {
    effects: [
      {
        name: `Frostfell Aura`,
        desc: 'Enemy units cannot retreat while they are within 3" of this general.',
        when: [MOVEMENT_PHASE],
      },
    ],
  },
  'Master of the Mournfangs': {
    effects: [
      {
        name: `Master of the Mournfangs`,
        desc: `Friendly MOURNFANG PACK units do not take battleshock tests while they are wholly within 18" of this general.`,
        when: [BATTLESHOCK_PHASE],
      },
    ],
  },
  'Skilled Rider': {
    effects: [
      {
        name: `Skilled Rider`,
        desc: `Halve the number of wounds suffered by this general (rounding up) when determining which row on its damage table to use.`,
        when: [SHOOTING_PHASE, COMBAT_PHASE],
      },
    ],
  },
  'Touched by the Everwinter': {
    effects: [
      {
        name: `Touched by the Everwinter`,
        desc: `This general is a PRIEST. If this general is already a PRIEST, they know 1 additional Everwinter prayer.`,
        when: [HERO_PHASE],
      },
    ],
  },
  'Winter Ranger': {
    effects: [
      {
        name: `Winter Ranger`,
        desc: `At the start of each of your hero phases, if this general is in ambush, you gain D3 additional command points.`,
        when: [START_OF_HERO_PHASE],
      },
    ],
  },
  'Eye of the Blizzard': {
    effects: [
      {
        name: `Eye of the Blizzard`,
        desc: 'Subtract 1 from hit rolls for attacks that target this general.',
        when: [COMBAT_PHASE, SHOOTING_PHASE],
      },
    ],
  },
  "Blood Vulture's Gaze": {
    effects: [
      {
        name: "Blood Vulture's Gaze",
        desc: 'Add 1 to hit and wound rolls for attacks made with missile weapons by this general.',
        when: [SHOOTING_PHASE],
      },
    ],
  },
  'Frost Maw': {
    effects: [
      {
        name: `Frost Maw`,
        desc: `When you use this general's Icy Breath ability, you can pick D3 enemy units within 6" of this general instead of 1.`,
        when: [SHOOTING_PHASE],
      },
    ],
  },
  'Raised by Yhetees': {
    effects: [
      {
        name: `Raised by Yhetees`,
        desc: `Add 1 to the Attacks characteristic of melee weapons used by friendly units of ICEFALL YHETEES while they are wholly within 12" of this general.`,
        when: [COMBAT_PHASE],
      },
    ],
  },
  'Skal Packmaster': {
    effects: [
      {
        name: `Skal Packmaster`,
        desc: `When you use this general's Masters Of Ambush ability, up to 2 units of FROST SABRES can join this general in ambush instead of 1.`,
        when: [DURING_SETUP],
      },
    ],
  },
  'Black Clatterhorn': {
    effects: [
      {
        name: `Black Clatterhorn`,
        desc: "Add 1 to hit rolls for attacks made with this model's Rock-hard Horns.",
        when: [COMBAT_PHASE],
      },
    ],
  },
  Metalcruncher: {
    effects: [
      {
        name: `Metalcruncher`,
        desc: `At the start of the combat phase, pick 1 enemy WAR MACHINE, or 1 enemy unit with a Save characteristic of 4+, 3+ or 2+, that is within 3" of this model. That enemy unit immediately suffers D6 mortal wounds.`,
        when: [START_OF_COMBAT_PHASE],
      },
    ],
  },
  'Belligerent Charger': {
    effects: [
      {
        name: `Belligerent Charger`,
        desc: `When determining the number of dice to roll for the Trampling Charge battle trait, treat charge rolls made for this model of less than 7 as 7.`,
        when: [CHARGE_PHASE],
      },
    ],
  },
  'Frosthoof Bull': {
    effects: [
      {
        name: `Frosthoof Bull`,
        desc: "Improve the Rend characteristic of this model's Crushing Hooves by 1.",
        when: [COMBAT_PHASE],
      },
    ],
  },
  'Rockmane Elder': {
    effects: [
      { name: `Rockmane Elder`, desc: `Add 1 to this model's Wounds characteristic.`, when: [DURING_GAME] },
    ],
  },
  'Old Granitetooth': {
    effects: [
      {
        name: `Old Granitetooth`,
        desc: `Add 1 to charge rolls for friendly STONEHORNS and MOURNFANG PACK units while they are wholly within 12" of this model.`,
        when: [CHARGE_PHASE],
      },
    ],
  },
  'Deathcheater (Big Name)': {
    effects: [
      {
        name: `Deathcheater (Big Name)`,
        desc: 'This model has a Wounds characteristic of 9 instead of 8.',
        when: [WOUND_ALLOCATION_PHASE],
      },
    ],
  },
  'Brawlerguts (Big Name)': {
    effects: [
      {
        name: `Brawlerguts (Big Name)`,
        desc: `You can add 1 to wound rolls for attacks made by this model if it made a charge move in the same turn.`,
        when: [COMBAT_PHASE],
      },
    ],
  },
  'Fateseeker (Big Name)': {
    effects: [
      {
        name: `Fateseeker (Big Name)`,
        desc: 'This model has a Save characteristic of 3+ instead of 4+.',
        when: [DURING_GAME],
      },
    ],
  },
  'Longstrider (Big Name)': {
    effects: [
      {
        name: `Longstrider (Big Name)`,
        desc: 'This model has a Move characteristic of 8" instead of 6".',
        when: [MOVEMENT_PHASE],
      },
    ],
  },
  'Giantbreaker (Big Name)': {
    effects: [
      {
        name: `Giantbreaker (Big Name)`,
        desc: `Add 1 to the damage inflicted by this model's weapons when they are used for an attack that targets a MONSTER.`,
        when: [SHOOTING_PHASE, COMBAT_PHASE],
      },
    ],
  },
  'Wallcrusher (Big Name)': {
    effects: [
      {
        name: `Wallcrusher (Big Name)`,
        desc: `You can reroll 1 wound roll for 1 attack made with 1 melee weapon each time this model attacks. In addition, you can reroll wound rolls for attacks made with melee weapons by this model that target a unit that is part of a garrison.`,
        when: [COMBAT_PHASE],
      },
    ],
  },
}

export default tagAs(CommandTraits, 'command_trait')

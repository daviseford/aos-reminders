import {
  BATTLESHOCK_PHASE,
  COMBAT_PHASE,
  DURING_GAME,
  SHOOTING_PHASE,
  START_OF_HERO_PHASE,
} from 'types/phases'
import { TSpells } from 'types/army'

// Blood Blessings of Khorne - Prayers.
const Spells: TSpells = [
  {
    name: `Bronzed Flesh (Blood Blessing)`,
    effects: [
      {
        name: `Bronzed Flesh`,
        desc: `At the start of your hero phase, 1 friendly model that knows this prayer can chant it. If they do so, make a prayer roll by rolling a dice. On a 1, the model chanting this prayer suffers 1 mortal wound and the prayer is not answered. On a 2-3, the prayer is not answered. On a 4+ the prayer is answered. If this prayer is answered, pick 1 friendly KHORNE unit wholly within 16" of the model chanting this prayer and visible to them. Add 1 to save rolls for that unit until the start of your next hero phase.`,
        when: [START_OF_HERO_PHASE],
      },
      {
        name: `Bronzed Flesh`,
        desc: `If active, add 1 to the save rolls of the blessed unit.`,
        when: [DURING_GAME],
      },
    ],
    prayer: true,
  },
  {
    name: `Blood Sacrifice (Blood Blessing)`,
    effects: [
      {
        name: `Blood Sacrifice`,
        desc: `At the start of your hero phase, 1 friendly model that knows this prayer can chant it. If they do so, make a prayer roll by rolling a dice. On a 1, the model chanting this prayer suffers 1 mortal wound and the prayer is not answered. On a 2-3, the prayer is not answered. On a 4+ the prayer is answered. If this prayer is answered, pick a friendly KHORNE unit wholly within 8" of the model chanting this prayer. That unit suffers D3 mortal wounds and you receive 1 Blood Tithe point.`,
        when: [START_OF_HERO_PHASE],
      },
    ],
    prayer: true,
  },
  {
    name: `Resanguination (Blood Blessing)`,
    effects: [
      {
        name: `Resanguination`,
        desc: `At the start of your hero phase, 1 friendly model that knows this prayer can chant it. If they do so, make a prayer roll by rolling a dice. On a 1, the model chanting this prayer suffers 1 mortal wound and the prayer is not answered. On a 2-3, the prayer is not answered. On a 4+ the prayer is answered. If this prayer is answered, pick a friendly KHORNE HERO wholly within 16" of the model chanting this prayer and visible to them. You can heal up to D3 wounds allocated to that unit.`,
        when: [START_OF_HERO_PHASE],
      },
    ],
    prayer: true,
  },
  {
    name: `Brazen Fury (Blood Blessing)`,
    effects: [
      {
        name: `Brazen Fury`,
        desc: `At the start of your hero phase, 1 friendly model that knows this prayer can chant it. If they do so, make a prayer roll by rolling a dice. On a 1, the model chanting this prayer suffers 1 mortal wound and the prayer is not answered. On a 2-3, the prayer is not answered. On a 4+ the prayer is answered. If this prayer is answered, pick a friendly KHORNE unit wholly within 16" of the model chanting this prayer and visible to them. Do not take battleshock tests for that unit until your next hero phase.`,
        when: [START_OF_HERO_PHASE],
      },
      {
        name: `Brazen Fury`,
        desc: `If active, do not take battleshock tests for on the blessed unit.`,
        when: [BATTLESHOCK_PHASE],
      },
    ],
    prayer: true,
  },
  {
    name: `Killing Frenzy (Blood Blessing)`,
    effects: [
      {
        name: `Killing Frenzy`,
        desc: `At the start of your hero phase, 1 friendly model that knows this prayer can chant it. If they do so, make a prayer roll by rolling a dice. On a 1, the model chanting this prayer suffers 1 mortal wound and the prayer is not answered. On a 2-3, the prayer is not answered. On a 4+ the prayer is answered. If this prayer is answered, pick a friendly KHORNE unit wholly within 16" of the model chanting this prayer. Add 1 to hit rolls for attacks made by that unit until your next hero phase.`,
        when: [START_OF_HERO_PHASE],
      },
      {
        name: `Killing Frenzy`,
        desc: `If active, add 1 to the hit rolls for attacks made by that unit until your next hero phase.`,
        when: [SHOOTING_PHASE, COMBAT_PHASE],
      },
    ],
    prayer: true,
  },
  {
    name: `Spellbane Hex (Blood Blessing)`,
    effects: [
      {
        name: `Spellbane Hex`,
        desc: `At the start of your hero phase, 1 friendly model that knows this prayer can chant it. If they do so, make a prayer roll by rolling a dice. On a 1, the model chanting this prayer suffers 1 mortal wound and the prayer is not answered. On a 2-3, the prayer is not answered. On a 4+ the prayer is answered. If this prayer is answered, you can dispel 1 endless spell within 16" of the model chanting this prayer.`,
        when: [START_OF_HERO_PHASE],
      },
    ],
    prayer: true,
  },
]

export default Spells

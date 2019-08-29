import { TArtifacts } from 'types/army'
import {
  BATTLESHOCK_PHASE,
  CHARGE_PHASE,
  COMBAT_PHASE,
  DURING_GAME,
  HERO_PHASE,
  SHOOTING_PHASE,
  START_OF_COMBAT_PHASE,
  START_OF_HERO_PHASE,
} from 'types/phases'

const Artifacts: TArtifacts = [
  {
    name: `Magnetised Runes`,
    effects: [
      {
        name: `Magnetised Runes`,
        desc: `+2 to charge for bearer.`,
        when: [CHARGE_PHASE],
      },
    ],
  },
  {
    name: `Draught of Magmalt Ale`,
    effects: [
      {
        name: `Draught of Magmalt Ale`,
        desc: `Once per battle the bearer can drink. If they do so, double the attacks for all their melee weapons until the end of the phase.`,
        when: [START_OF_COMBAT_PHASE],
      },
    ],
  },
  {
    name: `Drakeslayer`,
    effects: [
      {
        name: `Drakeslayer`,
        desc: `Once per battle instead of this unit throwing a Fyresteel throwing axe, they throw Drakeslayer. If they do so pick an enemy MONSTER within 8" of the bearer and roll a D6. On a 6 that MONSTER suffers 3D6 mortal wounds.`,
        when: [SHOOTING_PHASE],
      },
    ],
  },
  {
    name: `Obsidian Glowhelm`,
    effects: [
      {
        name: `Obsidian Glowhelm`,
        desc: `Roll a D6 if the bearer is on the battlefield. On a 4+ you receive 1 additional command point.`,
        when: [START_OF_HERO_PHASE],
      },
    ],
  },
  {
    name: `Shimmering Blade`,
    effects: [
      {
        name: `Shimmering Blade`,
        desc: `Pick one of the bearer's melee weapons. Improve the weapon's rend by 1. In addition, unmodified hits of 6 gain an additional 1 damage.`,
        when: [COMBAT_PHASE],
      },
    ],
  },
  {
    name: `Axe of Grimnir`,
    effects: [
      {
        name: `Axe of Grimnir`,
        desc: `You can re-roll hit rolls for attacks.`,
        when: [COMBAT_PHASE, SHOOTING_PHASE],
      },
    ],
  },
  {
    name: `Beastslayer`,
    effects: [
      {
        name: `Beastslayer`,
        desc: `Pick one of the bearer's melee weapons. Hits on MONSTERS from that weapon inflict 2 hits instead of 1.`,
        when: [COMBAT_PHASE],
      },
    ],
  },
  {
    name: `Bracers of Ember Iron`,
    effects: [
      {
        name: `Bracers of Ember Iron`,
        desc: `Add 1 to save rolls for attacks that target the bearer.`,
        when: [COMBAT_PHASE, SHOOTING_PHASE],
      },
    ],
  },
  {
    name: `Rune of Blazing Fury`,
    effects: [
      {
        name: `Rune of Blazing Fury`,
        desc: `Once per battle, you can awaken this rune. If you do so re-roll hit and wound rolls made by the bearer until the end of that phase.`,
        when: [START_OF_COMBAT_PHASE],
      },
    ],
  },
  {
    name: `Salamander Cloak`,
    effects: [
      {
        name: `Salamander Cloak`,
        desc: `On a 5+ ignore wounds or mortal wounds allocated to the bearer.`,
        when: [DURING_GAME],
      },
    ],
  },
  {
    name: `Ash-cloud Rune`,
    effects: [
      {
        name: `Ash-cloud Rune`,
        desc: `The bearer can attempt to unbind 2 spells in the same manner as a WIZARD.`,
        when: [HERO_PHASE],
      },
    ],
  },
  {
    name: `Volatile Brazier`,
    effects: [
      {
        name: `Volatile Brazier`,
        desc: `The bearer can attempt to summon 2 magmic invocations in the same turn.`,
        when: [HERO_PHASE],
      },
    ],
  },
  {
    name: `Ancestor Helm`,
    effects: [
      {
        name: `Ancestor Helm`,
        desc: `If an enemy unit fails a battleshock test within 12" of the bearer, add D3 to the number of models that flee.`,
        when: [BATTLESHOCK_PHASE],
      },
    ],
  },
  {
    name: `Emberstone Rune`,
    effects: [
      {
        name: `Emberstone Rune`,
        desc: `Add 1 to invocation rolls made by the bearer.`,
        when: [HERO_PHASE],
      },
    ],
  },
  {
    name: `Droth-helm`,
    effects: [
      {
        name: `Droth-helm`,
        desc: `You can re-roll hit rolls for attacks made with Claws and Horns by friendly MAGMADROTH units within 6" of the bearer.`,
        when: [COMBAT_PHASE],
      },
    ],
  },
  {
    name: `Icon of the Ancestors`,
    effects: [
      {
        name: `Icon of the Ancestors`,
        desc: `The range of this Battlesmith's icon of Grimnir and None Shall Defile the Icon abilities is 18" instead of 12".`,
        when: [DURING_GAME],
      },
    ],
  },
  {
    name: `Icon of Grimnir's Condemnation`,
    effects: [
      {
        name: `Icon of Grimnir's Condemnation`,
        desc: `The bearer can attempt to unbind 1 spell in the same manner as a WIZARD. In addition if the bearer unbinds a spell roll a D6. On a 2+ the caster suffers 1 mortal wound.`,
        when: [HERO_PHASE],
      },
    ],
  },
  {
    name: `The Nulsidian Icon`,
    effects: [
      {
        name: `The Nulsidian Icon`,
        desc: `Each time a friendly FYRESLAYERS unit wholly within 12" of the bearer is affected by a spell or endless spell you can roll a D6. If you do so, on a 4+ ignore the effects of that spell or endless spell on that unit.`,
        when: [HERO_PHASE],
      },
    ],
  },
]

export default Artifacts

import { TArtifacts } from 'types/army'
import {
  CHARGE_PHASE,
  COMBAT_PHASE,
  DURING_GAME,
  HERO_PHASE,
  MOVEMENT_PHASE,
  SHOOTING_PHASE,
  START_OF_COMBAT_PHASE,
  START_OF_HERO_PHASE,
} from 'types/phases'

const Artifacts: TArtifacts = [
  {
    name: `Daith's Reaper`,
    effects: [
      {
        name: `Daith's Reaper`,
        desc: `Improve the Rend characteristic of a weapon by 1.`,
        when: [DURING_GAME],
      },
    ],
  },
  {
    name: `Greenwood Gladius`,
    effects: [
      {
        name: `Greenwood Gladius`,
        desc: `One weapon gains; Add 2 to the Attacks characteristic of this weapon if the bearer made a charge move in the same turn.`,
        when: [DURING_GAME],
      },
    ],
  },
  {
    name: `Autumn's Ire`,
    effects: [
      {
        name: `Autumn's Ire`,
        desc: `One weapon gains; You can re-roll hit and wound rolls of 1 for attacks made with this weapon while any wounds are allocated to the bearer.`,
        when: [DURING_GAME],
      },
    ],
  },
  {
    name: `Winnowstaff`,
    effects: [
      {
        name: `Winnowstaff`,
        desc: `One weapon gains; You can re-roll hit rolls for attacks made with this weapon that target a unit with a Wounds characteristic of 1.`,
        when: [DURING_GAME],
      },
    ],
  },
  {
    name: `Ancient Barkblade`,
    effects: [
      {
        name: `Ancient Barkblade`,
        desc: `Add 1 to the Damage characteristic of a weapon.`,
        when: [DURING_GAME],
      },
    ],
  },
  {
    name: `The Darkest Bough`,
    effects: [
      {
        name: `The Darkest Bough`,
        desc: `One weapon gains; If the unmodified wound roll for an attack made with this weapon is 6, that attack inflicts D3 mortal wounds on the target in addition to any normal damage.`,
        when: [DURING_GAME],
      },
    ],
  },
  {
    name: `The Oaken Armour`,
    effects: [
      {
        name: `The Oaken Armour`,
        desc: `You can re-roll save rolls of 1 made for attacks that target the bearer.`,
        when: [SHOOTING_PHASE, COMBAT_PHASE],
      },
    ],
  },
  {
    name: `Briar Sheath`,
    effects: [
      {
        name: `Briar Sheath`,
        desc: `Subtract 1 from hit rolls for attacks that target the bearer.`,
        when: [SHOOTING_PHASE, COMBAT_PHASE],
      },
    ],
  },
  {
    name: `Glamourweave`,
    effects: [
      {
        name: `Glamourweave`,
        desc: `Roll a D6 each time you allocate a mortal wound to the bearer. On a 5+ that mortal wound is negated.`,
        when: [DURING_GAME],
      },
    ],
  },
  {
    name: `Lashvines`,
    effects: [
      {
        name: `Lashvines`,
        desc: `Roll a D6 each time a wound inflicted by a melee weapon is allocated to the bearer and not negated. On a 6+ the attacking unit suffers 1 mortal wound.`,
        when: [COMBAT_PHASE],
      },
    ],
  },
  {
    name: `Silken Snares`,
    effects: [
      {
        name: `Silken Snares`,
        desc: `If the weapon used for an attack that targets the bearer has a Rend characteristic of -1, change the Rend characteristic for that attack to '-'`,
        when: [SHOOTING_PHASE, COMBAT_PHASE],
      },
    ],
  },
  {
    name: `Nightbloom Garland`,
    effects: [
      {
        name: `Nightbloom Garland`,
        desc: `The bearer is not visible to enemy models that are more than 12" from the bearer.`,
        when: [DURING_GAME],
      },
    ],
  },
  {
    name: `Seed of Rebirth`,
    effects: [
      {
        name: `Seed of Rebirth`,
        desc: `The first time the bearer is slain, before removing them from the battlefield, roll a D6. On a 1, the bearer is slain. On a 2+ the bearer is not slain, you can heal up to D3 wounds allocated to them, and any wounds that remain to be allocated to them are negated.`,
        when: [DURING_GAME],
      },
    ],
  },
  {
    name: `Wraithstone`,
    effects: [
      {
        name: `Wraithstone`,
        desc: `Subtract 1 from the Bravery characteristic of enemy units while they are within 10" of the bearer.`,
        when: [DURING_GAME],
      },
    ],
  },
  {
    name: `Everdew Vial`,
    effects: [
      {
        name: `Everdew Vial`,
        desc: `Add 2 to run rolls and charge rolls for the bearer.`,
        when: [MOVEMENT_PHASE, CHARGE_PHASE],
      },
    ],
  },
  {
    name: `Lifewreath`,
    effects: [
      {
        name: `Lifewreath`,
        desc: `In your hero phase, roll a D6. On a 3+ you can heal D3 wounds allocated to each friendly SYLVANETH unit wholly within 10" of the bearer.`,
        when: [HERO_PHASE],
      },
    ],
  },
  {
    name: `Crown of Fell Bowers`,
    effects: [
      {
        name: `Crown of Fell Bowers`,
        desc: `At the start of the combat phase, pick 1 enemy unit within 6" of the bearer. You can re-roll wound rolls for attacks made by friendly SYLVANETH units that target that unit in that phase.`,
        when: [START_OF_COMBAT_PHASE],
      },
    ],
  },
  {
    name: `Etherblossom`,
    effects: [
      {
        name: `Etherblossom`,
        desc: `The bearer can fly.`,
        when: [DURING_GAME],
      },
    ],
  },
  {
    name: `Acorn of the Ages`,
    effects: [
      {
        name: `Acorn of the Ages`,
        desc: `Once per battle, at the start of your hero phase, you can set up an AWAKENED WYLDWOODwholly within 12" of the bearer and more than 1" from any other model, terrain feature or objective, and add it to your army.`,
        when: [START_OF_HERO_PHASE],
      },
    ],
  },
  {
    name: `Spiritsong Stave`,
    effects: [
      {
        name: `Spiritsong Stave`,
        desc: `The bearer can attempt to cast 1 extra spell in your hero phase.`,
        when: [HERO_PHASE],
      },
    ],
  },
  {
    name: `The Vesperal Gem`,
    effects: [
      {
        name: `The Vesperal Gem`,
        desc: `Once in each of your hero phases, when the bearer attempts to cast a spell from the Lore of the Deepwood, instead of making a casting roll you can say they are using the Vesperal Gem. If you do so, that spell is automatically cast (do not roll 2D6) and cannot be unbound. After the effect of that spell has been resolved, roll a D6. On a 1, the bearer suffers D3 mortal wounds.`,
        when: [HERO_PHASE],
      },
    ],
  },
  {
    name: `Luneth's Lamp`,
    effects: [
      {
        name: `Luneth's Lamp`,
        desc: `Add 2 to the roll when the bearer attempts to unbind or dispel an endless spell.`,
        when: [HERO_PHASE],
      },
    ],
  },
  {
    name: `Hagbane Spite`,
    effects: [
      {
        name: `Hagbane Spite`,
        desc: `If the bearer successfully unbinds a spell, the caster suffers 1 mortal wound.`,
        when: [HERO_PHASE],
      },
    ],
  },
  {
    name: `Wychwood Glaive`,
    effects: [
      {
        name: `Wychwood Glaive`,
        desc: `One weapon gains; Add 2 to the damage inflicted by this weapon for attacks that target a WIZARD.`,
        when: [DURING_GAME],
      },
    ],
  },
]

export default Artifacts

import { tagAs } from 'factions/metatagger'
import { HERO_PHASE, START_OF_COMBAT_PHASE, START_OF_HERO_PHASE, WOUND_ALLOCATION_PHASE } from 'types/phases'

const Artifacts = {
  'Greenwood Gladius': {
    effects: [
      {
        name: `Greenwood Gladius`,
        desc: `One melee weapon gains; At start of combat phase add D3 to the Attacks characteristic of this weapon until the end of that phase.`,
        when: [START_OF_COMBAT_PHASE],
      },
    ],
  },
  'Seed of Rebirth': {
    effects: [
      {
        name: `Seed of Rebirth`,
        desc: `The first time the bearer is slain, before removing them from the battlefield, roll a D6. On a 1, the bearer is slain. On a 2+ the bearer is not slain, you can heal up to D3 wounds allocated to them, and any wounds that remain to be allocated to them are negated.`,
        when: [WOUND_ALLOCATION_PHASE],
      },
    ],
  },
  'Crown of Fell Bowers': {
    effects: [
      {
        name: `Crown of Fell Bowers`,
        desc: `At the start of the combat phase, pick 1 enemy unit within 6" of the bearer. Add 1 to wound rolls for attacks made by friendly SYLVANETH units that target that unit in that phase.`,
        when: [START_OF_COMBAT_PHASE],
      },
    ],
  },
  'Acorn of the Ages': {
    effects: [
      {
        name: `Acorn of the Ages`,
        desc: `Once per battle, if the bearer is on the battlefield, you can set up 1 AWAKENED WYLDWOOD wholly within 12" of the bearer and more than 3" from other models, endless spells, invocations, terrain features and objectives, and add it to your army.`,
        when: [START_OF_HERO_PHASE],
      },
    ],
  },
  'The Vesperal Gem': {
    effects: [
      {
        name: `The Vesperal Gem`,
        desc: `Once in each of your hero phases, when the bearer attempts to cast a spell from the Lore of the Deepwood, instead of making a casting roll you can say they are using the Vesperal Gem. If you do so, that spell is automatically cast (do not roll 2D6) and cannot be unbound. After the effect of that spell has been resolved, roll a D6. On a 1, the bearer suffers D3 mortal wounds.`,
        when: [HERO_PHASE],
      },
    ],
  },
  "Luneth's Lamp": {
    effects: [
      {
        name: `Luneth's Lamp`,
        desc: `The bearer can attempt to banish 1 invocation in the hero phase even if they are not a PRIEST. In addition, add 2 to dispelling rolls and banishment rolls for the bearer.`,
        when: [HERO_PHASE],
      },
    ],
  },
}

export default tagAs(Artifacts, 'artifact')

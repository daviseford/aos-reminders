import { tagAs } from 'factions/metatagger'
import { COMBAT_PHASE, HERO_PHASE, MOVEMENT_PHASE, WOUND_ALLOCATION_PHASE } from 'types/phases'

const DestructionArtifacts = {
  'Hammerblade (Destruction)': {
    effects: [
      {
        name: `Hammerblade (Destruction)`,
        desc: `Pick one of the bearer's melee weapons. Instead of attacking normally with that weapon, you can roll a D6 for each model within 3" of the bearer (apart from the bearer). On 5 or 6, 1 mortal wound is inflicted on that model's unit.`,
        when: [COMBAT_PHASE],
      },
    ],
  },
  'Battered Talisman (Destruction)': {
    effects: [
      {
        name: `Battered Talisman (Destruction)`,
        desc: `Roll a D6 each time you allocate a mortal wound to the bearer. On a 5+, the mortal wound is negated.`,
        when: [WOUND_ALLOCATION_PHASE],
      },
    ],
  },
  'Rockeye (Destruction)': {
    effects: [
      {
        name: `Rockeye (Destruction)`,
        desc: `In your hero phase, pick an enemy unit within 12" of the bearer. Until your next hero phase, add 1 to hit rolls made for the bearer when they target the unit you picked.`,
        when: [HERO_PHASE],
      },
    ],
  },
  'Bellowing Blade (Destruction)': {
    effects: [
      {
        name: `Bellowing Blade (Destruction)`,
        desc: `When the bearer is picked to fight, you can reroll one wound roll for the bearer's attack in that fight for each enemy HERO that was within 12" of the bearer when they were picked to fight.`,
        when: [COMBAT_PHASE],
      },
    ],
  },
  'Collar of Domination (Destruction)': {
    effects: [
      {
        name: `Collar of Domination (Destruction)`,
        desc: `At the start of your opponent's movement phase, pick an enemy MONSTER within 3" of the bearer and roll 2D6. If the roll is equal or greater than enemy monsterbs Bravery characteristic, it must retreat in that movement phase.`,
        when: [MOVEMENT_PHASE],
      },
    ],
  },
  'Battle Brew (Destruction)': {
    effects: [
      {
        name: `Battle Brew (Destruction)`,
        desc: `Once per battle, in your hero phase, you can declare that the bearer will take either one or two swigs of Battle Brew. If the bearer takes one swig, add 1 to hit and wound rolls made for the bearer until your next hero phase. If the bearer takes two swigs, add 2 to hit and wound rolls made for the bearer until your next hero phase, but you must allocate D6 mortal wounds to the bearer at the end of the turn in which they drank the brew.`,
        when: [HERO_PHASE],
      },
    ],
  },
}

export default tagAs(DestructionArtifacts, 'artifact')

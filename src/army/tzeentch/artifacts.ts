import { TArtifacts } from 'types/army'
import {
  COMBAT_PHASE,
  DURING_GAME,
  END_OF_COMBAT_PHASE,
  HERO_PHASE,
  SAVES_PHASE,
  SHOOTING_PHASE,
  START_OF_COMBAT_PHASE,
  START_OF_HERO_PHASE,
} from 'types/phases'

const Artifacts: TArtifacts = [
  {
    name: `Ambition's End`,
    effects: [
      {
        name: `Ambition's End`,
        desc: `Once per battle, at the start of your hero phase, you can pick 1 enemy wizard within 1" of the bearer. That wizard suffers D3 mortal wounds. In addition, that wizard cannot attempt to unbind any spells until your next hero phase.`,
        when: [START_OF_HERO_PHASE],
      },
    ],
  },
  {
    name: `Secret-eater`,
    effects: [
      {
        name: `Secret-eater`,
        desc: `Pick 1 of the bearer's weapons. If the unmodified hit roll for an attack made with that weapon is 6, you can roll a D6 and add it to your Destiny Dice.`,
        when: [COMBAT_PHASE, SHOOTING_PHASE],
      },
    ],
  },
  {
    name: `Spiteful Shield`,
    effects: [
      {
        name: `Spiteful Shield`,
        desc: `If the unmodified save roll for an attack made with a melee weapon that targets the bearer is 6, the attacking unit suffers 2 mortal wounds afer all of its attacks have been resolved.`,
        when: [SAVES_PHASE],
      },
    ],
  },
  {
    name: `Wicked Shard`,
    effects: [
      {
        name: `Wicked Shard`,
        desc: `Pick 1 of the bearer's melee weapons. You can reroll wound rolls for attacks made with that weapon.`,
        when: [COMBAT_PHASE],
      },
    ],
  },
  {
    name: `Changeblade`,
    effects: [
      {
        name: `Changeblade`,
        desc: `Pick 1 of the bearer's melee weapons. Each time an enemy Hero is slain by attacks made with that weapon, after all of the bearer's attacks have been resolved and before removing the slain model, you can add 1 Tzeentch Chaos Spawn to your army. Set up the Tzeentch chaos spawn within 1" of the slain Hero.`,
        when: [COMBAT_PHASE],
      },
    ],
  },
  {
    name: `Nexus Staff`,
    effects: [
      {
        name: `Nexus Staff`,
        desc: `Once per battle, in your hero phase, you can pick 1 endless spell within 9" of the bearer. If you do so, that endless spell is dispelled.`,
        when: [HERO_PHASE],
      },
    ],
  },
  {
    name: `Timeslip Pendant`,
    effects: [
      {
        name: `Timeslip Pendant`,
        desc: `Once per battle, at the end of the combat phase, you can say that the bearer will enter a timeslip. If you do so, the bearer can fight for a second time.`,
        when: [END_OF_COMBAT_PHASE],
      },
    ],
  },
  {
    name: `Daemonheart`,
    effects: [
      {
        name: `Daemonheart`,
        desc: `Once per battle, at the start of the combat phase, before the players pick any units to fight, you can say the bearer will unlease the power of their Daemonheart. If you do so, pick 1 enemy unit within 1" of the bearer. That unit suffers 3 mortal wounds.`,
        when: [START_OF_COMBAT_PHASE],
      },
    ],
  },
  {
    name: `Paradoxical Shield`,
    effects: [
      {
        name: `Paradoxical Shield`,
        desc: `Add 2 to the save rolls for attacks that target the bearer. However, you must reroll any successful save rolls made for the bearer.`,
        when: [SAVES_PHASE],
      },
    ],
  },
  {
    name: `Warpfire Blade`,
    effects: [
      {
        name: `Warpfire Blade`,
        desc: `Pick 1 of the bearer's melee weapons. If the unmodified hit roll for an attack made with that weapon is 6, that attack inflicts 2 mortal wounds on the target in addition to any normal damage.`,
        when: [COMBAT_PHASE],
      },
    ],
  },
  {
    name: `Sentient Weapons`,
    effects: [
      {
        name: `Sentient Weapons`,
        desc: `If the unmodified hit roll for an attack made with a melee weapon by the bearer is 6, and the target bears an artefact of power, the target no longer bears that artefact of power.`,
        when: [COMBAT_PHASE],
      },
    ],
  },
  {
    name: `Blade of Fate`,
    effects: [
      {
        name: `Blade of Fate`,
        desc: `Pick 1 of the bearer's melee weapons. Once per battle, if the unmodified hit roll for an attack made with that weapon is 6, you can replace one of your Destiny Dice with that roll.`,
        when: [COMBAT_PHASE],
      },
    ],
  },
  {
    name: `Souleater`,
    effects: [
      {
        name: `Souleater`,
        desc: `Pick 1 of the bearer's melee weapons. If any enemy Heroes are slain by attacks made with that weapon, after all of the bearer's attacks have been resolved, add 1 to that weapon's Attacks characteristic for the rest of the battle.`,
        when: [COMBAT_PHASE],
      },
    ],
  },
  {
    name: `Phantasmal Weapons`,
    effects: [
      {
        name: `Phantasmal Weapons`,
        desc: `Improve the Rend characteristic of the bearer's melee weapons by 1.`,
        when: [COMBAT_PHASE],
      },
    ],
  },
  {
    name: `Pyrofyre Stave`,
    effects: [
      {
        name: `Pyrofyre Stave`,
        desc: `Pick 1 of the bearer's melee weapons. If any wounds inflicted by that weapon are allocated to an enemy Wizard and that model is not slain, that Wizard cannot unbind spells for the rest of the battle.`,
        when: [COMBAT_PHASE],
      },
    ],
  },
  {
    name: `Aura of Mutability`,
    effects: [
      {
        name: `Aura of Mutability`,
        desc: `Add 1 to wound rolls for attacks made by friendly Tzeentch Daemon units that are wholly within 9" of the bearer.`,
        when: [COMBAT_PHASE, SHOOTING_PHASE],
      },
    ],
  },
  {
    name: `Wellspring of Arcane Might`,
    effects: [
      {
        name: `Wellspring of Arcane Might`,
        desc: `You can reroll casting and unbinding rolls for the bearer.`,
        when: [HERO_PHASE],
      },
    ],
  },
  {
    name: `Aspect of Tzeentch`,
    effects: [
      {
        name: `Aspect of Tzeentch`,
        desc: `If the bearer is on the battlefield, roll a D6 each time you spend a Destiny Dice. On a 5+, you can roll a D6 and add it to your Destiny Dice.`,
        when: [DURING_GAME],
      },
    ],
  },
]

export default Artifacts

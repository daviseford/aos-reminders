import { TCommandTraits } from 'types/army'
import {
  CHARGE_PHASE,
  COMBAT_PHASE,
  DURING_GAME,
  END_OF_COMBAT_PHASE,
  HERO_PHASE,
  SAVES_PHASE,
  SHOOTING_PHASE,
  START_OF_SETUP,
  TURN_ONE_START_OF_ROUND,
  WOUND_ALLOCATION_PHASE,
} from 'types/phases'
import CommonSonsOfBehematData from './common'

const { TakerTag, StomperTag, BreakerTag } = CommonSonsOfBehematData.TRIBES
const { FierceLoathingTag } = CommonSonsOfBehematData.TAGS

const getLouderThanWordsEffect = (numAttacks: number, weaponName: string, tag: string) => ({
  name: `Louder than Words ${tag}`,
  effects: [
    {
      name: `Louder than Words ${tag}`,
      desc: `Add ${numAttacks} to the Attacks characteristic of this general's ${weaponName}.`,
      when: [COMBAT_PHASE],
    },
  ],
})

const CommandTraits: TCommandTraits = [
  // Shared Traits
  {
    name: `Monstrously Tough`,
    effects: [
      {
        name: `Monstrously Tough`,
        desc: `This general has a Wounds characteristic of 40 instead of 35.`,
        when: [WOUND_ALLOCATION_PHASE],
      },
    ],
  },
  {
    name: `Old and Gnarly`,
    effects: [
      {
        name: `Old and Gnarly`,
        desc: `You can reroll save rolls of 1 for attacks that target this general.`,
        when: [SAVES_PHASE],
      },
    ],
  },
  // Taker Tribe
  getLouderThanWordsEffect(1, 'Shipwrecka Warclub', TakerTag),
  {
    name: `Strong Right Foot ${TakerTag}`,
    effects: [
      {
        name: `Strong Right Foot ${TakerTag}`,
        desc: `When you use this general's Get Orf Me Land! ability to kick an objective marker away, you can roll 3D6 instead of 2D6 to determine how far it is kicked.`,
        when: [HERO_PHASE],
      },
    ],
  },
  {
    name: `Very Acquisitive ${TakerTag}`,
    effects: [
      {
        name: `Very Acquisitive ${TakerTag}`,
        desc: `You can take 1 extra Trophies Taken By Force artefact of power for this general's army. In addition, this general can have up to 2 artefacts of power instead of 1.`,
        when: [START_OF_SETUP],
      },
    ],
  },
  {
    name: `Extremely Intimidating ${TakerTag}`,
    effects: [
      {
        name: `Extremely Intimidating ${TakerTag}`,
        desc: `Subtract 1 from hit rolls for enemy models that are within 3" of this general.`,
        when: [SHOOTING_PHASE, COMBAT_PHASE],
      },
    ],
  },
  // Stomper Tribe
  getLouderThanWordsEffect(1, 'Titanic Boulderclub (to a maximum of 10)', StomperTag),
  {
    name: `Inescapable Grip ${StomperTag}`,
    effects: [
      {
        name: `Inescapable Grip ${StomperTag}`,
        desc: `When you use this general's Hurled Body ability, you can reroll the dice that determines if the target is slain and thrown.`,
        when: [SHOOTING_PHASE],
      },
    ],
  },
  {
    name: `Very Shouty ${StomperTag}`,
    effects: [
      {
        name: `Very Shouty ${StomperTag}`,
        desc: `If this general is on the battlefield at the start of the first battle round, you receive D3 extra command points.`,
        when: [TURN_ONE_START_OF_ROUND],
      },
    ],
  },
  {
    name: `Eager for the Fight ${StomperTag}`,
    effects: [
      {
        name: `Eager for the Fight ${StomperTag}`,
        desc: `You can attempt to charge with this general if it is within 18" of the enemy instead of 12". Roll 3D6 instead of 2D6 when making a charge roll for this general.`,
        when: [CHARGE_PHASE],
      },
    ],
  },
  // Breaker Tribe

  {
    name: `Bossy Pants and Clever Clogs ${FierceLoathingTag}`,
    effects: [
      {
        name: `Bossy Pants and Clever Clogs ${FierceLoathingTag}`,
        desc: `Add 1 to hit rolls for attacks made by units with this ability that target a HERO or WIZARD.`,
        when: [SHOOTING_PHASE, COMBAT_PHASE],
        command_trait: true,
      },
    ],
  },
  {
    name: `Idiots with Flags ${FierceLoathingTag}`,
    effects: [
      {
        name: `Idiots with Flags ${FierceLoathingTag}`,
        desc: `Add 1 to hit rolls for attacks made by units with this ability that target a TOTEM or a unit with any command models.`,
        when: [SHOOTING_PHASE, COMBAT_PHASE],
        command_trait: true,
      },
    ],
  },
  {
    name: `Shiny 'Uns ${FierceLoathingTag}`,
    effects: [
      {
        name: `Shiny 'Uns ${FierceLoathingTag}`,
        desc: `Add 1 to hit rolls for attacks made by units with this ability that target a unit with a Save characteristic of 1+, 2+, 3+ or 4+ and that is not a HERO or MONSTER.`,
        when: [SHOOTING_PHASE, COMBAT_PHASE],
        command_trait: true,
      },
    ],
  },
  {
    name: `Crowds ${FierceLoathingTag}`,
    effects: [
      {
        name: `Crowds ${FierceLoathingTag}`,
        desc: `Add 1 to hit rolls for attacks made by units with this ability that target a unit with 20 or more models.`,
        when: [SHOOTING_PHASE, COMBAT_PHASE],
        command_trait: true,
      },
    ],
  },
  {
    name: `Wannabes ${FierceLoathingTag}`,
    effects: [
      {
        name: `Wannabes ${FierceLoathingTag}`,
        desc: `Add 1 to hit rolls for attacks made by units with this ability that target a WAR MACHINE or MONSTER.`,
        when: [SHOOTING_PHASE, COMBAT_PHASE],
        command_trait: true,
      },
    ],
  },
  {
    name: `Piggybackers ${FierceLoathingTag}`,
    effects: [
      {
        name: `Piggybackers ${FierceLoathingTag}`,
        desc: `Add 1 to hit rolls for attacks made by units with this ability that target a unit with a mount and that is not a MONSTER.`,
        when: [SHOOTING_PHASE, COMBAT_PHASE],
        command_trait: true,
      },
    ],
  },
  getLouderThanWordsEffect(2, 'Fortcrusha Flail', BreakerTag),
  {
    name: `Extremely Bitter ${BreakerTag}`,
    effects: [
      {
        name: `Extremely Bitter ${BreakerTag}`,
        desc: `You can choose or roll for 2 abilities from the Fierce Loathings table for your army instead of 1. If you randomly generate the second, roll again if it is the same as the first. The second ability only applies to the general.`,
        when: [START_OF_SETUP],
      },
    ],
  },
  {
    name: `Smasher ${BreakerTag}`,
    effects: [
      {
        name: `Smasher ${BreakerTag}`,
        desc: `When you use this general's Smash Down ability, you can reroll the dice roll that determines if the terrain feature is turned into rubble.`,
        when: [END_OF_COMBAT_PHASE],
      },
    ],
  },
  {
    name: `Sees Red ${BreakerTag}`,
    effects: [
      {
        name: `Sees Red ${BreakerTag}`,
        desc: `While this general is within 9" of a terrain feature that can have a garrison, when you look up a value on this general's damage table, they are treated as if they have suffered 0 wounds.`,
        when: [DURING_GAME],
      },
    ],
  },
]

export default CommandTraits

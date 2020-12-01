import { TFlavors } from 'types/army'
import {
  BATTLESHOCK_PHASE,
  CHARGE_PHASE,
  COMBAT_PHASE,
  DURING_GAME,
  END_OF_COMBAT_PHASE,
  HERO_PHASE,
  SHOOTING_PHASE,
  START_OF_GAME,
  START_OF_HERO_PHASE,
} from 'types/phases'

const Allegiances: TFlavors = [
  {
    name: `Hagg Nar (Temple)`,
    effects: [
      {
        name: `Devoted Disciples`,
        desc: `Whenever you make a Fanatical Faith roll for friendly Hagg Nar units within 7" of this general, the wound is negated on a 5+ instead of 6".`,
        when: [DURING_GAME],
        command_trait: true,
      },
      {
        name: `Daughters of the First Temple`,
        desc: `Whilst a Hagg Nar unit is benefiting from Zealot's Rage (Blood Rite), you can reroll all failed hit rolls instead of hit rolls of 1.`,
        when: [HERO_PHASE],
      },
      {
        name: `Cauldron Guard`,
        desc: `A Hagg Nar Cauldron Guard battalion can also include 1 Avatar of Khaine or an additional Cauldron of Blood.`,
        when: [START_OF_GAME],
      },
    ],
  },
  {
    name: `Draichi Ganeth (Temple)`,
    effects: [
      {
        name: `The Darksword`,
        desc: `This Slaughter Queen's Deathsword has an attacks characteristic of 4.`,
        when: [COMBAT_PHASE],
        artifact: true,
      },
      {
        name: `Bladed Killers`,
        desc: `Add 1 to the hit rolls for Draichi Ganeth units in the combat phase if they charged in the same turn.`,
        when: [CHARGE_PHASE, COMBAT_PHASE],
      },
      {
        name: `Slaughter Troupe`,
        desc: `A Draichi Ganeth Slaughter Troupe battalion can also include up to 2 units of Witch Aelves.`,
        when: [START_OF_GAME],
      },
    ],
  },
  {
    name: `The Kraith (Temple)`,
    effects: [
      {
        name: `Venom of Nagendra`,
        desc: `Once per battle, just before this hero is selected to fight in the combat phase, she can choose to use this item. Choose one of hero melee weapons and that weapons attacks characteristic is 1 for the remainder of the phase. If it hits, that target suffers D6 mortal wounds instead of normal damage.`,
        when: [COMBAT_PHASE],
        artifact: true,
      },
      {
        name: `Disciples of Slaughter`,
        desc: `Roll a D6 after a Kraith unit has fought if there are any enemy units within 3" of it. On a 6, you can pile in and attack with that unit for a second time.`,
        when: [COMBAT_PHASE],
      },
      {
        name: `Cauldron Guard`,
        desc: `A Kraith Cauldron Guard battalion can include any number of additional Hag Queens. It can also include any number of additional Slaughter Queens.`,
        when: [START_OF_GAME],
      },
    ],
  },
  {
    name: `Khailebron (Temple)`,
    effects: [
      {
        name: `Mistress of Illusion`,
        desc: `You can pick one friendly Khailebron unit within 7" of this general. If that unit is more than 3" from any enemy models, remove it from the battlefield and then set it up anywhere on the battlefield more than 9" from any enemy models. This unit cannot move in your next movement phase.`,
        when: [START_OF_HERO_PHASE],
        command_trait: true,
      },
      {
        name: `Concealment and Stealth`,
        desc: `Subtract 1 from hit rolls that target Khailebron units in this phase.`,
        when: [SHOOTING_PHASE],
      },
      {
        name: `Temple Nest`,
        desc: `A Khailebron Temple Nest battalion can include up to 2 additional Melusai units.`,
        when: [START_OF_GAME],
      },
    ],
  },
  {
    name: `Zainthar Kai (Temple)`,
    effects: [
      {
        name: `Khaine's Essence`,
        desc: `Add 1 to the bravery characteristic of Zainthar Kai Melusai and Khinerai Harpies units.`,
        when: [DURING_GAME, BATTLESHOCK_PHASE],
      },
      {
        name: `Power in the Blood`,
        desc: `Once per phase, you can use this ability when you select a friendly Zainthar Kai Melusai or Khinerai Harpies unit to fight wholly within 12" of a Zainthar Kai hero. Add 1 to the attacks characteristic of melee weapons used by the target.`,
        when: [COMBAT_PHASE],
        command_ability: true,
      },
      {
        name: `Curse of the Bloody-Handed`,
        desc: `Roll a dice for each enemy unit within 3" of the general. On a 5+ that unit suffers D3 mortal wounds.`,
        when: [END_OF_COMBAT_PHASE],
      },
    ],
  },
]

export default Allegiances

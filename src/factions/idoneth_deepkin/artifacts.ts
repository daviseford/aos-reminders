import { TItemDescriptions } from 'factions/factionTypes'
import { tagAs } from 'factions/metatagger'
import {
  COMBAT_PHASE,
  HERO_PHASE,
  MOVEMENT_PHASE,
  SHOOTING_PHASE,
  START_OF_COMBAT_PHASE,
  START_OF_HERO_PHASE,
  TURN_ONE_END_OF_MOVEMENT_PHASE,
} from 'types/phases'

const Artifacts = {
  // Faction artifacts
  'Disharmony Stones': {
    effects: [
      {
        name: `Disharmony Stones`,
        desc: `Once per battle, at the start of your hero phase, pick up to 2 enemy HEROES within 12" of the bearer. Your opponent must then choose 1 of the following options:

        a) Roll a dice for each HERO you picked. On a 3+, that HERO suffers 1 mortal wound.

        b) Roll a dice for each HERO you picked. On a 5+, that HERO suffers D3 mortal wounds.

        c) Each HERO you picked suffers D3 mortal wounds. Then, roll a dice. On a 4+, the bearer suffers D3 mortal wounds.`,
        when: [START_OF_HERO_PHASE],
      },
    ],
  },
  'Sanguine Pearl': {
    effects: [
      {
        name: `Sanguine Pearl`,
        desc: `Roll a D6 each time you allocate a wound or mortal wound to the bearer that was caused by a melee weapon. On a 5+ the wound is negated.`,
        when: [COMBAT_PHASE],
      },
    ],
  },
  'Potion of Hateful Frenzy': {
    effects: [
      {
        name: `Potion of Hateful Frenzy`,
        desc: `Once per battle, at the start of your hero phase, you can say the bearer will drink this potion. If you do so, until the end of that turn, add 1 to hit rolls and wound rolls for attacks made by the bearer, add 1 to the Attacks characteristic of the bearer's melee weapons and add 1 to run rolls and charge rolls for the bearer. However, at the start of the next hero phase, the bearer suffers D3 mortal wounds and cannot pile-in until the end of that turn.`,
        when: [START_OF_HERO_PHASE],
      },
    ],
  },
  'Ankusha Spur': {
    effects: [
      {
        name: `Ankusha Spur`,
        desc: `Add 3" to the bearer's Move characteristic.`,
        when: [MOVEMENT_PHASE],
      },
      {
        name: `Ankusha Spur`,
        desc: `Reroll wound rolls of 1 for attacks made by the bearer's mount.`,
        when: [COMBAT_PHASE],
      },
    ],
  },
  'Armour of the Cythai': {
    effects: [
      {
        name: `Armour of the Cythai`,
        desc: `If the unmodified hit roll for an attack that targets the bearer is 6, all effects that would be triggered by that roll are ignored.`,
        when: [COMBAT_PHASE, SHOOTING_PHASE],
      },
    ],
  },
  'Bio-shock Shell': {
    effects: [
      {
        name: `Bio-shock Shell`,
        desc: `Once per battle, at the start of the combat phase, you can say the bearer will use the Bio-shock Shell. If you do so, pick 1 enemy HERO within 9" of the bearer that is visible to them and roll 3D6. If the roll is greater than that enemy HERO's Bravery characteristic, the strike-last effect applies to that enemy HERO until the end of that phase.`,
        when: [START_OF_COMBAT_PHASE],
      },
    ],
  },
  'Abyssal Blade': {
    effects: [
      {
        name: `Abyssal Blade`,
        desc: `Pick a weapon carried by the bearer to be the Abyssal Blade. Improve the Rend characteristic of that weapon by 1. In addition, add 1 to the Damage characteristic of that weapon if the target has the SLAANESH keyword.`,
        when: [COMBAT_PHASE],
      },
    ],
  },
  'Rune of the Surging Gloomtide': {
    effects: [
      {
        name: `Rune of the Surging Gloomtide`,
        desc: `Once per battle, at the end of your first movement phase, you can say that the bearer will summon a Gloomtide Shipwreck from the ethersea. If you do so, you can set up 1 Gloomtide Shipwreck wholly within 12" of the bearer and more than 3" from all models, objectives, other terrain features, endless spells and invocations, and add it to your army.`,
        when: [TURN_ONE_END_OF_MOVEMENT_PHASE],
      },
    ],
  },

  Whorlshell: {
    effects: [
      {
        name: `Whorlshell`,
        desc: `Once per battle, at the start of the combat phase, you can say the bearer will unleash the power of the Whorlshell. If you do so, until the end of that phase, if the unmodified hit roll for an attack made with a melee weapon that targets the bearer is 1 or 2, that attack fails and the attack sequence ends.`,
        when: [START_OF_COMBAT_PHASE],
      },
    ],
  },
  Dritchleech: {
    effects: [
      {
        name: `Dritchleech`,
        desc: `Subtract 1 from casting rolls, unbinding rolls and dispelling rolls for enemy WIZARDS within 18" of the bearer. This ability has no effect on IDONETH DEEPKIN units.`,
        when: [HERO_PHASE],
      },
    ],
  },
  'Brain Barnacles': {
    effects: [
      {
        name: `Brain Barnacles`,
        desc: `Once per battle, at the start of your hero phase, you can pick 1 enemy HERO within 12" of the bearer and roll 2D6. If the roll in inches is equal to or greater than the distance between the bearer and that enemy HERO, subtract 1 from hit rolls and wound rolls for that enemy HERO for the rest of the battle.`,
        when: [START_OF_HERO_PHASE],
      },
    ],
  },

  'Kraken Tooth': {
    effects: [
      {
        name: `Kraken Tooth`,
        desc: `Once per battle, in your shooting phase, you can pick 1 enemy unit within 12" of the bearer that is visible to them and roll a dice. Then, look up the result below:

        1 None Binds the Kraken: The bearer suffers D3 mortal wounds.

        2-5 The Kraken is Released: The target suffers D3 mortal wounds.

        6 A Tasty Morsel: Pick 1 model from the target unit. If that model has a Wounds characteristic of less than 10, it is slain. If that model has a Wounds characteristic of 10 or more, that model suffers 2D6 mortal wounds.`,
        when: [SHOOTING_PHASE],
      },
    ],
  },
} satisfies TItemDescriptions

export default tagAs(Artifacts, 'artifact')

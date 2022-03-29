import { tagAs } from 'factions/metatagger'
import { COMBAT_PHASE, END_OF_CHARGE_PHASE, SHOOTING_PHASE } from 'types/phases'

const MountTraits = {
  // 'Cinder-crest Youngblood': {
  //   effects: [
  //     {
  //       name: `Cinder-crest Youngblood`,
  //       desc: `When you use this model's Lashing Tail ability subtract 1 from the dice roll that determines if the target unit suffers D3 mortal wounds. If this model made a charge move in the same turn, subtract 2 instead.`,
  //       when: [COMBAT_PHASE],
  //     },
  //   ],
  // },
  'Flame-scale Youngblood': {
    effects: [
      {
        name: `Flame-scale Youngblood`,
        desc: `If you carry out a Stomp monstrous rampage (core rules, 21.1) with this unit and the enemy unit you picked suffers any mortal wounds, that enemy unit suffers 3 additional mortal wounds.`,
        when: [END_OF_CHARGE_PHASE],
      },
    ],
  },
  // 'Fire-claw Adult': {
  //   effects: [
  //     {
  //       name: `Fire-claw Adult`,
  //       desc: `If the unmodified wound roll for an attack made with this mount's melee weapons is 6, that attack has a rend characteristic of -3.`,
  //       when: [COMBAT_PHASE],
  //     },
  //   ],
  // },
  'Lava-Tongue Adult': {
    effects: [
      {
        name: `Lava-Tongue Adult`,
        desc: `When determining the Attacks characteristic of this unit's Roaring Fyrestream, an Attacks characteristic of less than 5 is treated as being 5.`,
        when: [SHOOTING_PHASE],
      },
    ],
  },
  'Coal-heart Ancient': {
    effects: [
      {
        name: `Coal-heart Ancient`,
        desc: `If this unit is the target of an attack made with a melee weapon, subtract 1 from the Damage characteristic of that weapon for that attack (to a minimum of 1).`,
        when: [COMBAT_PHASE],
      },
    ],
  },
  // 'Ash-horn Ancient': {
  //   effects: [
  //     {
  //       name: `Ash-horn Ancient`,
  //       desc: `You can reroll save rolls of 1 for attacks that target this model and friendly MAGMADROTHS within 6".`,
  //       when: [SAVES_PHASE],
  //     },
  //   ],
  // },
}

export default tagAs(MountTraits, 'mount_trait')

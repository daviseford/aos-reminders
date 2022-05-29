import { tagAs } from 'factions/metatagger'
import {
  COMBAT_PHASE,
  HERO_PHASE,
  MOVEMENT_PHASE,
  START_OF_HERO_PHASE,
  WOUND_ALLOCATION_PHASE,
} from 'types/phases'

const Artifacts = {
  'Crown of Woe': {
    effects: [
      {
        name: `Crown of Woe`,
        desc: `Enemy units cannot receive the Rally or Inspiring Presence commands while they are within 9" of the bearer. In addition, if any enemy models are slain by wounds caused by the bearer's attacks, increase the range of this ability to 15" for the remainder of the battle.`,
        when: [START_OF_HERO_PHASE, WOUND_ALLOCATION_PHASE],
      },
    ],
  },
  // "Shadracar's Fang": {
  //   effects: [
  //     {
  //       name: `Shadracar's Fang`,
  //       desc: `Add 1 to the hit rolls made for the selected melee weapon. In addition, each time an unmodified hit roll of 6 is made for that weapon, the target suffers 1 mortal wound in addition to normal damage.`,
  //       when: [COMBAT_PHASE],
  //     },
  //   ],
  // },
  // 'Amulet of Dark Fire': {
  //   effects: [
  //     {
  //       name: `Amulet of Dark Fire`,
  //       desc: `Roll a D6 each time the bearer is allocated a mortal wound inflicted by an enemy spell. On a 4+ that wound is negated.`,
  //       when: [WOUND_ALLOCATION_PHASE],
  //     },
  //   ],
  // },
  'Crone Blade': {
    effects: [
      {
        name: `Crone Blade`,
        desc: `Pick 1 of the bearer's melee weapons. If the unmodified hit roll for an attack made with that weapon is a 6, you can heal 1 wound allocated to the bearer after all of the bearer's attacks have been resolved.`,
        when: [COMBAT_PHASE],
      },
    ],
  },
  // 'Thousand and One Dark Blessings': {
  //   effects: [
  //     {
  //       name: `Thousand and One Dark Blessings`,
  //       desc: `Roll a D6 each time you allocate a wound or mortal wound to the bearer. On a 5+ it is negated.`,
  //       when: [WOUND_ALLOCATION_PHASE],
  //     },
  //   ],
  // },
  'Bloodbane Venom': {
    effects: [
      {
        name: `Bloodbane Venom`,
        desc: `Pick 1 of the bearer's melee weapons. After the bearer fights, if any wounds caused by attacks made with that weapon in that phase were allocated to an enemy model and that enemy model has not been slain, roll a dice. If the roll is equal to or greater than that model's Wounds characteristic, that model is slain.`,
        when: [COMBAT_PHASE],
      },
    ],
  },
  'Shadow Stone': {
    effects: [
      {
        name: `Shadow Stone`,
        desc: `Add 1 to casting rolls for the bearer when they attempt to cast a spell from the Lore of Shadows (pg 70).`,
        when: [HERO_PHASE],
      },
    ],
  },
  // 'Rune of Ulgu': {
  //   effects: [
  //     {
  //       name: `Rune of Ulgu`,
  //       desc: `The bearer knows one additional spell from the Lore of Shadows.`,
  //       when: [HERO_PHASE],
  //     },
  //   ],
  // },
  // 'The Mirror Glaive': {
  //   effects: [
  //     {
  //       name: `The Mirror Glaive`,
  //       desc: `Each time the bearer unbinds an enemy spell, they can immediately attempt to cast either the Mystic Shield or Arcane Bolt spells as if they were your hero phase. Your opponent cannot attempt to unbind this spell.`,
  //       when: [HERO_PHASE],
  //     },
  //   ],
  // },
  'Sevenfold Shadow': {
    effects: [
      {
        name: `Sevenfold Shadow`,
        desc: `Once per battle, in your movement phase, instead of making a normal move with the bearer, you can remove the bearer from the battlefield and set them up again anywhere on the battlefield more than 9" from all enemy units.`,
        when: [MOVEMENT_PHASE],
      },
    ],
  },
  'Crystal Heart': {
    effects: [
      {
        name: `Crystal Heart`,
        desc: `When the bearer attempts to cast a spell that summons an endless spell, the range of that spell is doubled.`,
        when: [HERO_PHASE],
      },
    ],
  },
  // 'Shade Claw': {
  //   effects: [
  //     {
  //       name: `Shade Claw`,
  //       desc: `The bearer's Whisperclaw has a Rend characteristic of -2.`,
  //       when: [COMBAT_PHASE],
  //     },
  //   ],
  // },
  'Blood Sigil': {
    effects: [
      {
        name: `Blood Sigil`,
        desc: `You can pick 1 extra prayer for the bearer from the Prayers of the Khainite Cult (pg 71).`,
        when: [HERO_PHASE],
      },
    ],
  },
  // 'Iron Circlet': {
  //   effects: [
  //     {
  //       name: `Iron Circlet`,
  //       desc: `You can reroll prayer rolls of 1 for the bearer.`,
  //       when: [HERO_PHASE],
  //     },
  //   ],
  // },
  'Rune of Khaine': {
    effects: [
      {
        name: `Rune of Khaine`,
        desc: `The first time the bearer is slain, the bearer can fight before they are removed from play.`,
        when: [WOUND_ALLOCATION_PHASE],
      },
    ],
  },
  // 'Crimson Shard': {
  //   effects: [
  //     {
  //       name: `Crimson Shard`,
  //       desc: `The bearer's selected melee weapon adds 1 to its wound rolls.`,
  //       when: [COMBAT_PHASE],
  //       rule_sources: [rule_sources.BATTLETOME_DAUGHTERS_OF_KHAINE, rule_sources.ERRATA_JULY_2021],
  //     },
  //   ],
  // },
  'Khainite Pendant': {
    effects: [
      {
        name: `Khainite Pendant`,
        desc: `Once per battle, before the bearer chants a prayer, you can say that they will call upon the power of the pendant. If you do so, that prayer is automatically answered (do not make a chanting roll).`,
        when: [HERO_PHASE],
      },
    ],
  },
  // Hagbrew: {
  //   effects: [
  //     {
  //       name: `Hagbrew`,
  //       desc: `Add 1 to the melee wound rolls of the bearer.`,
  //       when: [COMBAT_PHASE],
  //     },
  //   ],
  // },
  // // Hagg Nar Flavor
  // 'The Ulfuri': {
  //   effects: [
  //     {
  //       name: `The Ulfuri`,
  //       desc: `The selected melee weapon adds 1 to its damage characteristic if the bearer charged this turn.`,
  //       when: [CHARGE_PHASE, COMBAT_PHASE],
  //     },
  //   ],
  // },
  // // Draichi Ganeth Flavor
  // "Death's Kiss": {
  //   effects: [
  //     {
  //       name: `Death's Kiss`,
  //       desc: `The selected melee weapon adds 2 to its attacks characteristic if the bearer charged this turn.`,
  //       when: [CHARGE_PHASE, COMBAT_PHASE],
  //     },
  //   ],
  // },
  // // Kraith Flavor
  // 'Venom of Nagendra': {
  //   effects: [
  //     {
  //       name: `Venom of Nagendra`,
  //       desc: `Once per battle, choose to not use the selected melee weapon in this combat phase. If you do, pick an enemy unit within 1" of the bearer and deal D6 mortal wounds.`,
  //       when: [START_OF_COMBAT_PHASE],
  //     },
  //   ],
  // },
  // // Khailebron Flavor
  // Whisperdeath: {
  //   effects: [
  //     {
  //       name: `Whisperdeath`,
  //       desc: `Unmodified melee hit rolls of 6 on the selected weapon inflict 1 mortal wound in addition to normal damage.`,
  //       when: [COMBAT_PHASE],
  //     },
  //   ],
  // },
  // // Khelt Nar Flavor
  // "Gaisa's Falx": {
  //   effects: [
  //     {
  //       name: `Gaisa's Falx`,
  //       desc: `Unmodified melee hit rolls of 6 on the selected weapon score 2 hits instead of 1.`,
  //       when: [COMBAT_PHASE],
  //     },
  //   ],
  // },
  // // Zainthar Kai Flavor
  // 'Crimson Talisman': {
  //   effects: [
  //     {
  //       name: `Crimson Talisman`,
  //       desc: `Subtract 1 from melee wound rolls targeting the bearer.`,
  //       when: [COMBAT_PHASE],
  //     },
  //   ],
  // },
}

export default tagAs(Artifacts, 'artifact')

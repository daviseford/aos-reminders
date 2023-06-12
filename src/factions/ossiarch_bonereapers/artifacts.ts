import { tagAs } from 'factions/metatagger'
import {
  BATTLESHOCK_PHASE,
  COMBAT_PHASE,
  DURING_GAME,
  END_OF_COMBAT_PHASE,
  HERO_PHASE,
  SHOOTING_PHASE,
  START_OF_BATTLESHOCK_PHASE,
  WARDS_PHASE,
  WOUND_ALLOCATION_PHASE,
} from 'types/phases'

const Artifacts = {
  //Relics of the Kavaloi - Leige-Kavalos only
  Mindblade: {
    effects: [
      {
        name: `Mindblade`,
        desc: `Pick 1 of the bearer's melee weapons. At the end of the combat phase, if any wounds or mortal wounds caused by attacks made with that weapon were allocated to an enemy HERO in that phase and that HERO was not slain, that HERO cannot carry out heroic actions for the rest of the battle.`,
        when: [END_OF_COMBAT_PHASE],
      },
    ],
  },
  // 'Lordly Phylactery': {
  //   effects: [
  //     {
  //       name: `Lordly Phylactery`,
  //       desc: `Once per battle, at the start of any phase, the bearer can use this artefact. When they do so, you receive D3 relentless discipline points.`,
  //       when: [DURING_GAME],
  //     },
  //   ],
  // },
  // 'Scroll of Command': {
  //   effects: [
  //     {
  //       name: `Scroll of Command`,
  //       desc: `Subtract 2 from the Bravery characteristic of enemy units while they are within 6" of the bearer.`,
  //       when: [BATTLESHOCK_PHASE],
  //     },
  //   ],
  // },
  'Bones of the Abyss': {
    effects: [
      {
        name: `Bones of the Abyss`,
        desc: `SOULMASON only. Each time the bearer successfully casts a spell that is not unbound, add 1 to the Attacks characteristic of the bearer' Ossified Claws until the end of that turn.`,
        when: [HERO_PHASE],
      },
    ],
  },
  Marrowpact: {
    effects: [
      {
        name: `Marrowpact`,
        desc: `Each time the bearer fights, after all of their attacks have been resolved, you can heal up to a number of wounds allocated to the bearer equal to the number of wounds and mortal wounds caused by those attacks that were allocated to enemy units.`,
        when: [WOUND_ALLOCATION_PHASE],
      },
    ],
  },
  'Helm of Tyranny': {
    effects: [
      {
        name: `Helm of Tyranny`,
        desc: `Enemy units cannot receive the Inspiring Presence command while they are within 3" of the bearer.`,
        when: [START_OF_BATTLESHOCK_PHASE],
      },
      {
        name: `Helm of Tyranny`,
        desc: `If an enemy unit fails a battleshock test within 3" of the bearer, add D3 to the number of models that flee.`,
        when: [BATTLESHOCK_PHASE],
      },
    ],
  },
  //Tools of the Boneshaper - Mortisan Boneshaper only
  "Artisan's Key": {
    effects: [
      {
        name: `Artisan's Key`,
        desc: `BONESHAPER only. Before you use the bearer's
        Boneshaper ability, roll a dice. On a 3+, you can
        either pick 2 units within 6" of the bearer to be
        affected by the Boneshaper ability instead of 1, or
        you can pick 1 unit within 6" of the bearer to be
        affected by the Boneshaper ability twice.`,
        when: [DURING_GAME], // TODO
      },
    ],
  },
  'Lode of Saturation': {
    effects: [
      {
        name: `Lode of Saturation`,
        desc: `Add 1 to ward rolls for the bearer.`,
        when: [WARDS_PHASE],
      },
    ],
  },
  // 'The Crafter-gems': {
  //   effects: [
  //     {
  //       name: `The Crafter-gems`,
  //       desc: `In your hero phase, you can heal up to 3 wounds allocated to the bearer. Once the total number of wounds this artefact has been used to heal during the battle equals 3, it cannot be used again for the rest of the battle.`,
  //       when: [HERO_PHASE],
  //     },
  //   ],
  // },
  //Treasures of the Soulmason - Mortisan Soulmason only
  'Gothizzar Cartouche': {
    effects: [
      {
        name: `Gothizzar Cartouche`,
        desc: `OSSIFECTOR only. Add 1 to wound rolls for attacks made with melee weapons by friendly OSSIARCH BONEREAPERS units wholly within 9" of the bearer.`,
        when: [COMBAT_PHASE],
      },
    ],
  },
  // 'Soul Reservoir': {
  //   effects: [
  //     {
  //       name: `Soul Reservoir`,
  //       desc: `Add 2 to casting rolls for the bearer. However, if the casting roll for the bearer is an unmodified 10+, this artefact cannot be used again for the rest of the battle.`,
  //       when: [HERO_PHASE],
  //     },
  //   ],
  // },
  // 'Throne of Dzendt': {
  //   effects: [
  //     {
  //       name: `Throne of Dzendt`,
  //       desc: `Add 2 to the bearer's Wounds characteristic.`,
  //       when: [DURING_GAME],
  //     },
  //     {
  //       name: `Throne of Dzendt`,
  //       desc: `Add 2 to the Attacks characteristic of the Ossified Claws of the bearer's mount.`,
  //       when: [COMBAT_PHASE],
  //     },
  //   ],
  // },
  Luminscythe: {
    effects: [
      {
        name: `Luminscythe`,
        desc: `SOULREAPER only. Subtract 1 from hit rolls and wound rolls for attacks that target the bearer while they are within 3" of any enemy units.`,
        when: [COMBAT_PHASE, SHOOTING_PHASE],
      },
    ],
  },
  // 'Vial of Binding': {
  //   effects: [
  //     {
  //       name: `Vial of Binding`,
  //       desc: `Once per battle, in your hero phase, pick 1 enemy model within 12" of the bearer that is visible to them and roll a D6. If the roll is equal to or greater than that model's Wounds characteristic that enemy model is slain.`,
  //       when: [HERO_PHASE],
  //     },
  //   ],
  // },
  // 'Guardian Reavesoul': {
  //   effects: [
  //     {
  //       name: `Guardian Reavesoul`,
  //       desc: `The Deathless Warriors battle trait negates a wound or mortal wound allocated to the bearer on a roll of a 5+ instead of 6. Instead of rolling the dice, you can say that the bearer will shatter this artefact. If you do so, the wound or mortal wound is negated without a dice being rolled, but this artefact cannot be used again for the rest of the battle.`,
  //       when: [DURING_GAME],
  //     },
  //   ],
  // },
  // "Artificer's Blade": {
  //   effects: [
  //     {
  //       name: `Artificer's Blade`,
  //       desc: `Pick 1 of this bearer's melee weapons. Change the Rend characteristic of that weapon to -3.`,
  //       when: [COMBAT_PHASE],
  //     },
  //   ],
  // },
  // 'Godbone Armour': {
  //   effects: [
  //     {
  //       name: `Godbone Armour`,
  //       desc: `The first wound allocated to the bearer in each phase is negated.`,
  //       when: [DURING_GAME],
  //     },
  //   ],
  // },
  // 'Nadir-bound Mount': {
  //   effects: [
  //     {
  //       name: `Nadir-bound Mount`,
  //       desc: `You can roll D3 additional dice when this LIEGE uses their Unstoppable Charge ability.`,
  //       when: [CHARGE_PHASE],
  //     },
  //   ],
  // },
  // 'Beastbone Blade': {
  //   effects: [
  //     {
  //       name: `Beastbone Blade`,
  //       desc: `Pick 1 of this bearer's melee weapons. Add 1 to the Attacks characteristic of that weapon.`,
  //       when: [COMBAT_PHASE],
  //     },
  //   ],
  // },
  // 'Baleful Blade': {
  //   effects: [
  //     {
  //       name: `Baleful Blade`,
  //       desc: `Pick 1 of this bearer's melee weapons. Do not make save rolls for attacks made with that weapon, and wounds inflicted by that weapon cannot be negated when they are allocated to a model(the wounds can be healed later in the battle).`,
  //       when: [COMBAT_PHASE],
  //     },
  //   ],
  // },
  // 'Searing Blade': {
  //   effects: [
  //     {
  //       name: `Searing Blade`,
  //       desc: `Pick 1 of this bearer's melee weapons. Add 1 to the Damage characteristic of that weapon.`,
  //       when: [COMBAT_PHASE],
  //     },
  //   ],
  // },
}

export default tagAs(Artifacts, 'artifact')

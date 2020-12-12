import { tagAs } from 'factions/metatagger'
import {
  BATTLESHOCK_PHASE,
  CHARGE_PHASE,
  COMBAT_PHASE,
  DURING_GAME,
  END_OF_COMBAT_PHASE,
  HERO_PHASE,
  SHOOTING_PHASE,
  START_OF_HERO_PHASE,
} from 'types/phases'

const Artifacts = {
  //Relics of the Kavaloi - Leige-Kavalos only
  Mindblade: {
    effects: [
      {
        name: `Mindblade`,
        desc: `Pick one of the bearer's melee weapons. If the unmodified hit roll for an attack made with that weapon that targets a HERO is 6, your opponent loses 1 command point (to a minimum of 0) and that HERO cannot use command abilities for the rest of the battle.`,
        when: [COMBAT_PHASE],
      },
    ],
  },
  'Lordly Phylactery': {
    effects: [
      {
        name: `Lordly Phylactery`,
        desc: `Once per battle, at the start of any phase, the bearer can use this artefact. When they do so, you receive D3 relentless discipline points.`,
        when: [DURING_GAME],
      },
    ],
  },
  'Scroll of Command': {
    effects: [
      {
        name: `Scroll of Command`,
        desc: `Subtract 2 from the Bravery characteristic of enemy units while they are within 6" of the bearer.`,
        when: [BATTLESHOCK_PHASE],
      },
    ],
  },
  'Grave-sand Boneplate': {
    effects: [
      {
        name: `Grave-sand Boneplate`,
        desc: `At the end of the combat phase, roll a D6 for each enemy unit within 3" of the bearer. On a 4+, that unit suffers 1 mortal wound.`,
        when: [END_OF_COMBAT_PHASE],
      },
    ],
  },
  Marrowpact: {
    effects: [
      {
        name: `Marrowpact`,
        desc: `Once per battle, in your hero phase, pick 1 enemy unit within 6" of the bearer that is visible to them, and roll a D6. On a 3+, that unit suffers D3 mortal wounds and you can heal 1 wound allocated to the bearer for each mortal wound that is inflicted and not negated.`,
        when: [HERO_PHASE],
      },
    ],
  },
  'Helm of the Ordained': {
    effects: [
      {
        name: `Helm of the Ordained`,
        desc: `Add 1 to hit rolls for attacks made by friendly OSSIARCH BONEREAPERS units and their mounts while they are wholly within 12" of the bearer.`,
        when: [COMBAT_PHASE, SHOOTING_PHASE],
      },
    ],
  },
  //Tools of the Boneshaper - Mortisan Boneshaper only
  "Artisan's Key": {
    effects: [
      {
        name: `Artisan's Key`,
        desc: `Before you use the bearer's Boneshaper ability, roll a D6. On a 4+, you can either pick 2 units within 6" of the bearer to be affected by the Boneshaper ability instead of 1, or you can pick 1 unit within 6" of the bearer to be affected by the Boneshaper ability twice.`,
        when: [HERO_PHASE],
      },
    ],
  },
  'Lode of Saturation': {
    effects: [
      {
        name: `Lode of Saturation`,
        desc: `At the start of your hero phase, pick 1 friendly OSSIARCH BONEREAPERS unit other than the bearer that is within 1" of them. Until your next hero phase, the Deathless Warriors battle trait negates a wound or mortal wound allocated to that unit on a roll of a 5+ instead of 6.`,
        when: [START_OF_HERO_PHASE],
      },
    ],
  },
  'The Crafter-gems': {
    effects: [
      {
        name: `The Crafter-gems`,
        desc: `In your hero phase, you can heal up to 3 wounds allocated to the bearer. Once the total number of wounds this artefact has been used to heal during the battle equals 3, it cannot be used again for the rest of the battle.`,
        when: [HERO_PHASE],
      },
    ],
  },
  //Treasures of the Soulmason - Mortisan Soulmason only
  'Gothizzar Cartouche': {
    effects: [
      {
        name: `Gothizzar Cartouche`,
        desc: `Add 1 to wound rolls for attacks made with melee weapons by friendly DEATH units wholly within 9" of the bearer if the target does not have the DEATH keyword.`,
        when: [COMBAT_PHASE],
      },
    ],
  },
  'Soul Reservoir': {
    effects: [
      {
        name: `Soul Reservoir`,
        desc: `Add 2 to casting rolls for the bearer. However, if the casting roll for the bearer is an unmodified 10+, this artefact cannot be used again for the rest of the battle.`,
        when: [HERO_PHASE],
      },
    ],
  },
  'Throne of Dzendt': {
    effects: [
      {
        name: `Throne of Dzendt`,
        desc: `Add 2 to the bearer's Wounds characteristic.`,
        when: [DURING_GAME],
      },
      {
        name: `Throne of Dzendt`,
        desc: `Add 2 to the Attacks characteristic of the Ossified Claws of the bearer's mount.`,
        when: [COMBAT_PHASE],
      },
    ],
  },
  //Weapons of the Soulreaper - Mortisan Soulreaper only
  Luminscythe: {
    effects: [
      {
        name: `Luminscythe`,
        desc: `Subtract 1 from hit rolls for attacks that target the bearer.`,
        when: [COMBAT_PHASE, SHOOTING_PHASE],
      },
      {
        name: `Luminscythe`,
        desc: `Add 1 to casting rolls for the bearer when they attempt to cast Soul-blast or any spell from the Lore of the Mortisans.`,
        when: [HERO_PHASE],
      },
    ],
  },
  'Vial of Binding': {
    effects: [
      {
        name: `Vial of Binding`,
        desc: `Once per battle, in your hero phase, pick 1 enemy model within 12" of the bearer that is visible to them and roll a D6. If the roll is equal to or greater than that model's Wounds characteristic that enemy model is slain.`,
        when: [HERO_PHASE],
      },
    ],
  },
  'Guardian Reavesoul': {
    effects: [
      {
        name: `Guardian Reavesoul`,
        desc: `The Deathless Warriors battle trait negates a wound or mortal wound allocated to the bearer on a roll of a 5+ instead of 6. Instead of rolling the dice, you can say that the bearer will shatter this artefact. If you do so, the wound or mortal wound is negated without a dice being rolled, but this artefact cannot be used again for the rest of the battle.`,
        when: [DURING_GAME],
      },
    ],
  },
  // Mortis Praetorians Flavor
  "Artificer's Blade": {
    effects: [
      {
        name: `Artificer's Blade`,
        desc: `Pick 1 of this bearer's melee weapons. Change the Rend characteristic of that weapon to -3.`,
        when: [COMBAT_PHASE],
      },
    ],
  },
  // Petrifex Elite Flavor
  'Godbone Armour': {
    effects: [
      {
        name: `Godbone Armour`,
        desc: `The first wound allocated to the bearer in each phase is negated.`,
        when: [DURING_GAME],
      },
    ],
  },
  // Stalliarch Lords Flavor
  'Nadir-bound Mount': {
    effects: [
      {
        name: `Nadir-bound Mount`,
        desc: `You can roll D3 additional dice when this LIEGE uses their Unstoppable Charge ability.`,
        when: [CHARGE_PHASE],
      },
    ],
  },
  // Ivory Host Flavor
  'Beastbone Blade': {
    effects: [
      {
        name: `Beastbone Blade`,
        desc: `Pick 1 of this bearer's melee weapons. Add 1 to the Attacks characteristic of that weapon.`,
        when: [COMBAT_PHASE],
      },
    ],
  },
  // Null Myriad Flavor
  'Baleful Blade': {
    effects: [
      {
        name: `Baleful Blade`,
        desc: `Pick 1 of this bearer's melee weapons. Do not make save rolls for attacks made with that weapon, and wounds inflicted by that weapon cannot be negated when they are allocated to a model(the wounds can be healed later in the battle).`,
        when: [COMBAT_PHASE],
      },
    ],
  },
  // Crematorians Flavor
  'Searing Blade': {
    effects: [
      {
        name: `Searing Blade`,
        desc: `Pick 1 of this bearer's melee weapons. Add 1 to the Damage characteristic of that weapon.`,
        when: [COMBAT_PHASE],
      },
    ],
  },
}

export default tagAs(Artifacts, 'artifact')

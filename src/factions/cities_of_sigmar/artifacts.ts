import { tagAs } from 'factions/metatagger'
import {
  BATTLESHOCK_PHASE,
  CHARGE_PHASE,
  COMBAT_PHASE,
  END_OF_COMBAT_PHASE,
  HERO_PHASE,
  MOVEMENT_PHASE,
  SAVES_PHASE,
  SHOOTING_PHASE,
  START_OF_COMBAT_PHASE,
  START_OF_HERO_PHASE,
  START_OF_SHOOTING_PHASE,
  TURN_ONE_START_OF_ROUND,
  WOUND_ALLOCATION_PHASE,
} from 'types/phases'

const Artifacts = {
  'Armour of Mallus (Hammerhal)': {
    effects: [
      {
        name: `Armour of Mallus (Hammerhal)`,
        desc: `Add 1 to save rolls for attacks that target the bearer.`,
        when: [SAVES_PHASE],
      },
    ],
  },
  "Saint's Blade (Hammerhal)": {
    effects: [
      {
        name: `Saint's Blade (Hammerhal)`,
        desc: `Pick 1 melee weapon. Improve the Rend of that weapon by 1. In addition, while the bearer is within 6" of an objective marker, add 1 to the damage inflicted by attacks made with that weapon.`,
        when: [COMBAT_PHASE],
      },
    ],
  },
  'The Twinstone (Hammerhal)': {
    effects: [
      {
        name: `Choose aspect`,
        desc: `Pick Aqshy or Ghyran Aspect in each of your hero phases.`,
        when: [HERO_PHASE],
      },
      {
        name: `Aqshy Aspect`,
        desc: `Until the start of your next hero phase, add 1 to hit rolls for attacks made with melee weapons by friendly Hammerhal units while they are wholly within 12" of the bearer.`,
        when: [COMBAT_PHASE],
      },
      {
        name: `Ghyran Aspect`,
        desc: `Roll 1 dice for each friendly HAMMERHAL unit wholly within 12" of the bearer. On a 4+, you can heal up to D3 wounds allocated to that unit.`,
        when: [HERO_PHASE],
      },
    ],
  },
  'Spear of the Hunt (The Living City)': {
    effects: [
      {
        name: `Spear of the Hunt (The Living City)`,
        desc: `Pick 1 of the bearer's melee weapons. Improve the Rend by 1. In addition, the bearer (and mount) fights at the start of the combat phase if they made a charge move in the same turn. The bearer cannot fight again in that combat phase unless an ability or spell allows them to fight more than once.`,
        when: [COMBAT_PHASE],
      },
    ],
  },
  'Deepmire Cloak (The Living City)': {
    effects: [
      {
        name: `Deepmire Cloak (The Living City)`,
        desc: `If the bearer has a Wounds characteristic of 6 or less, while they are in cover, they cannot be chosen to be the target of a missile weapon.
        If the bearer has a Wounds characteristic of 7 or more, while they are in cover, subtract 1 from hit rolls for attacks made with missile weapons that target them.`,
        when: [SHOOTING_PHASE],
      },
    ],
  },
  'Wardroth Horn (The Living City)': {
    effects: [
      {
        name: `Wardroth Horn (The Living City)`,
        desc: `Once per battle, the bearer can sound the Wardroth Horn. If they do, until the start of your next hero phase, add 1 to the Attacks characteristic of melee weapons used by LIVING CITY SYLVANETH units.`,
        when: [HERO_PHASE],
      },
    ],
  },
  'Steam-piston Plate Mail (Greywater Fastness)': {
    effects: [
      {
        name: `Steam-piston Plate Mail (Greywater Fastness)`,
        desc: `Add 1 to save rolls for attacks that target the bearer.`,
        when: [SAVES_PHASE],
      },
      {
        name: `Steam-piston Plate Mail (Greywater Fastness)`,
        desc: `If the bearer does not have a mount, add 1 to the bearer's Move characteristic.`,
        when: [MOVEMENT_PHASE],
      },
    ],
  },
  'Runic Munitions (Greywater Fastness)': {
    effects: [
      {
        name: `Runic Munitions (Greywater Fastness)`,
        desc: `Pick 1 of the bearer's missile weapons. Add 1 to the Damage characteristic of that weapon.`,
        when: [SHOOTING_PHASE],
      },
    ],
  },
  "Mastro Vivetti's Magnificent Macroscope (Greywater Fastness)": {
    effects: [
      {
        name: `Mastro Vivetti's Magnificent Macroscope (Greywater Fastness)`,
        desc: `At the start of the first battle round, you receive 1 extra command point.`,
        when: [TURN_ONE_START_OF_ROUND],
      },
      {
        name: `Mastro Vivetti's Magnificent Macroscope (Greywater Fastness)`,
        desc: `Add 1 to hit rolls for attacks made with missile weapons by the bearer.`,
        when: [SHOOTING_PHASE],
      },
    ],
  },
  'Amber Armour (The Phoenicium)': {
    effects: [
      {
        name: `Amber Armour (The Phoenicium)`,
        desc: `If the weapon used for an attack that targets the bearer has a Rend characteristic of -1, change the Rend characteristic for that attack to '-'.`,
        when: [SAVES_PHASE],
      },
    ],
  },
  'Phoenix Pinion (The Phoenicium)': {
    effects: [
      {
        name: `Phoenix Pinion (The Phoenicium)`,
        desc: `The bearer can fly. In addition, the bearer can run and still charge later in the same turn.`,
        when: [MOVEMENT_PHASE, CHARGE_PHASE],
      },
    ],
  },
  'Phoenix Pyre Ashes (The Phoenicium)': {
    effects: [
      {
        name: `Phoenix Pyre Ashes (The Phoenicium)`,
        desc: `If the unmodified save roll for an attack that targets the bearer is 6, you can heal 1 wound allocated to the bearer.`,
        when: [SAVES_PHASE],
      },
    ],
  },
  'Drakescale Cloak (Anvilgard)': {
    effects: [
      {
        name: `Drakescale Cloak (Anvilgard)`,
        desc: `Roll a D6 each time you allocate a wound or mortal wound to the bearer. On a 5+, that wound or mortal wound is negated.`,
        when: [WOUND_ALLOCATION_PHASE],
      },
    ],
  },
  'Venomfang Blade (Anvilgard)': {
    effects: [
      {
        name: `Venomfang Blade (Anvilgard)`,
        desc: `Pick 1 of the bearer's melee weapons. If the unmodified wound roll for an attack made with that weapon is 6, that attack inflicts D3 mortal wounds on the target in addition to any normal damage.`,
        when: [COMBAT_PHASE],
      },
    ],
  },
  'Asphyxica Censer (Anvilgard)': {
    effects: [
      {
        name: `Asphyxica Censer (Anvilgard)`,
        desc: `At the end of your combat phase, roll 1 dice for each enemy unit within 3" of the bearer. On a 4+, that unit suffers D3 mortal wounds.`,
        when: [END_OF_COMBAT_PHASE],
      },
    ],
  },
  'Agloraxi Prism (Hallowheart)': {
    effects: [
      {
        name: `Agloraxi Prism (Hallowheart)`,
        desc: `Subtract 1 from hit rolls for attacks made with missile weapons that target the bearer.`,
        when: [SHOOTING_PHASE],
      },
    ],
  },
  'Pauldrons of Living Flame (Hallowheart)': {
    effects: [
      {
        name: `Pauldrons of Living Flame (Hallowheart)`,
        desc: `At the end of your combat phase, roll a D6 for each enemy unit within 3" of the bearer. On a 4+, that unit suffers D3 mortal wounds.`,
        when: [END_OF_COMBAT_PHASE],
      },
    ],
  },
  'Whitefire Tome (Hallowheart)': {
    effects: [
      {
        name: `Whitefire Tome (Hallowheart)`,
        desc: `If the bearer is a WIZARD, they know all spells from the Lore of Whitefire instead of only 2. If the bearer is not a WIZARD, they know 1 spell from the Lore of Whitefire and can attempt to cast it in your hero phase.`,
        when: [HERO_PHASE],
      },
    ],
  },
  "Patrician's Helm (Tempest's Eye)": {
    effects: [
      {
        name: `Patrician's Helm (Tempest's Eye)`,
        desc: `Do not take battleshock tests for friendly TEMPEST'S EYE units while they are wholly within 12" of the bearer.`,
        when: [BATTLESHOCK_PHASE],
      },
    ],
  },
  "Seerstone Amulet (Tempest's Eye)": {
    effects: [
      {
        name: `Seerstone Amulet (Tempest's Eye)`,
        desc: `At the start of your hero phase, if the bearer is on the battlefield, roll a D6. On a 4+, you receive 1 extra command point.`,
        when: [START_OF_HERO_PHASE],
      },
    ],
  },
  "Zephyrite Banner (Tempest's Eye)": {
    effects: [
      {
        name: `Zephyrite Banner (Tempest's Eye)`,
        desc: `You can reroll charge rolls for friendly TEMPEST'S EYE units while they are wholly within 12" of the bearer.`,
        when: [CHARGE_PHASE],
      },
    ],
  },
  'Gloom Bell (Misthavn)': {
    effects: [
      {
        name: `Gloom Bell (Misthavn)`,
        desc: `Once per battle, during the enemy turn and until the end of the phase, subtract 1 from hit rolls made against units wholly within 12" of the bearer.`,
        when: [START_OF_SHOOTING_PHASE],
      },
    ],
  },
  'Strangler-kelp Noose (Misthavn)': {
    effects: [
      {
        name: `Strangler-kelp Noose (Misthavn)`,
        desc: `Once per battle, you can pick 1 enemy model within 3" of the bearer and roll a D6. If the roll is 6 or is less than the target's wound characteristic, the target cannot attack in this combat phase.`,
        when: [START_OF_COMBAT_PHASE],
      },
    ],
  },
  'Shadowsilk Armour (Misthavn)': {
    effects: [
      {
        name: `Shadowsilk Armour (Misthavn)`,
        desc: `Add 1 to the save rolls made by the bearer.`,
        when: [SAVES_PHASE],
      },
    ],
  },
  'Synesthalcum (Misthavn Narcotic)': {
    effects: [
      {
        name: `Synesthalcum (Misthavn Narcotic)`,
        desc: `Until your next hero phase, add 1 to hit rolls for attacks made by the user.`,
        when: [HERO_PHASE, SHOOTING_PHASE, COMBAT_PHASE],
      },
    ],
  },
  'Witch-mist (Misthavn Narcotic)': {
    effects: [
      {
        name: `Witch-mist (Misthavn Narcotic)`,
        desc: `Until your next hero phase, ignore modifiers when making save rolls for attacks that target the user.`,
        when: [HERO_PHASE, SAVES_PHASE],
      },
    ],
  },
  "Skiffer's Salve (Misthavn Narcotic)": {
    effects: [
      {
        name: `Skiffer's Salve (Misthavn Narcotic)`,
        desc: `You can heal up to D6 wounds allocated to the user.`,
        when: [HERO_PHASE],
      },
      {
        name: `Skiffer's Salve (Misthavn Narcotic)`,
        desc: `If used, the user cannot run or charge until your next hero phase.`,
        when: [MOVEMENT_PHASE, CHARGE_PHASE],
      },
    ],
  },
  'Float (Misthavn Narcotic)': {
    effects: [
      {
        name: `Float (Misthavn Narcotic)`,
        desc: `Until your next hero phase, the user can fly. This has no effect if the user has a mount.`,
        when: [HERO_PHASE, MOVEMENT_PHASE, CHARGE_PHASE],
      },
    ],
  },
  'Sawfang Dust (Misthavn Narcotic)': {
    effects: [
      {
        name: `Sawfang Dust (Misthavn Narcotic)`,
        desc: `Until your next hero phase, each time this user has resolved all attacks, you may pick 1 enemy unit within 1" and roll a D6. On a 4+ the unit suffers D3 mortal wounds.`,
        when: [HERO_PHASE, SHOOTING_PHASE, COMBAT_PHASE],
      },
    ],
  },
  'Glatch Ink (Misthavn Narcotic)': {
    effects: [
      {
        name: `Glatch Ink (Misthavn Narcotic)`,
        desc: `Until your next hero phase, you can add 1 to casting, dispelling, and unbinding rolls for the user.`,
        when: [HERO_PHASE],
      },
    ],
  },
  'Lifetaker (Har Kuron)': {
    effects: [
      {
        name: `Lifetaker (Har Kuron)`,
        desc: `You can pick 1 enemy unit within 36" of the bearer and visible. Roll a D6. On a 3-5 the target suffers 1 mortal wound. On a 6 it suffers D3 mortal wounds.`,
        when: [SHOOTING_PHASE],
      },
    ],
  },
  "Traitor's Banner (Har Kuron)": {
    effects: [
      {
        name: `Traitor's Banner (Har Kuron)`,
        desc: `Subtract 1 from missle attack hit rolls made against units wholly within 12" of the bearer.`,
        when: [SHOOTING_PHASE],
      },
    ],
  },
  'Nullstone Vizard (Har Kuron)': {
    effects: [
      {
        name: `Nullstone Vizard (Har Kuron)`,
        desc: `If the bearer is on the battlefield during your turn, roll a D6. On a 5+ you receive 1 command point.`,
        when: [START_OF_HERO_PHASE],
      },
    ],
  },
}

export default tagAs(Artifacts, 'artifact')

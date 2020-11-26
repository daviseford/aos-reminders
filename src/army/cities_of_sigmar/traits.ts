import { TTraits } from 'types/army'
import {
  BATTLESHOCK_PHASE,
  CHARGE_PHASE,
  COMBAT_PHASE,
  DURING_GAME,
  END_OF_MOVEMENT_PHASE,
  HERO_PHASE,
  MOVEMENT_PHASE,
  SAVES_PHASE,
  SHOOTING_PHASE,
  START_OF_COMBAT_PHASE,
  START_OF_HERO_PHASE,
  START_OF_SETUP,
  WOUND_ALLOCATION_PHASE,
} from 'types/phases'

const CommandTraits: TTraits = [
  {
    name: `Acadamae Prodigy (Hammerhal)`,
    effects: [
      {
        name: `Acadamae Prodigy (Hammerhal)`,
        desc: `+1 Attacks for this general's melee weapons. In addition, at the start of the battle, you receive 1 extra command point.`,
        when: [DURING_GAME],
      },
    ],
  },
  {
    name: `Blood of the Twelve (Hammerhal)`,
    effects: [
      {
        name: `Blood of the Twelve (Hammerhal)`,
        desc: `You can reroll wound rolls of 1 for attacks made with melee weapons by friendly HAMMERHAL units wholly within 12" of this general.`,
        when: [COMBAT_PHASE],
      },
    ],
  },
  {
    name: `Aggressive General (Hammerhal)`,
    effects: [
      {
        name: `Aggressive General (Hammerhal)`,
        desc: `Add 1 to hit rolls for attacks made with melee weapons by friendly HAMMERHAL units that are wholly within 12" of this general if this general made a charge move in the same turn.`,
        when: [COMBAT_PHASE],
      },
    ],
  },
  {
    name: `Ironoak Artisan (Living City)`,
    effects: [
      {
        name: `Ironoak Artisan (Living City)`,
        desc: `Add 1 to save rolls for attacks that target this general. In addition, add 1 to wound rolls for attacks made with melee weapons by this general.`,
        when: [SAVES_PHASE],
      },
      {
        name: `Ironoak Artisan (Living City)`,
        desc: `Add 1 to wound rolls for attacks made with melee weapons by this general.`,
        when: [COMBAT_PHASE],
      },
    ],
  },
  {
    name: `Forest Strider (Living City)`,
    effects: [
      {
        name: `Forest Strider (Living City)`,
        desc: `This general can run and still charge in the same turn.`,
        when: [MOVEMENT_PHASE, CHARGE_PHASE],
      },
      {
        name: `Forest Strider (Living City)`,
        desc: `Friendly units are not affected by the Deadly scenery rule if they start a move wholly within 12" of this general.`,
        when: [MOVEMENT_PHASE],
      },
    ],
  },
  {
    name: `Druid of the Everspring (Living City)`,
    effects: [
      {
        name: `Druid of the Everspring (Living City)`,
        desc: `If this general is a WIZARD, they know all spells from the Lore of Leaves instead of only 1. If this general is not a WIZARD, they know 1 spell from the Lore of Leaves.`,
        when: [HERO_PHASE],
      },
    ],
  },
  {
    name: `Seat on the Council (Greywater Fastness)`,
    effects: [
      {
        name: `Seat on the Council (Greywater Fastness)`,
        desc: `At the start of your hero phase, if this general is on the battlefield, roll a D6. On a 4+, you receive 1 extra command point.`,
        when: [START_OF_HERO_PHASE],
      },
    ],
  },
  {
    name: `Drillmaster (Greywater Fastness)`,
    effects: [
      {
        name: `Drillmaster (Greywater Fastness)`,
        desc: `You can reroll hit rolls of 1 for attacks made with missile weapons by friendly GREYWATER FASTNESS units that are wholly within 12" of this general while this general is more than 3" away from any enemy units.`,
        when: [SHOOTING_PHASE],
      },
    ],
  },
  {
    name: `Ghoul Mere Ranger (Greywater Fastness)`,
    effects: [
      {
        name: `Ghoul Mere Ranger (Greywater Fastness)`,
        desc: `In your shooting phase, friendly units wholly within 12" of this general can shoot even if they ran in the same turn.`,
        when: [MOVEMENT_PHASE, SHOOTING_PHASE],
      },
    ],
  },
  {
    name: `Seeker of Vengeance (The Phoenicium)`,
    effects: [
      {
        name: `Seeker of Vengeance (The Phoenicium)`,
        desc: `Add 1 to the Attacks characteristic of this general's melee weapons if 1 or more friendly models have been slain in the same phase. Add 3 to the Attacks characteristic of this general's melee weapons instead of 1 if 5 or more friendly models have been slain in the same turn.`,
        when: [COMBAT_PHASE],
      },
    ],
  },
  {
    name: `One with Fire and Ice (The Phoenicium)`,
    effects: [
      {
        name: `One with Fire and Ice (The Phoenicium)`,
        desc: `If this general is a WIZARD, they know all spells from the Lore of the Phoenix instead of only 1. If this general is not a WIZARD, they know 1 spell from the Lore of the Phoenix and can attempt to cast it in your hero phase.`,
        when: [HERO_PHASE],
      },
    ],
  },
  {
    name: `Aura of Serenity (The Phoenicium)`,
    effects: [
      {
        name: `Aura of Serenity (The Phoenicium)`,
        desc: `Do not take battleshock tests for friendly PHOENICIUM units while they are wholly within 12" of this general.`,
        when: [BATTLESHOCK_PHASE],
      },
    ],
  },
  {
    name: `Blackfang Crimelord (Anvilgard)`,
    effects: [
      {
        name: `Blackfang Crimelord (Anvilgard)`,
        desc: `Pick 2 different benefits of illicit dealing instead of 1.`,
        when: [START_OF_SETUP],
      },
    ],
  },
  {
    name: `Slayer of Monsters (Anvilgard)`,
    effects: [
      {
        name: `Slayer of Monsters (Anvilgard)`,
        desc: `Add 1 to hit and wound rolls for attacks made by this general that target an enemy MONSTER.`,
        when: [SHOOTING_PHASE, COMBAT_PHASE],
      },
    ],
  },
  {
    name: `Black Market Bounty (Anvilgard Battle Trait)`,
    effects: [
      {
        name: `Black Market Bounty (Anvilgard Battle Trait)`,
        desc: `1 additional friendly ANVILGARD HERO can bear an artefact of power from the Anvilgard Artefacts of Power table.`,
        when: [START_OF_SETUP],
      },
    ],
  },
  {
    name: `Dabblings in Sorcery (Anvilgard Battle Trait)`,
    effects: [
      {
        name: `Dabblings in Sorcery (Anvilgard Battle Trait)`,
        desc: `1 additional friendly ANVILGARD DRAGON, ANVILGARD KHARIBDYSS or ANVILGARD WAR HYDRA can have a Drakeblood curse from the Drakeblood Curses table.`,
        when: [START_OF_SETUP],
      },
    ],
  },
  {
    name: `Hidden Agents (Anvilgard Battle Trait)`,
    effects: [
      {
        name: `Hidden Agents (Anvilgard Battle Trait)`,
        desc: `You receive D3 extra command points.`,
        when: [START_OF_SETUP],
      },
    ],
  },
  {
    name: `Secretive Warlock (Anvilgard)`,
    effects: [
      {
        name: `Secretive Warlock (Anvilgard)`,
        desc: `If this general is a WIZARD, they know all spells from the Lore of Dark Sorcery instead of only 1. If this general is not a WIZARD, they know 1 spell from the Lore of Dark Sorcery and can attempt to cast it in their hero phase.`,
        when: [HERO_PHASE],
      },
    ],
  },
  {
    name: `Acidic Blood (Drakeblood Curse)`,
    effects: [
      {
        name: `Acidic Blood (Drakeblood Curse)`,
        desc: `Roll a D6 each time you allocate a wound to this model that was inflicted by a melee weapon and not negated. On a 4+, the attacking unit suffers 1 mortal wound.`,
        when: [COMBAT_PHASE],
      },
    ],
  },
  {
    name: `Jutting Bones (Drakeblood Curse)`,
    effects: [
      {
        name: `Jutting Bones (Drakeblood Curse)`,
        desc: `After this model makes a charge move, you can pick 1 enemy unit within 1" of this model and roll a D6. On a 2+, that enemy unit suffers D3 mortal wounds.`,
        when: [CHARGE_PHASE],
      },
    ],
  },
  {
    name: `Fell Gaze (Drakeblood Curse)`,
    effects: [
      {
        name: `Fell Gaze (Drakeblood Curse)`,
        desc: `Subtract 2 from the Bravery characteristic of enemy units while they are within 12" of any models that have this Drakeblood curse.`,
        when: [BATTLESHOCK_PHASE],
      },
    ],
  },
  {
    name: `Veteran of the Blazing Crusade (Hallowheart)`,
    effects: [
      {
        name: `Veteran of the Blazing Crusade (Hallowheart)`,
        desc: `Do not take battleshock tests for friendly HALLOWHEART units while they are wholly within 18" of this general.`,
        when: [BATTLESHOCK_PHASE],
      },
    ],
  },
  {
    name: `Warden of the Flame (Hallowheart)`,
    effects: [
      {
        name: `Warden of the Flame (Hallowheart)`,
        desc: `At the start of your hero phase, roll a D6. On a 4+, you receive 1 extra command point.`,
        when: [START_OF_HERO_PHASE],
      },
    ],
  },
  {
    name: `Famed Spell-hunter (Hallowheart)`,
    effects: [
      {
        name: `Famed Spell-hunter (Hallowheart)`,
        desc: `If this general is a WIZARD, add 3 to the roll when this general attempts to dispel an endless spell. If this general is not a WIZARD, they can attempt to dispel 1 endless spell in your hero phase.`,
        when: [HERO_PHASE],
      },
    ],
  },
  {
    name: `Aetherguard Captain (Tempest's Eye)`,
    effects: [
      {
        name: `Aetherguard Captain (Tempest's Eye)`,
        desc: `Add 1 to charge rolls for friendly TEMPEST'S EYE units while they are wholly within 12" of this general.`,
        when: [CHARGE_PHASE],
      },
    ],
  },
  {
    name: `Hawk-eyed (Tempest's Eye)`,
    effects: [
      {
        name: `Hawk-eyed (Tempest's Eye)`,
        desc: `Add 1 to wound rolls for attacks made with missile weapons by friendly TEMPEST'S EYE units wholly within 12" of this general.`,
        when: [SHOOTING_PHASE],
      },
    ],
  },
  {
    name: `Swift as the Wind (Tempest's Eye)`,
    effects: [
      {
        name: `Swift as the Wind (Tempest's Eye)`,
        desc: `This general can run and still charge in the same turn.`,
        when: [MOVEMENT_PHASE, CHARGE_PHASE],
      },
      {
        name: `Swift as the Wind (Tempest's Eye)`,
        desc: `This general (and their mount) fights at the start of the combat phase.`,
        when: [START_OF_COMBAT_PHASE],
      },
    ],
  },
  {
    name: `Shadowlord (Misthavn)`,
    effects: [
      {
        name: `Shadowlord (Misthavn)`,
        desc: `Once per battle round, the general can use Shadowstrike without spending a command point.`,
        when: [END_OF_MOVEMENT_PHASE],
      },
    ],
  },
  {
    name: `Wily Foe (Misthavn)`,
    effects: [
      {
        name: `Wily Foe (Misthavn)`,
        desc: `Roll a D6 each time a wound or mortal wound is allocated to this general. On a 6 it is negated.`,
        when: [WOUND_ALLOCATION_PHASE],
      },
    ],
  },
  {
    name: `Shade Warlock (Misthavn)`,
    effects: [
      {
        name: `Shade Warlock (Misthavn)`,
        desc: `This general is able to cast 1 spell (or gets an additional spell attempt if already a wizard). It knows Arcane Bolt and Mystic Shield.`,
        when: [HERO_PHASE],
      },
    ],
  },
  {
    name: `Bathed in Blood (Har Kuron)`,
    effects: [
      {
        name: `Bathed in Blood (Har Kuron)`,
        desc: `Add 1 to the wounds characteristic of this general.`,
        when: [WOUND_ALLOCATION_PHASE],
      },
      {
        name: `Bathed in Blood (Har Kuron)`,
        desc: `You may heal 1 wound allocated to this general.`,
        when: [HERO_PHASE],
      },
    ],
  },
  {
    name: `Murderous Zeal (Har Kuron)`,
    effects: [
      {
        name: `Murderous Zeal (Har Kuron)`,
        desc: `This general can attempt to use Incitement to Murder. If this general is already a priest it may attempt it twice.`,
        when: [HERO_PHASE],
      },
    ],
  },
  {
    name: `Dark Adept (Har Kuron)`,
    effects: [
      {
        name: `Dark Adept (Har Kuron)`,
        desc: `This general is able to cast 1 spell (or gets an additional spell attempt if already a wizard). It knows Arcane Bolt and Mystic Shield.`,
        when: [HERO_PHASE],
      },
    ],
  },
]

export default CommandTraits

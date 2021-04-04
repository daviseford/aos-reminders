import { tagAs } from 'factions/metatagger'
import {
  COMBAT_PHASE,
  DURING_GAME,
  DURING_SETUP,
  HERO_PHASE,
  MOVEMENT_PHASE,
  SHOOTING_PHASE,
  TURN_ONE_END_OF_MOVEMENT_PHASE,
} from 'types/phases'

const MountTraits = {
  'Deathly Fast (Terrorgheist)': {
    effects: [
      {
        name: `Deathly Fast (Terrorgheist)`,
        desc: `This model can run and still shoot in the same turn.`,
        when: [MOVEMENT_PHASE, SHOOTING_PHASE],
      },
    ],
  },
  'Razor-clawed (Terrorgheist)': {
    effects: [
      {
        name: `Razor-clawed (Terrorgheist)`,
        desc: `Improve the Rend characteristic of this mount's melee weapons by 1.`,
        when: [COMBAT_PHASE],
      },
    ],
  },
  'Horribly Infested (Terrorgheist)': {
    effects: [
      {
        name: `Horribly Infested (Terrorgheist)`,
        desc: `This model's Infested ability inflicts 3 mortal wounds instead of D3 mortal wounds.`,
        when: [DURING_GAME],
      },
    ],
  },
  'Horribly Resiliant (Terrorgheist)': {
    effects: [
      {
        name: `Horribly Resiliant (Terrorgheist)`,
        desc: `This model's Royal Blood ability heals up to 3 wounds instead of up to D3 wounds.`,
        when: [HERO_PHASE],
      },
    ],
  },
  'Gruesome Bite (Terrorgheist)': {
    effects: [
      {
        name: `Gruesome Bite (Terrorgheist)`,
        desc: `You can reroll failed hit rolls for attacks made with this mount's Fanged Maw.`,
        when: [COMBAT_PHASE],
      },
    ],
  },
  'Devastating Scream (Terrorgheist)': {
    effects: [
      {
        name: `Devastating Scream (Terrorgheist)`,
        desc: `Add 1 to each of the Death Shriek values on this model's damage table.`,
        when: [SHOOTING_PHASE],
      },
    ],
  },
  'Deathly Fast (Zombie Dragon)': {
    effects: [
      {
        name: `Deathly Fast (Zombie Dragon)`,
        desc: `This model can run and still shoot in the same turn.`,
        when: [MOVEMENT_PHASE, SHOOTING_PHASE],
      },
    ],
  },
  'Razor-clawed (Zombie Dragon)': {
    effects: [
      {
        name: `Razor-clawed (Zombie Dragon)`,
        desc: `Improve the Rend characteristic of this mount's melee weapons by 1.`,
        when: [COMBAT_PHASE],
      },
    ],
  },
  'Baneful Breath (Zombie Dragon)': {
    effects: [
      {
        name: `Baneful Breath (Zombie Dragon)`,
        desc: `You can reroll wound rolls for attacks made with this model's Pestilential Breath.`,
        when: [SHOOTING_PHASE],
      },
    ],
  },
  'Horribly Resilient (Zombie Dragon)': {
    effects: [
      {
        name: `Horribly Resilient (Zombie Dragon)`,
        desc: `This model's Royal Blood ability heals up to 3 wounds instead of up to D3 wounds.`,
        when: [HERO_PHASE],
      },
    ],
  },
  'Necrotic Fangs (Zombie Dragon)': {
    effects: [
      {
        name: `Necrotic Fangs (Zombie Dragon)`,
        desc: `You can reroll the Damage characteristic roll for this model's Snapping Maw.`,
        when: [COMBAT_PHASE],
      },
    ],
  },
  'Death From The Skies (Zombie Dragon)': {
    effects: [
      {
        name: `Death From The Skies (Zombie Dragon)`,
        desc: `Instead of setting up this model on the battlefield, you can place it to one side and say that it is soaring in the skies in reserve. If you do so, at the end of your first movement phase, you must set up this unit on the battlefield more than 9" from any enemy units.`,
        when: [DURING_SETUP, TURN_ONE_END_OF_MOVEMENT_PHASE],
      },
    ],
  },
}

export default tagAs(MountTraits, 'mount_trait')

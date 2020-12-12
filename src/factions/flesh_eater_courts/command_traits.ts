import { tagAs } from 'factions/metatagger'
import {
  CHARGE_PHASE,
  COMBAT_PHASE,
  DURING_GAME,
  DURING_SETUP,
  HERO_PHASE,
  MOVEMENT_PHASE,
  SAVES_PHASE,
  SHOOTING_PHASE,
  START_OF_COMBAT_PHASE,
  START_OF_HERO_PHASE,
  TURN_ONE_END_OF_MOVEMENT_PHASE,
} from 'types/phases'

// Store Command Traits here. You can add them to units, abilties, flavors, and subfactions later.
const CommandTraits = {
  'Crusading Army (Delusion)': {
    effects: [
      {
        name: `Crusading Army (Delusion)`,
        desc: `Add 1 to run and charge rolls for friendly FLESH-EATER COURTS units.`,
        when: [MOVEMENT_PHASE, CHARGE_PHASE],
      },
    ],
  },
  'The Royal Hunt (Delusion)': {
    effects: [
      {
        name: `The Royal Hunt (Delusion)`,
        desc: `You can reroll hit rolls of 1 and wound rolls of 1 for attacks made by friendly FLESH-EATER COURTS units that target a MONSTER.`,
        when: [SHOOTING_PHASE, COMBAT_PHASE],
      },
    ],
  },
  'The Feast Day (Delusion)': {
    effects: [
      {
        name: `The Feast Day (Delusion)`,
        desc: `Once per turn, you can use the Feeding Frenzy command ability without a command point being spent.`,
        when: [COMBAT_PHASE],
      },
    ],
  },
  'A Matter of Honour (Delusion)': {
    effects: [
      {
        name: `A Matter of Honour (Delusion)`,
        desc: `You can reroll hit rolls of 1 for attacks made by friendly FLESH-EATER COURTS units that target a HERO. If the target is a general, you can reroll wound rolls of 1 as well.`,
        when: [COMBAT_PHASE, SHOOTING_PHASE],
      },
    ],
  },
  'The Grand Tournament (Delusion)': {
    effects: [
      {
        name: `The Grand Tournament (Delusion)`,
        desc: `You can reroll hit rolls of 1 for attacks made by friendly FLESH-EATER COURTS HEROES other than your general.`,
        when: [SHOOTING_PHASE, COMBAT_PHASE],
      },
    ],
  },
  'Defenders of the Realm (Delusion)': {
    effects: [
      {
        name: `Defenders of the Realm (Delusion)`,
        desc: `You can reroll save rolls of 1 for friendly FLESH-EATER COURTS units that have at least half their models wholly within their own territory.`,
        when: [SAVES_PHASE],
      },
    ],
  },
  'Bringer of Death (Royalty)': {
    effects: [
      {
        name: `Bringer of Death (Royalty)`,
        desc: `You can reroll wound rolls for attacks made by this general.`,
        when: [SHOOTING_PHASE, COMBAT_PHASE],
      },
    ],
  },
  'Frenzied Flesh-eater (Royalty)': {
    effects: [
      {
        name: `Frenzied Flesh-eater (Royalty)`,
        desc: `You can reroll hit and wound rolls for attacks made by this general if there are any enemy models that have suffered any wounds within 3" of this general.`,
        when: [SHOOTING_PHASE, COMBAT_PHASE],
      },
    ],
  },
  'Savage Beyond Reason (Royalty)': {
    effects: [
      {
        name: `Savage Beyond Reason (Royalty)`,
        desc: `If the unmodified hit roll for an attack made with a melee weapon by this general is 6, that attack inflicts 2 hits on the target instead of 1. Make a wound and save roll for each hit.`,
        when: [COMBAT_PHASE],
      },
    ],
  },
  'Majestic Horror (Royalty)': {
    effects: [
      {
        name: `Majestic Horror (Royalty)`,
        desc: `If this general is chosen as the model that uses a command ability that summons FLESH-EATER COURTS models to the battlefield, they can use it without a command point having to be spent.`,
        when: [COMBAT_PHASE],
      },
    ],
  },
  'Dark Wizardry (Royalty)': {
    effects: [
      {
        name: `Dark Wizardry (Royalty)`,
        desc: `Add 1 to casting, dispelling and unbinding rolls for this general.`,
        when: [HERO_PHASE],
      },
    ],
  },
  'Completely Delusional (Royalty)': {
    effects: [
      {
        name: `Completely Delusional (Royalty)`,
        desc: `Once per battle, if this general has not been slain, you can pick a new delusion in your hero phase to replace the original delusion you chose for your army.`,
        when: [DURING_GAME],
      },
    ],
  },
  'Bringer of Death (Nobility)': {
    effects: [
      {
        name: `Bringer of Death (Nobility)`,
        desc: `You can reroll wound rolls for attacks made by this general.`,
        when: [SHOOTING_PHASE, COMBAT_PHASE],
      },
    ],
  },
  'Frenzied Flesh-eater (Nobility)': {
    effects: [
      {
        name: `Frenzied Flesh-eater (Nobility)`,
        desc: `You can reroll hit and wound rolls for attacks made by this general if there are any enemy models that have suffered any wounds within 3" of this general.`,
        when: [SHOOTING_PHASE, COMBAT_PHASE],
      },
    ],
  },
  'Savage Beyond Reason (Nobility)': {
    effects: [
      {
        name: `Savage Beyond Reason (Nobility)`,
        desc: `If the unmodified hit roll for an attack made with a melee weapon by this general is 6, that attack inflicts 2 hits on the target instead of 1. Make a wound and save roll for each hit.`,
        when: [COMBAT_PHASE],
      },
    ],
  },
  'Hulking Brute (Nobility)': {
    effects: [
      {
        name: `Hulking Brute (Nobility)`,
        desc: `Add 1 to this general's Wounds characteristic.`,
        when: [DURING_GAME],
      },
    ],
  },
  'Cruel Taskmaster (Nobility)': {
    effects: [
      {
        name: `Cruel Taskmaster (Nobility)`,
        desc: `If this general uses a Muster ability you can reroll the dice for this general that determine if slain models are returned to units (you must reroll all of the dice).`,
        when: [HERO_PHASE],
      },
    ],
  },
  'Dark Acolyte (Nobility)': {
    effects: [
      {
        name: `Dark Acolyte (Nobility)`,
        desc: `This general gains the WIZARD keyword and can cast and unbind spells in the same manner as an ABHORRANT GHOUL KING from the Abhorrant Ghoul King warscroll.`,
        when: [HERO_PHASE],
      },
    ],
  },
  'Deathly Fast (Terrorgheist Trait)': {
    effects: [
      {
        name: `Deathly Fast (Terrorgheist Trait)`,
        desc: `This model can run and still shoot in the same turn.`,
        when: [MOVEMENT_PHASE, SHOOTING_PHASE],
      },
    ],
  },
  'Razor-clawed (Terrorgheist Trait)': {
    effects: [
      {
        name: `Razor-clawed (Terrorgheist Trait)`,
        desc: `Improve the Rend characteristic of this mount's melee weapons by 1.`,
        when: [COMBAT_PHASE],
      },
    ],
  },
  'Horribly Infested (Terrorgheist Trait)': {
    effects: [
      {
        name: `Horribly Infested (Terrorgheist Trait)`,
        desc: `This model's Infested ability inflicts 3 mortal wounds instead of D3 mortal wounds.`,
        when: [DURING_GAME],
      },
    ],
  },
  'Horribly Resiliant (Terrorgheist Trait)': {
    effects: [
      {
        name: `Horribly Resiliant (Terrorgheist Trait)`,
        desc: `This model's Royal Blood ability heals up to 3 wounds instead of up to D3 wounds.`,
        when: [HERO_PHASE],
      },
    ],
  },
  'Gruesome Bite (Terrorgheist Trait)': {
    effects: [
      {
        name: `Gruesome Bite (Terrorgheist Trait)`,
        desc: `You can reroll failed hit rolls for attacks made with this mount's Fanged Maw.`,
        when: [COMBAT_PHASE],
      },
    ],
  },
  'Devastating Scream (Terrorgheist Trait)': {
    effects: [
      {
        name: `Devastating Scream (Terrorgheist Trait)`,
        desc: `Add 1 to each of the Death Shriek values on this model's damage table.`,
        when: [SHOOTING_PHASE],
      },
    ],
  },
  'Deathly Fast (Zombie Dragon Trait)': {
    effects: [
      {
        name: `Deathly Fast (Zombie Dragon Trait)`,
        desc: `This model can run and still shoot in the same turn.`,
        when: [MOVEMENT_PHASE, SHOOTING_PHASE],
      },
    ],
  },
  'Razor-clawed (Zombie Dragon Trait)': {
    effects: [
      {
        name: `Razor-clawed (Zombie Dragon Trait)`,
        desc: `Improve the Rend characteristic of this mount's melee weapons by 1.`,
        when: [COMBAT_PHASE],
      },
    ],
  },
  'Baneful Breath (Zombie Dragon Trait)': {
    effects: [
      {
        name: `Baneful Breath (Zombie Dragon Trait)`,
        desc: `You can reroll wound rolls for attacks made with this model's Pestilential Breath.`,
        when: [SHOOTING_PHASE],
      },
    ],
  },
  'Horribly Resilient (Zombie Dragon Trait)': {
    effects: [
      {
        name: `Horribly Resilient (Zombie Dragon Trait)`,
        desc: `This model's Royal Blood ability heals up to 3 wounds instead of up to D3 wounds.`,
        when: [HERO_PHASE],
      },
    ],
  },
  'Necrotic Fangs (Zombie Dragon Trait)': {
    effects: [
      {
        name: `Necrotic Fangs (Zombie Dragon Trait)`,
        desc: `You can reroll the Damage characteristic roll for this model's Snapping Maw.`,
        when: [COMBAT_PHASE],
      },
    ],
  },
  'Death From The Skies (Zombie Dragon Trait)': {
    effects: [
      {
        name: `Death From The Skies (Zombie Dragon Trait)`,
        desc: `Instead of setting up this model on the battlefield, you can place it to one side and say that it is soaring in the skies in reserve. If you do so, at the end of your first movement phase, you must set up this unit on the battlefield more than 9" from any enemy units.`,
        when: [DURING_SETUP, TURN_ONE_END_OF_MOVEMENT_PHASE],
      },
    ],
  },
  'Savage Chivalry': {
    effects: [
      {
        name: `Savage Chivalry`,
        desc: `You can reroll hit rolls of 1 for this general while this general is within 12" of a friendly MORGAUNT SERFS unit.`,
        when: [SHOOTING_PHASE, COMBAT_PHASE],
      },
    ],
  },
  'Grave Robber': {
    effects: [
      {
        name: `Grave Robber`,
        desc: `Add 1 to the Attacks characteristic and Damage characteristic of this general's melee weapons while this general is within 3" of any enemy HEROES with an artifact of power.`,
        when: [COMBAT_PHASE],
      },
    ],
  },
  'Hellish Orator': {
    effects: [
      {
        name: `Hellish Orator`,
        desc: `If this general is on the battlefield at the start of your hero phase, roll a D6. On a 4+ you receive 1 additional command point.`,
        when: [START_OF_HERO_PHASE],
      },
    ],
  },
  'Savage Strike': {
    effects: [
      {
        name: `Savage Strike`,
        desc: `This general and their mount fight at the start of the combat phase if they made a charge move in the same turn. This general and their mount cannot fight again in that combat phase unless a spell or ability allows them to fight more than once.`,
        when: [START_OF_COMBAT_PHASE],
      },
    ],
  },
}

// Always export using tagAs
export default tagAs(CommandTraits, 'command_trait')
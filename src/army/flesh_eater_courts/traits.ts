import { TTraits } from 'types/army'
import {
  CHARGE_PHASE,
  COMBAT_PHASE,
  DURING_GAME,
  DURING_SETUP,
  HERO_PHASE,
  MOVEMENT_PHASE,
  SHOOTING_PHASE,
  TURN_ONE_END_OF_MOVEMENT_PHASE,
} from 'types/phases'

const CommandTraits: TTraits = [
  {
    name: `Crusading Army (Delusion)`,
    effects: [
      {
        name: `Crusading Army (Delusion)`,
        desc: `Add 1 to run and charge rolls for friendly FLESH-EATER COURTS units.`,
        when: [MOVEMENT_PHASE, CHARGE_PHASE],
      },
    ],
  },
  {
    name: `The Royal Hunt (Delusion)`,
    effects: [
      {
        name: `The Royal Hunt (Delusion)`,
        desc: `You can re-roll hit rolls of 1 and wound rolls of 1 for attacks made by friendly FLESH-EATER COURTS units that target a MONSTER.`,
        when: [SHOOTING_PHASE, COMBAT_PHASE],
      },
    ],
  },
  {
    name: `The Feast Day (Delusion)`,
    effects: [
      {
        name: `The Feast Day (Delusion)`,
        desc: `Once per turn, you can use the Feeding Frenzy command ability without a command point being spent.`,
        when: [COMBAT_PHASE],
      },
    ],
  },
  {
    name: `A Matter of Honour (Delusion)`,
    effects: [
      {
        name: `A Matter of Honour (Delusion)`,
        desc: `You can re-roll hit rolls of 1 for attacks made by friendly FLESH-EATER COURTS units that target a HERO. If the target is a general, you can re-roll wound rolls of 1 as well.`,
        when: [COMBAT_PHASE, SHOOTING_PHASE],
      },
    ],
  },
  {
    name: `The Grand Tournament (Delusion)`,
    effects: [
      {
        name: `The Grand Tournament (Delusion)`,
        desc: `You can re-roll hit rolls of 1 for attacks made by friendly FLESH-EATER COURTS HEROES other than your general.`,
        when: [SHOOTING_PHASE, COMBAT_PHASE],
      },
    ],
  },
  {
    name: `Defenders of the Realm (Delusion)`,
    effects: [
      {
        name: `Defenders of the Realm (Delusion)`,
        desc: `You can re-roll save rolls of 1 for friendly FLESH- EATER COURTS units that have at least half their models wholly within their own territory.`,
        when: [SHOOTING_PHASE, COMBAT_PHASE],
      },
    ],
  },
  {
    name: `Bringer of Death (Royalty)`,
    effects: [
      {
        name: `Bringer of Death (Royalty)`,
        desc: `You can re-roll wound rolls for attacks made by this general.`,
        when: [SHOOTING_PHASE, COMBAT_PHASE],
      },
    ],
  },
  {
    name: `Frenzied Flesh-eater (Royalty)`,
    effects: [
      {
        name: `Frenzied Flesh-eater (Royalty)`,
        desc: `You can re-roll hit and wound rolls for attacks made by this general if there are any enemy models that have suffered any wounds within 3" of this general.`,
        when: [SHOOTING_PHASE, COMBAT_PHASE],
      },
    ],
  },
  {
    name: `Savage Beyond Reason (Royalty)`,
    effects: [
      {
        name: `Savage Beyond Reason (Royalty)`,
        desc: `If the unmodified hit roll for an attack made with a melee weapon by this general is 6, that attack inflicts 2 hits on the target instead of 1. Make a wound and save roll for each hit.`,
        when: [COMBAT_PHASE],
      },
    ],
  },
  {
    name: `Majestic Horror (Royalty)`,
    effects: [
      {
        name: `Majestic Horror (Royalty)`,
        desc: `If this general is chosen as the model that uses a command ability that summons FLESH-EATER COURTS models to the battlefield, they can use it without a command point having to be spent.`,
        when: [COMBAT_PHASE],
      },
    ],
  },
  {
    name: `Dark Wizardy (Royalty)`,
    effects: [
      {
        name: `Dark Wizardy (Royalty)`,
        desc: `Add 1 to casting, dispelling and unbinding rolls for this general.`,
        when: [HERO_PHASE],
      },
    ],
  },
  {
    name: `Completely Delusional (Royalty)`,
    effects: [
      {
        name: `Completely Delusional (Royalty)`,
        desc: `Once per battle, if this general has not been slain, you can pick a new delusion in your hero phase to replace the original delusion you chose for your army.`,
        when: [DURING_GAME],
      },
    ],
  },
  {
    name: `Bringer of Death (Nobility)`,
    effects: [
      {
        name: `Bringer of Death (Nobility)`,
        desc: `You can re-roll wound rolls for attacks made by this general.`,
        when: [SHOOTING_PHASE, COMBAT_PHASE],
      },
    ],
  },
  {
    name: `Frenzied Flesh-eater (Nobility)`,
    effects: [
      {
        name: `Frenzied Flesh-eater (Nobility)`,
        desc: `You can re-roll hit and wound rolls for attacks made by this general if there are any enemy models that have suffered any wounds within 3" of this general.`,
        when: [SHOOTING_PHASE, COMBAT_PHASE],
      },
    ],
  },
  {
    name: `Savage Beyond Reason (Nobility)`,
    effects: [
      {
        name: `Savage Beyond Reason (Nobility)`,
        desc: `If the unmodified hit roll for an attack made with a melee weapon by this general is 6, that attack inflicts 2 hits on the target instead of 1. Make a wound and save roll for each hit.`,
        when: [COMBAT_PHASE],
      },
    ],
  },
  {
    name: `Hulking Brute (Nobility)`,
    effects: [
      {
        name: `Hulking Brute (Nobility)`,
        desc: `Add 1 to this general's Wounds characteristic.`,
        when: [DURING_GAME],
      },
    ],
  },
  {
    name: `Cruel Taskmaster (Nobility)`,
    effects: [
      {
        name: `Cruel Taskmaster (Nobility)`,
        desc: `If this general uses a Muster ability you can re-roll the dice for this general that determine if slain models are returned to units (you must re-roll all of the dice).`,
        when: [HERO_PHASE],
      },
    ],
  },
  {
    name: `Dark Acolyte (Nobility)`,
    effects: [
      {
        name: `Dark Acolyte (Nobility)`,
        desc: `This general gains the WIZARD keyword and can cast and unbind spells in the same manner as an ABHORRANT GHOUL KING from the Abhorrant Ghoul King warscroll.`,
        when: [HERO_PHASE],
      },
    ],
  },
  {
    name: `Deathly Fast (Terrorgheist Trait)`,
    effects: [
      {
        name: `Deathly Fast (Terrorgheist Trait)`,
        desc: `This model can run and still shoot in the same turn.`,
        when: [MOVEMENT_PHASE, SHOOTING_PHASE],
      },
    ],
  },
  {
    name: `Razor-clawed (Terrorgheist Trait)`,
    effects: [
      {
        name: `Razor-clawed (Terrorgheist Trait)`,
        desc: `Improve the Rend characteristic of this mount's melee weapons by 1.`,
        when: [COMBAT_PHASE],
      },
    ],
  },
  {
    name: `Horribly Infested (Terrorgheist Trait)`,
    effects: [
      {
        name: `Horribly Infested (Terrorgheist Trait)`,
        desc: `This model's Infested ability inflicts 3 mortal wounds instead of D3 mortal wounds.`,
        when: [DURING_GAME],
      },
    ],
  },
  {
    name: `Horribly Resiliant (Terrorgheist Trait)`,
    effects: [
      {
        name: `Horribly Resiliant (Terrorgheist Trait)`,
        desc: `This model's Royal Blood ability heals up to 3 wounds instead of up to D3 wounds.`,
        when: [HERO_PHASE],
      },
    ],
  },
  {
    name: `Gruesome Bite (Terrorgheist Trait)`,
    effects: [
      {
        name: `Gruesome Bite (Terrorgheist Trait)`,
        desc: `You can re-roll failed hit rolls for attacks made with this mount's Fanged Maw.`,
        when: [COMBAT_PHASE],
      },
    ],
  },
  {
    name: `Devastating Scream (Terrorgheist Trait)`,
    effects: [
      {
        name: `Devastating Scream (Terrorgheist Trait)`,
        desc: `Add 1 to each of the Death Shriek values on this model's damage table.`,
        when: [SHOOTING_PHASE],
      },
    ],
  },
  {
    name: `Deathly Fast (Zombie Dragon Trait)`,
    effects: [
      {
        name: `Deathly Fast (Zombie Dragon Trait)`,
        desc: `This model can run and still shoot in the same turn.`,
        when: [MOVEMENT_PHASE, SHOOTING_PHASE],
      },
    ],
  },
  {
    name: `Razor-clawed (Zombie Dragon Trait)`,
    effects: [
      {
        name: `Razor-clawed (Zombie Dragon Trait)`,
        desc: `Improve the Rend characteristic of this mount's melee weapons by 1.`,
        when: [COMBAT_PHASE],
      },
    ],
  },
  {
    name: `Baneful Breath (Zombie Dragon Trait)`,
    effects: [
      {
        name: `Baneful Breath (Zombie Dragon Trait)`,
        desc: `You can re-roll wound rolls for attacks made with this model's Pestilential Breath.`,
        when: [SHOOTING_PHASE],
      },
    ],
  },
  {
    name: `Horribly Resilient (Zombie Dragon Trait)`,
    effects: [
      {
        name: `Horribly Resilient (Zombie Dragon Trait)`,
        desc: `This model's Royal Blood ability heals up to 3 wounds instead of up to D3 wounds.`,
        when: [HERO_PHASE],
      },
    ],
  },
  {
    name: `Necrotic Fangs (Zombie Dragon Trait)`,
    effects: [
      {
        name: `Necrotic Fangs (Zombie Dragon Trait)`,
        desc: `You can re-roll the Damage characteristic roll for this model's Snapping Maw.`,
        when: [COMBAT_PHASE],
      },
    ],
  },
  {
    name: `Death From The Skies (Zombie Dragon Trait)`,
    effects: [
      {
        name: `Death From The Skies (Zombie Dragon Trait)`,
        desc: `Instead of setting up this model on the battlefield, you can place it to one side and say that it is soaring in the skies in reserve. If you do so, at the end of your first movement phase, you must set up this unit on the battlefield more than 9" from any enemy units.`,
        when: [DURING_SETUP, TURN_ONE_END_OF_MOVEMENT_PHASE],
      },
    ],
  },
]

export default CommandTraits

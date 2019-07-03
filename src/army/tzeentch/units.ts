import { TBattalions, TUnits } from 'types/army'
import {
  HERO_PHASE,
  START_OF_HERO_PHASE,
  DURING_GAME,
  SHOOTING_PHASE,
  END_OF_SETUP,
  BATTLESHOCK_PHASE,
  COMBAT_PHASE,
} from 'types/phases'

// Unit Names
export const Units: TUnits = [
  {
    name: ``,
    effects: [
      {
        name: ``,
        desc: ``,
        when: [HERO_PHASE],
      },
    ],
  },
  {
    name: `Kairos Fateweaver`,
    effects: [
      {
        name: ``,
        desc: ``,
        when: [HERO_PHASE],
      },
    ],
  },
  {
    name: `Lord of Change`,
    effects: [
      {
        name: ``,
        desc: ``,
        when: [HERO_PHASE],
      },
    ],
  },
  {
    name: `The Changeling`,
    effects: [
      {
        name: ``,
        desc: ``,
        when: [HERO_PHASE],
      },
    ],
  },
  {
    name: `Herald of Tzeentch`,
    effects: [
      {
        name: ``,
        desc: ``,
        when: [HERO_PHASE],
      },
    ],
  },
  {
    name: `Herald of Tzeentch on Disc`,
    effects: [
      {
        name: ``,
        desc: ``,
        when: [HERO_PHASE],
      },
    ],
  },
  {
    name: `Herald of Tzeentch on Burning Chariot`,
    effects: [
      {
        name: ``,
        desc: ``,
        when: [HERO_PHASE],
      },
    ],
  },
  {
    name: `The Blue Scribes`,
    effects: [
      {
        name: ``,
        desc: ``,
        when: [HERO_PHASE],
      },
    ],
  },
  {
    name: `Daemon Prince of Tzeentch`,
    effects: [
      {
        name: ``,
        desc: ``,
        when: [HERO_PHASE],
      },
    ],
  },
  {
    name: `Exalted Greater Daemon of Tzeentch`,
    effects: [
      {
        name: ``,
        desc: ``,
        when: [HERO_PHASE],
      },
    ],
  },
  {
    name: `Pink Horrors of Tzeentch`,
    effects: [
      {
        name: ``,
        desc: ``,
        when: [HERO_PHASE],
      },
    ],
  },
  {
    name: `Blue Horrors of Tzeentch`,
    effects: [
      {
        name: ``,
        desc: ``,
        when: [HERO_PHASE],
      },
    ],
  },
  {
    name: `Brimstone Horrors of Tzeentch`,
    effects: [
      {
        name: ``,
        desc: ``,
        when: [HERO_PHASE],
      },
    ],
  },
  {
    name: `Exalted Flamers of Tzeentch`,
    effects: [
      {
        name: ``,
        desc: ``,
        when: [HERO_PHASE],
      },
    ],
  },
  {
    name: `Flamers of Tzeentch`,
    effects: [
      {
        name: ``,
        desc: ``,
        when: [HERO_PHASE],
      },
    ],
  },
  {
    name: `Screamers of Tzeentch`,
    effects: [
      {
        name: ``,
        desc: ``,
        when: [HERO_PHASE],
      },
    ],
  },
  {
    name: `Burning Chariots of Tzeentch`,
    effects: [
      {
        name: ``,
        desc: ``,
        when: [HERO_PHASE],
      },
    ],
  },
]

// Battalions
export const Battalions: TBattalions = [
  {
    name: `Witchfyre Coven`,
    effects: [
      {
        name: `Mastery of Wyrdflame`,
        desc: `You can make a Sorcerous Bolt attack with each Kairic Acolyte model from a Witchfyre Coven in each of your hero phases.`,
        when: [HERO_PHASE],
      },
    ],
  },
  {
    name: `Skyshoal Coven`,
    effects: [
      {
        name: `Scintillating Attack Run`,
        desc: `In each of your hero phases, you can move any units from a Skyshoal Coven up to 9" as if it were the movement phase (they cannot run as part of this move, and it does not stop them from moving normally later in the turn). After a unit moves in this manner, you can pick an enemy unit that it moved across.RolladiceforeachmodelintheSkyshoalCovenunit;foreachrollof6,the unit it moved across suffers a mortal wound.`,
        when: [HERO_PHASE],
      },
    ],
  },
  {
    name: `Tzaangor Coven`,
    effects: [
      {
        name: `Aspirant Gor-kin`,
        desc: `If the unit of Tzaangors from a Tzaangor Coven is within 9" of the battalion’s unit of Tzaangor Enlightened or Tzaangor Skyfiresat the start of your hero phase, they may pile in and attack as if it were the combat phase. If the unit of Tzaangors is within 9" of both of these units at the start of your hero phase, then you can also add 1 to their wound rolls when they attack in this manner.`,
        when: [START_OF_HERO_PHASE],
      },
      {
        name: `Ferocious Fighters`,
        desc: `Vicious Beak attacks made by models from a Tzaangor Coven wound on a roll of 4+ instead of 5+.`,
        when: [COMBAT_PHASE],
      },
    ],
  },
  {
    name: `Cult of the Transient Form`,
    effects: [
      {
        name: `The Change-gift`,
        desc: `Roll a dice each time a Kairic Acolyte from the Cult of the Transient Form is slain. On a roll of 6, they are blessed with new life and are transmogrified into a Tzaangor. If there is already a friendly Tzaangor unit within 6" of the slain model’s unit, add the Tzaangor to that unit, otherwise set it up as a new unit within 6" of the slain model’s unit. In addition, roll a dice each time a HERO from the Cult of the Transient Form is slain. On a roll of 6 they are reborn as a horrific Chaos Spawn; set up a Chaos Spawn under your control anywhere within 6" of the slain HERO model just before removing it.`,
        when: [DURING_GAME],
      },
    ],
  },
  {
    name: `The Profane Cult`,
    effects: [
      {
        name: `Arch-Pyromancers`,
        desc: `You can add 1 to the wound rolls of Sorcerous Bolt attacks made by Kairic Acolytes from the Pyrofane Cult for each other unit from the battalion that attacked the target unit with Sorcerous Bolts earlier in the same phase. For example, if two units of Kairic Acolytes from the Pyrofane Cult had already targeted a unit with Sorcerous Bolts, you could add 2 to the wound rolls of the third unit that did so.`,
        when: [SHOOTING_PHASE],
      },
    ],
  },
  {
    name: `Alter-kin Coven`,
    effects: [
      {
        name: `Boon of Mutation`,
        desc: `In each of your hero phases, roll a dice for each enemy unit that is within 3" of a unit from an Alter-kin Coven. On a roll of a 6, the unit being rolled for suffers D3 mortal wounds. If any models are slain in this manner, they are blessed with mutation and transmogrified into a Tzaangor. If there is already a friendly Tzaangor unit within 6" of the slain model’s unit, add the Tzaangor to that unit, otherwise set it up as a new unit within 6" of the slain model’s unit.`,
        when: [HERO_PHASE],
      },
    ],
  },
  {
    name: `Arcanite Cabal`,
    effects: [
      {
        name: `Master of the Cult`,
        desc: `Each time you use a Destiny Dice to predetermine a dice roll for the master of the cult, roll a dice; on a roll of 4, 5 or 6, you may roll another dice and immediately add it to your Destiny Dice pool.`,
        when: [DURING_GAME],
      },
      {
        name: `Cabal of Sorcerers`,
        desc: `Each model from an Arcanite Cabal that is within 9" of at least two other models from the same battalion in your hero phase can attempt to cast one additional spell.`,
        when: [HERO_PHASE],
      },
    ],
  },
  {
    name: `Arcanite Cult`,
    effects: [
      {
        name: `Destiny Preordained`,
        desc: `When generating your Destiny Dice pool at the start of the battle, you can choose the results of 3 of the dice before rolling the remaining 6 dice as normal.`,
        when: [END_OF_SETUP],
      },
      {
        name: `Strength in Conviction`,
        desc: `Add 1 to the Bravery of all models in an Arcanite Cult.`,
        when: [BATTLESHOCK_PHASE],
      },
    ],
  },
  {
    name: `Aether-eater Host`,
    effects: [
      {
        name: `Feed of Magic`,
        desc: `If a unit from an Aether-eater Host successfully unbinds a spell cast by an enemy model, they immediately heal D3 wounds. Whilst an Aether-eater Host has 9 or more units, then any units of Screamers from the battalion can attempt to unbind one spell in each enemy hero phase in the same manner as a wizard (meaning they can also heal wounds as described above).`,
        when: [HERO_PHASE],
      },
    ],
  },
  {
    name: `Changehost`,
    effects: [
      {
        name: `Deceive and Dismay`,
        desc: `In each of your hero phases, you may pick a pair of units from this battalion that are within 27" of the battalion’s Lord of Change to swap places. To do so, take one model from each unit, and have them swap places on the battlefield. Then, remove all of the other models from the two units, and set them back up within 9" of the model from their unit that first swapped places. Whilst a Changehost has 9 or more units, then two different pairs of units can swap places rather than only one. Whilst it has 18 or more units, then three different pairs of units can swap places instead.`,
        when: [HERO_PHASE],
      },
    ],
  },
  {
    name: `Multitudinous Host`,
    effects: [
      {
        name: `Horrors Without Number`,
        desc: `In each of your hero phases, add D6 models to each unit of Pink Horrors and/or Blue Horrors, and add D3 models to each unit of Brimstone Horrors in this battalion.`,
        when: [HERO_PHASE],
      },
    ],
  },
  {
    name: `Omniscient Oracles`,
    effects: [
      {
        name: `Knowledge of Past, Present and Future`,
        desc: `You can re-roll any hit, wound, save and run rolls of 1 – as well as any dice rolls of 1 in a charge roll –for models from this battalion.`,
        when: [DURING_GAME],
      },
    ],
  },
  {
    name: `Overseer's Fate-twisters`,
    effects: [
      {
        name: `The Will of Tzeentch`,
        desc: `At the start of each of your hero phases, add 1 dice to your Destiny Dice pool whilst at least one model from this battalion is on the battlefield. In addition, you can choose to substitute dice rolls that you have already made with Destiny Dice (rather than substituting them before rolling) whilst this battalion has 9 or more models.`,
        when: [START_OF_HERO_PHASE],
      },
      {
        name: `Master of Fate`,
        desc: `If the Lord of Change from this battalion is on the battlefield, then in each of your hero phases you can choose to re-roll the result of one of the dice in your Destiny Dice pool.`,
        when: [HERO_PHASE],
      },
    ],
  },
  {
    name: `The Eternal Conflagration`,
    effects: [
      {
        name: `Pawns of the Radiant Lord`,
        desc: `When the Lord of Change that must be taken in this battalion attempts to cast a spell, you can select any Flamer from this battalion to act as the casting model – range, visibility and so on are all measured from that model.`,
        when: [HERO_PHASE],
      },
      {
        name: `Coruscating Flames`,
        desc: `Your opponent must subtract 1 from any hit rolls that target units of Flamers and Exalted Flamers of Tzeentch from the Eternal Conflagration in the shooting phase.`,
        when: [SHOOTING_PHASE],
      },
    ],
  },
  {
    name: `The Hosts Duplicitous`,
    effects: [
      {
        name: `Glamoursmiths`,
        desc: `When a WIZARD from this battalion rolls a 1 on any dice as part of a casting roll, count it as a 2instead.`,
        when: [HERO_PHASE],
      },
    ],
  },
  {
    name: `Warpflame Host`,
    effects: [
      {
        name: `Storm of Daemonic Fire`,
        desc: `In each of your hero phases, roll a dice for each enemy unit that is within 9" of a unit from a Warpflame Host. On a roll of a 6, the unit being rolled for suffers D3 mortal wounds.`,
        when: [HERO_PHASE],
      },
    ],
  },
]

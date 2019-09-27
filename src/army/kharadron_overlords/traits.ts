import { TTraits } from 'types/army'
import {
  BATTLESHOCK_PHASE,
  CHARGE_PHASE,
  COMBAT_PHASE,
  DURING_GAME,
  DURING_SETUP,
  END_OF_SETUP,
  HERO_PHASE,
  MOVEMENT_PHASE,
  SHOOTING_PHASE,
  START_OF_GAME,
  START_OF_HERO_PHASE,
} from 'types/phases'

const CommandTraits: TTraits = [
  {
    name: `Doughty Champion`,
    effects: [
      {
        name: `Doughty Champion`,
        desc: `Ignore mortal wounds on 5+.`,
        when: [DURING_GAME],
      },
    ],
  },
  {
    name: `Fleetmaster`,
    effects: [
      {
        name: `Fleetmaster`,
        desc: `Can remove SKYVESSEL and set-up again.`,
        when: [END_OF_SETUP],
      },
    ],
  },
  {
    name: `Grudgebearer`,
    effects: [
      {
        name: `Grudgebearer`,
        desc: `+1 Attack to chosen melee weapon.`,
        when: [COMBAT_PHASE],
      },
    ],
  },
  {
    name: `Stickler for the Code`,
    effects: [
      {
        name: `Stickler for the Code`,
        desc: `Generate additional unique footnote. Lost if general is slain.`,
        when: [START_OF_GAME],
      },
    ],
  },
  {
    name: `Prospector`,
    effects: [
      {
        name: `Prospector`,
        desc: `Choose terrain. While general is alive, units pass battleshock if on or within terrain.`,
        when: [END_OF_SETUP],
      },
    ],
  },
  {
    name: `Rising Star`,
    effects: [
      {
        name: `Rising Star`,
        desc: `Units within 7" can use General's Bravery.`,
        when: [DURING_GAME],
      },
    ],
  },
  {
    name: `ARTYCLE: Defend Your Territory`,
    effects: [
      {
        name: `ARTYCLE: Defend Your Territory`,
        desc: `Re-roll battleshock tests for units wholly within your territory.`,
        when: [DURING_GAME],
      },
    ],
  },
  {
    name: `ARTYCLE: Honour is Everything`,
    effects: [
      {
        name: `ARTYCLE: Honour is Everything`,
        desc: `Re-roll hit and wounds of 1 vs HERO and MONSTER.`,
        when: [SHOOTING_PHASE, COMBAT_PHASE],
      },
    ],
  },
  {
    name: `ARTYCLE: Master the Skies`,
    effects: [
      {
        name: `ARTYCLE: Master the Skies`,
        desc: `Re-roll hit and wounds of 1 vs flying units.`,
        when: [SHOOTING_PHASE, COMBAT_PHASE],
      },
    ],
  },
  {
    name: `ARTYCLE: Respect Your Commanders`,
    effects: [
      {
        name: `ARTYCLE: Respect Your Commanders`,
        desc: `Re-roll battleshock when within 8" of a HERO.`,
        when: [DURING_GAME],
      },
    ],
  },
  {
    name: `ARTYCLE: Seek New Prospects`,
    effects: [
      {
        name: `ARTYCLE: Seek New Prospects`,
        desc: `Re-roll battleshock tests for units wholly within enemy territory.`,
        when: [DURING_GAME],
      },
    ],
  },
  {
    name: `ARTYCLE: Settle the Grudges`,
    effects: [
      {
        name: `ARTYCLE: Settle the Grudges`,
        desc: `Choose an enemy unit, re-roll hit and wounds of 1 vs this enemy.`,
        when: [END_OF_SETUP, DURING_GAME],
      },
    ],
  },
  {
    name: `AMENDMENT: Always Take What You Are Owed`,
    effects: [
      {
        name: `AMENDMENT: Always Take What You Are Owed`,
        desc: `Your Army can include one additional artifact of power.`,
        when: [DURING_SETUP],
      },
    ],
  },
  {
    name: `AMENDMENT: Don't Argue With the Wind`,
    effects: [
      {
        name: `AMENDMENT: Don't Argue With the Wind`,
        desc: `When you run with a SKYVESSEL, result is always 6.`,
        when: [MOVEMENT_PHASE],
      },
    ],
  },
  {
    name: `AMENDMENT: Leave no Duardin Behind`,
    effects: [
      {
        name: `AMENDMENT: Leave no Duardin Behind`,
        desc: `If unit within 7" of SKYVESSEL fails battleshock, does not flee on 5+.`,
        when: [BATTLESHOCK_PHASE],
      },
    ],
  },
  {
    name: `AMENDMENT: Prosecute Wars With All Haste`,
    effects: [
      {
        name: `AMENDMENT: Prosecute Wars With All Haste`,
        desc: `In first turn, units can run and shoot.`,
        when: [MOVEMENT_PHASE, SHOOTING_PHASE],
      },
    ],
  },
  {
    name: `AMENDMENT: Trust Aethermatics, Not Superstition`,
    effects: [
      {
        name: `AMENDMENT: Trust Aethermatics, Not Superstition`,
        desc: `HEROES can unbind +1 spell.`,
        when: [HERO_PHASE],
      },
    ],
  },
  {
    name: `AMENDMENT: Trust to Your Guns`,
    effects: [
      {
        name: `AMENDMENT: Trust to Your Guns`,
        desc: `+1 to bravery when not within 3" of enemies.`,
        when: [DURING_GAME],
      },
    ],
  },
  {
    name: `FOOTNOTE: Surrender is Rarely Profitable`,
    effects: [
      {
        name: `FOOTNOTE: Surrender is Rarely Profitable`,
        desc: `Once per battle, replace battleshock roll with 1.`,
        when: [BATTLESHOCK_PHASE],
      },
    ],
  },
  {
    name: `FOOTNOTE: There's no Reward Without Risk`,
    effects: [
      {
        name: `FOOTNOTE: There's no Reward Without Risk`,
        desc: `Once per battle, re-roll one charge roll.`,
        when: [CHARGE_PHASE],
      },
    ],
  },
  {
    name: `FOOTNOTE: There's no Trading With Some People`,
    effects: [
      {
        name: `FOOTNOTE: There's no Trading With Some People`,
        desc: `Once per battle, if enemy suffers 1 unsaved wound, suffer D3 mortal wounds.`,
        when: [COMBAT_PHASE, SHOOTING_PHASE, HERO_PHASE],
      },
    ],
  },
  {
    name: `FOOTNOTE: Today's Foes are Tomorrow's Customers`,
    effects: [
      {
        name: `FOOTNOTE: Today's Foes are Tomorrow's Customers`,
        desc: `Once per battle, replace run roll when retreating with 6.`,
        when: [MOVEMENT_PHASE],
      },
    ],
  },
  {
    name: `FOOTNOTE: Without Our Ships, We Are Naught`,
    effects: [
      {
        name: `FOOTNOTE: Without Our Ships, We Are Naught`,
        desc: `Once per battle, re-roll SKYVESSEL heal roll.`,
        when: [HERO_PHASE],
      },
    ],
  },
  {
    name: `FOOTNOTE: These Are Just Guidelines`,
    effects: [
      {
        name: `FOOTNOTE: These Are Just Guidelines`,
        desc: `Once per battle, change army's ARTYCLE.`,
        when: [START_OF_HERO_PHASE],
      },
    ],
  },
]

export default CommandTraits

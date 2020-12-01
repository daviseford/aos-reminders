import { TEntry } from 'types/data'
import {
  BATTLESHOCK_PHASE,
  COMBAT_PHASE,
  DURING_GAME,
  DURING_SETUP,
  END_OF_COMBAT_PHASE,
  END_OF_MOVEMENT_PHASE,
  END_OF_SHOOTING_PHASE,
  HERO_PHASE,
  MOVEMENT_PHASE,
  SAVES_PHASE,
  SHOOTING_PHASE,
  START_OF_BATTLESHOCK_PHASE,
  START_OF_COMBAT_PHASE,
  START_OF_HERO_PHASE,
  START_OF_SETUP,
  TURN_FOUR_START_OF_ROUND,
  TURN_ONE_DURING_ROUND,
  TURN_ONE_MOVEMENT_PHASE,
  TURN_ONE_START_OF_HERO_PHASE,
} from 'types/phases'

const Allegiances: TEntry[] = [
  {
    name: `Hammerhal`,
    effects: [
      {
        name: `Banners Held High`,
        desc: `At the start of your hero phase, roll a D6 for each friendly HAMMERHAL unit that includes any Standard Bearers. For each 6, you receive 1 extra command point.`,
        when: [START_OF_HERO_PHASE],
      },
      {
        name: `The Magister of Hammerhal`,
        desc: `If your army includes AVENTIS FIRESTRIKE and he is your general, you receive 1 extra command point.`,
        when: [TURN_ONE_START_OF_HERO_PHASE],
      },
      {
        name: `The Pride of Hammerhal`,
        desc: `Do not take battleshock tests for HAMMERHAL units that are wholly within your territory.`,
        when: [BATTLESHOCK_PHASE],
      },
      {
        name: `Righteous Purpose`,
        desc: `Pick 1 friendly HAMMERHAL unit that is wholly within enemy territory, wholly within 12" of a friendly HAMMERHAL HERO, and within 3" of an enemy unit. That friendly unit can fight. A unit cannot benefit from this command ability more than once per phase.`,
        when: [END_OF_COMBAT_PHASE],
        command_ability: true,
      },
    ],
  },
  {
    name: `The Living City`,
    effects: [
      {
        name: `Hunters of the Hidden Paths`,
        desc: `You can set up 1 reserve unit on the hidden paths for each LIVING CITY unit you have set up on the battlefield.
        At the end of your movement phase, you can setup 1 or more of these units on the battlefield, wholly within 6" of the edge of the battlefield and more than 9" from any enemy units. Any reserve units on the hidden paths that are not set up on the battlefield before the start of the fourth battleround are destroyed.`,
        when: [DURING_SETUP],
      },
      {
        name: `Attuned to Nature`,
        desc: `You can heal 1 wound allocated to each friendly LIVING CITY unit.`,
        when: [START_OF_HERO_PHASE],
      },
      {
        name: `Strike then Melt Away`,
        desc: `Pick 1 friendly LIVING CITY unit that shot in that phase, is more than 9" from any enemy units and is wholly within 18" of af riendly LIVING CITY HERO. That unit can make a normal move (it cannot run). A unit cannot benefit from this command ability more than once per phase.`,
        when: [END_OF_SHOOTING_PHASE],
        command_ability: true,
      },
    ],
  },
  {
    name: `Greywater Fastness`,
    effects: [
      {
        name: `Rune Lore`,
        desc: `In your hero phase, 1 friendly GREYWATER FASTNESS RUNELORD can chant the following prayer in addition to any prayer on their warscroll. If they do so, make a prayer roll by rolling a dice. On a 1, the prayer is not answered. On a 2+, the prayer is answered.

        Rune of Unfaltering Aim: If this prayer is answered, pick 1 friendly IRONWELD ARSENAL WAR MACHINE unit within 3" of this model. Until the start of your next hero phase, add 1 to hit rolls for attacks made with missile weapons by that unit.`,
        when: [HERO_PHASE],

        prayer: true,
      },
      {
        name: `Home of the Great Ironweld Guilds`,
        desc: `Increase the Range characteristic of missile weapons used by friendly GREYWATER FASTNESS IRONWELD ARSENAL units by 3" (this does not affect the weapon's minimum range, if it has one).`,
        when: [SHOOTING_PHASE],
      },
      {
        name: `Salvo Fire`,
        desc: `You can use this command ability in your shooting phase. If you do so, pick 1 friendly GREYWATER FASTNESS FREEGUILD HANDGUNNERS unit or 1 friendly GREYWATER FASTNESS IRONDRAKES unit wholly within 12" of a friendly GREYWATER FASTNESS HERO. Add 1 to hit rolls for attacks made with missile weapons by that unit until the end of that phase. A unit cannot benefit from this command ability more than once per phase.`,
        when: [SHOOTING_PHASE],
        command_ability: true,
      },
    ],
  },
  {
    name: `The Phoenicium`,
    effects: [
      {
        name: `Vengeful Revenants`,
        desc: `Add 1 to hit and wound rolls for attacks made with melee weapons by friendly PHOENICIUM units if any friendly PHOENICIUM units have been destroyed in the same phase.`,
        when: [COMBAT_PHASE],
      },
      {
        name: `Blood of the Ur-Phoenix`,
        desc: `Add 1 to the Wounds characteristic of PHOENICIUM FROSTHEART PHOENIXES and PHOENICIUM FLAMESPYRE PHOENIXES.`,
        when: [DURING_GAME],
      },
      {
        name: `Living Idols`,
        desc: `You can use this command ability at the start of the combat phase. If you do so, pick 1 friendly PHOENICIUM HERO FLAMESPYRE PHOENIX or 1 friendly PHOENICIUM HERO FROSTHEART PHOENIX. Until the end of that phase, if a friendly PHOENICIUM model is slain while it is within 12" of that HERO, that model can fight before it is removed from play.`,
        when: [START_OF_COMBAT_PHASE],
        command_ability: true,
      },
    ],
  },
  {
    name: `Anvilgard`,
    effects: [
      {
        name: `Illicit Dealings`,
        desc: `When you choose an Anvilgard army, you can profit from one of the following benefits of illicit dealings:

        Black Market Bounty: 1 additional friendly ANVILGARD HERO can bear an artefact of power from the Anvilgard Artefacts of Power table.

        Dabblings in Sorcery: 1 additional friendly ANVILGARD DRAGON, ANVILGARD KHARIBDYSS or ANVILGARD WAR HYDRA can have a Drakeblood curse from the Drakeblood Curses table.

        Hidden Agents: You receive D3 extra command points.`,
        when: [START_OF_SETUP],
      },
      {
        name: `Drakeblood Curses`,
        desc: `If an Anvilgard army includes any DRAGONS, KHARIBDYSSES or WAR HYDRAS, 1 of those models has a Drakeblood curse. Choose which model will have the Drakeblood curse, then pick from or roll on the Drakeblood Curses table opposite.

        You can choose 1 additional friendly ANVILGARD DRAGON, ANVILGARD KHARIBDYSS or ANVILGARD WAR HYDRA to have a Drakeblood curse for each warscroll battalion in your army. A model cannot have more than 1 Drakeblood curse, and an army may not include duplicates of the same Drakeblood curse.`,
        when: [START_OF_SETUP],
      },
      {
        name: `Make an Example of the Weak (Anvilgard)`,
        desc: `You can use this command ability at the start of the battleshock phase. If you do so, pick 1 friendly ANVILGARD unit wholly within 12" of a friendly ANVILGARD HERO. 1 model in that unit is slain. However, in that phase, you do not need to take battleshock tests for friendly ANVILGARD units wholly within 18" of that unit.`,
        when: [START_OF_BATTLESHOCK_PHASE],
        command_ability: true,
      },
    ],
  },
  {
    name: `Hallowheart`,
    effects: [
      {
        name: `Eldritch Attunement`,
        desc: `Each time a friendly HALLOWHEART unit is affected by a spell or endless spell, you can roll a D6. If you do so, on a 5+, ignore the effects of that spell or endless spell on that unit.`,
        when: [HERO_PHASE],
      },
      {
        name: `Mages of the Whitefire Court`,
        desc: `HALLOWHEART WIZARDS can attempt to cast 1 extra spell in each of their hero phases.`,
        when: [HERO_PHASE],
      },
      {
        name: `Arcane Channelling`,
        desc: `You can use this command ability once per turn at the start of your hero phase. If you do so, pick 1 friendly HALLOWHEART WIZARD HERO and roll a D6. That WIZARD suffers a number of mortal wounds equal to that roll. In addition, until the start of your next hero phase, add the number of mortal wounds suffered by that WIZARD and not negated to casting rolls made by other friendly HALLOWHEART WIZARDS while they are within 12" of that WIZARD.`,
        when: [START_OF_HERO_PHASE],
        command_ability: true,
      },
    ],
  },
  {
    name: `Tempest's Eye`,
    effects: [
      {
        name: `Alert and Forewarned`,
        desc: `Add 3" to the Move characteristic of friendly TEMPEST'S EYE units until the end of the first battle round.`,
        when: [TURN_ONE_MOVEMENT_PHASE],
      },
      {
        name: `Alert and Forewarned`,
        desc: `Add 1 to save rolls for attacks that target friendly TEMPEST'S EYE units in the first battle round.`,
        when: [TURN_ONE_DURING_ROUND, SAVES_PHASE],
      },
      {
        name: `Outriders of the Realms`,
        desc: `Add 1 to run rolls for friendly TEMPEST'S EYE units.`,
        when: [MOVEMENT_PHASE],
      },
      {
        name: `Rapid Redeploy`,
        desc: `You can use this command ability in your shooting phase. If you do so, pick 1 friendly TEMPEST'S EYE unit that is wholly within 12" of a friendly TEMPEST'S EYE HERO. That unit can shoot even if it ran in the same turn.`,
        when: [SHOOTING_PHASE],
        command_ability: true,
      },
    ],
  },
  {
    name: `Misthavn`,
    effects: [
      {
        name: `Underhanded Tactics`,
        desc: `You may set up the following units in reserve (max size 10 models per unit) : Misthavn Order Sepentis, Shadowblades or Scourge Privateers. 
               1 unit may be in reserve for each Darkling Covens, Freeguild, or Duardin unit already on the battlefield.`,
        when: [DURING_SETUP],
      },
      {
        name: `Underhanded Tactics`,
        desc: `You may set up 1 or more units from reserve more than 9" from enemy units.`,
        when: [END_OF_MOVEMENT_PHASE],
      },
      {
        name: `Underhanded Tactics`,
        desc: `Any of your units still in reserve are slain.`,
        when: [TURN_FOUR_START_OF_ROUND],
      },
      {
        name: `Misthavn Narcotics`,
        desc: `An equipped hero can use its narcotic once per battle. It has no effect on the bearer's mount.`,
        when: [HERO_PHASE],
      },
      {
        name: `Shadowstrike`,
        desc: `Once per turn, when you set up a flanking force from your reserve wholly within 12" of a friendly Misthavn hero, that unit can move up to D6" (it cannot run).`,
        when: [END_OF_MOVEMENT_PHASE],
        command_ability: true,
      },
    ],
  },
  {
    name: `Har Kuron`,
    effects: [
      {
        name: `Temples of Khaine`,
        desc: `You can pick 1 friendly Daughters of Khaine priest to attempt the Incitement to Murder prayer in addition to their 1 normal prayer.`,
        when: [HERO_PHASE],
      },
      {
        name: `Incitement to Murder`,
        desc: `If successful, pick 1 friendly Har Kuron unit wholly within 12" of the priest. Until the start of your next hero phase, unmodified hits of 6 made by the target score 2 hits instead of 1.
               The same unit cannot benefit from this ability more that once per phase.`,
        when: [HERO_PHASE],
      },
      {
        name: `Incitement to Murder`,
        desc: `If active, unmodified hits of 6 made by the target score 2 hits instead of 1.`,
        when: [SHOOTING_PHASE, COMBAT_PHASE],
      },
      {
        name: `Make an Example of the Weak (Har Kuron)`,
        desc: `Pick 1 friendly Har Kuron unit wholly within 12" of a friendly Har Kuron hero. 1 model in the target unit is slain. Friendly Har Kuron units within 18" of the targeted unit do not need to take battleshock tests.`,
        when: [START_OF_BATTLESHOCK_PHASE],
        command_ability: true,
      },
    ],
  },
]

export default Allegiances

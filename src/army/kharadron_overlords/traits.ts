import { TTraits } from 'types/army'
import { TEffects, TEntry } from 'types/data'
import {
  BATTLESHOCK_PHASE,
  CHARGE_PHASE,
  COMBAT_PHASE,
  DURING_GAME,
  END_OF_COMBAT_PHASE,
  END_OF_SETUP,
  HERO_PHASE,
  MOVEMENT_PHASE,
  SHOOTING_PHASE,
  START_OF_COMBAT_PHASE,
  START_OF_GAME,
  START_OF_HERO_PHASE,
  START_OF_SETUP,
  START_OF_SHOOTING_PHASE,
  TURN_ONE_MOVEMENT_PHASE,
  TURN_ONE_SHOOTING_PHASE,
  WOUND_ALLOCATION_PHASE,
} from 'types/phases'
import { GreatEndrinworks } from './artifacts'

const effectToEntry = (effect: TEffects): TEntry => {
  return {
    name: effect.name,
    effects: [effect],
  }
}

const GreatEndrinworksTraits = GreatEndrinworks.map(x => ({ ...x, mount_trait: true }))

export const ProsecuteWarsWithAllHasteEffect = {
  name: `AMENDMENT: Prosecute Wars With All Haste`,
  desc: `In your first turn, friendly KHARADRON OVERLORDS units can run and still shoot later in the turn.`,
  when: [TURN_ONE_MOVEMENT_PHASE, TURN_ONE_SHOOTING_PHASE],
  command_trait: true,
}
export const HonourIsEverythingEffect = {
  name: `ARTYCLE: Honour is Everything`,
  desc: `You can reroll hit rolls of 1 for attacks made by friendly KHARADRON OVERLORDS HEROES that target a HERO or MONSTER.`,
  when: [SHOOTING_PHASE, COMBAT_PHASE],
  command_trait: true,
}
export const MasterTheSkiesEffect = {
  name: `ARTYCLE: Master the Skies`,
  desc: `You can reroll hit rolls of 1 for attacks made by friendly SKYVESSELS that target a unit that can fly.`,
  when: [SHOOTING_PHASE, COMBAT_PHASE],
  command_trait: true,
}
export const AlwaysTakeWhatYouAreOwedEffect = {
  name: `AMENDMENT: Always Take What You Are Owed`,
  desc: `Pick up to D3 different KHARADRON OVERLORDS units in your army. Each of those units starts the battle with 1 share of aether-gold in addition to any they normally receive.`,
  when: [START_OF_SETUP],
  command_trait: true,
}

// Skyport Amendments, Artycles, and Footnotes
export const SeekNewProspectsEffect = {
  name: `ARTYCLE: Seek New Prospects`,
  desc: `You can reroll battleshock tests for friendly BARAK-URBAZ units while they are wholly within your opponent's territory.`,
  when: [BATTLESHOCK_PHASE],
  command_trait: true,
}
export const DontArgueWithTheWindEffect = {
  name: `AMENDMENT: Don't Argue With the Wind`,
  desc: `In your movement phase, if you declare a friendly BARAK-ZILFIN unit will run, do not make a run roll Instead, add 6" to the Move characteristic of all models in that unit for that phase.`,
  when: [MOVEMENT_PHASE],
  command_trait: true,
}
export const AlwaysABreezeIfYouLookForItEffect = {
  name: `FOOTNOTE: There's Always a Breeze if You Look for it`,
  desc: `Once per battle, in your hero phase, 1 friendly BARAK-ZILFIN unit can make a normal move (it can run, retreat or disengage).`,
  when: [HERO_PHASE],
  command_trait: true,
}
export const LeaveNoDuardinBehindEffect = {
  name: `AMENDMENT: Leave no Duardin Behind`,
  desc: `Add 2 to the Bravery characteristic of friendly SKYFARERS units while they are wholly within 12" of a friendly SKYVESSEL.`,
  when: [BATTLESHOCK_PHASE],
  command_trait: true,
}
export const ShowThemYourSteelEffect = {
  name: `FOOTNOTE: Show Them Your Steel`,
  desc: `Once per battle, in your hero phase, 1 friendly SKYFARERS unit that is part of a garrison on a SKYVESSEL can leave that garrison. Set up that unit wholly within 3" of that SKYVESSEL and more than 9" from any enemy units.`,
  when: [HERO_PHASE],
  command_trait: true,
}
export const WhereTheresWarTheresGoldEffect = {
  name: `FOOTNOTE: Where There's War, There's Gold`,
  desc: `Once per battle, at the end of the combat phase, 1 friendly SKYFARERS unit that fought in that phase gains 1 share of aether-gold.`,
  when: [END_OF_COMBAT_PHASE],
  command_trait: true,
}
export const WhoStrikesFirstStrikesHardestEffect = {
  name: `FOOTNOTE: Who Strikes First, Strikes Hardest`,
  desc: `Once per battle, at the start of your combat phase, you can pick 1 friendly BARAK-MHORNAR unit that is within 3" of an enemy unit. That friendly unit fights at the start of that combat phase, but cannot fight again in that combat phase unless an ability or spell allows it to fight more than once.`,
  when: [START_OF_COMBAT_PHASE],
  command_trait: true,
}
export const ChronicleOfGrudgesEffect = {
  name: `ARTYCLE: Chronicle of Grudges`,
  desc: `After armies are set up but before the first battle round begins, pick up to 3 different enemy units. You can reroll hit rolls of 1 for attacks made by friendly BARAK-THRYNG units that target those units.`,
  when: [END_OF_SETUP],
  command_trait: true,
}
export const HonourTheGodsJustInCaseEffect = {
  name: `FOOTNOTE: Honour the Gods, Just in Case`,
  desc: `Once per battle, at the start of your shooting phase or a combat phase, you can pick 1 friendly BARAK-THRYNG unit. Until the end of that phase, unmodified hit rolls of 6 for attacks made by that unit score 2 hits on the target instead of 1. Make a wound and save roll for each hit.`,
  when: [START_OF_SHOOTING_PHASE, START_OF_COMBAT_PHASE],
  command_trait: true,
}
export const TakeHelpWhereYouCanGetItEffect = {
  name: `AMENDMENT: Take Help Where You Can Get It`,
  desc: `1 in 4 units in your army can be a DUARDIN unit that does not have the KHARADRON OVERLORDS keyword. Those units gain the BARAK-THRYNG keyword. They cannot be the army general and do not count towards the number of Battleline units in the army.`,
  when: [START_OF_SETUP],
  command_trait: true,
}
export const RespectYourCommandersEffect = {
  name: `ARTYCLE: Respect Your Commanders`,
  desc: `You can reroll battleshock tests for friendly BARAK-NAR units while they are wholly within 12" of a friendly BARAK-NAR HERO.`,
  when: [BATTLESHOCK_PHASE],
  command_trait: true,
}
export const TrustAethermaticsNotSuperstitionEffect = {
  name: `AMENDMENT: Trust Aethermatics, Not Superstition`,
  desc: `Each BARAK-NAR HERO can attempt to unbind 1 spell in the enemy hero phase. If they can already attempt to unbind a spell, they can attempt to unbind 1 extra spell in the enemy hero phase.`,
  when: [HERO_PHASE],
  command_trait: true,
}
export const ThroughKnowledgePowerEffect = {
  name: `FOOTNOTE: Through Knowledge, Power`,
  desc: `Add 1 to unbinding rolls for BARAK-NAR HEROES.`,
  when: [HERO_PHASE],
  command_trait: true,
}

// These traits all come from various Sky-ports
const AllegianceTraits = [
  AlwaysABreezeIfYouLookForItEffect,
  ChronicleOfGrudgesEffect,
  DontArgueWithTheWindEffect,
  HonourTheGodsJustInCaseEffect,
  LeaveNoDuardinBehindEffect,
  RespectYourCommandersEffect,
  SeekNewProspectsEffect,
  ShowThemYourSteelEffect,
  TakeHelpWhereYouCanGetItEffect,
  ThroughKnowledgePowerEffect,
  TrustAethermaticsNotSuperstitionEffect,
  WhereTheresWarTheresGoldEffect,
  WhoStrikesFirstStrikesHardestEffect,
].map(effectToEntry)

const CommandTraits: TTraits = [
  ...AllegianceTraits,
  {
    name: `Wealthy`,
    effects: [
      {
        name: `Wealthy`,
        desc: `This general starts the battle with 2 shares of aether-gold instead of 1.`,
        when: [START_OF_GAME],
      },
    ],
  },
  {
    name: `Tough as Old Boots`,
    effects: [
      {
        name: `Tough as Old Boots`,
        desc: `Add 2 to this general's Wounds characteristic.`,
        when: [WOUND_ALLOCATION_PHASE],
      },
    ],
  },
  {
    name: `Grudgebearer`,
    effects: [
      {
        name: `Grudgebearer`,
        desc: `After armies are set up, pick 1 enemy HERO. Double the damage inflicted by weapons used by this general that target that HERO.`,
        when: [END_OF_SETUP],
      },
    ],
  },
  {
    name: `Cunning Fleetmaster`,
    effects: [
      {
        name: `Cunning Fleetmaster`,
        desc: `After armies are set up, but before the first battle round begins, you can make a normal move with 1 friendly SKYVESSEL. It can fly high unless it is an ARKANAUT IRONCLAD.`,
        when: [END_OF_SETUP],
      },
    ],
  },
  {
    name: `War Wound`,
    effects: [
      {
        name: `War Wound`,
        desc: `Roll a D6 for this general in your hero phase. On a 1, subtract 1 from hit rolls for this general until your next hero phase. On a 2+, you receive 1 command point.`,
        when: [HERO_PHASE],
      },
    ],
  },
  {
    name: `A Scholar and an Arkanaut`,
    effects: [
      {
        name: `A Scholar and an Arkanaut`,
        desc: `You can pick an extra footnote for your army: You cannot pick a footnote your army already has.`,
        when: [START_OF_SETUP],
      },
    ],
  },
  {
    name: `Grandmaster`,
    effects: [
      {
        name: `Grandmaster`,
        desc: `When you use this general's Endrinmaster ability, add 1 to the number of wounds the ability allows you to heal.`,
        when: [START_OF_HERO_PHASE],
      },
    ],
  },
  {
    name: `Great Tinkerer`,
    effects: [
      {
        name: `Great Tinkerer`,
        desc: `Add 2 to the Attacks characteristic of this general's Gaze of Grungni weapon.`,
        when: [SHOOTING_PHASE],
      },
    ],
  },
  {
    name: `Endrinprofessor`,
    effects: [
      {
        name: `Endrinprofessor`,
        desc: `Once in each of your hero phases, this general can use the By Grungni, I Have My Eye On You! command ability without a command point being spent.`,
        when: [HERO_PHASE],
      },
    ],
  },
  {
    name: `Stormcaller`,
    effects: [
      {
        name: `Stormcaller`,
        desc: `When this general uses their Aetherstorm ability; you can reroll the dice that determines what effect it has on the enemy unit.`,
        when: [HERO_PHASE],
      },
    ],
  },
  {
    name: `Ride the Winds`,
    effects: [
      {
        name: `Ride the Winds`,
        desc: `Add 3" to the Move characteristic of a SKYVESSEL that has this general in its garrison.`,
        when: [MOVEMENT_PHASE],
      },
    ],
  },
  {
    name: `Sceptic`,
    effects: [
      {
        name: `Sceptic`,
        desc: `Add 1 to dispelling and unbinding rolls for this general.`,
        when: [HERO_PHASE],
      },
    ],
  },
  {
    name: `Diviner`,
    effects: [
      {
        name: `Diviner`,
        desc: `After armies are set up, pick 1 terrain feature or objective. Do not take battleshock tests for friendly KHARADRON OVERLORDS units while they are wholly within 12" of that terrain feature or objective.`,
        when: [END_OF_SETUP],
      },
    ],
  },
  {
    name: `A Nose for Gold`,
    effects: [
      {
        name: `A Nose for Gold`,
        desc: `Roll a D6 for this general in your hero phase. On a 5+, they gain 1 share of aether-gold.`,
        when: [HERO_PHASE],
      },
    ],
  },
  {
    name: `Genius in the Making`,
    effects: [
      {
        name: `Genius in the Making`,
        desc: `The range of this general's Aetheric Augmentation ability is 18" instead of 12".`,
        when: [HERO_PHASE],
      },
    ],
  },
  {
    name: `Collector`,
    effects: [
      {
        name: `Collector`,
        desc: `If you choose this general to have an artefact of power, you can choose 1 extra friendly HERO to have an artefact of power.`,
        when: [START_OF_SETUP],
      },
    ],
  },
  {
    name: `ARTYCLE: Honour is Everything`,
    effects: [HonourIsEverythingEffect],
  },
  {
    name: `ARTYCLE: Master the Skies`,
    effects: [MasterTheSkiesEffect],
  },
  {
    name: `ARTYCLE: Settle the Grudges`,
    effects: [
      {
        name: `ARTYCLE: Settle the Grudges`,
        desc: `After armies are set up but before the first battle round begins, pick 1 enemy unit, You can reroll hit rolls of 1 for attacks made by friendly KHARADRON OVERLORDS units that target that unit.`,
        when: [END_OF_SETUP],
      },
    ],
  },
  {
    name: `AMENDMENT: Always Take What You Are Owed`,
    effects: [AlwaysTakeWhatYouAreOwedEffect],
  },
  {
    name: `AMENDMENT: Prosecute Wars With All Haste`,
    effects: [ProsecuteWarsWithAllHasteEffect],
  },
  {
    name: `AMENDMENT: Trust to Your Guns`,
    effects: [
      {
        name: `AMENDMENT: Trust to Your Guns`,
        desc: `Add 1 to the Bravery characteristic of friendly KHARADRON OVERLORDS units while they are more than 3" from any enemy units.`,
        when: [BATTLESHOCK_PHASE],
      },
    ],
  },
  {
    name: `FOOTNOTE: There's No Reward Without Risk`,
    effects: [
      {
        name: `FOOTNOTE: There's No Reward Without Risk`,
        desc: `Once per battle, you can reroll a charge roll for a friendly KHARADRON OVERLORDS unit.`,
        when: [CHARGE_PHASE],
      },
    ],
  },
  {
    name: `FOOTNOTE: There's No Trading With Some People`,
    effects: [
      {
        name: `FOOTNOTE: There's No Trading With Some People`,
        desc: `Once per battle, a friendly KHARADRON OVERLORDS unit that has run and/or retreated in the same turn can still shoot and/or charge.`,
        when: [DURING_GAME],
      },
    ],
  },
  {
    name: `FOOTNOTE: Without Our Ships, We Are Naught`,
    effects: [
      {
        name: `FOOTNOTE: Without Our Ships, We Are Naught`,
        desc: `Once per battle, you can heal up to D3 wounds allocated to a friendly SKYVESSEL.`,
        when: [DURING_GAME],
      },
    ],
  },
  ...GreatEndrinworksTraits,
]

export default CommandTraits

import { TAllegiances } from 'types/army'
import {
  BATTLESHOCK_PHASE,
  COMBAT_PHASE,
  DURING_GAME,
  END_OF_SETUP,
  HERO_PHASE,
  SHOOTING_PHASE,
  START_OF_CHARGE_PHASE,
  START_OF_SETUP,
  TURN_ONE_START_OF_ROUND,
  WOUND_ALLOCATION_PHASE,
} from 'types/phases'
import {
  AlwaysABreezeIfYouLookForItEffect,
  AlwaysTakeWhatYouAreOwedEffect,
  ChronicleOfGrudgesEffect,
  DontArgueWithTheWindEffect,
  HonourIsEverythingEffect,
  HonourTheGodsJustInCaseEffect,
  LeaveNoDuardinBehindEffect,
  MasterTheSkiesEffect,
  ProsecuteWarsWithAllHasteEffect,
  RespectYourCommandersEffect,
  SeekNewProspectsEffect,
  ShowThemYourSteelEffect,
  TakeHelpWhereYouCanGetItEffect,
  ThroughKnowledgePowerEffect,
  TrustAethermaticsNotSuperstitionEffect,
  WhereTheresWarTheresGoldEffect,
  WhoStrikesFirstStrikesHardestEffect,
} from './traits'

const Allegiances: TAllegiances = [
  {
    name: `Barak-Zilfin, The Windswept City (Skyport)`,
    effects: [
      AlwaysABreezeIfYouLookForItEffect,
      DontArgueWithTheWindEffect,
      MasterTheSkiesEffect,
      {
        name: `Magnificent Skyvessels`,
        desc: `You can choose 1 extra SKYVESSEL in your army to have a great endrinwork.`,
        when: [START_OF_SETUP],
      },
      {
        name: `Master Commander`,
        desc: `If this general is part of your army and on the battlefield, each time you spend a command point to use a command ability on this general's warscroll, roll a D6. On a 5+, you receive 1 extra command point.`,
        when: [DURING_GAME],
        command_trait: true,
      },
      {
        name: `Staff of Ocular Optimisation`,
        desc: `Pick 1 of the bearer's missile weapons. Add 1 to hit rolls for attacks made by that weapon.`,
        when: [SHOOTING_PHASE],
        artifact: true,
      },
    ],
  },
  {
    name: `Barak-Zon, City of the Sun (Skyport)`,
    effects: [
      HonourIsEverythingEffect,
      LeaveNoDuardinBehindEffect,
      ShowThemYourSteelEffect,
      {
        name: `Deeds, Not Words`,
        desc: `Add 1 to wound rolls for attacks made with melee weapons by friendly SKYFARERS units that made a charge move in the same turn, and add 1 to hit rolls for attacks made with melee weapons by friendly SKYWARDENS units that made a charge move in the same turn.`,
        when: [COMBAT_PHASE],
      },
      {
        name: `Bearer of the Ironstar`,
        desc: `The first time this general is slain, before removing them, roll a D6. On a 2+ they are not slain, you can heal up to D3 wounds allocated to them, and any wounds remaining to be allocated to them are negated.`,
        when: [WOUND_ALLOCATION_PHASE],
        command_trait: true,
      },
      {
        name: `Aethersped Hammer`,
        desc: `Pick 1 of the bearer's melee weapons. Add 2 to the Attacks characteristic of that weapon.`,
        when: [COMBAT_PHASE],
        artifact: true,
      },
    ],
  },
  {
    name: `Barak-Urbaz, The Market City (Skyport)`,
    effects: [
      AlwaysTakeWhatYouAreOwedEffect,
      SeekNewProspectsEffect,
      WhereTheresWarTheresGoldEffect,
      {
        name: `Khemist Supreme`,
        desc: `Replace the rules for this general's Aetheric Augmentation ability with: 
        
        "In your hero phase you can pick 2 friendly SKYFARERS units wholly within 12" of this model. Until your next hero phase, you can reroll wound rolls of 1 for attacks made by those units. This ability cannot be used by an AETHER-KHEMIST that is part of a garrison, or on a friendly unit that is part of a garrison.'`,
        when: [HERO_PHASE],
        command_trait: true,
      },
      {
        name: `The Market City`,
        desc: `Do not subtract 1 from the Bravery characteristic of an BARAK-URBAZ unit that spends a share of aether-gold.`,
        when: [DURING_GAME],
      },
      {
        name: `Breath of Morgrim`,
        desc: `In your shooting phase, you can pick 1 enemy unit and roll 1 dice for each model from that unit within 6" of the bearer. For each 6, that unit suffers 1 mortal wound.`,
        when: [SHOOTING_PHASE],
        artifact: true,
      },
    ],
  },
  {
    name: `Barak-Mhornar, City of Shadow (Skyport)`,
    effects: [
      ProsecuteWarsWithAllHasteEffect,
      SeekNewProspectsEffect,
      WhoStrikesFirstStrikesHardestEffect,
      {
        name: `Fearsome Raiders`,
        desc: `Subtract 1 from the Bravery characteristic of enemy units while they are within 6" of any friendly BARAK-MHORNAR units.`,
        when: [BATTLESHOCK_PHASE],
      },
      {
        name: `Opportunistic Privateers`,
        desc: `If this general is part of the garrison of a SKYVESSEL that is on is on the battlefield after armies are set up but before the first battle round begins, you can remove that SKYVESSEL from the battlefield and set it up again anywhere more than 9" from any enemy units. If you do so, that SKYVESSEL cannot make a normal move in the first battle round, and units in its garrison cannot leave the garrison in the first battle round.`,
        when: [END_OF_SETUP],
        command_trait: true,
      },
      {
        name: `Galeforce Stave`,
        desc: `At the start of the enemy charge phase, you can pick 1 enemy unit within 12" of the bearer. Halve charge rolls for that unit in that phase.`,
        when: [START_OF_CHARGE_PHASE],
        artifact: true,
      },
    ],
  },
  {
    name: `Barak-Thryng, City of the Ancestors (Skyport)`,
    effects: [
      ChronicleOfGrudgesEffect,
      HonourTheGodsJustInCaseEffect,
      TakeHelpWhereYouCanGetItEffect,
      {
        name: `Incredibly Stubborn`,
        desc: `If a friendly SKYFARERS model is slain while it is within 3" of an enemy unit, roll a D6. On a 4+, that model can fight before it is removed from play.`,
        when: [WOUND_ALLOCATION_PHASE],
      },
      {
        name: `Supremely Stubborn`,
        desc: `When you use the Incredibly Stubborn ability for this general, they can fight on a roll of 2+ instead of 4+.`,
        when: [WOUND_ALLOCATION_PHASE],
        command_trait: true,
      },
      {
        name: `Grudgehammer`,
        desc: `Pick one of the bearer's melee weapons. Add 1 to hit rolls for attacks made by that weapon. In addition, if the unmodified wound roll for an attack made by that weapon that targets an enemy unit which was picked for the Chronicle of Grudges artycle is 6, that attack inflicts D3 mortal wounds on the target in addition to any normal damage.`,
        when: [COMBAT_PHASE],
        artifact: true,
      },
    ],
  },
  {
    name: `Barak-Nar, City of the First Sunrise (Skyport)`,
    effects: [
      RespectYourCommandersEffect,
      ThroughKnowledgePowerEffect,
      TrustAethermaticsNotSuperstitionEffect,
      {
        name: `Scholars and Commanders`,
        desc: `At the start of the first battle round, roll a D6 for each friendly BARAK-NAR HERO on the battlefield (including any that are part of a garrison). For each 4+, you receive 1 extra command point.`,
        when: [TURN_ONE_START_OF_ROUND],
      },
      {
        name: `Aethercharged Rune`,
        desc: `Once per battle you can change either 1 hit roll for an attack made by the bearer or 1 save roll for an attack that targets the bearer to the toll of your choice.`,
        when: [DURING_GAME],
        artifact: true,
      },
      {
        name: `Champion of Progress`,
        desc: `Do not take battleshock for friendly BARAK-NAR units while they are wholly within 12" of this general.`,
        when: [BATTLESHOCK_PHASE],
        command_trait: true,
      },
    ],
  },
]

export default Allegiances

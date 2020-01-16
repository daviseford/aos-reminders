import { TAllegiances } from 'types/army'
import {
  BATTLESHOCK_PHASE,
  COMBAT_PHASE,
  DURING_GAME,
  END_OF_SETUP,
  HERO_PHASE,
  MOVEMENT_PHASE,
  SHOOTING_PHASE,
  WOUND_ALLOCATION,
  TURN_ONE_START_OF_ROUND,
  START_OF_SETUP,
  END_OF_COMBAT_PHASE,
  START_OF_COMBAT_PHASE,
  START_OF_CHARGE_PHASE,
  START_OF_SHOOTING_PHASE,
} from 'types/phases'
import {
  SeekNewProspectsEffect,
  ProsecuteWarsWithAllHasteEffect,
  HonourIsEverythingEffect,
  MasterTheSkiesEffect,
  AlwaysTakeWhatYouAreOwedEffect,
} from './traits'

const Allegiances: TAllegiances = [
  {
    name: `Barak-Zilfin, The Windswept City (Skyport)`,
    effects: [
      MasterTheSkiesEffect,
      {
        name: `AMENDMENT: Don't Argue With the Wind`,
        desc: `In your movement phase, if you declare a friendly BARAK- ZILFIN unit will run, do not make a run roll Instead, add 6" to the Move characteristic of all models in that unit for that phase.`,
        when: [MOVEMENT_PHASE],
      },
      {
        name: `FOOTNOTE: There's Always a Breeze if You Look for it`,
        desc: `Once per battle, in your hero phase, 1 friendly BARAK-ZILFIN unit can make a normal move (it can run, retreat or disengage).`,
        when: [HERO_PHASE],
      },
      {
        name: `Magnificent Skyvessels`,
        desc: `You can choose 1 extra SKYVESSEL in your army to have a great endrinwork.`,
        when: [START_OF_SETUP],
      },
      {
        name: `Master Commander`,
        desc: `If this general is part of your army and on the battlefield, each time you spend a command point to use a command ability on this general's warscroll, roll a dice. On a 5+, you receive 1 extra command point.`,
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
      {
        name: `AMENDMENT: Leave no Duardin Behind`,
        desc: `Add 2 to the Bravery characteristic of friendly SKYFARERS units while they are wholly within 12" of a friendly SKYVESSEL.`,
        when: [BATTLESHOCK_PHASE],
      },
      {
        name: `FOOTNOTE: Show Them Your Steel`,
        desc: `Once per battle, in your hero phase, 1 friendly SKYFARERS unit that is part of a garrison on a SKYVESSEL can leave that garrison. Set up that unit wholly within 3" of that SKYVESSEL and more than 9" from any enemy units.`,
        when: [HERO_PHASE],
      },
      {
        name: `Deeds, Not Words`,
        desc: `Add 1 to wound rolls for attacks made with melee weapons by friendly SKYFARERS units that made a charge move in the same turn, and add 1 to hit rolls for attacks made with melee weapons by friendly SKYWARDENS units that made a charge move in the same turn.`,
        when: [COMBAT_PHASE],
      },
      {
        name: `Bearer of the Ironstar`,
        desc: `The first time this general is slain, before removing them, roll a dice. On a 2+ they are not slain, you can heal up to D3 wounds allocated to them, and any wounds remaining to be allocated to them are negated,`,
        when: [WOUND_ALLOCATION],
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
      SeekNewProspectsEffect,
      {
        name: `FOOTNOTE: Where There's War, There's Gold`,
        desc: `Once per battle, at the end of the combat phase, 1 friendly SKYFARERS unit that fought in that phase gains 1 share of aether-gold.`,
        when: [END_OF_COMBAT_PHASE],
      },
      AlwaysTakeWhatYouAreOwedEffect,
      {
        name: `Khemists Supreme`,
        desc: `Replace the rules for this general's Aetheric Augmentation ability with: 
        
        "In your hero phase you can pick 2 friendly SKYFARERS units wholly within 12" of this model. Until your next hero phase, you can re-roll wound rolls of 1 for attacks made by those units. This ability cannot be used by an AETHER-KHEMIST that is part of a garrison, or on a friendly unit that is part of a garrison.'`,
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
      SeekNewProspectsEffect,
      ProsecuteWarsWithAllHasteEffect,
      {
        name: `FOOTNOTE: Who Strikes First, Strikes Hardest`,
        desc: `Once per battle, at the start of your combat phase, you can pick 1 friendly BARAK-MHORNAR unit that is within 3" of an enemy unit. That friendly unit fights at the start of that combat phase, but cannot fight again in that combat phase unless an ability or spell allows it to fight more than once.`,
        when: [START_OF_COMBAT_PHASE],
      },
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
      {
        name: `ARTYCLE: Chronicle of Grudges`,
        desc: `After armies are set up but before the first battle round begins, pick up to 3 different enemy units. You can re-roll hit rolls of 1 for attacks made by friendly BARAK-THRYNG units that target those units.`,
        when: [END_OF_SETUP],
      },
      {
        name: `FOOTNOTE: Honour the Gods, Just in Case`,
        desc: `Once per battle, at the start of your shooting phase or a combat phase, you can pick 1 friendly BARAK-THRYNG unit. Until the end of that phase, unmodified hit rolls of 6 for attacks made by that unit score 2 hits on the target instead of 1. Make a wound and save roll for each hit.`,
        when: [START_OF_SHOOTING_PHASE, START_OF_COMBAT_PHASE],
      },
      {
        name: `Incredibly Stubborn`,
        desc: `If a friendly SKYFARERS model is slain while it is within 3" of an enemy unit, roll a dice. On a 4+, that model can fight before it is removed from play.`,
        when: [WOUND_ALLOCATION],
      },
      {
        name: `AMENDMENT: Take Help Where You Can Get It`,
        desc: `1 in 4 units in your army can be a DUARDIN unit that does not have the KHARADRON OVERLORDS keyword. Those units gain the BARAK-THRYNG keyword. They cannot be the army general and do not count towards the number of Battleline units in the army.`,
        when: [START_OF_SETUP],
      },
      {
        name: `Supremely Stubborn`,
        desc: `When you use the Incredibly Stubborn ability for this general, they can fight on a roll of 2+ instead of 4+.`,
        when: [WOUND_ALLOCATION],
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
      {
        name: `ARTYCLE: Respect Your Commanders`,
        desc: `You can re-roll battleshock tests for friendly BARAK-NAR units while they are wholly within 12" of a friendly BARAK-NAR HERO.`,
        when: [BATTLESHOCK_PHASE],
      },
      {
        name: `AMENDMENT: Trust Aethermatics, Not Superstition`,
        desc: `Each BARAK-NAR HERO can attempt to unbind 1 spell in the enemy hero phase. If they can already attempt to unbind a spell, they can attempt to unbind 1 extra spell in the enemy hero phase.`,
        when: [HERO_PHASE],
      },
      {
        name: `FOOTNOTE: Through Knowledge, Power`,
        desc: `Add 1 to unbinding rolls for BARAK-NAR HEROES.`,
        when: [HERO_PHASE],
      },
      {
        name: `Scholars and Commanders`,
        desc: `At the start of the first battle round, roll a dice for each friendly BARAK-NAR HERO on the battlefield (including any that are part of a garrison). For each 4+, you receive 1 extra command point.`,
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

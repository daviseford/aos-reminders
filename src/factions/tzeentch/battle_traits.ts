import { tagAs } from 'factions/metatagger'
import {
  CHARGE_PHASE,
  COMBAT_PHASE,
  DURING_GAME,
  END_OF_MOVEMENT_PHASE,
  END_OF_SETUP,
  HERO_PHASE,
  MOVEMENT_PHASE,
  SAVES_PHASE,
  SHOOTING_PHASE,
  START_OF_HERO_PHASE,
  TURN_FIVE_HERO_PHASE,
  TURN_ONE_HERO_PHASE,
  TURN_THREE_HERO_PHASE,
} from 'types/phases'

const BattleTraits = {
  // Tzeentch Allegiance
  'The Flow of Change': {
    effects: [
      {
        name: `Masters of Destiny`,
        desc: `After set-up, but before rolling to see which player takes the first turn in the first battle round, roll 9 dice and keep them to one side; this is your pool of Destiny Dice. Though it is possible for some or even all of these dice to be replenished during the course of the battle, the number of dice in your pool of Destiny Dice can never exceed 9.`,
        when: [END_OF_SETUP],
      },
      {
        name: `Masters of Destiny`,
        desc: `Before rolling any dice for a TZEENTCH unit, you can use one or more of the remaining Destiny Dice from your pool in their stead; the result of the roll you would have made is automatically substituted with the result shown on the Destiny Dice you have chosen to use.

        Each Destiny Dice spent only allows you to replace a single dice roll. If you want to replace a 2D6 roll (such as a casting roll or charge roll), you must spend 2 Destiny Dice. In addition, any rolls that have been replaced count as unmodified rolls and cannot be rerolled. They also cannot be modified, with the following two exceptions:

        If you spend a Destiny Dice to replace a save roll, the result of that Destiny Dice is modified by the Rend characteristic of the attack as normal.

        If you spend a Destiny Dice to replace a battleshock test, the result of that Destiny Dice is modified by the number of models slain from that unit as normal.

        Destiny Dice can be spent in place of the following rolls:
        Casting, Unbinding, Dispelling, Run, Charge, Hit, Wound, Save, Damage characteristic of missiles/melee weapons, Battleshock`,
        when: [DURING_GAME],
      },
      {
        name: `Summon Daemons of Tzeentch`,
        desc: `You can summon units of Tzeentch Daemons to the battlefield by expending Fate Points. You receive 1 Fate Point each time a casting roll is successful, and the spell is not unbound. Note that you receive Fate Points whenever a spell is cast, be it by friend or foe - Tzeentch cares not from whence the magic flows.`,
        when: [HERO_PHASE],
      },
      {
        name: `Summon Daemons of Tzeentch`,
        desc: `If you have 10 or more Fate Points at the end of your movement phase, you can summon one unit from the summoning list onto the battlefield, and add them to your army. Each unit you summon costs a number of Fate Points, as shown on the list, and you can only summon a unit if you have enough Fate Points to pay its cost.

        Summoned units must be set up wholly within 12" of a friendly Tzeentch Hero and more than 9" from any enemy units. Subtract the cost of the summoned unit from the number of Fate Points you have immediately after the summoned unit has been set up.`,
        when: [END_OF_MOVEMENT_PHASE],
      },
      {
        name: `Summon Daemons of Tzeentch`,
        desc: `Summoning Costs:
               1 Exalted Greater Daemon of Tzeentch - 45 FP
               1 Lord of Change -                     30 FP
               1 Fateskimmer on Burning Chariot -     24 FP
               10 Pink Horrors -                      20 FP
               1 Burning Chariot -                    18 FP
               3 Flamers -                            18 FP
               1 Changecaster -                       12 FP
               1 Exalted Flamer -                     12 FP
               1 Fluxmaster -                         12 FP
               10 Blue Horrors -                      10 FP
               10 Brimstone Horrors -                 10 FP
               3 Screamers -                          10 FP`,
        when: [END_OF_MOVEMENT_PHASE],
      },
      {
        name: `Locus of Change`,
        desc: `Subtract 1 from hit rolls for attacks made with melee weapons that target friendly Tzeentch Daemon units that are wholly within 12" of a friendly Tzeentch Daemon Hero.`,
        when: [COMBAT_PHASE],
      },
      {
        name: `Agendas of Anarchy`,
        desc: `At the start of your hero phase, you can say that your army intends to complete one of the following agendas before the start of your next hero phase. You must tell your opponent which agenda you intend to complete, and you cannot complete the same agenda more than once per battle.

        If a friendly Tzeentch unit completes one of the following agendas during a battle, that unit gains that agenda's ability for the rest of the game.

        Friendly Tzeentch units that complete more than 1 agenda must choose which ability they wish to keep; any other ability gained are lost.`,
        when: [START_OF_HERO_PHASE],
      },
      {
        name: `Agendas of Anarchy: Mass Conjuration`,
        desc: `Requirement: 1 selected Tzeentch wizard successfully casts 2 spells/endless spells in this hero phase with unmodified casting rolls of 9+ without being unbound.
               Reward: Add 1 to the casting rolls of the completing model.`,
        when: [START_OF_HERO_PHASE],
      },
      {
        name: `Agendas of Anarchy: Mass Conjuration`,
        desc: `If active, add 1 to casting rolls for the buffed wizard.`,
        when: [HERO_PHASE],
      },
      {
        name: `Agendas of Anarchy: Ninefold Dismantlement`,
        desc: `Requirement: 1 selected enemy unit with 9 or more models is destroyed this turn.
               Reward: Add 1 to the melee hits rolls of the friendly Tzeentch unit that completed this agenda.`,
        when: [START_OF_HERO_PHASE],
      },
      {
        name: `Agendas of Anarchy: Ninefold Dismantlement`,
        desc: `If active, add 1 to the melee hit rolls for the buffed unit.`,
        when: [COMBAT_PHASE],
      },
      {
        name: `Agendas of Anarchy: Overthrow Leaders`,
        desc: `Requirement: 1 selected enemy hero or monster on the battlefield with a wounds characteristic of 9 or more slain this turn.
               Reward: Add 1 to the save rolls for the friendly Tzeentch unit that completed this agenda.`,
        when: [START_OF_HERO_PHASE],
      },
      {
        name: `Agendas of Anarchy: Overthrow Leaders`,
        desc: `If active, add 1 to the save rolls for the buffed unit.`,
        when: [SAVES_PHASE],
      },
      {
        name: `Agendas of Anarchy: Reckless Abandon`,
        desc: `Requirement: 1 selected friendly Tzeentch unit 9" or more from any enemy units successfully completes a charge within 1/2" of an enemy model.
               Reward: Add 1 to the melee attacks characteristic of the freindly Tzeentch unit that completed this agenda if it charges in the same turn.`,
        when: [START_OF_HERO_PHASE, CHARGE_PHASE],
      },
      {
        name: `Agendas of Anarchy: Reckless Abandon`,
        desc: `If active, add 1 to the melee attacks characteristic of the buffed unit if it charged this turn.`,
        when: [CHARGE_PHASE, COMBAT_PHASE],
      },
      {
        name: `Agendas of Anarchy: Tides of Anarcy`,
        desc: `Requirement: 1 selected friendly Tzeentch unit with 9 or more models takes control of an objective controlled by an enemy at the start of this phase.
               Reward: Each Tzeentch model in the unit the completed this agenda counts as 2 models instead of 1 when determining objective control.`,
        when: [START_OF_HERO_PHASE],
      },
      {
        name: `Agendas of Anarchy: Tides of Anarchy`,
        desc: `If active, each model in the buffed unit counts as 2 models when determining objective control.`,
        when: [DURING_GAME],
      },
    ],
  },
  // Eternal Conflagration Flavor
  'Twisters of Materiality': {
    effects: [
      {
        name: `Twisters of Materiality`,
        desc: `Improve the Rend characteristic of friendly Eternal Conflagration units' Warpflame, Billowing Warpflame, and Magical Flames missile weapons by 1.`,
        when: [SHOOTING_PHASE],
      },
    ],
  },
  // Hosts  Duplicitous Flavor
  'Ranks of Mischievous Mirages': {
    effects: [
      {
        name: `Ranks of Mischievous Mirages`,
        desc: `Enemy units within 3" of a Hosts Duplicitous unit cannot retreat.`,
        when: [MOVEMENT_PHASE],
      },
    ],
  },
  // Hosts Arcanum Flavor
  'Thieves of All Things Arcane': {
    effects: [
      {
        name: `Thieves of All Things Arcane`,
        desc: `Once per turn, in the first, third, and fifth battle rounds, when a friendly Host Arcanum Wizard attempts to unbind a spell, the spell is automatically unbound. (Do not roll 2D6).`,
        when: [TURN_ONE_HERO_PHASE, TURN_THREE_HERO_PHASE, TURN_FIVE_HERO_PHASE],
      },
    ],
  },
  // Cult of Transient Form Flavor
  'The Change-gift': {
    effects: [
      {
        name: `The Change-gift`,
        desc: `Roll a D6 each time a friendly Kairic Acolyte model is slain in the combat phase. On a 2-5, before removing that model from play, that model can fight. On a 6, before removing that model from play, you can add 1 Tzaangor model to an existing Tzaangor unit in your army. If you do so, set up that Tzaangor model within 1" of a friendly Tzaangor unit that is within 9" of the slain model. The modle can only be set up within 3" of an enemy unit if the friendly Tzaangor unit was within 3" of that enemy unit before any models were added.`,
        when: [COMBAT_PHASE],
      },
    ],
  },
  // Pyrofane Cult Flavor
  'Arrows of Tzeentch': {
    effects: [
      {
        name: `Arrows of Tzeentch`,
        desc: `Add 1 to hit rolls for attacks made with Sorcerous Bolts by friendly Kairic Acolytes units. In addition, at the end of your shooting phase, roll a D6 for each enemy unit that suffered any wounds inflicted by attacks made with Sorcerous Bolts in that phase. On a 5+, that unit suffers D3 mortal wounds.`,
        when: [SHOOTING_PHASE],
      },
    ],
  },
  // Guild of Summoners Flavor
  'Scions of the Exiled': {
    effects: [
      {
        name: `Scions of the Exiled`,
        desc: `If your army has the Guild of SUmmoners keyword, your Fate Points can only be used to summon Lord of Change untis. Instead of a Fate Point cost of 30, a Lord of Change costs 9 Fate Points to summon the first time, 18 Fate Points for the second time, and 30 Fate Points each time thereafter for the rest of the battle.`,
        when: [DURING_GAME],
      },
    ],
  },
  // Unbound Flux Flavor
  'Maddening Cascade': {
    effects: [
      {
        name: `Maddening Cascade`,
        desc: `Each time an Unbound Flux Daemon wizard casts a spell inflicting mortal wounds, roll a D6 for each unit that suffered any mortal wounds from the spell. On a 4+ that unit suffers 1 additional mortal wound.`,
        when: [HERO_PHASE],
      },
    ],
  },
  // Cult of a Thousand Eyes Flavor
  'Marked for Death': {
    effects: [
      {
        name: `Marked for Death`,
        desc: `After armies have been setup before the first battle round, pick up to D3 different enemy units. For the rest of the battle, you can reroll hit rolls for melee attacks by friendly Cult of a Thousand Eyes mortal units targeting the selected units.`,
        when: [END_OF_SETUP],
      },
      {
        name: `Marked for Death`,
        desc: `You can reroll hit rolls for melee attacks against the pre-selected targets.`,
        when: [COMBAT_PHASE],
      },
    ],
  },
}

export default tagAs(BattleTraits, 'battle_trait')

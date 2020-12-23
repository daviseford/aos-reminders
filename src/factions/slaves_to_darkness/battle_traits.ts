import { tagAs } from 'factions/metatagger'
import { MARK_KHORNE, MARK_NURGLE, MARK_SLAANESH, MARK_TZEENTCH, MARK_UNDIVIDED } from 'meta/alliances'
import {
  BATTLESHOCK_PHASE,
  CHARGE_PHASE,
  COMBAT_PHASE,
  DURING_GAME,
  DURING_SETUP,
  END_OF_COMBAT_PHASE,
  HERO_PHASE,
  MOVEMENT_PHASE,
  SAVES_PHASE,
  SHOOTING_PHASE,
  START_OF_HERO_PHASE,
  WOUND_ALLOCATION_PHASE,
} from 'types/phases'

const BattleTraits = {
  // Slaves to Darkness Allegiance
  'Bane of the Mortal Realms': {
    effects: [
      {
        name: `Aura of Chaos`,
        desc: `If a Slaves to Darkness hero has a Mark of Chaos keyword, that hero has an Aura of Chaos based on the Mark selected during army construction. If a unit has more than one Mark of Chaos you must select one aura it will use for the duration of the battle.`,
        when: [DURING_SETUP],
      },
      {
        name: `Aura of ${MARK_KHORNE}`,
        desc: `You can reroll hit rolls of 1 for attacks made with melee weapons by friendly Slaves to Darkness Khorne units wholly within 12" of this model. If this model is a general, additionally add 1 to the wound rolls of those units.`,
        when: [COMBAT_PHASE],
      },
      {
        name: `Aura of ${MARK_TZEENTCH}`,
        desc: `You can reroll save rolls of 1 for attacks that target friendly Slaves to Darkness Tzeentch units wholly within 12" of this model.`,
        when: [SAVES_PHASE],
      },
      {
        name: `Aura of ${MARK_TZEENTCH}`,
        desc: `If this model is a general, additionally each time a friendly Slaves to Darkness Tzeentch unit in range of this aura is affected by a spell or endless spell, you can roll a D6. On a 5+ it has no effect on the unit.`,
        when: [HERO_PHASE],
      },
      {
        name: `Aura of ${MARK_NURGLE}`,
        desc: `Friendly Slaves to Darkness Nurgle unit wholly within 12" of this model add 1 to the damage inflicted by melee attacks with unmodified wound rolls of 6.`,
        when: [COMBAT_PHASE],
      },
      {
        name: `Aura of ${MARK_NURGLE}`,
        desc: `If this model is a general, subtract 1 from missile attacks made against friendly Slaves to Darkness Nurgle units wholly within 12" of this model.`,
        when: [SHOOTING_PHASE],
      },
      {
        name: `Aura of ${MARK_SLAANESH}`,
        desc: `Friendly Slaves to Darkness Slaanesh units wholly within 12" of this model score 2 hits instead of 1 on melee attacks for each unmodified hit roll of 6. Make a wound and save roll for each hit.`,
        when: [COMBAT_PHASE],
      },
      {
        name: `Aura of ${MARK_SLAANESH}`,
        desc: `If this model is a general, you can reroll run and charge rolls for friendly Slaves to Darkness Slaanesh units wholly within 12" of this model.`,
        when: [MOVEMENT_PHASE, CHARGE_PHASE],
      },
      {
        name: `Aura of ${MARK_UNDIVIDED}`,
        desc: `Friendly Slaves to Darkness Undivided units wholly within 12" of this model do not take battleshock tests.`,
        when: [BATTLESHOCK_PHASE],
      },
      {
        name: `Aura of ${MARK_UNDIVIDED}`,
        desc: `If this model is a general, roll a D6 each time a friendly Slaves to Darkness Undivided unit wholly within 12" of this model allocates a wound or mortal wound. On a 6 it is negated.`,
        when: [WOUND_ALLOCATION_PHASE],
      },
      {
        name: `Eye of the Gods`,
        desc: `If any attacks made by a friendly Slaves to Darkness hero with the Eye of the Gods keyword kills a hero or monster you can make a 2D6 roll for that hero. Apply the reward based on the result for the rest of the battle. Duplicate rewards are treated as 'Snubbed by the Gods' instead.
               2: Spawndom
               3: Slaughterer's Strength
               4: Murderous Mutation
               5: Iron Flesh
               6: Flames of Chaos
               7: Snubbed by the Gods
               8: Unholy Resilience
               9-10: Daemonic Legions
               11-12: Dark Apotheosis`,
        when: [END_OF_COMBAT_PHASE],
      },
      {
        name: `Eye of the Gods: Spawndom`,
        desc: `You can add 1 Slaves to Darkness Chaos Spawn to your army. Set up the new model within 1" of the hero then remove the hero as slain.
               If you don't add a spawn, the hero suffers D3 mortal wounds instead.`,
        when: [END_OF_COMBAT_PHASE],
      },
      {
        name: `Eye of the Gods: Slaughterer's Strength`,
        desc: `Improve the selected melee weapon's rend characteristic by 1.`,
        when: [COMBAT_PHASE],
      },
      {
        name: `Eye of the Gods: Murderous Mutation`,
        desc: `Add 1 to the selected melee weapon's attacks characteristic.`,
        when: [COMBAT_PHASE],
      },
      {
        name: `Eye of the Gods: Iron Flesh`,
        desc: `Add 1 to save rolls for attacks targeting this hero.`,
        when: [SAVES_PHASE],
      },
      {
        name: `Eye of the Gods: Flames of Chaos`,
        desc: `Each time this hero is affected by a spell or endless spell you can roll a D6. On a 4+ ignore the effects on this hero.`,
        when: [HERO_PHASE],
      },
      {
        name: `Eye of the Gods: Snubbed by the Gods`,
        desc: `This reward has no effect.`,
        when: [END_OF_COMBAT_PHASE],
      },
      {
        name: `Eye of the Gods: Unholy Resilience`,
        desc: `Roll a D6 each time you allocate a wound or mortal wound to this hero. On a 5+ it is negated.`,
        when: [WOUND_ALLOCATION_PHASE],
      },
      {
        name: `Eye of the Gods: Daemonic Legions`,
        desc: `Summon 1 unit of the following to the battlefield based on the hero's Mark of Chaos: 10 Bloodletters, 10 Plaguebearers, 10 Daemonettes, 10 Pink Horrors or 6 Furies. The summoned unit must be set up wholly within 9" of a this model and more than 9" from any enemy units.`,
        when: [END_OF_COMBAT_PHASE],
      },
      {
        name: `Eye of the Gods: Dark Apotheosis`,
        desc: `You can add 1 Slaves to Darkness Daemon Prince to your army. Set up the new model within 1" of the hero then remove the hero from play.
               The Daemon Prince has the same Mark of Chaos as the hero (select a new one if the hero was Undivided).
               The Daemon Prince keeps any command traits and artefacts owned by the hero.
               If the hero was a wizard this Daemon Prince is also a wizard making the same number of casting, dispelling, and unbinding rolls while also knowing the same spells as the hero.
               If the hero was your general, the Daemon Prince is now your general.
               If you choose not to add a Daemon Prince, this hero can heal D3 wounds instead.`,
        when: [END_OF_COMBAT_PHASE],
      },
    ],
  },
  // Ravagers Traits
  'Glory for the Taking': {
    effects: [
      {
        name: `Glory for the Taking`,
        desc: `If your general is not a Daemon Prince you can pick a different command trait for each of up to 5 different friendly Ravagers heroes in addition to your general. None of these heroes can have more than 1 command trait.`,
        when: [DURING_SETUP],
      },
      {
        name: `Glory for the Taking`,
        desc: `You can pick 1 friendly Ravagers hero (excluding Daemon Princes) on the battlefield to become the army general until your next hero phase.`,
        when: [START_OF_HERO_PHASE],
      },
    ],
  },
  // Cabalists Traits
  'Binding Rituals': {
    effects: [
      {
        name: `Binding Rituals`,
        desc: `You may select 1 friendly Cabalists wizard to perform 1 binding ritual. For either ritual selection, pick 1 friendly Cabalists unit within 3" this wizard and roll a D6. On a 3+, D3 models from the target unit are slain.
               Ritual of Sorcerous Might: For each slain model, add 1 to the casting rolls made for friendly Cabalists wizards until the end of this phase.
               Ritual of Corruption: Pick 1 predatory endless spell within 12" of the ritual wizard. You may move that endless spell 3" per each slain model.`,
        when: [START_OF_HERO_PHASE],
      },
    ],
  },
  // Despoilers Traits
  'Sacrilegious Might': {
    effects: [
      {
        name: `Sacrilegious Might`,
        desc: `Friendly units with the same Mark of Chaos as your general are affected by your general's Aura of Chaos ability while they are wholly within 18" of your general.`,
        when: [DURING_GAME],
      },
      {
        name: `Sacrilegious Might`,
        desc: `Roll a D6 each time you allocate a wound or mortal wound to a Despoilers Daemon Prince. On a 5+ it is negated.`,
        when: [WOUND_ALLOCATION_PHASE],
      },
    ],
  },
  'Blessed by the Unholy': {
    effects: [
      {
        name: `Blessed by the Unholy`,
        desc: `You can roll a D6 for each friendly Despoilers Daemon Prince and friendly Despoilers monster on the battlefield. On a 4+ you can heal up to D3 wounds allocated to that model. Mutalith Vortex Beasts can only heal 1 wound instead.`,
        when: [HERO_PHASE],
      },
    ],
  },
  'Twisted Dominion': {
    effects: [
      {
        name: `Twisted Dominion`,
        desc: `If a friendly Despoilers Daemon Prince finishes a move within 6" of a terrain feature, you can give that terrain feature the Pitch-black and Nightmare Chasm scenery rules until your next hero phase. Despoilers Daemon Princes and Despoilers monsters are unaffected by these scenery rules.`,
        when: [MOVEMENT_PHASE, CHARGE_PHASE, COMBAT_PHASE],
      },
    ],
  },
  'Pitch Black': {
    effects: [
      {
        name: `Pitch Black`,
        desc: `Models are not visible to each other if an imaginary straight line 1mm wide drawn between the closest points of the two models crosses over more than 1" of this terrain feature.`,
        when: [DURING_GAME],
      },
    ],
  },
  'Nightmare Chasm': {
    effects: [
      {
        name: `Nightmare Chasm`,
        desc: `Roll a D6 for this terrain feature. On a 6, each unit within 1" of the terrain suffers D3 mortal wounds (roll damage separately for each unit).`,
        when: [START_OF_HERO_PHASE],
      },
    ],
  },
  // Host of the Everchosen
  'Exalted Grand Marshall of the Apocalypse': {
    effects: [
      {
        name: `Exalted Grand Marshall of the Apocalypse`,
        desc: `If Archaon is your general and on the battlefield, friendly Host of the Everchosen units are affected by his Aura of Chaos ability if they are wholly within 18" of him.`,
        when: [DURING_GAME],
      },
    ],
  },
  'Fearless in His Presence': {
    effects: [
      {
        name: `Fearless in His Presence`,
        desc: `If Archaon is your general and on the battlefield, do not take battleshock tests for friendly Host of the Everchosen units.`,
        when: [BATTLESHOCK_PHASE],
      },
    ],
  },
  'The Will of the Everchosen': {
    effects: [
      {
        name: `The Will of the Everchosen`,
        desc: `If Archaon is your general and on the battlefield, you can pick 1 enemy unit on the battlefield. You can reroll hit and wound rolls of 1 for melee attacks against the target by friendly Host of the Everchosen units until your next hero phase.`,
        when: [HERO_PHASE],
      },
      {
        name: `The Will of the Everchosen`,
        desc: `You can reroll hit and wound rolls of 1 for melee attacks against the target by friendly Host of the Everchosen units.`,
        when: [COMBAT_PHASE],
      },
    ],
  },
  'The Eight Circles of the Varanguard': {
    effects: [
      {
        name: `The Eight Circles of the Varanguard`,
        desc: `During army construction, you must choose one of Varanguard Circle keywords from the table. All Varanguard units in your army gain that keyword and the associated effects.`,
        when: [DURING_SETUP],
      },
    ],
  },
  // The Knights of the Empty Throne
  'Fists of the Everchosen': {
    effects: [
      {
        name: `Fists of the Everchosen`,
        desc: `Varanguard units gain the HERO keyword. The 'Look Out, Sir!' rule does not apply to them.`,
        when: [DURING_GAME],
      },
    ],
  },
  // Idolators
  'Blessed of Chaos': {
    effects: [
      {
        name: `Blessed of Chaos`,
        desc: `Add 1 to prayer rolls for Idolators Priests.`,
        when: [HERO_PHASE],
      },
    ],
  },
  'Panopy of Ruin': {
    effects: [
      {
        name: `Panopy of Ruin`,
        desc: `When an Idolators Cultists unit charges, change the lowest dice to a 6. Change 1 dice to a 6 on a double result.`,
        when: [CHARGE_PHASE],
      },
    ],
  },
  'Destroy the False Idols': {
    effects: [
      {
        name: `Destroy the False Idols`,
        desc: `Add 1 to wound rolls made by Idolators models targetting enemy priests.`,
        when: [SHOOTING_PHASE, COMBAT_PHASE],
      },
    ],
  },
}

export default tagAs(BattleTraits, 'battle_trait')

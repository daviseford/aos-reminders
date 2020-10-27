import { MARK_KHORNE, MARK_NURGLE, MARK_SLAANESH, MARK_TZEENTCH, MARK_UNDIVIDED } from 'meta/alliances'
import { TAbilities } from 'types/army'
import {
  BATTLESHOCK_PHASE,
  CHARGE_PHASE,
  COMBAT_PHASE,
  DURING_GAME,
  DURING_SETUP,
  END_OF_COMBAT_PHASE,
  MOVEMENT_PHASE,
  SHOOTING_PHASE,
  WOUND_ALLOCATION_PHASE,
} from 'types/phases'

// General Allegiance Abilities (always active regardless of army composition)
const Abilities: TAbilities = [
  {
    name: `Aura of Chaos`,
    desc: `If a Slaves to Darkness hero has a Mark of Chaos keyword, that hero has an Aura of Chaos based on the Mark selected during army construction. If a unit has more than one Mark of Chaos you must select one aura it will use for the duration of the battle.`,
    when: [DURING_SETUP],
  },
  {
    name: `Aura of ${MARK_KHORNE}`,
    desc: `You can reroll hit rolls of 1 for attacks made with melee weapons by friendly Slaves to Darkness Khorne units wholly within 12" of this model.
           If this model is a general, additionally add 1 to the wound rolls of those units.`,
    when: [COMBAT_PHASE],
  },
  {
    name: `Aura of ${MARK_TZEENTCH}`,
    desc: `You can reroll save rolls of 1 for attacks that target friendly Slaves to Darkness Tzeentch units wholly within 12" of this model.
           If this model is a general, additionally each time a friendly Slaves to Darkness Tzeentch unit in range of this aura is affected by a spell or endless spell, you can roll a D6. On a 5+ it has no effect on the unit.`,
    when: [DURING_GAME],
  },
  {
    name: `Aura of ${MARK_NURGLE}`,
    desc: `Friendly Slaves to Darkness Nurgle unit wholly within 12" of this model add 1 to the damage inflicted by melee attacks with unmodified wound rolls of 6.`,
    when: [COMBAT_PHASE],
  },
  {
    name: `Aura of ${MARK_NURGLE}`,
    desc: `If this model is a general, subtract 1 from missle attacks made against friendly Slaves to Darkness Nurgle units wholly within 12" of this model.`,
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
    when: [DURING_GAME],
  },
  {
    name: `Eye of the Gods: Flames of Chaos`,
    desc: `Each time this hero is affected by a spell or endless spell you can roll a D6. On a 4+ ignore the effects on this hero.`,
    when: [DURING_GAME],
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
]

export default Abilities

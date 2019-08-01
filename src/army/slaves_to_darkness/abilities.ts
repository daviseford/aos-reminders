import { IEffects } from 'types/data'
import { CHARGE_PHASE, COMBAT_PHASE, DURING_GAME, MOVEMENT_PHASE, SHOOTING_PHASE } from 'types/phases'

// General Allegiance Abilities (always active regardless of army composition)
const Abilities: IEffects[] = [
  {
    name: `Aura of Chaos Power : Khorne`,
    desc: `You can re-roll hits of 1 for attacks made with melee weapons by friendly Khorne Slaves to Darkness units while they are wholly within 8" of a friendly Khorne Slaves to Darkness hero.`,
    when: [COMBAT_PHASE],
    allegiance_ability: true,
  },
  {
    name: `Aura of Chaos Power : Slaanesh`,
    desc: `You can re-roll run and charge rolls for friendly Slaanesh Slaves to Darkness units that are wholly within 6" of a friendly Slaanesh Slaves to Darkness hero.`,
    when: [MOVEMENT_PHASE, CHARGE_PHASE],
    allegiance_ability: true,
  },
  {
    name: `Aura of Chaos Power : Nurgle`,
    desc: `You can re-roll wound rolls of 1 for attacks made by friendly Nurgle Slaves to Darkness units while they are wholly within 7" of a friendly Nurgle Slaves to Darkness hero.`,
    when: [SHOOTING_PHASE, COMBAT_PHASE],
    allegiance_ability: true,
  },
  {
    name: `Aura of Chaos Power : Tzeentch`,
    desc: `You can re-roll save rolls of 1 for attacks that target friendly Tzeentch Slaves to Darkness units while they are wholly within 9" of a friendly Tzeentch Slaves to Darkness hero.`,
    when: [SHOOTING_PHASE, COMBAT_PHASE],
    allegiance_ability: true,
  },
  {
    name: `Aura of Chaos Power : Undivided (No Mark)`,
    desc: `Add 1 to the bravery characteristic of friendly Slaves to Darkness units that do not have a Chaos mark while they are wholly within 12" of any friendly Slaves to Darkness heros that also do not have a Chaos mark.`,
    when: [DURING_GAME],
    allegiance_ability: true,
  },
  {
    name: `Eye of the Gods`,
    desc: `If a friendly Slaves to Darkness hero (excluding Daemon Princes) makes an attack with a melee weapon that slays one or more enemy heroes or monsters, make 1 roll on the Eye of Gods table after that friendly hero's attacks have been resolved.
           
           If that friendly hero receives a reward it already has, roll a dice.  On a 1-3 that hero receives the 'Spawndom' reward instead.  On a 4-6 they receive the 'Dark Apotheosis' reward instead.`,
    when: [COMBAT_PHASE],
    allegiance_ability: true,
  },
]

export default Abilities

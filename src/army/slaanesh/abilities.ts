import { IEffects } from 'types/data'
import {
  COMBAT_PHASE,
  END_OF_CHARGE_PHASE,
  END_OF_MOVEMENT_PHASE,
  HERO_PHASE,
  SHOOTING_PHASE,
  START_OF_GAME,
} from 'types/phases'

// General Allegiance Abilities (always active regardless of army composition)
const Abilities: IEffects[] = [
  {
    name: `Feast of Depravities`,
    desc: `Each time a wound or mortal wound is inflicted on an enemy model by an attack or spell cast made by a friendly Slaanesh hero, and that enemy model is not slain by that wound, you receive 1 depravity point.`,
    when: [HERO_PHASE, SHOOTING_PHASE, COMBAT_PHASE],
    allegiance_ability: true,
  },
  {
    name: `Feast of Depravities`,
    desc: `If you have any depravity points you may summon one or more units from the summoning table.`,
    when: [END_OF_MOVEMENT_PHASE],
    allegiance_ability: true,
  },
  {
    name: `Hosts of Slaanesh`,
    desc: `You must select between Invaders Host, Pretenders Host, or Goodseekers Host when using a Hosts of Slaanesh army.  All units in the army gain the keyword of the selected Host.`,
    when: [START_OF_GAME],
    allegiance_ability: true,
  },
  {
    name: `Locus of Diversion`,
    desc: `Each friendly Hedonite hero that is within 6" of an enemy unit can create a locus of division.  If they do, select 1 enemy unit within 6" of the selected hero and roll a dice, adding 2 if the Hedonite hero is a Greater Daemon.  On a 4+ that enemy unit fights at the end of the following combat phase.  You cannot pick the same unit as the target for this ability more than once in the same charge phase (whether successful or not).`,
    when: [END_OF_CHARGE_PHASE],
    allegiance_ability: true,
  },
  {
    name: `Euphoric Killers`,
    desc: `If the unmodified hit roll for an attack made with a melee weapon by a Chaos Slaanesh model is 6, that attack inflicts 2 hits on the target instead of 1.  Make a wound or save roll for each hit.  If the attacking unit is 20 or more models, its attacks inflict 3 hits instead.`,
    when: [COMBAT_PHASE],
    allegiance_ability: true,
  },
]

export default Abilities

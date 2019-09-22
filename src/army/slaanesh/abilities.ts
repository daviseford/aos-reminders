import { TAbilities } from 'types/army'
import { COMBAT_PHASE, DURING_GAME, END_OF_CHARGE_PHASE, END_OF_MOVEMENT_PHASE } from 'types/phases'

// General Allegiance Abilities (always active regardless of army composition)
const Abilities: TAbilities = [
  {
    name: `Feast of Depravities`,
    desc: `Each time a wound or mortal wound is inflicted on an enemy model by an attack or spell cast made by a friendly Slaanesh hero, and that enemy model is not slain by that wound, you receive 1 depravity point. In addition, every time a wound or mortal wound is allocated to a friendly Slaanesh Hero and not negated, and that friendly model is not slain by that wound or mortal would, you receive 1 depravity point.
    
           Unit abilities and endless spell damage cannot generate depravity.`,
    when: [DURING_GAME],
  },
  {
    name: `Feast of Depravities`,
    desc: `If you have any depravity points you may summon one or more units from the summoning table. Summoned units must be setup wholly within 12" of a friendly Slaanesh Hero and more than 9" from any enemy models.`,
    when: [END_OF_MOVEMENT_PHASE],
  },
  {
    name: `Locus of Diversion`,
    desc: `Each friendly Hedonite hero that is within 6" of an enemy unit can create a Locus of Diversion. If they do, select 1 enemy unit within 6" of the selected hero and roll a D6, adding 2 if the Hedonite hero is a Greater Daemon. On a 4+ that enemy unit fights at the end of the following combat phase. You cannot pick the same unit as the target for this ability more than once in the same charge phase (whether successful or not).`,
    when: [END_OF_CHARGE_PHASE],
  },
  {
    name: `Euphoric Killers`,
    desc: `If the unmodified hit roll for an attack made with a melee weapon by a Chaos Slaanesh model is 6, that attack inflicts 2 hits on the target instead of 1. Make a wound or save roll for each hit. If the attacking unit is 20 or more models, its attacks inflict 3 hits instead.`,
    when: [COMBAT_PHASE],
  },
]

export default Abilities

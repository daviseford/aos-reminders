import { TAbilities } from 'types/army'
import {
  COMBAT_PHASE,
  END_OF_CHARGE_PHASE,
  END_OF_MOVEMENT_PHASE,
  WOUND_ALLOCATION_PHASE,
} from 'types/phases'

// General Allegiance Abilities (always active regardless of army composition)
const Abilities: TAbilities = [
  {
    name: `Thrilling Compulsions`,
    effects: [
      {
        name: `Feast of Depravities`,
        desc: `Each time a wound or mortal wound is inflicted on an enemy model by an attack or spell cast made by a friendly Slaanesh hero, and that enemy model is not slain by that wound, you receive 1 depravity point. In addition, every time a wound or mortal wound is allocated to a friendly Slaanesh Hero and not negated, and that friendly model is not slain by that wound or mortal would, you receive 1 depravity point.
      
               Unit abilities and endless spell damage cannot generate depravity.`,
        when: [WOUND_ALLOCATION_PHASE],
      },
      {
        name: `Feast of Depravities`,
        desc: `If you have any depravity points you may summon one or more units from the summoning table. Summoned units must be setup wholly within 12" of a friendly Slaanesh Hero and more than 9" from any enemy models.`,
        when: [END_OF_MOVEMENT_PHASE],
      },
      {
        name: `Feast of Depravities`,
        desc: `Summoning Costs:
               1 Keeper of Secrets                  45 DP
               30 Daemonettes -                     40 DP
               3 Seeker Chariots -                  35 DP
               20 Daemonettes -                     28 DP
               1 Contorted Epitome -                23 DP
               1 Bladebringer on Exalted Chariot -  23 DP
               3 Fiends -                           23 DP
               1 Bladebringer on Hellflayer -       20 DP
               1 Exalted Chariot -                  20 DP
               1 Infernal Enrapturess -             17 DP
               1 Bladebringer on Seeker Chariot -   17 DP
               1 Hellflayer -                       17 DP
               1 Viceleader -                       15 DP
               1 Seeker Chariot -                   15 DP
               5 Seekers -                          15 DP
               10 Daemonettes -                     14 DP`,
        when: [END_OF_MOVEMENT_PHASE],
      },
      {
        name: `Locus of Diversion`,
        desc: `Each friendly Hedonite hero that is within 6" of an enemy unit can create a Locus of Diversion. If they do, select 1 enemy unit within 6" of the selected hero and roll a D6, adding 2 if the Hedonite hero is a Greater Daemon. On a 5+, that enemy unit fights at the end of the following combat phase, after the players have picked any other units to fight in that combat phase. You cannot pick the same unit as the target for this ability more than once in the same charge phase (whether successful or not).`,
        when: [END_OF_CHARGE_PHASE],
      },
      {
        name: `Euphoric Killers`,
        desc: `If the unmodified hit roll for an attack made with a melee weapon by a Chaos Slaanesh model is 6, that attack inflicts 2 hits on the target instead of 1. Make a wound or save roll for each hit. If the attacking unit is 20 or more models, its attacks inflict 3 hits instead.`,
        when: [COMBAT_PHASE],
      },
    ],
  },
]

export default Abilities

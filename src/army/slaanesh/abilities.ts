import { TAbilities } from 'types/army'
import {
  COMBAT_PHASE,
  DURING_GAME,
  END_OF_CHARGE_PHASE,
  END_OF_MOVEMENT_PHASE,
  START_OF_HERO_PHASE,
  START_OF_SETUP,
} from 'types/phases'

// General Allegiance Abilities (always active regardless of army composition)
const Abilities: TAbilities = [
  {
    name: `Feast of Depravities`,
    desc: `Each time a wound or mortal wound is inflicted on an enemy model by an attack or spell cast made by a friendly Slaanesh hero, and that enemy model is not slain by that wound, you receive 1 depravity point.  In addition, every time a wound or mortal wound is allocated to a friendly Slaanesh Hero and not negated, and that friendly model is not slain by that wound or mortal would, you receive 1 depravity point.
    
           Unit abilities and endless spell damage cannot generate depravity.`,
    when: [DURING_GAME],
    allegiance_ability: true,
  },
  {
    name: `Feast of Depravities`,
    desc: `If you have any depravity points you may summon one or more units from the summoning table. Summoned units must be setup wholly within 12" of a friendly Slaanesh Hero and more than 9" from any enemy models.`,
    when: [END_OF_MOVEMENT_PHASE],
    allegiance_ability: true,
  },
  {
    name: `Locus of Diversion`,
    desc: `Each friendly Hedonite hero that is within 6" of an enemy unit can create a Locus of Diversion.  If they do, select 1 enemy unit within 6" of the selected hero and roll a dice, adding 2 if the Hedonite hero is a Greater Daemon.  On a 4+ that enemy unit fights at the end of the following combat phase.  You cannot pick the same unit as the target for this ability more than once in the same charge phase (whether successful or not).`,
    when: [END_OF_CHARGE_PHASE],
    allegiance_ability: true,
  },
  {
    name: `Euphoric Killers`,
    desc: `If the unmodified hit roll for an attack made with a melee weapon by a Chaos Slaanesh model is 6, that attack inflicts 2 hits on the target instead of 1.  Make a wound or save roll for each hit.  If the attacking unit is 20 or more models, its attacks inflict 3 hits instead.`,
    when: [COMBAT_PHASE],
    allegiance_ability: true,
  },
  {
    name: `Fane of Slaanesh`,
    desc: `After territories have been chosen, but before armies are set up, you can set up the Fane of Slaanesh wholly within your territory and more than 3" from any other terrain features and 1" away from any objectives.  If both players can set up a terrain feature before territory selection, they must roll off with the winner placing first.`,
    when: [START_OF_SETUP],
    allegiance_ability: true,
  },
  {
    name: `Fane of Slaanesh`,
    desc: `If you spend depravity points to summon a unit to the battlefield, and that unit is set up wholly within 12" of this terrain feature, you receive D3 depravity points after that unit has been set up.`,
    when: [END_OF_MOVEMENT_PHASE],
  },
  {
    name: `Fane of Slaanesh`,
    desc: `You can pick 1 friendly Chaos Slaanesh Hero within 6" of this terrain feature to make a sacrifice. If you do so, that Hero suffers 1 mortal wound, and you must roll a dice. On a 1, nothing happens. On a 2+ you can re-roll hit rolls for attacks made by that Hero until your next hero phase.
           
           If the hero has an artefact of power, they can sacrifice that instead of suffering 1 mortal wound. If they do so, that artefact of power can no longer be used (if a weapon was picked when the artefact of power was selected, that weapon reverts to normal). However, on a roll of 2+, you can re-roll hit rolls for attacks made by that Hero for the rest of the battle instead of only until your next hero phase.  A depleted artefact may be used for this purpose and is considered destroyed afterwards.`,
    when: [START_OF_HERO_PHASE],
  },
]

export default Abilities

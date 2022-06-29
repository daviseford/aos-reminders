import {
  CHARGE_PHASE,
  COMBAT_PHASE,
  HERO_PHASE,
  MOVEMENT_PHASE,
  SHOOTING_PHASE,
  START_OF_HERO_PHASE,
  START_OF_SETUP,
  START_OF_SHOOTING_PHASE,
  TURN_ONE_START_OF_ROUND,
  WOUND_ALLOCATION_PHASE,
} from 'types/phases'

const Flavors = {
  Masterclan: {
    effects: [
      {
        name: `Skilled Manipulators`,
        desc: `Roll a dice before you allocate a wound or mortal wound to a friendly MASTERCLAN HERO that is not a MONSTER, or instead of making a ward roll for a wound or mortal wound that would be allocated to a friendly MASTERCLAN HERO that is not a MONSTER, if that HERO is within 3" of any friendly SKAVEN units that have 3 or more models. On a 3+, that wound or mortal wound is allocated to 1 of those units instead of that HERO.`,
        when: [WOUND_ALLOCATION_PHASE],
      },
      {
        name: `Always Three Clawsteps Ahead`,
        desc: `You can only use this ability if you include 3 or more MASTERCLAN HEROES in your starting army. After you pick a friendly SKAVEN unit to be your first unit to run in a phase and make a run roll for that unit, you can use that run roll in place of any other run rolls you make for friendly SKAVEN units until the end of that phase.`,
        when: [MOVEMENT_PHASE],
      },
      {
        name: `Always Three Clawsteps Ahead`,
        desc: `You can only use this ability if you include 3 or more MASTERCLAN HEROES in your starting army. After you pick a friendly SKAVEN unit to be your first unit to attempt a charge in a phase and make a charge roll for that unit, you can use that charge roll in place of any other charge rolls you make for friendly SKAVEN units until the end of that phase.`,
        when: [CHARGE_PHASE],
      },
      {
        name: `Always Three Clawsteps Ahead`,
        desc: `You can only use this ability if you include 3 or more MASTERCLAN HEROES in your starting army. After you pick a friendly SKAVEN unit to be your first unit to fight in a phase and make any pile-in moves for that unit, you can make pile-in moves for each other friendly SKAVEN unit on the battlefield that is within 3" of any enemy units.

        Designer's Note: This ability does not prevent a unit from making another pile-in move when it is picked to fight.`,
        when: [COMBAT_PHASE],
      },
    ],
  },
  Moulder: {
    effects: [
      {
        name: `Prized Creations`,
        desc: `At the start of the first battle round, after determining who has the first turn but before the first turn begins, you can pick 1 HELL PIT ABOMINATION in your army to have a mutation from the table. If you include 3 or more MASTER MOULDERS in your starting army, you can pick each HELL PIT ABOMINATION in your army to have a mutation instead of only 1.

        The same HELL PIT ABOMINATION cannot have more than 1 mutation, and an army cannot include duplicates of the same mutation.
        
        Toughened Sinews: This unit has a Wounds characteristic of 16 and a Save characteristic of 4+.

        Lumbering Behemoth: This unit has a Move characteristic of 7". In addition, charge rolls for this unit are automatically a 7 (do not roll the dice).

        Quivering Bulk: Add 1 to each roll you make for this unit's Avalanche of Flesh ability.

        Accelerated Regeneration: You can use this unit's Regenerating Monstrosity ability in the enemy hero phase as well as in your hero phase.

        Best-best Warpstone Spikes: You can reroll the dice when you use this unit's Warpstone Spikes ability.
        
        Never-never Die-die: You can reroll the dice when you use this unit's Too Horrible To Die ability.`,
        when: [TURN_ONE_START_OF_ROUND],
      },
    ],
  },
  Eshin: {
    effects: [
      {
        name: `Masters of Murder`,
        desc: `At the start of the first battle round, after determining who has the first turn but before the first turn begins, you can pick 1 enemy on the battlefield. Add 1 to hit rolls and wound rolls for attacks made by friendly CLANS ESHIN units that target that HERO.

        If you include 3 or more CLANS HEROES in your starting army, add 1 to hit rolls and wound rolls for attacks made with melee weapons by friendly CLANS ESHIN units that target enemy HEROES.`,
        when: [TURN_ONE_START_OF_ROUND],
      },
      {
        name: `Masters of Murder`,
        desc: `Add 1 to hit rolls and wound rolls for attacks made by friendly CLANS ESHIN units that target that HERO. If you include 3 or more CLANS HEROES in your starting army, add 1 to hit rolls and wound rolls for attacks made with melee weapons by friendly CLANS ESHIN units that target enemy HEROES.`,
        when: [COMBAT_PHASE, SHOOTING_PHASE],
      },
    ],
  },
  Verminus: {
    effects: [
      {
        name: `Mighty Warlords`,
        desc: `This is a heroic action that you can carry out with 1 friendly CLAWLORD instead of picking 1 from the table in the core rules. If you do so, pick 1 eligible command trait from pages 70-71 that this CLAWLORD does not already have and apply its effect to this unit until the end of this turn.

        If you include 3 or more CLAWLORDS in your starting army, you can carry out this heroic action with each friendly CLAWLORD instead just 1. The same command trait cannot be picked with this ability more than once in the same turn.`,
        when: [START_OF_HERO_PHASE],
      },
    ],
  },
  Skryre: {
    effects: [
      {
        name: `Warpstone Sparks`,
        desc: `If you include any CLANS SKRYRE HEROES in your starting army, at the start of the battle, before either player starts deploying units, you can roll a D3 and add 3 to the roll, If you include 3 or more CLANS SKRYRE HEROES in your starting army, you can roll a D6 and add 3 to the roll instead. The result is the number of warpstone sparks you receive that you can use during the battle, You cannot use more than 1 warpstone spark in the same phase. Each warpstone spark can be used once per battle to carry out 1 of the warpstone spark abilities: `,
        when: [START_OF_SETUP],
      },
      {
        name: `Warpstone Sparks`,
        desc: `In the hero phase, pick 1 friendly CLANS SKRYRE WIZARD. You can reroll casting, dispelling and unbinding rolls for that WIZARD until the end of that phase. At the end of that phase, roll a dice. On a 1, that WIZARD suffers D3 mortal wounds.`,
        when: [HERO_PHASE],
      },
      {
        name: `Warpstone Sparks`,
        desc: `At the start of your shooting phase, pick 1 friendly CLANS SKRYRE HERO. Then pick up to 3 different friendly CLANS SKRYRE units wholly within 13" of that HERO. You can add 1 to the Damage characteristic of missile weapons used by those units until the end of that phase. At the end of that phase, roll a dice. On a 1, that HERO suffers D3 mortal wounds.`,
        when: [START_OF_SHOOTING_PHASE],
      },
      {
        name: `Warpstone Sparks`,
        desc: `In the combat phase, when you pick a friendly CLANS SKRYRE HERO to fight, you can say that they will use this warpstone spark ability. If you do so, add 1 to hit rolls and wound attacks made by that HERO until the end phase. At the end of that phase, roll a dice. On a 1, that HERO suffers D3 mortal wounds.`,
        when: [COMBAT_PHASE],
      },
    ],
  },
  Pestilens: {
    effects: [
      {
        name: `Echoes of the Great Plagues`,
        desc: `When you make a chanting roll for a friendly CLANS PESTILENS PRIEST, you can add 1 to that chanting roll for each other friendly CLANS PESTILENS PRIEST wholly within 13" of the chanter. In addition, if the chanting roll for a prayer chanted by a friendly CLANS PESTILENS PRIEST is 6+, you can pick 1 of the following Great Plagues to manifest (in addition to the effect of the prayer). Each Great Plague can only manifest once per battle, and no more than one Great Plague can manifest in the same turn.

        Bubonic Blightplague: If this Great Plague manifests, pick the nearest enemy unit within 13" of the chanter. That unit is infected with the Bubonic Blightplague. If several enemy units are tied to be the closest, you can pick which is infected. The infected unit suffers 2D6 mortal wounds. If the infected unit is destroyed by those mortal wounds, you can pick another enemy unit within 6" of the last model to be slain in the infected unit. That unit is now infected and suffers D6 mortal wounds. If that infected unit is likewise destroyed, you can pick another enemy unit within 6" of the last model to be slain. Ihat unit is now infected and suffers D3 mortal wounds, Continue in this manner until either a unit is not destroyed or there are no other enemy units within 6" of a destroyed unit.

        Crimsonweal Curse: If this Great Plague manifests, pick the nearest enemy unit within 13" of the chanter, That unit is infected with the Crimsonweal Curse for the rest of the battle. If several enemy units are tied to be the closest, you can pick which is infected. The infected unit suffers 1 mortal wound. In addition, at the start of each turn, the infected unit and each other enemy unit within 1" of the infected unit suffer 1 mortal wound.

        Redmaw Plague: If this Great Plague manifests, pick the nearest enemy HERO within 13" of the chanter, That HERO is infected with the Redmaw Plague for the rest of the battle. If several enemy HEROES are tied to be the closest, you can pick which is infected. At the start of the combat phase, if the infected HERO is within 3" of any other units in your opponent's army and is not within 3" of any units in your army, then you can treat that HERO as a friendly unit until the end of that combat phase.

        The Neverplague: If this Great Plague manifests, you can reroll chanting rolls for friendly CLANS PESTILENS PRIESTS for the rest of the battle.

        Undulant Scourge: If this Great Plague manifests, pick the nearest enemy unit within 13" of the chanter and roll a dice for each model in that unit. If several enemy units are tied to be the closest, you can pick which unit to roll dice for. For each 4+, that unit suffers 1 mortal wound.`,
        when: [HERO_PHASE],
      },
    ],
  },
}

export default Flavors

import {
  BATTLESHOCK_PHASE,
  COMBAT_PHASE,
  DURING_GAME,
  END_OF_HERO_PHASE,
  END_OF_MOVEMENT_PHASE,
  HERO_PHASE,
  START_OF_HERO_PHASE,
  START_OF_SETUP,
} from 'types/phases'

export const SeraphonBattleTraits = {
  SERAPHON: {
    effects: [
      {
        name: `Warriors of the Stars and the Realms`,
        desc: `After you have chosen the Seraphon allegiance for your army, you must either give it the STARBORNE keyword or the COALESCED keyword. All SERAPHON units in your army gain that keyword, with the exception of models that already have one of the keywords on their warscroll.`,
        when: [START_OF_SETUP],
      },
      {
        name: `Contemplations of the Ancient Ones`,
        desc: `At the end of your hero phase, you can pick 1 friendly SLANN and replace the spell they know from the Lore of Celestial Domination table (pg 60) with a new spell from that table. Choose or roll for the new spell, rolling again if you generate the spell the SLANN already had.`,
        when: [END_OF_HERO_PHASE],
      },
      {
        name: `Sacred Asterisms`,
        desc: `At the start of your hero phase, you can pick 1 of the following asterisms to be in the ascendant until your next hero phase:
            
                The Great Drake: In the combat phase, pick 1 friendly SERAPHON HERO. Until the end of that phase, you can add 1 to the Attacks characteristic of melee weapons used by that HERO.
                The Hunter's Steed: Add 1 to run rolls and charge rolls for friendly SERAPHON units.
                The Sage's Staff: At the start of the hero phase, pick 1 friendly SERAPHON WIZARD. You can add 1 to casting or dispelling rolls for that WIZARD if it is your hero phase, and you can add 1 to unbinding rolls for that WIZARD if it is the enemy hero phase.`,
        when: [START_OF_HERO_PHASE],
      },
    ],
  },
  COALESCED: {
    effects: [
      {
        name: 'COALESCED',
        desc: `If your army is a COALESCED army, you can give it the KOATL'S CLAW or THUNDER LIZARD keyword. All COALESCED units in your army gain that keyword and you can use the extra abilities listed for that Constellation (pg 64-67).`,
        when: [START_OF_SETUP],
      },
      {
        name: `Cold-blooded`,
        desc: `Ignore modifiers (positive or negative) to the Bravery characteristic of COALESCED units.`,
        when: [BATTLESHOCK_PHASE],
      },
      {
        name: `Predatory Fighters`,
        desc: `Add 1 to the Attacks characteristic of Jaws weapons used by COALESCED units.`,
        when: [COMBAT_PHASE],
      },
      {
        name: `Primeval Domain`,
        desc: `If a terrain feature is partially or wholly within the territory of a COALESCED army, then any Damned, Arcane, Inspiring and Mystical scenery rules for that terrain feature only apply to COALESCED units, while any Deadly and Sinister scenery rules for that terrain feature do not apply to COALESCED units.`,
        when: [DURING_GAME],
      },
      {
        name: `Scaly Skin`,
        desc: `Subtract 1 from the damage inflicted by each successful attack that targets a COALESCED unit (to a minimum of 1)`,
        when: [DURING_GAME],
      },
    ],
  },
  STARBORNE: {
    effects: [
      {
        name: `Unfeeling`,
        desc: `STARBORNE units have a Bravery characteristic of 10 instead of the Bravery characteristic on their warscroll.`,
        when: [BATTLESHOCK_PHASE],
      },
      {
        name: `Celestial Conjuration`,
        desc: `You can summon STARBORNE units to the battlefield if you collect enough celestial conjuration points (CCPs). At the start of your hero phase you receive D3 celestial conjuration points if your general is a SLANN or STARSEER and is on the battlefield, and D3 CCP if there are one or more friendly SAURUS ASTROLITH BEARERS on the battlefield.`,
        when: [START_OF_HERO_PHASE],
      },
      {
        name: `Celestial Conjuration`,
        desc: `In addition, in your hero phase, before attempting to cast the first spell with each friendly SLANN or ORACLE, you can say that it will carry out a celestial conjuration. If you do so, you receive D3 celestial conjuration points but the number of spells which that model can attempt to cast in that phase is reduced by 1.`,
        when: [HERO_PHASE],
      },
      {
        name: `Celestial Conjuration`,
        desc: `If you have 6 or more celestial conjuration points at the end of your movement phase, you can summon 1 or more units from the conjuration list to the battlefield and add them to your army. Each unit you summon costs a number of celestial conjuration points as shown on the list, and you can only summon a unit if you have enough celestial conjuration points to pay its cost.
    
            Summoned units must be set up wholly within 12" of a friendly SLANN, friendly ORACLE or friendly SAURUS ASTROLITH BEARER and more than 9" from any enemy units. Subtract the cost of the summoned unit from the number of celestial conjuration points you have immediately after the summoned unit has been set up. Summoned units have the STARBORNE keyword.`,
        when: [END_OF_MOVEMENT_PHASE],
      },
      {
        name: `Lords of Space and Time`,
        desc: `At the end of your movement phase, you can pick 1 friendly STARBORNE unit anywhere on the battlefield to be transported through space and time.
    
            If you do so, remove that unit from the battlefield and then set it up on the battlefield anywhere that is more than 9" from any enemy unit.`,
        when: [END_OF_MOVEMENT_PHASE],
      },
      {
        name: `Starborne Constellations`,
        desc: `If your army is a STARBORNE army, you can give it the DRACOTHION'S TAIL or FANGS OF SOTEK keyword. All STARBORNE units in your army gain that keyword and you can use the extra abilities listed for that Constellation (pg 64-67)`,
        when: [START_OF_SETUP],
      },
    ],
  },
}

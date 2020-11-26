import { TAbilities } from 'types/army'
import { END_OF_HERO_PHASE, START_OF_HERO_PHASE, START_OF_SETUP } from 'types/phases'

// General Allegiance Abilities (always active regardless of army composition)
const Abilities: TAbilities = [
  {
    name: `Seraphon`,
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
]

export default Abilities

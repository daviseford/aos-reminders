import { COMBAT_PHASE, START_OF_HERO_PHASE } from 'types/phases'
import { IEffects } from 'types/data'

// General Allegiance Abilities (always active regardless of army composition)
const Abilities: IEffects[] = [
  {
    name: `Beastclaw Stampede`,
    desc: `On a turn in which they charge into combat, you can re-roll all wound rolls of 1 made for BEASTCLAW RAIDER models in the combat phase.`,
    when: [COMBAT_PHASE],
  },
  {
    name: `The Everwinter's Blessing`,
    desc: `Roll a dice at the start of each of your hero phases to determine the effects of Everwinter's Blessing on the battle:
    
    1-2 Fortifying Hoarfrost: You can re-roll save rolls of 1 for all friendly BEASTCLAW RAIDER models until the start of your next hero phase.
    
    3-4 Freezing Tailwinds: All friendly BEASTCLAW RAIDERS models can immediately move 3" as if it were the movement phase (they cannot run or retreat as part of this move).
    
    5 Deadly Frostbite: Roll a dice for each enemy unit within 3" of at least one of your BEASTCLAW RAIDERS models. On a 6 that unit suffers D3 mortal wounds.
    
    6 Raging Blizzard: Roll a dice for each enemy unit within 3" of at least one of your BEASTCLAW RAIDERS models. On a 6 that unit suffers D6 mortal wounds.`,
    when: [START_OF_HERO_PHASE],
  },
]

export default Abilities

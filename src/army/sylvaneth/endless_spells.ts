import { HERO_PHASE, BATTLESHOCK_PHASE, END_OF_HERO_PHASE } from 'types/phases'
import { TEndlessSpells } from 'types/army'

// Endless spells.
const EndlessSpells: TEndlessSpells = [
  {
    name: `Gladewyrm`,
    effects: [
      {
        name: `Summon Gladewyrm`,
        desc: `Only SYLVANETH WIZARDS can attempt to cast Summon Gladewyrm. Casting value of 7. If successfully cast, set up a Gladewyrm model wholly within 6" of the caster.`,
        when: [HERO_PHASE],
      },
      {
        name: `Burrowing Doom`,
        desc: `When this model is set up, the player who set it up can immediately make a move with it.`,
        when: [HERO_PHASE],
      },
      {
        name: `Death From Below`,
        desc: `After this model has moved, roll a D6 for each unit within 1" of it. On a 3+ that unit suffers D3 mortal wounds. This ability has no effect on units with the SYLVANETH keyword.`,
        when: [HERO_PHASE],
      },
      {
        name: `Healing Mist`,
        desc: `After this model has moved, roll a D6 for each SYLVANETH unit wholly within 6" of this model. On a 3+ heal up to D3 wounds allocated to that unit.`,
        when: [HERO_PHASE],
      },
    ],
  },
  {
    name: `Spiteswarm Hive`,
    effects: [
      {
        name: `Summon Spiteswarm Hive`,
        desc: `Only SYLVANETH WIZARDS can attempt to cast Summon Spiteswarm Hive. Casting value of 7. If successfully cast, set up a Spiteswarm Hive model wholly within 15" of the caster.`,
        when: [HERO_PHASE],
      },
      {
        name: `The Hive Nourishes`,
        desc: `At the end of the hero phase, if this model is on the battlefield, the player who set it up can pick one of the effects below and immediately resolve that effect. The same unit cannot be picked to be affected by this ability more than once per hero phase. 
        
        Vital Venoms: Roll a D6 for each SYLVANETH unit wholly within 8" of this model. On a 2+ add 3" to that unit's normal moves and charge moves until the end of the turn.
         
        Shielding Swarm: Roll a D6 for each SYLVANETH unit wholly within 8" of this model. On a 2+ re-roll save rolls of 1 for attacks that target that unit until the end of the turn.`,
        when: [END_OF_HERO_PHASE],
      },
    ],
  },
  {
    name: `Vengeful Skullroot`,
    effects: [
      {
        name: `Summon Vengeful Skullroot`,
        desc: `Only SYLVANETH WIZARDS can attempt to cast Summon Vengeful Skullroot. Casting value of 6. If successfully cast, set up a Vengeful Skullroot model wholly within 6" of the caster.`,
        when: [HERO_PHASE],
      },
      {
        name: `Uprooted Spirit`,
        desc: `When this model is set up, the player who set it up can immediately make a move with it.`,
        when: [HERO_PHASE],
      },
      {
        name: `Terrors Unearthed`,
        desc: `If a unit fails a battleshock test within 3" of any models with this ability, add D3 to the number of models that flee. This ability has no effect on units with the SYLVANETH keyword.`,
        when: [BATTLESHOCK_PHASE],
      },
      {
        name: `Strangelroots`,
        desc: `After this model has moved, each unit that has any models it passed across suffers D3 mortal wounds, or D6 mortal wounds if that unit is also within 3" of any AWAKENED WYLDWOODS. This ability has no effect on units with the SYLVANETH keyword.`,
        when: [HERO_PHASE],
      },
    ],
  },
]

export default EndlessSpells

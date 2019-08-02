import { HERO_PHASE, END_OF_HERO_PHASE } from 'types/phases'
import { TSpells } from 'types/army'

const Spells: TSpells = [
  {
    name: `Verdant Blessing`,
    effects: [
      {
        name: `Verdant Blessing`,
        desc: `Verdant Blessing has a casting value of 6. If successfully cast, set up 1 AWAKENED WYLDWOOD wholly within 24" of the caster and more than 1" from any other model, terrain feature or objective.`,
        when: [HERO_PHASE],
      },
    ],
  },
  // Endless Spells
  {
    name: `Gladewyrm (Endless Spell)`,
    effects: [
      {
        name: `Summon Gladewyrm`,
        desc: `Only SYLVANETH WIZARDS can attempt to cast Summon Gladewyrm. It has a casting value of 7. If successfully cast, set up a Gladewyrm model wholly within 6" of the caster.`,
        when: [HERO_PHASE],
      },
      {
        name: `Burrowing Doom`,
        desc: `When this model is set up, the player who set it up can immediately make a move with it.`,
        when: [HERO_PHASE],
      },
      {
        name: `Death From Below`,
        desc: `After this model has moved, roll a dice for each unit within 1" of it. On a 3+ that unit suffers D3 mortal wounds. This ability has no effect on units with the SYLVANETH keyword.`,
        when: [HERO_PHASE],
      },
      {
        name: `Healing Mist`,
        desc: `After this model has moved, roll a dice for each SYLVANETH unit wholly within 6" of this model. On a 3+ heal up to D3 wounds allocated to that unit.`,
        when: [HERO_PHASE],
      },
    ],
  },
  {
    name: `Spiteswarm Hive (Endless Spell)`,
    effects: [
      {
        name: `Summon Spiteswarm Hive`,
        desc: `Only SYLVANETH WIZARDS can attempt to cast Summon Spiteswarm Hive. It has a casting value of 7. If successfully cast, set up a Spiteswarm Hive model wholly within 15" of the caster.`,
        when: [HERO_PHASE],
      },
      {
        name: `The Hive Nourishes`,
        desc: `At the end of the hero phase, if this model is on the battlefield, the player who set it up can pick one of the effects below and immediately resolve that effect. The same unit cannot be picked to be affected by this ability more than once per hero phase. <br/>Vital Venoms: Roll a dice for each SYLVANETH unit wholly within 8" of this model. On a 2+ add 3" to that unit's normal moves and charge moves until the end of the turn. <br/>Shielding Swarm: Roll a dice for each SYLVANETH unit wholly within 8" of this model. On a 2+ re-roll save rolls of 1 for attacks that target that unit until the end of the turn.`,
        when: [END_OF_HERO_PHASE],
      },
    ],
  },
  {
    name: `Vengeful Skullroot (Endless Spell)`,
    effects: [
      {
        name: `Summon Vengeful Skullroot`,
        desc: `Only SYLVANETH WIZARDS can attempt to cast Summon Vengeful Skullroot. It has a casting value of 6. If successfully cast, set up a Vengeful Skullroot model wholly within 6" of the caster.`,
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
        when: [HERO_PHASE],
      },
      {
        name: `Strangelroots`,
        desc: `After this model has moved, each unit that has any models it passed across suffers D3 mortal wounds, or D6 mortal wounds if that unit is also within 3" of any AWAKENED WYLDWOODS. This ability has no effect on units with the SYLVANETH keyword.`,
        when: [HERO_PHASE],
      },
    ],
  },
  // Lore of the Deepwood
  {
    name: `Throne of Vines`,
    effects: [
      {
        name: `Throne of Vines`,
        desc: `Throne of Vines has a casting value of 5. If successfully cast, add 2 to casting rolls for the caster until the caster makes a move or is set up in a different location.`,
        when: [HERO_PHASE],
      },
    ],
  },
  {
    name: `Regrowth`,
    effects: [
      {
        name: `Regrowth`,
        desc: `Regrowth has a casting value of 5. If successfully cast, pick 1 friendly SYLVANETH unit wholly within 18" of the caster and visible to them. You can heal up to D6 wounds allocated to that unit.`,
        when: [HERO_PHASE],
      },
    ],
  },
  {
    name: `The Dwellers Below`,
    effects: [
      {
        name: `The Dwellers Below`,
        desc: `The Dwellers Below has a casting value of 7. If successfully cast, pick 1 enemy unit within 10" of the caster and visible to them and roll a number of dice equal to the number of models in that unit. For each 6+ that unit suffers 1 mortal wound.`,
        when: [HERO_PHASE],
      },
    ],
  },
  {
    name: `Deadly Harvest`,
    effects: [
      {
        name: `Deadly Harvest`,
        desc: `Deadly Harvest has a casting value of 6. If successfully cast, each enemy unit within 3" of the caster suffers D3 mortal wounds (roll separately for each unit).`,
        when: [HERO_PHASE],
      },
    ],
  },
  {
    name: `Verdurous Harmony`,
    effects: [
      {
        name: `Verdurous Harmony`,
        desc: `Verdurous Harmony has a casting value of 7. If successfully cast, pick 1 friendly SYLVANETH unit wholly within 18" of the caster and visible to them. You can return 1 slain model to that unit. If you picked a unit of DRYADS, TREE-REVENANTS or SPITE-REVENANTS, you can return up to D3 slain models to that unit instead of 1.`,
        when: [HERO_PHASE],
      },
    ],
  },
  {
    name: `Treesong`,
    effects: [
      {
        name: `Treesong`,
        desc: `Treesong has a casting value of 7. If successfully cast, pick 1 enemy unit within 16" of the caster and within 6" of an AWAKENED WYLDWOOD. Until the end of the turn, you can re-roll hit and wound rolls of 1 for attacks made with melee weapons that target that unit.`,
        when: [HERO_PHASE],
      },
    ],
  },
]

export default Spells

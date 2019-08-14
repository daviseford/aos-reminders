import { TArtifacts } from 'types/army'
import { HERO_PHASE } from 'types/phases'

const Artifacts: TArtifacts = [
  {
    name: `Ramhorn Helm (Brayherds)`,
    effects: [
      {
        name: `Ramhorn Helm (Brayherds)`,
        desc: `After the bearer completes a charge move, pick an enemy unit within 1" of them. That unit suffers D3 mortal wounds.`,
        when: [],
      },
    ],
  },
  {
    name: `Brayblast Trumpet (Brayherds)`,
    effects: [
      {
        name: `Brayblast Trumpet (Brayherds)`,
        desc: `Add 1 to hit rolls for attacks made by friendly BRAYHERD units while they are wholly within 18" of the bearer if those units used the Brayherd Ambush battle trait to set up on the battlefield in that turn.`,
        when: [],
      },
    ],
  },
  {
    name: `The Knowing Eye (Brayherds)`,
    effects: [
      {
        name: `The Knowing Eye (Brayherds)`,
        desc: `At the start of your hero phase, roll a dice if the bearer is on the battlefield. On a 4+ you receive 1 additional command point.`,
        when: [],
      },
    ],
  },
  {
    name: `Volcanic Axe (Brayherds)`,
    effects: [
      {
        name: `Volcanic Axe (Brayherds)`,
        desc: `Pick one of the bearer’s melee weapons. Add 1 to that weapon’s Damage characteristic. In addition, each time you make an unmodified hit roll of 6 for an attack made with that weapon, the target suffers 1 mortal wound after all of the bearer’s attacks have been resolved.`,
        when: [],
      },
    ],
  },
  {
    name: `Bleating Gnarlstaf (Brayherds)`,
    effects: [
      {
        name: `Bleating Gnarlstaf (Brayherds)`,
        desc: `If the bearer is within 1" of a terrain feature at the end of your movement phase, roll a dice. On a 3+ each enemy unit within 1" of that terrain feature suffers 1 mortal wound.`,
        when: [],
      },
    ],
  },
  {
    name: `Troggoth-hide Cloak (Brayherds)`,
    effects: [
      {
        name: `Troggoth-hide Cloak (Brayherds)`,
        desc: `At the start of your hero phase, you can heal 1 wound that has been allocated to the bearer.`,
        when: [],
      },
    ],
  },
  {
    name: `Cleaver of the Brass Bull (Warherds)`,
    effects: [
      {
        name: `Cleaver of the Brass Bull (Warherds)`,
        desc: `Pick one of the bearer’s melee weapons. Improve that weapon’s Rend characteristic by 1. In addition, if the unmodified hit roll for an attack made with that weapon is 6, add 1 to the Damage characteristic of that weapon for that attack.`,
        when: [],
      },
    ],
  },
  {
    name: `Gilded Horns (Warherds)`,
    effects: [
      {
        name: `Gilded Horns (Warherds)`,
        desc: `After the bearer has made a charge move, pick an enemy unit within 1" of the bearer and roll a number of dice equal to the charge roll for that charge move. For each roll of 5+, that enemy unit suffers 1 mortal wound.`,
        when: [],
      },
    ],
  },
  {
    name: `Glyph-etched Talisman (Warherds)`,
    effects: [
      {
        name: `Glyph-etched Talisman (Warherds)`,
        desc: `The bearer can attempt to unbind one spell in the enemy hero phase in the same manner as a WIZARD.`,
        when: [],
      },
    ],
  },
  {
    name: `Blackened Armour of Chaos (Warherds)`,
    effects: [
      {
        name: `Blackened Armour of Chaos (Warherds)`,
        desc: `Roll a dice each time you allocate a mortal wound to the bearer. On a 4+ that mortal wound is negated.`,
        when: [],
      },
    ],
  },
  {
    name: `Champion’s Doomcloak (Warherds)`,
    effects: [
      {
        name: `Champion’s Doomcloak (Warherds)`,
        desc: `Add 2 to charge rolls made for the bearer.`,
        when: [],
      },
    ],
  },
  {
    name: `Herdstone Shard (Warherds)`,
    effects: [
      {
        name: `Herdstone Shard (Warherds)`,
        desc: `When BULLGOR units wholly within 6" of the bearer use their Bloodgreed ability, it activates on an unmodified roll of 5 or 6.`,
        when: [],
      },
    ],
  },
  {
    name: `Ancestral Azyrite Blade (Thunderscorn)`,
    effects: [
      {
        name: `Ancestral Azyrite Blade (Thunderscorn)`,
        desc: `Pick one of the bearer’s melee weapons. Improve that weapon’s Rend characteristic by 2.`,
        when: [],
      },
    ],
  },
  {
    name: `Lightning-chained Bracers (Thunderscorn)`,
    effects: [
      {
        name: `Lightning-chained Bracers (Thunderscorn)`,
        desc: `You can re-roll failed hit rolls for attacks made by the bearer.`,
        when: [],
      },
    ],
  },
  {
    name: `Thunderstrike Lodestone (Thunderscorn)`,
    effects: [
      {
        name: `Thunderstrike Lodestone (Thunderscorn)`,
        desc: `Once per battle, if the bearer is on the battlefield, they can call down a bolt of lightning. If they do so, you can heal D3 wounds allocated to the bearer. In addition, roll a dice for each enemy unit within 1" of the bearer. On a 2+ that unit suffers 1 mortal wound.`,
        when: [],
      },
    ],
  },
  {
    name: `Horn of the Tempest (Thunderscorn)`,
    effects: [
      {
        name: `Horn of the Tempest (Thunderscorn)`,
        desc: `Friendly THUNDERSCORN units wholly within 18" of the bearer at the start of your charge phase can make a charge move in that phase even if they ran in the same turn.`,
        when: [],
      },
    ],
  },
  {
    name: `Tanglehorn Familiars (Thunderscorn)`,
    effects: [
      {
        name: `Tanglehorn Familiars (Thunderscorn)`,
        desc: `Once per battle, at the start of the enemy hero phase, you can pick an enemy WIZARD within 12" of the bearer. That WIZARD cannot cast any spells that hero phase.`,
        when: [],
      },
    ],
  },
  {
    name: `Ruinous Icon (Thunderscorn)`,
    effects: [
      {
        name: `Ruinous Icon (Thunderscorn)`,
        desc: `Each time the bearer is affected by a spell or endless spell, roll a dice. On a 4+ ignore the effects of that spell on the bearer.`,
        when: [],
      },
    ],
  },
  
]

export default Artifacts

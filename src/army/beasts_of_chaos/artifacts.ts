import { TArtifacts } from 'types/army'
import {
  CHARGE_PHASE,
  COMBAT_PHASE,
  DURING_GAME,
  END_OF_MOVEMENT_PHASE,
  HERO_PHASE,
  SHOOTING_PHASE,
  START_OF_HERO_PHASE,
} from 'types/phases'

const Artifacts: TArtifacts = [
  {
    name: `Ramhorn Helm (Brayherds)`,
    effects: [
      {
        name: `Ramhorn Helm (Brayherds)`,
        desc: `After the bearer completes a charge move, pick an enemy unit within 1" of them. That unit suffers D3 mortal wounds.`,
        when: [CHARGE_PHASE],
      },
    ],
  },
  {
    name: `Brayblast Trumpet (Brayherds)`,
    effects: [
      {
        name: `Brayblast Trumpet (Brayherds)`,
        desc: `Add 1 to hit rolls for attacks made by friendly BRAYHERD units while they are wholly within 18" of the bearer if those units used the Brayherd Ambush battle trait to set up on the battlefield in that turn.`,
        when: [COMBAT_PHASE, SHOOTING_PHASE],
      },
    ],
  },
  {
    name: `The Knowing Eye (Brayherds)`,
    effects: [
      {
        name: `The Knowing Eye (Brayherds)`,
        desc: `At the start of your hero phase, roll a D6 if the bearer is on the battlefield. On a 4+ you receive 1 additional command point.`,
        when: [START_OF_HERO_PHASE],
      },
    ],
  },
  {
    name: `Volcanic Axe (Brayherds)`,
    effects: [
      {
        name: `Volcanic Axe (Brayherds)`,
        desc: `Add 1 to this weapon's Damage characteristic. In addition, each time you make an unmodified hit roll of 6 for an attack made with this weapon, the target suffers 1 mortal wound after all of the bearer's attacks have been resolved.`,
        when: [COMBAT_PHASE],
      },
    ],
  },
  {
    name: `Bleating Gnarlstaff (Brayherds)`,
    effects: [
      {
        name: `Bleating Gnarlstaff (Brayherds)`,
        desc: `If the bearer is within 1" of a terrain feature at the end of your movement phase, roll a D6. On a 3+ each enemy unit within 1" of that terrain feature suffers 1 mortal wound.`,
        when: [END_OF_MOVEMENT_PHASE],
      },
    ],
  },
  {
    name: `Troggoth-hide Cloak (Brayherds)`,
    effects: [
      {
        name: `Troggoth-hide Cloak (Brayherds)`,
        desc: `At the start of your hero phase, you can heal 1 wound that has been allocated to the bearer.`,
        when: [START_OF_HERO_PHASE],
      },
    ],
  },
  {
    name: `Cleaver of the Brass Bull (Warherds)`,
    effects: [
      {
        name: `Cleaver of the Brass Bull (Warherds)`,
        desc: `Improve this weapon's Rend characteristic by 1. In addition, if the unmodified hit roll for an attack made with that weapon is 6, add 1 to the Damage characteristic of that weapon for that attack.`,
        when: [COMBAT_PHASE],
      },
    ],
  },
  {
    name: `Gilded Horns (Warherds)`,
    effects: [
      {
        name: `Gilded Horns (Warherds)`,
        desc: `After the bearer has made a charge move, pick an enemy unit within 1" of the bearer and roll a number of dice equal to the charge roll for that charge move. For each roll of 5+, that enemy unit suffers 1 mortal wound.`,
        when: [CHARGE_PHASE],
      },
    ],
  },
  {
    name: `Glyph-etched Talisman (Warherds)`,
    effects: [
      {
        name: `Glyph-etched Talisman (Warherds)`,
        desc: `The bearer can attempt to unbind one spell in the enemy hero phase in the same manner as a WIZARD.`,
        when: [HERO_PHASE],
      },
    ],
  },
  {
    name: `Blackened Armour of Chaos (Warherds)`,
    effects: [
      {
        name: `Blackened Armour of Chaos (Warherds)`,
        desc: `Roll a D6 each time you allocate a mortal wound to the bearer. On a 4+ that mortal wound is negated.`,
        when: [DURING_GAME],
      },
    ],
  },
  {
    name: `Champion's Doomcloak (Warherds)`,
    effects: [
      {
        name: `Champion's Doomcloak (Warherds)`,
        desc: `Add 2 to charge rolls made for the bearer.`,
        when: [CHARGE_PHASE],
      },
    ],
  },
  {
    name: `Herdstone Shard (Warherds)`,
    effects: [
      {
        name: `Herdstone Shard (Warherds)`,
        desc: `When BULLGOR units wholly within 6" of the bearer use their Bloodgreed ability, it activates on an unmodified roll of 5 or 6.`,
        when: [COMBAT_PHASE],
      },
    ],
  },
  {
    name: `Ancestral Azyrite Blade (Thunderscorn)`,
    effects: [
      {
        name: `Ancestral Azyrite Blade (Thunderscorn)`,
        desc: `Improve this weapon's Rend characteristic by 2.`,
        when: [COMBAT_PHASE],
      },
    ],
  },
  {
    name: `Lightning-chained Bracers (Thunderscorn)`,
    effects: [
      {
        name: `Lightning-chained Bracers (Thunderscorn)`,
        desc: `You can re-roll failed hit rolls for attacks made by the bearer.`,
        when: [COMBAT_PHASE],
      },
    ],
  },
  {
    name: `Thunderstrike Lodestone (Thunderscorn)`,
    effects: [
      {
        name: `Thunderstrike Lodestone (Thunderscorn)`,
        desc: `Once per battle, if the bearer is on the battlefield, they can call down a bolt of lightning. If they do so, you can heal D3 wounds allocated to the bearer. In addition, roll a D6 for each enemy unit within 1" of the bearer. On a 2+ that unit suffers 1 mortal wound.`,
        when: [DURING_GAME],
      },
    ],
  },
  {
    name: `Horn of the Tempest (Thunderscorn)`,
    effects: [
      {
        name: `Horn of the Tempest (Thunderscorn)`,
        desc: `Friendly THUNDERSCORN units wholly within 18" of the bearer at the start of your charge phase can make a charge move in that phase even if they ran in the same turn.`,
        when: [CHARGE_PHASE],
      },
    ],
  },
  {
    name: `Tanglehorn Familiars (Thunderscorn)`,
    effects: [
      {
        name: `Tanglehorn Familiars (Thunderscorn)`,
        desc: `Once per battle, at the start of the enemy hero phase, you can pick an enemy WIZARD within 12" of the bearer. That WIZARD cannot cast any spells that hero phase.`,
        when: [START_OF_HERO_PHASE],
      },
    ],
  },
  {
    name: `Ruinous Icon (Thunderscorn)`,
    effects: [
      {
        name: `Ruinous Icon (Thunderscorn)`,
        desc: `Each time the bearer is affected by a spell or endless spell, roll a D6. On a 4+ ignore the effects of that spell on the bearer.`,
        when: [HERO_PHASE],
      },
    ],
  },
]

export default Artifacts

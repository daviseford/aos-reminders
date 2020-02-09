import { TAbilities } from 'types/army'
import { WOUND_ALLOCATION, END_OF_MOVEMENT_PHASE } from 'types/phases'

// General Allegiance Abilities (always active regardless of army composition)
const Abilities: TAbilities = [
  {
    name: `Infernal Realmwalkers`,
    desc: `Roll a D6 each time a Chaos Ascendant Daemon unit suffers a wound or mortal wound. On a 6+ it is negated.`,
    when: [WOUND_ALLOCATION],
  },
  {
    name: `Unyielding Legions`,
    desc: `Pick 1 friendly Chaos Ascendant Daemon hero that is on the battlefield and roll 3D6. On a 10+ you can summon a 10 man unit of either Bloodletters, Plaguebearers, Daemonettes, or Pink Horrors. The unit's god keyword must match a god keyword from the summoning hero. The summoned unit must be setup within 12" of the hero and more than 9" from enemy units.
           If the unmodified summoning roll contained any doubles, the hero suffers 1 mortal wound. If the unmodified summoning roll was a triple, the hero suffers D3 mortal wounds instead.`,
    when: [END_OF_MOVEMENT_PHASE],
  },
]

export default Abilities

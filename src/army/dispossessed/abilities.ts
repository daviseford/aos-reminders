import { DURING_GAME, END_OF_SETUP } from 'types/phases'
import { TAbilities } from 'types/army'

// General Allegiance Abilities (always active regardless of army composition)
const Abilities: TAbilities = [
  {
    name: `Stubborn to the End`,
    desc: `If you roll a 1, 2 or 3 (before modifiers are applied) when taking a battleshock test for a friendly DISPOSSESSED unit, that unit is treated as having passed the battleshock test irrespective of any modifiers to the battleshock test or their Bravery characteristic.`,
    when: [DURING_GAME],
  },
  {
    name: `Grudgebound`,
    desc: `After set-up is complete, but before the battle begins, choose or roll for a grudge from the table below. The rules for that grudge apply to all friendly DISPOSSESSED units for the duration of the battle.
    
    1: Stuck-up - You can re-roll hit rolls of 1 for friendly DISPOSSESSED units if the target of the attack is an enemy HERO. 
    
    2: Speed Merchants - You can re-roll hit rolls of 1 for friendly DISPOSSESSED units if the target of the attack has a Move characteristic of 10+.
    
    3: Monstrous Cheaters - You can re-roll hit rolls of 1 for friendly DISPOSSESSED units if the target of the attack is an enemy MONSTER. 
    
    4: Cowardly Hordes - You can re-roll hit rolls of 1 for friendly DISPOSSESSED units if the target of the attack is in an enemy unit that had twenty or more models when it was set up. 
    
    5: Shoddy Craftsmanship - You can re-roll hit rolls of 1 for friendly DISPOSSESSED units if the target of the attack has a Save characteristic of 2+, 3+, or 4+ . 
    
    6: Sneaky Ambushers - You can re-roll hit rolls of 1 for friendly DISPOSSESSED units if the target of the attack is in cover, or did not start the battle set up on the battlefield.`,
    when: [END_OF_SETUP],
  },
  {
    name: `Grudgebound`,
    desc: `Refer to the grudge you chose (or rolled for) in the "End of Setup" section.`,
    when: [DURING_GAME],
  },
]

export default Abilities

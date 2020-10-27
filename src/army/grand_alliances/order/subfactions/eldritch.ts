import GenericEffects from 'army/generic/effects'
import { TUnits } from 'types/army'
import {
  BATTLESHOCK_PHASE,
  CHARGE_PHASE,
  COMBAT_PHASE,
  HERO_PHASE,
  MOVEMENT_PHASE,
  SAVES_PHASE,
} from 'types/phases'

const TalismanOfArcanePowerEffect = {
  name: `Talisman of Arcane Power`,
  desc: `You can add 1 to any unbinding rolls for an Archmage with a Talisman of Arcane Power.`,
  when: [HERO_PHASE],
}
const InfantryHornblowerEffect = {
  name: `Hornblower`,
  desc: `Reroll dice rolls of 1 when determining how far this unit can run or charge while it includes any Hornblowers.`,
  when: [MOVEMENT_PHASE, CHARGE_PHASE],
}
const DeflectShotsEffect = {
  name: `Deflect Shots`,
  desc: `You can reroll failed save rolls for this unit in the shooting phase.`,
  when: [SAVES_PHASE],
}
export const LegacyEldritchUnits: TUnits = [
  {
    name: `Swordmasters`,
    effects: [
      {
        name: `Bladelord`,
        desc: `The leader of this unit is a Bladelord. A Bladelord makes 3 attacks
        rather than 2.`,
        when: [COMBAT_PHASE],
      },
      InfantryHornblowerEffect,
      {
        name: `Standard Bearer`,
        desc: `Models in this unit may be Standard Bearers. If the unit includes any Standard Bearers, add 1 to the Bravery of its models. Add 2 to their Bravery instead if the unit is within 8" of another Eldritch Council unit from your army that includes a Standard Bearer.`,
        when: [BATTLESHOCK_PHASE],
      },
      {
        name: `A Blur of Blades`,
        desc: `You can reroll hit rolls of 1 when attacking with a Swordmaster.`,
        when: [COMBAT_PHASE],
      },
      DeflectShotsEffect,
    ],
  },

  {
    name: `Archmage`,
    effects: [
      {
        name: `Aelven Steed`,
        desc: `An Archmage can ride an Aelven Steed. If he does so, his Move is increased to 14" and he gains the Swift Hooves attack.`,
        when: [MOVEMENT_PHASE],
      },
      TalismanOfArcanePowerEffect,
      {
        name: `Wizard`,
        desc: `An Archmage is a wizard. He can attempt to cast one spell in each of your own hero phases, and attempt to unbind one spell in each enemy hero phase. He knows the Arcane Bolt, Mystic Shield and Elemental Shield spells.`,
        when: [HERO_PHASE],
      },
      {
        name: `Elemental Shield`,
        desc: `Casting value of 6. Until your next hero phase, you can roll a dice each time the Archmage, or a model in your army within 18" of him, suffers a wound or a mortal wound. On the roll of a 6 that hit is deflected by the magical barrier surrounding the Archmage and is ignored.`,
        when: [HERO_PHASE],
        spell: true,
      },
    ],
  },

  {
    name: `Archmage on Dragon`,
    effects: [
      TalismanOfArcanePowerEffect,
      GenericEffects.Dragonfire,
      {
        name: `Wizard`,
        desc: `An Archmage on Dragon is a wizard. He can attempt to cast one spell in each of your own hero phases, and attempt to unbind two spells in each enemy hero phase. An Archmage with an Arcane Tome can attempt to cast two different spells in each of your hero phases instead of just one, and attempt to unbind two spells in each enemy hero phase. An Archmage on Dragon knows the Arcane Bolt, Mystic Shield and Drain Magic spells.`,
        when: [HERO_PHASE],
      },
      {
        name: `Drain Magic`,
        desc: `Casting value of 4. Select a visible unit within 18". Any spells that are affecting that unit immediately cease. Furthermore, if that unit is a Daemon unit, it suffers D3 mortal wounds as the magic sustaining their forms is ripped away and dissipated by the vortex. If that unit is an Endless Spell, it is dispelled.`,
        when: [HERO_PHASE],
        spell: true,
      },
    ],
  },

  {
    name: `Drakeseer`,
    effects: [
      {
        name: `Warrior Mage`,
        desc: `A Drakeseer makes 3 attacks with his Sunstaff instead of 1 if he charged in the same turn.`,
        when: [COMBAT_PHASE],
      },
      GenericEffects.Dragonfire,
      {
        name: `Wizard`,
        desc: `A Drakeseer is a wizard. He can attempt to cast one spell in each of your own hero phases, and attempt to unbind one spell in each enemy hero phase. He knows the Arcane Bolt, Mystic Shield, and Flames of the Phoenix spells.`,
        when: [HERO_PHASE],
      },
      {
        name: `Flames of the Phoenix`,
        desc: `Casting value of 7. Pick a visible enemy unit within 18". That unit suffers a mortal wound as it is set ablaze. 
        
        Then, roll another dice - if the result is a 3 or less the flames die out and this spell ends. 
        
        On a 4 or more, however, the unit suffers an additional 2 mortal wounds and continues to burn; roll another dice - if the result is a 3 or less the fire dies out, but on a 4 or more, the unit suffers an additional 3 mortal wounds and the conflagration continues. 
        
        Keep rolling extra dice in this way, inflicting 1 more mortal wound than last time you rolled, until either the flames die out or the unit does!`,
        when: [HERO_PHASE],
        spell: true,
      },
    ],
  },

  {
    name: `Loremaster`,
    effects: [
      DeflectShotsEffect,
      {
        name: `Wizard`,
        desc: `A Loremaster is a wizard. He can attempt to cast one spell in each of your hero phases, and attempt to unbind one spell in each enemy hero phase. He knows the Arcane Bolt, Mystic Shield and Hand of Glory spells.`,
        when: [HERO_PHASE],
      },
      {
        name: `Hand of Glory`,
        desc: `Casting value of 5. Pick a model within 18". Until your next hero phase you can reroll all failed hit rolls and wound rolls for that model.`,
        when: [HERO_PHASE],
        spell: true,
      },
    ],
  },
]

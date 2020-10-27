import {
  BATTLESHOCK_PHASE,
  CHARGE_PHASE,
  COMBAT_PHASE,
  DURING_GAME,
  END_OF_HERO_PHASE,
  HERO_PHASE,
  START_OF_COMBAT_PHASE,
} from 'types/phases'

const CommonLuminethRealmlordsData = {
  getSunmetalWeaponsEffect: (weapon: string) => ({
    name: `Sunmetal Weapons`,
    desc: `If the unmodified hit roll for an attack made with a ${weapon} is 6, that attack inflicts 1 mortal wound on the target and the attack sequence ends (do not make a wound or save roll).`,
    when: [COMBAT_PHASE],
  }),

  getVanariWizardsEffect: (minimumModelCountToBeWizard: number) => ({
    name: `Magic`,
    desc: `This unit is a WIZARD while it has ${minimumModelCountToBeWizard} or more models. They can attempt to cast 1 spell in your hero phase and attempt to unbind 1 spell in the enemy hero phase. They know the Power of Hysh spell.`,
    when: [HERO_PHASE],
  }),

  alarithSpiritFreeCommandAbilityEffect: (effectName: string, effectRange: number) => ({
    name: effectName,
    desc: `Pick 1 friendly LUMINETH REALM-LORDS AELF HERO within ${effectRange}" of this model. If that model is within ${effectRange}" of this model at the start of your next hero phase, then that model can use a command ability in that turn without spending any command points.`,
    when: [END_OF_HERO_PHASE],
  }),

  alarithSpiritExtraAttackCommandAbilityEffect: (
    effectName: string,
    numberOfUnitsAffected: string,
    effectRange: number
  ) => {
    const unitDescription = numberOfUnitsAffected === `1` ? `unit` : `units`
    return {
      name: effectName,
      desc: `Pick ${numberOfUnitsAffected} ALARITH AELF ${unitDescription} wholly within ${effectRange}" of a friendly model with this command ability. Add 1 to the Attacks characteristic for melee weapons for the ${unitDescription} affected in that combat phase. Units cannot benefit more than once per combat phase from this ability. Additionally, they cannot benefit from Faith of the Mountains and Unshakeable Faith of the Mountains in the same phase.`,
      when: [START_OF_COMBAT_PHASE, COMBAT_PHASE],
      command_ability: true,
    }
  },

  StandardBearerEffect: {
    name: `Standard Bearer`,
    desc: `You can reroll battleshock tests for units that include any Standard Bearers.`,
    when: [BATTLESHOCK_PHASE],
  },

  PowerOfHyshEffect: {
    name: `Power of Hysh`,
    desc: `Casting value of 6. Until your next hero phase, the Sunmetal Weapons ability for the caster and/or the unit they are part of causes mortal wounds to be inflicted on an unmodified hit roll of 5+ instead of 6. Any number of LUMINETH REALM-LORDS WIZARDS can attempt to cast Power of Hysh in the same hero phase.`,
    when: [HERO_PHASE, COMBAT_PHASE],
    spell: true,
  },

  AllButImmovableEffect: {
    name: `All but Immovable`,
    desc: `If this model doesnt not make a charge move in your charge phase, add 1 to the Attacks characteristic of this model's melee weapons until your next movement phase.`,
    when: [CHARGE_PHASE, COMBAT_PHASE],
  },

  StonemageSymbiosisEffect: {
    name: `Stonemage Symbiosis`,
    desc: `When looking at this model's damage table, if it is within 12" of a friendly STONEMAGE, it is treated as if it has suffered 0 wounds.`,
    when: [DURING_GAME],
  },
}

export default CommonLuminethRealmlordsData

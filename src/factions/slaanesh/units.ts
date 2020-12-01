import {
  BATTLESHOCK_PHASE,
  CHARGE_PHASE,
  COMBAT_PHASE,
  DURING_GAME,
  END_OF_COMBAT_PHASE,
  HERO_PHASE,
  MOVEMENT_PHASE,
  SAVES_PHASE,
  SHOOTING_PHASE,
  START_OF_BATTLESHOCK_PHASE,
  START_OF_CHARGE_PHASE,
  START_OF_COMBAT_PHASE,
  START_OF_HERO_PHASE,
  WOUND_ALLOCATION_PHASE,
} from 'types/phases'

const KeeperOfSecretsBaseEffects = [
  {
    name: `Dark Temptations`,
    desc: `You can pick 1 enemy HERO within 3" of this model and ask your opponent if they wish that hero to accept temptation. If they refuse, that HERO suffers D3 mortal wounds. If they accept, add 1 to hit rolls for attacks made by that hero. Then, at the start of the next combat phase, roll a D6. On 1-3, that HERO no longer receives this modifier to their hit rolls. On 4-6, that HERO is slain.`,
    when: [START_OF_COMBAT_PHASE],
  },
  {
    name: `Delicate Precision`,
    desc: `If the unmodified wound roll for an attack made with a melee weapon by this model is 6, that attack inflicts a number of mortal wounds equal to the damage characteristic of the weapon used for the attack and the attack sequence ends (do not make a save roll).`,
    when: [COMBAT_PHASE],
  },
  {
    name: `Magic`,
    desc: `This model is a wizard. Can attempt to cast 2 spells and attempt to unbind 2 spells. Knows Arcane Bolt, Mystic Shield, and Cacophonic Choir.`,
    when: [HERO_PHASE],
  },
  {
    name: `Cacophonic Choir`,
    desc: `Casting value of 6. Roll 2D6. Each enemy unit within 6" of the caster that has a bravery characteristic of less than the roll suffers D3 mortal wounds.`,
    when: [HERO_PHASE],
    spell: true,
  },
  {
    name: `Excess of Violence`,
    desc: `When it is your turn to pick a unit to fight with, select 1 friendly Hedonite unit that has already fought once in that combat phase and is wholly within 12. That unit can be selected to fight for a second time if it is within 3" of any enemy units. You cannot pick the same unit to benefit from this command ability more than once in the same combat phase."`,
    when: [COMBAT_PHASE],
    command_ability: true,
  },
]
const LitheAndSwiftEffect = {
  name: `Lithe and Swift`,
  desc: `This unit can run and still charge later in the same turn.`,
  when: [MOVEMENT_PHASE, CHARGE_PHASE],
}
const BannerBearerEffect = {
  name: `Banner Bearer`,
  desc: `You can reroll charge rolls for this unit while it includes any Banner Bearers.`,
  when: [CHARGE_PHASE],
}
const IconBearerEffect = {
  name: `Icon Bearer`,
  desc: `Add 2 to the Bravery characteristic of this unit while it includes any Icon Bearers.`,
  when: [BATTLESHOCK_PHASE],
}
const HornBlowerEffect = {
  name: `Hornblower`,
  desc: `If the unmodified roll for a battleshock test for an enemy unit that is within 6" of this unit while this unit includes any Hornblowers is 1, that battleshock test must be rerolled.`,
  when: [BATTLESHOCK_PHASE],
}
const AcquiescenceEffects = [
  {
    name: `Acquiescence`,
    desc: `Casting value of 5. You can pick 1 enemy unit within 18" of the caster that is visible to them. You can reroll hit rolls of 1 for attacks that target that unit until your next hero phase.`,
    when: [HERO_PHASE],
    spell: true,
  },
  {
    name: `Acquiescence`,
    desc: `If active, you can reroll hit rolls of 1 for attacks that target the debuffed unit.`,
    when: [SHOOTING_PHASE, COMBAT_PHASE],
  },
]
// Unit Names
export const Units = {
  'Keeper of Secrets w/ Ritual Knife': {
    effects: [
      ...KeeperOfSecretsBaseEffects,
      {
        name: `Ritual Knife`,
        desc: `You can pick 1 enemy model within 1" of this model that has any wounds currently allocated to it and roll a D6. On a 1, nothing happens. On a 2-5, that enemy model suffers 1 mortal wound. On a 6, that enemy model suffers D3 mortal wounds.`,
        when: [END_OF_COMBAT_PHASE],
      },
    ],
  },
  'Keeper of Secrets w/ Living Whip': {
    effects: [
      ...KeeperOfSecretsBaseEffects,
      {
        name: `Living Whip`,
        desc: `You can pick 1 enemy MONSTER model within 6" of this model and roll a D6. On a 3+, pick 1 melee weapon that enemy MONSTER model is armed with. Subtract 1 from hit rolls for attacks made with that weapon until the end of that combat phase.`,
        when: [START_OF_COMBAT_PHASE],
      },
    ],
  },
  'Keeper of Secrets w/ Shining Aegis': {
    effects: [
      ...KeeperOfSecretsBaseEffects,
      {
        name: `Shining Aegis`,
        desc: `Roll a D6 each time you allocate a wound or mortal wound to this model. On a 6+, that wound or mortal wound is negated.`,
        when: [WOUND_ALLOCATION_PHASE],
      },
    ],
  },
  'Keeper of Secrets w/ Sinistrous Hand': {
    effects: [
      ...KeeperOfSecretsBaseEffects,
      {
        name: `Sinistrous Hand`,
        desc: `If any enemy models were slain by wounds inflicted by this model's attacks in that combat phase, you can heal D3 wounds allocated to this model. If any enemy HEROES were slain by wounds inflicted by this model's attacks in that combat phase, you can heal D6 wounds allocated to this model instead.`,
        when: [END_OF_COMBAT_PHASE],
      },
    ],
  },
  'Syll`Esske, the Vengeful Allegiance': {
    effects: [
      {
        name: `Companion`,
        desc: `Esske attacks with its Axe of Dominion. For rules purposes, Esske is treated in the same manner as a mount.`,
        when: [COMBAT_PHASE],
      },
      {
        name: `Deadly Symbiosis`,
        desc: `When this model fights, it must attack with either its Axe of Dominion or Scourging Whip (it cannot attack with both). If another ability or spell allows this model to fight more than once in the same combat phase, this ability still only allows this model to fight at the end of the phase 1 more time.

               Each time this model attacks in the same combat phase, it must alternate between attacking with its Axe of Dominion and Scourging Whip. Every other time this model attacks in the same combat phase, you can reroll hit rolls for the weapon being used.'`,
        when: [COMBAT_PHASE],
      },
      {
        name: `Deadly Symbiosis`,
        desc: `Pile in and attack with either its Axe of Dominion or Scourging Whip (the weapon that was NOT selected in the combat phase).`,
        when: [END_OF_COMBAT_PHASE],
      },
      LitheAndSwiftEffect,
      {
        name: `Magic`,
        desc: `This model is a wizard. Can attempt to cast 1 spell and attempt to unbind 1 spell. Knows Arcane Bolt, Mystic Shield, and Subvert.`,
        when: [HERO_PHASE],
      },
      {
        name: `Subvert`,
        desc: `Casting value of 7. You can pick 1 enemy HERO within 18" of the caster that is visible to them. That Hero cannot use any command abilities until your next hero phase.`,
        when: [HERO_PHASE],
        spell: true,
      },
      {
        name: `Subvert`,
        desc: `If active, the debuffed HERO cannot use any command abilities.`,
        when: [DURING_GAME],
      },
      {
        name: `Regal Authority`,
        desc: `If this model is your general and is on the battlefield, until the end of this phase, you can reroll hit rolls of 1 for friendly Chaos Slaanesh units while they are wholly with 18" of this model.`,
        when: [START_OF_COMBAT_PHASE],
        command_ability: true,
      },
      {
        name: `Regal Authority`,
        desc: `If this model is your general and is on the battlefield, until the end of that phase, do not take battleshock tests for friendly Chaos Slaanesh units while they are wholly with 18" of this model.`,
        when: [START_OF_BATTLESHOCK_PHASE],
        command_ability: true,
      },
    ],
  },
  'Shalaxi Helbane': {
    effects: [
      {
        name: `Cloak of Constriction`,
        desc: `Add 1 to save rolls for attacks made with melee weapons by enemy HEROES that target this model.`,
        when: [SAVES_PHASE],
      },
      {
        name: `Delicate Precision`,
        desc: `If the unmodified wound roll for an attack made with a missile or melee weapon by this model is 6, that attack inflicts a number of mortal wounds equal to the Damage characteristic of the weapon used for the attack and the attack sequence ends (do not make a save roll).`,
        when: [SHOOTING_PHASE, COMBAT_PHASE],
      },
      {
        name: `Irresistible Challenge`,
        desc: `At the start of the enemy charge phase, you can pick 1 enemy HERO within 12" of this model and more than 3" from any models from your army, and ask your opponent if they wish that HERO to accept Shalaxi Helbane's challenge. If they refuse, that HERO suffers D3 mortal wounds. If they accept, that HERO must attempt to charge, and must finish the charge move within 1/2" of this model if it is possible for it to do so. In addition, if the challenge is accepted, any attacks that HERO makes in the following combat phase must target this model.`,
        when: [START_OF_CHARGE_PHASE],
      },
      {
        name: `Living Whip`,
        desc: `If this model is armed with a Living Whip, you can pick 1 enemy MONSTER model within 6" of this model and roll a D6. On a 3+, pick 1 melee weapon that enemy MONSTER model is armed with. Subtract 1 from hit rolls for attacks made with that melee weapon until the end of that combat phase.`,
        when: [START_OF_COMBAT_PHASE],
      },
      {
        name: `Shining Aegis`,
        desc: `If this model is armed with a Shining Aegis, roll a D6 each time you allocate a wound or mortal wound to this model. On a 6+, that wound or mortal wound is negated.`,
        when: [WOUND_ALLOCATION_PHASE],
      },
      {
        name: `The Killing Stroke`,
        desc: `You can pick 1 enemy HERO within 3" of this model. If you do so, all attacks made by this model in that combat phase must target that model, but the Damage characteristic for this model's Soulpiercer is 6 in that combat phase instead of D6.`,
        when: [START_OF_COMBAT_PHASE],
      },
      {
        name: `Magic`,
        desc: `This model is a wizard. Can attempt to cast 2 spells and attempt to unbind 2 spells. Knows Arcane Bolt, Mystic Shield, and Refine Senses.`,
        when: [HERO_PHASE],
      },
      {
        name: `Refine Senses`,
        desc: `Casting value of 4. Until your next hero phase, you can reroll hit rolls for attacks made by the caster that target a HERO, and you can reroll save rolls for attacks made by Heroes that target the caster.`,
        when: [HERO_PHASE],
        spell: true,
      },
      {
        name: `Refine Senses`,
        desc: `If active, you can reroll hit rolls for attacks made by the buffed unit that target a HERO.`,
        when: [SHOOTING_PHASE, COMBAT_PHASE],
      },
      {
        name: `Refine Senses`,
        desc: `If active, you can reroll save rolls for attacks made by Heroes that target the buffed unit.`,
        when: [SAVES_PHASE],
      },
    ],
  },
  'The Contorted Epitome': {
    effects: [
      {
        name: `Gift of Power`,
        desc: `You can reroll casting, unbinding and dispelling rolls for this model.`,
        when: [HERO_PHASE],
      },
      {
        name: `Swallow Energy`,
        desc: `Roll a D6 each time you allocate a mortal wound to this model. On a 2+, that mortal wound is negated.`,
        when: [WOUND_ALLOCATION_PHASE],
      },
      {
        name: `Horrible Fascination`,
        desc: `Roll a D6 for each enemy unit that is within 6" of any friendly models with this ability. On a 4+, that unit fights at the end of that combat phase, after the players have picked any other units to fight with in that combat phase. If a unit that is affected by this ability is also affected by any rules that would allow it to fight at the start of the combat phase, that unit is not affected by this rule or those other rules (the effects cancel each other out).`,
        when: [START_OF_COMBAT_PHASE],
      },
      {
        name: `Magic`,
        desc: `This model is a wizard. Can attempt to cast 2 spells and attempt to unbind 2 spells. Knows Arcane Bolt, Mystic Shield, and Overwhelming Acquiescence.`,
        when: [HERO_PHASE],
      },
      {
        name: `Overwhelming Acquiescence`,
        desc: `Casting value of 7. You can pick up to D3 enemy units within 24" of the caster that are visible to them. You can reroll hit rolls of 1 for attacks that target those units until your next hero phase.`,
        when: [HERO_PHASE],
        spell: true,
      },
      {
        name: `Overwhelming Acquiescence`,
        desc: `If active, you can reroll hit rolls of 1 for attacks that target the debuffed unit.`,
        when: [SHOOTING_PHASE, COMBAT_PHASE],
      },
    ],
  },
  'Infernal Enrapturess, Herald of Slaanesh': {
    effects: [
      {
        name: `Discordant Disruption`,
        desc: `Reroll successful casting rolls for enemy WIZARDS that are within 24" of any friendly models with this ability. In addition, if the rerolled casting roll is a double, that Wizard suffers D3 mortal wounds after the effects of the spell (if any) have been carried out.`,
        when: [HERO_PHASE],
      },
      {
        name: `Discordant Disruption`,
        desc: `This model can attempt to dispel 1 endless spell in the same manner as a Wizard. If it does so, add 1 to the dispelling roll.`,
        when: [START_OF_HERO_PHASE],
      },
      {
        name: `Harmonic Alignment`,
        desc: `You receive 1 depravity point for each friendly Infernal Enrapturess that is on the battlefield and part of a Slaanesh army.`,
        when: [START_OF_HERO_PHASE],
      },
      {
        name: `Versatile Instrument`,
        desc: `Before attacking with a heartstring lyre, choose either the Cacophonous Melody or Euphonic Blast missile weapon characteristics for that shooting attack.`,
        when: [SHOOTING_PHASE],
      },
    ],
  },
  'The Masque': {
    effects: [
      {
        name: `Staff of Masks`,
        desc: `You can either add D3 to the Attacks characteristic of this model's melee weapons until your next hero phase, or you can heal up to D3 wounds allocated to this model.`,
        when: [START_OF_HERO_PHASE],
      },
      {
        name: `The Endless Dance`,
        desc: `This model is eligible to fight if it is within 6" of an enemy unit instead of 3", and can fly and move an extra 3" when it piles in. In addition, you can reroll hit rolls for attacks made by this model that target an enemy unit with a Move characteristic of 10" or less, and you can reroll wound rolls for attacks made by this model that target an enemy unit with a Move characteristic of 5" or less.`,
        when: [COMBAT_PHASE],
      },
      LitheAndSwiftEffect,
      {
        name: `Inhuman Reflexes`,
        desc: `Roll a D6 each time you allocate a wound or mortal wound to this model. On a 4+, that wound or mortal wound is negated.`,
        when: [WOUND_ALLOCATION_PHASE],
      },
    ],
  },
  'Viceleader, Herald of Slaanesh': {
    effects: [
      {
        name: `Lightning Reflexes`,
        desc: `Roll a D6 each time you allocate a wound or mortal wound to this model. On a 5+, that wound or mortal wound is negated.`,
        when: [WOUND_ALLOCATION_PHASE],
      },
      LitheAndSwiftEffect,
      {
        name: `Magic`,
        desc: `This model is a wizard. Can attempt to cast 1 spell and attempt to unbind 1 spell. Knows Arcane Bolt, Mystic Shield, and Acquiescence.`,
        when: [HERO_PHASE],
      },
      ...AcquiescenceEffects,
    ],
  },
  'Bladebringer, Herald on Hellflayer': {
    effects: [
      {
        name: `Crew and Steeds`,
        desc: `The Daemonettes and Steeds of Slaanesh on this model are treated as mounts.`,
        when: [COMBAT_PHASE],
      },
      {
        name: `Soulscent`,
        desc: `Roll a D6 for each enemy unit within 1" of this model. On a 4+ that enemy unit suffers D3 mortal wounds. In additional for each 4+ add 1 to the attacks characteristic of this model's melee weapons until the end of the phase.`,
        when: [START_OF_COMBAT_PHASE],
      },
      {
        name: `Magic`,
        desc: `This model is a wizard. Can attempt to cast 1 spell and attempt to unbind 1 spell. Knows Arcane Bolt, Mystic Shield, and Acquiescence.`,
        when: [HERO_PHASE],
      },
      ...AcquiescenceEffects,
    ],
  },
  'Bladebringer, Herald on Seeker Chariot': {
    effects: [
      {
        name: `Crew and Steeds`,
        desc: `The Daemonettes and Steeds of Slaanesh on this model are treated as mounts.`,
        when: [COMBAT_PHASE],
      },
      {
        name: `Impossibly Swift`,
        desc: `This model can retreat and charge later in the same turn.`,
        when: [MOVEMENT_PHASE, CHARGE_PHASE],
      },
      {
        name: `Mutilating Blades`,
        desc: `Roll a D6 for each enemy unit within 1" of this model when it finishes a charge move. On a 2+, that enemy unit suffers D3 mortal wounds.`,
        when: [CHARGE_PHASE],
      },
      {
        name: `Magic`,
        desc: `This model is a wizard. Can attempt to cast 1 spell and attempt to unbind 1 spell. Knows Arcane Bolt, Mystic Shield, and Acquiescence.`,
        when: [HERO_PHASE],
      },
      ...AcquiescenceEffects,
    ],
  },
  Hellflayer: {
    effects: [
      {
        name: `Crew and Steeds`,
        desc: `The Daemonettes and Steeds of Slaanesh on this model are treated as mounts.`,
        when: [COMBAT_PHASE],
      },
      {
        name: `Soulscent`,
        desc: `Roll a D6 for each enemy unit within 1" of this model. On a 4+ that enemy unit suffers D3 mortal wounds. In additional for each 4+ add 1 to the attacks characteristic of this model's melee weapons until the end of the phase.`,
        when: [START_OF_COMBAT_PHASE],
      },
    ],
  },
  'Seeker Chariots': {
    effects: [
      {
        name: `Crew and Steeds`,
        desc: `The Daemonettes and Steeds of Slaanesh on this model are treated as mounts.`,
        when: [COMBAT_PHASE],
      },
      {
        name: `Impossibly Swift`,
        desc: `This model can retreat and charge later in the same turn.`,
        when: [MOVEMENT_PHASE, CHARGE_PHASE],
      },
      {
        name: `Mutilating Blades`,
        desc: `Roll a D6 for each enemy unit within 1" of this model when it finishes a charge move. On a 2+, that enemy unit suffers D3 mortal wounds. If this unit has more than 1 model, roll to determine if mortal wounds are inflicted after each model completes its charge move, but do not allocate mortal wounds until after all of the models in the unit have moved.`,
        when: [CHARGE_PHASE],
      },
    ],
  },
  'Bladebringer, Herald on Exalted Chariot': {
    effects: [
      {
        name: `Crew and Steeds`,
        desc: `The Daemonettes and Steeds of Slaanesh on this model are treated as mounts.`,
        when: [COMBAT_PHASE],
      },
      {
        name: `Excess of Blades`,
        desc: `Roll a D6 for each enemy unit within 1" of this model when it finishes a charge move. On a 1 nothing happens. On a 2-4 that unit suffers D3 mortal wounds. On a 5+ that unit suffers D6 mortal wounds.`,
        when: [CHARGE_PHASE],
      },
      {
        name: `Pungent Soulscent`,
        desc: `Roll a D6 for each enemy unit within 1" of this model. On a 2+ that enemy unit suffers D3 mortal wounds. In additional for each 2+ add 1 to the attacks characteristic of this model's melee weapons until the end of the phase.`,
        when: [START_OF_COMBAT_PHASE],
      },
      {
        name: `Magic`,
        desc: `This model is a wizard. Can attempt to cast 1 spell and attempt to unbind 1 spell. Knows Arcane Bolt, Mystic Shield, and Acquiescence.`,
        when: [HERO_PHASE],
      },
      ...AcquiescenceEffects,
    ],
  },
  'Exalted Chariot': {
    effects: [
      {
        name: `Crew and Steeds`,
        desc: `The Daemonettes and Steeds of Slaanesh on this model are treated as mounts.`,
        when: [COMBAT_PHASE],
      },
      {
        name: `Excess of Blades`,
        desc: `Roll a D6 for each enemy unit within 1" of this model when it finishes a charge move. On a 1 nothing happens. On a 2-4 that unit suffers D3 mortal wounds. On a 5+ that unit suffers D6 mortal wounds.`,
        when: [CHARGE_PHASE],
      },
      {
        name: `Pungent Soulscent`,
        desc: `Roll a D6 for each enemy unit within 1" of this model. On a 2+ that enemy unit suffers D3 mortal wounds. In additional for each 2+ add 1 to the attacks characteristic of this model's melee weapons until the end of the phase.`,
        when: [START_OF_COMBAT_PHASE],
      },
    ],
  },
  Fiends: {
    effects: [
      {
        name: `Blissbringer`,
        desc: `1 model in this unit can be a Blissbringer. Add 1 to the Attacks characteristic of a Blissbringer's Deadly Pincers.`,
        when: [COMBAT_PHASE],
      },
      {
        name: `Crushing Grip`,
        desc: `If the unmodified wound roll for an attack made with Deadly Pincers is 6, the Deadly Pincers have a Damage characteristic of D3 instead of 1 for that attack.`,
        when: [COMBAT_PHASE],
      },
      {
        name: `Deadly Venom`,
        desc: `If the target of an attack made with a Barbed Stinger has a Wounds characteristic of 1, the Barbed Stinger has a Damage characteristic of 1 for that attack; if the target of an attack made with a Barbed Stinger has a Wounds characteristic of 2-3, the Barbed Stinger has a Damage characteristic of D3 for that attack; if the target of an attack made with a Barbed Stinger has a Wounds characteristic of 4 or more, the Barbed Stinger has a Damage characteristic of D6 for that attack.`,
        when: [COMBAT_PHASE],
      },
      {
        name: `Disruptive Song`,
        desc: `Subtract 1 from casting rolls for enemy WIZARDS while they are within 12" of any models with this ability.`,
        when: [HERO_PHASE],
      },
      {
        name: `Soporific Musk`,
        desc: `Subtract 1 from hit rolls for attacks made with melee weapons that target this unit. In addition, while this unit has 4 or more models, subtract 1 from wound rolls for attacks made with melee weapons that target this unit.`,
        when: [COMBAT_PHASE],
      },
    ],
  },
  Daemonettes: {
    effects: [
      {
        name: `Allurer`,
        desc: `Add 1 to the attacks characteric of an Allurer's Piercing Claws.`,
        when: [COMBAT_PHASE],
      },
      BannerBearerEffect,
      {
        name: `Icon Bearer`,
        desc: `If an unmodified battleshock roll of 1 is made for this unit while it includes any Icon Bearers, you can add D6 models to this unit and no models from this unit flee.`,
        when: [BATTLESHOCK_PHASE],
      },
      HornBlowerEffect,
      LitheAndSwiftEffect,
    ],
  },
  Seekers: {
    effects: [
      {
        name: `Heartseeker`,
        desc: `Add 1 to the Attacks characteristic of a Heartseeker's Piercing Claws.`,
        when: [COMBAT_PHASE],
      },
      BannerBearerEffect,
      {
        name: `Icon Bearer`,
        desc: `If an unmodified battleshock roll of 1 is made for this unit while it includes any Icon Bearers, you can add D3 models to this unit, and no models from this unit will flee in that phase.`,
        when: [BATTLESHOCK_PHASE],
      },
      HornBlowerEffect,
      {
        name: `Quicksilver Speed`,
        desc: `You can roll 2D6 instead of D6 when you make a run roll for this unit. In addition, this unit can run and charge later in the same turn.`,
        when: [MOVEMENT_PHASE, CHARGE_PHASE],
      },
    ],
  },
  'Hellstriders with Hellscourges': {
    effects: [
      {
        name: `Hellreaver`,
        desc: `Add 1 to the Attacks characteristic of a Hellreaver's Hellscourge.`,
        when: [COMBAT_PHASE],
      },
      BannerBearerEffect,
      IconBearerEffect,
      HornBlowerEffect,
      {
        name: `Hooked Tendrils`,
        desc: `Subtract 1 from enemy hit rolls made against this unit if this unit charged this turn.`,
        when: [COMBAT_PHASE],
      },
    ],
  },
  'Hellstriders with Claw-spears': {
    effects: [
      {
        name: `Hellreaver`,
        desc: `Add 1 to the Attacks characteristic of a Hellreaver's Claw-spear.`,
        when: [COMBAT_PHASE],
      },
      BannerBearerEffect,
      IconBearerEffect,
      HornBlowerEffect,
      {
        name: `Piercing Strike`,
        desc: `Add 1 to the damage characteristic of this unit's Claw-spears if it charged this turn.`,
        when: [COMBAT_PHASE],
      },
    ],
  },
  'Soulfeaster Keeper of Secrets': {
    effects: [
      {
        name: `Dark Temptations`,
        desc: `You can pick 1 enemy HERO within 3" of this model and ask your opponent if they wish that hero to accept temptation. If they refuse, that HERO suffers D3 mortal wounds. If they accept, add 1 to hit rolls for attacks made by that hero. Then, at the start of the next combat phase, roll a D6. On 1-3, that HERO no longer receives this modifier to their hit rolls. On 4-6, that HERO is slain.`,
        when: [START_OF_COMBAT_PHASE],
      },
      {
        name: `Delicate Precision`,
        desc: `If the unmodified wound roll for an attack made with a melee weapon by this model is 6, that attack inflicts a number of mortal wounds equal to the damage characteristic of the weapon used for the attack and the attack sequence ends (do not make a save roll).`,
        when: [COMBAT_PHASE],
      },
      {
        name: `Soulfeaster Tendrils`,
        desc: `At the start of the combat phase, you can pick 1 enemy HERO within 3" of this model and roll 3D6. If the roll is greater than that model's Bravery characteristic, you gain D3 depravity points, and 1 is subtracted from hit rolls for attacks made by that HERO until the end of that phase.`,
        when: [START_OF_COMBAT_PHASE],
      },
      {
        name: `Magic`,
        desc: `This model is a wizard. Can attempt to cast 2 spells and attempt to unbind 2 spells. Knows Arcane Bolt, Mystic Shield, and Cacophonic Choir.`,
        when: [HERO_PHASE],
      },
      {
        name: `Cacophonic Choir`,
        desc: `Casting value of 6. Roll 2D6. Each enemy unit within 6" of the caster that has a bravery characteristic of less than the roll suffers D3 mortal wounds.`,
        when: [HERO_PHASE],
        spell: true,
      },
    ],
  },
  'Lord of Pain ': {
    effects: [
      {
        name: `Share the Pain`,
        desc: `Each time you allocate a wound or mortal wound to this model roll a D6. On a 5+ the wound is negated.`,
        when: [WOUND_ALLOCATION_PHASE],
      },
      {
        name: `Share the Pain`,
        desc: `If this model negated a wound in this phase, the attacking unit suffers 1 mortal wound after resolving all of its attacks.`,
        when: [COMBAT_PHASE],
      },
      {
        name: `Paragon of Depravity`,
        desc: `You may pick 1 friendly Hedonite mortal unit wholly within 12". The target unit may reroll hit rolls in this phase.`,
        when: [COMBAT_PHASE],
        command_ability: true,
      },
    ],
  },
}
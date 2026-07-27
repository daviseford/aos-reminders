import {
  AOS4_CATALOG_SCHEMA_VERSION,
  type Ability,
  type Aos4Catalog,
  type BattleProfile,
  type CanonicalId,
  type ContentEntity,
  type ContentGroup,
  type ContentRelationship,
  type SourceRecordId,
  type SourceReference,
  type Warscroll,
  type Weapon,
} from '../../domain'
import { REPRESENTATIVE_CONTEXT_ID, REPRESENTATIVE_IDS } from './identities'
import {
  REPRESENTATIVE_SOURCE_ARTIFACTS,
  REPRESENTATIVE_SOURCE_IDS,
  REPRESENTATIVE_SOURCE_RECORDS,
} from './sources'

const revision = 'representative-2026-07-27'
const sourceRef = (
  sourceRecordId: SourceRecordId,
  field?: string,
  transformation = 'curated reminder summary'
): SourceReference => ({
  sourceRecordId,
  ...(field ? { field } : {}),
  transformation,
})

const common = (sourceRecordId: SourceRecordId) => ({
  revision,
  rulesContextIds: [REPRESENTATIVE_CONTEXT_ID],
  sourceRefs: [sourceRef(sourceRecordId)],
})

const group = (
  id: CanonicalId<'content-group'>,
  name: string,
  groupType: string,
  sourceRecordId: SourceRecordId
): ContentGroup => ({
  id,
  kind: 'content-group',
  name,
  groupType,
  ...common(sourceRecordId),
})

const ability = (
  value: Omit<Ability, 'kind' | 'revision' | 'rulesContextIds' | 'sourceRefs'>,
  sourceRecordId: SourceRecordId
): Ability => ({
  ...value,
  kind: 'ability',
  ...common(sourceRecordId),
})

const weapon = (
  value: Omit<Weapon, 'kind' | 'revision' | 'rulesContextIds' | 'sourceRefs'>,
  sourceRecordId: SourceRecordId
): Weapon => ({
  ...value,
  kind: 'weapon',
  ...common(sourceRecordId),
})

const warscroll = (
  value: Omit<Warscroll, 'kind' | 'revision' | 'rulesContextIds' | 'sourceRefs'>,
  sourceRecordId: SourceRecordId
): Warscroll => ({
  ...value,
  kind: 'warscroll',
  ...common(sourceRecordId),
})

const battleProfile = (
  value: Omit<BattleProfile, 'kind' | 'revision' | 'rulesContextIds' | 'sourceRefs'>,
  secondarySourceRecordId: SourceRecordId
): BattleProfile => ({
  ...value,
  kind: 'battle-profile',
  revision,
  rulesContextIds: [REPRESENTATIVE_CONTEXT_ID],
  sourceRefs: [
    sourceRef(
      REPRESENTATIVE_SOURCE_IDS.officialProfilesPage,
      'unit size, points, base size',
      'official structured profile'
    ),
    sourceRef(secondarySourceRecordId, 'unit size and points', 'secondary cross-check'),
  ],
})

const entities: ContentEntity[] = [
  {
    id: REPRESENTATIVE_IDS.publication,
    kind: 'publication',
    revision: 'June 2026',
    name: 'Warhammer Age of Sigmar Battle Profiles — June 2026',
    publisher: 'games-workshop',
    rulesContextIds: [REPRESENTATIVE_CONTEXT_ID],
    sourceRefs: [
      sourceRef(REPRESENTATIVE_SOURCE_IDS.officialProfilesPage, 'document', 'official publication'),
    ],
  },
  {
    id: REPRESENTATIVE_IDS.faction,
    kind: 'faction',
    name: 'Stormcast Eternals',
    ...common(REPRESENTATIVE_SOURCE_IDS.faction),
  },
  group(
    REPRESENTATIVE_IDS.groups.battleTraits,
    'Battle Traits',
    'battle-traits',
    REPRESENTATIVE_SOURCE_IDS.battleTraitsGroup
  ),
  group(
    REPRESENTATIVE_IDS.groups.lightningEchelon,
    'Lightning Echelon',
    'battle-formation',
    REPRESENTATIVE_SOURCE_IDS.lightningEchelonGroup
  ),
  group(
    REPRESENTATIVE_IDS.groups.quicksilverDraught,
    'Quicksilver Draught',
    'artefact-of-power',
    REPRESENTATIVE_SOURCE_IDS.quicksilverDraught
  ),
  group(
    REPRESENTATIVE_IDS.groups.loreOfTheStorm,
    'Lore of the Storm',
    'spell-lore',
    REPRESENTATIVE_SOURCE_IDS.loreOfTheStormGroup
  ),
  group(
    REPRESENTATIVE_IDS.groups.prayersOfTheStormhosts,
    'Prayers of the Stormhosts',
    'prayer-lore',
    REPRESENTATIVE_SOURCE_IDS.prayersOfTheStormhostsGroup
  ),
  group(
    REPRESENTATIVE_IDS.groups.manifestationsOfTheStorm,
    'Manifestations of the Storm',
    'manifestation-lore',
    REPRESENTATIVE_SOURCE_IDS.manifestationsOfTheStormGroup
  ),
  warscroll(
    {
      id: REPRESENTATIVE_IDS.warscrolls.liberators,
      name: 'Liberators',
      factionIds: [REPRESENTATIVE_IDS.faction],
      keywords: ['ORDER', 'STORMCAST ETERNALS', 'WARRIOR CHAMBER', 'CHAMPION', 'INFANTRY'],
      characteristics: {
        move: '5"',
        save: '3+',
        control: '1',
        health: '2',
      },
    },
    REPRESENTATIVE_SOURCE_IDS.liberators
  ),
  warscroll(
    {
      id: REPRESENTATIVE_IDS.warscrolls.vigilors,
      name: 'Vigilors',
      factionIds: [REPRESENTATIVE_IDS.faction],
      keywords: ['ORDER', 'STORMCAST ETERNALS', 'WARRIOR CHAMBER', 'CHAMPION', 'INFANTRY'],
      characteristics: {
        move: '6"',
        save: '3+',
        control: '1',
        health: '2',
      },
    },
    REPRESENTATIVE_SOURCE_IDS.vigilors
  ),
  battleProfile(
    {
      id: REPRESENTATIVE_IDS.battleProfiles.liberators,
      name: 'Liberators — June 2026 battle profile',
      warscrollId: REPRESENTATIVE_IDS.warscrolls.liberators,
      unitSize: 5,
      points: 90,
      baseSizes: ['40mm'],
      regimentOptions: [],
      notes: [],
    },
    REPRESENTATIVE_SOURCE_IDS.liberators
  ),
  battleProfile(
    {
      id: REPRESENTATIVE_IDS.battleProfiles.vigilors,
      name: 'Vigilors — June 2026 battle profile',
      warscrollId: REPRESENTATIVE_IDS.warscrolls.vigilors,
      unitSize: 5,
      points: 140,
      baseSizes: ['40mm'],
      regimentOptions: [],
      notes: [],
    },
    REPRESENTATIVE_SOURCE_IDS.vigilors
  ),
  ability(
    {
      id: REPRESENTATIVE_IDS.abilities.celestialRealm,
      name: 'The Celestial Realm',
      abilityKind: 'active',
      actor: 'army',
      text: {
        declare: 'Choose an eligible undeployed Stormcast Eternals unit.',
        effect: 'Place that unit in reserve in the Celestial Realm.',
      },
      timings: [
        {
          kind: 'active',
          window: { kind: 'deployment' },
          perspective: 'your',
          raw: 'Deployment Phase',
        },
      ],
      keywords: ['DEPLOY'],
    },
    REPRESENTATIVE_SOURCE_IDS.celestialRealm
  ),
  ability(
    {
      id: REPRESENTATIVE_IDS.abilities.scionsOfTheStorm,
      name: 'Scions of the Storm',
      abilityKind: 'active',
      actor: 'army',
      text: {
        declare: 'Choose an eligible unit in the Celestial Realm.',
        effect: 'Set it up outside 9" of enemy units.',
      },
      timings: [
        {
          kind: 'active',
          window: { kind: 'turn-phase', phase: 'movement' },
          perspective: 'your',
          raw: 'Your Movement Phase',
        },
      ],
      keywords: [],
    },
    REPRESENTATIVE_SOURCE_IDS.scionsOfTheStorm
  ),
  ability(
    {
      id: REPRESENTATIVE_IDS.abilities.finestHour,
      name: 'Their Finest Hour',
      abilityKind: 'active',
      actor: 'unit',
      text: {
        declare: 'Choose a friendly Stormcast Eternals unit that has not used this ability this battle.',
        effect: 'Improve its combat wound rolls and save rolls by 1 for this turn.',
      },
      timings: [
        {
          kind: 'active',
          window: { kind: 'turn-phase', phase: 'hero' },
          perspective: 'your',
          usage: { limit: 1, period: 'turn', scope: 'army' },
          raw: 'Once Per Turn (Army), Your Hero Phase',
        },
      ],
      keywords: [],
    },
    REPRESENTATIVE_SOURCE_IDS.finestHour
  ),
  ability(
    {
      id: REPRESENTATIVE_IDS.abilities.oncomingStorm,
      name: 'Oncoming Storm',
      abilityKind: 'active',
      actor: 'unit',
      text: {
        declare: 'Choose a friendly Extremis Chamber unit that charged this turn.',
        effect: 'On a 3+, that unit has Strike-first for the rest of the turn.',
      },
      timings: [
        {
          kind: 'active',
          window: { kind: 'turn-phase', phase: 'combat' },
          perspective: 'any',
          priority: 'strike-first',
          usage: { limit: 1, period: 'turn', scope: 'army' },
          raw: 'Once Per Turn (Army), Any Combat Phase',
        },
      ],
      keywords: [],
    },
    REPRESENTATIVE_SOURCE_IDS.oncomingStorm
  ),
  ability(
    {
      id: REPRESENTATIVE_IDS.abilities.quicksilverDraught,
      name: 'Quicksilver Draught',
      abilityKind: 'active',
      actor: 'unit',
      text: {
        effect: 'This unit has Strike-first for the rest of the turn.',
      },
      timings: [
        {
          kind: 'active',
          window: { kind: 'turn-phase', phase: 'combat' },
          perspective: 'any',
          priority: 'strike-first',
          usage: { limit: 1, period: 'battle', scope: 'unit' },
          raw: 'Once Per Battle, Any Combat Phase',
        },
      ],
      keywords: [],
    },
    REPRESENTATIVE_SOURCE_IDS.quicksilverDraught
  ),
  ability(
    {
      id: REPRESENTATIVE_IDS.abilities.lightningBlast,
      name: 'Lightning Blast',
      abilityKind: 'active',
      actor: 'unit',
      text: {
        declare: 'Choose the closest eligible visible enemy unit, then make a casting roll.',
        effect: 'Inflict D3 mortal damage on the target.',
      },
      timings: [
        {
          kind: 'active',
          window: { kind: 'turn-phase', phase: 'hero' },
          perspective: 'your',
          raw: 'Your Hero Phase',
        },
      ],
      keywords: ['SPELL', 'UNLIMITED'],
      cost: { kind: 'spell', value: 5 },
    },
    REPRESENTATIVE_SOURCE_IDS.lightningBlast
  ),
  ability(
    {
      id: REPRESENTATIVE_IDS.abilities.healingStorm,
      name: 'Healing Storm',
      abilityKind: 'active',
      actor: 'unit',
      text: {
        declare: 'Choose an eligible priest and a nearby friendly unit, then make a chanting roll.',
        effect: 'Heal the target; a stronger chanting roll can heal nearby friendly units.',
      },
      timings: [
        {
          kind: 'active',
          window: { kind: 'turn-phase', phase: 'hero' },
          perspective: 'your',
          raw: 'Your Hero Phase',
        },
      ],
      keywords: ['PRAYER', 'UNLIMITED'],
      cost: { kind: 'prayer', value: 4 },
    },
    REPRESENTATIVE_SOURCE_IDS.healingStorm
  ),
  ability(
    {
      id: REPRESENTATIVE_IDS.abilities.summonEverblazeComet,
      name: 'Summon Everblaze Comet',
      abilityKind: 'active',
      actor: 'manifestation',
      text: {
        declare: 'Choose an eligible wizard and make a casting roll.',
        effect: 'Set up an Everblaze Comet wholly within 18" of the caster.',
      },
      timings: [
        {
          kind: 'active',
          window: { kind: 'turn-phase', phase: 'hero' },
          perspective: 'your',
          raw: 'Your Hero Phase',
        },
      ],
      keywords: ['SPELL', 'SUMMON'],
      cost: { kind: 'spell', value: 8 },
    },
    REPRESENTATIVE_SOURCE_IDS.summonEverblazeComet
  ),
  ability(
    {
      id: REPRESENTATIVE_IDS.abilities.stalwartDefenders,
      name: 'Stalwart Defenders',
      abilityKind: 'passive',
      actor: 'unit',
      text: {
        effect:
          'Add 3 to this unit’s control score while it contests an objective wholly in friendly territory.',
      },
      timings: [{ kind: 'passive', window: { kind: 'always' }, raw: 'Passive' }],
      keywords: [],
    },
    REPRESENTATIVE_SOURCE_IDS.stalwartDefenders
  ),
  ability(
    {
      id: REPRESENTATIVE_IDS.abilities.navigatorsOfTheStorm,
      name: 'Navigators of the Storm',
      abilityKind: 'passive',
      actor: 'unit',
      text: {
        effect:
          'After this unit damages an enemy with shooting, friendly Stormcast attacks gain +1 to hit that enemy for the turn.',
      },
      timings: [{ kind: 'passive', window: { kind: 'always' }, raw: 'Passive' }],
      keywords: [],
    },
    REPRESENTATIVE_SOURCE_IDS.navigatorsOfTheStorm
  ),
  weapon(
    {
      id: REPRESENTATIVE_IDS.weapons.warhammer,
      name: 'Warhammer',
      weaponType: 'melee',
      profile: {
        attacks: '2',
        hit: '3+',
        wound: '3+',
        rend: '1',
        damage: '1',
      },
      keywords: [{ kind: 'crit-mortal', raw: 'Crit (Mortal)' }],
    },
    REPRESENTATIVE_SOURCE_IDS.warhammer
  ),
  weapon(
    {
      id: REPRESENTATIVE_IDS.weapons.grandhammer,
      name: 'Grandhammer',
      weaponType: 'melee',
      profile: {
        attacks: '2',
        hit: '3+',
        wound: '3+',
        rend: '1',
        damage: '2',
      },
      keywords: [{ kind: 'crit-mortal', raw: 'Crit (Mortal)' }],
    },
    REPRESENTATIVE_SOURCE_IDS.grandhammer
  ),
  weapon(
    {
      id: REPRESENTATIVE_IDS.weapons.stormcallerBow,
      name: 'Stormcaller Bow',
      weaponType: 'ranged',
      profile: {
        rangeInches: 18,
        attacks: '2',
        hit: '3+',
        wound: '3+',
        rend: '1',
        damage: '1',
      },
      keywords: [],
    },
    REPRESENTATIVE_SOURCE_IDS.stormcallerBow
  ),
  weapon(
    {
      id: REPRESENTATIVE_IDS.weapons.stormblade,
      name: 'Stormblade',
      weaponType: 'melee',
      profile: {
        attacks: '2',
        hit: '3+',
        wound: '3+',
        rend: '1',
        damage: '1',
      },
      keywords: [],
    },
    REPRESENTATIVE_SOURCE_IDS.stormblade
  ),
]

const relationships: ContentRelationship[] = [
  {
    id: 'relationship:representative:faction-battle-traits',
    kind: 'includes',
    from: REPRESENTATIVE_IDS.faction,
    to: REPRESENTATIVE_IDS.groups.battleTraits,
  },
  ...[
    REPRESENTATIVE_IDS.groups.lightningEchelon,
    REPRESENTATIVE_IDS.groups.quicksilverDraught,
    REPRESENTATIVE_IDS.groups.loreOfTheStorm,
    REPRESENTATIVE_IDS.groups.prayersOfTheStormhosts,
    REPRESENTATIVE_IDS.groups.manifestationsOfTheStorm,
    REPRESENTATIVE_IDS.warscrolls.liberators,
    REPRESENTATIVE_IDS.warscrolls.vigilors,
  ].map((to, index) => ({
    id: `relationship:representative:faction-offers-${index}` as const,
    kind: 'offers' as const,
    from: REPRESENTATIVE_IDS.faction,
    to,
  })),
  ...[
    REPRESENTATIVE_IDS.abilities.celestialRealm,
    REPRESENTATIVE_IDS.abilities.scionsOfTheStorm,
    REPRESENTATIVE_IDS.abilities.finestHour,
  ].map((to, index) => ({
    id: `relationship:representative:battle-trait-${index}` as const,
    kind: 'includes' as const,
    from: REPRESENTATIVE_IDS.groups.battleTraits,
    to,
  })),
  {
    id: 'relationship:representative:formation-ability',
    kind: 'includes',
    from: REPRESENTATIVE_IDS.groups.lightningEchelon,
    to: REPRESENTATIVE_IDS.abilities.oncomingStorm,
  },
  {
    id: 'relationship:representative:artefact-ability',
    kind: 'includes',
    from: REPRESENTATIVE_IDS.groups.quicksilverDraught,
    to: REPRESENTATIVE_IDS.abilities.quicksilverDraught,
  },
  {
    id: 'relationship:representative:spell-lore-ability',
    kind: 'includes',
    from: REPRESENTATIVE_IDS.groups.loreOfTheStorm,
    to: REPRESENTATIVE_IDS.abilities.lightningBlast,
  },
  {
    id: 'relationship:representative:prayer-lore-ability',
    kind: 'includes',
    from: REPRESENTATIVE_IDS.groups.prayersOfTheStormhosts,
    to: REPRESENTATIVE_IDS.abilities.healingStorm,
  },
  {
    id: 'relationship:representative:manifestation-lore-ability',
    kind: 'includes',
    from: REPRESENTATIVE_IDS.groups.manifestationsOfTheStorm,
    to: REPRESENTATIVE_IDS.abilities.summonEverblazeComet,
  },
  ...[
    REPRESENTATIVE_IDS.battleProfiles.liberators,
    REPRESENTATIVE_IDS.abilities.stalwartDefenders,
    REPRESENTATIVE_IDS.weapons.warhammer,
    REPRESENTATIVE_IDS.weapons.grandhammer,
  ].map((to, index) => ({
    id: `relationship:representative:liberators-${index}` as const,
    kind: 'includes' as const,
    from: REPRESENTATIVE_IDS.warscrolls.liberators,
    to,
  })),
  ...[
    REPRESENTATIVE_IDS.battleProfiles.vigilors,
    REPRESENTATIVE_IDS.abilities.navigatorsOfTheStorm,
    REPRESENTATIVE_IDS.weapons.stormcallerBow,
    REPRESENTATIVE_IDS.weapons.stormblade,
  ].map((to, index) => ({
    id: `relationship:representative:vigilors-${index}` as const,
    kind: 'includes' as const,
    from: REPRESENTATIVE_IDS.warscrolls.vigilors,
    to,
  })),
]

export const REPRESENTATIVE_CATALOG: Aos4Catalog = {
  schemaVersion: AOS4_CATALOG_SCHEMA_VERSION,
  generatedAt: '2026-07-27T20:00:00.000Z',
  rulesContexts: [
    {
      id: REPRESENTATIVE_CONTEXT_ID,
      name: 'Standard — General’s Handbook 2026-27',
      mode: 'standard',
      status: 'seasonal',
      publicationIds: [REPRESENTATIVE_IDS.publication],
      battlepack: 'General’s Handbook 2026-27',
      season: '2026-27',
      validFrom: '2026-06-29',
    },
  ],
  sourceArtifacts: REPRESENTATIVE_SOURCE_ARTIFACTS,
  sourceRecords: REPRESENTATIVE_SOURCE_RECORDS,
  entities,
  relationships,
}

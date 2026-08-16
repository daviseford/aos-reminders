import { vi } from 'vitest'
import {
  REPRESENTATIVE_AUDIT as AOS4_GENERATION_AUDIT,
  REPRESENTATIVE_CATALOG as AOS4_CATALOG,
  REPRESENTATIVE_CONTEXT_ID,
  REPRESENTATIVE_EXPLICIT_SELECTION_IDS as AOS4_DEFAULT_SELECTION_IDS,
  REPRESENTATIVE_IDS,
  REPRESENTATIVE_SOURCE_ARTIFACTS,
  REPRESENTATIVE_SOURCE_IDS,
} from '../../aos4/generated'
import { validateCatalog, type Weapon } from '../../aos4/domain'
import { projectReminders } from '../../aos4/reminders'
import { resolveSelection } from '../../aos4/select'
import {
  createAos4ArmyDocument,
  deserializeAos4ArmyDocument,
  serializeAos4ArmyDocument,
  setAos4ReminderPreference,
} from '../../aos4/state'
import {
  createAos4BuilderViewModel,
  createAos4ReminderViewModel,
  createPrintableAos4Reminders,
} from '../../aos4/view'

const createDocument = () =>
  createAos4ArmyDocument({
    id: 'army:representative-stormcast',
    name: 'Representative Stormcast Eternals',
    rulesContextId: REPRESENTATIVE_CONTEXT_ID,
    explicitSelectionIds: AOS4_DEFAULT_SELECTION_IDS,
  })

describe('AoS 4 representative vertical slice', () => {
  it('ships a valid, source-addressable Stormcast catalog', () => {
    expect(validateCatalog(AOS4_CATALOG)).toEqual([])
    expect(AOS4_CATALOG.entities.find(entity => entity.id === REPRESENTATIVE_IDS.faction)).toMatchObject({
      kind: 'faction',
      name: 'Stormcast Eternals',
    })
    expect(AOS4_GENERATION_AUDIT).toMatchObject({
      attribution: 'Powered by Wahapedia',
      sourcePolicy: {
        officialPublisher: 'games-workshop',
        secondaryPublisher: 'wahapedia',
        fullRuleBodiesCommitted: false,
      },
    })
  })

  it('resolves representative choices, mandatory content, profiles, and weapons by ID', () => {
    const selection = resolveSelection(AOS4_CATALOG, {
      explicitIds: AOS4_DEFAULT_SELECTION_IDS,
      rulesContextId: REPRESENTATIVE_CONTEXT_ID,
    })

    expect(selection.diagnostics).toEqual([])
    expect(selection.selectedIds).toEqual(
      expect.arrayContaining([
        REPRESENTATIVE_IDS.groups.battleTraits,
        REPRESENTATIVE_IDS.abilities.celestialRealm,
        REPRESENTATIVE_IDS.abilities.oncomingStorm,
        REPRESENTATIVE_IDS.abilities.quicksilverDraught,
        REPRESENTATIVE_IDS.abilities.lightningBlast,
        REPRESENTATIVE_IDS.abilities.healingStorm,
        REPRESENTATIVE_IDS.abilities.summonEverblazeComet,
        REPRESENTATIVE_IDS.abilities.stalwartDefenders,
        REPRESENTATIVE_IDS.abilities.navigatorsOfTheStorm,
        REPRESENTATIVE_IDS.battleProfiles.liberators,
        REPRESENTATIVE_IDS.battleProfiles.vigilors,
        REPRESENTATIVE_IDS.weapons.warhammer,
        REPRESENTATIVE_IDS.weapons.grandhammer,
        REPRESENTATIVE_IDS.weapons.stormcallerBow,
        REPRESENTATIVE_IDS.weapons.stormblade,
      ])
    )

    const builder = createAos4BuilderViewModel(AOS4_CATALOG, createDocument())
    expect(builder.warscrolls).toEqual([
      expect.objectContaining({
        name: 'Liberators',
        profile: { unitSize: 5, points: 90, baseSizes: ['40mm'] },
      }),
      expect.objectContaining({
        name: 'Vigilors',
        profile: { unitSize: 5, points: 140, baseSizes: ['40mm'] },
      }),
    ])

    const selectedWeapons = AOS4_CATALOG.entities.filter(
      (entity): entity is Weapon => entity.kind === 'weapon' && selection.selectedIds.includes(entity.id)
    )
    expect(selectedWeapons.map(weapon => [weapon.name, weapon.weaponType])).toEqual([
      ['Warhammer', 'melee'],
      ['Grandhammer', 'melee'],
      ['Stormcaller Bow', 'ranged'],
      ['Stormblade', 'melee'],
    ])
  })

  it('places deployment, passives, and combat priority with accessible labels', () => {
    const reminders = createAos4ReminderViewModel(AOS4_CATALOG, createDocument())
    const deployment = reminders.find(reminder => reminder.name === 'The Celestial Realm')
    const passive = reminders.find(reminder => reminder.name === 'Stalwart Defenders')
    const combat = reminders.filter(reminder => reminder.windowKey === 'turn-phase:combat')

    expect(deployment).toMatchObject({
      windowLabel: 'Deployment',
      typeLabel: expect.stringContaining('Active'),
    })
    expect(passive).toMatchObject({
      windowLabel: 'Passive',
      typeLabel: 'Passive',
    })
    expect(combat.map(reminder => [reminder.name, reminder.typeLabel])).toEqual([
      ['Oncoming Storm', expect.stringContaining('Strike First')],
      ['Quicksilver Draught', expect.stringContaining('Strike First')],
    ])
  })

  it('traces every reminder and weapon to a source record, artifact, and context', () => {
    const selection = resolveSelection(AOS4_CATALOG, {
      explicitIds: AOS4_DEFAULT_SELECTION_IDS,
      rulesContextId: REPRESENTATIVE_CONTEXT_ID,
    })
    const sourceRecords = new Map(AOS4_CATALOG.sourceRecords.map(record => [record.id, record]))
    const artifactIds = new Set(AOS4_CATALOG.sourceArtifacts.map(artifact => artifact.id))
    const reminders = projectReminders(AOS4_CATALOG, selection)

    reminders.forEach(reminder => {
      expect(reminder.sourceRefs.length).toBeGreaterThan(0)
      reminder.sourceRefs.forEach(reference => {
        const record = sourceRecords.get(reference.sourceRecordId)
        expect(record).toBeDefined()
        expect(record?.rulesContextIds).toContain(REPRESENTATIVE_CONTEXT_ID)
        expect(artifactIds).toContain(record?.artifactId)
      })
    })

    AOS4_CATALOG.entities
      .filter(
        (entity): entity is Weapon => entity.kind === 'weapon' && selection.selectedIds.includes(entity.id)
      )
      .forEach(weapon => {
        expect(weapon.sourceRefs.length).toBeGreaterThan(0)
        weapon.sourceRefs.forEach(reference => {
          expect(sourceRecords.has(reference.sourceRecordId)).toBe(true)
        })
      })

    const official = REPRESENTATIVE_SOURCE_ARTIFACTS.find(artifact => artifact.publisher === 'games-workshop')
    expect(official).toMatchObject({
      authority: { kind: 'official' },
      version: 'June 2026',
      checksum: expect.stringMatching(/^[0-9a-f]{64}$/),
    })
    expect(REPRESENTATIVE_SOURCE_ARTIFACTS.every(artifact => artifact.authority.kind !== 'unknown')).toBe(
      true
    )
  })

  it('traces content groups to their own type or subtype rows', () => {
    const expectedSources = new Map([
      [REPRESENTATIVE_IDS.groups.battleTraits, REPRESENTATIVE_SOURCE_IDS.battleTraitsGroup],
      [REPRESENTATIVE_IDS.groups.lightningEchelon, REPRESENTATIVE_SOURCE_IDS.lightningEchelonGroup],
      [REPRESENTATIVE_IDS.groups.loreOfTheStorm, REPRESENTATIVE_SOURCE_IDS.loreOfTheStormGroup],
      [
        REPRESENTATIVE_IDS.groups.prayersOfTheStormhosts,
        REPRESENTATIVE_SOURCE_IDS.prayersOfTheStormhostsGroup,
      ],
      [
        REPRESENTATIVE_IDS.groups.manifestationsOfTheStorm,
        REPRESENTATIVE_SOURCE_IDS.manifestationsOfTheStormGroup,
      ],
    ])

    expectedSources.forEach((sourceRecordId, groupId) => {
      expect(AOS4_CATALOG.entities.find(entity => entity.id === groupId)?.sourceRefs).toEqual([
        expect.objectContaining({ sourceRecordId }),
      ])
    })
  })

  it('keeps synthetic unknown timing out of the accepted audit and runtime', () => {
    const reminders = createAos4ReminderViewModel(AOS4_CATALOG, createDocument())

    expect(reminders.every(reminder => reminder.projected.timing.window.kind !== 'unknown')).toBe(true)
    expect(AOS4_GENERATION_AUDIT.acknowledgedDiagnostics).toEqual([])
  })

  it('preserves stable notes, hiding, ordering, and print visibility through serialization', () => {
    const initial = createDocument()
    const initialReminders = createAos4ReminderViewModel(AOS4_CATALOG, initial)
    const finestHour = initialReminders.find(reminder => reminder.name === 'Their Finest Hour')!
    const oncomingStorm = initialReminders.find(reminder => reminder.name === 'Oncoming Storm')!
    const quicksilver = initialReminders.find(reminder => reminder.name === 'Quicksilver Draught')!

    let changed = setAos4ReminderPreference(initial, finestHour.id, {
      hidden: true,
      note: 'Used by the general.',
    })
    changed = setAos4ReminderPreference(changed, oncomingStorm.id, { order: 1 })
    changed = setAos4ReminderPreference(changed, quicksilver.id, { order: 0 })

    const serialized = serializeAos4ArmyDocument(changed)
    const restored = deserializeAos4ArmyDocument(serialized, AOS4_CATALOG)
    const view = createAos4ReminderViewModel(AOS4_CATALOG, restored.document!)
    const combat = view.filter(reminder => reminder.windowKey === 'turn-phase:combat')

    expect(restored.diagnostics).toEqual([])
    expect(serializeAos4ArmyDocument(restored.document!)).toBe(serialized)
    expect(view.find(reminder => reminder.id === finestHour.id)).toMatchObject({
      hidden: true,
      note: 'Used by the general.',
    })
    expect(combat.map(reminder => reminder.name)).toEqual(['Quicksilver Draught', 'Oncoming Storm'])
    expect(
      createPrintableAos4Reminders(AOS4_CATALOG, restored.document!).map(reminder => reminder.id)
    ).not.toContain(finestHour.id)
  })

  /**
   * `allowsHistorical` round-trips, and its absence still writes schema 1's original bytes.
   *
   * Documents saved before the field existed have to keep deserializing, and documents that never
   * touch a past season have to keep serializing to the same bytes — otherwise every stored army
   * in every browser rewrites itself the first time it loads (issue #1783).
   */
  it('round-trips the superseded-season opt-in without disturbing documents that lack it', () => {
    const plain = createDocument()
    const serializedPlain = serializeAos4ArmyDocument(plain)
    expect(serializedPlain).not.toContain('allowsHistorical')

    const lapsed = createAos4ArmyDocument({ ...plain, allowsHistorical: true })
    const restored = deserializeAos4ArmyDocument(serializeAos4ArmyDocument(lapsed), AOS4_CATALOG)

    expect(restored.diagnostics).toEqual([])
    expect(restored.document?.allowsHistorical).toBe(true)
    expect(serializeAos4ArmyDocument(restored.document!)).toBe(serializeAos4ArmyDocument(lapsed))
    expect(
      deserializeAos4ArmyDocument(serializedPlain, AOS4_CATALOG).document?.allowsHistorical
    ).toBeUndefined()
  })

  it('loads entirely from generated data without source network access', () => {
    const originalFetch = globalThis.fetch
    const network = vi.fn(() => {
      throw new Error('Representative runtime must not fetch source data')
    })
    globalThis.fetch = network

    try {
      const document = createDocument()
      expect(createAos4BuilderViewModel(AOS4_CATALOG, document).warscrolls).toHaveLength(2)
      expect(createAos4ReminderViewModel(AOS4_CATALOG, document).length).toBeGreaterThan(0)
      expect(network).not.toHaveBeenCalled()
    } finally {
      globalThis.fetch = originalFetch
    }
  })

  it('rejects incompatible schemas and survives dangling selections without calling a remote API', () => {
    expect(deserializeAos4ArmyDocument(JSON.stringify({ schemaVersion: 0 }), AOS4_CATALOG)).toEqual({
      diagnostics: [
        expect.objectContaining({
          code: 'incompatible-schema',
          severity: 'error',
        }),
      ],
    })

    // A catalog update that removed a selected entity must not cost the user their army: the dead
    // selection is filtered with a warning and the document survives (the storage-level round trip
    // lives in armySurvival.test.ts).
    const document = JSON.parse(serializeAos4ArmyDocument(createDocument()))
    document.explicitSelectionIds.push('warscroll:ffffffff-ffff-4fff-8fff-ffffffffffff')
    const result = deserializeAos4ArmyDocument(JSON.stringify(document), AOS4_CATALOG)
    expect(result.document?.explicitSelectionIds).toEqual(createDocument().explicitSelectionIds)
    expect(result.diagnostics).toContainEqual(
      expect.objectContaining({
        code: 'missing-selection',
        severity: 'warning',
        subject: 'warscroll:ffffffff-ffff-4fff-8fff-ffffffffffff',
      })
    )
  })
})

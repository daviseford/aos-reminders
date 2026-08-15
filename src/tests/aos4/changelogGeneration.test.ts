import { createHash } from 'node:crypto'
import { mkdtemp, readFile, rm, writeFile } from 'node:fs/promises'
import os from 'node:os'
import path from 'node:path'
import { vi } from 'vitest'
import {
  AOS4_CHANGELOG_RETAINED_ACCEPTANCES,
  AOS4_CHANGELOG_SCHEMA_VERSION,
  validateChangelogLedger,
  type Aos4PublishedChangelog,
  type ChangelogLedgerEntry,
  type ChangelogPublicationInput,
} from '../../aos4/changelog'
import {
  abilityId,
  AOS4_CATALOG_SCHEMA_VERSION,
  battleProfileId,
  factionId,
  publicationId,
  rulesContextId,
  sourceRecordId,
  warscrollId,
  type Ability,
  type Aos4Catalog,
  type BattleProfile,
  type ContentEntity,
  type ContentRelationship,
  type Warscroll,
} from '../../aos4/domain'
import { createRuntimeProjection, serializeRuntimeProjection } from '../../aos4/generate'
import {
  parseChangelogCommandArguments,
  runChangelogCommand,
  type ChangelogCommandIo,
} from '../../aos4/generate/changelogCommand'

const CTX = rulesContextId('90000000-0000-4000-8000-000000000001')
const RECORD_ID = sourceRecordId('fixture', 'record')
const FACTION = factionId('00000000-0000-4000-8000-00000000000a')
const WARSCROLL = warscrollId('00000000-0000-4000-8000-000000000010')
const PROFILE = battleProfileId('00000000-0000-4000-8000-000000000011')
const ABILITY = abilityId('00000000-0000-4000-8000-000000000012')

const provenance = () => ({
  revision: 'fixture',
  rulesContextIds: [CTX],
  sourceRefs: [{ sourceRecordId: RECORD_ID }],
})

const buildCatalog = (mutate?: (catalog: Aos4Catalog) => void): Aos4Catalog => {
  const entities: ContentEntity[] = [
    { id: FACTION, kind: 'faction', name: 'Fixture Host', ...provenance() },
    {
      id: WARSCROLL,
      kind: 'warscroll',
      name: 'Liberators',
      factionIds: [FACTION],
      keywords: ['INFANTRY'],
      characteristics: { move: '5"', save: '3+', control: '1', health: '2' },
      ...provenance(),
    },
    {
      id: PROFILE,
      kind: 'battle-profile',
      name: 'Liberators',
      warscrollId: WARSCROLL,
      unitSize: 5,
      points: 90,
      baseSizes: ['40mm'],
      regimentOptions: [],
      notes: [],
      ...provenance(),
    },
    {
      id: ABILITY,
      kind: 'ability',
      name: 'Shield Wall',
      abilityKind: 'active',
      actor: 'unit',
      text: { effect: 'Effect revision 0.' },
      timings: [],
      keywords: [],
      ...provenance(),
    },
  ]
  const relationships: ContentRelationship[] = [
    { id: 'relationship:fixture-1', kind: 'offers', from: FACTION, to: WARSCROLL },
    { id: 'relationship:fixture-2', kind: 'includes', from: WARSCROLL, to: PROFILE },
    { id: 'relationship:fixture-3', kind: 'includes', from: WARSCROLL, to: ABILITY },
  ]
  const catalog: Aos4Catalog = {
    schemaVersion: AOS4_CATALOG_SCHEMA_VERSION,
    generatedAt: '2026-08-01T00:00:00.000Z',
    rulesContexts: [
      { id: CTX, name: 'Fixture context', mode: 'standard', status: 'current', publicationIds: [] },
    ],
    sourceArtifacts: [],
    sourceRecords: [],
    entities,
    relationships,
  }
  mutate?.(catalog)
  return catalog
}

const getAbility = (catalog: Aos4Catalog): Ability =>
  catalog.entities.find(entity => entity.id === ABILITY) as Ability

const getProfile = (catalog: Aos4Catalog): BattleProfile =>
  catalog.entities.find(entity => entity.id === PROFILE) as BattleProfile

const getWarscroll = (catalog: Aos4Catalog): Warscroll =>
  catalog.entities.find(entity => entity.id === WARSCROLL) as Warscroll

const catalogAtRevision = (revision: number): Aos4Catalog =>
  buildCatalog(catalog => {
    getAbility(catalog).text = { effect: `Effect revision ${revision}.` }
  })

const projectionBytes = (catalog: Aos4Catalog): Uint8Array =>
  new TextEncoder().encode(
    serializeRuntimeProjection(createRuntimeProjection(catalog, 'Fixture attribution'))
  )

const sha256 = (bytes: Uint8Array): string => createHash('sha256').update(bytes).digest('hex')

const publication = (index: number): ChangelogPublicationInput => ({
  publicationId: publicationId(`00000000-0000-4000-8000-${String(index).padStart(12, '0')}`),
  name: `Battlescroll ${index}`,
  source: 'games-workshop',
  effectiveDate: `2026-08-${String(index).padStart(2, '0')}`,
})

const ledgerEntry = (
  index: number,
  prior: Uint8Array,
  current: Uint8Array,
  override: Partial<ChangelogLedgerEntry> = {}
): ChangelogLedgerEntry => ({
  id: `acceptance-${index}`,
  previousEntryId: index > 1 ? `acceptance-${index - 1}` : null,
  prior: { commit: `commit-${index}`, runtimeBlobSha256: sha256(prior) },
  current: { runtimeSha256: sha256(current) },
  publications: [publication(index)],
  cohorts: [{ name: `drop-${index}`, disposition: 'rules-driven' }],
  ...override,
})

interface Workspace {
  ledgerPath: string
  recordsDirectory: string
  artifactPath: string
  runtimePath: string
}

const workspaceRoots: string[] = []

const createWorkspace = async (): Promise<Workspace> => {
  const root = await mkdtemp(path.join(os.tmpdir(), 'aos4-changelog-'))
  workspaceRoots.push(root)
  return {
    ledgerPath: path.join(root, 'ledger.json'),
    recordsDirectory: path.join(root, 'records'),
    artifactPath: path.join(root, 'generated', 'changelog.json'),
    runtimePath: path.join(root, 'runtime.json'),
  }
}

afterAll(async () => {
  await Promise.all(workspaceRoots.map(root => rm(root, { recursive: true, force: true })))
})

const commandArguments = (workspace: Workspace, write = false) =>
  parseChangelogCommandArguments([
    '--ledger',
    workspace.ledgerPath,
    '--records',
    workspace.recordsDirectory,
    '--artifact',
    workspace.artifactPath,
    '--runtime',
    workspace.runtimePath,
    ...(write ? ['--write'] : []),
  ])

const writeLedger = (workspace: Workspace, entries: ChangelogLedgerEntry[]): Promise<void> =>
  writeFile(workspace.ledgerPath, `${JSON.stringify(entries, null, 2)}\n`, 'utf8')

const writeRuntime = (workspace: Workspace, bytes: Uint8Array): Promise<void> =>
  writeFile(workspace.runtimePath, bytes)

const createResolver = (bytesByEntryId: Record<string, Uint8Array>): ChangelogCommandIo => ({
  resolvePriorProjectionBytes: vi.fn(async (entry: ChangelogLedgerEntry) => {
    const bytes = bytesByEntryId[entry.id]
    if (!bytes) throw new Error(`Unexpected prior projection resolution for ${entry.id}`)
    return bytes
  }),
})

const unusedResolver = (): ChangelogCommandIo => ({
  resolvePriorProjectionBytes: vi.fn(async () => {
    throw new Error('The verify path must never resolve prior projections')
  }),
})

const readArtifact = async (workspace: Workspace): Promise<Aos4PublishedChangelog> =>
  JSON.parse(await readFile(workspace.artifactPath, 'utf8')) as Aos4PublishedChangelog

describe('AoS 4 changelog generation command', () => {
  it('parses arguments and rejects unknown flags', () => {
    const parsed = parseChangelogCommandArguments(['--write'])
    expect(parsed).toMatchObject({
      write: true,
      ledgerPath: path.join('data', 'aos4', 'changelog', 'ledger.json'),
      recordsDirectory: path.join('data', 'aos4', 'changelog', 'records'),
      artifactPath: path.join('src', 'aos4', 'generated', 'changelog', 'changelog.json'),
      runtimePath: path.join('src', 'aos4', 'generated', 'corpus', 'runtime.json'),
    })
    expect(() => parseChangelogCommandArguments(['--nope'])).toThrow('Unknown argument: --nope')
  })

  it('generates a deterministic artifact and record file, byte-identical across repeated runs', async () => {
    const workspace = await createWorkspace()
    const prior = projectionBytes(catalogAtRevision(0))
    const current = projectionBytes(catalogAtRevision(1))
    await writeRuntime(workspace, current)
    await writeLedger(workspace, [ledgerEntry(1, prior, current)])

    await runChangelogCommand(commandArguments(workspace, true), createResolver({ 'acceptance-1': prior }))
    const firstArtifact = await readFile(workspace.artifactPath, 'utf8')
    const recordFile = await readFile(path.join(workspace.recordsDirectory, 'acceptance-1.json'), 'utf8')
    expect(recordFile).toContain('"entryId": "acceptance-1"')

    await rm(workspace.artifactPath)
    await runChangelogCommand(commandArguments(workspace, true), createResolver({ 'acceptance-1': prior }))
    expect(await readFile(workspace.artifactPath, 'utf8')).toBe(firstArtifact)

    const artifact = await readArtifact(workspace)
    expect(artifact).toEqual({
      schemaVersion: AOS4_CHANGELOG_SCHEMA_VERSION,
      revision: 'acceptance-1',
      knownEntryIds: ['acceptance-1'],
      retainedEntryIds: ['acceptance-1'],
      retainedPublicationIds: [publication(1).publicationId],
      publications: [
        {
          publicationId: publication(1).publicationId,
          name: 'Battlescroll 1',
          source: 'games-workshop',
          effectiveDate: '2026-08-01',
        },
      ],
      records: [
        expect.objectContaining({
          changeKind: 'modified',
          entityId: ABILITY,
          attribution: expect.objectContaining({ kind: 'publication' }),
          fields: [{ field: 'text.effect', previous: 'Effect revision 0.', next: 'Effect revision 1.' }],
        }),
      ],
      corrections: [],
    })
  })

  it('verifies the checked-in artifact without ever invoking the prior projection resolver', async () => {
    const workspace = await createWorkspace()
    const prior = projectionBytes(catalogAtRevision(0))
    const current = projectionBytes(catalogAtRevision(1))
    await writeRuntime(workspace, current)
    await writeLedger(workspace, [ledgerEntry(1, prior, current)])
    await runChangelogCommand(commandArguments(workspace, true), createResolver({ 'acceptance-1': prior }))

    const io = unusedResolver()
    await expect(runChangelogCommand(commandArguments(workspace), io)).resolves.toBeUndefined()
    expect(io.resolvePriorProjectionBytes).not.toHaveBeenCalled()
  })

  it('fails verification with a drift error when the checked-in artifact is hand-edited', async () => {
    const workspace = await createWorkspace()
    const prior = projectionBytes(catalogAtRevision(0))
    const current = projectionBytes(catalogAtRevision(1))
    await writeRuntime(workspace, current)
    await writeLedger(workspace, [ledgerEntry(1, prior, current)])
    await runChangelogCommand(commandArguments(workspace, true), createResolver({ 'acceptance-1': prior }))

    const published = await readFile(workspace.artifactPath, 'utf8')
    await writeFile(workspace.artifactPath, published.replace('"revision"', '"revisionX"'), 'utf8')
    await expect(runChangelogCommand(commandArguments(workspace), unusedResolver())).rejects.toThrow(
      /drifted/
    )
  })

  it('fails verification when the newest entry no longer matches the checked-in runtime', async () => {
    const workspace = await createWorkspace()
    const prior = projectionBytes(catalogAtRevision(0))
    const current = projectionBytes(catalogAtRevision(1))
    await writeRuntime(workspace, current)
    await writeLedger(workspace, [ledgerEntry(1, prior, current)])
    await runChangelogCommand(commandArguments(workspace, true), createResolver({ 'acceptance-1': prior }))

    await writeRuntime(workspace, projectionBytes(catalogAtRevision(2)))
    await expect(runChangelogCommand(commandArguments(workspace), unusedResolver())).rejects.toThrow(
      /runtime/
    )
  })

  it('fails generation closed when the resolved prior blob does not match the ledger checksum', async () => {
    const workspace = await createWorkspace()
    const prior = projectionBytes(catalogAtRevision(0))
    const current = projectionBytes(catalogAtRevision(1))
    await writeRuntime(workspace, current)
    await writeLedger(workspace, [ledgerEntry(1, prior, current)])

    await expect(
      runChangelogCommand(commandArguments(workspace, true), createResolver({ 'acceptance-1': current }))
    ).rejects.toThrow(/acceptance-1.*pins/)
  })

  it('excludes churn cohorts and publishes correction cohorts as labeled corrections', async () => {
    const workspace = await createWorkspace()
    const prior = projectionBytes(buildCatalog())
    const current = projectionBytes(
      buildCatalog(catalog => {
        getAbility(catalog).text = { effect: 'Corrected transcription.' }
        getProfile(catalog).points = 100
        getWarscroll(catalog).name = 'Liberator Host'
      })
    )
    await writeRuntime(workspace, current)
    await writeLedger(workspace, [
      ledgerEntry(1, prior, current, {
        cohorts: [
          { name: 'battlescroll', disposition: 'rules-driven', selector: { entityIds: [WARSCROLL] } },
          { name: 'transcription-fix', disposition: 'correction', selector: { entityIds: [ABILITY] } },
          { name: 'points-churn', disposition: 'churn', selector: { entityIds: [PROFILE] } },
        ],
      }),
    ])
    await runChangelogCommand(commandArguments(workspace, true), createResolver({ 'acceptance-1': prior }))

    const artifact = await readArtifact(workspace)
    expect(artifact.records).toEqual([
      expect.objectContaining({
        entityId: WARSCROLL,
        attribution: expect.objectContaining({ kind: 'publication' }),
      }),
    ])
    expect(artifact.corrections).toEqual([
      expect.objectContaining({ entityId: ABILITY, attribution: { kind: 'correction' } }),
    ])
    const everyEntityId = [...artifact.records, ...artifact.corrections].map(record => record.entityId)
    expect(everyEntityId).not.toContain(PROFILE)
  })

  it('surfaces diff-engine publication selector ambiguity and misses as failed generation', async () => {
    const workspace = await createWorkspace()
    const prior = projectionBytes(catalogAtRevision(0))
    const current = projectionBytes(catalogAtRevision(1))
    await writeRuntime(workspace, current)
    const twoPublications = (
      firstSelector: NonNullable<ChangelogPublicationInput['selector']>,
      secondSelector: NonNullable<ChangelogPublicationInput['selector']>
    ): Partial<ChangelogLedgerEntry> => ({
      publications: [
        { ...publication(1), selector: firstSelector },
        { ...publication(2), selector: secondSelector },
      ],
      cohorts: [{ name: 'august-drop', disposition: 'rules-driven' }],
    })

    await writeLedger(workspace, [
      ledgerEntry(1, prior, current, twoPublications({ entityIds: [ABILITY] }, { entityIds: [ABILITY] })),
    ])
    await expect(
      runChangelogCommand(commandArguments(workspace, true), createResolver({ 'acceptance-1': prior }))
    ).rejects.toThrow(/matched 2 publication selectors/)

    await writeLedger(workspace, [
      ledgerEntry(1, prior, current, twoPublications({ entityIds: [] }, { entityIds: [] })),
    ])
    await expect(
      runChangelogCommand(commandArguments(workspace, true), createResolver({ 'acceptance-1': prior }))
    ).rejects.toThrow(/matched 0 publication selectors/)
  })

  it('fails closed when a cohort names a publication the entry does not declare', async () => {
    const workspace = await createWorkspace()
    const prior = projectionBytes(catalogAtRevision(0))
    const current = projectionBytes(catalogAtRevision(1))
    await writeRuntime(workspace, current)
    await writeLedger(workspace, [
      ledgerEntry(1, prior, current, {
        cohorts: [
          {
            name: 'drop-1',
            disposition: 'rules-driven',
            publicationIds: [publication(9).publicationId],
          },
        ],
      }),
    ])

    await expect(
      runChangelogCommand(commandArguments(workspace, true), createResolver({ 'acceptance-1': prior }))
    ).rejects.toThrow(/undeclared publication/)
    await expect(runChangelogCommand(commandArguments(workspace), unusedResolver())).rejects.toThrow(
      /undeclared publication/
    )
  })

  it('retains only the newest six rules-driven acceptances, ordered newest-first', async () => {
    expect(AOS4_CHANGELOG_RETAINED_ACCEPTANCES).toBe(6)
    const workspace = await createWorkspace()
    const snapshots = Array.from({ length: 8 }, (_, revision) => projectionBytes(catalogAtRevision(revision)))
    const entries: ChangelogLedgerEntry[] = []
    for (let index = 1; index <= 7; index += 1) {
      entries.push(ledgerEntry(index, snapshots[index - 1], snapshots[index]))
      await writeRuntime(workspace, snapshots[index])
      await writeLedger(workspace, entries)
      await runChangelogCommand(
        commandArguments(workspace, true),
        createResolver({ [`acceptance-${index}`]: snapshots[index - 1] })
      )
    }

    const artifact = await readArtifact(workspace)
    expect(artifact.revision).toBe('acceptance-7')
    expect(artifact.knownEntryIds).toEqual([1, 2, 3, 4, 5, 6, 7].map(index => `acceptance-${index}`))
    expect(artifact.retainedEntryIds).toEqual([
      'acceptance-7',
      'acceptance-6',
      'acceptance-5',
      'acceptance-4',
      'acceptance-3',
      'acceptance-2',
    ])
    expect(artifact.retainedPublicationIds).toEqual(
      [7, 6, 5, 4, 3, 2].map(index => publication(index).publicationId)
    )
    expect(artifact.publications.map(entry => entry.name)).toEqual(
      [7, 6, 5, 4, 3, 2].map(index => `Battlescroll ${index}`)
    )
    expect(artifact.records).toHaveLength(6)
    await expect(runChangelogCommand(commandArguments(workspace), unusedResolver())).resolves.toBeUndefined()

    await rm(path.join(workspace.recordsDirectory, 'acceptance-3.json'))
    await expect(runChangelogCommand(commandArguments(workspace), unusedResolver())).rejects.toThrow(
      /acceptance-3/
    )
  })

  it('rejects a ledger whose previousEntryId chain is reordered, spliced, or broken', async () => {
    const prior = projectionBytes(catalogAtRevision(0))
    const current = projectionBytes(catalogAtRevision(1))
    const first = ledgerEntry(1, prior, current)
    const second = ledgerEntry(2, prior, current)
    expect(validateChangelogLedger([first, second])).toHaveLength(2)
    // Reordered: the moved entry still names its old predecessor.
    expect(() => validateChangelogLedger([second, first])).toThrow(/previousEntryId/)
    // Spliced: an entry inserted before the tail breaks the tail's link.
    const inserted = ledgerEntry(3, prior, current, { previousEntryId: 'acceptance-1' })
    expect(() => validateChangelogLedger([first, inserted, second])).toThrow(/previousEntryId/)
    // Broken: a non-first entry may not restart the chain.
    expect(() => validateChangelogLedger([first, { ...second, previousEntryId: null }])).toThrow(
      /previousEntryId/
    )
  })

  it('fails write and verify closed when a ledger entry changes after its records were generated', async () => {
    const workspace = await createWorkspace()
    const snapshots = [0, 1, 2].map(revision => projectionBytes(catalogAtRevision(revision)))
    const first = ledgerEntry(1, snapshots[0], snapshots[1])
    const second = ledgerEntry(2, snapshots[1], snapshots[2])
    await writeRuntime(workspace, snapshots[1])
    await writeLedger(workspace, [first])
    await runChangelogCommand(
      commandArguments(workspace, true),
      createResolver({ 'acceptance-1': snapshots[0] })
    )
    await writeRuntime(workspace, snapshots[2])
    await writeLedger(workspace, [first, second])
    await runChangelogCommand(
      commandArguments(workspace, true),
      createResolver({ 'acceptance-2': snapshots[1] })
    )
    await expect(runChangelogCommand(commandArguments(workspace), unusedResolver())).resolves.toBeUndefined()

    // Editing an attribution selector after generation must never pass with the stale record file:
    // the first entry's accepted snapshot is no longer the checked-in runtime, so it cannot be
    // re-diffed either.
    const edited: ChangelogLedgerEntry = {
      ...first,
      cohorts: [{ name: 'drop-1', disposition: 'rules-driven', selector: { entityIds: [ABILITY] } }],
    }
    await writeLedger(workspace, [edited, second])
    await expect(runChangelogCommand(commandArguments(workspace), unusedResolver())).rejects.toThrow(
      /acceptance-1.*changed after its records were generated/
    )
    await expect(runChangelogCommand(commandArguments(workspace, true), unusedResolver())).rejects.toThrow(
      /no longer recomputable/
    )
  })

  it('regenerates a stale record file when the entry still pins the checked-in runtime', async () => {
    const workspace = await createWorkspace()
    const prior = projectionBytes(catalogAtRevision(0))
    const current = projectionBytes(catalogAtRevision(1))
    await writeRuntime(workspace, current)
    const entry = ledgerEntry(1, prior, current)
    await writeLedger(workspace, [entry])
    await runChangelogCommand(commandArguments(workspace, true), createResolver({ 'acceptance-1': prior }))
    const recordPath = path.join(workspace.recordsDirectory, 'acceptance-1.json')
    const before = await readFile(recordPath, 'utf8')

    const renamed: ChangelogLedgerEntry = {
      ...entry,
      publications: [{ ...publication(1), name: 'Battlescroll 1 (renamed)' }],
    }
    await writeLedger(workspace, [renamed])
    await runChangelogCommand(commandArguments(workspace, true), createResolver({ 'acceptance-1': prior }))
    expect(await readFile(recordPath, 'utf8')).not.toBe(before)
    const artifact = await readArtifact(workspace)
    expect(artifact.publications.map(item => item.name)).toEqual(['Battlescroll 1 (renamed)'])
    await expect(runChangelogCommand(commandArguments(workspace), unusedResolver())).resolves.toBeUndefined()
  })

  it('publishes knownEntryIds for every ledger entry, including non-rules-driven acceptances', async () => {
    const workspace = await createWorkspace()
    const snapshots = [0, 1, 2].map(revision => projectionBytes(catalogAtRevision(revision)))
    const first = ledgerEntry(1, snapshots[0], snapshots[1])
    const correctionOnly = ledgerEntry(2, snapshots[1], snapshots[2], {
      cohorts: [{ name: 'dedup-2', disposition: 'correction' }],
    })
    await writeRuntime(workspace, snapshots[1])
    await writeLedger(workspace, [first])
    await runChangelogCommand(
      commandArguments(workspace, true),
      createResolver({ 'acceptance-1': snapshots[0] })
    )
    await writeRuntime(workspace, snapshots[2])
    await writeLedger(workspace, [first, correctionOnly])
    await runChangelogCommand(
      commandArguments(workspace, true),
      createResolver({ 'acceptance-2': snapshots[1] })
    )

    const artifact = await readArtifact(workspace)
    expect(artifact.revision).toBe('acceptance-2')
    expect(artifact.knownEntryIds).toEqual(['acceptance-1', 'acceptance-2'])
    expect(artifact.retainedEntryIds).toEqual(['acceptance-1'])
  })

  it('ships a checked-in seed with at least one publication-attributed rules-driven entry', async () => {
    // Guards the real published artifact, not fixtures: the changelog must launch with a genuine
    // rules-driven acceptance, and a correction-only seed is not enough.
    const artifact = JSON.parse(
      await readFile(path.join('src', 'aos4', 'generated', 'changelog', 'changelog.json'), 'utf8')
    ) as Aos4PublishedChangelog
    expect(artifact.schemaVersion).toBe(AOS4_CHANGELOG_SCHEMA_VERSION)
    expect(artifact.revision).not.toBeNull()
    expect(artifact.retainedEntryIds.length).toBeGreaterThan(0)
    expect(artifact.publications.length).toBeGreaterThan(0)
    expect(artifact.records.length).toBeGreaterThan(0)
    const publicationIds = new Set(artifact.publications.map(publication => publication.publicationId))
    artifact.publications.forEach(publication => {
      expect(publication.name).toBeTruthy()
      expect(publication.source).toBeTruthy()
    })
    artifact.records.forEach(record => {
      expect(record.attribution.kind).toBe('publication')
      if (record.attribution.kind === 'publication') {
        expect(publicationIds.has(record.attribution.publicationId)).toBe(true)
      }
      expect(record.name).toBeTruthy()
    })
    artifact.corrections.forEach(record => {
      expect(record.attribution).toEqual({ kind: 'correction' })
      expect(record.name).toBeTruthy()
    })
  })

  it('produces a valid empty artifact from an empty ledger that verifies green', async () => {
    const workspace = await createWorkspace()
    await writeRuntime(workspace, projectionBytes(buildCatalog()))
    await writeLedger(workspace, [])

    await runChangelogCommand(commandArguments(workspace, true), unusedResolver())
    expect(await readArtifact(workspace)).toEqual({
      schemaVersion: AOS4_CHANGELOG_SCHEMA_VERSION,
      revision: null,
      knownEntryIds: [],
      retainedEntryIds: [],
      retainedPublicationIds: [],
      publications: [],
      records: [],
      corrections: [],
    })

    const io = unusedResolver()
    await expect(runChangelogCommand(commandArguments(workspace), io)).resolves.toBeUndefined()
    expect(io.resolvePriorProjectionBytes).not.toHaveBeenCalled()
  })
})

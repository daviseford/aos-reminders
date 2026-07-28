import { readFile } from 'node:fs/promises'
import path from 'node:path'
import { vi } from 'vitest'
import { artifactChecksum, type ArtifactManifestEntry } from '../../aos4/data'
import {
  WAHAPEDIA_EXPORT_FILES,
  decodeWahapediaExports,
  type WahapediaExportFileName,
  type WahapediaExportInputs,
} from '../../aos4/data/wahapedia'
import { artifactId, rulesContextId, sourceRecordId, validateCatalog } from '../../aos4/domain'
import {
  buildAos4Corpus,
  createCorpusIdentityRegistry,
  validateGenerationIntegrity,
  type CorpusReview,
} from '../../aos4/generate'
import {
  assertAcceptedCorpusCertification,
  assertCorpusWriteWorkflow,
  parseCorpusCommandArguments,
} from '../../aos4/generate/corpusCommand'
import { resolveSelection } from '../../aos4/select'

const fixtureRoot = path.join(process.cwd(), 'src', 'tests', 'fixtures', 'aos4', 'wahapedia')

const artifact = (file: WahapediaExportFileName, bytes: Uint8Array): ArtifactManifestEntry => ({
  requestUrl: `https://wahapedia.ru/aos4/${file}`,
  finalUrl: `https://wahapedia.ru/aos4/${file}`,
  redirectChain: [],
  retrievedAt: '2026-07-29T12:00:00.000Z',
  adapterVersion: 'wahapedia-export/1',
  mediaType: 'text/csv',
  byteLength: bytes.byteLength,
  checksum: artifactChecksum(bytes),
})

const loadInputs = async (): Promise<WahapediaExportInputs> => {
  const entries = await Promise.all(
    WAHAPEDIA_EXPORT_FILES.map(async file => {
      const bytes = new Uint8Array(await readFile(path.join(fixtureRoot, file)))
      return [file, { bytes, artifact: artifact(file, bytes) }] as const
    })
  )
  return Object.fromEntries(entries) as WahapediaExportInputs
}

const review: CorpusReview = {
  schemaVersion: 1,
  revision: 'fixture-2026-07-29',
  generatedAt: '2026-07-29T12:00:00.000Z',
  rulesContext: {
    id: rulesContextId('90000000-0000-4000-8000-000000000001'),
    name: 'AoS 4 fixture',
    mode: 'standard',
    status: 'current',
  },
  approvedFactionIds: ['SCE'],
  decoderDiagnosticPolicies: [],
  normalizationDiagnosticPolicies: [],
  ignoredSourceRecords: [],
  timingOverrides: [],
  officialDocuments: [],
}

describe('AoS 4 corpus generation', () => {
  it('keeps candidate preparation available while accepted workflows fail closed', async () => {
    const candidate = parseCorpusCommandArguments(['--candidate', '--write'])
    expect(candidate).toMatchObject({ candidate: true, write: true })
    expect(() => assertCorpusWriteWorkflow(true, { candidate: false, write: true })).toThrow(
      'explicit --candidate workflow'
    )
    await expect(
      assertAcceptedCorpusCertification(true, false, async () => ({ ok: false, status: 'stale' }))
    ).rejects.toThrow('certification is stale')

    const check = vi.fn(async () => ({ ok: false, status: 'stale' as const }))
    await expect(assertAcceptedCorpusCertification(true, true, check)).resolves.toBeUndefined()
    expect(check).not.toHaveBeenCalled()
  })

  it('builds a deterministic, source-complete faction catalog from reviewed exports', async () => {
    const decoded = decodeWahapediaExports(await loadInputs())
    expect(decoded.diagnostics).toEqual([])

    const identities = createCorpusIdentityRegistry(decoded.dataset, review)
    const first = buildAos4Corpus(decoded, identities, review)
    const reordered = buildAos4Corpus(
      {
        dataset: {
          ...decoded.dataset,
          factions: [...decoded.dataset.factions].reverse(),
          sources: [...decoded.dataset.sources].reverse(),
          warscrolls: [...decoded.dataset.warscrolls].reverse(),
          warscrollAbilities: [...decoded.dataset.warscrollAbilities].reverse(),
          warscrollWeapons: [...decoded.dataset.warscrollWeapons].reverse(),
          warscrollKeywords: [...decoded.dataset.warscrollKeywords].reverse(),
          warscrollBases: [...decoded.dataset.warscrollBases].reverse(),
          warscrollOrganisation: [...decoded.dataset.warscrollOrganisation].reverse(),
          regimentOfRenownFactions: [...decoded.dataset.regimentOfRenownFactions].reverse(),
          factionAbilityTypes: [...decoded.dataset.factionAbilityTypes].reverse(),
          factionAbilitySubtypes: [...decoded.dataset.factionAbilitySubtypes].reverse(),
          factionAbilities: [...decoded.dataset.factionAbilities].reverse(),
        },
        diagnostics: [...decoded.diagnostics].reverse(),
      },
      identities,
      review
    )

    expect(first.diagnostics).toEqual([])
    expect(first).toEqual(reordered)
    expect(validateCatalog(first.catalog)).toEqual([])
    expect(validateGenerationIntegrity(first.catalog, first.dispositions)).toMatchObject({
      ok: true,
      issues: [],
    })
    expect(first.summary).toMatchObject({
      status: 'strict-pass',
      factions: 1,
      warscrolls: 1,
      abilities: 2,
      weapons: 2,
    })
  })

  it('connects faction choices to their reminder-bearing content', async () => {
    const decoded = decodeWahapediaExports(await loadInputs())
    const identities = createCorpusIdentityRegistry(decoded.dataset, review)
    const result = buildAos4Corpus(decoded, identities, review)
    const faction = result.catalog.entities.find(entity => entity.kind === 'faction')!
    const selection = resolveSelection(result.catalog, {
      explicitIds: [faction.id],
      rulesContextId: review.rulesContext.id,
    })

    expect(selection.diagnostics).toEqual([])
    expect(
      selection.availableIds.map(id => result.catalog.entities.find(entity => entity.id === id)?.kind)
    ).toContain('warscroll')
    expect(
      selection.selectedIds.map(id => result.catalog.entities.find(entity => entity.id === id)?.kind)
    ).toContain('content-group')

    const warscroll = result.catalog.entities.find(entity => entity.kind === 'warscroll')!
    const selected = resolveSelection(result.catalog, {
      explicitIds: [faction.id, warscroll.id],
      rulesContextId: review.rulesContext.id,
    })
    expect(
      selected.selectedIds.map(id => result.catalog.entities.find(entity => entity.id === id)?.kind)
    ).toEqual(expect.arrayContaining(['battle-profile', 'ability', 'weapon']))
  })

  it('auto-selects reviewed universal rules without exposing a fake faction or builder choice', async () => {
    const decoded = decodeWahapediaExports(await loadInputs())
    const htmlArtifact: ArtifactManifestEntry = {
      requestUrl: 'https://wahapedia.ru/aos4/the-rules/the-core-rules/',
      finalUrl: 'https://wahapedia.ru/aos4/the-rules/the-core-rules/',
      redirectChain: [],
      retrievedAt: review.generatedAt,
      adapterVersion: 'wahapedia-html/1',
      mediaType: 'text/html',
      byteLength: 100,
      checksum: 'c'.repeat(64),
    }
    const rulesMeta = (section: string) => ({
      file: 'WahapediaRules.html' as const,
      row: 0,
      artifactId: artifactId(htmlArtifact.checksum),
      sourceRecordId: sourceRecordId('wahapedia', `fixture:rules:${section}`),
      recordChecksum: `${section.length}`.padStart(64, 'd'),
      section,
      rulesContextKinds: ['standard' as const],
    })
    decoded.dataset.htmlArtifacts = [htmlArtifact]
    decoded.dataset.generalRulesPages = [
      {
        id: 'core',
        title: 'The Core Rules',
        application: 'universal',
        reason: 'The reviewed core-rules page applies to every army in this context.',
        meta: rulesMeta('page'),
      },
    ]
    decoded.dataset.generalRuleGroups = [
      {
        id: 'movement',
        pageId: 'core',
        name: 'Universal Core Abilities',
        application: 'universal',
        reason: 'Core rules apply to every army.',
        meta: rulesMeta('group'),
      },
    ]
    decoded.dataset.generalRuleAbilities = [
      {
        groupId: 'movement',
        actor: 'unit',
        line: '1',
        name: 'Normal Move',
        descriptionHtml: '<b>Effect:</b> The unit can move.',
        legendHtml: '',
        abilityType: '',
        isReaction: false,
        conditionHtml: 'Your Movement Phase',
        keywordsHtml: '',
        abilityPhase: 'Your Movement Phase',
        pointsType: '',
        points: '',
        meta: rulesMeta('ability'),
      },
    ]

    const identities = createCorpusIdentityRegistry(decoded.dataset, review)
    const result = buildAos4Corpus(decoded, identities, review)
    const faction = result.catalog.entities.find(entity => entity.kind === 'faction')!
    const selection = resolveSelection(result.catalog, {
      explicitIds: [faction.id],
      rulesContextId: review.rulesContext.id,
    })

    expect(result.diagnostics).toEqual([])
    expect(result.catalog.entities.filter(entity => entity.kind === 'faction')).toHaveLength(1)
    expect(
      selection.selectedIds
        .map(id => result.catalog.entities.find(entity => entity.id === id))
        .filter(entity => entity?.kind === 'ability')
        .map(entity => entity?.name)
    ).toContain('Normal Move')
    expect(
      selection.availableIds
        .map(id => result.catalog.entities.find(entity => entity.id === id))
        .map(entity => entity?.name)
    ).not.toContain('The Core Rules')
  })

  it('preserves commas inside official notes while retaining semicolon-delimited note boundaries', async () => {
    const decoded = decodeWahapediaExports(await loadInputs())
    decoded.dataset.warscrolls[0].notesHtml =
      'This Hero can join Alpha, Beta or Gamma; This unit cannot be reinforced.'
    const identities = createCorpusIdentityRegistry(decoded.dataset, review)
    const result = buildAos4Corpus(decoded, identities, review)
    const profile = result.catalog.entities.find(entity => entity.kind === 'battle-profile')

    expect(profile).toMatchObject({
      kind: 'battle-profile',
      notes: expect.arrayContaining([
        'This Hero can join Alpha, Beta or Gamma',
        'This unit cannot be reinforced.',
      ]),
    })
  })

  it('preserves the source reinforcement restriction in the battle-profile notes', async () => {
    const decoded = decodeWahapediaExports(await loadInputs())
    decoded.dataset.warscrolls[0].notesHtml = ''
    decoded.dataset.warscrolls[0].noReinforced = true
    const identities = createCorpusIdentityRegistry(decoded.dataset, review)
    const result = buildAos4Corpus(decoded, identities, review)
    const profile = result.catalog.entities.find(entity => entity.kind === 'battle-profile')

    expect(profile).toMatchObject({
      kind: 'battle-profile',
      notes: expect.arrayContaining(['This unit cannot be reinforced.']),
    })
  })

  it('applies a narrow weapon profile correction only when it cites accepted official evidence', async () => {
    const decoded = decodeWahapediaExports(await loadInputs())
    const target = decoded.dataset.warscrollWeapons[0]
    const officialChecksum = 'f'.repeat(64)
    const officialSourceRecordId = sourceRecordId('games-workshop', `${officialChecksum}:page:1`)
    const reviewed: CorpusReview = {
      ...review,
      officialDocuments: [
        {
          title: 'Official weapon profile fixture',
          documentKind: 'reference',
          artifact: {
            requestUrl: 'https://assets.warhammer-community.com/fixture.pdf',
            finalUrl: 'https://assets.warhammer-community.com/fixture.pdf',
            redirectChain: [],
            retrievedAt: '2026-07-29T12:00:00.000Z',
            adapterVersion: 'games-workshop-pdf/1',
            mediaType: 'application/pdf',
            byteLength: 1,
            checksum: officialChecksum,
          },
          sourceRecords: [
            {
              id: officialSourceRecordId,
              page: 1,
              recordChecksum: 'e'.repeat(64),
            },
          ],
        },
      ],
      weaponProfileOverrides: [
        {
          sourceRecordId: target.meta.sourceRecordId,
          profile: { hit: '2+', wound: '3+', rend: '-', damage: 'D3' },
          reason: 'The official warscroll corrects the secondary-source profile.',
          officialSourceRecordIds: [officialSourceRecordId],
        },
      ],
    }
    const identities = createCorpusIdentityRegistry(decoded.dataset, reviewed)
    const result = buildAos4Corpus(decoded, identities, reviewed)
    const weapon = result.catalog.entities.find(
      entity =>
        entity.kind === 'weapon' &&
        entity.sourceRefs.some(reference => reference.sourceRecordId === target.meta.sourceRecordId)
    )

    expect(result.diagnostics).toEqual([])
    expect(weapon).toMatchObject({
      kind: 'weapon',
      profile: {
        attacks: target.attacks,
        hit: '2+',
        wound: '3+',
        rend: '-',
        damage: 'D3',
      },
      sourceRefs: expect.arrayContaining([
        expect.objectContaining({ sourceRecordId: officialSourceRecordId }),
      ]),
    })
  })

  it('rejects a weapon profile override that is not bound to source and official evidence', async () => {
    const decoded = decodeWahapediaExports(await loadInputs())
    const reviewed: CorpusReview = {
      ...review,
      weaponProfileOverrides: [
        {
          sourceRecordId: sourceRecordId('wahapedia', 'missing-weapon'),
          profile: { wound: '3+' },
          reason: '',
          officialSourceRecordIds: [],
        },
      ],
    }
    const identities = createCorpusIdentityRegistry(decoded.dataset, reviewed)
    const result = buildAos4Corpus(decoded, identities, reviewed)

    expect(result.diagnostics).toContainEqual(
      expect.objectContaining({
        code: 'invalid-review',
        subject: sourceRecordId('wahapedia', 'missing-weapon'),
      })
    )
    expect(result.summary.status).toBe('blocked')
  })

  it('fails closed when a source diagnostic has not been reviewed', async () => {
    const decoded = decodeWahapediaExports(await loadInputs())
    decoded.diagnostics.push({
      code: 'missing-faction',
      severity: 'error',
      file: 'Warscrolls_RoRfactions.csv',
      row: 2,
      field: 'faction_id',
      value: 'UNKNOWN',
      message: 'Missing faction UNKNOWN',
    })
    const identities = createCorpusIdentityRegistry(decoded.dataset, review)

    expect(buildAos4Corpus(decoded, identities, review).diagnostics).toContainEqual(
      expect.objectContaining({
        code: 'unreviewed-source-diagnostic',
        severity: 'error',
      })
    )
  })
})

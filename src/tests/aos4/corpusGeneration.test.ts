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
import { rulesContextId, validateCatalog } from '../../aos4/domain'
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

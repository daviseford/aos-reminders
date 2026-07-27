import candidateManifestJson from '../../../data/aos4/manifests/candidate-2026-07-27.json'
import candidateReport from '../../../data/aos4/reports/candidate-2026-07-27-summary.json'
import cohortIndexReport from '../../../data/aos4/reports/cohort-index-2026-07-27.json'
import stormcastCohortReport from '../../../data/aos4/reports/cohort-stormcast-2026-07-27-summary.json'
import officialRulesReport from '../../../data/aos4/reports/official-rules-2026-07-27-summary.json'
import identityRegistryJson from '../../../data/aos4/identities/representative.json'
import { sourceRecordId, type Ability, type Aos4Catalog } from '../../aos4/domain'
import type { ArtifactManifest } from '../../aos4/data'
import {
  createRuntimeProjection,
  serializeAuditCatalog,
  serializeRuntimeProjection,
  validateGenerationIntegrity,
  validateIdentityRegistry,
  type IdentityRegistry,
} from '../../aos4/generate'
import { AOS4_CATALOG, AOS4_GENERATION_AUDIT } from '../../aos4/generated'
import type { ReconciliationDiagnostic } from '../../aos4/reconcile'

const candidateManifest = candidateManifestJson as ArtifactManifest
const identityRegistry = identityRegistryJson as IdentityRegistry

const copyCatalog = (changes: Partial<Aos4Catalog> = {}): Aos4Catalog => ({
  ...AOS4_CATALOG,
  ...changes,
})

describe('AoS 4 catalog generation integrity', () => {
  it('accepts the representative catalog only when every source record is consumed', () => {
    const result = validateGenerationIntegrity(AOS4_CATALOG)

    expect(result).toEqual({
      ok: true,
      consumedSourceRecordIds: AOS4_CATALOG.sourceRecords
        .map(record => record.id)
        .sort((left, right) => left.localeCompare(right)),
      issues: [],
    })
  })

  it('requires an explicit, non-conflicting disposition for unconsumed source records', () => {
    const orphan = {
      ...AOS4_CATALOG.sourceRecords[0],
      id: sourceRecordId('fixture', 'unconsumed-catalog-integrity-record'),
    }
    const catalog = copyCatalog({
      sourceRecords: [...AOS4_CATALOG.sourceRecords, orphan],
    })

    expect(validateGenerationIntegrity(catalog).issues).toContainEqual(
      expect.objectContaining({
        code: 'unconsumed-source-record',
        subject: orphan.id,
      })
    )
    expect(
      validateGenerationIntegrity(catalog, [
        {
          sourceRecordId: orphan.id,
          status: 'ignored',
          reason: 'Reviewed fixture outside the representative cohort.',
        },
      ])
    ).toMatchObject({ ok: true, issues: [] })
    expect(
      validateGenerationIntegrity(catalog, [
        {
          sourceRecordId: orphan.id,
          status: 'unresolved',
          reason: 'Identity requires human review.',
        },
      ]).issues
    ).toContainEqual(
      expect.objectContaining({
        code: 'unresolved-source-record',
        subject: orphan.id,
      })
    )
  })

  it('blocks unknown runtime timing, unsafe HTML, and reconciliation errors', () => {
    const entities = structuredClone(AOS4_CATALOG.entities)
    const ability = entities.find((entity): entity is Ability => entity.kind === 'ability')!
    ability.timings[0].window = { kind: 'unknown' }
    ability.text.effect = '<strong>Unnormalized effect</strong>'
    const reconciliationDiagnostics: ReconciliationDiagnostic[] = [
      {
        code: 'unmatched-entity',
        severity: 'error',
        message: 'Candidate fact could not be linked.',
      },
    ]

    expect(
      validateGenerationIntegrity(copyCatalog({ entities }), [], reconciliationDiagnostics).issues.map(
        issue => issue.code
      )
    ).toEqual(expect.arrayContaining(['unknown-timing', 'unsafe-html', 'reconciliation-error']))
  })

  it('blocks unknown-authority fixtures from becoming runtime content', () => {
    const sourceArtifacts = structuredClone(AOS4_CATALOG.sourceArtifacts)
    sourceArtifacts[0].authority = {
      kind: 'unknown',
      raw: 'repository test fixture',
    }

    expect(validateGenerationIntegrity(copyCatalog({ sourceArtifacts })).issues).toContainEqual(
      expect.objectContaining({
        code: 'untrusted-runtime-source',
        severity: 'error',
      })
    )
  })

  it('keeps one stable canonical identity and at least one source alias per entity', () => {
    expect(validateIdentityRegistry(identityRegistry)).toEqual([])
    expect(
      identityRegistry.entries
        .map(entry => entry.canonicalId)
        .sort((left, right) => left.localeCompare(right))
    ).toEqual(AOS4_CATALOG.entities.map(entity => entity.id).sort((left, right) => left.localeCompare(right)))
  })

  it('records the complete live acquisition as an unaccepted review candidate', () => {
    expect(candidateManifest).toMatchObject({ schemaVersion: 1 })
    expect(candidateManifest.artifacts).toHaveLength(14)
    expect(
      candidateManifest.artifacts.filter(artifact => artifact.requestUrl.startsWith('https://wahapedia.ru/'))
    ).toHaveLength(13)
    expect(
      candidateManifest.artifacts.filter(artifact => artifact.mediaType === 'application/pdf')
    ).toHaveLength(1)
    candidateManifest.artifacts.forEach(artifact => {
      expect(artifact.requestUrl).toMatch(/^https:\/\//)
      expect(artifact.finalUrl).toMatch(/^https:\/\//)
      expect(artifact.checksum).toMatch(/^[0-9a-f]{64}$/)
      expect(artifact.byteLength).toBeGreaterThan(0)
    })
    expect(candidateReport).toMatchObject({
      status: 'candidate-review-required',
      normalization: {
        unresolvedTimings: 0,
        sourcePhaseFallbacks: 2,
        sourceTimingCorrections: 8,
        reactionFlagMismatches: 13,
      },
      coverage: {
        approvedCorpus: 'not-yet-reviewed',
        candidateManifestAccepted: false,
      },
    })
    expect(candidateReport.timingReview.sourcePhaseFallbackSourceRecordIds).toHaveLength(2)
    expect(candidateReport.timingReview.sourceTimingCorrectionSourceRecordIds).toHaveLength(8)
    expect(
      candidateReport.timingReview.sourcePhaseFallbackSourceRecordIds.concat(
        candidateReport.timingReview.sourceTimingCorrectionSourceRecordIds
      )
    ).toEqual(
      expect.arrayContaining([
        expect.stringMatching(/^source-record:wahapedia:/),
      ])
    )
  })

  it('keeps the full Stormcast cohort blocked and outside the runtime catalog', () => {
    expect(stormcastCohortReport).toMatchObject({
      status: 'blocked',
      normalization: {
        unresolvedTimings: 0,
        sourcePhaseFallbacks: 0,
        sourceTimingCorrections: 0,
        reactionFlagMismatches: 2,
      },
      coverage: {
        reactionFlagOfficialEvidence: 'supported',
        officialReconciliation: 'not-yet-reviewed',
        candidateManifestAccepted: false,
        runtimeCatalogChanged: false,
      },
    })
    expect(stormcastCohortReport.blockingSourceRecordIds).toHaveLength(2)
  })

  it('inventories every faction without treating reviewable cohorts as accepted', () => {
    expect(cohortIndexReport).toMatchObject({
      status: 'candidate-review-required',
      totals: {
        factions: 28,
        blockedFactions: 11,
        reviewableFactions: 17,
        decoderErrors: 2,
        unresolvedTimings: 0,
        sourcePhaseFallbacks: 2,
        sourceTimingCorrections: 8,
        reactionFlagMismatches: 13,
      },
      coverage: {
        candidateManifestAccepted: false,
        runtimeCatalogChanged: false,
      },
    })
    expect(cohortIndexReport.cohorts).toHaveLength(28)
    expect(
      cohortIndexReport.cohorts.filter(cohort => cohort.status === 'blocked')
    ).toHaveLength(11)
  })

  it('records official structural evidence without accepting source data', () => {
    expect(officialRulesReport).toMatchObject({
      status: 'candidate-review-required',
      coverage: {
        candidateManifestAccepted: false,
        runtimeCatalogChanged: false,
        domainModelChanged: true,
      },
    })
    expect(officialRulesReport.artifacts).toHaveLength(2)
    expect(officialRulesReport.structuralEvidence).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          subject: 'phase-independent-reaction-window',
          status: 'supported',
        }),
        expect.objectContaining({
          subject: 'stormcast-ruination-reaction',
          status: 'supported',
        }),
      ])
    )
    expect(JSON.stringify(officialRulesReport)).not.toMatch(/Use Reactions|Declare step/)
  })

  it('emits deterministic runtime JSON without audit-only source payload metadata', () => {
    const projection = createRuntimeProjection(AOS4_CATALOG, AOS4_GENERATION_AUDIT.attribution)
    const runtime = serializeRuntimeProjection(projection)
    const reordered = copyCatalog({
      rulesContexts: [...AOS4_CATALOG.rulesContexts].reverse(),
      sourceArtifacts: [...AOS4_CATALOG.sourceArtifacts].reverse(),
      sourceRecords: [...AOS4_CATALOG.sourceRecords].reverse(),
      entities: [...AOS4_CATALOG.entities].reverse(),
      relationships: [...AOS4_CATALOG.relationships].reverse(),
    })

    expect(
      serializeRuntimeProjection(createRuntimeProjection(reordered, AOS4_GENERATION_AUDIT.attribution))
    ).toBe(runtime)
    expect(projection.attribution).toBe('Powered by Wahapedia')
    expect(projection.sourceLinks).toHaveLength(AOS4_CATALOG.sourceRecords.length)
    expect(runtime).not.toMatch(
      /"sourceArtifacts"|"sourceRecords"|"checksum"|"recordChecksum"|"retrievedAt"|"transformation"/
    )
    expect(runtime.length).toBeLessThan(serializeAuditCatalog(AOS4_CATALOG).length)
  })
})

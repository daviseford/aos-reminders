import { readFileSync } from 'node:fs'
import path from 'node:path'
import {
  armyFactions,
  sourceRecordId,
  validateCatalog,
  type Ability,
  type Aos4Catalog,
  type CanonicalId,
  type Faction,
  type Warscroll,
} from '../../aos4/domain'
import type { ArtifactManifest } from '../../aos4/data'
import {
  createRuntimeProjection,
  serializeAuditCatalog,
  serializeRuntimeProjection,
  validateGenerationIntegrity,
  validateIdentityRegistry,
  type IdentityRegistry,
} from '../../aos4/generate'
import {
  AOS4_CATALOG,
  AOS4_GENERATION_AUDIT,
  AOS4_RUNTIME_PROJECTION,
  AOS4_SOURCE_RECORD_INDEXES,
} from '../../aos4/generated'
import { AOS4_FULL_CATALOG } from '../support/aos4FullCatalog'
import type { ReconciliationDiagnostic } from '../../aos4/reconcile'
import { resolveSelection } from '../../aos4/select'

interface CorpusSummaryReport {
  status: 'strict-pass' | 'blocked'
  summary: {
    factions: number
    warscrolls: number
    battleProfiles: number
    abilities: number
    weapons: number
    sourceArtifacts: number
    sourceRecords: number
    ignoredSourceRecords: number
  }
  integrity: {
    consumedSourceRecords: number
    dispositions: Array<{ sourceRecordId: string; status: string; reason: string }>
    issues: unknown[]
    supersededSourceRecords: {
      count: number
      checksum: string
      reason: string
    }
  }
  sourceDiagnostics: {
    reviewed: number
    byCode: Record<string, number>
  }
}

interface OfficialBattleProfileReport {
  records: Array<{
    status: 'effective' | 'superseded'
    disposition: 'applied-to-runtime' | 'profile-only' | 'structured-reference' | 'superseded'
    fact: {
      kind: 'unit' | 'roster-option' | 'regiment-of-renown'
      factChecksum: string
      sourceRecordId: string
    }
  }>
  summary: {
    records: number
    effective: number
    superseded: number
    units: number
    rosterOptions: number
    regimentsOfRenown: number
    appliedToRuntime: number
    profileOnly: number
    structuredReference: number
  }
}

const dataPath = (...segments: string[]): string => path.join(process.cwd(), 'data', 'aos4', ...segments)

const readJson = <T>(...segments: string[]): T => JSON.parse(readFileSync(dataPath(...segments), 'utf8')) as T

/**
 * The certified whole, read straight off disk rather than through anything the split produced.
 *
 * `runtime.json` is pinned by checksum in accepted certification evidence (see
 * `corpusArtifacts.test.ts`), and it still carries both each entity's `sourceRecordIndexes` and the
 * full `sourceRecords`. That makes it the one description of provenance that neither the side table
 * nor the reattachment helper can influence — so a correspondence check against it can actually fail.
 */
const certifiedRuntime = JSON.parse(
  readFileSync(path.join(process.cwd(), 'src', 'aos4', 'generated', 'corpus', 'runtime.json'), 'utf8')
) as {
  entities: Array<{ id: CanonicalId; sourceRecordIndexes: number[] }>
  sourceRecords: Array<{ id: string }>
}

const acceptedManifest = readJson<ArtifactManifest>('manifests', 'accepted-2026-10-27.json')
const identityRegistry = readJson<IdentityRegistry>('identities', 'corpus.json')
const report = readJson<CorpusSummaryReport>('reports', 'corpus-2026-10-27-summary.json')
const officialBattleProfiles = readJson<OfficialBattleProfileReport>(
  'catalog',
  'official-battle-profiles.json'
)

const copyCatalog = (changes: Partial<Aos4Catalog> = {}): Aos4Catalog => ({
  ...AOS4_FULL_CATALOG,
  ...changes,
})

describe('AoS 4 catalog provenance after the core/sources split', () => {
  it('ships a render catalog that carries no source records at all', () => {
    expect(AOS4_CATALOG.sourceRecords).toEqual([])
    expect(AOS4_CATALOG.sourceArtifacts).toEqual([])
    expect(AOS4_CATALOG.entities.every(entity => entity.sourceRefs.length === 0)).toBe(true)
  })

  it('keeps a side-table entry for every entity, matching the records that entity cites', () => {
    expect(AOS4_CATALOG.entities).toHaveLength(12_173)
    expect(AOS4_SOURCE_RECORD_INDEXES.size).toBe(AOS4_CATALOG.entities.length)
    // Every kind, not only the 5,121 abilities a reminder cites: an ability-keyed table could not
    // back the provenance guarantee for the other 6,429.
    expect(
      AOS4_CATALOG.entities.filter(entity => !AOS4_SOURCE_RECORD_INDEXES.get(entity.id)?.length)
    ).toEqual([])
    expect(new Set(AOS4_CATALOG.entities.map(entity => entity.kind)).size).toBeGreaterThan(1)

    /*
     * Both halves against the certified projection, not against each other. Comparing the side table
     * to the catalog it built would be a tautology: each entry names the indexes the certified
     * projection recorded for that entity, and reattaching them reproduces the record IDs it cited.
     * A bug in either the table or the reattachment helper fails here.
     */
    const reattachedById = new Map(AOS4_FULL_CATALOG.entities.map(entity => [entity.id, entity]))
    expect(certifiedRuntime.entities).toHaveLength(AOS4_CATALOG.entities.length)
    certifiedRuntime.entities.forEach(certified => {
      expect(AOS4_SOURCE_RECORD_INDEXES.get(certified.id) ?? []).toEqual(certified.sourceRecordIndexes)
      expect(reattachedById.get(certified.id)?.sourceRefs.map(reference => reference.sourceRecordId)).toEqual(
        certified.sourceRecordIndexes.map(index => certifiedRuntime.sourceRecords[index].id)
      )
    })
  })

  /**
   * The catalog a browser actually renders from. Every other case validates the reattached one, so
   * without this a structural regression in the shipped half — a dangling rules context, a
   * relationship pointing at nothing — would only be caught once provenance was glued back on.
   *
   * The expected shape is exactly one issue per entity and no other code: `sourceRefs` is empty by
   * design here, and the deferred citations are what `AOS4_SOURCE_RECORD_INDEXES` carries instead.
   */
  it('ships a render catalog that is structurally valid apart from the provenance it defers', () => {
    const issues = validateCatalog(AOS4_CATALOG)

    expect(new Set(issues.map(issue => issue.code))).toEqual(new Set(['missing-entity-provenance']))
    expect(issues).toHaveLength(AOS4_CATALOG.entities.length)
  })

  it('reports no missing provenance for any of the 12,173 entities', () => {
    const provenance = validateCatalog(AOS4_FULL_CATALOG).filter(
      issue => issue.code === 'missing-entity-provenance'
    )
    expect(provenance).toEqual([])
    // Inverted, the same check has to fail — otherwise it is passing on an empty catalog rather
    // than on complete provenance (R16).
    expect(
      validateCatalog({
        ...AOS4_FULL_CATALOG,
        entities: AOS4_FULL_CATALOG.entities.map(entity => ({ ...entity, sourceRefs: [] })),
      }).filter(issue => issue.code === 'missing-entity-provenance')
    ).toHaveLength(12_173)
  })
})

describe('AoS 4 catalog generation integrity', () => {
  it('ships a strict, fully consumed runtime projection of the accepted corpus', () => {
    expect(validateCatalog(AOS4_FULL_CATALOG)).toEqual([])
    // The runtime projection only carries referenced source records, so the six ignored
    // example-card records are absent here and everything present is consumed.
    expect(validateGenerationIntegrity(AOS4_FULL_CATALOG)).toEqual({
      ok: true,
      consumedSourceRecordIds: AOS4_FULL_CATALOG.sourceRecords
        .map(record => record.id)
        .sort((left, right) => left.localeCompare(right)),
      issues: [],
    })
    expect(AOS4_FULL_CATALOG.sourceRecords).toHaveLength(report.integrity.consumedSourceRecords)
    expect(report).toMatchObject({
      status: 'strict-pass',
      summary: {
        factions: 29,
        // Corpus 2026-10-20b (#2087): matched-play Khazalite Holds from six provisional BSData
        // catalogues; the three ignored records are its translated cards (Grimnir's Wrath Will Burn
        // Bright!, Warrior-kings, Transport Duardin), which stay absent until an English source.
        // Corpus 2026-10-26 also ignores the Runewright's Rhythmic Hammering, whose timing is
        // source-blocked. Corpus 2026-10-27 (#1757) adds three Wahapedia Spearheads, two historical
        // Daughters of Khaine warscrolls, The Emberwatch and the 2024-25 handbook's Unbind.
        warscrolls: 1362,
        battleProfiles: 1054,
        abilities: 5443,
        weapons: 2363,
        sourceArtifacts: 252,
        sourceRecords: 21153,
        ignoredSourceRecords: 21162,
      },
      integrity: {
        consumedSourceRecords: 21143,
        issues: [],
        supersededSourceRecords: {
          count: 21152,
          checksum: '9cb033a8ebacdaa63875dd2316ed6412ff5107b4d60b67be92be27ec189bde42',
        },
      },
    })
    // Six ignored dispositions are exactly the illustrative core-rules example ability cards
    // (customer report 2026-07-31). Corpus 2026-10-20b (#2087) ignores three more: the Khazalite
    // Holds cards translated from the French edition, which stay absent (not supported) until an
    // English source prints them. Everything else stays fully consumed.
    const translated = [
      'source-record:bsdata:2427ed7e1384c24bb86041137de36947391f9680b5baa35d1c0e9618e5cbfd0d%3Aoption%3Abattle-traits-throngankor-alliance%3Aability%3A4',
      'source-record:bsdata:2aa35a3fd653cac60fe2a6375c207e9b84854025bbc89be20cda6946f0dc038d%3Aunit%3Aauric-runefather-on-magmadroth%3Aability%3A2',
      'source-record:bsdata:299110685cdbabc36b3b7b8bae6650a391de8f971d244be79fc902e309f4ef4a%3Aoption%3Abattle-traits-khazalite-holds%3Aability%3A8',
    ]
    // Corpus 2026-10-26: Rhythmic Hammering prints no timing label and no official card exists.
    const sourceBlocked = [
      'source-record:bsdata:2aa35a3fd653cac60fe2a6375c207e9b84854025bbc89be20cda6946f0dc038d%3Aunit%3Arunewright%3Aability%3A2',
    ]
    expect(report.integrity.dispositions).toHaveLength(10)
    report.integrity.dispositions.forEach(disposition => {
      expect(disposition.status).toBe('ignored')
      if (translated.includes(disposition.sourceRecordId)) {
        expect(disposition.reason).toMatch(/translated .*French edition/)
        return
      }
      if (sourceBlocked.includes(disposition.sourceRecordId)) {
        expect(disposition.reason).toMatch(/timing is source-blocked/)
        return
      }
      expect(disposition.reason).toMatch(/example/i)
      expect(disposition.sourceRecordId).toMatch(/rules-ability%3A(?:Spells|Prayers)%3Aability/)
    })
    expect(
      report.integrity.dispositions.filter(disposition => translated.includes(disposition.sourceRecordId))
    ).toHaveLength(3)
    ;[...translated, ...sourceBlocked].forEach(id =>
      expect(AOS4_FULL_CATALOG.sourceRecords.map(record => record.id)).not.toContain(id)
    )
    expect(report.integrity.supersededSourceRecords.reason.trim()).not.toBe('')
  })

  /**
   * Manifestations are a category of unit, not an army (issue #1791).
   *
   * Wahapedia files them under an `Endless Spells` container row, and the catalog has to hand them
   * to the armies that can take them rather than to that container — which offers nothing at all,
   * so it stays out of the selector (#1796). That leaves 26 of the 27 armies: Bonesplitterz is the
   * one that misses out, and correctly, since it exists only in Legends while this content is
   * current-standard and seasonal.
   */
  it('offers the universal manifestation lores and their warscrolls to the armies', () => {
    const factionIds = new Set(
      AOS4_FULL_CATALOG.entities.filter(entity => entity.kind === 'faction').map(entity => entity.id)
    )
    const offeringFactionCount = (name: string, kind: 'content-group' | 'warscroll') => {
      const targets = AOS4_FULL_CATALOG.entities.filter(
        entity => entity.kind === kind && entity.name === name
      )
      expect(targets).toHaveLength(1)
      return new Set(
        AOS4_FULL_CATALOG.relationships
          .filter(
            relationship =>
              relationship.kind === 'offers' &&
              relationship.to === targets[0].id &&
              factionIds.has(relationship.from as never)
          )
          .map(relationship => relationship.from)
      ).size
    }

    const lores = [
      'Aetherwrought Machineries',
      'Forbidden Power',
      'Morbid Conjuration',
      'Primal Energy',
      'Twilit Sorceries',
    ]
    lores.forEach(lore => expect(offeringFactionCount(lore, 'content-group')).toBe(27))
    // One warscroll from each lore, so a change that drops a section is visible here.
    const warscrolls = [
      'Chronomantic Cogs',
      'Horrorghast',
      'Krondspine Incarnate of Ghur',
      'Purple Sun of Shyish',
      'Emerald Lifeswarm',
      'Umbral Spellportal',
    ]
    warscrolls.forEach(warscroll => expect(offeringFactionCount(warscroll, 'warscroll')).toBe(27))
    /**
     * The container offers no warscroll of its own, which is the thing `armyFactions` reads to keep
     * it out of the selector. It still receives the universal rules modules every faction row does.
     */
    const container = AOS4_FULL_CATALOG.entities.find(
      entity => entity.kind === 'faction' && entity.name === 'Endless Spells'
    )
    expect(container).toBeDefined()
    // Wide element type: TS 5.5+ infers a type predicate for the filter, which would narrow the
    // Set to CanonicalId<'warscroll'> and reject the relationship's union-typed endpoint.
    const warscrollIds = new Set<CanonicalId>(
      AOS4_FULL_CATALOG.entities.filter(entity => entity.kind === 'warscroll').map(entity => entity.id)
    )
    expect(
      AOS4_FULL_CATALOG.relationships.filter(
        relationship => relationship.from === container?.id && warscrollIds.has(relationship.to)
      )
    ).toEqual([])
    expect(armyFactions(AOS4_FULL_CATALOG).map(faction => faction.name)).not.toContain('Endless Spells')
  })

  it('pins every accepted source and keeps official evidence distinguishable', () => {
    expect(acceptedManifest).toMatchObject({ schemaVersion: 1 })
    // Corpus 2026-10-20b (#2087) adds the six Khazalite Holds BSData catalogues.
    expect(acceptedManifest.artifacts).toHaveLength(252)
    expect(
      acceptedManifest.artifacts.filter(artifact => artifact.adapterVersion === 'wahapedia-export/1')
    ).toHaveLength(13)
    expect(
      acceptedManifest.artifacts.filter(artifact => artifact.adapterVersion === 'games-workshop-pdf/1')
    ).toHaveLength(161)
    // Corpus 2026-10-20b (#2087) pins six Khazalite Holds catalogues from the unmerged BSData
    // `khazalite-holds` branch at 5e52e2a5, provisional until `main` or Wahapedia carries them.
    // Corpus 2026-10-26 re-pins the two catalogues that changed upstream (the library and the faction
    // catalogue) to ea96eba3; the other four are byte-identical there and stay at 5e52e2a5.
    // Before that, no commit-pinned BSData catalogue remained. The Stormcast library, the three Ogor catalogues,
    // the three Sons of Behemat `gargants`-branch catalogues, and the Regiments of Renown catalogue
    // that carried Krong the Club's rules text (issue #1999) all retired once a pinned Wahapedia
    // page published the same content (2026-08-01d, 2026-08-28b, 2026-09-25, and the 2026-09-30
    // Ossiarch Bonereapers re-pin, issue #2037).
    const bsDataArtifacts = acceptedManifest.artifacts.filter(
      artifact => artifact.adapterVersion === 'bsdata-cat/1'
    )
    expect(
      bsDataArtifacts.map(artifact => decodeURIComponent(artifact.finalUrl.split('/').pop()!)).sort()
    ).toEqual([
      'Khazalite Holds - Fyrd of Fyrepeak.cat',
      'Khazalite Holds - Library.cat',
      'Khazalite Holds - Throngankor Alliance.cat',
      'Khazalite Holds.cat',
      'Lores.cat',
      'Regiments of Renown.cat',
    ])
    const repinned = ['Khazalite Holds - Library.cat', 'Khazalite Holds.cat']
    bsDataArtifacts.forEach(artifact =>
      expect(artifact.finalUrl).toContain(
        repinned.includes(decodeURIComponent(artifact.finalUrl.split('/').pop()!))
          ? '/BSData/age-of-sigmar-4th/ea96eba39cf280633f4cb13e2df05de358ed729a/'
          : '/BSData/age-of-sigmar-4th/5e52e2a5fbc41a594c9c8bd7c256d00286e39572/'
      )
    )
    const htmlArtifacts = acceptedManifest.artifacts.filter(
      artifact => artifact.adapterVersion === 'wahapedia-html/1'
    )
    expect(htmlArtifacts).toHaveLength(72)
    expect(
      htmlArtifacts.filter(artifact => new URL(artifact.finalUrl).pathname.endsWith('/warscrolls.html'))
    ).toHaveLength(27)
    expect(
      htmlArtifacts.filter(artifact =>
        /^\/aos4\/factions\/[^/]+\/$/i.test(new URL(artifact.finalUrl).pathname)
      )
    ).toHaveLength(28)
    expect(
      htmlArtifacts.filter(artifact =>
        /^\/aos4\/the-rules\/[^/]+\/$/i.test(new URL(artifact.finalUrl).pathname)
      )
    ).toHaveLength(17)
    acceptedManifest.artifacts.forEach(artifact => {
      expect(artifact.requestUrl).toMatch(/^https:\/\//)
      expect(artifact.finalUrl).toMatch(/^https:\/\//)
      expect(artifact.checksum).toMatch(/^[0-9a-f]{64}$/)
      expect(artifact.byteLength).toBeGreaterThan(0)
    })
    expect(AOS4_FULL_CATALOG.sourceArtifacts).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          publisher: 'games-workshop',
          authority: { kind: 'official' },
        }),
        expect.objectContaining({
          publisher: 'wahapedia',
          authority: { kind: 'secondary' },
        }),
      ])
    )
    // Community-tier artifacts must always be distinguishable and explicitly provisional. The
    // 2026-09-30 re-pin (#2037) retired the last one; corpus 2026-10-20b (#2087) adds the six
    // Khazalite Holds BSData catalogues, each titled provisional.
    const community = AOS4_FULL_CATALOG.sourceArtifacts.filter(artifact => artifact.publisher === 'other')
    expect(community).toHaveLength(6)
    community.forEach(artifact => {
      expect(artifact.authority).toEqual({ kind: 'community' })
      expect(artifact.title).toMatch(/^BSData .*provisional/)
    })
    expect(AOS4_GENERATION_AUDIT).toMatchObject({
      attribution: 'Powered by Wahapedia',
      acknowledgedDiagnostics: [],
      reviewScope: expect.stringContaining('Complete accepted AoS 4 corpus'),
    })
  })

  it('dispositions every official battle-profile fact without inventing missing rules', () => {
    expect(officialBattleProfiles.summary).toEqual({
      // Corpus 2026-10-20b (#2087) adds Battle Profiles - Khazalite Holds: 58 rows, of which the
      // October Gotrek Gurnisson and Fjori's Flamebearers regiment rows supersede the September
      // ones in the ledger (kept as audit evidence; runtime regiment eligibility is unchanged).
      records: 1370,
      effective: 1368,
      superseded: 2,
      units: 978,
      rosterOptions: 314,
      regimentsOfRenown: 78,
      // The September 2026 Sons of Behemat supplement superseded the July 2026 main-document
      // rows it re-published (ten unit rows and, by name, four regiment-of-renown rows) and
      // applied its points corrections. As of 2026-09-22 (issue #1999) the four brand-new
      // battletome units, the battle formations, heroic traits, artefacts, and Prayers of the
      // World Titan ship from the pinned BSData catalogue, dropping profile-only to just The
      // Emberwatch; Stone Lobbas, Lore of Behemat, the Realm-shaking Rampages, and King Brodd's
      // Stomp's enhancements/roster/battle traits remain structured references pending a canonical
      // source or adapter path. From corpus 2026-09-23 (issue #1757) the September 2026 Battle
      // Profiles re-publishes every unit and regiment row both faction supplements carried into
      // runtime (Sons of Behemat unchanged, Ogor Mawtribes re-priced), so it is the single
      // battle-profile source and nothing is superseded; the supplements stay pinned as reference
      // evidence, and the July 2026 Ogor Mawtribes supplement's twenty enhancement rows and two
      // regiments of renown it does not re-publish left the ledger. From corpus 2026-09-24 (issue
      // #1999) Krong the Club's row applies too: its rules text ships from the pinned BSData
      // Regiments of Renown catalogue. From corpus 2026-09-25 (#1999) the battletome content ships
      // from the re-pinned Wahapedia Sons of Behemat pages instead; the ledger is unchanged, since
      // every roster-option row, the Sons of Behemat picks among them, is a structured reference by
      // design. From corpus 2026-09-29 (#1757) extraction drops text the Battle Profiles strikes
      // through, so the page 59 Stumblefoot Gargant row, printed DELETED, is no longer a fact.
      // Corpus 2026-10-27 (#1757): Wahapedia now publishes The Emberwatch, the last profile-only fact.
      appliedToRuntime: 1054,
      profileOnly: 0,
      structuredReference: 314,
    })
    expect(officialBattleProfiles.records).toHaveLength(1370)
    officialBattleProfiles.records.forEach(record => {
      expect(record.fact.factChecksum).toMatch(/^[0-9a-f]{64}$/)
      expect(record.fact.sourceRecordId).toMatch(/^source-record:games-workshop:/)
    })
    expect(
      officialBattleProfiles.records.filter(record => record.disposition === 'profile-only')
    ).toHaveLength(0)
  })

  it('does not allow superseded bulk rule rows into the live catalog', () => {
    const allowedBulkFiles = new Set(['Factions.csv', 'Last_update.csv', 'Source.csv'])
    const liveBulkFiles = new Set(
      AOS4_FULL_CATALOG.sourceRecords.flatMap(record => {
        const match = record.id.match(/^source-record:wahapedia:([^%]+\.csv)/)
        return match ? [match[1]] : []
      })
    )
    expect(liveBulkFiles).toEqual(allowedBulkFiles)
    expect(
      AOS4_FULL_CATALOG.entities
        .flatMap(entity => entity.sourceRefs)
        .some(reference => /(?:Warscrolls|Faction_abilit)[^%]*\.csv/.test(reference.sourceRecordId))
    ).toBe(false)
  })

  it('records every reviewed source diagnostic without leaving an unknown timing', () => {
    expect(report.sourceDiagnostics).toEqual({
      reviewed: 1851,
      byCode: {
        'duplicate-identical-record': 532,
        'empty-association-record': 684,
        'missing-faction': 3,
        'missing-warscroll': 26,
        'polluted-marker': 606,
      },
    })
    expect(
      AOS4_FULL_CATALOG.entities
        .filter((entity): entity is Ability => entity.kind === 'ability')
        .flatMap(ability => ability.timings)
        .some(timing => timing.window.kind === 'unknown')
    ).toBe(false)
  })

  it('fails generation integrity on hard structured-data pathologies', () => {
    const battleProfile = AOS4_FULL_CATALOG.entities.find(entity => entity.kind === 'battle-profile')!
    const catalog = copyCatalog({
      entities: AOS4_FULL_CATALOG.entities.map(entity =>
        entity.id === battleProfile.id ? { ...battleProfile, baseSizes: ['2 5 m m [1]'] } : entity
      ),
    })

    expect(validateGenerationIntegrity(catalog).issues).toContainEqual(
      expect.objectContaining({
        code: 'pathology-error',
        severity: 'error',
        subject: battleProfile.id,
        message: expect.stringContaining('malformed-measurement-token'),
      })
    )
  })

  it('keeps stable canonical identities for every accepted runtime entity', () => {
    expect(validateIdentityRegistry(identityRegistry)).toEqual([])
    const identities = new Set(identityRegistry.entries.map(entry => entry.canonicalId))
    AOS4_FULL_CATALOG.entities.forEach(entity => expect(identities.has(entity.id)).toBe(true))
  })

  it('links every Regiment of Renown to its member warscrolls, apart from reviewed source gaps', () => {
    /**
     * Buying a regiment brings its units, so every regiment group must include a warscroll. A
     * silently dropped membership edge cost the five Sons of Behemat regiments their gargants
     * (issue #2015). Each exception is a gap in the accepted source itself, and the list must stay
     * exact: a regiment that gains a member must leave it.
     */
    const reviewedMemberlessRegiments = {
      // Their source datasheets' ORGANISATION blocks name members only as plain text, and no
      // reviewed regiment-only adoption carries those names. Gotrek Gurnisson left this list
      // when his adoption landed (#2047).
      'Heroes of The Jade Abbey': 'plain-text members with no reviewed adoption',
      'Mask of the Deceiver': 'plain-text members with no reviewed adoption',
      'The Sorrowmourn Choir': 'plain-text members with no reviewed adoption',
    }
    const kindById = new Map(AOS4_FULL_CATALOG.entities.map(entity => [entity.id, entity.kind]))
    const regiments = AOS4_FULL_CATALOG.entities.filter(
      entity => entity.kind === 'content-group' && entity.groupType === 'regiment-of-renown'
    )
    const memberless = regiments
      .filter(
        regiment =>
          !AOS4_FULL_CATALOG.relationships.some(
            relationship =>
              relationship.kind === 'includes' &&
              relationship.from === regiment.id &&
              kindById.get(relationship.to) === 'warscroll'
          )
      )
      .map(regiment => regiment.name)
      .sort()
    expect(regiments).toHaveLength(80)
    expect(regiments.map(regiment => regiment.name)).toEqual(
      expect.arrayContaining(['Fjori’s Vengeance', 'Thengin’s Grudgesettlers'])
    )
    expect(memberless).toEqual(Object.keys(reviewedMemberlessRegiments).sort())
  })

  // Scans the whole catalog per publication; already ~5 s at c9313eeb, past the default with corpus 2026-10-20.
  it(
    'keeps current, seasonal, past-season, Spearhead, Legends, and historical content separate',
    { timeout: 30_000 },
    () => {
      const standard = AOS4_FULL_CATALOG.rulesContexts.find(
        context => context.mode === 'standard' && context.status === 'current'
      )!
      const spearhead = AOS4_FULL_CATALOG.rulesContexts.find(context => context.mode === 'spearhead')!
      const seasonal = AOS4_FULL_CATALOG.rulesContexts.find(context => context.status === 'seasonal')!
      const legends = AOS4_FULL_CATALOG.rulesContexts.find(context => context.status === 'legends')!
      const historical = AOS4_FULL_CATALOG.rulesContexts.find(
        context => context.name === 'Age of Sigmar Fourth Edition Historical'
      )!
      const pastSeason = AOS4_FULL_CATALOG.rulesContexts.find(context => context.status === 'past-season')!

      expect(AOS4_FULL_CATALOG.rulesContexts).toHaveLength(6)
      expect(pastSeason.mode).toBe('standard')
      expect(pastSeason.season).toBe('2025-26')
      expect(pastSeason.battlepack).toBe('Scourge of Ghyran')
      expect(pastSeason.validTo).toBe('2026-07-05')
      expect(spearhead.battlepack).toBe('Spearhead')
      expect(seasonal.season).toBe('2026-27')
      expect(seasonal.battlepack).toBe('Scourge of Aqshy')
      expect(legends.mode).toBe('other')
      expect(historical.validTo).toBe('2026-07-05')

      const officialPublication = (name: string) => {
        const publication = AOS4_FULL_CATALOG.entities.find(
          entity =>
            entity.kind === 'publication' && entity.publisher === 'games-workshop' && entity.name === name
        )
        expect(publication).toBeDefined()
        return publication!
      }
      const expectOfficialPublicationContexts = (name: string, expectedContextIds: string[]) => {
        const publication = officialPublication(name)
        expect(publication.rulesContextIds).toEqual([...expectedContextIds].sort())
        publication.sourceRefs.forEach(reference => {
          expect(
            AOS4_FULL_CATALOG.sourceRecords.find(record => record.id === reference.sourceRecordId)
              ?.rulesContextIds
          ).toEqual([...expectedContextIds].sort())
        })
      }
      expectOfficialPublicationContexts('Spearhead Reference', [spearhead.id])
      expectOfficialPublicationContexts('Scourge of Aqshy - Stormcast Eternals', [seasonal.id])
      expectOfficialPublicationContexts('Scourge of Ghyran - Stormcast Eternals', [
        historical.id,
        pastSeason.id,
      ])
      expectOfficialPublicationContexts('Red Gobbo Battleplan', [historical.id])
      expectOfficialPublicationContexts('Legends Warscrolls', [legends.id])
      expectOfficialPublicationContexts('Faction Pack: Fyreslayers', [
        standard.id,
        pastSeason.id,
        seasonal.id,
      ])
      expectOfficialPublicationContexts(
        'Warhammer Age of Sigmar Core Rules, Spearhead Rules, Terrain List and Glossary',
        AOS4_FULL_CATALOG.rulesContexts.map(context => context.id)
      )

      const entitiesById = new Map(AOS4_FULL_CATALOG.entities.map(entity => [entity.id, entity]))
      const factions = AOS4_FULL_CATALOG.entities.filter(
        (entity): entity is Faction =>
          entity.kind === 'faction' && entity.rulesContextIds.includes(standard.id)
      )
      expect(factions).toHaveLength(28)
      expect(factions.map(faction => faction.name)).toContain('Khazalite Holds')

      /*
       * Not every decoded faction row is an army. `Endless Spells` is a container for universal
       * manifestations (#1796), and it is the only row of that shape: every real army offers at least
       * eleven warscrolls, this one offers none. Restoring the manifestation warscrolls (#1791) is
       * expected to retire the row, and this assertion should fail loudly when a second container
       * appears or this one gains units, rather than letting either back into the army selector.
       */
      const armies = armyFactions(AOS4_FULL_CATALOG)
      const allFactions = AOS4_FULL_CATALOG.entities.filter(
        (entity): entity is Faction => entity.kind === 'faction'
      )
      expect(allFactions).toHaveLength(29)
      expect(armies).toHaveLength(28)
      expect(allFactions.filter(faction => !armies.includes(faction)).map(faction => faction.name)).toEqual([
        'Endless Spells',
      ])
      // Khazalite Holds joins the seasonal context with corpus 2026-10-20b (#2087).
      expect(armies.filter(army => army.rulesContextIds.includes(seasonal.id))).toHaveLength(27)

      AOS4_FULL_CATALOG.rulesContexts.forEach(context => {
        const applicableFactions = AOS4_FULL_CATALOG.entities.filter(
          (entity): entity is Faction =>
            entity.kind === 'faction' && entity.rulesContextIds.includes(context.id)
        )
        expect(applicableFactions.length).toBeGreaterThan(0)
        applicableFactions.forEach(faction => {
          const selection = resolveSelection(AOS4_FULL_CATALOG, {
            explicitIds: [faction.id],
            rulesContextId: context.id,
          })
          expect(selection.diagnostics).toEqual([])
          const warscrollNames = selection.availableIds.flatMap(id => {
            const entity = entitiesById.get(id)
            return entity?.kind === 'warscroll' ? [entity.name] : []
          })
          if (context.mode !== 'spearhead') {
            expect(new Set(warscrollNames).size).toBe(warscrollNames.length)
          }
        })
      })

      expect(
        AOS4_FULL_CATALOG.entities
          .filter(
            entity =>
              entity.kind === 'warscroll' &&
              entity.factionIds.includes(
                factions.find(faction => faction.name === 'Soulblight Gravelords')!.id
              ) &&
              entity.rulesContextIds.includes(standard.id)
          )
          .map(entity => entity.name)
      ).toEqual(expect.arrayContaining(['Wight King on Skeletal Steed', 'Wight Lord on Skeletal Steed']))

      const gutterRunners = AOS4_FULL_CATALOG.entities.filter(
        entity => entity.kind === 'warscroll' && entity.name === 'Gutter Runners'
      )
      expect(gutterRunners).toHaveLength(2)
      expect(gutterRunners.map(warscroll => warscroll.rulesContextIds).sort()).toEqual(
        [[seasonal.id, pastSeason.id, standard.id].sort(), [spearhead.id]].sort()
      )

      const profiles = AOS4_FULL_CATALOG.entities.filter(
        entity =>
          entity.kind === 'battle-profile' &&
          gutterRunners.some(warscroll => warscroll.id === entity.warscrollId)
      )
      expect(profiles).toEqual([
        expect.objectContaining({
          unitSize: 10,
          points: 150,
          rulesContextIds: [seasonal.id, pastSeason.id, standard.id].sort(),
        }),
      ])

      const celestarBallista = AOS4_FULL_CATALOG.entities.find(
        entity => entity.kind === 'warscroll' && entity.name === 'Celestar Ballista'
      )!
      expect(celestarBallista.rulesContextIds).toEqual([legends.id])

      const kragnosWarscrolls = AOS4_FULL_CATALOG.entities.filter(
        (entity): entity is Warscroll =>
          entity.kind === 'warscroll' &&
          entity.name === 'Kragnos, the End of Empires' &&
          entity.rulesContextIds.includes(legends.id)
      )
      expect(kragnosWarscrolls).toHaveLength(1)
      expect(kragnosWarscrolls[0].factionIds.map(factionId => entitiesById.get(factionId)?.name)).toEqual([
        'Bonesplitterz',
      ])

      const nighthaunt = factions.find(faction => faction.name === 'Nighthaunt')!
      const nighthauntSelection = resolveSelection(AOS4_FULL_CATALOG, {
        explicitIds: [nighthaunt.id],
        rulesContextId: standard.id,
      })
      expect(
        nighthauntSelection.availableIds.flatMap(id => {
          const entity = entitiesById.get(id)
          return entity ? [entity.name] : []
        })
      ).not.toEqual(expect.arrayContaining(['Cursed Shacklehorde', 'Slasher Host', 'Cairn Wraith']))

      const historicalWarscrolls = AOS4_FULL_CATALOG.entities.filter(
        entity => entity.kind === 'warscroll' && entity.rulesContextIds.includes(historical.id)
      )
      expect(historicalWarscrolls).toHaveLength(44)
      expect(historicalWarscrolls.every(warscroll => warscroll.name.startsWith('Scourge of Ghyran '))).toBe(
        true
      )
    }
  )

  it('requires explicit dispositions and blocks unsafe generated content', () => {
    const orphan = {
      ...AOS4_FULL_CATALOG.sourceRecords[0],
      id: sourceRecordId('fixture', 'unconsumed-catalog-integrity-record'),
    }
    const withOrphan = copyCatalog({
      sourceRecords: [...AOS4_FULL_CATALOG.sourceRecords, orphan],
    })
    expect(validateGenerationIntegrity(withOrphan).issues).toContainEqual(
      expect.objectContaining({ code: 'unconsumed-source-record', subject: orphan.id })
    )
    expect(
      validateGenerationIntegrity(withOrphan, [
        {
          sourceRecordId: orphan.id,
          status: 'ignored',
          reason: 'Reviewed test-only source record.',
        },
      ])
    ).toMatchObject({ ok: true, issues: [] })

    const entities = structuredClone(AOS4_FULL_CATALOG.entities)
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

  it('emits deterministic compact runtime data without audit-only payload fields', () => {
    const projection = createRuntimeProjection(AOS4_FULL_CATALOG, AOS4_GENERATION_AUDIT.attribution)
    const runtime = serializeRuntimeProjection(projection)
    const reordered = copyCatalog({
      rulesContexts: [...AOS4_FULL_CATALOG.rulesContexts].reverse(),
      sourceArtifacts: [...AOS4_FULL_CATALOG.sourceArtifacts].reverse(),
      sourceRecords: [...AOS4_FULL_CATALOG.sourceRecords].reverse(),
      entities: [...AOS4_FULL_CATALOG.entities].reverse(),
      relationships: [...AOS4_FULL_CATALOG.relationships].reverse(),
    })

    expect(
      serializeRuntimeProjection(createRuntimeProjection(reordered, AOS4_GENERATION_AUDIT.attribution))
    ).toBe(runtime)
    // The projection ships in halves now, so the core carries nothing about source records and the
    // side table is what has to address them — every index in it names a record that exists.
    expect(Object.keys(AOS4_RUNTIME_PROJECTION)).not.toContain('sourceRecords')
    expect(Object.keys(AOS4_RUNTIME_PROJECTION)).not.toContain('sourceArtifacts')
    expect(
      AOS4_FULL_CATALOG.entities.filter(entity =>
        (AOS4_SOURCE_RECORD_INDEXES.get(entity.id) ?? []).some(
          index => AOS4_FULL_CATALOG.sourceRecords[index] === undefined
        )
      )
    ).toEqual([])
    expect(runtime).not.toMatch(
      /"checksum"|"recordChecksum"|"retrievedAt"|"transformation"|"sourceRefs"|"revision"|"rulesContextIds"/
    )
    expect(runtime.length).toBeLessThan(serializeAuditCatalog(AOS4_FULL_CATALOG).length)
  })
})

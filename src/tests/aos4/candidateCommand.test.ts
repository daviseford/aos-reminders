import type { ArtifactManifestEntry, GamesWorkshopPdfInput } from '../../aos4/data'
import {
  createCandidateOfficialDocumentReport,
  parseCandidateArguments,
} from '../../aos4/data/candidateCommand'
import { artifactId, sourceRecordId } from '../../aos4/domain'

describe('AoS 4 candidate command arguments', () => {
  it('collects repeatable faction cohorts deterministically', () => {
    expect(
      parseCandidateArguments([
        '--accepted-manifest',
        'accepted.json',
        '--faction',
        'SE',
        '--faction',
        'OB',
        '--faction',
        'SE',
        '--offline',
        '--output',
        'candidate-output',
      ])
    ).toEqual({
      outputDirectory: 'candidate-output',
      acceptedManifestPath: 'accepted.json',
      officialDocumentUrls: [],
      officialSearchTerms: [],
      factionIds: ['OB', 'SE'],
      offline: true,
    })
  })

  it('rejects faction IDs that could escape the output directory', () => {
    expect(() => parseCandidateArguments(['--faction', '../Stormcast'])).toThrow('Invalid faction ID')
  })

  it('summarizes official extraction without copying page text', () => {
    const artifact: ArtifactManifestEntry = {
      requestUrl: 'https://assets.warhammer-community.com/example.pdf',
      finalUrl: 'https://assets.warhammer-community.com/example.pdf',
      redirectChain: [],
      retrievedAt: '2026-07-27T12:00:00.000Z',
      adapterVersion: 'games-workshop-pdf/1',
      mediaType: 'application/pdf',
      byteLength: 3,
      checksum: 'a'.repeat(64),
    }
    const input: GamesWorkshopPdfInput = {
      artifact,
      bytes: new Uint8Array([1, 2, 3]),
      download: {
        externalId: 'example',
        title: 'Example',
        url: artifact.finalUrl,
        categories: [],
        gameSystems: ['warhammer-age-of-sigmar'],
        topics: [],
        discoveryMethod: 'page-link',
      },
    }
    const report = createCandidateOfficialDocumentReport(
      [
        {
          input,
          extraction: {
            document: {
              artifactId: artifactId(artifact.checksum),
              download: input.download,
              pages: [{ page: 1, text: 'Verbatim page text must not enter the report.' }],
              sourceRecords: [
                {
                  id: sourceRecordId('games-workshop', 'example:page:1'),
                  artifactId: artifactId(artifact.checksum),
                  locator: { kind: 'page', page: 1 },
                  recordChecksum: 'b'.repeat(64),
                  rulesContextIds: [],
                },
              ],
            },
            diagnostics: [],
          },
        },
      ],
      ['verbatim page']
    )

    expect(report).toMatchObject({
      status: 'candidate-review-required',
      documents: [
        {
          extraction: {
            status: 'extracted',
            pages: 1,
            sourceRecords: [
              {
                id: 'source-record:games-workshop:example%3Apage%3A1',
                page: 1,
                recordChecksum: 'b'.repeat(64),
              },
            ],
            matches: [{ term: 'verbatim page', pages: [1] }],
          },
        },
      ],
    })
    expect(JSON.stringify(report)).not.toContain('Verbatim page text')
  })

  it('bounds literal official-document searches', () => {
    expect(() => parseCandidateArguments(['--official-search', '  Use Reactions'])).toThrow(
      'Invalid official search term'
    )
    expect(() =>
      parseCandidateArguments(
        Array.from({ length: 21 }, (_, index) => ['--official-search', `term-${index}`]).flat()
      )
    ).toThrow('At most 20 official search terms')
  })
})

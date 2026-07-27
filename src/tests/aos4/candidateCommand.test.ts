import { parseCandidateArguments } from '../../aos4/data/candidateCommand'

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
      factionIds: ['OB', 'SE'],
      offline: true,
    })
  })

  it('rejects faction IDs that could escape the output directory', () => {
    expect(() => parseCandidateArguments(['--faction', '../Stormcast'])).toThrow('Invalid faction ID')
  })
})

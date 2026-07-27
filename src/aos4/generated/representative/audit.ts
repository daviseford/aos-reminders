import { WAHAPEDIA_ATTRIBUTION } from '../../data/wahapedia/exportCatalog'
import { REPRESENTATIVE_UNCLASSIFIED_SOURCE_RECORD } from './sources'

export const REPRESENTATIVE_AUDIT = {
  schemaVersion: 1,
  generatedAt: '2026-07-27T20:00:00.000Z',
  attribution: WAHAPEDIA_ATTRIBUTION,
  reviewScope: 'Representative Stormcast Eternals slice; not the complete approved AoS 4 corpus.',
  acknowledgedDiagnostics: [
    {
      code: 'unknown-timing',
      severity: 'warning',
      sourceRecordId: REPRESENTATIVE_UNCLASSIFIED_SOURCE_RECORD.id,
      raw: 'When the thunder answers',
      disposition: 'excluded-from-runtime',
      reason:
        'Deliberate fixture proving that unclassified timing is reported and cannot enter runtime projection.',
    },
  ],
  sourcePolicy: {
    officialPublisher: 'games-workshop',
    secondaryPublisher: 'wahapedia',
    fullRuleBodiesCommitted: false,
  },
} as const

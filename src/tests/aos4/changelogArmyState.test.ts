import {
  REPRESENTATIVE_CATALOG as AOS4_CATALOG,
  REPRESENTATIVE_CONTEXT_ID,
  REPRESENTATIVE_EXPLICIT_SELECTION_IDS as AOS4_DEFAULT_SELECTION_IDS,
} from '../../aos4/generated'
import { AOS4_ARMY_STORAGE_KEY, loadAos4ArmyDocument, saveAos4ArmyDocument } from '../../aos4/runtime'
import {
  acknowledgeAos4Publication,
  advanceAos4ChangelogStamp,
  catchUpAos4Changelog,
  createAos4ArmyDocument,
  deserializeAos4ArmyDocument,
  discardAos4RemovedSelections,
  recordAos4RemovedSelection,
  serializeAos4ArmyDocument,
  stampAos4ChangelogRevision,
} from '../../aos4/state'

const DEAD_SELECTION_ID = 'warscroll:ffffffff-ffff-4fff-8fff-ffffffffffff'
const REVISION_JULY = 'revision:2026-07-01'
const REVISION_AUGUST = 'revision:2026-08-01'
const PUBLICATION_JULY = 'publication:july-update'
const PUBLICATION_AUGUST = 'publication:august-faq'

class MemoryStorage implements Storage {
  private readonly values = new Map<string, string>()

  get length() {
    return this.values.size
  }

  clear() {
    this.values.clear()
  }

  getItem(key: string) {
    return this.values.get(key) ?? null
  }

  key(index: number) {
    return Array.from(this.values.keys())[index] ?? null
  }

  removeItem(key: string) {
    this.values.delete(key)
  }

  setItem(key: string, value: string) {
    this.values.set(key, value)
  }
}

const createDocument = () =>
  createAos4ArmyDocument({
    id: 'army:changelog-state',
    name: 'Changelog Stormcast Eternals',
    rulesContextId: REPRESENTATIVE_CONTEXT_ID,
    explicitSelectionIds: AOS4_DEFAULT_SELECTION_IDS,
  })

const createStampedDocument = () =>
  createAos4ArmyDocument({
    ...createDocument(),
    changelog: {
      lastSeenRevision: REVISION_JULY,
      acknowledgedPublicationIds: [PUBLICATION_JULY],
      removedSelections: [
        {
          selectionId: DEAD_SELECTION_ID,
          detectedAtRevision: REVISION_AUGUST,
          publicationId: PUBLICATION_AUGUST,
        },
      ],
    },
  })

describe('AoS 4 army changelog state', () => {
  it('round-trips documents without changelog state byte-identically and without the field', () => {
    const serialized = serializeAos4ArmyDocument(createDocument())
    const restored = deserializeAos4ArmyDocument(serialized, AOS4_CATALOG)

    expect(serialized).not.toContain('"changelog"')
    expect(restored.diagnostics).toEqual([])
    expect(restored.document?.changelog).toBeUndefined()
    expect(serializeAos4ArmyDocument(restored.document!)).toBe(serialized)
  })

  it('round-trips the stamp, acknowledgements, and removal records byte-faithfully', () => {
    const serialized = serializeAos4ArmyDocument(createStampedDocument())
    const restored = deserializeAos4ArmyDocument(serialized, AOS4_CATALOG)

    expect(restored.diagnostics).toEqual([])
    expect(restored.document?.changelog).toEqual({
      lastSeenRevision: REVISION_JULY,
      acknowledgedPublicationIds: [PUBLICATION_JULY],
      removedSelections: [
        {
          selectionId: DEAD_SELECTION_ID,
          detectedAtRevision: REVISION_AUGUST,
          publicationId: PUBLICATION_AUGUST,
        },
      ],
    })
    expect(serializeAos4ArmyDocument(restored.document!)).toBe(serialized)
  })

  it('deserializes a document whose changelog field was stripped by an old client', () => {
    const stripped = JSON.parse(serializeAos4ArmyDocument(createStampedDocument()))
    delete stripped.changelog

    const restored = deserializeAos4ArmyDocument(JSON.stringify(stripped), AOS4_CATALOG)

    expect(restored.diagnostics).toEqual([])
    expect(restored.document?.changelog).toBeUndefined()
    expect(serializeAos4ArmyDocument(restored.document!)).toBe(serializeAos4ArmyDocument(createDocument()))
  })

  it('keeps only known fields when reconstructing, dropping unknown top-level and nested fields', () => {
    const tampered = JSON.parse(serializeAos4ArmyDocument(createStampedDocument()))
    tampered.futureTopLevelField = true
    tampered.changelog.futureNestedField = 'ignored'
    tampered.changelog.removedSelections[0].futureRecordField = 'ignored'

    const restored = deserializeAos4ArmyDocument(JSON.stringify(tampered), AOS4_CATALOG)

    expect(restored.diagnostics).toEqual([])
    expect(serializeAos4ArmyDocument(restored.document!)).toBe(
      serializeAos4ArmyDocument(createStampedDocument())
    )
  })

  it('drops a changelog field of the wrong type with a warning instead of rejecting the document', () => {
    const value = JSON.parse(serializeAos4ArmyDocument(createStampedDocument()))
    value.changelog = 'garbage'

    const restored = deserializeAos4ArmyDocument(JSON.stringify(value), AOS4_CATALOG)

    expect(restored.document).toBeDefined()
    expect(restored.document?.changelog).toBeUndefined()
    expect(restored.document?.explicitSelectionIds).toEqual(createDocument().explicitSelectionIds)
    expect(restored.document?.reminderPreferences).toEqual(createDocument().reminderPreferences)
    expect(restored.diagnostics).toEqual([
      expect.objectContaining({ code: 'invalid-changelog-state', severity: 'warning' }),
    ])
  })

  it('drops a changelog whose inner field has the wrong type, keeping the rest of the document', () => {
    const value = JSON.parse(serializeAos4ArmyDocument(createStampedDocument()))
    value.changelog = { acknowledgedPublicationIds: 'nope' }

    const restored = deserializeAos4ArmyDocument(JSON.stringify(value), AOS4_CATALOG)

    expect(restored.document).toBeDefined()
    expect(restored.document?.changelog).toBeUndefined()
    expect(restored.document?.explicitSelectionIds).toEqual(createDocument().explicitSelectionIds)
    expect(restored.diagnostics).toEqual([
      expect.objectContaining({ code: 'invalid-changelog-state', severity: 'warning' }),
    ])
  })

  it('survives a selection the catalog no longer carries, filtering it with a warning', () => {
    const value = JSON.parse(serializeAos4ArmyDocument(createDocument()))
    value.explicitSelectionIds.push(DEAD_SELECTION_ID)

    const restored = deserializeAos4ArmyDocument(JSON.stringify(value), AOS4_CATALOG)

    expect(restored.document?.explicitSelectionIds).toEqual(createDocument().explicitSelectionIds)
    expect(restored.diagnostics).toEqual([
      expect.objectContaining({
        code: 'missing-selection',
        severity: 'warning',
        subject: DEAD_SELECTION_ID,
      }),
    ])
  })

  it('carries the removal record through the round trip after the selection was filtered', () => {
    const value = JSON.parse(serializeAos4ArmyDocument(createDocument()))
    value.explicitSelectionIds.push(DEAD_SELECTION_ID)
    const restored = deserializeAos4ArmyDocument(JSON.stringify(value), AOS4_CATALOG)

    const filteredId = restored.diagnostics.find(
      diagnostic => diagnostic.code === 'missing-selection'
    )!.subject!
    const recorded = recordAos4RemovedSelection(restored.document!, {
      selectionId: filteredId,
      detectedAtRevision: REVISION_AUGUST,
    })

    const roundTripped = deserializeAos4ArmyDocument(serializeAos4ArmyDocument(recorded), AOS4_CATALOG)
    expect(roundTripped.diagnostics).toEqual([])
    expect(roundTripped.document?.changelog?.removedSelections).toEqual([
      { selectionId: DEAD_SELECTION_ID, detectedAtRevision: REVISION_AUGUST },
    ])
  })

  it('records a removal only once per selection', () => {
    const record = { selectionId: DEAD_SELECTION_ID, detectedAtRevision: REVISION_AUGUST }
    const recorded = recordAos4RemovedSelection(createDocument(), record)

    expect(recordAos4RemovedSelection(recorded, record)).toBe(recorded)
    expect(recorded.changelog?.removedSelections).toEqual([record])
  })

  it('discards removal records on explicit list replacement, keeping stamp and acknowledgements', () => {
    const document = createAos4ArmyDocument({
      ...createDocument(),
      changelog: {
        lastSeenRevision: REVISION_JULY,
        acknowledgedPublicationIds: [PUBLICATION_JULY],
        removedSelections: [{ selectionId: DEAD_SELECTION_ID, detectedAtRevision: REVISION_AUGUST }],
      },
    })

    const replaced = createAos4ArmyDocument({
      ...document,
      changelog: discardAos4RemovedSelections(document.changelog),
    })

    expect(replaced.changelog).toEqual({
      lastSeenRevision: REVISION_JULY,
      acknowledgedPublicationIds: [PUBLICATION_JULY],
    })
    // A records-only changelog empties entirely, and normalization erases the empty field.
    expect(
      createAos4ArmyDocument({
        ...document,
        changelog: discardAos4RemovedSelections({
          removedSelections: [{ selectionId: DEAD_SELECTION_ID, detectedAtRevision: REVISION_AUGUST }],
        }),
      }).changelog
    ).toBeUndefined()
    expect(discardAos4RemovedSelections(undefined)).toBeUndefined()
  })

  it('acknowledges a publication idempotently and clears the removals attributed to it', () => {
    const document = createAos4ArmyDocument({
      ...createDocument(),
      changelog: {
        removedSelections: [
          {
            selectionId: DEAD_SELECTION_ID,
            detectedAtRevision: REVISION_AUGUST,
            publicationId: PUBLICATION_AUGUST,
          },
          {
            selectionId: 'warscroll:eeeeeeee-eeee-4eee-8eee-eeeeeeeeeeee',
            detectedAtRevision: REVISION_JULY,
          },
        ],
      },
    })

    const acknowledged = acknowledgeAos4Publication(document, PUBLICATION_AUGUST)

    expect(acknowledged.changelog?.acknowledgedPublicationIds).toEqual([PUBLICATION_AUGUST])
    expect(acknowledged.changelog?.removedSelections).toEqual([
      { selectionId: 'warscroll:eeeeeeee-eeee-4eee-8eee-eeeeeeeeeeee', detectedAtRevision: REVISION_JULY },
    ])
    expect(acknowledgeAos4Publication(acknowledged, PUBLICATION_AUGUST)).toBe(acknowledged)
  })

  it('clears unattributed removals only when the stamp advances past their detection revision', () => {
    const document = createAos4ArmyDocument({
      ...createDocument(),
      changelog: {
        removedSelections: [{ selectionId: DEAD_SELECTION_ID, detectedAtRevision: REVISION_JULY }],
      },
    })

    const stampedAtDetection = stampAos4ChangelogRevision(document, REVISION_JULY)
    expect(stampedAtDetection.changelog?.lastSeenRevision).toBe(REVISION_JULY)
    expect(stampedAtDetection.changelog?.removedSelections).toEqual([
      { selectionId: DEAD_SELECTION_ID, detectedAtRevision: REVISION_JULY },
    ])

    const stampedPast = stampAos4ChangelogRevision(stampedAtDetection, REVISION_AUGUST)
    expect(stampedPast.changelog?.lastSeenRevision).toBe(REVISION_AUGUST)
    expect(stampedPast.changelog?.removedSelections).toBeUndefined()
  })

  it('advances the stamp only when every retained publication affecting the army is acknowledged', () => {
    const document = acknowledgeAos4Publication(createDocument(), PUBLICATION_JULY)

    const held = advanceAos4ChangelogStamp(document, {
      currentRevision: REVISION_AUGUST,
      retainedPublicationIds: [PUBLICATION_JULY, PUBLICATION_AUGUST],
      affectingPublicationIds: [PUBLICATION_JULY, PUBLICATION_AUGUST],
    })
    expect(held).toBe(document)
    expect(held.changelog?.lastSeenRevision).toBeUndefined()

    const advanced = advanceAos4ChangelogStamp(document, {
      currentRevision: REVISION_AUGUST,
      retainedPublicationIds: [PUBLICATION_JULY, PUBLICATION_AUGUST],
      affectingPublicationIds: [PUBLICATION_JULY],
    })
    expect(advanced.changelog?.lastSeenRevision).toBe(REVISION_AUGUST)
  })

  it('prunes evicted attributed removal records when the stamp advances', () => {
    const document = createAos4ArmyDocument({
      ...createDocument(),
      changelog: {
        removedSelections: [
          {
            selectionId: DEAD_SELECTION_ID,
            detectedAtRevision: REVISION_JULY,
            publicationId: PUBLICATION_JULY,
          },
        ],
      },
    })

    // While the publication is retained the record survives the advance, awaiting acknowledgement.
    const stillRetained = advanceAos4ChangelogStamp(document, {
      currentRevision: REVISION_AUGUST,
      retainedPublicationIds: [PUBLICATION_JULY],
      affectingPublicationIds: [],
    })
    expect(stillRetained.changelog?.lastSeenRevision).toBe(REVISION_AUGUST)
    expect(stillRetained.changelog?.removedSelections).toEqual(document.changelog?.removedSelections)

    // Once the publication left retention no roll-up can show or acknowledge the record any more,
    // so the advance clears it instead of leaving it permanently unreachable.
    const evicted = advanceAos4ChangelogStamp(document, {
      currentRevision: REVISION_AUGUST,
      retainedPublicationIds: [PUBLICATION_AUGUST],
      affectingPublicationIds: [],
    })
    expect(evicted.changelog?.lastSeenRevision).toBe(REVISION_AUGUST)
    expect(evicted.changelog?.removedSelections).toBeUndefined()
  })

  it('catches up in one step: stamp, retained acknowledgements, and removal records', () => {
    const document = createAos4ArmyDocument({
      ...createDocument(),
      changelog: {
        lastSeenRevision: REVISION_JULY,
        acknowledgedPublicationIds: [PUBLICATION_JULY],
        removedSelections: [
          {
            selectionId: DEAD_SELECTION_ID,
            detectedAtRevision: REVISION_JULY,
            publicationId: PUBLICATION_JULY,
          },
          {
            selectionId: 'warscroll:eeeeeeee-eeee-4eee-8eee-eeeeeeeeeeee',
            detectedAtRevision: REVISION_JULY,
          },
        ],
      },
    })

    const caughtUp = catchUpAos4Changelog(document, {
      revision: REVISION_AUGUST,
      retainedPublicationIds: [PUBLICATION_JULY, PUBLICATION_AUGUST],
    })

    expect(caughtUp.changelog).toEqual({
      lastSeenRevision: REVISION_AUGUST,
      acknowledgedPublicationIds: [PUBLICATION_AUGUST, PUBLICATION_JULY],
    })
    expect(
      catchUpAos4Changelog(caughtUp, {
        revision: REVISION_AUGUST,
        retainedPublicationIds: [PUBLICATION_JULY, PUBLICATION_AUGUST],
      })
    ).toBe(caughtUp)
  })

  it('round-trips changelog state through browser storage save and load', () => {
    const storage = new MemoryStorage()
    const document = createStampedDocument()

    saveAos4ArmyDocument(storage, document)
    const result = loadAos4ArmyDocument(storage, AOS4_CATALOG)

    expect(result.source).toBe('storage')
    expect(result.diagnostics).toEqual([])
    expect(result.document).toEqual(document)
  })

  it('loads a stored army with a corrupt changelog without resetting it to the default document', () => {
    const storage = new MemoryStorage()
    const value = JSON.parse(serializeAos4ArmyDocument(createStampedDocument()))
    value.changelog = { acknowledgedPublicationIds: 'nope' }
    storage.setItem(AOS4_ARMY_STORAGE_KEY, `${JSON.stringify(value, null, 2)}\n`)

    const result = loadAos4ArmyDocument(storage, AOS4_CATALOG)

    expect(result.source).toBe('storage')
    expect(result.document.explicitSelectionIds).toEqual(createDocument().explicitSelectionIds)
    expect(result.document.changelog).toBeUndefined()
    expect(result.diagnostics).toEqual([
      expect.objectContaining({ code: 'invalid-changelog-state', severity: 'warning' }),
    ])
  })

  it('no longer resets stored armies whose selection an update removed', () => {
    const storage = new MemoryStorage()
    const value = JSON.parse(serializeAos4ArmyDocument(createStampedDocument()))
    value.explicitSelectionIds.push(DEAD_SELECTION_ID)
    storage.setItem(AOS4_ARMY_STORAGE_KEY, `${JSON.stringify(value, null, 2)}\n`)

    const result = loadAos4ArmyDocument(storage, AOS4_CATALOG)

    expect(result.source).toBe('storage')
    expect(result.document.explicitSelectionIds).toEqual(createDocument().explicitSelectionIds)
    expect(result.document.changelog).toEqual(createStampedDocument().changelog)
    expect(result.diagnostics).toEqual([
      expect.objectContaining({
        code: 'missing-selection',
        severity: 'warning',
        subject: DEAD_SELECTION_ID,
      }),
    ])
  })
})

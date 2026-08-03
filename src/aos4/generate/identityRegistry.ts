import type { CanonicalId, EntityKind, SourcePublisher } from '../domain'

export const AOS4_IDENTITY_REGISTRY_SCHEMA_VERSION = 1 as const

export interface IdentityAlias {
  publisher: SourcePublisher
  externalId: string
}

export interface IdentityRegistryEntry {
  kind: EntityKind
  canonicalId: CanonicalId
  name: string
  aliases: IdentityAlias[]
}

export interface IdentityRegistry {
  schemaVersion: typeof AOS4_IDENTITY_REGISTRY_SCHEMA_VERSION
  entries: IdentityRegistryEntry[]
}

export type IdentityRegistryIssueCode =
  'duplicate-canonical-id' | 'duplicate-source-alias' | 'canonical-kind-mismatch' | 'missing-source-alias'

export interface IdentityRegistryIssue {
  code: IdentityRegistryIssueCode
  subject: string
  message: string
}

export const validateIdentityRegistry = (registry: IdentityRegistry): IdentityRegistryIssue[] => {
  const issues: IdentityRegistryIssue[] = []
  const canonicalIds = new Set<string>()
  const aliases = new Map<string, string>()

  registry.entries.forEach(entry => {
    if (canonicalIds.has(entry.canonicalId)) {
      issues.push({
        code: 'duplicate-canonical-id',
        subject: entry.canonicalId,
        message: `Canonical ID ${entry.canonicalId} appears more than once`,
      })
    }
    canonicalIds.add(entry.canonicalId)
    if (!entry.canonicalId.startsWith(`${entry.kind}:`)) {
      issues.push({
        code: 'canonical-kind-mismatch',
        subject: entry.canonicalId,
        message: `Canonical ID ${entry.canonicalId} does not match ${entry.kind}`,
      })
    }
    if (!entry.aliases.length) {
      issues.push({
        code: 'missing-source-alias',
        subject: entry.canonicalId,
        message: `Canonical ID ${entry.canonicalId} has no source alias`,
      })
    }
    entry.aliases.forEach(alias => {
      const key = `${entry.kind}:${alias.publisher}:${alias.externalId}`
      const existing = aliases.get(key)
      if (existing) {
        issues.push({
          code: 'duplicate-source-alias',
          subject: key,
          message:
            existing === entry.canonicalId
              ? `Source alias ${key} is repeated for ${entry.canonicalId}`
              : `Source alias ${key} maps to both ${existing} and ${entry.canonicalId}`,
        })
      } else {
        aliases.set(key, entry.canonicalId)
      }
    })
  })

  return issues.sort(
    (left, right) => left.code.localeCompare(right.code) || left.subject.localeCompare(right.subject)
  )
}

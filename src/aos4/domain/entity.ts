import type { CanonicalId, EntityKind, RulesContextId } from './identity'
import type { SourceReference } from './source'

export interface DomainEntity<TKind extends EntityKind> {
  id: CanonicalId<TKind>
  kind: TKind
  revision: string
  name: string
  rulesContextIds: RulesContextId[]
  sourceRefs: SourceReference[]
}


---
title: "A source that re-numbers its rows must alias onto existing identities, never mint new ones"
date: 2026-08-25
category: workflow-learnings
module: aos4-corpus
problem_type: workflow_issue
component: service_object
severity: high
applies_when:
  - "Accepting a Wahapedia export refresh whose CSV ids changed for rows the corpus already ships (a site-wide publish, a battletome catch-up, a Legends or Regiment of Renown restructure)"
  - "Extending data/aos4/identities/corpus.json for any new source aliases, from any source (Wahapedia, BSData, official extraction)"
  - "The strict gate reports a batch of identity-not-found errors during a candidate cycle"
  - "Reviewing a candidate whose runtime diff shows the same count of added and removed entities for a kind"
symptoms:
  - "Runtime diff shows identical added and removed counts per entity kind (78/78 warscrolls, 92/92 content groups, 389/389 abilities) with every removed name reappearing under a new id"
  - "generate --candidate fails with hundreds of identity-not-found errors after a Wahapedia export refresh even though the faction pages barely changed"
  - "Saved armies and share links would stop resolving warscrolls and content groups that still exist under the same name"
root_cause: data_integrity
resolution_type: workflow_improvement
related_components:
  - "data/aos4/identities/corpus.json"
  - "src/aos4/generate/corpus.ts"
  - "src/aos4/data/wahapediaHtml/merge.ts"
  - "docs/data/aos4-rules-radar-alarm.md"
tags: [identity-registry, canonical-id, source-alias, wahapedia-export, id-churn, saved-armies, candidate-cycle, rules-radar]
---

# A source that re-numbers its rows must alias onto existing identities, never mint new ones

## Context

Every entity in the AoS 4 corpus has a canonical id derived from one source alias: `canonicalIdForDefinition` in `src/aos4/generate/corpus.ts` hashes the entity kind plus the alias (`Warscrolls.csv:<wahapedia id>`, `html:<page>#datasheet:<slug>/warscroll`, and so on) into a UUID. The identity registry `data/aos4/identities/corpus.json` maps aliases to canonical ids, and saved armies, share links, and cloud rosters store those canonical ids. A datasheet parsed from a faction page inherits the export row's identity: `mergeCurrentWahapediaWarscrollPages` in `src/aos4/data/wahapediaHtml/merge.ts` sets `warscrollId` to the matching CSV row's id when it can find one.

On 2026-08-25 Wahapedia published a site-wide export refresh (`Last_update.csv` moved to 14:30; 51 of 85 accepted artifacts changed). The strict gate stopped with 867 `identity-not-found` errors, and the obvious fix, extending the registry with `createCorpusIdentityRegistry` over the candidate dataset and appending every unknown alias as a fresh entry, made generation pass. The runtime diff then showed 78 warscrolls removed and 78 added, 92 content groups removed and 92 added, 389 abilities each way, and every removed name reappeared in the added list. Wahapedia had re-numbered the rows (every Scourge of Aqshy datasheet, the faction ability-type groups for most armies, their abilities and weapons); the corpus had minted new identities for content it already shipped, which would have broken every saved army that referenced them.

## Guidance

Treat identical added and removed counts per kind in the runtime diff as a stop signal, not as churn to accept. The corpus rule is explicit in `docs/data/aos4-maintenance.md`: preserve existing canonical ids and add a deterministic source alias only for genuinely new entities.

1. Extend the registry with new aliases first, but from the **merged** dataset (`loadAcceptedCorpusSourceData(...).decoded.dataset`), not the raw CSV decode, because HTML-derived aliases (Spearhead datasheets on faction root pages, faction groups) only exist after the merge. Keep every existing entry; append entries only for alias keys the registry does not know.
2. Generate into scratch paths and diff the old and new `runtime.json` entity sets by id. Bucket the delta per kind into added, removed, changed.
3. Pair each removed entity with an added one on a key that is stable across re-numbering: kind, name, rules-context set, kind-specific owner (faction ids for warscrolls, group type for content groups, actor for abilities), and the owner relationship (`includes`/`offers` from-entity kind and name). Require the pair to be unique on both sides; report anything ambiguous instead of guessing.
4. For each unique pair, move the added entry's aliases onto the existing entry (the one whose canonical id the old runtime used) and drop the freshly minted entry. Regenerate and diff again; the churn must fall to zero, leaving only genuine additions and removals.
5. Record the count and the zero-ambiguity result in the review paragraph the maintenance runbook keeps per radar review, so the next reviewer knows the identities were preserved deliberately.

The remap used on 2026-08-25b lived in the scratch directory (`.cache/aos4/scratch/remap-identities.cjs` in that session); its core is small enough to rewrite from this description, and the `docs/data/aos4-rules-radar-alarm.md` Wahapedia lane names it as a required step.

## Why This Matters

Canonical ids are the only stable handle users' data holds on the corpus. Wahapedia ids are stable while a row lives, but the site re-numbers rows whenever it restructures (seasonal datasheets moving between pages, faction-ability groups being rebuilt from a new battletome, Legends Regiments of Renown being reorganised). Because the canonical id is a hash of the alias, a re-numbered row produces a different id unless the registry says otherwise. The registry is the one place that can say "this new alias is the same thing", and every prior cycle either had no re-numbering or handled it by hand. The strict gate cannot catch this: from its point of view a new alias for an existing name is indistinguishable from a genuinely new unit, which is exactly why the runtime-diff check has to be a review step rather than an automated gate.

The identity scheme is also positional for HTML abilities (`…/ability:N`), so a rewritten datasheet can leave an ability's canonical id bound to a different ability than before. That is how it has always behaved and it does not affect users, because reminders are derived from the source on every build rather than stored by ability id; it is mentioned here so a reviewer does not mistake those "changed name" abilities for a second identity bug.

## When to Apply

- Any candidate cycle whose identity extension adds more than a handful of aliases, and always after a Wahapedia bulk export refresh.
- Any review where a kind's added and removed counts match, or where removed names reappear in the added list.
- Any new source or adapter whose external ids are assigned by the upstream and can be reassigned (BSData catalogues re-numbering entry ids would produce the same failure).

## Examples

Before, after naïve extension (2026-08-25b, first generation):

```
added warscroll=78   removed warscroll=78   same-name 78
added content-group=92   removed content-group=92   same-name 92
added ability=389   removed ability=389   same-name 378
added weapon=168   removed weapon=168   same-name 167
```

Remap report, then the regenerated diff:

```
{ moved: 786, ambiguous: 0, unmatchedRemoved: 14, unmatchedAdded: 41 }
added ability=12   removed ability=12   changed ability=33
added weapon=1     removed weapon=1     changed weapon=15
added publication=28   removed publication=1
```

The residual 12/12 abilities are genuinely renamed abilities from the new Cities of Sigmar and Hedonites of Slaanesh battletomes; the 28 publications are newly cited sources. No warscroll or content group changed id.

## Related

- [`docs/data/aos4-rules-radar-alarm.md`](../../data/aos4-rules-radar-alarm.md), Wahapedia lane, step 4 and the re-pin checklist: the operational procedure this learning feeds.
- [`docs/data/aos4-maintenance.md`](../../data/aos4-maintenance.md), Review and acceptance, step 5 (preserve existing canonical ids) and the 2026-08-25b review paragraph.
- [Rules Radar alarm consumed before delivery](./rules-radar-alarm-consumed-before-delivery.md): the other radar-cycle learning; together they cover "the alarm is lost" and "the alarm is acted on wrongly".

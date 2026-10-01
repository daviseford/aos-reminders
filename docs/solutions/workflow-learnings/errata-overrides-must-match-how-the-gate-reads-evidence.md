---
title: "An erratum override certifies only through the evidence window the review actually sees"
date: 2026-10-01
category: workflow-learnings
module: aos4-corpus
problem_type: workflow_issue
component: service_object
severity: medium
applies_when:
  - "Applying an official Rules Updates erratum to text a secondary source still prints in its earlier form"
  - "Writing abilityTextOverrides, timingOverrides, or warscrollKeywordOverrides that cite an official page"
  - "data:aos4:review:adversarial reports official-override.*.evidence findings on a fresh override"
symptoms:
  - "official-override.ability-text.evidence on an override whose new text the cited page plainly prints"
  - "official-override.warscroll-keyword.evidence on an 'ALL WARSCROLLS ... Remove X from the keywords bar' erratum"
  - "A deletion-only erratum (a roll removed, a bullet deleted) cannot be certified at all"
root_cause: logic_error
resolution_type: workflow_improvement
related_components:
  - "src/aos4/review/adversarialReview.ts"
  - "src/aos4/review/packetCommand.ts"
  - "data/aos4/reviews/corpus-2026-10-01.json"
tags: [errata, official-override, machine-review, evidence-excerpt, rules-updates, deletion-erratum]
---

# An erratum override certifies only through the evidence window the review actually sees

## What happened

Corpus 2026-10-01 (#2060) applied the outstanding September 2026 Rules Updates errata. The first
campaign returned five findings even though every cited page printed the corrected rule.

## Why

1. **The official excerpt is a window, not the page.** `pageExcerpt` cuts about 1,200 characters
   around the entity's name. An erratum that names the rule differently (`Whirlpool Fury` for
   Wahapedia's WHIRLPOOL'S FURY) or names no unit at all (`BONESPLITTERZ, ALL WARSCROLLS: Remove
   Orruk from the keywords bar`) falls back to the top of the page and misses the instruction.
   Override evidence now also searches for the name without a possessive and for the keywords the
   override changes.
2. **An override carries every field, not only the corrected one.** A deletion erratum (Lightning
   Master loses its 2+ roll) contributes no new words, so it can only certify when the official page
   prints the result whole. The untouched declare step beside it is not on the erratum page; the
   gate now compares each field with the secondary record's own `Declare:`/`Effect:` segment and
   requires the official reprint only for the fields that changed.
3. **Phrase edits interleave sources.** Text that is secondary wording with official words spliced
   in (`Units, terrain features and MANIFESTATIONS`) is not an in-order subsequence of the
   secondary-then-official evidence. It certifies when every word that departs from the secondary
   text is printed by the official evidence.

## How to apply

- Prefer citing a page that reprints the corrected rule whole (a re-published Scourge of Aqshy
  pack, the Armies of Renown document) alongside the Rules Updates instruction; the reprint is
  stronger evidence and gives the exact wording.
- Build overrides from the shipped field plus exact substring replacements, asserting the shipped
  value first, so a mis-targeted override fails before generation.
- Expect the first campaign to surface excerpt-window misses; fix the window or the citation,
  never the override text to suit the window.
- A positional erratum ("remove the first sentence") cannot be applied to secondary text that may
  already carry it. Identify the removed sentence first: Warhammer Community's battlescroll
  article for the same release usually describes each change in prose (Dirty Tricks: "the
  restriction on using only one Dirty Trick per phase removed", 29 June 2026), and BSData's git
  history dates when community text changed. If the secondary already prints the result, no
  override is needed; the generator rejects overrides that restate the source.

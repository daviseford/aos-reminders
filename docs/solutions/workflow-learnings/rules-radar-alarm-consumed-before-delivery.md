---
title: "At-most-once notifiers: never advance the state edge before delivery is confirmed"
date: 2026-08-19
category: workflow-learnings
module: aos4-radar
problem_type: workflow_issue
component: messaging
severity: high
root_cause: logic_error
resolution_type: code_fix
applies_when:
  - "Building any at-most-once notification keyed on a persisted state fingerprint (alarm/alert emails, webhook fan-out, digest sends)"
  - "Gating a notification-workflow step on a command's process exit code rather than on the artifact that proves delivery happened"
  - "Adding retry or continue-on-error to a send step in a workflow that also persists 'already notified' state"
  - "Reviewing a GitHub Actions workflow that writes durable state (a managed issue body, a fingerprint file) as part of alerting"
  - "The only failure signal for a lost alert is a red CI run a human may not correlate to the alert"
symptoms:
  - "Email step gated on the notify step's outcome, but notify exits nonzero on operational churn after already advancing the fingerprint, so a material change alongside operational noise wrote send=true, skipped the email, and the next run saw 'material state unchanged'"
  - "SMTP send had no retry and was continue-on-error, so one transient send failure permanently consumed that alarm"
  - "A local alarm-artifact write failure after the GitHub issue sync succeeded (create-exclusive 'wx' collision, disk error) left the fingerprint advanced with no email and no artifacts"
related_components:
  - ".github/workflows/aos4-rules-radar.yml"
  - "src/aos4/radar/alarm.ts"
  - "src/aos4/radar/compare.ts"
  - "src/aos4/radar/rulesRadarNotifyCommand.ts"
  - "src/aos4/radar/githubIssue.ts"
tags:
  - rules-radar
  - alarm-email
  - state-edge-ordering
  - at-most-once-notification
  - github-actions
  - silent-alert-loss
  - notify-gating
  - fingerprint-state
---

# At-most-once notifiers: never advance the state edge before delivery is confirmed

Reviewers found four defects in the AoS Rules Radar material alarm (PR #1968). Three of them were not three separate bugs; they were three instances of a single ordering mistake, and that mistake is available to every future once-per-state notifier in this repo. The fourth was a related flaw in the predicate that decides whether to send at all. Documented as one-off bug fixes they would read as "we added a retry." Documented as a design rule they tell the next author which line of code to look at first.

The four defects are preserved below as worked examples, followed by a fifth section covering the review technique that exposed the weakest-guarded of them — a test-fidelity lesson rather than a fifth code defect.

## Context

The AoS 4 Rules Radar (`.github/workflows/aos4-rules-radar.yml`) is a scheduled observer. On each run it looks at rules sources, merges what it saw into a managed GitHub issue whose body embeds machine state, and — on non-report-only runs — emails the maintainer when there is *new material state to review*.

The alarm is deliberately **at most once per distinct material state**. That property is the whole point of the design, and it is built from two pieces:

- `createRadarMaterialFingerprint` hashes only the report's material events, not the aggregate (`src/aos4/radar/compare.ts:505-506`). Operational churn — a transient rate limit appearing and clearing — moves the aggregate fingerprint but not the material one, so it cannot re-alarm on state the maintainer has already seen.
- `decideRulesRadarAlarm` compares the current material fingerprint against the one parsed back out of the managed issue body from the previous run (`src/aos4/radar/alarm.ts:28-51`, previous state supplied by `synchronizeRulesRadarIssue` at `src/aos4/radar/githubIssue.ts:162`).

The persisted state edge is therefore the **managed issue body**. `synchronizeRulesRadarIssue` writes the merged report into it via `client.updateIssue` (`src/aos4/radar/githubIssue.ts:173-180`) and only then returns; `runRulesRadarNotification` calls `decideRulesRadarAlarm` afterwards (`src/aos4/radar/rulesRadarNotifyCommand.ts:172-173`). By the time anything downstream can decide to send an email, the issue body already says "this state has been seen."

This is the shape that makes the rule below necessary. It is not unique to email: it applies to any notifier whose dedupe key is written to durable storage before the notification leaves the process.

## Guidance

**Rule: in an at-most-once notifier, the persisted state edge must not advance until delivery is confirmed. Where it must advance first — because the same write also serves a non-notification purpose — every path between "state advanced" and "message delivered" must be treated as a delivery path, not as a generic error path.**

Four checkable consequences, all of which the Rules Radar now satisfies:

1. **Do not gate delivery on the exit status of the step that advanced the state.** A process can fail for reasons unrelated to the notification after having already committed the dedupe key. Gate on an artifact that is written *only* on the success path you actually care about, and let the artifact's absence be the failure signal.
2. **A once-per-state send needs an in-band retry.** There is no natural redelivery: the next scheduled run will compute "state unchanged" and stay silent. One transient SMTP hiccup, with no retry, permanently consumes the alarm.
3. **Post-advance writes must overwrite, not create-exclusively.** A create-exclusive (`wx`) write that collides with a leftover file from an earlier attempt converts a rerun into a permanent loss. Create-exclusive is right for artifacts whose duplication is itself the bug; it is wrong for anything written after the state edge moved.
4. **When a post-advance step does fail, the log must name the divergence.** "Sync failed" and "the issue advanced to fingerprint X but the alarm for X will never send" demand completely different human responses, and a red CI run alone does not distinguish them.

**A fifth rule, about the dedupe predicate itself:** "the fingerprint changed" is not the same claim as "there is something new to review." A hash inequality is satisfied by removal as well as by addition. If the notification's subject line asserts *new* state, the predicate must require at least one element absent from the previous state, not merely a different digest.

**And the review technique that catches this class:** for any test that asserts a workflow or config file's wiring, run the mutation in your head or in the tree — *invert the guard, delete the step, swap the pin; does a test go red?* A `toContain('alarm.json')` against a whole YAML file is satisfied by any mention of that filename anywhere in the file, including an unrelated artifact-upload list. It asserts the string exists, not that the wiring works.

## Why This Matters

The failure is silent, permanent, and self-concealing, which is the worst combination available.

- **Silent:** the alarm email is the only channel that means "shipped rules text may be wrong until this is reconciled" (`src/aos4/radar/alarm.ts:60-86`). When it does not arrive, nothing else says the material change happened. The managed issue does get updated, but the design's premise is that the maintainer is pulled to the issue *by the email*.
- **Permanent:** because the notifier is once-per-state by design, the next run reads the advanced fingerprint and returns `send: false, reason: 'material state unchanged'` (`src/aos4/radar/alarm.ts:43-45`). There is no second chance, and no `--force`-style flag exists on the notify command (see the complete flag set in `parseRulesRadarNotifyArguments`, `src/aos4/radar/rulesRadarNotifyCommand.ts:58-89`). The only lever that resets the fingerprint is the runbook's manual issue-recovery path — restoring or replacing the managed issue body (`docs/data/aos4-maintenance.md`, "Rules Radar" issue-recovery guidance) — which a maintainer will only reach for if they already know an alarm was lost.
- **Self-concealing:** the residual signal is a red workflow run. The Radar's failure backstop fails the job whenever any tracked step failed (`.github/workflows/aos4-rules-radar.yml`, "Preserve Rules Radar failure"), but a red scheduled job on an observer that routinely tolerates transient source failures is exactly the signal a human learns to skim. Nothing in that red run says "and an alarm was lost."

There is also a compounding irony worth remembering: defect 1 below fired precisely on the churn the material fingerprint was *designed* to tolerate. Transient operational noise was supposed to be the harmless case; the exit-code gate turned it into the trigger for permanent loss. Hardening one layer against noise does not help if a different layer still treats that noise as fatal.

## When to Apply

Reach for this rule whenever you are writing or reviewing something with all three of these properties:

- a **dedupe key or watermark** persisted somewhere durable (an issue body, a state file, a DB column, a cache entry, a git tag),
- a **notification, email, webhook, or other externally-visible delivery** gated on that key changing,
- and **no natural redelivery** — the next run recomputes the key and concludes there is nothing to do.

Specific review prompts:

- Trace the code from "durable write" to "message sent." Every `throw`, every nonzero exit, every `continue-on-error`, every file write in between is a potential silent loss. Name them.
- Ask what the process's exit code actually encodes. In this codebase the notify command's nonzero exit means "operational events were observed," not "the notification failed" (`src/aos4/radar/rulesRadarNotifyCommand.ts:193` and `:231`). Anything gating on that exit code has confused two meanings.
- Ask what happens on a **rerun** of the same workflow run: which files already exist, and does the code create-exclusively over them?
- Ask whether the notification's own claim ("new state to review") is actually implied by the predicate that triggers it.
- For every config-file assertion in the test suite: what mutation would make this fail? If you cannot name one, the assertion is decorative.

This does **not** apply to at-least-once notifiers, where duplicate delivery is acceptable and the correct fix is idempotency at the receiver rather than ordering at the sender.

## Examples

Examples 1-4 are the four defects, which came out of the multi-agent review of PR #1968 — independently from the correctness reviewer, the reliability reviewer, and a cross-model adversarial pass (Codex). Example 5 is the review-technique lesson that came with them, not a fifth defect. All were fixed in the review-fix work squashed into #1968 (merged 2026-08-18 as `e180b822`); the pre-fix code below is quoted from that PR's branch history and does not exist on `master`.

### 1. Operational churn swallowed the alarm (the exit-code gate)

*Pre-fix*, the email evaluation step carried an extra branch ahead of the artifact check:

```bash
elif [[ "${{ steps.notify.outcome }}" != "success" ]]; then
  echo "::warning::Issue synchronization failed; skipping the material alarm email."
```

But `steps.notify` runs the notify command, which deliberately exits nonzero when operational events exist — `if (result.operationalFailure) process.exitCode = 1` (`src/aos4/radar/rulesRadarNotifyCommand.ts:231`), with `operationalFailure` derived purely from `report.operationalEventCount > 0` (`:193`) — and it does so *after* `synchronizeRulesRadarIssue` has already advanced the fingerprint in the issue body. So a material change arriving alongside any operational churn wrote `send: true` into `alarm.json`, the mail step was skipped by the outcome gate, and the next run computed "material state unchanged." Permanently lost.

*Fixed:* the outcome branch is deleted. `alarm.json`'s existence is the authoritative signal, because it is written only after a successful sync, and the pre-existing `! -f "$alarm_file"` branch already covers genuine sync failures (`.github/workflows/aos4-rules-radar.yml:212-226`).

### 2. No retry on the send

*Pre-fix*, the send step was `uses: dawidd6/action-send-mail@v3` with `continue-on-error: true` and nothing after it. One transient SMTP failure consumed the alarm.

*Fixed:* a 30-second wait step plus a second, identical send step gated on the first one's failure (`.github/workflows/aos4-rules-radar.yml:246-267`), and the failure backstop now keys on the retry's outcome — `"${{ steps.alarm_email_retry.outcome }}"` in the outcome list (`:345`) — so the job goes red only if both attempts failed. The action is also SHA-pinned (`dawidd6/action-send-mail@2cea9617b09d79a095af21254fbcb7ae95903dde # v3.12.0`, `:232` and `:255`) since it receives the SMTP credentials; a mutable tag on a credential-consuming action is a supply-chain hole.

Note what the retry does *not* buy: it is same-run only. A failure that outlives the run still loses the alarm, and there is still no force-resend flag. The retry narrows the window; the artifact-authoritative gate is what removes the common cause.

### 3. Write failure after sync

*Pre-fix*, all three alarm artifacts were written with the create-exclusive helper (`writeNew`, flag `wx`) and `writeAlarmArtifacts` was called bare, with no `try`. If it threw after the sync succeeded — a `wx` collision on a rerun, a disk error, a permissions problem — the fingerprint had advanced with no artifacts and no email, and the failure was indistinguishable from a generic sync error.

*Fixed*, in `src/aos4/radar/rulesRadarNotifyCommand.ts`:

- a separate `writeReplace` helper with flag `w` for alarm artifacts (`:105-109`), while the managed issue body keeps `wx` via `writeNew` (`:102-103`, used at `:160`) — the distinction is deliberate and the comment says why;
- stale `alarm-subject.txt` / `alarm-body.md` are removed on no-material runs so the workflow cannot mail the wrong text beside a `send: false` decision (`:141-147`), covered by `src/tests/aos4/rulesRadarNotifyCommand.test.ts:64-68`;
- the write is wrapped so a failure logs the exact divergence before rethrowing (`:174-188`): *"alarm artifacts failed to persist after the managed issue advanced to material fingerprint X; the alarm for this state will not re-send on later runs."*

Relaxing `wx` to `w` was independently checked for a file-seeding vulnerability during a security review of these changes: the alarm output directory resolves to a per-run directory under the workflow's `RUN_ROOT`, so there is no attacker-controlled path to pre-seed (session history, 2026-08-18 security review).

### 4. The predicate did not mean what the email said

*Pre-fix*, `decideRulesRadarAlarm` sent on any material-fingerprint inequality. A removal-only change — one outstanding event resolving while others persist — shifts the hash, so it emailed a high-priority "new material state to review" alarm whose body listed only already-known events.

*Fixed* (`src/aos4/radar/alarm.ts:46-49`): after the unchanged check, the decision requires at least one material event absent from the previous state, using the new `createRadarMaterialEventKeys` helper (`src/aos4/radar/compare.ts:513-516`, the same per-event projection the fingerprint hashes, kept individually):

```ts
const previousKeys = new Set(createRadarMaterialEventKeys(previous))
if (createRadarMaterialEventKeys(report).every(key => previousKeys.has(key))) {
  return { send: false, reason: 'material state shrank without new events', ...base }
}
```

Both directions are pinned by tests: removal-only stays silent (`src/tests/aos4/rulesRadarAlarm.test.ts:133-156`) and a same-count *replacement* still alarms (`:158-175`), which is the case a naive count comparison would have gotten wrong.

### 5. The review lesson: decorative workflow assertions

The workflow-contract test already "covered" the alarm wiring before the review. It did so like this:

```ts
expect(workflow).toContain('alarm.json')
expect(workflow).toContain('alarm-subject.txt')
expect(workflow).toContain('alarm-body.md')
```

Those filenames also appear in the unrelated `Upload Rules Radar evidence` step's path list (`.github/workflows/aos4-rules-radar.yml:285-287`, `:296-298`). Deleting the alarm evaluation entirely would have left all three assertions green. The mutation test — *invert the guard; does a test fail?* — is what exposes this in seconds.

*Fixed* (`src/tests/aos4/rulesRadarWorkflow.test.ts:61-100`): every assertion is anchored to the step that consumes the file, and the loss path is pinned negatively —

```ts
expect(workflow).toMatch(
  /name: Evaluate material alarm email[\s\S]{0,900}alarm_file="\$report_directory\/alarm\.json"/
)
expect(workflow).not.toContain('Issue synchronization failed; skipping the material alarm email.')
expect(workflow).not.toMatch(/name: Evaluate material alarm email[\s\S]{0,1600}steps\.notify\.outcome/)
```

with the same anchoring applied to the SHA pin (`:85-88`, including `not.toMatch(/dawidd6\/action-send-mail@v3\b/)` to bar a regression to the mutable tag) and to the retry step (`:93-96`). The comment above the block records *why* the negative assertions exist, so a future author who deletes them has to argue with the reasoning rather than with a bare regex.

## Related

- [Deploy-script fidelity gaps](deploy-script-fidelity-gaps.md) — prior art on the same methodological point from a different subject area: a guard that stays green while the real action fails, and the mutation test as the decisive check. That doc's failures came from a test double diverging from production; this one's from a gate keyed on a proxy signal rather than the confirmed effect. Read together, they are the repo's two worked examples of "the check passed, the thing did not happen."
- Issue [#1757](https://github.com/daviseford/aos-reminders/issues/1757) — the managed Rules Radar issue whose body holds the material fingerprint this learning concerns.
- Issue [#1967](https://github.com/daviseford/aos-reminders/issues/1967) — the feature request that introduced the alarm email.
- PR [#1968](https://github.com/daviseford/aos-reminders/pull/1968) — the PR whose review surfaced all four defects; the fixes are squashed into it.

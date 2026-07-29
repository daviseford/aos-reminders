interface GuidedReviewPageInput {
  nonce: string
  token: string
}

export const guidedReviewPage = ({ nonce, token }: GuidedReviewPageInput): string => `<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
    <meta name="color-scheme" content="light">
    <title>AoS Reminders · Human review desk</title>
    <style nonce="${nonce}">
      :root {
        --ink: oklch(24% 0.035 235);
        --ink-soft: oklch(43% 0.028 235);
        --navy: #063647;
        --navy-deep: #182633;
        --blue: #1c7595;
        --blue-soft: oklch(94% 0.025 225);
        --yellow: #e0d51f;
        --paper: oklch(98% 0.009 220);
        --surface: oklch(99.5% 0.004 220);
        --line: oklch(83% 0.018 225);
        --success: oklch(46% 0.105 151);
        --danger: #a12f48;
        --space-1: 0.25rem;
        --space-2: 0.5rem;
        --space-3: 0.75rem;
        --space-4: 1rem;
        --space-6: 1.5rem;
        --space-8: 2rem;
        --space-12: 3rem;
        --radius: 0.25rem;
        --shadow: 0 0.75rem 2rem oklch(24% 0.035 235 / 0.1);
      }

      * { box-sizing: border-box; }

      html {
        min-height: 100%;
        background: var(--paper);
      }

      body {
        min-height: 100vh;
        margin: 0;
        color: var(--ink);
        background:
          linear-gradient(90deg, transparent 0 48%, oklch(89% 0.018 225 / 0.25) 48% 48.15%, transparent 48.15%),
          var(--paper);
        font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", "Roboto", "Helvetica Neue", sans-serif;
        font-size: 1rem;
        line-height: 1.5;
        -webkit-font-smoothing: antialiased;
      }

      button, input, select, textarea { font: inherit; }
      button, select { min-height: 2.75rem; }
      button { cursor: pointer; }
      button:disabled { cursor: not-allowed; opacity: 0.55; }

      :focus-visible {
        outline: 0.1875rem solid var(--yellow);
        outline-offset: 0.1875rem;
      }

      .skip-link {
        position: fixed;
        z-index: 10;
        top: var(--space-3);
        left: var(--space-3);
        padding: var(--space-3) var(--space-4);
        transform: translateY(-200%);
        background: var(--surface);
        color: var(--navy);
      }
      .skip-link:focus { transform: translateY(0); }

      .masthead {
        color: oklch(96% 0.012 220);
        background: var(--navy);
        border-bottom: 0.25rem solid var(--yellow);
      }

      .masthead-inner {
        width: min(100% - 2rem, 82rem);
        min-height: 5.5rem;
        margin-inline: auto;
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: var(--space-6);
      }

      .brand {
        display: flex;
        align-items: center;
        gap: var(--space-4);
      }

      .brand img {
        width: 4.5rem;
        height: 3rem;
        object-fit: cover;
        object-position: center 45%;
      }

      .brand-kicker {
        margin: 0 0 var(--space-1);
        color: oklch(80% 0.055 220);
        font-size: 0.75rem;
        font-weight: 700;
        letter-spacing: 0.11em;
        text-transform: uppercase;
      }

      .brand-title {
        margin: 0;
        font-size: 1.25rem;
        font-weight: 650;
        letter-spacing: -0.015em;
      }

      .stage-badge {
        display: inline-flex;
        align-items: center;
        gap: var(--space-2);
        min-height: 2.25rem;
        padding: var(--space-2) var(--space-3);
        color: var(--navy-deep);
        background: var(--yellow);
        border-radius: 999px;
        font-size: 0.8125rem;
        font-weight: 750;
      }

      .stage-badge::before {
        content: "";
        width: 0.5rem;
        height: 0.5rem;
        border-radius: 50%;
        background: var(--navy);
      }

      .shell {
        width: min(100% - 2rem, 82rem);
        margin-inline: auto;
        padding-block: var(--space-8) max(var(--space-12), env(safe-area-inset-bottom));
      }

      .loading {
        min-height: 24rem;
        display: grid;
        place-items: center;
        color: var(--ink-soft);
      }

      .review-layout {
        display: grid;
        gap: var(--space-8);
      }

      .progress-panel {
        display: grid;
        gap: var(--space-4);
        align-content: start;
      }

      .progress-copy p { margin: 0; }
      .progress-label {
        color: var(--blue);
        font-size: 0.8125rem;
        font-weight: 750;
        letter-spacing: 0.08em;
        text-transform: uppercase;
      }
      .progress-count {
        margin-top: var(--space-1) !important;
        font-size: 1.25rem;
        font-weight: 700;
        font-variant-numeric: tabular-nums;
      }

      .progress-track {
        width: 100%;
        height: 0.5rem;
        overflow: hidden;
        appearance: none;
        border: 0;
        background: oklch(89% 0.018 225);
        border-radius: 999px;
      }
      .progress-track::-webkit-progress-bar {
        background: oklch(89% 0.018 225);
        border-radius: 999px;
      }
      .progress-track::-webkit-progress-value {
        background: var(--blue);
        border-radius: 999px;
        transition: width 240ms cubic-bezier(0.22, 1, 0.36, 1);
      }
      .progress-track::-moz-progress-bar {
        background: var(--blue);
        border-radius: 999px;
        transition: width 240ms cubic-bezier(0.22, 1, 0.36, 1);
      }

      .task-rail {
        display: flex;
        gap: var(--space-2);
        overflow-x: auto;
        padding: var(--space-1);
      }

      .task-dot {
        flex: 0 0 2.75rem;
        width: 2.75rem;
        min-height: 2.75rem;
        border: 1px solid var(--line);
        border-radius: 50%;
        color: var(--ink-soft);
        background: var(--surface);
        font-weight: 700;
      }
      .task-dot[aria-current="step"] {
        color: oklch(98% 0.01 220);
        background: var(--navy);
        border-color: var(--navy);
      }
      .task-dot[data-complete="true"]::after {
        content: "✓";
        display: inline-block;
        margin-left: 0.15rem;
        color: var(--success);
        font-size: 0.75rem;
      }
      .task-dot[aria-current="step"][data-complete="true"]::after { color: var(--yellow); }

      .protocol-note {
        margin: 0;
        padding: var(--space-4);
        color: var(--ink-soft);
        background: var(--blue-soft);
        border-left: 0.25rem solid var(--blue);
        font-size: 0.875rem;
      }
      .protocol-note strong {
        display: block;
        margin-bottom: var(--space-1);
        color: var(--ink);
      }

      .work-area {
        min-width: 0;
        background: var(--surface);
        border: 1px solid var(--line);
        box-shadow: var(--shadow);
      }

      .work-header {
        padding: var(--space-6);
        border-bottom: 1px solid var(--line);
      }

      .eyebrow {
        margin: 0 0 var(--space-2);
        color: var(--blue);
        font-size: 0.75rem;
        font-weight: 750;
        letter-spacing: 0.1em;
        text-transform: uppercase;
      }

      .work-title {
        max-width: 24ch;
        margin: 0;
        font-family: Georgia, "Times New Roman", serif;
        font-size: clamp(1.75rem, 5vw, 2.5rem);
        font-weight: 500;
        line-height: 1.08;
        letter-spacing: -0.035em;
      }

      .work-subtitle {
        max-width: 65ch;
        margin: var(--space-3) 0 0;
        color: var(--ink-soft);
      }

      .review-guide {
        display: grid;
        gap: var(--space-2);
        margin-top: var(--space-6);
        padding: var(--space-4);
        color: var(--ink-soft);
        background: var(--blue-soft);
        border-left: 0.25rem solid var(--blue);
      }
      .review-guide strong { color: var(--ink); }
      .review-guide p { margin: 0; }

      .section {
        padding: var(--space-6);
        border-bottom: 1px solid var(--line);
      }

      .section:last-child { border-bottom: 0; }
      .section-heading {
        margin: 0 0 var(--space-4);
        font-size: 1rem;
        font-weight: 750;
      }

      .evidence-stack { display: grid; gap: var(--space-6); }
      .evidence-record { min-width: 0; }
      .evidence-meta {
        display: flex;
        flex-wrap: wrap;
        align-items: center;
        gap: var(--space-2);
        margin-bottom: var(--space-3);
      }

      .authority {
        display: inline-flex;
        min-height: 1.75rem;
        align-items: center;
        padding-inline: var(--space-3);
        color: oklch(98% 0.008 220);
        background: var(--blue);
        border-radius: 999px;
        font-size: 0.75rem;
        font-weight: 750;
        text-transform: capitalize;
      }

      .source-location {
        color: var(--ink-soft);
        font-size: 0.8125rem;
      }

      .evidence-data {
        margin: 0;
        display: grid;
        grid-template-columns: minmax(8rem, 0.35fr) minmax(0, 1fr);
        border-top: 1px solid var(--line);
      }

      .evidence-data dt,
      .evidence-data dd {
        margin: 0;
        padding: var(--space-3) var(--space-4);
        border-bottom: 1px solid var(--line);
        overflow-wrap: anywhere;
      }
      .evidence-data dt {
        color: var(--ink-soft);
        background: var(--blue-soft);
        font-size: 0.8125rem;
        font-weight: 700;
      }
      .evidence-data dd { white-space: pre-wrap; }

      .evidence-plain {
        margin: 0;
        padding: var(--space-4);
        white-space: pre-wrap;
        overflow-wrap: anywhere;
        background: var(--blue-soft);
        border: 1px solid var(--line);
      }

      .evidence-empty {
        padding: var(--space-4);
        color: var(--ink-soft);
        background: oklch(96% 0.025 105);
        border: 1px solid oklch(80% 0.08 105);
      }
      .evidence-empty strong {
        display: block;
        margin-bottom: var(--space-1);
        color: var(--ink);
      }
      .evidence-empty p { margin: 0; }

      details { margin-top: var(--space-4); color: var(--ink-soft); }
      summary { min-height: 2.75rem; cursor: pointer; font-size: 0.8125rem; }
      .technical-data { overflow-wrap: anywhere; font-size: 0.75rem; }

      .answer-grid { display: grid; gap: var(--space-6); }
      .field-group { display: grid; gap: var(--space-2); }
      .field-group label,
      .fieldset-label { font-weight: 700; }
      .hint {
        margin: 0;
        color: var(--ink-soft);
        font-size: 0.8125rem;
      }
      .answer-prompt {
        margin: 0 0 var(--space-6);
        color: var(--ink-soft);
      }

      input, select, textarea {
        width: 100%;
        color: var(--ink);
        background: var(--surface);
        border: 1px solid oklch(70% 0.025 225);
        border-radius: var(--radius);
      }
      input, select { padding: var(--space-3) var(--space-4); }
      textarea {
        min-height: 7rem;
        padding: var(--space-4);
        resize: vertical;
      }
      input[aria-invalid="true"],
      select[aria-invalid="true"],
      textarea[aria-invalid="true"] {
        border-color: var(--danger);
        box-shadow: 0 0 0 0.125rem oklch(52% 0.14 15 / 0.15);
      }

      fieldset {
        min-width: 0;
        margin: 0;
        padding: 0;
        border: 0;
      }
      legend { padding: 0; }

      .decision-list {
        display: grid;
        gap: var(--space-3);
        margin-top: var(--space-3);
      }

      .decision {
        position: relative;
        display: grid;
        grid-template-columns: auto 1fr;
        gap: var(--space-3);
        align-items: start;
        min-height: 4.5rem;
        padding: var(--space-4);
        border: 1px solid var(--line);
        border-radius: var(--radius);
        cursor: pointer;
      }
      .decision:has(input:checked) {
        background: var(--blue-soft);
        border-color: var(--blue);
        box-shadow: inset 0 0 0 1px var(--blue);
      }
      .decision input { width: 1.125rem; height: 1.125rem; margin-top: 0.2rem; }
      .decision strong { display: block; }
      .decision span { color: var(--ink-soft); font-size: 0.875rem; }

      .error-summary {
        display: none;
        margin: 0;
        padding: var(--space-4);
        color: oklch(37% 0.14 15);
        background: oklch(94% 0.035 15);
        border-left: 0.25rem solid var(--danger);
      }
      .error-summary[data-visible="true"] { display: block; }

      .actions {
        display: flex;
        flex-wrap: wrap;
        justify-content: space-between;
        gap: var(--space-3);
        padding: var(--space-6);
        background: oklch(96% 0.012 225);
      }

      .action-group { display: flex; flex-wrap: wrap; gap: var(--space-3); }
      .button {
        min-width: 8rem;
        padding: var(--space-3) var(--space-6);
        border: 1px solid var(--navy);
        border-radius: var(--radius);
        font-weight: 750;
      }
      .button-primary {
        color: oklch(98% 0.008 220);
        background: var(--navy);
      }
      .button-primary:hover { background: var(--blue); border-color: var(--blue); }
      .button-secondary { color: var(--navy); background: transparent; }
      .button-secondary:hover { background: var(--surface); }
      .button-seal {
        color: var(--navy-deep);
        background: var(--yellow);
        border-color: oklch(69% 0.12 105);
      }
      .button-seal:hover { background: oklch(84% 0.15 105); }

      .complete-state {
        min-height: 32rem;
        display: grid;
        place-items: center;
        padding: var(--space-8);
        text-align: center;
      }
      .complete-mark {
        width: 4rem;
        height: 4rem;
        margin-inline: auto;
        display: grid;
        place-items: center;
        color: oklch(98% 0.008 220);
        background: var(--success);
        border-radius: 50%;
        font-size: 1.75rem;
      }
      .complete-state h1 {
        margin: var(--space-6) 0 var(--space-3);
        font-family: Georgia, "Times New Roman", serif;
        font-size: 2rem;
        font-weight: 500;
      }
      .complete-state p { max-width: 52ch; margin: 0; color: var(--ink-soft); }

      @media (min-width: 52rem) {
        .review-layout { grid-template-columns: 15rem minmax(0, 1fr); }
        .progress-panel { position: sticky; top: var(--space-6); }
        .task-rail {
          max-height: 21rem;
          display: grid;
          grid-template-columns: repeat(4, 2.75rem);
          overflow-y: auto;
          overscroll-behavior: contain;
        }
        .answer-grid { grid-template-columns: repeat(2, minmax(0, 1fr)); }
        .answer-grid .wide { grid-column: 1 / -1; }
      }

      @media (pointer: coarse) {
        .button, .task-dot, summary { min-height: 3rem; }
      }

      @media (prefers-reduced-motion: reduce) {
        *, *::before, *::after {
          scroll-behavior: auto !important;
          transition-duration: 0.01ms !important;
        }
      }
    </style>
  </head>
  <body>
    <a class="skip-link" href="#main-content">Skip to review question</a>
    <header class="masthead">
      <div class="masthead-inner">
        <div class="brand">
          <img src="/logo.png?token=${token}" alt="">
          <div>
            <p class="brand-kicker">AoS Reminders</p>
            <p class="brand-title">Human review desk</p>
          </div>
        </div>
        <span class="stage-badge" id="stage-badge">Blind review</span>
      </div>
    </header>
    <main class="shell" id="main-content">
      <div class="loading" id="app" role="status">Opening the sealed review assignment…</div>
    </main>
    <script nonce="${nonce}">
      (() => {
        const token = ${JSON.stringify(token)};
        const app = document.querySelector('#app');
        const stageBadge = document.querySelector('#stage-badge');
        const api = async (path, options = {}) => {
          const response = await fetch(path, {
            ...options,
            headers: {
              'content-type': 'application/json',
              'x-aos4-review-token': token,
              ...(options.headers || {}),
            },
          });
          const data = await response.json().catch(() => ({}));
          if (!response.ok) throw new Error(data.error || 'The review desk could not complete that action.');
          return data;
        };

        const element = (tag, className, text) => {
          const node = document.createElement(tag);
          if (className) node.className = className;
          if (text !== undefined) node.textContent = text;
          return node;
        };

        const displayValue = value => {
          if (typeof value === 'string') return value;
          if (value === null) return 'null';
          return JSON.stringify(value, null, 2);
        };

        const parsedEvidence = content => {
          const trimmed = content.trim();
          try { return JSON.parse(trimmed); } catch { return trimmed; }
        };

        const locationLabel = locator => {
          if (!locator) return 'Source locator recorded';
          const parts = [];
          if (locator.page !== undefined) parts.push('Page ' + locator.page);
          if (locator.row !== undefined) parts.push('Row ' + locator.row);
          if (locator.key !== undefined) parts.push(String(locator.key));
          if (!parts.length && locator.kind) parts.push(locator.kind);
          return parts.filter(Boolean).join(' · ');
        };

        const humanize = value => value
          .replace(/([a-z0-9])([A-Z])/g, '$1 $2')
          .replace(/[_-]+/g, ' ')
          .replace(/^./, character => character.toUpperCase());

        const evidenceLabel = key => ({
          field: 'Review topic',
          official: 'Games Workshop says',
          secondary: 'Wahapedia says',
        })[key] || humanize(key);

        const evidenceValue = (key, value) =>
          key === 'field' && typeof value === 'string' ? humanize(value) : displayValue(value);

        const authorityLabel = authority => ({
          official: 'Games Workshop · official',
          secondary: 'Wahapedia · secondary',
          community: 'Community source',
          unknown: 'Source authority unclear',
        })[authority] || humanize(authority || 'source');

        const inferField = task => {
          for (const block of task.evidence) {
            const parsed = parsedEvidence(block.content);
            if (parsed && typeof parsed === 'object' && !Array.isArray(parsed) && typeof parsed.field === 'string') {
              return parsed.field;
            }
          }
          const cohortField = task.blindPacket.cohortIds
            .find(cohort => cohort.startsWith('reconciliation-field:'))
            ?.slice('reconciliation-field:'.length);
          if (cohortField) return cohortField;
          return task.blindPacket.sourceEvidence.some(source => source.authority === 'official')
            ? 'officialRecord'
            : 'sourceValue';
        };

        const questionFor = task => {
          const field = inferField(task);
          if (field === 'regimentOptions') return 'What regiment options does this source establish?';
          if (
            field === 'officialRecord' &&
            task.evidence.some(block => /regiment\\s+of\\s+renown/i.test(block.content))
          ) {
            return 'Which Regiments of Renown are listed, and what does the source say about each?';
          }
          if (field === 'officialRecord') {
            return 'What game information does this official source establish?';
          }
          if (field === 'sourceValue') return 'What game information does this source establish?';
          return 'What does the source establish about ' + humanize(field).toLowerCase() + '?';
        };

        const inferAuthority = task => {
          const authorities = task.blindPacket.sourceEvidence.map(item => item.authority);
          if (authorities.includes('official')) return 'official';
          return authorities[0] || 'unknown';
        };

        const renderEvidence = task => {
          const stack = element('div', 'evidence-stack');
          if (!task.evidence.length) {
            const empty = element('div', 'evidence-empty');
            empty.append(
              element('strong', '', 'No source excerpt was supplied.'),
              element(
                'p',
                '',
                'There is nothing to read for this question. Do not guess; choose “No” below and explain that the excerpt is missing.'
              )
            );
            stack.append(empty);
            return stack;
          }
          task.evidence.forEach((block, index) => {
            const record = element('article', 'evidence-record');
            const source = task.blindPacket.sourceEvidence[index] || {};
            const meta = element('div', 'evidence-meta');
            meta.append(
              element('span', 'authority', authorityLabel(source.authority)),
              element('span', 'source-location', locationLabel(source.locator))
            );
            record.append(meta);
            const parsed = parsedEvidence(block.content);
            if (parsed && typeof parsed === 'object' && !Array.isArray(parsed)) {
              const list = element('dl', 'evidence-data');
              Object.entries(parsed)
                .filter(([key]) => !['officialSourceRecordId', 'sourceRecordId', 'url'].includes(key))
                .forEach(([key, value]) => {
                  list.append(
                    element('dt', '', evidenceLabel(key)),
                    element('dd', '', evidenceValue(key, value))
                  );
                });
              if (list.children.length) record.append(list);
            } else if (displayValue(parsed).trim()) {
              record.append(element('pre', 'evidence-plain', displayValue(parsed)));
            } else {
              const empty = element('div', 'evidence-empty');
              empty.append(
                element('strong', '', 'No source excerpt was supplied.'),
                element('p', '', 'Do not guess. Choose “No” below because there is nothing here to verify.')
              );
              record.append(empty);
            }
            const details = document.createElement('details');
            const technical = parsed && typeof parsed === 'object' && !Array.isArray(parsed)
              ? Object.entries(parsed).filter(([key]) =>
                  ['officialSourceRecordId', 'sourceRecordId', 'url'].includes(key)
                )
              : [];
            details.append(
              element('summary', '', 'Technical source details'),
              ...technical.map(([key, value]) =>
                element('p', 'technical-data', evidenceLabel(key) + ': ' + displayValue(value))
              ),
              element('p', 'technical-data', source.sourceRecordId || block.ref),
              element('p', 'technical-data', source.recordChecksum || 'Evidence checksum is bound in the packet.')
            );
            record.append(details);
            stack.append(record);
          });
          return stack;
        };

        const stageName = stage => stage === 'calibration-blind'
          ? 'Practice · source reading'
          : 'Accuracy review · source reading';

        const load = async () => {
          try {
            const session = await api('/api/session');
            if (session.outputExists) {
              renderComplete('Answers already sealed', 'This review stage has a create-only result file. Return to the terminal so the comparison stage can be revealed.');
              return;
            }
            renderReview(session);
          } catch (error) {
            renderFatal(error.message);
          }
        };

        const renderFatal = message => {
          app.className = 'work-area';
          app.replaceChildren();
          const state = element('section', 'complete-state');
          state.append(
            element('div', 'complete-mark', '!'),
            element('h1', '', 'The review desk could not open'),
            element('p', '', message)
          );
          app.append(state);
        };

        const renderComplete = (title, message) => {
          app.className = 'work-area';
          app.replaceChildren();
          stageBadge.textContent = 'Stage sealed';
          const state = element('section', 'complete-state');
          state.append(
            element('div', 'complete-mark', '✓'),
            element('h1', '', title),
            element('p', '', message)
          );
          app.append(state);
        };

        const renderReview = session => {
          const tasks = session.tasks;
          const storageKey = 'aos4-guided-review:' + session.assignmentId + ':' + session.stage + ':' + tasks[0].blindPacket.id;
          let drafts = {};
          try { drafts = JSON.parse(localStorage.getItem(storageKey) || '{}'); } catch { drafts = {}; }
          let current = 0;
          stageBadge.textContent = stageName(session.stage);

          app.className = 'review-layout';
          app.replaceChildren();

          const progressPanel = element('aside', 'progress-panel');
          const progressCopy = element('div', 'progress-copy');
          progressCopy.append(
            element('p', 'progress-label', 'Review progress'),
            element('p', 'progress-count')
          );
          const track = document.createElement('progress');
          track.className = 'progress-track';
          track.max = tasks.length;
          track.value = 0;
          track.setAttribute('aria-label', 'Completed review questions');
          const rail = element('nav', 'task-rail');
          rail.setAttribute('aria-label', 'Review questions');
          const protocol = element('div', 'protocol-note');
          protocol.append(
            element('strong', '', 'Step 1 of 2: use the source only'),
            element(
              'span',
              '',
              'The website value stays hidden until every answer is saved. Do not try to find a problem yet.'
            )
          );
          progressPanel.append(progressCopy, track, rail, protocol);

          const work = element('article', 'work-area');
          const header = element('header', 'work-header');
          const eyebrow = element('p', 'eyebrow');
          const title = element('h1', 'work-title');
          const subtitle = element(
            'p',
            'work-subtitle',
            'This is a source-reading exercise, not a memory test. Everything you need must appear in the excerpt below.'
          );
          const guide = element('div', 'review-guide');
          guide.append(
            element('strong', '', 'How to answer'),
            element(
              'p',
              '',
              'If the excerpt answers the question, summarize the answer and point to the supporting words. If it does not, choose “No.” Never guess or fill gaps from memory.'
            )
          );
          header.append(eyebrow, title, subtitle, guide);

          const evidenceSection = element('section', 'section');
          evidenceSection.append(element('h2', 'section-heading', '1. Read this source excerpt'));

          const answerSection = element('section', 'section');
          const answerHeading = element('h2', 'section-heading', '2. Record what you can establish');
          const answerPrompt = element(
            'p',
            'answer-prompt',
            'At this stage, you are only recording what the source says. You will compare it with the website data afterward.'
          );
          const form = element('form', 'answer-grid');
          form.noValidate = true;

          const expectedGroup = element('div', 'field-group wide');
          const expectedLabel = element('label', '', 'In your own words, what does the source say?');
          expectedLabel.htmlFor = 'expected';
          const expectedInput = document.createElement('textarea');
          expectedInput.id = 'expected';
          expectedInput.rows = 4;
          expectedInput.placeholder = 'Summarize the relevant names, numbers, rule text, or other facts. You do not need to copy the whole excerpt.';
          const expectedHint = element(
            'p',
            'hint',
            'Include every detail that would matter if the website showed something different.'
          );
          expectedGroup.append(expectedLabel, expectedInput, expectedHint);

          const decisionGroup = element('fieldset', 'wide');
          const decisionLegend = element(
            'legend',
            'fieldset-label',
            'Can you answer the question from the excerpt above?'
          );
          const decisions = element('div', 'decision-list');
          const sufficient = decisionOption(
            'pass',
            'Yes — the source gives me enough information',
            'I can describe the relevant fact without relying on memory or assumptions.'
          );
          const insufficient = decisionOption(
            'cannot-verify',
            'No — the needed information is missing or unreadable',
            'Answering would require me to guess. This is a valid review result.'
          );
          decisions.append(sufficient.label, insufficient.label);
          decisionGroup.append(decisionLegend, decisions);

          const rationaleGroup = element('div', 'field-group wide');
          const rationaleLabel = element('label', '', 'Which part of the excerpt supports your decision?');
          rationaleLabel.htmlFor = 'rationale';
          const rationaleInput = document.createElement('textarea');
          rationaleInput.id = 'rationale';
          rationaleInput.rows = 5;
          rationaleInput.placeholder =
            'Point to the relevant phrase, number, or missing information. For example: “The excerpt lists 490 points and names four eligible factions.”';
          const rationaleHint = element(
            'p',
            'hint',
            'A short, specific explanation is enough. Stray PDF symbols and harmless formatting differences are not important.'
          );
          rationaleGroup.append(rationaleLabel, rationaleInput, rationaleHint);

          const errorSummary = element('p', 'error-summary wide');
          errorSummary.id = 'error-summary';
          errorSummary.setAttribute('role', 'alert');
          errorSummary.tabIndex = -1;
          form.append(decisionGroup, expectedGroup, rationaleGroup, errorSummary);
          answerSection.append(answerHeading, answerPrompt, form);

          const actions = element('footer', 'actions');
          const previous = button('Previous question', 'button button-secondary');
          const actionGroup = element('div', 'action-group');
          const next = button('Save answer and continue', 'button button-primary');
          const seal = button('Finish and lock answers', 'button button-seal');
          seal.hidden = true;
          actionGroup.append(next, seal);
          actions.append(previous, actionGroup);
          work.append(header, evidenceSection, answerSection, actions);
          app.append(progressPanel, work);

          const dots = tasks.map((_, index) => {
            const dot = button(String(index + 1), 'task-dot');
            dot.setAttribute('aria-label', 'Open review question ' + (index + 1));
            dot.addEventListener('click', () => {
              saveDraft(false);
              current = index;
              renderCurrent();
            });
            rail.append(dot);
            return dot;
          });

          const controls = {
            expectedInput,
            rationaleInput,
            sufficient: sufficient.input,
            insufficient: insufficient.input,
          };

          previous.addEventListener('click', () => {
            saveDraft(false);
            current = Math.max(0, current - 1);
            renderCurrent();
          });
          next.addEventListener('click', () => {
            if (!saveDraft(true)) return;
            current = Math.min(tasks.length - 1, current + 1);
            renderCurrent();
          });
          seal.addEventListener('click', async () => {
            if (!saveDraft(true)) return;
            const incomplete = tasks.find(task => !drafts[task.blindPacket.id]?.complete);
            if (incomplete) {
              current = tasks.indexOf(incomplete);
              renderCurrent();
              showError('Complete every question before sealing the result file.');
              return;
            }
            seal.disabled = true;
            seal.textContent = 'Sealing answers…';
            try {
              const responses = tasks.map(task => drafts[task.blindPacket.id].response);
              await api('/api/results', { method: 'POST', body: JSON.stringify({ responses }) });
              localStorage.removeItem(storageKey);
              renderComplete(
                'Source-reading answers locked',
                'Step 1 is complete. Your answers cannot change after the website values are revealed. Return to the terminal to open step 2.'
              );
            } catch (error) {
              seal.disabled = false;
              seal.textContent = 'Finish and lock answers';
              showError(error.message);
            }
          });

          [expectedInput, rationaleInput].forEach(control => {
            control.addEventListener('change', () => saveDraft(false));
            control.addEventListener('blur', () => saveDraft(false));
          });
          [sufficient.input, insufficient.input].forEach(control => {
            control.addEventListener('change', () => {
              syncOutcomeFields();
              saveDraft(false);
            });
            control.addEventListener('blur', () => saveDraft(false));
          });

          function decisionOption(value, heading, description) {
            const label = element('label', 'decision');
            const input = document.createElement('input');
            input.type = 'radio';
            input.name = 'outcome';
            input.value = value;
            const copy = element('span');
            copy.append(element('strong', '', heading), element('span', '', description));
            label.append(input, copy);
            return { label, input };
          }

          function button(label, className) {
            const result = element('button', className, label);
            result.type = 'button';
            return result;
          }

          function currentResponse() {
            const outcome = controls.insufficient.checked ? 'cannot-verify' : controls.sufficient.checked ? 'pass' : '';
            return {
              packetId: tasks[current].blindPacket.id,
              outcome,
              field: inferField(tasks[current]),
              expectedValue: controls.expectedInput.value.trim(),
              authority: outcome === 'cannot-verify' ? 'insufficient-evidence' : inferAuthority(tasks[current]),
              rationale: controls.rationaleInput.value.trim(),
              reviewedAt: new Date().toISOString(),
            };
          }

          function saveDraft(validate) {
            const response = currentResponse();
            const errors = validateResponse(response);
            const complete = errors.length === 0;
            drafts[response.packetId] = { response, complete };
            localStorage.setItem(storageKey, JSON.stringify(drafts));
            updateProgress();
            if (validate && errors.length) {
              showError(errors[0]);
              return false;
            }
            if (validate) clearError();
            return complete;
          }

          function validateResponse(response) {
            const errors = [];
            if (!response.outcome) errors.push('Choose “Yes” or “No” before continuing.');
            if (response.outcome === 'pass' && !response.expectedValue) {
              errors.push('Summarize what the source says before continuing.');
            }
            if (response.rationale.length < 20) {
              errors.push('Point to the supporting words or explain what information is missing.');
            }
            return errors;
          }

          function syncOutcomeFields() {
            controls.expectedInput.disabled = controls.insufficient.checked;
          }

          function showError(message) {
            errorSummary.textContent = message;
            errorSummary.dataset.visible = 'true';
            const invalidControl = firstInvalidControl();
            if (invalidControl) invalidControl.setAttribute('aria-invalid', 'true');
            errorSummary.focus();
          }

          function clearError() {
            errorSummary.textContent = '';
            errorSummary.dataset.visible = 'false';
            [expectedInput, rationaleInput].forEach(input => input.removeAttribute('aria-invalid'));
          }

          function firstInvalidControl() {
            const response = currentResponse();
            if (!response.outcome) return null;
            if (response.outcome === 'pass' && !response.expectedValue) return expectedInput;
            if (response.rationale.length < 20) return rationaleInput;
            return null;
          }

          function updateProgress() {
            const complete = tasks.filter(task => drafts[task.blindPacket.id]?.complete).length;
            progressCopy.querySelector('.progress-count').textContent = complete + ' of ' + tasks.length + ' answered';
            track.value = complete;
            dots.forEach((dot, index) => {
              dot.dataset.complete = String(Boolean(drafts[tasks[index].blindPacket.id]?.complete));
              if (index === current) dot.setAttribute('aria-current', 'step');
              else dot.removeAttribute('aria-current');
            });
            seal.hidden = complete !== tasks.length || current !== tasks.length - 1;
            next.hidden = current === tasks.length - 1;
          }

          function renderCurrent() {
            const task = tasks[current];
            const draft = drafts[task.blindPacket.id]?.response;
            eyebrow.textContent = stageName(session.stage) + ' · Question ' + (current + 1);
            title.textContent = questionFor(task);
            evidenceSection.replaceChildren(
              element('h2', 'section-heading', '1. Read this source excerpt'),
              renderEvidence(task)
            );
            controls.expectedInput.value = draft?.expectedValue || '';
            controls.rationaleInput.value = draft?.rationale || '';
            controls.sufficient.checked = draft?.outcome === 'pass';
            controls.insufficient.checked = draft?.outcome === 'cannot-verify';
            previous.disabled = current === 0;
            syncOutcomeFields();
            clearError();
            updateProgress();
            dots[current].scrollIntoView({ block: 'nearest', inline: 'nearest' });
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }

          renderCurrent();
        };

        load();
      })();
    </script>
  </body>
</html>`

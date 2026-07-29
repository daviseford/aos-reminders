interface GuidedComparisonPageInput {
  nonce: string
  token: string
}

export const guidedComparisonPage = ({ nonce, token }: GuidedComparisonPageInput): string => `<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
    <meta name="color-scheme" content="light">
    <title>AoS Reminders · Comparison review desk</title>
    <style nonce="${nonce}">
      :root {
        --ink: #182633;
        --muted: #52636f;
        --navy: #063647;
        --blue: #1c7595;
        --blue-soft: #e5f3f8;
        --yellow: #e0d51f;
        --paper: #f3fafc;
        --surface: #fff;
        --line: #bed0d8;
        --danger: #a12f48;
        --success: #277450;
      }
      * { box-sizing: border-box; }
      body {
        min-height: 100vh;
        margin: 0;
        color: var(--ink);
        background: var(--paper);
        font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", "Roboto", sans-serif;
        line-height: 1.5;
      }
      button, input, select, textarea { font: inherit; }
      button { cursor: pointer; }
      button:disabled { cursor: not-allowed; opacity: 0.55; }
      :focus-visible { outline: 3px solid var(--yellow); outline-offset: 3px; }
      .masthead {
        color: #f5fbfd;
        background: var(--navy);
        border-bottom: 4px solid var(--yellow);
      }
      .masthead-inner {
        width: min(100% - 2rem, 82rem);
        min-height: 5.5rem;
        margin: auto;
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 1rem;
      }
      .brand { display: flex; align-items: center; gap: 1rem; }
      .brand img { width: 4.5rem; height: 3rem; object-fit: cover; object-position: center 45%; }
      .kicker { margin: 0; color: #9ed5e8; font-size: 0.75rem; font-weight: 800; letter-spacing: 0.1em; text-transform: uppercase; }
      .brand-title { margin: 0.15rem 0 0; font-size: 1.25rem; font-weight: 700; }
      .badge { padding: 0.6rem 0.9rem; color: var(--navy); background: var(--yellow); border-radius: 999px; font-size: 0.8rem; font-weight: 800; }
      .shell { width: min(100% - 2rem, 82rem); margin: auto; padding: 2rem 0 4rem; }
      .loading { min-height: 24rem; display: grid; place-items: center; color: var(--muted); }
      .layout { display: grid; gap: 2rem; }
      .progress-panel { display: grid; gap: 1rem; align-content: start; }
      .progress-label { margin: 0; color: var(--blue); font-size: 0.8rem; font-weight: 800; letter-spacing: 0.08em; text-transform: uppercase; }
      .progress-count { margin: 0.2rem 0 0; font-size: 1.25rem; font-weight: 750; }
      progress { width: 100%; height: 0.5rem; appearance: none; border: 0; border-radius: 999px; background: #d7e4e9; }
      progress::-webkit-progress-bar { background: #d7e4e9; border-radius: 999px; }
      progress::-webkit-progress-value { background: var(--blue); border-radius: 999px; }
      progress::-moz-progress-bar { background: var(--blue); border-radius: 999px; }
      .task-rail { display: flex; gap: 0.5rem; overflow-x: auto; padding: 0.25rem; }
      .task-dot {
        flex: 0 0 2.75rem;
        width: 2.75rem;
        min-height: 2.75rem;
        color: var(--muted);
        background: var(--surface);
        border: 1px solid var(--line);
        border-radius: 50%;
        font-weight: 750;
      }
      .task-dot[aria-current="step"] { color: white; background: var(--navy); border-color: var(--navy); }
      .task-dot[data-complete="true"] { box-shadow: inset 0 -4px var(--success); }
      .note { margin: 0; padding: 1rem; color: var(--muted); background: var(--blue-soft); border-left: 4px solid var(--blue); font-size: 0.9rem; }
      .work { min-width: 0; background: var(--surface); border: 1px solid var(--line); box-shadow: 0 0.75rem 2rem rgba(6,54,71,0.1); }
      .work-header, .section, .actions { padding: 1.5rem; border-bottom: 1px solid var(--line); }
      .eyebrow { margin: 0 0 0.5rem; color: var(--blue); font-size: 0.75rem; font-weight: 800; letter-spacing: 0.1em; text-transform: uppercase; }
      h1 { max-width: 25ch; margin: 0; font-family: Georgia, "Times New Roman", serif; font-size: clamp(1.8rem, 5vw, 2.5rem); font-weight: 500; line-height: 1.08; }
      .subtitle { max-width: 65ch; margin: 0.75rem 0 0; color: var(--muted); }
      h2 { margin: 0 0 1rem; font-size: 1rem; }
      .comparison-grid { display: grid; gap: 1rem; }
      .value-card { min-width: 0; padding: 1rem; border: 1px solid var(--line); }
      .value-card h3 { margin: 0 0 0.75rem; color: var(--blue); font-size: 0.8rem; letter-spacing: 0.06em; text-transform: uppercase; }
      .value-card pre { margin: 0; white-space: pre-wrap; overflow-wrap: anywhere; font-family: inherit; }
      .destination { padding: 0.75rem 0; border-top: 1px solid var(--line); }
      .destination:first-of-type { padding-top: 0; border-top: 0; }
      .destination-title { margin: 0 0 0.4rem; font-weight: 750; }
      .destination-meta { margin: 0 0 0.4rem; color: var(--muted); font-size: 0.8rem; overflow-wrap: anywhere; }
      .source-excerpt { padding: 1rem; background: var(--blue-soft); border: 1px solid var(--line); }
      .source-empty { padding: 1rem; color: var(--muted); background: #fff8e0; border-left: 4px solid var(--yellow); }
      details { margin-top: 0.75rem; color: var(--muted); }
      summary { min-height: 2.75rem; cursor: pointer; font-size: 0.8rem; }
      fieldset { min-width: 0; margin: 0; padding: 0; border: 0; }
      legend, label { font-weight: 750; }
      .decisions { display: grid; gap: 0.75rem; margin-top: 0.75rem; }
      .decision { display: grid; grid-template-columns: auto 1fr; gap: 0.75rem; padding: 1rem; border: 1px solid var(--line); cursor: pointer; }
      .decision:has(input:checked) { background: var(--blue-soft); border-color: var(--blue); box-shadow: inset 0 0 0 1px var(--blue); }
      .decision input { width: 1.15rem; height: 1.15rem; margin-top: 0.2rem; }
      .decision strong { display: block; }
      .decision span span { color: var(--muted); font-size: 0.88rem; }
      .form-grid { display: grid; gap: 1.25rem; margin-top: 1.5rem; }
      .field { display: grid; gap: 0.45rem; }
      input, select, textarea { width: 100%; padding: 0.75rem 0.9rem; color: var(--ink); background: white; border: 1px solid #8ca5b0; border-radius: 0.25rem; }
      textarea { min-height: 7rem; resize: vertical; }
      .hint { margin: 0; color: var(--muted); font-size: 0.8rem; }
      .finding-fields { display: none; padding: 1rem; background: #fff8e0; border-left: 4px solid var(--yellow); }
      .finding-fields[data-visible="true"] { display: grid; gap: 1rem; }
      .choice-help { margin: 0 0 1rem; color: var(--muted); }
      .error { display: none; margin: 0; padding: 1rem; color: #7d2037; background: #fff0f3; border-left: 4px solid var(--danger); }
      .error[data-visible="true"] { display: block; }
      .actions { display: flex; flex-wrap: wrap; justify-content: space-between; gap: 0.75rem; background: #edf6f9; border-bottom: 0; }
      .action-group { display: flex; flex-wrap: wrap; gap: 0.75rem; }
      .button { min-width: 8rem; min-height: 2.75rem; padding: 0.7rem 1.25rem; border: 1px solid var(--navy); border-radius: 0.25rem; font-weight: 800; }
      .primary { color: white; background: var(--navy); }
      .secondary { color: var(--navy); background: transparent; }
      .seal { color: var(--navy); background: var(--yellow); }
      .complete { min-height: 28rem; display: grid; place-items: center; padding: 2rem; text-align: center; }
      .complete h1 { margin-bottom: 0.75rem; }
      .complete p { max-width: 52ch; margin: 0; color: var(--muted); }
      @media (min-width: 52rem) {
        .layout { grid-template-columns: 15rem minmax(0, 1fr); }
        .progress-panel { position: sticky; top: 1.5rem; }
        .task-rail { max-height: 21rem; display: grid; grid-template-columns: repeat(4, 2.75rem); overflow-y: auto; }
        .comparison-grid { grid-template-columns: repeat(2, minmax(0, 1fr)); }
        .form-grid { grid-template-columns: repeat(2, minmax(0, 1fr)); }
        .wide { grid-column: 1 / -1; }
      }
      @media (pointer: coarse) { .button, .task-dot, summary { min-height: 3rem; } }
      @media (prefers-reduced-motion: reduce) { * { scroll-behavior: auto !important; } }
    </style>
  </head>
  <body>
    <header class="masthead">
      <div class="masthead-inner">
        <div class="brand">
          <img src="/logo.png?token=${token}" alt="">
          <div><p class="kicker">AoS Reminders</p><p class="brand-title">Comparison review desk</p></div>
        </div>
        <span class="badge" id="stage-badge">Revealed comparison</span>
      </div>
    </header>
    <main class="shell"><div class="loading" id="app" role="status">Opening sealed comparisons…</div></main>
    <script nonce="${nonce}">
      (() => {
        const token = ${JSON.stringify(token)};
        const app = document.querySelector('#app');
        const badge = document.querySelector('#stage-badge');
        const element = (tag, className, text) => {
          const node = document.createElement(tag);
          if (className) node.className = className;
          if (text !== undefined) node.textContent = text;
          return node;
        };
        const button = (text, className) => {
          const node = element('button', className, text);
          node.type = 'button';
          return node;
        };
        const display = value => typeof value === 'string' ? value : JSON.stringify(value, null, 2);
        const humanize = value => value
          .replace(/([a-z0-9])([A-Z])/g, '$1 $2')
          .replace(/[_-]+/g, ' ')
          .replace(/^./, character => character.toUpperCase());
        const api = async (path, options = {}) => {
          const response = await fetch(path, {
            ...options,
            headers: { 'content-type': 'application/json', 'x-aos4-review-token': token, ...(options.headers || {}) },
          });
          const data = await response.json().catch(() => ({}));
          if (!response.ok) throw new Error(data.error || 'The comparison desk could not complete that action.');
          return data;
        };
        const blindField = task => {
          const value = task.blindInterpretation;
          return value && typeof value === 'object' && typeof value.field === 'string' ? value.field : '';
        };
        const blindAnswer = task => {
          const value = task.blindInterpretation;
          if (!value || typeof value !== 'object') return display(value);
          if (value.status === 'insufficient-evidence') {
            return 'I could not determine this from the supplied source excerpt.';
          }
          return value.expectedValue === undefined ? display(value) : display(value.expectedValue);
        };
        const renderDestinations = task => {
          const wrapper = element('div');
          if (!task.comparisonPacket.generatedDestinations.length) {
            wrapper.append(
              element(
                'p',
                'source-empty',
                'The website data has no value for this item. Decide whether that agrees with the source excerpt.'
              )
            );
            return wrapper;
          }
          task.comparisonPacket.generatedDestinations.forEach(destination => {
            const record = element('div', 'destination');
            const details = document.createElement('details');
            details.append(
              element('summary', '', 'Technical website location'),
              element('p', 'destination-meta', destination.path + ' · ' + destination.field)
            );
            record.append(
              element('p', 'destination-title', humanize(destination.field)),
              element('pre', '', display(destination.value)),
              details
            );
            wrapper.append(record);
          });
          return wrapper;
        };
        const renderSources = task => {
          const wrapper = element('div');
          const evidence = task.evidence || [];
          if (!evidence.length) {
            wrapper.append(
              element(
                'p',
                'source-empty',
                'No source excerpt was supplied. Do not guess; choose the option saying you cannot judge.'
              )
            );
            return wrapper;
          }
          evidence.forEach((block, index) => {
            const source = task.comparisonPacket.sourceEvidence[index] || {};
            const record = element('div', 'destination');
            const location = source.locator?.page !== undefined
              ? 'Page ' + source.locator.page
              : source.locator?.kind || 'source location recorded';
            const content = block.content.trim();
            const details = document.createElement('details');
            details.append(
              element('summary', '', 'Technical source details'),
              element('p', 'destination-meta', (source.authority || 'source') + ' · ' + location),
              element('p', 'destination-meta', source.sourceRecordId || block.ref)
            );
            record.append(
              content
                ? element('pre', 'source-excerpt', content)
                : element(
                    'p',
                    'source-empty',
                    'No source excerpt was supplied. Do not guess; choose the option saying you cannot judge.'
                  ),
              details
            );
            wrapper.append(record);
          });
          return wrapper;
        };
        const decision = (value, heading, description) => {
          const label = element('label', 'decision');
          const input = document.createElement('input');
          input.type = 'radio';
          input.name = 'outcome';
          input.value = value;
          const copy = element('span');
          copy.append(element('strong', '', heading), element('span', '', description));
          label.append(input, copy);
          return { label, input };
        };
        const completeState = (title, message) => {
          app.className = 'work';
          app.replaceChildren();
          badge.textContent = 'Stage sealed';
          const state = element('section', 'complete');
          const copy = element('div');
          copy.append(element('h1', '', title), element('p', '', message));
          state.append(copy);
          app.append(state);
        };
        const fatal = message => completeState('The comparison desk could not open', message);

        const render = session => {
          if (session.outputExists) {
            completeState('Comparisons already sealed', 'Return to the terminal to validate this review stage.');
            return;
          }
          const tasks = session.tasks;
          const storageKey = 'aos4-guided-comparison:' + session.assignmentId + ':' + session.stage + ':' + tasks[0].comparisonPacketId;
          let drafts = {};
          try { drafts = JSON.parse(localStorage.getItem(storageKey) || '{}'); } catch { drafts = {}; }
          let current = 0;
          badge.textContent = session.stage === 'calibration-comparison'
            ? 'Practice · compare with website'
            : 'Accuracy review · compare with website';
          app.className = 'layout';
          app.replaceChildren();

          const progressPanel = element('aside', 'progress-panel');
          const progressCopy = element('div');
          progressCopy.append(element('p', 'progress-label', 'Comparison progress'), element('p', 'progress-count'));
          const progress = document.createElement('progress');
          progress.max = tasks.length;
          progress.value = 0;
          progress.setAttribute('aria-label', 'Completed comparisons');
          const rail = element('nav', 'task-rail');
          rail.setAttribute('aria-label', 'Comparison questions');
          progressPanel.append(
            progressCopy,
            progress,
            rail,
            element(
              'p',
              'note',
              'Step 2 of 2: compare the source with what the website would use. Your step 1 answer is locked so this remains an honest check.'
            )
          );

          const work = element('article', 'work');
          const header = element('header', 'work-header');
          const eyebrow = element('p', 'eyebrow');
          const title = element('h1');
          header.append(
            eyebrow,
            title,
            element(
              'p',
              'subtitle',
              'Ignore harmless formatting differences. Look for changes that could alter a rule, value, eligibility, identity, or other meaningful game information.'
            )
          );
          const values = element('section', 'section');
          values.append(element('h2', '', 'Compare these three pieces'));
          const comparisonGrid = element('div', 'comparison-grid');
          const blindCard = element('article', 'value-card');
          blindCard.append(element('h3', '', 'What you wrote in step 1'));
          const sourceCard = element('article', 'value-card wide');
          sourceCard.append(element('h3', '', 'Source excerpt'));
          const generatedCard = element('article', 'value-card');
          generatedCard.append(element('h3', '', 'What the website would use'));
          comparisonGrid.append(sourceCard, blindCard, generatedCard);
          values.append(comparisonGrid);

          const answer = element('section', 'section');
          const choices = element('fieldset');
          choices.append(
            element('legend', '', 'Does the website data agree with the source?'),
            element(
              'p',
              'choice-help',
              'Choose based on the source excerpt, not on whether your step 1 wording was perfect.'
            )
          );
          const decisionList = element('div', 'decisions');
          const pass = decision(
            'pass',
            'Yes — they agree in all important ways',
            'Names, numbers, rules, and other meaningful details match. Formatting may differ.'
          );
          const finding = decision(
            'finding',
            'No — there is an important difference',
            'The website value is missing, conflicting, or meaningfully wrong.'
          );
          const cannot = decision(
            'cannot-verify',
            'I cannot judge from this source',
            'The excerpt is missing, unreadable, or does not contain the information needed.'
          );
          decisionList.append(pass.label, finding.label, cannot.label);
          choices.append(decisionList);

          const form = element('div', 'form-grid');
          const findingFields = element('div', 'finding-fields wide');
          const fieldInput = document.createElement('input');
          fieldInput.placeholder = 'For example: points, eligible factions, ability timing';
          const expectedInput = document.createElement('textarea');
          expectedInput.placeholder = 'Copy or summarize the correct information from the source.';
          const actualInput = document.createElement('textarea');
          actualInput.placeholder = 'Copy or summarize the conflicting website value.';
          const severity = document.createElement('select');
          [
            ['major', 'Major · could mislead a player'],
            ['blocker', 'Blocker · prevents a trustworthy review'],
            ['minor', 'Minor · limited impact'],
          ].forEach(([value, label]) => {
            const option = document.createElement('option');
            option.value = value;
            option.textContent = label;
            severity.append(option);
          });
          const confidence = document.createElement('select');
          [
            ['high', 'High · I am sure'],
            ['medium', 'Medium · likely, but not certain'],
            ['low', 'Low · needs another reviewer'],
          ].forEach(([value, label]) => {
            const option = document.createElement('option');
            option.value = value;
            option.textContent = label;
            confidence.append(option);
          });
          const groupedField = (labelText, control) => {
            const group = element('div', 'field');
            const label = element('label', '', labelText);
            label.append(control);
            group.append(label);
            return group;
          };
          findingFields.append(
            element(
              'p',
              'hint',
              'Describe only the difference you personally found. The tool will attach the technical source references automatically.'
            ),
            groupedField('What information is affected?', fieldInput),
            groupedField('What does the source say?', expectedInput),
            groupedField('What would the website use?', actualInput),
            groupedField('How much could this matter?', severity),
            groupedField('How certain are you?', confidence)
          );
          const rationale = document.createElement('textarea');
          rationale.placeholder =
            'Point to the matching words, the important difference, or the information that is missing.';
          const rationaleGroup = groupedField('What led to this decision?', rationale);
          rationaleGroup.classList.add('wide');
          const error = element('p', 'error wide');
          error.tabIndex = -1;
          error.setAttribute('role', 'alert');
          form.append(findingFields, rationaleGroup, error);
          answer.append(choices, form);

          const actions = element('footer', 'actions');
          const previous = button('Previous comparison', 'button secondary');
          const actionGroup = element('div', 'action-group');
          const next = button('Save decision and continue', 'button primary');
          const seal = button('Finish and lock decisions', 'button seal');
          seal.hidden = true;
          actionGroup.append(next, seal);
          actions.append(previous, actionGroup);
          work.append(header, values, answer, actions);
          app.append(progressPanel, work);

          const dots = tasks.map((_, index) => {
            const dot = button(String(index + 1), 'task-dot');
            dot.setAttribute('aria-label', 'Open comparison ' + (index + 1));
            dot.addEventListener('click', () => {
              save(false);
              current = index;
              renderCurrent();
            });
            rail.append(dot);
            return dot;
          });
          const controls = { pass: pass.input, finding: finding.input, cannot: cannot.input };
          const outcome = () => controls.pass.checked ? 'pass' : controls.finding.checked ? 'finding' : controls.cannot.checked ? 'cannot-verify' : '';
          const response = () => ({
            packetId: tasks[current].comparisonPacketId,
            outcome: outcome(),
            rationale: rationale.value.trim(),
            reviewedAt: new Date().toISOString(),
            findingField: fieldInput.value.trim(),
            expectedValue: expectedInput.value.trim(),
            actualValue: actualInput.value.trim(),
            severity: severity.value,
            confidence: confidence.value,
          });
          const validate = value => {
            if (!value.outcome) return 'Choose “Yes,” “No,” or “I cannot judge.”';
            if (value.rationale.length < 20) {
              return 'Point to the matching words, the important difference, or the missing information.';
            }
            if (value.outcome === 'finding' && !value.findingField) {
              return 'Name the information that differs, such as points or ability timing.';
            }
            return '';
          };
          const showError = message => {
            error.textContent = message;
            error.dataset.visible = 'true';
            error.focus();
          };
          const clearError = () => {
            error.textContent = '';
            error.dataset.visible = 'false';
          };
          const save = showValidation => {
            const value = response();
            const problem = validate(value);
            drafts[value.packetId] = { response: value, complete: !problem };
            try { localStorage.setItem(storageKey, JSON.stringify(drafts)); } catch {}
            updateProgress();
            if (showValidation && problem) {
              showError(problem);
              return false;
            }
            if (showValidation) clearError();
            return !problem;
          };
          const updateProgress = () => {
            const complete = tasks.filter(task => drafts[task.comparisonPacketId]?.complete).length;
            progressCopy.querySelector('.progress-count').textContent = complete + ' of ' + tasks.length + ' compared';
            progress.value = complete;
            dots.forEach((dot, index) => {
              dot.dataset.complete = String(Boolean(drafts[tasks[index].comparisonPacketId]?.complete));
              if (index === current) dot.setAttribute('aria-current', 'step');
              else dot.removeAttribute('aria-current');
            });
            next.hidden = current === tasks.length - 1;
            seal.hidden = complete !== tasks.length || current !== tasks.length - 1;
          };
          const syncFinding = () => {
            findingFields.dataset.visible = String(controls.finding.checked);
          };
          const renderCurrent = () => {
            const task = tasks[current];
            const draft = drafts[task.comparisonPacketId]?.response;
            const field = blindField(task);
            eyebrow.textContent = 'Step 2 of 2 · Question ' + (current + 1);
            title.textContent = field
              ? 'Does the website agree about ' + humanize(field).toLowerCase() + '?'
              : 'Does the website data agree with the source?';
            blindCard.replaceChildren(
              element('h3', '', 'What you wrote in step 1'),
              element('pre', '', blindAnswer(task))
            );
            sourceCard.replaceChildren(element('h3', '', 'Source excerpt'), renderSources(task));
            generatedCard.replaceChildren(
              element('h3', '', 'What the website would use'),
              renderDestinations(task)
            );
            controls.pass.checked = draft?.outcome === 'pass';
            controls.finding.checked = draft?.outcome === 'finding';
            controls.cannot.checked = draft?.outcome === 'cannot-verify';
            rationale.value = draft?.rationale || '';
            fieldInput.value = draft?.findingField || (field ? humanize(field) : '');
            expectedInput.value = draft?.expectedValue || '';
            actualInput.value = draft?.actualValue || '';
            severity.value = draft?.severity || 'major';
            confidence.value = draft?.confidence || 'high';
            previous.disabled = current === 0;
            syncFinding();
            clearError();
            updateProgress();
            dots[current].scrollIntoView({ block: 'nearest', inline: 'nearest' });
            window.scrollTo({ top: 0, behavior: 'smooth' });
          };

          previous.addEventListener('click', () => {
            save(false);
            current = Math.max(0, current - 1);
            renderCurrent();
          });
          next.addEventListener('click', () => {
            if (!save(true)) return;
            current = Math.min(tasks.length - 1, current + 1);
            renderCurrent();
          });
          seal.addEventListener('click', async () => {
            if (!save(true)) return;
            const incomplete = tasks.find(task => !drafts[task.comparisonPacketId]?.complete);
            if (incomplete) {
              current = tasks.indexOf(incomplete);
              renderCurrent();
              showError('Complete every comparison before finishing this step.');
              return;
            }
            seal.disabled = true;
            seal.textContent = 'Locking decisions…';
            try {
              await api('/api/results', {
                method: 'POST',
                body: JSON.stringify({ responses: tasks.map(task => drafts[task.comparisonPacketId].response) }),
              });
              localStorage.removeItem(storageKey);
              completeState(
                'Comparison decisions locked',
                'The practice review is complete. Return to the terminal to check the calibration result.'
              );
            } catch (failure) {
              seal.disabled = false;
              seal.textContent = 'Finish and lock decisions';
              showError(failure.message);
            }
          });
          [rationale, fieldInput, expectedInput, actualInput, severity, confidence].forEach(control => {
            control.addEventListener('change', () => save(false));
            control.addEventListener('blur', () => save(false));
          });
          [controls.pass, controls.finding, controls.cannot].forEach(control => {
            control.addEventListener('change', () => {
              syncFinding();
              save(false);
            });
          });
          renderCurrent();
        };

        api('/api/session').then(render).catch(error => fatal(error.message));
      })();
    </script>
  </body>
</html>`

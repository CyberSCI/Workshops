// Live readiness lights for the workshop stack.
//
// Each target is probed from the browser with a no-cors fetch. That resolves
// for any HTTP response and rejects only when nothing is listening, which is
// all "is it up" needs. The HTTP status itself is not readable this way.
//
// The probes show up in the VM's packet captures and in the backend log
// (GET /health), so the strip has a pause button for the investigating demos.
const WalkthroughStatus = (() => {
  const POLL_MS = 5000;
  const TIMEOUT_MS = 3000;
  const host = location.hostname || 'localhost';

  const TARGETS = [
    { id: 'app', label: 'App', port: 67, path: '/' },
    { id: 'backend', label: 'Backend', port: 6767, path: '/health' },
    { id: 'portal', label: 'Portal', port: 666, path: '/' },
  ];

  const STATE_TEXT = {
    checking: 'Checking…',
    up: 'Ready',
    down: 'Not reachable',
    paused: 'Paused',
  };

  // The speaker view loads this page in frames for its slide previews. Those
  // stay quiet, otherwise the pause button would not stop all probe traffic.
  const inFrame = window.self !== window.top;

  const results = Object.fromEntries(TARGETS.map((target) => [target.id, 'checking']));
  let paused = false;
  let timer = null;

  const address = (target) => `${host}:${target.port}`;
  const url = (target) => `http://${address(target)}${target.path}`;
  const stateOf = (id) => (paused ? 'paused' : results[id]);

  function el(tag, className, text) {
    const node = document.createElement(tag);
    if (className) node.className = className;
    if (text !== undefined) node.textContent = text;
    return node;
  }

  async function probe(target) {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), TIMEOUT_MS);
    try {
      await fetch(url(target), { mode: 'no-cors', cache: 'no-store', signal: controller.signal });
      return 'up';
    } catch {
      return 'down';
    } finally {
      clearTimeout(timeout);
    }
  }

  async function poll() {
    const states = await Promise.all(TARGETS.map(probe));
    TARGETS.forEach((target, i) => {
      results[target.id] = states[i];
    });
    render();
  }

  function schedule() {
    clearTimeout(timer);
    if (paused || document.hidden) return;
    timer = setTimeout(async () => {
      await poll();
      schedule();
    }, POLL_MS);
  }

  function summary() {
    if (paused) return 'Checks are paused.';
    const waiting = TARGETS.filter((target) => results[target.id] !== 'up');
    if (waiting.length === 0) return 'Everything is up. You are ready.';
    if (waiting.every((target) => results[target.id] === 'checking')) return 'Checking…';
    return `Waiting for: ${waiting.map((target) => target.label).join(', ')}`;
  }

  function render() {
    for (const node of document.querySelectorAll('[data-target]')) {
      const target = TARGETS.find((t) => t.id === node.dataset.target);
      const state = stateOf(target.id);
      node.dataset.state = state;
      if (node.classList.contains('light')) {
        node.title = `${target.label} (${address(target)}): ${STATE_TEXT[state]}. Click to open.`;
        node.setAttribute('aria-label', `${target.label}: ${STATE_TEXT[state]}`);
      }
    }
    for (const node of document.querySelectorAll('[data-state-text]')) {
      node.textContent = STATE_TEXT[stateOf(node.closest('[data-target]').dataset.target)];
    }
    for (const node of document.querySelectorAll('[data-status-summary]')) {
      node.textContent = summary();
    }
    for (const node of document.querySelectorAll('[data-pause]')) {
      node.textContent = paused ? 'Resume checks' : 'Pause checks';
    }
  }

  function buildLights(container) {
    container.replaceChildren(
      ...TARGETS.map((target) => {
        const light = el('a', 'light');
        light.dataset.target = target.id;
        light.href = url(target);
        light.target = '_blank';
        light.rel = 'noopener';
        light.append(el('span', 'dot'), el('span', 'label', target.label));
        return light;
      }),
    );
  }

  function buildBoard(board) {
    const rows = TARGETS.map((target) => {
      const state = el('span', 'state');
      state.dataset.stateText = '';
      const row = el('div', 'status-row');
      row.dataset.target = target.id;
      row.append(el('span', 'dot'), el('span', 'name', target.label), el('code', 'addr', address(target)), state);
      return row;
    });
    const note = el('p', 'status-summary');
    note.dataset.statusSummary = '';
    board.classList.add('status-board');
    board.replaceChildren(...rows, note);
  }

  // Starts the compact strip and the polling. Safe to call before the deck
  // loads, so the lights still work if a slide file is broken.
  function start() {
    if (inFrame) {
      document.documentElement.classList.add('in-frame');
      return;
    }

    const lights = document.querySelector('[data-lights]');
    if (lights) buildLights(lights);

    document.querySelector('[data-pause]')?.addEventListener('click', () => {
      paused = !paused;
      render();
      if (paused) clearTimeout(timer);
      else poll().then(schedule);
    });

    document.addEventListener('visibilitychange', () => {
      if (document.hidden) clearTimeout(timer);
      else if (!paused) poll().then(schedule);
    });

    render();
    poll().then(schedule);
  }

  // Fills in the large status boards on slides, once the Markdown has loaded.
  function mountBoards() {
    document.querySelectorAll('[data-status-board]').forEach(buildBoard);
    render();
  }

  return { start, mountBoards };
})();

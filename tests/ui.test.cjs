// A minimal DOM/worker/timer harness: no packages and no real browser required.
const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const source = fs.readFileSync(path.join(__dirname, '..', 'app.js'), 'utf8');

function fixture({ saved = null, readThrows = false, writeThrows = false, reduced = false } = {}) {
  let document;
  class Element {
    constructor(tag = 'div') {
      this.tagName = tag; this.children = []; this.style = {}; this.dataset = {};
      this.attributes = {}; this.listeners = {}; this.value = ''; this.scrollTop = 0;
      this.disabled = false; this.hidden = false; this.className = ''; this._text = '';
      this.classList = {
        add: name => { if (!this.className.split(' ').includes(name)) this.className += ' ' + name; },
        remove: name => { this.className = this.className.split(' ').filter(item => item !== name).join(' '); }
      };
    }
    get textContent() { return this._text + this.children.map(child => child.textContent).join(''); }
    set textContent(value) { this._text = String(value); this.children = []; }
    get innerHTML() { return this._html || ''; }
    set innerHTML(value) {
      this._html = value; this.replaceChildren();
      if (value) { const child = new Element(); child.textContent = value; this.append(child); }
    }
    get firstChild() { return this.children[0]; }
    replaceChildren(...children) {
      if (this.contains(document?.activeElement)) document.activeElement = document.body;
      this.children = []; this._text = ''; this.append(...children);
    }
    append(...children) { this.children.push(...children); }
    contains(element) { return this === element || this.children.some(child => child.contains(element)); }
    setAttribute(name, value) { this.attributes[name] = value; }
    addEventListener(name, callback) { (this.listeners[name] ||= []).push(callback); }
    dispatch(name, event = {}) { this.listeners[name]?.forEach(callback => callback({ target: this, ...event })); }
    focus() { document.activeElement = this; }
    scrollIntoView(options) { this.lastScroll = options; }
    querySelector() { return this.indicator ||= new Element('span'); }
  }
  const elements = new Map();
  const get = id => {
    if (!elements.has(id)) elements.set(id, new Element());
    return elements.get(id);
  };
  document = {
    body: new Element('body'),
    getElementById: get,
    querySelector: get,
    createElement: tag => new Element(tag),
    createTextNode: text => { const node = new Element('#text'); node.textContent = text; return node; }
  };
  document.activeElement = document.body;
  get('nextLesson').append(new Element('#text'));
  const workers = [], timers = new Map(), writes = [];
  let timerId = 0;
  class Worker {
    constructor() { workers.push(this); }
    terminate() { this.terminated = true; }
    postMessage(code) { this.code = code; }
    emit(data) { return this.onmessage({ data }); }
  }
  const context = vm.createContext({
    document, Worker, Blob: class {}, URL: { createObjectURL: () => 'blob:test', revokeObjectURL() {} },
    window: { matchMedia: () => ({ matches: reduced }) }, confirm: () => true,
    localStorage: {
      getItem() { if (readThrows) throw new Error('Storage unavailable'); return saved; },
      setItem(key, value) { if (writeThrows) throw new Error('Storage full'); writes.push({ key, value }); }
    },
    setTimeout(callback, delay) { const id = ++timerId; timers.set(id, { callback, delay, canceled: false }); return id; },
    clearTimeout(id) { if (timers.has(id)) timers.get(id).canceled = true; }
  });
  vm.runInContext(source, context);
  const api = vm.runInContext(`({ lessons, runCode, selectLesson, renderPath, answerQuiz, saveProgress,
    getState: () => ({ progress, currentLesson, running, runToken, workerTimer, playbackTimer }) })`, context);
  const state = () => JSON.parse(JSON.stringify(api.getState()));
  const snapshot = () => ({ state: state(), output: get('output').textContent, status: get('runStatus').textContent, robot: get('robotPosition').textContent });
  function result(code) {
    let message;
    const workerSource = vm.runInContext('workerSource', context);
    const execution = vm.createContext({ self: { postMessage: data => { message = data; } }, code });
    vm.runInContext(workerSource, execution);
    vm.runInContext('self.onmessage({data: code})', execution, { timeout: 250 });
    return message;
  }
  return { api, get, document, workers, timers, writes, state, snapshot, result };
}

for (const length of [6, 14]) {
  test(`Restores ${length} legacy badges and leaves appended missions unearned`, () => {
    const saved = JSON.stringify(Array.from({ length }, () => ({ ran: true, quiz: true })));
    const f = fixture({ saved });
    f.state().progress.forEach((item, index) => assert.deepEqual(item, { ran: index < length, quiz: index < length }));
    assert.equal(f.get('progressText').textContent, `${length} of 18 completed`);
    assert.match(f.get('codeAchieved').textContent, /achieved/);
    assert.match(f.get('quizAchieved').textContent, /achieved/);
  });
}

test('Corrupt, wrong-shaped, or unavailable storage does not break learning', () => {
  for (const options of [{ saved: '{' }, { saved: '{}' }, { saved: 'null' }, { readThrows: true }, { saved: '[null,{"ran":1,"quiz":"true"}]' }]) {
    const f = fixture(options);
    assert.equal(f.state().progress.length, 18);
    assert.ok(f.state().progress.every(item => !item.ran && !item.quiz));
    assert.equal(f.get('runCode').disabled, false);
  }
});

test('Storage write exceptions preserve in-memory achievements and the legacy array format', () => {
  const unavailable = fixture({ writeThrows: true });
  unavailable.api.answerQuiz(0, unavailable.get('quizAnswers').children[0]);
  assert.equal(unavailable.state().progress[0].quiz, true);
  const f = fixture();
  f.api.saveProgress();
  assert.equal(f.writes[0].key, 'bot-academy-progress-v1');
  assert.ok(Array.isArray(JSON.parse(f.writes[0].value)));
});

test('Focus follows regenerated map/sidebar buttons and never moves from editor or quiz', () => {
  const f = fixture();
  for (const id of ['lessonCards', 'sidebarLessons']) {
    const old = f.get(id).children[15];
    old.focus();
    old.dispatch('click');
    assert.notEqual(f.document.activeElement, old);
    assert.equal(f.document.activeElement, f.get(id).children[15]);
    assert.equal(f.document.activeElement.dataset.lessonId, 'function-parameters');
  }
  f.get('codeEditor').focus();
  f.api.renderPath();
  assert.equal(f.document.activeElement, f.get('codeEditor'));
  const answer = f.get('quizAnswers').children[1];
  answer.focus(); answer.dispatch('click');
  assert.equal(f.document.activeElement, answer);
});

test('Reset and navigation cancel stale worker messages, errors, and timeouts', async () => {
  for (const cancel of [f => f.get('resetCode').dispatch('click'), f => f.api.selectLesson(14), f => f.get('resetProgress').dispatch('click')]) {
    const f = fixture();
    await f.api.runCode();
    const oldWorker = f.workers[0];
    const oldTimeout = f.timers.get(f.state().workerTimer);
    cancel(f);
    const snapshot = f.snapshot();
    assert.equal(oldWorker.terminated, true);
    assert.equal(oldTimeout.canceled, true);
    await oldWorker.emit(f.result(oldWorker.code));
    oldWorker.onerror(); oldTimeout.callback();
    assert.deepEqual(f.snapshot(), snapshot);
  }
});

test('Canceled playback and stale timers cannot change a newly selected mission or a new run', async () => {
  const f = fixture();
  await f.api.runCode();
  const playback = f.workers[0].emit(f.result(f.workers[0].code));
  const oldPlaybackTimer = f.timers.get(f.state().playbackTimer);
  f.api.selectLesson(1);
  await f.api.runCode();
  const newPlayback = f.workers[1].emit(f.result(f.workers[1].code));
  const snapshot = f.snapshot();
  oldPlaybackTimer.callback();
  await playback;
  assert.deepEqual(f.snapshot(), snapshot);
  f.get('resetCode').dispatch('click');
  await newPlayback;
  assert.equal(f.state().running, false);
  assert.equal(f.state().progress[0].ran, false);
  assert.equal(f.state().progress[1].ran, false);
});

test('Only the first worker response is used; stale errors and execution timers do not interrupt playback', async () => {
  const f = fixture();
  await f.api.runCode();
  const worker = f.workers[0], executionTimeout = f.timers.get(f.state().workerTimer);
  const playback = worker.emit(f.result(worker.code));
  const snapshot = f.snapshot();
  await worker.emit({ ok: false, error: 'duplicate' });
  worker.onerror(); executionTimeout.callback();
  assert.deepEqual(f.snapshot(), snapshot);
  f.get('resetCode').dispatch('click');
  await playback;
});

test('Reduced motion skips playback timers and smooth scrolling, while still achieving code', async () => {
  const f = fixture({ reduced: true });
  f.get('startButton').dispatch('click');
  assert.equal(f.get('playground').lastScroll.behavior, 'auto');
  await f.api.runCode();
  await f.workers[0].emit(f.result(f.workers[0].code));
  assert.equal(f.state().running, false);
  assert.equal(f.state().playbackTimer, null);
  assert.equal(f.timers.size, 1);
  assert.equal(f.state().progress[0].ran, true);
  assert.match(f.get('codeAchieved').textContent, /achieved/);
  assert.match(f.get('robotPosition').textContent, /Column 2, row 2.*Facing up/);
});

test('Normal playback awards code only after the final command and synchronizes the robot position', async () => {
  const f = fixture();
  f.api.selectLesson(11);
  f.get('codeEditor').value = 'turn("right"); move(2);';
  await f.api.runCode();
  const playback = f.workers[0].emit(f.result(f.workers[0].code));
  for (let step = 0; step < 3; step++) {
    assert.equal(f.state().progress[11].ran, false);
    const timer = f.timers.get(f.state().playbackTimer);
    assert.equal(timer.delay, 180);
    timer.callback();
    await Promise.resolve();
  }
  await playback;
  assert.equal(f.state().progress[11].ran, true);
  assert.match(f.get('robotPosition').textContent, /Column 4, row 2.*Facing right/);
  assert.equal(f.state().running, false);
});

test('Later nonpassing runs, worker errors, and wrong quiz answers keep earned badges', async () => {
  const f = fixture({ reduced: true, saved: JSON.stringify([{ ran: true, quiz: true }]) });
  f.get('codeEditor').value = 'turn("right");';
  await f.api.runCode();
  await f.workers[0].emit(f.result(f.workers[0].code));
  assert.match(f.get('output').textContent, /earlier code achievement is saved/);
  await f.api.runCode();
  f.workers[1].onerror();
  f.api.answerQuiz(1, f.get('quizAnswers').children[1]);
  assert.deepEqual(f.state().progress[0], { ran: true, quiz: true });
  assert.match(f.get('codeAchieved').textContent, /achieved/);
  assert.match(f.get('quizAchieved').textContent, /achieved/);
  assert.equal(f.get('nextLesson').disabled, false);
});

test('Malformed worker payloads produce recoverable errors without awarding code', async () => {
  const invalid = [null, {}, { ok: true }, { ok: false }, { ok: true, commands: [null] },
    { ok: true, commands: [{ type: 'say', text: 'Hello', x: 9, y: 2, facing: 0 }] }];
  for (const data of invalid) {
    const f = fixture({ reduced: true });
    await f.api.runCode(); await f.workers[0].emit(data);
    assert.equal(f.state().running, false);
    assert.equal(f.get('runCode').disabled, false);
    assert.equal(f.state().progress[0].ran, false);
    assert.match(f.get('output').textContent, /unexpected result/);
  }
});

test('Execution timeout ends a run and prevents later worker results from awarding code', async () => {
  const f = fixture();
  await f.api.runCode();
  f.timers.get(f.state().workerTimer).callback();
  const snapshot = f.snapshot();
  await f.workers[0].emit(f.result(f.workers[0].code));
  assert.deepEqual(f.snapshot(), snapshot);
  assert.equal(f.get('runCode').disabled, false);
  assert.match(f.get('output').textContent, /took too long/);
});

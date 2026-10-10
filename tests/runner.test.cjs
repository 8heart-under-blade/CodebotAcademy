// Run with: node --test tests/runner.test.cjs
const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');
const path = require('node:path');
const source = fs.readFileSync(path.join(__dirname, '..', 'app.js'), 'utf8');
const lessons = vm.runInNewContext(source.slice(0, source.indexOf('const $ =')) + '\nlessons;');
const runnerStart = source.indexOf('const workerSource =');
const runnerEnd = source.indexOf('\nfunction outputLine', runnerStart);
const workerSource = vm.runInNewContext(source.slice(runnerStart, runnerEnd) + '\nworkerSource;');

function run(code) {
  let result;
  const context = vm.createContext({ self: { postMessage: message => { result = message; } }, code });
  vm.runInContext(workerSource, context);
  vm.runInContext('self.onmessage({data: code})', context, { timeout: 250 });
  return result;
}

lessons.forEach((lesson, i) => {
  test(`Mission ${i + 1}: starter code runs and has the expected completion state`, () => {
    const result = run(lesson.code);
    assert.equal(result.ok, true, result.error);
    const practiceMission = ['Debugging', 'Treasure challenge', 'Dance challenge'].includes(lesson.short);
    assert.equal(lesson.check(result.commands, lesson.code), !practiceMission);
    assert.ok(lesson.goals.length >= 2);
    assert.ok(lesson.correct >= 0 && lesson.correct < lesson.answers.length);
  });
});
test('New practice missions accept completed solutions', () => {
  const solutions = {
    'Debugging': 'turn("right"); move(2);',
    'Treasure challenge': 'move(2); turn("right"); move(2); say("Treasure found!");',
    'Dance challenge': 'let score = 0; function danceStep() { move(1); turn("right"); } repeat(4, () => { danceStep(); score = score + 1; }); say("Dance score: " + score);'
  };
  for (const [short, code] of Object.entries(solutions)) {
    const lesson = lessons.find(lesson => lesson.short === short);
    const result = run(code);
    assert.equal(result.ok, true);
    assert.equal(lesson.check(result.commands, code), true, short);
  }
});
test('New challenges reject wrong destinations, blocked moves, and missing skills', () => {
  const treasure = lessons.find(lesson => lesson.short === 'Treasure challenge');
  for (const code of ['say("Treasure found!");', 'move(3); turn("right"); move(2); say("Treasure found!");']) {
    assert.equal(treasure.check(run(code).commands, code), false);
  }
  const dance = lessons.find(lesson => lesson.short === 'Dance challenge');
  const code = 'repeat(4, () => { move(1); turn("right"); }); say("Dance score: 4");';
  assert.equal(dance.check(run(code).commands, code), false);
});
test('Existing six badges survive an expanded learning path', () => {
  const start = source.indexOf("const storageKey =");
  const end = source.indexOf('let currentLesson =', start);
  const saved = Array.from({length: 6}, () => ({ran: true, quiz: true}));
  const restored = vm.runInNewContext(source.slice(start, end) + '\nprogress;', {
    lessons, localStorage: {getItem: () => JSON.stringify(saved)}
  });
  assert.equal(restored.length, lessons.length);
  restored.forEach((item, index) => {
    assert.equal(item.ran, index < 6);
    assert.equal(item.quiz, index < 6);
  });
});
test('Square mission returns Byte to the centre facing up', () => {
  const result = run(lessons[5].code);
  const last = result.commands.at(-1);
  assert.equal(last.x, 2);
  assert.equal(last.y, 2);
  assert.equal(last.facing, 0);
});
test('Condition changes its message when the battery is low', () => {
  const result = run(lessons[4].code.replace('75', '10'));
  assert.equal(result.commands[0].text, 'Time to charge!');
});
test('Robot cannot walk outside its 5 by 5 world', () => {
  const result = run('move(20);');
  assert.equal(result.ok, true);
  assert.equal(result.commands.at(-1).y, 0);
  assert.equal(result.commands.at(-1).blocked, true);
});
test('Malformed code returns an error', () => {
  assert.equal(run('say("Hello!);').ok, false);
});
test('Invalid commands return useful errors', () => {
  for (const code of ['move(-1);', 'move(1.5);', 'turn("up");', 'repeat(99, () => {});', 'say();']) {
    assert.equal(run(code).ok, false, code);
  }
});
test('Too many commands are stopped', () => {
  assert.equal(run('repeat(20, () => { repeat(20, () => { say("beep"); }); });').ok, false);
});
test('Endless loops can be interrupted by the execution environment', () => {
  assert.throws(() => run('while (true) {}'), /timed out/);
});
test('Blank programs do not pass any mission', () => {
  const result = run('');
  lessons.forEach(lesson => assert.equal(lesson.check(result.commands, ''), false));
});

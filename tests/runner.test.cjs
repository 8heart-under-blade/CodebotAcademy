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
    assert.equal(typeof lesson.starterPasses, 'boolean');
    assert.equal(lesson.check(result.commands, lesson.code), lesson.starterPasses);
    assert.equal(lesson.goals.length, 2);
    assert.ok(lesson.correct >= 0 && lesson.correct < lesson.answers.length);
  });
});

test('Lesson IDs are unique and the original fourteen positions remain stable', () => {
  assert.deepEqual(Array.from(lessons.slice(0, 14), lesson => lesson.id), [
    'hello-robot', 'instructions', 'variables', 'repeat-loops', 'conditions', 'square-challenge',
    'robot-maths', 'joining-strings', 'counters', 'named-functions', 'arrays', 'debugging',
    'treasure-challenge', 'dance-challenge'
  ]);
  assert.equal(lessons.length, 18);
  assert.equal(new Set(lessons.map(lesson => lesson.id)).size, 18);
  lessons.forEach(lesson => assert.match(lesson.id, /^[a-z][a-z-]+$/));
  lessons.slice(14).forEach(lesson => {
    assert.equal(lesson.category, 'NEXT-LEVEL SKILLS');
    for (const key of ['prerequisite', 'example', 'hint', 'question', 'mission']) assert.ok(lesson[key]);
  });
});

const extensionSolutions = [
  'let hasMap = true; if (hasMap === true) { say("Map ready!"); } else { say("Pack a map!"); }',
  'function greet(name) { say("Hello, " + name + "!"); } greet("Byte"); greet("Ada");',
  'let battery = 75; let hasMap = false; if (battery > 20 && hasMap === true) { say("Ready to explore!"); } else { say("Check your supplies!"); }',
  'let supplies = ["map", "snack", "torch"]; for (let item of supplies) { say(item); }'
];

test('Every extension accepts a completed solution', () => {
  extensionSolutions.forEach((code, index) => {
    const result = run(code);
    assert.equal(result.ok, true, result.error);
    assert.equal(lessons[index + 14].check(result.commands, code), true);
  });
});

test('Extensions reject correct output without the taught skill', () => {
  const shortcuts = [
    'say("Map ready!");',
    'say("Hello, Byte!"); say("Hello, Ada!");',
    'say("Check your supplies!");',
    'say("map"); say("snack"); say("torch");'
  ];
  shortcuts.forEach((code, index) => assert.equal(lessons[index + 14].check(run(code).commands, code), false));
  const weakerChecks = [extensionSolutions[0].replace('===', '=='), extensionSolutions[2].replace('&&', '||')];
  weakerChecks.forEach((code, index) => assert.equal(lessons[index ? 16 : 14].check(run(code).commands, code), false));
});

test('Extensions reject wrong values, order, and counts', () => {
  const negatives = [
    extensionSolutions[0].replace('= true;', '= false;'),
    extensionSolutions[1].replace('greet("Byte"); greet("Ada");', 'greet("Ada"); greet("Byte");'),
    extensionSolutions[1].replace('greet("Ada");', ''),
    extensionSolutions[2].replace('= false;', '= true;'),
    extensionSolutions[3].replace('["map", "snack", "torch"]', '["torch", "snack", "map"]'),
    extensionSolutions[3].replace('say(item);', 'say("item");')
  ];
  negatives.forEach((code, index) => {
    const lesson = lessons[[14, 15, 15, 16, 17, 17][index]];
    assert.equal(lesson.check(run(code).commands, code), false);
  });
});

test('Required syntax in comments or strings cannot earn a skill', () => {
  const body = 'say("Map ready!");';
  for (const decoration of [
    '// ' + extensionSolutions[0],
    '/* ' + extensionSolutions[0] + ' */',
    'let decoy = ' + JSON.stringify(extensionSolutions[0]) + ';',
    'let decoy = `' + extensionSolutions[0] + '`;',
    "let decoy = 'let hasMap = true; if (hasMap === true) {} else {}';"
  ]) {
    const code = body + '\n' + decoration;
    assert.equal(run(code).ok, true);
    assert.equal(lessons[14].check(run(code).commands, code), false);
  }
  const mathsDecoy = 'let answer = 12; let decoration = "*"; say(answer);';
  assert.equal(lessons[6].check(run(mathsDecoy).commands, mathsDecoy), false);
});

test('Quoted comment markers do not hide real syntax after strings', () => {
  const code = 'let url = "https://byte.example/*map*/";\n' + extensionSolutions[0];
  assert.equal(lessons[14].check(run(code).commands, code), true);
  const withComments = extensionSolutions[0].replace('===', '/* compare */ ===');
  assert.equal(lessons[14].check(run(withComments).commands, withComments), true);
});

test('Square and dance reject fake squares, wrong facing, blocked moves, or celebration before arrival', () => {
  const square = lessons[5];
  for (const code of [
    'let message = "Mission complete!"; repeat(4, () => { turn("right"); }); repeat(4, () => { move(1); }); say(message);',
    square.code.replace('move(1);', 'move(2);'),
    square.code.replace('say(message);', 'turn("right"); say(message);'),
    'let message = "Mission complete!"; say(message); repeat(4, () => { move(1); turn("right"); });'
  ]) assert.equal(square.check(run(code).commands, code), false);
  const dance = lessons[13];
  const fakeDance = 'let score = 4; function danceStep() {} repeat(4, () => { turn("right"); }); repeat(4, () => { move(1); }); say("Dance score: " + score);';
  assert.equal(dance.check(run(fakeDance).commands, fakeDance), false);
  const debug = lessons[11];
  const wrongOrder = 'move(1); turn("right"); move(2); turn("right"); move(1); turn("left");';
  assert.equal(run(wrongOrder).commands.at(-1).x, 4);
  assert.equal(debug.check(run(wrongOrder).commands, wrongOrder), false);
  const treasure = lessons[12];
  const reverseRoute = 'turn("right"); move(2); turn("left"); move(2); say("Treasure found!");';
  assert.equal(treasure.check(run(reverseRoute).commands, reverseRoute), false);
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

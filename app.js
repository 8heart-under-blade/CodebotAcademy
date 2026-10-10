'use strict';

const lessons = [
  {
    goals: ['Describe a program as instructions.', 'Display a message with say().'],
    title: 'Hello, robot!', short: 'Hello, robot!', icon: '⌘', category: 'THE BASICS', minutes: 5,
    intro: 'Meet Byte, your coding buddy! A program is a set of instructions that tells a computer what to do.',
    explanation: 'Let’s start with <strong>one instruction</strong>. The <code>say()</code> command makes Byte display a message. Put your message inside quotation marks. Finish the instruction with a semicolon.',
    example: 'say("Hello, world!");',
    mission: 'Make Byte say hello! Run the code, then change the message to anything friendly and run it again.',
    code: '// A big adventure starts with a hello.\nsay("Hello, Byte!");',
    hint: 'Keep your message between the quotation marks: say("You are awesome!");',
    question: 'What is a program?', answers: ['A set of instructions', 'A computer screen', 'A type of battery'], correct: 0,
    feedback: 'Exactly! A program is a set of instructions for a computer to follow.',
    check: (commands) => commands.some(c => c.type === 'say' && c.text.trim())
  },
  {
    goals: ['Follow instructions in sequence.', 'Move and turn Byte on the grid.'],
    title: 'One step at a time', short: 'Giving instructions', icon: '↗', category: 'SEQUENCES', minutes: 6,
    intro: 'Computers follow instructions in order, from top to bottom. That order is called a sequence.',
    explanation: '<code>move(1)</code> moves Byte one square forward. <code>turn("right")</code> turns Byte a quarter-turn without moving. Try <code>turn("left")</code> too! Byte starts in the middle, facing up.',
    example: 'move(1);\nturn("right");\nsay("I did it!");',
    mission: 'Move Byte, then turn right, then say “I did it!” Watch how the order changes what happens.',
    code: '// Byte follows your instructions in order.\nmove(1);\nturn("right");\nsay("I did it!");',
    hint: 'Put move(1); first, turn("right"); second, and say("I did it!"); last.',
    question: 'Which instruction does Byte follow first?', answers: ['The last one', 'The first one', 'A random one'], correct: 1,
    feedback: 'You got it! Byte reads your instructions from top to bottom.',
    check: (commands) => commands.length >= 3 && commands[0].type === 'move' && commands[1].type === 'turn' && commands[1].direction === 'right' && commands.slice(2).some(c => c.type === 'say')
  },
  {
    goals: ['Store a message in a variable.', 'Use a variable by its name.'],
    title: 'A box for your ideas', short: 'Variables', icon: '{ }', category: 'VARIABLES', minutes: 7,
    intro: 'Imagine a labelled box that holds something. In code, that box is called a variable.',
    explanation: 'Use <code>let</code> to create a variable and give it a name. <code>=</code> stores a value in it. When you use the variable later, leave off the quotation marks—otherwise Byte just reads its name!',
    example: 'let greeting = "You are a superstar!";\nsay(greeting);',
    mission: 'Store a friendly message in a variable called greeting. Use say(greeting) to share it with Byte.',
    code: '// Store a message, then use it.\nlet greeting = "You are a superstar!";\nsay(greeting);',
    hint: 'Try changing the words on the first line. Keep say(greeting); on the second line.',
    question: 'What does a variable do?', answers: ['Turns off the robot', 'Deletes your code', 'Stores a value'], correct: 2,
    feedback: 'Yes! A variable has a name and stores a value, like a message or a number.',
    check: (commands, code) => /\blet\s+greeting\s*=/.test(code) && /\bsay\s*\(\s*greeting\s*\)/.test(code) && commands.some(c => c.type === 'say' && c.text.trim())
  },
  {
    goals: ['Repeat instructions with a loop.', 'Change how many times a loop runs.'],
    title: 'Do it. Then do it again.', short: 'Loops', icon: '↻', category: 'LOOPS', minutes: 8,
    intro: 'Want to do the same thing again and again? A loop saves you from writing the same instructions lots of times.',
    explanation: 'Our robot helper <code>repeat()</code> runs your instructions a set number of times. In <code>repeat(3, () => { ... });</code>, 3 is the number of repeats. The <code>() => { }</code> part groups the instructions into a little function.',
    example: 'repeat(3, () => {\n  say("Beep!");\n});',
    mission: 'Make Byte say “Beep!” three times using repeat(). Then try changing 3 to another small number.',
    code: '// One instruction, repeated three times!\nrepeat(3, () => {\n  say("Beep!");\n});',
    hint: 'Put say("Beep!"); between the curly braces { }. The number before the comma controls the repeat count.',
    question: 'Why are loops useful?', answers: ['They repeat instructions', 'They make code invisible', 'They stop every program'], correct: 0,
    feedback: 'Exactly! Loops repeat instructions without writing them over and over.',
    check: (commands, code) => /\brepeat\s*\(/.test(code) && commands.filter(c => c.type === 'say' && /beep/i.test(c.text)).length >= 3
  },
  {
    goals: ['Compare numbers in a condition.', 'Choose between if and else branches.'],
    title: 'Help Byte make a choice', short: 'Making decisions', icon: '⑂', category: 'CONDITIONS', minutes: 8,
    intro: 'You make choices every day. Code can make choices too, using a condition that is either true or false.',
    explanation: '<code>if</code> asks a question. <code>battery > 20</code> asks “Is the battery greater than 20?” If it’s true, the first block runs. Otherwise, the <code>else</code> block runs.',
    example: 'if (battery > 20) {\n  say("Ready to go!");\n} else {\n  say("Time to charge!");\n}',
    mission: 'Run the code with battery set to 75. Then change it to 10 and run again. Which message changes?',
    code: 'let battery = 75;\n\nif (battery > 20) {\n  say("Ready to go!");\n} else {\n  say("Time to charge!");\n}',
    hint: 'Change just the 75 on the first line to 10. 10 is not greater than 20, so the else block will run.',
    question: 'If battery is 10, is battery > 20 true?', answers: ['Yes, always', 'No, it is false', 'Only on Tuesdays'], correct: 1,
    feedback: 'Correct! 10 is less than 20, so Byte follows the else instructions.',
    check: (commands, code) => /\bif\s*\(/.test(code) && /\belse\b/.test(code) && commands.some(c => c.type === 'say')
  },
  {
    goals: ['Combine movement and loops.', 'Return to the start and share a victory message.'],
    title: 'Your first robot mission', short: 'Robot challenge', icon: '★', category: 'THE BIG CHALLENGE', minutes: 10, challenge: true,
    intro: 'Time to put your new skills together! Give Byte a square-shaped adventure and a victory message.',
    explanation: 'A square has <strong>four sides</strong>. Move one square, turn right, and repeat those instructions four times. Byte should return to the starting square! Then share a message stored in a variable.',
    example: 'repeat(4, () => {\n  move(1);\n  turn("right");\n});',
    mission: 'Complete the square using a loop. Store “Mission complete!” in a variable, then make Byte say it.',
    code: '// Draw a square with your robot.\nrepeat(4, () => {\n  move(1);\n  turn("right");\n});\n\nlet message = "Mission complete!";\nsay(message);',
    hint: 'Use repeat(4, () => { ... }); with move(1); and turn("right"); inside. Your say(message); goes after the loop.',
    question: 'Which skills did you use in this mission?', answers: ['Only turning', 'Only messages', 'Sequences, variables & loops'], correct: 2,
    feedback: 'Amazing! You combined three coding skills to create your own robot adventure.',
    check: (commands, code) => /\brepeat\s*\(/.test(code) && /\blet\s+/.test(code) && commands.filter(c => c.type === 'move').length >= 4 && commands.filter(c => c.type === 'turn').length >= 4 && commands.some(c => c.type === 'say' && /mission complete/i.test(c.text)) && commands.at(-1).x === 2 && commands.at(-1).y === 2
  },
  {
    title: 'Robot maths', short: 'Number power', icon: '+', category: 'NUMBERS', minutes: 6,
    goals: ['Add numbers stored in variables.', 'Show a calculated answer with say().'],
    intro: 'Byte can be your calculator! Numbers do not need quotation marks.',
    explanation: 'Use <code>+</code> to add and <code>*</code> to multiply. Store the answer in a variable so you can use it later.',
    example: 'let total = 3 + 4;\nsay(total);',
    mission: 'Byte has 3 packs with 4 energy cells each. Calculate the total with multiplication and make Byte say 12.',
    code: 'let packs = 3;\nlet cellsPerPack = 4;\nlet total = packs * cellsPerPack;\nsay(total);',
    hint: 'Multiply packs by cellsPerPack using *. Then use say(total); without quotes.',
    question: 'What does 3 * 4 calculate?', answers: ['3 plus 4', '3 times 4', 'The message 34'], correct: 1,
    feedback: 'Right! The * symbol means multiplication.',
    check: (commands, code) => /\blet\s+/.test(code) && /\*/.test(code.replace(/\/\/[^\n]*/g, '')) && commands.some(c => c.type === 'say' && c.text === '12')
  },
  {
    title: 'Build a personalised greeting', short: 'Joining messages', icon: 'Aa', category: 'STRINGS', minutes: 6,
    goals: ['Join text with the + operator.', 'Use a variable inside a message.'],
    intro: 'Text in code is called a string. Join strings to build your own messages!',
    explanation: '<code>"Hello, " + name</code> joins a greeting and a name. Spaces inside quotes keep your words from sticking together.',
    example: 'let name = "Byte";\nsay("Hello, " + name + "!");',
    mission: 'Store Byte in a variable called name. Join it with a greeting so the output is “Hello, Byte!”.',
    code: 'let name = "Byte";\nsay("Hello, " + name + "!");',
    hint: 'Keep the space after the comma inside "Hello, ". Use + between each part.',
    question: 'What is a string?', answers: ['A piece of text', 'Only a number', 'A robot turn'], correct: 0,
    feedback: 'Exactly! Strings hold text, including spaces and punctuation.',
    check: (commands, code) => /\blet\s+name\s*=/.test(code) && /\bsay\s*\([^;]*\+\s*name\b/.test(code) && commands.some(c => c.type === 'say' && c.text === 'Hello, Byte!')
  },
  {
    title: 'Count every beep', short: 'Updating variables', icon: '↑', category: 'COUNTERS', minutes: 7,
    goals: ['Change a variable after creating it.', 'Count repeated actions with a loop.'],
    intro: 'A variable can change while your program runs. Let’s count Byte’s beeps!',
    explanation: '<code>count = count + 1</code> reads the old count, adds one, and stores the new count. Start at zero and update it inside a loop.',
    example: 'let count = 0;\ncount = count + 1;\nsay(count);',
    mission: 'Use repeat() to increase count and display it each time. Byte should say 1, 2, 3, and 4 in order.',
    code: 'let count = 0;\nrepeat(4, () => {\n  count = count + 1;\n  say(count);\n});',
    hint: 'Put both the update and say(count); inside the loop. Start count at 0.',
    question: 'If count is 2, what does count = count + 1 store?', answers: ['1', '2', '3'], correct: 2,
    feedback: 'Yes! The new value is 3.',
    check: (commands, code) => /\brepeat\s*\(/.test(code) && /\blet\s+count\s*=/.test(code) && commands.filter(c => c.type === 'say').map(c => c.text).join(',') === '1,2,3,4'
  },
  {
    title: 'Teach Byte a new trick', short: 'Functions', icon: 'ƒ', category: 'FUNCTIONS', minutes: 8,
    goals: ['Define a named function.', 'Call the same function more than once.'],
    intro: 'A function is a named set of instructions you can reuse whenever you need it.',
    explanation: '<code>function cheer() { ... }</code> defines a trick. <code>cheer();</code> calls it. Defining a function alone does not run its instructions!',
    example: 'function cheer() {\n  say("Hooray!");\n}\ncheer();',
    mission: 'Create a function called cheer that says “Hooray!”. Call it twice to get two cheers.',
    code: 'function cheer() {\n  say("Hooray!");\n}\n\ncheer();\ncheer();',
    hint: 'Keep say("Hooray!"); inside the function. Put two cheer(); calls after the closing brace.',
    question: 'When does a named function run?', answers: ['Only when you name it', 'When you call it', 'Never'], correct: 1,
    feedback: 'Correct! Calling a function runs its instructions.',
    check: (commands, code) => /\bfunction\s+cheer\s*\(/.test(code) && commands.filter(c => c.type === 'say' && c.text === 'Hooray!').length === 2
  },
  {
    title: 'Pack Byte’s backpack', short: 'Lists & arrays', icon: '[ ]', category: 'ARRAYS', minutes: 8,
    goals: ['Store several values in an array.', 'Read an item using its index.'],
    intro: 'An array is a list of values. Byte can keep all the adventure supplies in one variable.',
    explanation: 'Square brackets create a list: <code>["map", "snack", "torch"]</code>. Indexes start at <strong>zero</strong>: <code>supplies[0]</code> is the first item.',
    example: 'let supplies = ["map", "snack", "torch"];\nsay(supplies[0]);',
    mission: 'Create a supplies array containing map, snack, and torch. Read its first and last items to make Byte say “map”, then “torch”.',
    code: 'let supplies = ["map", "snack", "torch"];\nsay(supplies[0]);\nsay(supplies[2]);',
    hint: 'The third item has index 2, not 3. Use say(supplies[2]); for the torch.',
    question: 'Which index reads the first array item?', answers: ['1', '3', '0'], correct: 2,
    feedback: 'You got it! JavaScript arrays start counting at zero.',
    check: (commands, code) => /\blet\s+supplies\s*=\s*\[/.test(code) && /\bsupplies\s*\[\s*0\s*\]/.test(code) && /\bsupplies\s*\[\s*2\s*\]/.test(code) && commands.filter(c => c.type === 'say').map(c => c.text).join(',') === 'map,torch'
  },
  {
    title: 'Find the sneaky bug', short: 'Debugging', icon: '?', category: 'DEBUGGING', minutes: 7,
    goals: ['Compare actual output with the goal.', 'Fix a mistake in the order of instructions.'],
    intro: 'A bug is a mistake in a program. Debugging means finding it and fixing it—not giving up!',
    explanation: 'This code runs, but Byte moves up instead of right. That is a <strong>logic bug</strong>. Think about which instruction must happen first.',
    example: '// Bug: Byte moves before turning.\nmove(2);\nturn("right");',
    mission: 'Fix the order: turn right before moving two squares. Finish at the right edge (column 4, row 2) without bumping into a wall.',
    code: '// Move the turn above the move to fix this bug.\nmove(2);\nturn("right");',
    hint: 'Your first instruction should be turn("right"); and your second should be move(2);.',
    question: 'Can a program run without errors but still do the wrong thing?', answers: ['Yes, it can have a logic bug', 'No, running means perfect', 'Only if the screen is off'], correct: 0,
    feedback: 'Exactly! Checking the result helps you find logic bugs.',
    check: commands => commands.length > 0 && !commands.some(c => c.blocked) && commands.at(-1).x === 4 && commands.at(-1).y === 2 && commands.at(-1).facing === 1
  },
  {
    title: 'Treasure in the corner', short: 'Treasure challenge', icon: '◆', category: 'NAVIGATION CHALLENGE', minutes: 9, challenge: true,
    goals: ['Plan a route on the grid.', 'Reach a target without blocked moves.'],
    intro: 'There’s treasure in the top-right corner! Plan a route from the centre to collect it.',
    explanation: 'Byte starts at column 2, row 2, facing up. The treasure is at <strong>column 4, row 0</strong>. Move up two squares, turn right, and move two more.',
    example: '// Plan first: up, then right.\nmove(2);\nturn("right");',
    mission: 'Reach the top-right corner without hitting the edge. Only after arriving, say “Treasure found!”.',
    code: '// Add your route before the celebration.\nsay("Treasure found!");',
    hint: 'Try move(2); turn("right"); move(2); before the final say().',
    question: 'Why should you plan a route before coding?', answers: ['To avoid all turns', 'To choose the right sequence', 'To make the grid larger'], correct: 1,
    feedback: 'Right! Planning helps you choose the order and number of moves.',
    check: commands => commands.length > 0 && !commands.some(c => c.blocked) && commands.at(-1).type === 'say' && commands.at(-1).text === 'Treasure found!' && commands.at(-1).x === 4 && commands.at(-1).y === 0
  },
  {
    title: 'The robot dance finale', short: 'Dance challenge', icon: '✦', category: 'FINAL CHALLENGE', minutes: 10, challenge: true,
    goals: ['Combine functions, loops, and a counter.', 'Return Byte to the centre facing up.'],
    intro: 'Your final mission combines reusable tricks, repetition, and a score. Let’s make Byte dance!',
    explanation: 'Define <code>danceStep()</code> to move one square and turn right. Repeat that trick four times, counting each step. Finish with <code>say("Dance score: " + score);</code>.',
    example: 'function danceStep() {\n  move(1);\n  turn("right");\n}',
    mission: 'Use danceStep() inside repeat(4, ...). Count the steps in score. Finish back in the centre facing up and say “Dance score: 4”. Avoid blocked moves.',
    code: 'let score = 0;\n\nfunction danceStep() {\n  // Add a move and a right turn.\n}\n\nrepeat(4, () => {\n  danceStep();\n  // Increase score here.\n});\n\nsay("Dance score: " + score);',
    hint: 'Inside danceStep use move(1); and turn("right");. Inside repeat add score = score + 1; after danceStep();.',
    question: 'What makes a function useful in a larger program?', answers: ['It hides all mistakes', 'It replaces every variable', 'It groups reusable instructions'], correct: 2,
    feedback: 'Amazing! Reusable functions help organise bigger ideas into small steps.',
    check: (commands, code) => /\bfunction\s+danceStep\s*\(/.test(code) && /\brepeat\s*\(/.test(code) && /\blet\s+score\s*=/.test(code) && commands.filter(c => c.type === 'move').length === 4 && commands.filter(c => c.type === 'turn').length === 4 && !commands.some(c => c.blocked) && commands.at(-1).type === 'say' && commands.at(-1).text === 'Dance score: 4' && commands.at(-1).x === 2 && commands.at(-1).y === 2 && commands.at(-1).facing === 0
  }
];

const $ = id => document.getElementById(id);
const storageKey = 'bot-academy-progress-v1';
let progress = lessons.map(() => ({ ran: false, quiz: false }));
try {
  const saved = JSON.parse(localStorage.getItem(storageKey));
  if (Array.isArray(saved)) {
    progress = lessons.map((_, index) => ({ ran: saved[index]?.ran === true, quiz: saved[index]?.quiz === true }));
  }
} catch { /* Learning still works when browser storage is unavailable. */ }
let currentLesson = 0;
let initialized = false;
const drafts = lessons.map(lesson => lesson.code);
let worker = null;
let workerTimer = null;
let runToken = 0;
let running = false;

function saveProgress() {
  try { localStorage.setItem(storageKey, JSON.stringify(progress)); } catch { /* Storage is optional. */ }
}
function isComplete(index) { return progress[index].ran && progress[index].quiz; }
function renderPath() {
  $('lessonCards').replaceChildren();
  $('sidebarLessons').replaceChildren();
  lessons.forEach((lesson, index) => {
    const completed = isComplete(index);
    const card = document.createElement('button');
    card.className = `lesson-card${index === currentLesson ? ' selected' : ''}`;
    card.setAttribute('aria-pressed', String(index === currentLesson));
    card.innerHTML = `<span class="card-icon">${lesson.icon}</span><span class="card-number">${completed ? '✓' : String(index + 1).padStart(2, '0')}</span><strong>${lesson.short}</strong><div class="card-meta ${completed ? 'card-complete' : ''}">${completed ? 'Mission complete' : `${lesson.minutes} min · ${lesson.challenge ? 'Challenge' : 'Lesson'}`}</div>`;
    card.addEventListener('click', () => selectLesson(index));
    $('lessonCards').append(card);
    const item = document.createElement('button');
    item.className = `sidebar-lesson${index === currentLesson ? ' selected' : ''}${completed ? ' complete' : ''}`;
    item.setAttribute('aria-pressed', String(index === currentLesson));
    item.innerHTML = `<span class="step-dot">${completed ? '✓' : index + 1}</span>${lesson.short}`;
    item.addEventListener('click', () => { selectLesson(index); $('playground').scrollIntoView({ behavior: 'smooth' }); });
    $('sidebarLessons').append(item);
  });
  const count = progress.filter((_, i) => isComplete(i)).length;
  $('progressText').textContent = `${count} of ${lessons.length} completed`;
  document.querySelector('.nav-count').textContent = lessons.length;
  $('missionCount').textContent = `/ ${lessons.length} missions`;
  $('progressFill').style.width = `${count / lessons.length * 100}%`;
  document.querySelector('.status-tag').textContent = count === lessons.length ? 'ROBOT CODER · LEVEL 2' : 'EXPLORER LEVEL 1';
}
function stopRun() {
  runToken++;
  if (worker) worker.terminate();
  worker = null;
  clearTimeout(workerTimer);
  running = false;
  $('runCode').disabled = false;
}
function setRobot(x = 2, y = 2, direction = 0) {
  $('gridRobot').style.left = `${x * 20 + 10}%`;
  $('gridRobot').style.top = `${y * 20 + 10}%`;
  $('gridRobot').style.transform = 'translate(-50%, -50%)';
  $('gridRobot').querySelector('span').style.transform = `rotate(${direction * 90}deg)`;
}
function selectLesson(index) {
  if (initialized) drafts[currentLesson] = $('codeEditor').value;
  initialized = true;
  stopRun();
  currentLesson = index;
  const lesson = lessons[index];
  $('lessonKicker').textContent = `MISSION ${String(index + 1).padStart(2, '0')} · ${lesson.category}`;
  $('lessonTitle').textContent = lesson.title;
  $('lessonIntro').textContent = lesson.intro;
  $('lessonExplanation').innerHTML = `<p class="explanation">${lesson.explanation}</p>`;
  const example = document.createElement('pre');
  example.className = 'example-code';
  example.textContent = lesson.example;
  $('lessonExplanation').append(example);
  $('missionText').textContent = lesson.mission;
  $('lessonGoals').replaceChildren();
  for (const goal of lesson.goals) {
    const item = document.createElement('li');
    item.textContent = goal;
    $('lessonGoals').append(item);
  }
  $('codeEditor').value = drafts[index];
  updateLineNumbers();
  $('hintText').textContent = lesson.hint;
  $('hintText').hidden = true;
  $('hintButton').setAttribute('aria-expanded', 'false');
  $('quizHeading').textContent = lesson.question;
  $('quizFeedback').textContent = '';
  $('quizFeedback').className = '';
  $('quizAnswers').replaceChildren();
  lesson.answers.forEach((answer, answerIndex) => {
    const button = document.createElement('button');
    button.className = 'quiz-answer';
    button.innerHTML = `<span>${String.fromCharCode(65 + answerIndex)}</span>`;
    button.append(document.createTextNode(answer));
    button.addEventListener('click', () => answerQuiz(answerIndex, button));
    $('quizAnswers').append(button);
  });
  if (progress[index].quiz) {
    $('quizAnswers').children[lesson.correct].classList.add('correct');
    $('quizFeedback').textContent = 'You’ve already answered this one correctly. Try the code again!';
  }
  $('output').innerHTML = '<p class="output-placeholder">Your robot is waiting…<br>Press Run code to try your instructions!</p>';
  $('runStatus').textContent = 'Ready when you are';
  setRobot();
  renderPath();
  updateNext();
}
function updateLineNumbers() {
  $('lineNumbers').innerHTML = Array.from({ length: $('codeEditor').value.split('\n').length }, (_, i) => i + 1).join('<br>');
  $('lineNumbers').scrollTop = $('codeEditor').scrollTop;
}
function updateNext() {
  $('nextLesson').disabled = !isComplete(currentLesson);
  $('nextLesson').firstChild.textContent = currentLesson === lessons.length - 1 ? 'Back to mission map ' : 'Next mission ';
}
function answerQuiz(answerIndex, button) {
  const lesson = lessons[currentLesson];
  for (const option of $('quizAnswers').children) option.classList.remove('incorrect');
  if (answerIndex !== lesson.correct) {
    button.classList.add('incorrect');
    $('quizFeedback').textContent = 'Not quite—have another look at the lesson and try again. You’ve got this!';
    return;
  }
  button.classList.add('correct');
  progress[currentLesson].quiz = true;
  $('quizFeedback').textContent = lesson.feedback + (progress[currentLesson].ran ? ' Mission badge earned! ✦' : ' Now run the mission code to earn your badge.');
  saveProgress();
  renderPath();
  updateNext();
}

// Student code runs in a separate worker, never in the page's DOM.
// A time limit stops accidental endless loops; command limits keep playback small.
const workerSource = `
self.onmessage = function(event) {
  const commands = [];
  let x = 2, y = 2, facing = 0;
  function record(command) {
    if (commands.length >= 100) throw new Error('That is a lot of instructions! Try fewer than 100 robot commands.');
    commands.push({ ...command, x, y, facing });
  }
  function say(message) {
    if (message === undefined) throw new Error('Give say() a message, like say("Hello!");');
    record({type: 'say', text: String(message).slice(0, 500)});
  }
  function move(steps = 1) {
    if (!Number.isInteger(steps) || steps < 1 || steps > 20) throw new Error('Use a whole number from 1 to 20 in move().');
    const directions = [[0, -1], [1, 0], [0, 1], [-1, 0]];
    for (let i = 0; i < steps; i++) {
      const nx = x + directions[facing][0], ny = y + directions[facing][1];
      const blocked = nx < 0 || nx > 4 || ny < 0 || ny > 4;
      if (!blocked) { x = nx; y = ny; }
      record({type: 'move', blocked});
    }
  }
  function turn(direction) {
    if (direction !== 'left' && direction !== 'right') throw new Error('Use turn("left") or turn("right"). Remember the quotes!');
    facing = (facing + (direction === 'right' ? 1 : 3)) % 4;
    record({type: 'turn', direction});
  }
  function repeat(times, action) {
    if (!Number.isInteger(times) || times < 1 || times > 20) throw new Error('Use a whole number from 1 to 20 in repeat().');
    if (typeof action !== 'function') throw new Error('Try repeat(3, () => { say("Beep!"); });');
    for (let i = 0; i < times; i++) action();
  }
  try {
    const program = new Function('say', 'move', 'turn', 'repeat', 'console', '"use strict";\\n' + event.data);
    program(say, move, turn, repeat, {log: (...values) => say(values.join(' '))});
    self.postMessage({ok: true, commands});
  } catch(error) {
    self.postMessage({ok: false, error: String(error.message || error).slice(0, 500)});
  }
};`;

function outputLine(text, error = false) {
  const line = document.createElement('p');
  line.className = error ? 'output-error' : 'output-line';
  line.textContent = text;
  $('output').append(line);
  $('output').scrollTop = $('output').scrollHeight;
}
function runError(message) {
  stopRun();
  $('output').replaceChildren();
  outputLine('Let’s fix this together: ' + message, true);
  $('runStatus').textContent = 'Try a small change';
}
async function runCode() {
  if (running) return;
  stopRun();
  const token = runToken;
  const lessonIndex = currentLesson;
  const code = $('codeEditor').value;
  drafts[lessonIndex] = code;
  if (!code.trim()) { runError('Type an instruction first, or press Reset code.'); return; }
  running = true;
  $('runCode').disabled = true;
  $('output').replaceChildren();
  $('runStatus').textContent = 'Byte is thinking…';
  setRobot();
  let url;
  try {
    url = URL.createObjectURL(new Blob([workerSource], { type: 'text/javascript' }));
    worker = new Worker(url);
    URL.revokeObjectURL(url);
    worker.onerror = () => { if (token === runToken) runError('The code runner could not start. Try a current browser such as Chrome, Edge, Firefox, or Safari.'); };
    worker.onmessage = async event => {
      if (token !== runToken) return;
      clearTimeout(workerTimer);
      worker.terminate();
      worker = null;
      if (!event.data.ok) { runError(event.data.error); return; }
      const commands = event.data.commands;
      $('runStatus').textContent = 'Running your instructions…';
      for (const command of commands) {
        if (token !== runToken) return;
        setRobot(command.x, command.y, command.facing);
        if (command.type === 'say') outputLine(command.text);
        if (command.type === 'move' && command.blocked) outputLine('Edge of the world! Try turning first.');
        await new Promise(resolve => setTimeout(resolve, command.type === 'say' ? 70 : 180));
      }
      if (token !== runToken) return;
      if (commands.length === 0) outputLine('No robot commands yet. Try say("Hello!");');
      else if (!$('output').children.length) outputLine('Movement complete. Nice work!');
      const passed = lessons[lessonIndex].check(commands, code);
      if (passed) {
        progress[lessonIndex].ran = true;
        saveProgress();
        $('runStatus').textContent = 'Mission code ✓';
        if (progress[lessonIndex].quiz) {
          $('quizFeedback').textContent = progress.every((_, i) => isComplete(i)) ? `All ${lessons.length} missions complete! You’re officially a robot coder. Keep experimenting! ✦` : 'Mission complete! You earned your badge. Ready for the next one? ✦';
          $('quizFeedback').className = 'celebration';
        } else {
          $('quizFeedback').textContent = 'Great coding! Answer the question below to earn your mission badge.';
        }
      } else {
        $('runStatus').textContent = 'Code finished';
        outputLine('Keep experimenting! Follow the mission on the left to earn your badge.');
      }
      running = false;
      $('runCode').disabled = false;
      renderPath();
      updateNext();
    };
    workerTimer = setTimeout(() => {
      if (token === runToken) runError('This code took too long. Check for a loop that never stops, then try again.');
    }, 1500);
    worker.postMessage(code);
  } catch {
    if (url) URL.revokeObjectURL(url);
    runError('Your browser could not start the code runner. Try opening this page in a current browser.');
  }
}

$('codeEditor').addEventListener('input', () => { drafts[currentLesson] = $('codeEditor').value; updateLineNumbers(); });
$('codeEditor').addEventListener('scroll', () => { $('lineNumbers').scrollTop = $('codeEditor').scrollTop; });
$('codeEditor').addEventListener('keydown', event => {
  if (event.key === 'Tab') {
    event.preventDefault();
    const editor = event.target;
    const start = editor.selectionStart;
    editor.setRangeText('  ', start, editor.selectionEnd, 'end');
    drafts[currentLesson] = editor.value;
    updateLineNumbers();
  }
  if ((event.ctrlKey || event.metaKey) && event.key === 'Enter') { event.preventDefault(); runCode(); }
  if (event.key === 'Escape') $('runCode').focus();
});
$('codeEditor').setAttribute('aria-description', 'Tab inserts two spaces. Escape leaves the editor. Control or Command plus Enter runs your code.');
$('runCode').addEventListener('click', runCode);
$('resetCode').addEventListener('click', () => {
  stopRun();
  $('codeEditor').value = lessons[currentLesson].code;
  drafts[currentLesson] = lessons[currentLesson].code;
  updateLineNumbers();
  setRobot();
  $('output').innerHTML = '<p class="output-placeholder">Fresh start! Run your code when you’re ready.</p>';
  $('runStatus').textContent = 'Ready when you are';
});
$('hintButton').addEventListener('click', () => {
  $('hintText').hidden = !$('hintText').hidden;
  $('hintButton').setAttribute('aria-expanded', String(!$('hintText').hidden));
});
$('nextLesson').addEventListener('click', () => {
  if (!isComplete(currentLesson)) return;
  if (currentLesson < lessons.length - 1) { selectLesson(currentLesson + 1); $('playground').scrollIntoView({ behavior: 'smooth' }); }
  else $('lessons').scrollIntoView({ behavior: 'smooth' });
});
$('startButton').addEventListener('click', () => {
  const next = progress.findIndex((_, index) => !isComplete(index));
  selectLesson(next < 0 ? 0 : next);
  $('playground').scrollIntoView({ behavior: 'smooth' });
  $('codeEditor').focus({ preventScroll: true });
});
$('resetProgress').addEventListener('click', () => {
  if (!confirm(`Start a fresh adventure? This will reset your ${lessons.length} mission badges.`)) return;
  progress = lessons.map(() => ({ ran: false, quiz: false }));
  lessons.forEach((lesson, index) => { drafts[index] = lesson.code; });
  saveProgress();
  initialized = false;
  selectLesson(0);
});
selectLesson(0);

# Bot Academy

A robot-themed beginner programming tutorial for ages 10–11, built with plain HTML, CSS, and JavaScript.

## Open the website

Double-click **index.html** to open it in a current version of Chrome, Edge, Firefox, or Safari. No installation, internet connection, account, or server is needed.

## What’s included

- Fourteen missions: instructions, sequences, variables, loops, conditions, a square robot challenge, number maths, joining strings, counters, functions, arrays, debugging, a treasure challenge, and a dance finale.
- Two clear learning goals for every mission.
- An editable JavaScript playground with animated robot movement and message output.
- Hints, quizzes with friendly feedback, and mission badges.
- Progress saved on this browser/device when browser storage is available. Private browsing or clearing browser data may remove progress. Code drafts last for the current page session.
- Responsive layouts and keyboard-accessible controls.

Complete a mission by successfully running its code and answering its quiz. All lessons are available from the start. Debugging, treasure, and dance missions require fixing or completing the starter code; use the hint if you get stuck. Existing badges from the original six missions are preserved when you open the expanded course.

## Robot commands

These are teaching helpers provided by the playground, not built-in JavaScript commands:

```js
say("Hello!");            // Display a message.
move(1);                   // Move forward one square.
turn("right");             // Turn 90 degrees: "right" or "left".
repeat(3, () => {           // Run a function three times.
  say("Beep!");
});
```

Byte starts in the centre of a 5 × 5 grid, facing up, each time you run the code. At the edge, Byte stays in the grid; turn to move in another direction. `move()` and `repeat()` accept whole numbers from 1 to 20. Runs are limited to 100 robot commands and 1.5 seconds of code execution.

JavaScript runs in a separate Web Worker, with a time limit to interrupt accidental endless loops. This is an educational runner, not a security sandbox for arbitrary untrusted code; students should write their own code rather than paste unknown scripts.

In the editor, **Ctrl+Enter** (or **Cmd+Enter**) runs the code, **Tab** inserts two spaces, and **Escape** moves focus to the Run code button.

## Files

- `index.html` — page structure and robot artwork.
- `styles.css` — styling and responsive layouts.
- `app.js` — lessons, code runner, quizzes, and progress.
- `tests/runner.test.cjs` — code runner and mission tests.

## Optional tests

With Node.js installed:

```sh
node --test tests/runner.test.cjs
```

No third-party dependencies are required for the site or these tests.

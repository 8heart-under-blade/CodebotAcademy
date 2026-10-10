# Bot Academy

A robot-themed beginner programming tutorial for ages 10–11, built with plain HTML, CSS, and JavaScript.

## Open the website

Double-click **index.html** to open it in a current version of Chrome, Edge, Firefox, or Safari. No installation, internet connection, account, or server is needed.

## What’s included

- Eighteen missions: the original fourteen cover instructions, sequences, variables, loops, conditions, a square robot challenge, number maths, joining strings, counters, functions, arrays, debugging, treasure, and a dance finale. Four **Next-level skills** extensions introduce booleans with `===`, one-parameter functions with two calls, `&&` using battery and map checks, and `for...of` list iteration.
- Two clear learning goals for every mission.
- An editable JavaScript playground with a resizable editor and synchronized line-number gutter, robot movement, and message output.
- Hints, quizzes with friendly feedback, and mission badges.
- Progress saved on this browser/device when browser storage is available. Private browsing or clearing browser data may remove progress. Code drafts last for the current page session.
- Larger instructional text and secondary labels, controls with at least 44px height, wrapping cards, a scrollable desktop sidebar, and layouts that adapt to smaller screens.
- Separate visible **Code** and **Quiz** achievement statuses. Robot column, row, and facing are also shown as text, with zero-based coordinates; this position display does not announce every step through a live region.
- Reduced-motion settings skip timed robot playback and use immediate scrolling. Keyboard focus follows regenerated mission-map/sidebar buttons and stays in the editor or quiz when those controls are being used.

Complete a mission by meeting its code goal and answering its quiz correctly. All lessons are available from the start. Debugging, treasure, dance, and all four extensions require fixing or completing executable starter code; use the hint if you get stuck. Each extension includes a prerequisite reminder, two learning goals, an example, a hint, and a quiz. The extension label makes their position after the core-course finale explicit.

An achievement stays earned after a later unsuccessful run or wrong quiz answer. **Reset code** restores the starter without removing badges; **Reset my progress** explicitly clears achievements and session drafts after confirmation. Resetting code or changing missions cancels the current worker and playback. Late worker messages, errors, and timer callbacks cannot update the canceled run.

The original fourteen lesson positions are unchanged. Existing six- and fourteen-mission badge arrays are extended with unearned entries. Storage still uses the `bot-academy-progress-v1` array of `{ ran, quiz }` entries; lesson IDs are explicit, stable metadata and do not migrate persistence to an ID-based format. Invalid storage or read/write failures do not prevent learning, although changes may not survive a reload.

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

The grid counts columns from left to right and rows from top to bottom, starting at zero. The starting position is column 2, row 2. Square/dance checks require the taught one-square, right-turn route, ending at the centre facing up without blocked moves. Debugging checks the turn-before-move sequence; treasure checks the taught up-then-right route and celebration after arrival. These checks intentionally target the instructions in each mission rather than every possible valid route.

JavaScript runs in a separate Web Worker, with a time limit to interrupt accidental endless loops. This is an educational runner, not a security sandbox for arbitrary untrusted code; students should write their own code rather than paste unknown scripts.

In the editor, **Ctrl+Enter** (or **Cmd+Enter**) runs the code, **Tab** inserts two spaces, and **Escape** moves focus to the Run code button.

## Completion-check limits

Checks combine robot output/position traces with lightweight patterns for the skill being taught. Comments and single-, double-, and backtick-quoted text are masked before testing required syntax, so writing a skill only in a comment or message is insufficient. Quoted `//` and `/* */` markers stay part of strings and do not hide code that follows them.

This is not a full JavaScript parser or proof that a particular construct caused the output. Unused or unreachable code can satisfy syntax evidence; unusual equivalent solutions can fail a pattern. Regular-expression literals and complex nested template expressions are not parsed, and template interpolation is masked with its string. Use the lesson's demonstrated forms. No parser dependency is added.

## Files

- `index.html` — page structure and robot artwork.
- `styles.css` — styling and responsive layouts.
- `app.js` — lessons, code runner, quizzes, and progress.
- `tests/runner.test.cjs` — code runner and mission tests.
- `tests/ui.test.cjs` — controlled DOM, worker, and timer tests for persistence, focus, reduced motion, cancellation, malformed results, and retained achievements.

## Optional tests

With Node.js installed:

```sh
node --test tests/*.test.cjs
node --check app.js
```

No third-party dependencies are required for the site or these tests.

The UI harness verifies state and callback behavior; it does not render a browser. Browser layout, actual resize behavior, screen-reader behavior, and cross-browser `file://` worker support still need manual checks. Font sizes and touch-target changes alone do not establish WCAG conformance.

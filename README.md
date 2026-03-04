# SMCS Ramadan Fawazeer

A single-page quiz/trivia web app for university students to play a daily timed question during Ramadan. Players log in with their student ID, answer within the time limit, and scores are saved to Google Sheets.

## How to Run

Open `index.html` in a browser. No build step required.

The app needs an active **Google Apps Script Web App** endpoint. Set the URL in the `APPS_SCRIPT_URL` constant near the top of the `<script>` block in `index.html`.

## Configuration

Edit these constants at the top of the script block in `index.html`:

| Constant | Purpose | Default |
|---|---|---|
| `APPS_SCRIPT_URL` | Google Apps Script Web App endpoint URL | *(set in source)* |
| `OPEN_HOUR` / `OPEN_MIN` | Daily game window start time | 11:15 |
| `CLOSE_HOUR` / `CLOSE_MIN` | Daily game window end time | 11:45 |

## How the Backend Works

The Google Apps Script Web App exposes two endpoints:

- **GET** -- Returns the current question as JSON:
  ```json
  { "ok": true, "isOpen": true, "question": { "text": "...", "options": ["A","B","C","D"], "correctIndex": 2, "timeLimit": 15 } }
  ```
- **POST** -- Submits a player's result (FormData with fields `id`, `name`, `score`, `time`) and writes it to a Google Sheet.

## File Structure

```
index.html            -- Entire application (HTML + CSS + JS)
images/
  logo.png            -- University logo
  background.png      -- Login screen background
sounds/
  login.mp3           -- Login sound effect
  timer.mp3           -- Countdown tick
  timeup.mp3          -- Time expired
  correct.mp3         -- Correct answer
  incorrect.mp3       -- Incorrect answer
  points.mp3          -- Score reveal
tests/
  game-logic.test.js  -- Unit tests for scoring and helpers
```

## Running Tests

```bash
node tests/game-logic.test.js
```

Or with npm:

```bash
npm test
```

## Scoring Formula

```
score = max(0, floor((timeLimit - timeTaken) * 10))
```

Faster answers earn more points. If the player runs out of time or answers incorrectly, the score is 0.

## Duplicate Prevention

The app uses `localStorage` keys scoped by date to prevent replays:

- `started_<userId>` -- set when a game begins (prevents refresh exploit)
- `played_<userId>` -- set when a result is saved successfully

## Tech Stack

Vanilla HTML, CSS, and JavaScript. Zero external dependencies.

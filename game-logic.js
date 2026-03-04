// game-logic.js
// Pure functions extracted from index.html for testing.
// These are COPIES — the originals remain in index.html.

// Default game-window constants (match index.html defaults)
const OPEN_HOUR = 11;
const OPEN_MIN = 15;
const CLOSE_HOUR = 11;
const CLOSE_MIN = 45;

/**
 * Check whether the current time falls within the game window.
 * Accepts optional hour/minute overrides so tests can inject any window
 * without monkey-patching Date.
 */
function isOpenNow(now, openH, openM, closeH, closeM) {
  if (!(now instanceof Date)) now = new Date();
  if (openH === undefined) openH = OPEN_HOUR;
  if (openM === undefined) openM = OPEN_MIN;
  if (closeH === undefined) closeH = CLOSE_HOUR;
  if (closeM === undefined) closeM = CLOSE_MIN;

  const openT = new Date(now);
  openT.setHours(openH, openM, 0, 0);

  const closeT = new Date(now);
  closeT.setHours(closeH, closeM, 0, 0);

  return now >= openT && now <= closeT;
}

/**
 * Format a millisecond difference into "HH:MM:SS".
 * Mirrors the index.html implementation exactly.
 */
function formatCountdown(ms) {
  const total = Math.max(0, Math.floor(ms / 1000));
  const h = Math.floor(total / 3600);
  const m = Math.floor((total % 3600) / 60);
  const s = total % 60;
  return (
    String(h).padStart(2, "0") +
    ":" +
    String(m).padStart(2, "0") +
    ":" +
    String(s).padStart(2, "0")
  );
}

/**
 * Calculate the score for an answer.
 *   score = max(0, floor((timeLimit - timeTaken) * 10))
 */
function calculateScore(timeLimit, timeTaken) {
  return Math.max(0, Math.floor((timeLimit - timeTaken) * 10));
}

/**
 * Validate a student ID: exactly 9 digits, starts with "20".
 * Returns true when the ID is valid.
 */
function isValidStudentId(id) {
  return /^20\d{7}$/.test(id);
}

module.exports = {
  OPEN_HOUR,
  OPEN_MIN,
  CLOSE_HOUR,
  CLOSE_MIN,
  isOpenNow,
  formatCountdown,
  calculateScore,
  isValidStudentId,
};

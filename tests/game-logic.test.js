// tests/game-logic.test.js
// Runnable with:  node tests/game-logic.test.js
// Uses only the Node.js built-in assert module — no external dependencies.

const assert = require("assert");
const {
  isOpenNow,
  formatCountdown,
  calculateScore,
  isValidStudentId,
} = require("../game-logic");

// ── Helpers ─────────────────────────────────────────────────────────

let passed = 0;
let failed = 0;

function test(name, fn) {
  try {
    fn();
    passed++;
    console.log("  PASS  " + name);
  } catch (err) {
    failed++;
    console.log("  FAIL  " + name);
    console.log("        " + err.message);
  }
}

/** Build a Date for today at the given h:m:s. */
function todayAt(h, m, s) {
  const d = new Date();
  d.setHours(h, m, s || 0, 0);
  return d;
}

// ── isOpenNow ───────────────────────────────────────────────────────

console.log("\nisOpenNow()");

test("returns true when current time is inside the window", () => {
  // Default window: 11:15 - 11:45
  const now = todayAt(11, 30, 0);
  assert.strictEqual(isOpenNow(now), true);
});

test("returns false when current time is before the window", () => {
  const now = todayAt(10, 0, 0);
  assert.strictEqual(isOpenNow(now), false);
});

test("returns false when current time is after the window", () => {
  const now = todayAt(12, 0, 0);
  assert.strictEqual(isOpenNow(now), false);
});

test("returns true exactly at the open time (edge)", () => {
  const now = todayAt(11, 15, 0);
  assert.strictEqual(isOpenNow(now), true);
});

test("returns true exactly at the close time (edge)", () => {
  const now = todayAt(11, 45, 0);
  assert.strictEqual(isOpenNow(now), true);
});

test("returns false one second before the open time", () => {
  const now = todayAt(11, 14, 59);
  assert.strictEqual(isOpenNow(now), false);
});

test("returns false one second after the close time", () => {
  // 11:45:01 — the Date will be > closeT (11:45:00.000)
  const d = new Date();
  d.setHours(11, 45, 1, 0);
  assert.strictEqual(isOpenNow(d), false);
});

test("works with a custom window (param overrides)", () => {
  const now = todayAt(14, 0, 0);
  assert.strictEqual(isOpenNow(now, 13, 0, 15, 0), true);
  assert.strictEqual(isOpenNow(now, 15, 0, 16, 0), false);
});

// ── formatCountdown ─────────────────────────────────────────────────

console.log("\nformatCountdown()");

test("formats hours, minutes, and seconds", () => {
  // 1h 2m 3s = 3723 seconds = 3723000 ms
  assert.strictEqual(formatCountdown(3723000), "01:02:03");
});

test("formats minutes and seconds (no hours)", () => {
  // 5m 30s = 330000 ms
  assert.strictEqual(formatCountdown(330000), "00:05:30");
});

test("formats seconds only", () => {
  assert.strictEqual(formatCountdown(9000), "00:00:09");
});

test("returns 00:00:00 for zero", () => {
  assert.strictEqual(formatCountdown(0), "00:00:00");
});

test("treats negative values as zero (clamps to 0)", () => {
  assert.strictEqual(formatCountdown(-5000), "00:00:00");
});

test("handles large values correctly (24+ hours)", () => {
  // 90061 seconds = 25h 1m 1s
  assert.strictEqual(formatCountdown(90061000), "25:01:01");
});

test("truncates sub-second remainder (floor)", () => {
  // 1500 ms -> 1 second
  assert.strictEqual(formatCountdown(1500), "00:00:01");
  // 999 ms -> 0 seconds
  assert.strictEqual(formatCountdown(999), "00:00:00");
});

// ── calculateScore ──────────────────────────────────────────────────

console.log("\ncalculateScore()");

test("normal case: partial time used", () => {
  // timeLimit=15, timeTaken=5 => (15-5)*10 = 100
  assert.strictEqual(calculateScore(15, 5), 100);
});

test("instant answer (0 time taken)", () => {
  // timeLimit=15, timeTaken=0 => 150
  assert.strictEqual(calculateScore(15, 0), 150);
});

test("full time used equals zero score", () => {
  // timeLimit=15, timeTaken=15 => 0
  assert.strictEqual(calculateScore(15, 15), 0);
});

test("timed out (timeTaken > timeLimit) returns 0, not negative", () => {
  assert.strictEqual(calculateScore(15, 20), 0);
});

test("fractional time taken is floored", () => {
  // (15 - 14.95) * 10 = 0.5 => floor => 0
  assert.strictEqual(calculateScore(15, 14.95), 0);
  // (15 - 10.3) * 10 = 46.999... => floor => 46
  assert.strictEqual(calculateScore(15, 10.3), 46);
});

test("very fast answer gets maximum score", () => {
  // (15 - 0.1) * 10 = 149
  assert.strictEqual(calculateScore(15, 0.1), 149);
});

test("works with different time limits", () => {
  // timeLimit=30, timeTaken=10 => 200
  assert.strictEqual(calculateScore(30, 10), 200);
  // timeLimit=5, timeTaken=3 => 20
  assert.strictEqual(calculateScore(5, 3), 20);
});

// ── isValidStudentId ────────────────────────────────────────────────

console.log("\nisValidStudentId()");

test("accepts a valid 9-digit ID starting with 20", () => {
  assert.strictEqual(isValidStudentId("201234567"), true);
});

test("accepts boundary values", () => {
  assert.strictEqual(isValidStudentId("200000000"), true);
  assert.strictEqual(isValidStudentId("209999999"), true);
});

test("rejects ID that is too short", () => {
  assert.strictEqual(isValidStudentId("20123456"), false);
});

test("rejects ID that is too long", () => {
  assert.strictEqual(isValidStudentId("2012345678"), false);
});

test("rejects ID that does not start with 20", () => {
  assert.strictEqual(isValidStudentId("191234567"), false);
  assert.strictEqual(isValidStudentId("211234567"), false);
  assert.strictEqual(isValidStudentId("301234567"), false);
});

test("rejects non-numeric input", () => {
  assert.strictEqual(isValidStudentId("20abcdefg"), false);
  assert.strictEqual(isValidStudentId("2012345ab"), false);
});

test("rejects empty string", () => {
  assert.strictEqual(isValidStudentId(""), false);
});

test("rejects null and undefined", () => {
  assert.strictEqual(isValidStudentId(null), false);
  assert.strictEqual(isValidStudentId(undefined), false);
});

test("accepts numeric type (regex .test coerces to string, matching index.html behaviour)", () => {
  // typeof 201234567 is 'number'; regex .test() coerces to string, so this passes.
  // This matches index.html behaviour which also uses regex .test() on the value.
  assert.strictEqual(isValidStudentId(201234567), true);
});

test("rejects ID with spaces", () => {
  assert.strictEqual(isValidStudentId(" 201234567"), false);
  assert.strictEqual(isValidStudentId("201234567 "), false);
});

// ── Summary ─────────────────────────────────────────────────────────

console.log("\n---------------------------------------");
console.log("  Total : " + (passed + failed));
console.log("  Passed: " + passed);
console.log("  Failed: " + failed);
console.log("---------------------------------------");

if (failed > 0) {
  process.exit(1);
}

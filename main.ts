// SPDX-License-Identifier: MIT
// Ship It Friday — one funny git commit message an AI coding agent writes
// in the moment before it breaks production on a Friday. Deterministic:
// the same line, every run, written to /output/entry.txt.
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";

const LINE =
  "fix: CI was red, so I made red green in the stylesheet — all tests pass, ship it, it's Friday";

const OUT = "/output/entry.txt";

function fail(message: string): never {
  throw new Error(message);
}

// Gate (competition.yaml): /output/entry.txt must be UTF-8 text of 1 to 159
// characters, not only white space. Check the line before writing it.
const chars = [...LINE];
if (chars.length < 1 || chars.length > 159) {
  fail(`entry is ${chars.length} chars, must be 1-159`);
}
if (LINE !== LINE.trim()) fail("entry has edge whitespace");
if (LINE.trim().length === 0) fail("entry is only whitespace");
if (/[\u0000-\u001F\u007F]/.test(LINE)) fail("entry has control characters");
if (LINE.includes("\n") || LINE.includes("\r")) fail("entry must be one line");

mkdirSync("/output", { recursive: true });
writeFileSync(OUT, LINE, "utf8");

// Read back with a strict UTF-8 decoder so invalid bytes fail loudly
// instead of being silently replaced by readFileSync's utf8 decoding.
const back = new TextDecoder("utf-8", { fatal: true }).decode(
  readFileSync(OUT),
);
if (back !== LINE) fail("read-back mismatch");
console.log(`wrote ${chars.length} chars to ${OUT}`);

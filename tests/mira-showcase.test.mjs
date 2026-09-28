import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { test } from "node:test";
import {
  MIRA_ROTATE_MS,
  MIRA_SHOWCASE,
  createShowcaseController,
  nextMiraIndex,
  parseMiraAnswer,
  renderPair,
  shouldRotateMira,
} from "../js/mira-showcase.js";

const page = readFileSync(new URL("../index.html", import.meta.url), "utf8");

test("rotates in the 6–8s band and wraps", () => {
  assert.ok(MIRA_ROTATE_MS >= 6000 && MIRA_ROTATE_MS <= 8000);
  assert.equal(nextMiraIndex(0, 6), 1);
  assert.equal(nextMiraIndex(5, 6), 0);
});

test("pauses on hover or focus and still swaps under reduced motion", () => {
  assert.equal(shouldRotateMira({ prefersReducedMotion: false, paused: false }), true);
  assert.equal(shouldRotateMira({ prefersReducedMotion: false, paused: true }), false);
  assert.equal(shouldRotateMira({ prefersReducedMotion: true, paused: false }), true);
  assert.equal(shouldRotateMira({ prefersReducedMotion: true, paused: true }), false);
});

test("first marked figure is the single oker highlight", () => {
  const parts = parseMiraAnswer("Budget-neutral ≈ **+4.9%** after **+2.6%** food.");
  assert.deepEqual(parts, [
    { type: "text", value: "Budget-neutral ≈ " },
    { type: "mark", value: "+4.9%", highlight: true },
    { type: "text", value: " after " },
    { type: "mark", value: "+2.6%", highlight: false },
    { type: "text", value: " food." },
  ]);
});

test("rotation interval pauses while hovered", () => {
  let paused = false;
  const seen = [];
  let queued = null;
  const controller = createShowcaseController({
    length: 3,
    rotateMs: MIRA_ROTATE_MS,
    isPaused: () => paused,
    onAdvance: (index) => seen.push(index),
    setInterval: (fn, ms) => {
      assert.equal(ms, MIRA_ROTATE_MS);
      queued = fn;
      return 1;
    },
    clearInterval: () => { queued = null; },
  });
  controller.start();
  assert.equal(typeof queued, "function");
  queued();
  assert.deepEqual(seen, [1]);
  paused = true;
  controller.sync();
  assert.equal(queued, null);
  paused = false;
  controller.sync();
  queued();
  assert.deepEqual(seen, [1, 2]);
  controller.stop();
  assert.equal(queued, null);
});

test("Arcanta marketing pairs are present in EN, NL and FR", () => {
  for (const lang of ["en", "nl", "fr"]) {
    assert.equal(MIRA_SHOWCASE[lang].pairs.length, 6);
    assert.equal(MIRA_SHOWCASE[lang].name, "MIRA");
    assert.equal(MIRA_SHOWCASE[lang].chip, "QUICK");
  }
  assert.equal(
    MIRA_SHOWCASE.en.pairs[0].q,
    "Indexation lifts food ~+2.6% — what should selling prices do?",
  );
  assert.match(MIRA_SHOWCASE.en.pairs[0].a, /\*\*\+4\.9%\*\*/);
  assert.equal(MIRA_SHOWCASE.en.inputPlaceholder, "Ask a question…");
  assert.equal(MIRA_SHOWCASE.nl.pairs[0].q, "Indexatie food ≈ +2,6% — wat moet de verkoopprijs doen?");
  assert.equal(
    MIRA_SHOWCASE.fr.pairs[0].q,
    "L'indexation food ≈ +2,6 % — que faire du prix de vente ?",
  );
  assert.equal(MIRA_SHOWCASE.fr.inputPlaceholder, "Posez une question…");
});

test("rendered pair uses navy user bubble, soft assistant bubble and mini-stats", () => {
  const html = renderPair(MIRA_SHOWCASE.en.pairs[0]);
  assert.match(html, /class="bub q"/);
  assert.match(html, /class="bub a"/);
  assert.match(html, /class="mini-stats"/);
  assert.match(html, /class="mira-key mira-highlight"/);
  assert.equal((html.match(/mira-highlight/g) || []).length, 1);
  assert.match(html, /\+2\.6%/);
  assert.doesNotMatch(html, /<form|<input|<button|fetch\(|\/api\/mira/i);
});

test("page showcase is decorative, uses the real Mira mark, and respects reduced motion", () => {
  const start = page.indexOf('data-mira-showcase');
  assert.ok(start > 0, "showcase is mounted in the page");
  const slice = page.slice(start, page.indexOf("</section>", start));
  assert.match(slice, /class="bub q"/);
  assert.match(slice, /class="bub a"/);
  assert.match(slice, /class="mini-stats"/);
  assert.match(slice, /r="7\.4"/);
  assert.match(slice, /#C48A3F/i);
  assert.doesNotMatch(slice, /<form[\s>]|<input[\s>]|<button[\s>]|fetch\(|\/api\/mira|EventSource|WebSocket/i);
  assert.match(page, /prefers-reduced-motion:\s*reduce/);
  assert.match(page, /border-bottom-right-radius:\s*5px/);
  assert.match(page, /border-bottom-left-radius:\s*5px/);
  assert.match(page, /js\/mira-showcase\.js/);
  assert.doesNotMatch(slice, /logo-plate|logo-pill/);
});

import test from "node:test";
import assert from "node:assert/strict";
import { nextTabIndex } from "./tabs.ts";

test("right and down move forward and wrap", () => {
  assert.equal(nextTabIndex(0, "ArrowRight", 5), 1);
  assert.equal(nextTabIndex(4, "ArrowRight", 5), 0);
  assert.equal(nextTabIndex(4, "ArrowDown", 5), 0);
});

test("left and up move back and wrap", () => {
  assert.equal(nextTabIndex(2, "ArrowLeft", 5), 1);
  assert.equal(nextTabIndex(0, "ArrowLeft", 5), 4);
  assert.equal(nextTabIndex(0, "ArrowUp", 5), 4);
});

test("Home and End jump to the ends", () => {
  assert.equal(nextTabIndex(3, "Home", 5), 0);
  assert.equal(nextTabIndex(1, "End", 5), 4);
});

test("other keys are ignored", () => {
  assert.equal(nextTabIndex(2, "Enter", 5), null);
  assert.equal(nextTabIndex(2, "a", 5), null);
});

test("a single tab stays put and an empty list yields null", () => {
  assert.equal(nextTabIndex(0, "ArrowRight", 1), 0);
  assert.equal(nextTabIndex(0, "ArrowRight", 0), null);
});

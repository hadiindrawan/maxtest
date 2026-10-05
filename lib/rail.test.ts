import test from "node:test";
import assert from "node:assert/strict";
import { pickActiveId } from "./rail.ts";

const order = ["a", "b", "c"];

test("the first visible section in document order wins", () => {
  assert.equal(pickActiveId(order, new Set(["b", "c"]), "a"), "b");
});

test("document order decides, not the order sections became visible", () => {
  assert.equal(pickActiveId(order, new Set(["c", "a"]), "c"), "a");
});

test("when nothing is visible the previous section stays active", () => {
  assert.equal(pickActiveId(order, new Set(), "b"), "b");
});

test("an unknown visible id is ignored", () => {
  assert.equal(pickActiveId(order, new Set(["zzz"]), "a"), "a");
});

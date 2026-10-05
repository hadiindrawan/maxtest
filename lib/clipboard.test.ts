import test from "node:test";
import assert from "node:assert/strict";
import { copyText } from "./clipboard.ts";

test("resolves 'copied' when the clipboard accepts the text", async () => {
  let written = "";
  const result = await copyText("hello", { writeText: async (t: string) => void (written = t) });
  assert.equal(result, "copied");
  assert.equal(written, "hello");
});

test("resolves 'failed' (does not throw) when the clipboard rejects", async () => {
  const result = await copyText("hello", {
    writeText: async () => {
      throw new Error("NotAllowedError");
    },
  });
  assert.equal(result, "failed");
});

test("resolves 'failed' when no clipboard exists", async () => {
  assert.equal(await copyText("hello", undefined), "failed");
});

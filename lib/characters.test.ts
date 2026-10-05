import test from "node:test";
import assert from "node:assert/strict";
import { existsSync, readFileSync, statSync } from "node:fs";
import path from "node:path";
import { allCharacterFiles, characterAlt, characterFile, characterSrc, POSES, ROLES } from "./characters.ts";

const root = path.resolve(import.meta.dirname, "..");
const manifest = JSON.parse(readFileSync(path.join(root, "lib/character-manifest.json"), "utf8")) as Record<
  string,
  { width: number; height: number }
>;

test("file names follow the max-/cast- convention with a -noexhaust suffix", () => {
  assert.equal(characterFile({ kind: "max", pose: "main" }, "exhaust"), "max-main.png");
  assert.equal(characterFile({ kind: "max", pose: "idle" }, "noexhaust"), "max-idle-noexhaust.png");
  assert.equal(characterFile({ kind: "cast", role: "runner" }, "exhaust"), "cast-runner.png");
  assert.equal(characterSrc({ kind: "cast", role: "fail" }, "noexhaust"), "/characters/cast-fail-noexhaust.png");
});

test("every ref and variant is enumerated exactly once", () => {
  const files = allCharacterFiles();
  assert.equal(files.length, (POSES.length + ROLES.length) * 2);
  assert.equal(new Set(files).size, files.length);
});

test("every shipped file exists, is in the manifest, and is within the size budget", () => {
  for (const file of allCharacterFiles()) {
    const full = path.join(root, "public/characters", file);
    assert.ok(existsSync(full), `${file} is missing from public/characters`);
    assert.ok(manifest[file]?.width > 0 && manifest[file]?.height > 0, `${file} is missing from the manifest`);
    const kb = statSync(full).size / 1024;
    const limit = file === "max-main.png" ? 50 : 40;
    assert.ok(kb <= limit, `${file} is ${kb.toFixed(1)} KB, limit ${limit} KB`);
  }
});

test("alt text is non-empty and distinct per role", () => {
  const alts = ROLES.map((role) => characterAlt({ kind: "cast", role }));
  assert.ok(alts.every((a) => a.length > 3));
  assert.equal(new Set(alts).size, ROLES.length);
  assert.match(characterAlt({ kind: "max", pose: "main" }), /Max/);
});

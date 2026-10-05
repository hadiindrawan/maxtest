import test from "node:test";
import assert from "node:assert/strict";
import { appLink, loginUrl, signupUrl } from "./links.ts";

test("signupUrl joins base and signup path", () => {
  assert.equal(signupUrl("https://app.maxtest.id"), "https://app.maxtest.id/auth?action=signup");
});

test("trailing slashes and whitespace on the base are ignored", () => {
  assert.equal(signupUrl("  https://app.maxtest.id/// "), "https://app.maxtest.id/auth?action=signup");
});

test("unset base falls back instead of producing 'undefined/auth'", () => {
  assert.equal(signupUrl(undefined), "/pricing");
  assert.equal(loginUrl(undefined), "/");
});

test("empty or blank base falls back", () => {
  assert.equal(signupUrl(""), "/pricing");
  assert.equal(signupUrl("   "), "/pricing");
});

test("loginUrl uses the login path", () => {
  assert.equal(loginUrl("https://app.maxtest.id"), "https://app.maxtest.id/auth?action=login");
});

test("appLink adds a missing leading slash", () => {
  assert.equal(appLink("https://x.io", "docs", "/"), "https://x.io/docs");
});

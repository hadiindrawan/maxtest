import test from "node:test";
import assert from "node:assert/strict";
import { loginUrl, signupUrl } from "./links.ts";

test("sign in and sign up both land on the closed-registration page", () => {
  assert.equal(loginUrl(), "/login");
  assert.equal(signupUrl(), "/login");
});

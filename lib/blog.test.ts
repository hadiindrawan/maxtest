import test from "node:test";
import assert from "node:assert/strict";
import { blogPosts } from "./blog-data.ts";
import { formatReadTime, readMinutes } from "./blog.ts";

const words = (n: number) => Array.from({ length: n }, (_, i) => `w${i}`).join(" ");

test("empty content still reads as one minute", () => {
  assert.equal(readMinutes(""), 1);
  assert.equal(readMinutes("<p></p>"), 1);
});

test("200 words per minute, rounded up", () => {
  assert.equal(readMinutes(words(200)), 1);
  assert.equal(readMinutes(words(201)), 2);
  assert.equal(readMinutes(words(400)), 2);
});

test("HTML tags do not count as words", () => {
  assert.equal(readMinutes(`<p>${words(200)}</p><h2></h2><ul><li></li></ul>`), 1);
});

test("formatReadTime", () => {
  assert.equal(formatReadTime(1), "1 min read");
  assert.equal(formatReadTime(7), "7 min read");
});

test("blog posts no longer carry a hard-coded reading time", () => {
  for (const post of blogPosts) assert.ok(!("readingTime" in post), post.slug);
});

test("blog post bodies contain no emoji", () => {
  for (const post of blogPosts) assert.deepEqual([...post.content.matchAll(/\p{Extended_Pictographic}/gu)].map((m) => m[0]), [], post.slug);
});

test("posts are valid: slug, title, ISO date, content", () => {
  for (const post of blogPosts) {
    assert.match(post.slug, /^[a-z0-9-]+$/);
    assert.ok(post.title.length > 5 && post.content.length > 200);
    assert.match(post.date, /^\d{4}-\d{2}-\d{2}$/);
  }
});

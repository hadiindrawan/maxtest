# Maxtest Landing Page Redesign Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Rebuild the Maxtest home page, Navbar, Footer and global tokens in the dark, lime-accent, rocket-character style, selling the MCP server first.

**Architecture:** Tokens first (`globals.css` + `next/font`), then small UI primitives, then one server-component file per home section composed in `app/page.tsx`. All copy and cast data live in `lib/home-content.ts`. Logic that can break (URL building, clipboard, tab keys, copy rules, asset integrity) is pure TypeScript in `lib/` with `node:test` tests; visual pieces are verified by build, lint, HTTP checks and a manual browser pass.

**Tech Stack:** Next.js 16 (App Router), React 19, Tailwind v4, Framer Motion (already installed), `next/font`, `next/image`, Node's built-in test runner (Node 24 strips TypeScript types, so no new dependencies).

**Spec:** `docs/superpowers/specs/2026-10-05-landing-redesign-design.md`

## Global Constraints

Every task's requirements implicitly include these (values copied from the spec):

- Colors: background `#0e0e10`; panel `#17171a`; hairline `#2e2e34`; text `#f2f2ee`; accent lime `#c6f24a` (the only brand accent); dark lime `#6d8a1f` for button shadow. Character colors are used only on characters and pass/fail status, never for UI chrome.
- Home page must not use: glow or neon shadows, gradient text, `glass-panel`, `bg-grid`, `text-glow`, pill badges. Shared utilities stay in `globals.css` (other pages still use them), re-colored to lime.
- Type: Bricolage Grotesque 800 for headlines, Noto Sans for body, monospace for every tool call and code block. Fonts load through `next/font`, not a Google Fonts `<link>`.
- Primary action is "Start free" and goes to `${NEXT_PUBLIC_APP_URL}/auth?action=signup`.
- MCP endpoint comes only from `NEXT_PUBLIC_MCP_URL`; never hard-code a host. "Read the MCP docs" links to `/documentation`.
- Allowed claims only (see `lib/home-content.ts` copy rules). Removed for good: "zero flake", "Zero Manual Setup", "Powered by Advanced RAG", "self-healing", "Enterprise-grade". Tool count is written "40+" and must match the backend registry (41 at spec time).
- Characters: `Max` with exhaust is used large (hero, final CTA); the no-exhaust variant is used small (nav, result row, cast, Gatekeeper). Shipped poses: `main`, `idle`, `smile`. Asset budget: under 50 KB for `max-main.png`, under 40 KB for every other file.
- `prefers-reduced-motion`: final state renders immediately; no typing, wobble or slide.
- Layout works from 360px to 1440px with no horizontal page scroll.
- No social proof section. Dashboard screenshot is a labeled placeholder until the owner supplies one.
- `/features`, `/pricing`, `/documentation`, `/blog`, `/privacy`, `/terms` keep their layouts; they only inherit tokens, Navbar and Footer. No backend changes. The pricing model change is out of scope.

## Review Focus

The spec is silent on these; each has a test in the named task:

1. `NEXT_PUBLIC_MCP_URL` unset, without a scheme, with a trailing slash, or already ending in `/mcp`: the command must still be a valid, single-`/mcp` URL, and unset must show an obvious placeholder (Task 1).
2. `NEXT_PUBLIC_APP_URL` unset: the current page renders the broken link `undefined/auth?action=signup`. The new links must fall back to `/pricing` (signup) and `/` (login) (Task 1).
3. Clipboard API missing or rejecting (insecure context, denied permission): the copy button must not throw, must say it failed, and the command must stay selectable (Tasks 7).
4. Keyboard users on the cast tabs: arrows wrap, Home and End work, unrelated keys are ignored (Task 8).
5. 360px screens: long tool names and the connect command must scroll or wrap inside their panel, never widen the page (Tasks 6, 7, 8 CSS; checked in Task 12).

Also covered: all-pass results ("8 passed, 0 failed") in Task 5, and no-JS / reduced-motion final state in Tasks 6 and 12.

## File Structure

```
.env.example                         NEW  documents the three NEXT_PUBLIC_ vars
.gitignore                           MOD  ignore .superpowers/
package.json                         MOD  "test" script
tsconfig.json                        MOD  allowImportingTsExtensions
scripts/build-characters.mjs         NEW  optimize art into public/characters + manifest
public/characters/*.png              NEW  22 shipped sprites
lib/links.ts (+ .test.ts)            NEW  signupUrl, loginUrl, appLink
lib/mcp-command.ts (+ .test.ts)      NEW  endpoint normalisation + connect command
lib/characters.ts (+ .test.ts)       NEW  refs, file names, alt text, asset integrity
lib/character-manifest.json          NEW  generated width/height per sprite
lib/clipboard.ts (+ .test.ts)        NEW  copyText with graceful failure
lib/tabs.ts (+ .test.ts)             NEW  nextTabIndex for roving tabs
lib/home-content.ts (+ .test.ts)     NEW  all copy, cast, facts, banned-phrase rules
app/globals.css                      MOD  tokens, lime utilities, motion classes
app/layout.tsx                       MOD  next/font, drop Google Fonts link
app/page.tsx                         MOD  composes sections only
components/ui/{Character,Bubble,Button,Tag}.tsx   NEW
components/home/{Hero,ResultRow,ConnectBlock,CastSection,ControlSection,
                 DashboardSection,PricingTeaser,FinalCta}.tsx   NEW
components/{Navbar,Footer,AnimatedSection,CTAButton,VideoPlayer}.tsx   MOD
README.md                            MOD  env var notes
```

Node note: in a non-interactive shell, `node` may not be on PATH. Run `source ~/.nvm/nvm.sh` first (Node 24 is installed under nvm).

---

### Task 1: Branch, test harness, link and MCP-command helpers

**Files:**
- Modify: `.gitignore`, `package.json`, `tsconfig.json`
- Create: `.env.example`, `lib/links.ts`, `lib/links.test.ts`, `lib/mcp-command.ts`, `lib/mcp-command.test.ts`

**Interfaces:**
- Produces: `appLink(base, path, fallback): string`, `signupUrl(base?): string`, `loginUrl(base?): string`, `mcpEndpoint(raw): { endpoint: string; configured: boolean }`, `buildConnectCommand(raw?): { endpoint: string; command: string; configured: boolean }`, constant `MCP_PLACEHOLDER_HOST`.

- [ ] **Step 1: Create the feature branch and commit the design inputs**

The current branch (`chore/security-dep-updates`) carries the Next 16.3.8 bump, so branch from it.

```bash
cd /home/hadi/personal/maxtest
git switch -c feat/landing-redesign
printf '\n# visual brainstorming mockups\n.superpowers/\n' >> .gitignore
git add .gitignore docs/
git commit -m "docs: add landing redesign spec, plan and design assets"
```

Expected: `git status --short` prints nothing.

- [ ] **Step 2: Add the test script and TypeScript setting**

In `package.json` add to `"scripts"`:

```json
"test": "node --test \"lib/**/*.test.ts\""
```

In `tsconfig.json` add inside `compilerOptions` (needed so test files can import `./x.ts`, which Node requires):

```json
"allowImportingTsExtensions": true,
```

- [ ] **Step 3: Write the failing tests for `links`**

Create `lib/links.test.ts`:

```ts
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
```

- [ ] **Step 4: Run to verify it fails**

Run: `npm test`
Expected: FAIL, `Cannot find module './links.ts'`.

- [ ] **Step 5: Implement `lib/links.ts`**

```ts
export const SIGNUP_PATH = "/auth?action=signup";
export const LOGIN_PATH = "/auth?action=login";

/** Joins an app base URL and a path; returns `fallback` when the base is unset or blank. */
export function appLink(base: string | undefined, path: string, fallback: string): string {
  const trimmed = (base ?? "").trim().replace(/\/+$/, "");
  if (!trimmed) return fallback;
  return `${trimmed}${path.startsWith("/") ? path : `/${path}`}`;
}

export function signupUrl(base: string | undefined = process.env.NEXT_PUBLIC_APP_URL): string {
  return appLink(base, SIGNUP_PATH, "/pricing");
}

export function loginUrl(base: string | undefined = process.env.NEXT_PUBLIC_APP_URL): string {
  return appLink(base, LOGIN_PATH, "/");
}
```

- [ ] **Step 6: Run to verify it passes**

Run: `npm test`
Expected: PASS, 6 tests in `links.test.ts`.

- [ ] **Step 7: Write the failing tests for `mcp-command`**

Create `lib/mcp-command.test.ts`:

```ts
import test from "node:test";
import assert from "node:assert/strict";
import { buildConnectCommand, mcpEndpoint, MCP_PLACEHOLDER_HOST } from "./mcp-command.ts";

test("unset host shows an obvious placeholder and is not configured", () => {
  assert.deepEqual(mcpEndpoint(undefined), { endpoint: `${MCP_PLACEHOLDER_HOST}/mcp`, configured: false });
  assert.deepEqual(mcpEndpoint("   "), { endpoint: `${MCP_PLACEHOLDER_HOST}/mcp`, configured: false });
});

test("appends /mcp to a bare host", () => {
  assert.equal(mcpEndpoint("https://api.maxtest.id").endpoint, "https://api.maxtest.id/mcp");
});

test("trailing slashes are removed before appending", () => {
  assert.equal(mcpEndpoint("https://api.maxtest.id//").endpoint, "https://api.maxtest.id/mcp");
});

test("does not double /mcp, in any case", () => {
  assert.equal(mcpEndpoint("https://api.maxtest.id/mcp").endpoint, "https://api.maxtest.id/mcp");
  assert.equal(mcpEndpoint("https://api.maxtest.id/MCP/").endpoint, "https://api.maxtest.id/MCP");
});

test("adds https when the scheme is missing, keeps http for local dev", () => {
  assert.equal(mcpEndpoint("api.maxtest.id").endpoint, "https://api.maxtest.id/mcp");
  assert.equal(mcpEndpoint("http://localhost:8081").endpoint, "http://localhost:8081/mcp");
});

test("buildConnectCommand matches the app's own connect command", () => {
  const { command, configured } = buildConnectCommand("https://api.maxtest.id");
  assert.equal(
    command,
    'claude mcp add --transport http maxtest https://api.maxtest.id/mcp --header "Authorization: Bearer <your-token>"',
  );
  assert.equal(configured, true);
});
```

- [ ] **Step 8: Run to verify it fails**

Run: `npm test`
Expected: FAIL, `Cannot find module './mcp-command.ts'`.

- [ ] **Step 9: Implement `lib/mcp-command.ts`**

```ts
export const MCP_PLACEHOLDER_HOST = "<your-maxtest-host>";

export interface ConnectInfo {
  endpoint: string;
  command: string;
  configured: boolean;
}

/** Normalises the configured MCP host into a single `/mcp` endpoint URL. */
export function mcpEndpoint(raw: string | undefined): { endpoint: string; configured: boolean } {
  const base = (raw ?? "").trim().replace(/\/+$/, "");
  if (!base) return { endpoint: `${MCP_PLACEHOLDER_HOST}/mcp`, configured: false };
  const withScheme = /^https?:\/\//i.test(base) ? base : `https://${base}`;
  const endpoint = /\/mcp$/i.test(withScheme) ? withScheme : `${withScheme}/mcp`;
  return { endpoint, configured: true };
}

export function buildConnectCommand(raw?: string): ConnectInfo {
  const { endpoint, configured } = mcpEndpoint(raw);
  return {
    endpoint,
    configured,
    command: `claude mcp add --transport http maxtest ${endpoint} --header "Authorization: Bearer <your-token>"`,
  };
}
```

- [ ] **Step 10: Run to verify it passes**

Run: `npm test`
Expected: PASS, 12 tests total.

- [ ] **Step 11: Create `.env.example`, then commit**

`.env.example`:

```
# Public marketing site URL (used for metadata and sitemap)
NEXT_PUBLIC_SITE_URL=https://maxtest.id
# Dashboard app URL; "Start free" and "Sign in" link here
NEXT_PUBLIC_APP_URL=https://app.maxtest.id
# Public API host that serves the MCP endpoint (/mcp is appended). Shown in the connect command.
NEXT_PUBLIC_MCP_URL=https://api.maxtest.id
```

```bash
git add package.json tsconfig.json .env.example lib/links.ts lib/links.test.ts lib/mcp-command.ts lib/mcp-command.test.ts
git commit -m "feat: add link and MCP command helpers with node:test harness"
```

---

### Task 2: Character assets, helpers and the `Character` component

**Files:**
- Create: `scripts/build-characters.mjs`, `public/characters/*.png` (22 files), `lib/character-manifest.json`, `lib/characters.ts`, `lib/characters.test.ts`, `components/ui/Character.tsx`

**Interfaces:**
- Consumes: art in `docs/superpowers/assets/landing-redesign/characters/`.
- Produces: types `Pose = "main" | "idle" | "smile"`, `Role = "writer" | "runner" | "detective" | "scribe" | "reporter" | "guard" | "pass" | "fail"`, `Variant = "exhaust" | "noexhaust"`, `CharacterRef = { kind: "max"; pose: Pose } | { kind: "cast"; role: Role }`; functions `characterFile(ref, variant)`, `characterSrc(ref, variant)`, `characterAlt(ref)`, `allCharacterFiles()`; constants `POSES`, `ROLES`, `ROLE_LABEL`; component `<Character of variant height decorative priority className />` (default export of `components/ui/Character.tsx`).

- [ ] **Step 1: Write the failing tests**

Create `lib/characters.test.ts`:

```ts
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
```

- [ ] **Step 2: Run to verify it fails**

Run: `npm test`
Expected: FAIL, `Cannot find module './characters.ts'`.

- [ ] **Step 3: Implement `lib/characters.ts`**

```ts
export const POSES = ["main", "idle", "smile"] as const;
export const ROLES = ["writer", "runner", "detective", "scribe", "reporter", "guard", "pass", "fail"] as const;

export type Pose = (typeof POSES)[number];
export type Role = (typeof ROLES)[number];
export type Variant = "exhaust" | "noexhaust";
export type CharacterRef = { kind: "max"; pose: Pose } | { kind: "cast"; role: Role };

export const ROLE_LABEL: Record<Role, string> = {
  writer: "The Writer",
  runner: "The Runner",
  detective: "The Detective",
  scribe: "The Scribe",
  reporter: "The Reporter",
  guard: "The Gatekeeper",
  pass: "A passed test",
  fail: "A failed test",
};

const POSE_MOOD: Record<Pose, string> = {
  main: "the Maxtest rocket mascot",
  idle: "the Maxtest rocket mascot",
  smile: "the Maxtest rocket mascot, smiling",
};

export function characterFile(ref: CharacterRef, variant: Variant): string {
  const stem = ref.kind === "max" ? `max-${ref.pose}` : `cast-${ref.role}`;
  return `${stem}${variant === "noexhaust" ? "-noexhaust" : ""}.png`;
}

export function characterSrc(ref: CharacterRef, variant: Variant): string {
  return `/characters/${characterFile(ref, variant)}`;
}

export function characterAlt(ref: CharacterRef): string {
  return ref.kind === "max" ? `Max, ${POSE_MOOD[ref.pose]}` : `${ROLE_LABEL[ref.role]}, a rocket character`;
}

export function allCharacterFiles(): string[] {
  const refs: CharacterRef[] = [
    ...POSES.map((pose) => ({ kind: "max", pose }) as const),
    ...ROLES.map((role) => ({ kind: "cast", role }) as const),
  ];
  return refs.flatMap((ref) => (["exhaust", "noexhaust"] as const).map((v) => characterFile(ref, v)));
}
```

- [ ] **Step 4: Write `scripts/build-characters.mjs`**

```js
// Optimises the recolored art into public/characters and writes lib/character-manifest.json.
// Usage: node scripts/build-characters.mjs
// Uses the `sharp` that Next.js already installs; re-run after the owner supplies final art
// (regenerate the recolors first with docs/superpowers/assets/landing-redesign/tools/recolor-rocket.js).
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";

const SRC = "docs/superpowers/assets/landing-redesign/characters";
const OUT = "public/characters";
const VARIANTS = ["", "-noexhaust"];

const JOBS = [
  ...["main", "idle", "smile"].flatMap((pose) =>
    VARIANTS.map((v) => ({ from: `lime-${pose}${v}.png`, to: `max-${pose}${v}.png`, height: pose === "main" ? 480 : 300 })),
  ),
  ...["writer", "runner", "detective", "scribe", "reporter", "guard", "pass", "fail"].flatMap((role) =>
    VARIANTS.map((v) => ({ from: `cast-${role}${v}.png`, to: `cast-${role}${v}.png`, height: 220 })),
  ),
];

await mkdir(OUT, { recursive: true });
const manifest = {};
for (const job of JOBS) {
  const { data, info } = await sharp(path.join(SRC, job.from))
    .resize({ height: job.height, withoutEnlargement: true })
    .png({ palette: true, quality: 90, effort: 10, colours: 128 })
    .toBuffer({ resolveWithObject: true });
  await writeFile(path.join(OUT, job.to), data);
  manifest[job.to] = { width: info.width, height: info.height };
  console.log(job.to.padEnd(32), `${info.width}x${info.height}`.padEnd(10), `${(data.length / 1024).toFixed(1)} KB`);
}
await writeFile("lib/character-manifest.json", `${JSON.stringify(manifest, null, 2)}\n`);
```

- [ ] **Step 5: Generate the assets and verify the tests pass**

```bash
node scripts/build-characters.mjs
npm test
```

Expected: 22 lines printed, every size under budget (`max-main.png` about 40 KB); `npm test` PASS. If `max-main.png` is over 50 KB, lower its `height` in the script to 440 and re-run.

- [ ] **Step 6: Create `components/ui/Character.tsx`**

```tsx
import Image from "next/image";
import manifest from "@/lib/character-manifest.json";
import { characterAlt, characterFile, characterSrc, type CharacterRef, type Variant } from "@/lib/characters";
import { cn } from "@/lib/utils";

type Props = {
  of: CharacterRef;
  /** `exhaust` for large placements, `noexhaust` for small ones. */
  variant?: Variant;
  /** Display height in CSS pixels; width follows the sprite's aspect ratio. */
  height: number;
  /** Decorative repeats get empty alt text. */
  decorative?: boolean;
  priority?: boolean;
  className?: string;
};

export default function Character({ of, variant = "noexhaust", height, decorative = false, priority = false, className }: Props) {
  const dims = (manifest as Record<string, { width: number; height: number }>)[characterFile(of, variant)];
  const width = Math.round((dims.width / dims.height) * height);
  return (
    <Image
      src={characterSrc(of, variant)}
      alt={decorative ? "" : characterAlt(of)}
      width={width}
      height={height}
      priority={priority}
      draggable={false}
      className={cn("select-none", className)}
    />
  );
}
```

- [ ] **Step 7: Type-check and commit**

Run: `npx tsc --noEmit`
Expected: no errors.

```bash
git add scripts/build-characters.mjs public/characters lib/characters.ts lib/characters.test.ts lib/character-manifest.json components/ui/Character.tsx
git commit -m "feat: add Max character assets, helpers and Character component"
```

---

### Task 3: Tokens and fonts

**Files:**
- Modify: `app/globals.css`, `app/layout.tsx`

**Interfaces:**
- Produces: Tailwind color utilities `ink`, `panel`, `hairline`, `paper`, `primary` (lime), `primary-dark`; font utilities `font-headline`, `font-body`; CSS classes `.reveal`, `.typed`, `.wobble-once` (motion, only under `prefers-reduced-motion: no-preference`).

- [ ] **Step 1: Replace the color, font and shadow tokens in `app/globals.css`**

Replace the `:root` block and the `@theme inline` block (everything from `@import "tailwindcss";` through the end of `@theme inline { ... }`) with:

```css
@import "tailwindcss";

:root {
  --background: #0e0e10;
  --foreground: #f2f2ee;
  --surface: #17171a;
  --card: #131316;
  --border: #2e2e34;
  --primary: #c6f24a;
  /* Also defined here so arbitrary values like shadow-[3px_3px_0_var(--color-primary-dark)] always resolve */
  --color-primary: #c6f24a;
  --color-primary-dark: #6d8a1f;
  --neon-cyan: #c6f24a;
  --neon-purple: #a855f7;
  --neon-blue: #3b82f6;
}

@theme inline {
  /* Colors: new names */
  --color-ink: #0e0e10;
  --color-panel: #17171a;
  --color-hairline: #2e2e34;
  --color-paper: #f2f2ee;
  --color-primary: #c6f24a;
  --color-primary-dark: #6d8a1f;

  /* Colors: legacy names kept so other pages keep working, now on the new palette */
  --color-background-dark: #0e0e10;
  --color-background-light: #eff2f6;
  --color-surface-dark: #17171a;
  --color-card-dark: #131316;
  --color-border-dark: #2e2e34;
  --color-neon-cyan: #c6f24a;
  --color-neon-purple: #a855f7;
  --color-neon-blue: #3b82f6;

  /* Fonts (CSS variables are set by next/font in layout.tsx) */
  --font-headline: var(--font-bricolage), "Bricolage Grotesque", system-ui, sans-serif;
  --font-body: var(--font-noto-sans), "Noto Sans", system-ui, sans-serif;
  --font-display: var(--font-noto-sans), "Noto Sans", system-ui, sans-serif;
  --font-serif: var(--font-merriweather), "Merriweather", serif;
  --font-mono: ui-monospace, SFMono-Regular, Menlo, Consolas, monospace;

  /* Shadows: legacy "neon" names re-colored to lime for the pages that still use them */
  --shadow-neon: 0 0 10px rgba(198, 242, 74, 0.5), 0 0 20px rgba(198, 242, 74, 0.3);
  --shadow-neon-sm: 0 0 5px rgba(198, 242, 74, 0.4);
  --shadow-neon-hover: 0 0 15px rgba(198, 242, 74, 0.7), 0 0 30px rgba(198, 242, 74, 0.5);
  --shadow-neon-strong: 0 0 30px -5px rgba(198, 242, 74, 0.6);

  /* Animations */
  --animate-pulse-slow: pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite;
  --animate-float: float 6s ease-in-out infinite;
  --animate-fade-in: fadeIn 0.6s ease-out;
}
```

- [ ] **Step 2: Point the body at the new body font and re-color the remaining cyan literals**

In `app/globals.css`:

1. In the `body { ... }` rule change `font-family: var(--font-display);` to `font-family: var(--font-body);`.
2. In `.text-glow` change `rgba(0, 191, 255, 0.3)` to `rgba(198, 242, 74, 0.3)`.
3. In `.neon-glow-cyan` change `#00bfff` to `#c6f24a`.
4. In `.bg-grid` change both `rgba(0, 191, 255, 0.03)` to `rgba(198, 242, 74, 0.03)`.
5. In the scrollbar rules change `#0f1f24` to `#17171a`, `#2e5c6b` to `#2e2e34`, and the hover `#00bfff` to `#c6f24a`.

Verify none are left: `grep -n "191, 255\|00bfff\|2e5c6b" app/globals.css` prints nothing.

- [ ] **Step 3: Append the motion classes to the end of `app/globals.css`**

```css
/* Home-page motion. Only applied when the visitor has not asked for reduced motion;
   without it the final state is simply the default state. */
@media (prefers-reduced-motion: no-preference) {
  .reveal {
    animation: reveal 0.45s ease-out both;
    animation-delay: var(--d, 0s);
  }

  .typed {
    display: inline-block;
    overflow: hidden;
    white-space: nowrap;
    vertical-align: bottom;
    width: 0;
    animation: typing 1.2s steps(var(--steps, 24), end) var(--d, 0s) forwards;
  }

  .wobble-once {
    transform-origin: 50% 90%;
    animation: wobble 0.6s ease-in-out var(--d, 2.4s) 1;
  }
}

@keyframes reveal {
  from {
    opacity: 0;
    transform: translateY(6px);
  }

  to {
    opacity: 1;
    transform: none;
  }
}

@keyframes typing {
  to {
    width: var(--w, 100%);
  }
}

@keyframes wobble {
  0%,
  100% {
    transform: rotate(0);
  }

  25% {
    transform: rotate(-8deg);
  }

  75% {
    transform: rotate(8deg);
  }
}
```

- [ ] **Step 4: Switch `app/layout.tsx` to `next/font`**

1. Add at the top, with the other imports:

```tsx
import { Bricolage_Grotesque, Merriweather, Noto_Sans } from "next/font/google";

const bricolage = Bricolage_Grotesque({ subsets: ["latin"], weight: ["800"], variable: "--font-bricolage", display: "swap" });
const notoSans = Noto_Sans({ subsets: ["latin"], weight: ["400", "500", "700"], variable: "--font-noto-sans", display: "swap" });
const merriweather = Merriweather({
  subsets: ["latin"],
  weight: ["300", "400", "700", "900"],
  style: ["normal", "italic"],
  variable: "--font-merriweather",
  display: "swap",
});
```

2. Change `<html lang="en" className="dark">` to:

```tsx
<html lang="en" className={`dark ${bricolage.variable} ${notoSans.variable} ${merriweather.variable}`}>
```

3. Delete the three Google Fonts elements inside `<head>` (the two `preconnect` links and the `stylesheet` link and their `{/* Google Fonts */}` comment). Keep the two `application/ld+json` scripts.

- [ ] **Step 5: Verify**

```bash
npm run lint && npm run build
```

Expected: both succeed. Then:

```bash
npm run start -- -p 3100 &
sleep 4
curl -s localhost:3100/ | grep -c "fonts.googleapis.com"
curl -s -o /dev/null -w "%{http_code}\n" localhost:3100/pricing
pkill -f "next start" || true
```

Expected: `0` Google Fonts references, `200` for `/pricing`.

- [ ] **Step 6: Commit**

```bash
git add app/globals.css app/layout.tsx
git commit -m "feat: add ink/lime tokens, next/font and home motion classes"
```

---

### Task 4: UI primitives (Button, Bubble, Tag) and legacy CTAButton

**Files:**
- Create: `components/ui/Button.tsx`, `components/ui/Bubble.tsx`, `components/ui/Tag.tsx`
- Modify: `components/CTAButton.tsx`

**Interfaces:**
- Produces: `<Button href variant? external? className?>` (`variant` is `"primary" | "ghost"`; `external` renders a plain `<a>` without `target`), `<Bubble className?>`, `<Tag>`.

- [ ] **Step 1: Create `components/ui/Button.tsx`**

```tsx
import Link from "next/link";
import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

type Props = {
  href: string;
  children: ReactNode;
  variant?: "primary" | "ghost";
  /** Render a plain <a> (other origin or full navigation) instead of next/link. */
  external?: boolean;
  className?: string;
};

const base =
  "inline-flex h-11 items-center justify-center gap-2 rounded-lg border-2 border-paper px-5 text-sm font-bold transition-transform duration-100 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary";

const variants = {
  primary:
    "bg-primary text-ink shadow-[3px_3px_0_var(--color-primary-dark)] hover:translate-x-px hover:translate-y-px hover:shadow-[2px_2px_0_var(--color-primary-dark)] active:translate-x-[3px] active:translate-y-[3px] active:shadow-none",
  ghost: "bg-transparent text-paper hover:bg-paper/10",
};

export default function Button({ href, children, variant = "primary", external = false, className }: Props) {
  const classes = cn(base, variants[variant], className);
  if (external) {
    return (
      <a href={href} className={classes}>
        {children}
      </a>
    );
  }
  return (
    <Link href={href} className={classes}>
      {children}
    </Link>
  );
}
```

- [ ] **Step 2: Create `components/ui/Bubble.tsx`**

```tsx
import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

export default function Bubble({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <div
      className={cn(
        "rounded-xl border-2 border-paper bg-panel p-3 font-mono text-[13px] leading-relaxed text-paper/90 shadow-[3px_3px_0_var(--color-primary)]",
        className,
      )}
    >
      {children}
    </div>
  );
}
```

- [ ] **Step 3: Create `components/ui/Tag.tsx`**

```tsx
import type { ReactNode } from "react";

export default function Tag({ children }: { children: ReactNode }) {
  return (
    <span className="inline-block rounded-sm bg-primary px-2 py-0.5 text-[10px] font-bold uppercase tracking-[0.12em] text-ink">
      {children}
    </span>
  );
}
```

- [ ] **Step 4: Bring the legacy `CTAButton` onto the new palette (used by other pages)**

In `components/CTAButton.tsx` replace the `primary` entry of `variantClasses` with:

```tsx
    primary:
      "bg-primary text-background-dark hover:bg-[#d8ff6a] shadow-[3px_3px_0_var(--color-primary-dark)] hover:shadow-[2px_2px_0_var(--color-primary-dark)]",
```

- [ ] **Step 5: Verify and commit**

```bash
npx tsc --noEmit && npm run lint
git add components/ui components/CTAButton.tsx
git commit -m "feat: add Button, Bubble and Tag primitives; restyle legacy CTAButton"
```

Expected: no type errors; lint has no new errors (existing `<img>` warnings are fine).

---

### Task 5: Home content module with copy rules

**Files:**
- Create: `lib/home-content.ts`, `lib/home-content.test.ts`

**Interfaces:**
- Consumes: `Role` from `lib/characters.ts` (type-only).
- Produces: `HERO` (`headline: [string, string]`, `sub`, `prompt`, `toolCalls: string[]`, `reply`, `results: ResultStatus[]`), `CONNECT` copy, `CAST: CastMember[]` (`role`, `name`, `job`, `tools`, `prompt`, `response`), `DEFAULT_CAST_ROLE`, `CONTROL_FACTS`, `DASHBOARD_ITEMS`, `PRICING_TEASER`, `FINAL_CTA`, `TOOL_COUNT_LABEL`, `BANNED_PHRASES`, `allHomeCopy(): string[]`, `summarizeResults(r): string`, type `ResultStatus = "pass" | "fail"`.

- [ ] **Step 1: Write the failing tests**

Create `lib/home-content.test.ts`:

```ts
import test from "node:test";
import assert from "node:assert/strict";
import {
  allHomeCopy,
  BANNED_PHRASES,
  CAST,
  DEFAULT_CAST_ROLE,
  HERO,
  summarizeResults,
  TOOL_COUNT_LABEL,
} from "./home-content.ts";

test("no copy contains an unverifiable claim", () => {
  for (const text of allHomeCopy()) {
    for (const phrase of BANNED_PHRASES) {
      assert.ok(!text.toLowerCase().includes(phrase), `"${phrase}" found in: ${text}`);
    }
  }
});

test("every tool name looks like a real maxtest_ tool", () => {
  const names = [...CAST.flatMap((c) => c.tools), ...HERO.toolCalls];
  assert.ok(names.length > 0);
  for (const name of names) assert.match(name, /^maxtest_[a-z_]+$/, name);
});

test("each cast member has a job, at least two tools, a prompt and a response", () => {
  assert.equal(CAST.length, 5);
  for (const c of CAST) {
    assert.ok(c.job.length > 10 && c.prompt.length > 3 && c.response.length >= 2, c.role);
    assert.ok(c.tools.length >= 2, c.role);
  }
  assert.equal(new Set(CAST.map((c) => c.role)).size, CAST.length);
});

test("the default selected cast member exists", () => {
  assert.ok(CAST.some((c) => c.role === DEFAULT_CAST_ROLE));
});

test("tool count is a conservative round label", () => {
  assert.equal(TOOL_COUNT_LABEL, "40+");
});

test("summarizeResults counts passes and failures", () => {
  assert.equal(summarizeResults(HERO.results), "5 passed, 3 failed");
  assert.equal(summarizeResults(["pass", "pass"]), "2 passed, 0 failed");
  assert.equal(summarizeResults(["fail"]), "0 passed, 1 failed");
  assert.equal(summarizeResults([]), "0 passed, 0 failed");
});

test("the hero bubble's failure count matches the result row", () => {
  const failed = HERO.results.filter((r) => r === "fail").length;
  assert.match(HERO.reply, new RegExp(`${failed} failures`));
});
```

- [ ] **Step 2: Run to verify it fails**

Run: `npm test`
Expected: FAIL, `Cannot find module './home-content.ts'`.

- [ ] **Step 3: Implement `lib/home-content.ts`**

```ts
import type { Role } from "./characters.ts";

export type ResultStatus = "pass" | "fail";

/** About 40 tools. Verify against the backend registry (app/mcp/registry.py in akewops-be); keep "40+" only while true. */
export const TOOL_COUNT_LABEL = "40+";

/** Claims removed from the old page because the product code does not back them. */
export const BANNED_PHRASES = [
  "zero flake",
  "zero manual setup",
  "self-heal",
  "enterprise-grade",
  "advanced rag",
  "no credit card",
] as const;

export const HERO = {
  headline: ["Ask your agent.", "Max does the testing."] as [string, string],
  sub: "Maxtest is the test platform your AI agent can operate. Write cases, run suites and triage failures from Claude, Cursor or any MCP client.",
  prompt: "run the checkout suite",
  toolCalls: ["maxtest_run_suite", "maxtest_search_execution_history"],
  reply: "Found 3 failures. Filing Jira.",
  results: ["pass", "pass", "pass", "pass", "fail", "pass", "fail", "fail"] as ResultStatus[],
};

export function summarizeResults(results: readonly ResultStatus[]): string {
  const failed = results.filter((r) => r === "fail").length;
  return `${results.length - failed} passed, ${failed} failed`;
}

export const CONNECT = {
  tag: "Connect in a minute",
  title: "Plug Max into your agent.",
  body: `One command adds Maxtest's ${TOOL_COUNT_LABEL} tools to Claude Code. Tokens are personal access tokens you create in the dashboard.`,
  oauth: "Clients that support OAuth can connect with just the URL and a consent screen. No token to paste.",
};

export interface CastMember {
  role: Extract<Role, "writer" | "runner" | "detective" | "scribe" | "reporter">;
  name: string;
  job: string;
  tools: string[];
  prompt: string;
  response: string[];
}

export const DEFAULT_CAST_ROLE: CastMember["role"] = "runner";

export const CAST: CastMember[] = [
  {
    role: "writer",
    name: "The Writer",
    job: "Turns a Jira ticket into test cases and stages them for your review.",
    tools: ["maxtest_get_jira_issue", "maxtest_propose_test_cases", "maxtest_search_test_cases"],
    prompt: "write test cases for the checkout ticket",
    response: ["maxtest_get_jira_issue ✓", "maxtest_propose_test_cases ✓", "Drafts staged. Waiting for your approval."],
  },
  {
    role: "runner",
    name: "The Runner",
    job: "Runs a suite on the Pancake Runner and follows the executions.",
    tools: ["maxtest_find_suite", "maxtest_run_suite", "maxtest_run_execution"],
    prompt: "run the checkout suite",
    response: ["maxtest_find_suite ✓", "maxtest_run_suite ✓", "Run started. Polling executions."],
  },
  {
    role: "detective",
    name: "The Detective",
    job: "Searches past executions by meaning to find out why something failed.",
    tools: ["maxtest_search_execution_history", "maxtest_get_test_execution", "maxtest_search_executions"],
    prompt: "why did checkout fail last night?",
    response: ["maxtest_search_execution_history ✓", "maxtest_get_test_execution ✓", "Here are the failing attempts, with stage and error."],
  },
  {
    role: "scribe",
    name: "The Scribe",
    job: "Records results in bulk and attaches screenshots and logs as evidence.",
    tools: ["maxtest_update_execution_statuses", "maxtest_attach_to_execution", "maxtest_create_attachment_upload"],
    prompt: "mark the flaky ones skipped and attach the logs",
    response: ["maxtest_create_attachment_upload ✓", "maxtest_update_execution_statuses ✓", "Results and evidence recorded."],
  },
  {
    role: "reporter",
    name: "The Reporter",
    job: "Generates the report for a finished launch and finds earlier ones.",
    tools: ["maxtest_generate_report", "maxtest_get_report", "maxtest_list_reports"],
    prompt: "report on the last launch",
    response: ["maxtest_generate_report ✓", "maxtest_get_report ✓", "Report ready."],
  },
];

export const CONTROL = {
  tag: "You stay in control",
  title: "The Gatekeeper checks everything.",
  facts: [
    {
      title: "Drafts need your approval",
      body: "AI-written test cases are staged in a review queue. Nothing becomes a real test case until a person approves it.",
    },
    {
      title: "Risky tools start switched off",
      body: "Only read tools are on by default. Write, run and external tools stay off until a company admin enables them.",
    },
    {
      title: "Every call is audited",
      body: "Calls are logged, limited to read, write, execute or external scopes, and checked against your project permissions.",
    },
  ],
};

export const DASHBOARD = {
  tag: "Also in the dashboard",
  title: "Everything your agent touches, visible to your team.",
  items: [
    "AI test generation from your documents",
    "Visual workflows",
    "Test plans and launches",
    "QA metrics",
    "Jira and Slack integrations",
  ],
};

export const PRICING_TEASER = {
  line: "Free to start. Pay for what you run.",
  cta: "See pricing",
};

export const FINAL_CTA = {
  title: "Put Max to work.",
};

/** Every visitor-facing string, for the copy-rule test. */
export function allHomeCopy(): string[] {
  return [
    ...HERO.headline,
    HERO.sub,
    HERO.prompt,
    HERO.reply,
    CONNECT.tag,
    CONNECT.title,
    CONNECT.body,
    CONNECT.oauth,
    ...CAST.flatMap((c) => [c.name, c.job, c.prompt, ...c.response]),
    CONTROL.tag,
    CONTROL.title,
    ...CONTROL.facts.flatMap((f) => [f.title, f.body]),
    DASHBOARD.tag,
    DASHBOARD.title,
    ...DASHBOARD.items,
    PRICING_TEASER.line,
    PRICING_TEASER.cta,
    FINAL_CTA.title,
  ];
}
```

- [ ] **Step 4: Run to verify it passes**

Run: `npm test`
Expected: PASS, all tests across `lib/`.

- [ ] **Step 5: Cross-check the tool names against the backend (manual, one command)**

```bash
cd /home/hadi/personal/akewops-be/app/mcp/tools
for t in maxtest_get_jira_issue maxtest_propose_test_cases maxtest_search_test_cases maxtest_find_suite maxtest_run_suite maxtest_run_execution maxtest_search_execution_history maxtest_get_test_execution maxtest_search_executions maxtest_update_execution_statuses maxtest_attach_to_execution maxtest_create_attachment_upload maxtest_generate_report maxtest_get_report maxtest_list_reports; do
  grep -q "name=\"$t\"" *.py && echo "ok   $t" || echo "MISSING $t"
done
grep -hoE 'name="maxtest_[a-z_]+"' *.py | sort -u | wc -l
cd /home/hadi/personal/maxtest
```

Expected: every line `ok`, no `MISSING`, and the count at least 40. If a tool is missing, fix the name in `lib/home-content.ts`.

- [ ] **Step 6: Commit**

```bash
git add lib/home-content.ts lib/home-content.test.ts
git commit -m "feat: add home content module with copy-rule tests"
```

---

### Task 6: Hero section

**Files:**
- Create: `components/home/ResultRow.tsx`, `components/home/Hero.tsx`
- Modify: `components/VideoPlayer.tsx`

**Interfaces:**
- Consumes: `Character`, `Bubble`, `Button`, `HERO`, `summarizeResults`, `VideoPlayer`.
- Produces: `<ResultRow statuses />`, `<Hero signupHref />`.

- [ ] **Step 1: Create `components/home/ResultRow.tsx`**

```tsx
import Character from "@/components/ui/Character";
import { summarizeResults, type ResultStatus } from "@/lib/home-content";

export default function ResultRow({ statuses }: { statuses: readonly ResultStatus[] }) {
  return (
    <div role="img" aria-label={summarizeResults(statuses)} className="flex items-end gap-1">
      {statuses.map((status, i) => (
        <span
          key={i}
          className={status === "fail" ? "wobble-once" : undefined}
          style={status === "fail" ? ({ "--d": `${2.6 + i * 0.05}s` } as React.CSSProperties) : undefined}
        >
          <Character of={{ kind: "cast", role: status }} variant="noexhaust" height={38} decorative />
        </span>
      ))}
    </div>
  );
}
```

- [ ] **Step 2: Create `components/home/Hero.tsx`**

```tsx
import Bubble from "@/components/ui/Bubble";
import Button from "@/components/ui/Button";
import Character from "@/components/ui/Character";
import ResultRow from "@/components/home/ResultRow";
import VideoPlayer from "@/components/VideoPlayer";
import { HERO } from "@/lib/home-content";

type CSSVars = React.CSSProperties & Record<`--${string}`, string>;

export default function Hero({ signupHref }: { signupHref: string }) {
  const typedWidth = `${HERO.prompt.length + 1}ch`;
  return (
    <section className="mx-auto max-w-6xl px-4 pb-16 pt-12 sm:px-6 md:pt-20">
      <div className="grid items-end gap-10 lg:grid-cols-12">
        <div className="lg:col-span-6">
          <h1 className="font-headline text-4xl font-extrabold leading-[1.02] tracking-tight text-paper sm:text-6xl">
            {HERO.headline[0]}
            <br />
            {HERO.headline[1]}
          </h1>
          <p className="mt-5 max-w-xl text-lg leading-relaxed text-paper/70">{HERO.sub}</p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Button href={signupHref} external={signupHref.startsWith("http")}>
              Start free
            </Button>
            <Button href="/documentation" variant="ghost">
              Read the MCP docs
            </Button>
          </div>
        </div>

        <div className="flex min-w-0 items-end gap-4 lg:col-span-6">
          <Character of={{ kind: "max", pose: "main" }} variant="exhaust" height={220} priority className="shrink-0" />
          <div className="min-w-0 flex-1 space-y-3">
            <Bubble>
              <p>
                <span className="text-paper/50">you ›</span>{" "}
                <span
                  className="typed"
                  style={{ "--w": typedWidth, "--steps": String(HERO.prompt.length), "--d": "0.2s" } as CSSVars}
                >
                  {HERO.prompt}
                </span>
              </p>
              {HERO.toolCalls.map((tool, i) => (
                <p key={tool} className="reveal break-all" style={{ "--d": `${1.5 + i * 0.5}s` } as CSSVars}>
                  <span className="text-primary">{tool}</span> ✓
                </p>
              ))}
              <p className="reveal" style={{ "--d": "2.6s" } as CSSVars}>
                {HERO.reply}
              </p>
            </Bubble>
            <div className="reveal" style={{ "--d": "2.9s" } as CSSVars}>
              <ResultRow statuses={HERO.results} />
            </div>
          </div>
        </div>
      </div>

      <div className="mt-14 overflow-hidden rounded-xl border-2 border-paper/80 bg-panel shadow-[4px_4px_0_var(--color-primary)]">
        <div className="border-b border-hairline px-4 py-2 font-mono text-xs text-paper/60">demo · launch result</div>
        <VideoPlayer className="rounded-none border-0 shadow-none" />
      </div>
    </section>
  );
}
```

- [ ] **Step 3: Restyle the play button in `components/VideoPlayer.tsx`**

Replace the inner `<div className="w-20 h-20 rounded-full bg-primary/90 ...">` and its `<svg>` with:

```tsx
            <div className="w-20 h-20 rounded-full border-2 border-paper bg-primary flex items-center justify-center shadow-[3px_3px_0_var(--color-primary-dark)] transition-transform group-hover:scale-105">
              <svg className="w-10 h-10 text-ink ml-1" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path d="M8 5v14l11-7z" />
              </svg>
            </div>
```

Also change the thumbnail `alt="Video Thumbnail"` to `alt="Maxtest demo video thumbnail"` and add `loading="lazy"` to that `<img>`.

- [ ] **Step 4: Type-check, lint and commit**

```bash
npx tsc --noEmit && npm run lint
git add components/home/ResultRow.tsx components/home/Hero.tsx components/VideoPlayer.tsx
git commit -m "feat: add hero section with agent prompt, result row and demo frame"
```

Expected: no type errors; no new lint errors.

---

### Task 7: Connect block with safe clipboard

**Files:**
- Create: `lib/clipboard.ts`, `lib/clipboard.test.ts`, `components/home/ConnectBlock.tsx`

**Interfaces:**
- Consumes: `CONNECT`, `Tag`, `Bubble`.
- Produces: `copyText(text, clip?): Promise<"copied" | "failed">`; `<ConnectBlock command endpoint />`.

- [ ] **Step 1: Write the failing tests**

Create `lib/clipboard.test.ts`:

```ts
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
```

- [ ] **Step 2: Run to verify it fails**

Run: `npm test`
Expected: FAIL, `Cannot find module './clipboard.ts'`.

- [ ] **Step 3: Implement `lib/clipboard.ts`**

```ts
export type CopyResult = "copied" | "failed";

type ClipboardLike = { writeText: (text: string) => Promise<void> };

/** Copies text; never throws. Browsers without the API, or that deny permission, get "failed". */
export async function copyText(
  text: string,
  clip: ClipboardLike | undefined = typeof navigator !== "undefined" ? navigator.clipboard : undefined,
): Promise<CopyResult> {
  if (!clip) return "failed";
  try {
    await clip.writeText(text);
    return "copied";
  } catch {
    return "failed";
  }
}
```

- [ ] **Step 4: Run to verify it passes**

Run: `npm test`
Expected: PASS.

- [ ] **Step 5: Create `components/home/ConnectBlock.tsx`**

```tsx
"use client";

import { useEffect, useRef, useState } from "react";
import Tag from "@/components/ui/Tag";
import { copyText, type CopyResult } from "@/lib/clipboard";
import { CONNECT } from "@/lib/home-content";

type Props = { command: string; endpoint: string };

export default function ConnectBlock({ command, endpoint }: Props) {
  const [status, setStatus] = useState<CopyResult | "idle">("idle");
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const codeRef = useRef<HTMLElement>(null);

  useEffect(() => () => void (timer.current && clearTimeout(timer.current)), []);

  async function onCopy() {
    const result = await copyText(command);
    if (result === "failed") {
      // Fall back to a visible selection so Ctrl+C still works.
      const node = codeRef.current;
      if (node) {
        const range = document.createRange();
        range.selectNodeContents(node);
        const selection = window.getSelection();
        selection?.removeAllRanges();
        selection?.addRange(range);
      }
    }
    setStatus(result);
    if (timer.current) clearTimeout(timer.current);
    timer.current = setTimeout(() => setStatus("idle"), 2500);
  }

  return (
    <section className="mx-auto max-w-6xl border-t border-hairline px-4 py-14 sm:px-6">
      <div className="grid gap-8 lg:grid-cols-12">
        <div className="lg:col-span-5">
          <Tag>{CONNECT.tag}</Tag>
          <h2 className="mt-3 font-headline text-3xl font-extrabold tracking-tight text-paper">{CONNECT.title}</h2>
          <p className="mt-3 text-paper/70">{CONNECT.body}</p>
          <p className="mt-3 text-sm text-paper/55">
            {CONNECT.oauth} <span className="font-mono text-paper/70">{endpoint}</span>
          </p>
        </div>

        <div className="min-w-0 lg:col-span-7">
          <div className="rounded-xl border-2 border-paper bg-panel p-4 shadow-[3px_3px_0_var(--color-primary)]">
            <pre className="overflow-x-auto pb-1 font-mono text-[13px] leading-relaxed text-paper/90">
              <code ref={codeRef} className="select-all whitespace-pre">
                {command}
              </code>
            </pre>
            <div className="mt-3 flex items-center justify-between gap-3">
              <button
                type="button"
                onClick={onCopy}
                className="h-9 rounded-lg border-2 border-paper bg-primary px-4 text-sm font-bold text-ink shadow-[2px_2px_0_var(--color-primary-dark)] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary"
              >
                {status === "copied" ? "Copied" : "Copy command"}
              </button>
              <span role="status" aria-live="polite" className="text-sm text-paper/60">
                {status === "copied" && "Copied to your clipboard."}
                {status === "failed" && "Couldn't copy. The command is selected, press Ctrl+C."}
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
```

- [ ] **Step 6: Type-check, lint and commit**

```bash
npx tsc --noEmit && npm run lint
git add lib/clipboard.ts lib/clipboard.test.ts components/home/ConnectBlock.tsx
git commit -m "feat: add connect block with failure-safe copy button"
```

---

### Task 8: Cast section with accessible tabs

**Files:**
- Create: `lib/tabs.ts`, `lib/tabs.test.ts`, `components/home/CastSection.tsx`

**Interfaces:**
- Consumes: `CAST`, `DEFAULT_CAST_ROLE`, `Character`, `Bubble`, `Tag`.
- Produces: `nextTabIndex(current, key, count): number | null`; `<CastSection />`.

- [ ] **Step 1: Write the failing tests**

Create `lib/tabs.test.ts`:

```ts
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
```

- [ ] **Step 2: Run to verify it fails**

Run: `npm test`
Expected: FAIL, `Cannot find module './tabs.ts'`.

- [ ] **Step 3: Implement `lib/tabs.ts`**

```ts
/** Index to focus for a roving-tabindex tablist, or null when the key is not a navigation key. */
export function nextTabIndex(current: number, key: string, count: number): number | null {
  if (count <= 0) return null;
  switch (key) {
    case "ArrowRight":
    case "ArrowDown":
      return (current + 1) % count;
    case "ArrowLeft":
    case "ArrowUp":
      return (current - 1 + count) % count;
    case "Home":
      return 0;
    case "End":
      return count - 1;
    default:
      return null;
  }
}
```

- [ ] **Step 4: Run to verify it passes**

Run: `npm test`
Expected: PASS.

- [ ] **Step 5: Create `components/home/CastSection.tsx`**

```tsx
"use client";

import { useRef, useState } from "react";
import Bubble from "@/components/ui/Bubble";
import Character from "@/components/ui/Character";
import Tag from "@/components/ui/Tag";
import { CAST, DEFAULT_CAST_ROLE } from "@/lib/home-content";
import { nextTabIndex } from "@/lib/tabs";
import { cn } from "@/lib/utils";

export default function CastSection() {
  const [index, setIndex] = useState(Math.max(0, CAST.findIndex((c) => c.role === DEFAULT_CAST_ROLE)));
  const tabs = useRef<(HTMLButtonElement | null)[]>([]);
  const active = CAST[index];

  function onKeyDown(event: React.KeyboardEvent, current: number) {
    const next = nextTabIndex(current, event.key, CAST.length);
    if (next === null) return;
    event.preventDefault();
    setIndex(next);
    tabs.current[next]?.focus();
  }

  return (
    <section className="mx-auto max-w-6xl border-t border-hairline px-4 py-14 sm:px-6">
      <Tag>Meet the cast</Tag>
      <h2 className="mt-3 font-headline text-3xl font-extrabold tracking-tight text-paper">
        Five jobs, about 40 real tools.
      </h2>

      <div role="tablist" aria-label="What your agent can do" className="mt-8 flex gap-3 overflow-x-auto pb-2">
        {CAST.map((member, i) => (
          <button
            key={member.role}
            ref={(el) => {
              tabs.current[i] = el;
            }}
            id={`cast-tab-${member.role}`}
            role="tab"
            type="button"
            aria-selected={i === index}
            aria-controls="cast-panel"
            tabIndex={i === index ? 0 : -1}
            onClick={() => setIndex(i)}
            onKeyDown={(e) => onKeyDown(e, i)}
            className={cn(
              "flex w-28 shrink-0 flex-col items-center gap-1 rounded-xl border-2 p-2 text-sm font-bold focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary",
              i === index ? "border-primary bg-panel text-paper" : "border-hairline text-paper/60 hover:border-paper/50",
            )}
          >
            <Character of={{ kind: "cast", role: member.role }} variant="noexhaust" height={64} decorative />
            {member.name}
          </button>
        ))}
      </div>

      <div
        key={active.role}
        id="cast-panel"
        role="tabpanel"
        aria-labelledby={`cast-tab-${active.role}`}
        className="reveal mt-6 grid gap-6 lg:grid-cols-12"
      >
        <div className="lg:col-span-5">
          <p className="text-lg text-paper/80">{active.job}</p>
          <ul className="mt-4 space-y-1 font-mono text-[13px] text-paper/70">
            {active.tools.map((tool) => (
              <li key={tool} className="break-all">
                <span className="text-primary">{tool}</span>
              </li>
            ))}
          </ul>
        </div>
        <div className="min-w-0 lg:col-span-7">
          <p className="mb-2 text-xs uppercase tracking-[0.12em] text-paper/45">Example</p>
          <Bubble>
            <p>
              <span className="text-paper/50">you ›</span> {active.prompt}
            </p>
            {active.response.map((line) => (
              <p key={line} className="break-words">
                {line}
              </p>
            ))}
          </Bubble>
        </div>
      </div>
    </section>
  );
}
```

- [ ] **Step 6: Type-check, lint and commit**

```bash
npx tsc --noEmit && npm run lint
git add lib/tabs.ts lib/tabs.test.ts components/home/CastSection.tsx
git commit -m "feat: add cast section with keyboard-accessible tabs"
```

---

### Task 9: Control, dashboard, pricing teaser and final CTA

**Files:**
- Create: `components/home/ControlSection.tsx`, `components/home/DashboardSection.tsx`, `components/home/PricingTeaser.tsx`, `components/home/FinalCta.tsx`

**Interfaces:**
- Consumes: `CONTROL`, `DASHBOARD`, `PRICING_TEASER`, `FINAL_CTA`, `Character`, `Tag`, `Button`.
- Produces: `<ControlSection />`, `<DashboardSection screenshotSrc? />`, `<PricingTeaser />`, `<FinalCta signupHref />`.

- [ ] **Step 1: Create `components/home/ControlSection.tsx`**

```tsx
import Character from "@/components/ui/Character";
import Tag from "@/components/ui/Tag";
import { CONTROL } from "@/lib/home-content";

export default function ControlSection() {
  return (
    <section className="mx-auto max-w-6xl border-t border-hairline px-4 py-14 sm:px-6">
      <div className="grid gap-10 lg:grid-cols-12">
        <div className="flex items-end gap-4 lg:col-span-5">
          <Character of={{ kind: "cast", role: "guard" }} variant="noexhaust" height={110} decorative />
          <div>
            <Tag>{CONTROL.tag}</Tag>
            <h2 className="mt-3 font-headline text-3xl font-extrabold tracking-tight text-paper">{CONTROL.title}</h2>
          </div>
        </div>
        <ul className="grid gap-6 sm:grid-cols-3 lg:col-span-7">
          {CONTROL.facts.map((fact) => (
            <li key={fact.title} className="border-t-2 border-paper pt-3">
              <h3 className="font-bold text-paper">{fact.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-paper/65">{fact.body}</p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
```

- [ ] **Step 2: Create `components/home/DashboardSection.tsx`**

```tsx
import Image from "next/image";
import Tag from "@/components/ui/Tag";
import { DASHBOARD } from "@/lib/home-content";

/** Pass `screenshotSrc` once the owner supplies a screenshot; until then a labeled placeholder shows. */
export default function DashboardSection({ screenshotSrc }: { screenshotSrc?: string }) {
  return (
    <section className="mx-auto max-w-6xl border-t border-hairline px-4 py-14 sm:px-6">
      <div className="grid gap-10 lg:grid-cols-12">
        <div className="lg:col-span-5">
          <Tag>{DASHBOARD.tag}</Tag>
          <h2 className="mt-3 font-headline text-3xl font-extrabold tracking-tight text-paper">{DASHBOARD.title}</h2>
          <ul className="mt-5 space-y-2 text-paper/75">
            {DASHBOARD.items.map((item) => (
              <li key={item} className="flex gap-2">
                <span aria-hidden="true" className="text-primary">
                  ▸
                </span>
                {item}
              </li>
            ))}
          </ul>
        </div>
        <div className="lg:col-span-7">
          <div className="overflow-hidden rounded-xl border-2 border-paper/80 bg-panel">
            {screenshotSrc ? (
              <Image src={screenshotSrc} alt="The Maxtest dashboard" width={1600} height={1000} className="h-auto w-full" />
            ) : (
              <div className="flex aspect-[16/10] items-center justify-center font-mono text-sm text-paper/40">
                Screenshot coming
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
```

- [ ] **Step 3: Create `components/home/PricingTeaser.tsx`**

```tsx
import Link from "next/link";
import { PRICING_TEASER } from "@/lib/home-content";

export default function PricingTeaser() {
  return (
    <section className="mx-auto max-w-6xl border-t border-hairline px-4 py-10 sm:px-6">
      <p className="flex flex-wrap items-baseline gap-x-4 gap-y-1 font-headline text-2xl font-extrabold tracking-tight text-paper">
        {PRICING_TEASER.line}
        <Link
          href="/pricing"
          className="font-body text-base font-bold text-primary underline-offset-4 hover:underline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary"
        >
          {PRICING_TEASER.cta} →
        </Link>
      </p>
    </section>
  );
}
```

- [ ] **Step 4: Create `components/home/FinalCta.tsx`**

```tsx
import Button from "@/components/ui/Button";
import Character from "@/components/ui/Character";
import { FINAL_CTA } from "@/lib/home-content";

export default function FinalCta({ signupHref }: { signupHref: string }) {
  return (
    <section className="mx-auto max-w-6xl border-t border-hairline px-4 py-16 sm:px-6">
      <div className="flex flex-wrap items-end gap-8">
        <Character of={{ kind: "max", pose: "smile" }} variant="exhaust" height={170} decorative />
        <div>
          <h2 className="font-headline text-4xl font-extrabold tracking-tight text-paper">{FINAL_CTA.title}</h2>
          <div className="mt-6 flex flex-wrap gap-3">
            <Button href={signupHref} external={signupHref.startsWith("http")}>
              Start free
            </Button>
            <Button href="/documentation" variant="ghost">
              Read the MCP docs
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
```

- [ ] **Step 5: Type-check, lint and commit**

```bash
npx tsc --noEmit && npm run lint
git add components/home
git commit -m "feat: add control, dashboard, pricing teaser and final CTA sections"
```

---

### Task 10: Navbar, Footer and AnimatedSection

**Files:**
- Modify: `components/Navbar.tsx`, `components/Footer.tsx`, `components/AnimatedSection.tsx`

**Interfaces:**
- Consumes: `signupUrl`, `loginUrl`, `Character`, `Button`.

- [ ] **Step 1: Replace `components/Navbar.tsx`**

```tsx
"use client";

import Link from "next/link";
import { useState } from "react";
import Button from "@/components/ui/Button";
import Character from "@/components/ui/Character";
import { loginUrl, signupUrl } from "@/lib/links";
import { cn } from "@/lib/utils";

const LINKS = [
  { href: "/features", label: "Product" },
  { href: "/documentation", label: "Docs" },
  { href: "/pricing", label: "Pricing" },
  { href: "/blog", label: "Blog" },
] as const;

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const signup = signupUrl();
  const login = loginUrl();
  const isExternal = (url: string) => url.startsWith("http");

  return (
    <nav className="relative z-50 w-full border-b border-hairline bg-ink">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
        <Link href="/" className="flex items-center gap-2 text-paper focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary">
          <Character of={{ kind: "max", pose: "idle" }} variant="noexhaust" height={32} decorative />
          <span className="font-headline text-xl font-extrabold tracking-tight">maxtest</span>
        </Link>

        <div className="hidden items-center gap-7 md:flex">
          {LINKS.map((link) => (
            <Link key={link.href} href={link.href} className="text-sm font-medium text-paper/65 transition-colors hover:text-paper">
              {link.label}
            </Link>
          ))}
          <a href={login} className="text-sm font-bold text-paper hover:text-primary">
            Sign in
          </a>
          <Button href={signup} external={isExternal(signup)} className="h-9">
            Start free
          </Button>
        </div>

        <button
          type="button"
          className="p-2 text-paper md:hidden"
          onClick={() => setOpen(!open)}
          aria-label="Toggle menu"
          aria-expanded={open}
          aria-controls="mobile-menu"
        >
          <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
            {open ? (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            ) : (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            )}
          </svg>
        </button>
      </div>

      <div
        id="mobile-menu"
        inert={!open}
        className={cn(
          "absolute left-0 right-0 top-full overflow-hidden border-b border-hairline bg-ink transition-all duration-200 md:hidden",
          open ? "max-h-96 opacity-100" : "max-h-0 border-b-0 opacity-0",
        )}
      >
        <div className="space-y-1 px-4 py-4">
          {LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setOpen(false)}
              className="block py-2 text-sm font-medium text-paper/70 hover:text-paper"
            >
              {link.label}
            </Link>
          ))}
          <div className="flex gap-3 pt-3">
            <a href={login} className="flex h-11 flex-1 items-center justify-center rounded-lg border-2 border-hairline text-sm font-bold text-paper">
              Sign in
            </a>
            <Button href={signup} external={isExternal(signup)} className="flex-1">
              Start free
            </Button>
          </div>
        </div>
      </div>
    </nav>
  );
}
```

- [ ] **Step 2: Replace `components/Footer.tsx`**

```tsx
import Link from "next/link";
import Character from "@/components/ui/Character";

const linkClass = "text-sm text-paper/60 transition-colors hover:text-primary";

export default function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className="border-t border-hairline bg-ink px-4 py-12 sm:px-6">
      <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-6 text-center md:flex-row md:text-left">
        <div className="flex flex-col gap-2">
          <div className="flex items-center justify-center gap-2 text-paper md:justify-start">
            <Character of={{ kind: "max", pose: "idle" }} variant="noexhaust" height={28} decorative />
            <span className="font-headline text-lg font-extrabold">maxtest</span>
          </div>
          <p className="text-sm text-paper/45">© {year} Maxtest AI Inc. All rights reserved.</p>
        </div>

        <div className="flex flex-wrap justify-center gap-8">
          <Link className={linkClass} href="/privacy">
            Privacy Policy
          </Link>
          <Link className={linkClass} href="/terms">
            Terms
          </Link>
          <a className={linkClass} href="https://linkedin.com/company/maxtestai" target="_blank" rel="noopener noreferrer">
            LinkedIn
          </a>
        </div>
      </div>
    </footer>
  );
}
```

(The footer no longer needs `"use client"` or `useState`: the year is computed on the server at render time.)

- [ ] **Step 3: Calm `components/AnimatedSection.tsx` to a fade that respects reduced motion**

Replace the file with:

```tsx
"use client";

import { motion, useReducedMotion } from "framer-motion";
import { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface AnimatedSectionProps {
  children: ReactNode;
  className?: string;
  delay?: number;
}

export default function AnimatedSection({ children, className, delay = 0 }: AnimatedSectionProps) {
  const reduceMotion = useReducedMotion();
  if (reduceMotion) return <div className={cn(className)}>{children}</div>;
  return (
    <motion.div
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 0.5, delay, ease: [0.22, 1, 0.36, 1] }}
      className={cn(className)}
    >
      {children}
    </motion.div>
  );
}
```

- [ ] **Step 4: Type-check, lint and commit**

```bash
npx tsc --noEmit && npm run lint
git add components/Navbar.tsx components/Footer.tsx components/AnimatedSection.tsx
git commit -m "feat: restyle Navbar and Footer; make AnimatedSection a reduced-motion-safe fade"
```

---

### Task 11: Compose the home page and document env vars

**Files:**
- Modify: `app/page.tsx`, `README.md`

**Interfaces:**
- Consumes: every section component, `signupUrl`, `buildConnectCommand`.

- [ ] **Step 1: Replace `app/page.tsx`**

```tsx
import CastSection from "@/components/home/CastSection";
import ConnectBlock from "@/components/home/ConnectBlock";
import ControlSection from "@/components/home/ControlSection";
import DashboardSection from "@/components/home/DashboardSection";
import FinalCta from "@/components/home/FinalCta";
import Hero from "@/components/home/Hero";
import PricingTeaser from "@/components/home/PricingTeaser";
import { signupUrl } from "@/lib/links";
import { buildConnectCommand } from "@/lib/mcp-command";

export default function Home() {
  const connect = buildConnectCommand(process.env.NEXT_PUBLIC_MCP_URL);
  if (!connect.configured) {
    console.warn("[home] NEXT_PUBLIC_MCP_URL is not set; the connect command shows a placeholder host.");
  }
  const signupHref = signupUrl();

  return (
    <div className="min-h-screen bg-ink">
      <Hero signupHref={signupHref} />
      <ConnectBlock command={connect.command} endpoint={connect.endpoint} />
      <CastSection />
      <ControlSection />
      <DashboardSection />
      <PricingTeaser />
      <FinalCta signupHref={signupHref} />
    </div>
  );
}
```

- [ ] **Step 2: Add environment notes to `README.md`**

Under the existing "Copy environment variables" step, add a short list:

```markdown
Environment variables (see `.env.example`):

- `NEXT_PUBLIC_SITE_URL`: public URL of this marketing site (metadata, sitemap).
- `NEXT_PUBLIC_APP_URL`: dashboard URL; "Start free" and "Sign in" link here. If unset, signup falls back to `/pricing`.
- `NEXT_PUBLIC_MCP_URL`: public API host serving the MCP endpoint (`/mcp` is appended). If unset, the home page shows a `<your-maxtest-host>` placeholder.
```

- [ ] **Step 3: Verify and commit**

```bash
npm test && npm run lint && npm run build
git add app/page.tsx README.md
git commit -m "feat: compose the redesigned home page and document env vars"
```

Expected: tests PASS, build succeeds, `/` is listed as a static route.

---

### Task 12: End-to-end verification

**Files:** none (fixes found here go in the file that owns the problem, with a commit per fix).

Run each command block in a single shell call: the servers are started in the background and stopped with `pkill` at the end of the block that started them. Steps 1 and 2 share one block.

- [ ] **Step 1: Build and serve with realistic env vars**

```bash
NEXT_PUBLIC_APP_URL=https://app.maxtest.id NEXT_PUBLIC_MCP_URL=https://api.maxtest.id npm run build
NEXT_PUBLIC_APP_URL=https://app.maxtest.id NEXT_PUBLIC_MCP_URL=https://api.maxtest.id npm run start -- -p 3100 &
sleep 4
```

- [ ] **Step 2: Check the HTML a no-JS visitor and a crawler get**

```bash
html=$(curl -s localhost:3100/)
echo "h1 count:      $(echo "$html" | grep -o '<h1' | wc -l)"
echo "headline:      $(echo "$html" | grep -c 'Max does the testing')"
echo "mcp command:   $(echo "$html" | grep -c 'claude mcp add --transport http maxtest https://api.maxtest.id/mcp')"
echo "signup link:   $(echo "$html" | grep -c 'https://app.maxtest.id/auth?action=signup')"
echo "undefined:     $(echo "$html" | grep -c 'undefined/auth')"
echo "google fonts:  $(echo "$html" | grep -c 'fonts.googleapis.com')"
echo "banned claims: $(echo "$html" | grep -ciE 'zero flake|zero manual setup|self-heal|enterprise-grade|advanced rag')"
for p in features pricing documentation blog privacy terms; do echo "$p $(curl -s -o /dev/null -w '%{http_code}' localhost:3100/$p)"; done
pkill -f "next start" || true
```

Expected: `h1 count: 1`, headline `1`, mcp command `1` or more, signup link `1` or more, `undefined: 0`, `google fonts: 0`, `banned claims: 0`, every page `200`.

- [ ] **Step 3: Check the unset-env fallbacks**

```bash
pkill -f "next start" || true
npm run build 2>&1 | grep -i "NEXT_PUBLIC_MCP_URL"
npm run start -- -p 3100 &
sleep 4
curl -s localhost:3100/ | grep -o '&lt;your-maxtest-host&gt;/mcp\|<your-maxtest-host>/mcp' | head -1
curl -s localhost:3100/ | grep -c 'undefined/auth'
pkill -f "next start" || true
```

Expected: the build log shows the warning, the placeholder host appears, and `undefined/auth` count is `0`.

- [ ] **Step 4: Manual browser pass (dev server)**

Run `npm run dev` and open `http://localhost:3000`. Check each item and fix anything off before continuing:

1. **Widths 360, 768, 1280, 1440:** no horizontal page scrollbar at any width. At 360 the connect command scrolls inside its panel, the cast tabs scroll inside their strip, and long tool names wrap.
2. **Hero:** headline, Max with exhaust, bubble, result row (5 green, 3 red), demo frame. The prompt types in, tool calls appear, and the red creatures wobble once, all under 3.5 s.
3. **Reduced motion:** in DevTools, Rendering, "Emulate prefers-reduced-motion: reduce", reload. Everything is already in its final state: full prompt, tool calls and result row visible, nothing animating.
4. **Keyboard only:** Tab goes through nav, both hero buttons, the copy button, the selected cast tab, then footer. Arrow keys move between cast tabs (wrapping), Home and End jump to the ends, and every focused element shows a lime outline.
5. **Copy button:** click it; the label says "Copied" and the clipboard holds the full command. Then open the page over plain `http://<your-LAN-IP>:3000` (insecure context) and click again: it says it couldn't copy and the command is selected. No console errors either way.
6. **Cast tabs:** each role swaps the job, tools and example; the default is the Runner.
7. **Other pages** (`/features`, `/pricing`, `/documentation`, `/blog`, a blog post): they render with the new Navbar, Footer, lime accent and dark palette, and no layout is broken. Fix only breakage (for example hard-coded cyan that is now unreadable), not layout.
8. **Contrast:** body text, `text-paper/55` captions on `bg-ink`, and `text-ink` on lime buttons are readable (use DevTools' contrast checker; captions must be at least 4.5:1, and raise the opacity if not).

- [ ] **Step 5: Lighthouse (mobile) on the production build**

```bash
npm run build && npm run start -- -p 3100 &
sleep 4
npx lighthouse http://localhost:3100 --only-categories=performance,accessibility,seo --form-factor=mobile --quiet --chrome-flags="--headless" --output=json --output-path=/tmp/lh-home.json
node -e "const r=require('/tmp/lh-home.json');for(const k of Object.keys(r.categories))console.log(k,Math.round(r.categories[k].score*100));console.log('LCP',r.audits['largest-contentful-paint'].displayValue)"
pkill -f "next start" || true
```

Expected: accessibility and SEO at or above 90; performance at or above the old page's score (take the old score from `git stash`-free comparison: `git switch chore/security-dep-updates`, build and run the same command, then switch back). LCP is the hero heading or Max sprite (Max has `priority`). If Lighthouse isn't installable, record that and rely on step 4's manual checks.

- [ ] **Step 6: Final checks and wrap-up**

```bash
npm test && npm run lint && npm run build
git status --short
git log --oneline main..HEAD
```

Expected: all green, a clean tree, and one commit per task. Report results (including anything skipped, such as Lighthouse) to the user, then use `superpowers:finishing-a-development-branch`.

# Maxtest landing page redesign: design spec

Date: 2026-10-05
Status: draft for review (brainstormed with the visual companion; mockups lived in `.superpowers/brainstorm/`, not committed)
Repo: `maxtest` (Next.js 16, React 19, Tailwind v4, Framer Motion)

## 1. Goal

Replace the current generic dark/cyan landing page with a distinctive, hand-designed-feeling page that sells Maxtest as **the QA platform your AI agent can operate** (MCP server first, dashboard second).

The page is **product-led**: one primary action, "Start free", which goes to `${NEXT_PUBLIC_APP_URL}/auth?action=signup` (unchanged from today).

Success criteria:
- A visitor understands within the first screen that an AI agent (Claude, Cursor, any MCP client) can write, run and triage tests through Maxtest.
- The page does not read as a template: no centered icon-card grid, no glow, no gradient text, no pill badges.
- Every claim on the page is backed by something in the product (see section 8).
- Lighthouse performance and accessibility stay at or above the current page's scores; layout works from 360px to 1440px.

## 2. Context (verified in code)

Current page (`app/page.tsx`, 218 lines): centered hero with two glow pills, gradient headline, YouTube demo embed (`VideoPlayer`, id `klrrIiq9TyM`), three equal `FeatureCard`s, centered CTA. Tokens live in `app/globals.css` (cyan `#00bfff`, neon shadows, `glass-panel`, `bg-grid`, `text-glow`). Fonts: Space Grotesk, Noto Sans, Merriweather via a Google Fonts link in `app/layout.tsx`. Existing routes that share Navbar/Footer/tokens: `/features`, `/pricing`, `/documentation`, `/blog`, `/privacy`, `/terms`.

Product facts the page relies on (from `akewops-be` and `akewops`):
- MCP server at `<API host>/mcp`, streamable HTTP, server name `maxtest`, about 40 `maxtest_*` tools.
- Connect command used by the app's own token modal: `claude mcp add --transport http maxtest <host>/mcp --header "Authorization: Bearer <token>"`. Personal access tokens default to 90 days. OAuth 2.1 (dynamic client registration plus a dashboard consent screen) is also supported.
- Tools are classed by risk (read, write, destructive, execution, external) with scopes `maxtest:read|write|execute|external`. Only read tools are on by default; the rest are off until a company admin enables them. Destructive tools have a preview step and confirmation. Calls are audited.
- `maxtest_propose_test_cases` stages AI-written cases as drafts; nothing becomes a real test case until a human approves it in the dashboard.
- Dashboard: AI generation from documents, workflows, test plans and launches, QA metrics, Jira and Slack integrations.

## 3. Decisions made

| Topic | Decision |
| --- | --- |
| Primary goal | Product-led signup |
| Hero | Layout C: agent prompt and real tool calls beside the live result |
| Look | Dark ("Ink" base) with anthropomorphic characters; not pixel art, not acanthus, not cream |
| Characters | **Max, the rocket**, from the Maxtest logo, drawn by the owner. No paw. Two variants ship: **with exhaust cloud** (the logo's shape) and **no exhaust** (rocket only). |
| Mascot color | **Lime** (final). Logo-blue is dropped. |
| MCP URL | Comes from a new `NEXT_PUBLIC_MCP_URL` env var (confirmed) |
| Dashboard screenshot | Owner will supply later; the plan ships a labeled placeholder frame |
| Scope | Home page plus shared shell (Navbar, Footer, tokens). Other pages inherit tokens but keep their layouts. |
| Approach | Tokens first, rebuild in place; section mockups before coding each |
| Pricing | Separate task. Home page gets a teaser linking to `/pricing`. |
| Illustration | Owner draws the final art; placeholders are built from the existing rocket sheet |

## 4. Page structure

Left-aligned, asymmetric, one column of reading flow with a persistent 12-column grid. Hairline dividers between blocks, no card rows.

1. **Nav**: Max (small) + wordmark, Product, Docs, Pricing, Blog, "Start free" button.
2. **Hero**: headline "Ask your agent. Max does the testing." Max beside a speech bubble showing a prompt and real tool calls (`maxtest_run_suite`, `maxtest_search_execution_history`). Below it, a row of small result creatures (rockets): body color shows pass or fail. The demo video sits in a framed "launch result" panel. CTAs: **Start free**, **Read the MCP docs**.
3. **Connect in a minute**: copyable command block with the real `claude mcp add ...` command (token shown as `<your-token>`), plus one line on OAuth for clients that support it.
4. **Meet the cast**: five job characters (Writer, Runner, Detective, Scribe, Reporter). Selecting one swaps a panel of real tool names and a short example exchange. Default selection: Runner.
5. **You stay in control**: the Gatekeeper character and three facts: drafts need approval, risky tools are off until an admin enables them, every call is audited.
6. **Also in the dashboard**: plain text list (AI generation from docs, workflows, test plans and launches, QA metrics, Jira and Slack) beside one real screenshot. No characters, so the product stays credible.
7. **Pricing teaser**: "Free to start. Pay for what you run." One line, links to `/pricing`. No numbers until the compute-and-runs model exists.
8. **Final CTA + Footer**: left-aligned headline "Put Max to work.", Start free, docs link. Footer restyled.

Social proof is **not** included. Add a slot only when real logos or quotes exist.

## 5. Visual system

Tokens (replace the cyan/neon set in `globals.css`; keep names where other pages use them, remap values):

- Background `#0e0e10`; panel `#17171a`; hairline `#2e2e34`; text `#f2f2ee`; muted text 55 to 65% of text.
- **Accent lime `#c6f24a`** is the only brand accent: primary button, section tags, hard shadows, tool names. Darker lime `#6d8a1f` for button shadow.
- Character colors (blue, orange, purple, teal, magenta, grey, green, red) are used only on characters and pass/fail status, never for UI chrome.
- Remove: `--shadow-neon*`, `text-glow`, gradient text, `glass-panel`, `bg-grid`, pill badges from the home page. Other pages that still reference them keep working until restyled (do not delete shared utilities in this project; stop using them on Home).

Type:
- Headlines: Bricolage Grotesque 800.
- Body: a readable system sans stack (or Noto Sans, already loaded).
- All tool calls and code: monospace.
- Replace the Google Fonts link in `layout.tsx` with `next/font` (Bricolage Grotesque, plus Noto Sans if kept) to avoid the render-blocking stylesheet.

Components:
- Bubble: 2px light outline, `#17171a` fill, hard 3px lime shadow, radius 12.
- Button: lime fill, dark text, 2px light outline, hard offset shadow; pressed state moves by the shadow offset.
- Tag: small uppercase label on lime.
- Character: sticker treatment (see section 6).

## 6. Characters and assets

**Source art**: the owner's rocket sheet (front-ish pose, 5 expressions, back view). The paw pads on the exhaust cloud are removed; the cloud stays.

**Treatment** (prototyped with a throwaway script, not part of this repo):
- Background removed (transparent PNG).
- Light sticker border around the silhouette so the navy outline reads on dark.
- Pink pads whitened; floating hearts and sparkles kept.
- Body hue-shifted from blue. Lime for Max. Per-role body colors for the cast: Writer blue (original), Runner orange, Detective purple, Scribe teal, Reporter magenta, Gatekeeper grey, "passed" green, "bug" red.

**Expression use**: idle (default), smile (success), wink (Runner), surprised (bug found, Detective), blush (Reporter). Back view is for the loading or "running" state.

**Variants and where each is used**: `exhaust` (rocket plus the logo's cloud) is used for the large Max in the hero and in the final CTA. `noexhaust` (rocket only) is used at small sizes: nav mark, result-row creatures, cast, Gatekeeper. `Character` takes a `variant` prop so this can be switched per placement without new assets.

**Design inputs already in the repo** (`docs/superpowers/assets/landing-redesign/`): the original sheet (`source/max-rocket-sheet.webp`), recolored PNGs for both variants (`characters/lime-<pose>[-noexhaust].png`, `characters/cast-<role>[-noexhaust].png`) and the script that produced them (`tools/recolor-rocket.js`, needs `sharp`; re-run it on the owner's final sheet to regenerate everything).

**Shipped files**: `public/characters/max-<pose>.png` and `max-<pose>-noexhaust.png`, `cast-<role>.png` and `cast-<role>-noexhaust.png`, optimized (under 50 KB for the large hero sprite, under 40 KB for every other file; measured at 2x display size) and served through `next/image`. Only the poses the page uses ship: `main`, `idle`, `smile`; the other expressions stay in the docs assets until a layout needs them. Final art from the owner replaces these with the same names; no code change.

**Placeholders**: the recolored sheet. Props (hat, magnifier, notebook, cap) are for the owner to draw later; the layout must not depend on them.

**Alt text**: every character gets a short alt describing the role; purely decorative repeats (the result row) use `alt=""` with an `aria-label` on the row summarizing "27 passed, 3 failed".

## 7. Interaction and motion

- Hero prompt types in once (about 1.2 s), tool calls resolve one by one, then the result row fills; creatures that failed wobble once. Total under 3 s, plays once.
- Cast section: tabs (roving tabindex, arrow-key navigation). Selecting a role swaps the tool list and example, with a short crossfade.
- Copy button on the connect block with an inline "Copied" state.
- Everything respects `prefers-reduced-motion`: final states render immediately, no wobble, no typing.
- `AnimatedSection` stays for scroll reveals but is reduced to a fade (no 20px slide) so the page reads calmer.

## 8. Content rules

The old page makes claims that could not be verified in the code. They are removed: "zero flake", "Zero Manual Setup", "Powered by Advanced RAG" pills, "self-healing", "Enterprise-grade".

Allowed claims, each tied to code:
- "About 40 tools": the number is a constant in the home content file with a comment pointing at the backend registry. Verify the count against `app/mcp/registry.py` at implementation time and keep it a round number ("40+") only if true.
- Connect command, OAuth support, risk classes and scopes, draft approval, audit: section 2.
- "Free to start": true while the free tier exists on `/pricing`. Re-check when pricing changes.

The demo video stays a YouTube embed, loaded on click (as `VideoPlayer` does today). Add a real poster frame.

## 9. Architecture

```
app/
  page.tsx                  composes sections only
  globals.css               new tokens; old neon utilities left for other pages
  layout.tsx                next/font, metadata unchanged
components/
  home/
    Hero.tsx                headline, Max + prompt bubble, result row, video frame
    ConnectBlock.tsx        command + copy button (client)
    CastSection.tsx         tabs + tool panel (client)
    ControlSection.tsx      Gatekeeper + three facts
    DashboardSection.tsx    text list + screenshot
    PricingTeaser.tsx
    FinalCta.tsx
  ui/
    Bubble.tsx  Button.tsx (replaces CTAButton on Home)  Tag.tsx  Character.tsx
  Navbar.tsx  Footer.tsx    restyled (shared by all pages)
lib/
  home-content.ts           copy, tool lists, cast definitions (single source)
public/characters/          PNG assets
```

Rules: server components by default; `"use client"` only for `ConnectBlock`, `CastSection`, `VideoPlayer`, and animated wrappers. `Character` takes `role`, `pose` and `variant` (`exhaust` or `noexhaust`), owns the sticker styling and alt text. Cast data (role, color, tools, example) lives in `lib/home-content.ts` so copy changes never touch layout code.

Config: a new `NEXT_PUBLIC_MCP_URL` env var supplies the MCP endpoint shown in the connect command. If unset, the block shows `<your-maxtest-host>/mcp` and the build logs a warning (never a hard-coded guess).

## 10. Out of scope

- Redesigning `/features`, `/pricing`, `/documentation`, `/blog` layouts (they only inherit tokens). The pricing model change (compute and total test runs) is its own spec.
- Social proof section, blog restyle, illustrations beyond the rocket and its recolors.
- Backend changes. No new APIs.

## 11. Verification

- `npm run lint` and `npm run build` pass.
- Visual check of every section at 360, 768, 1280 and 1440px against the mockups, using the running dev server.
- Keyboard: tab order through nav, hero CTAs, copy button, cast tabs (arrow keys), footer. Visible focus ring in lime.
- Contrast: body text and lime-on-dark meet WCAG AA; lime-button text (dark on lime) checked.
- `prefers-reduced-motion` verified by toggling the OS setting or devtools.
- Lighthouse (mobile) before and after; no regression in LCP (hero image preloaded, fonts via `next/font`).
- Confirm the other pages (`/features`, `/pricing`, `/documentation`, `/blog`) still render correctly with the new tokens and restyled Navbar and Footer; fix only breakage, not layout.

## 12. Resolved and remaining items

Resolved with the owner on 2026-10-05:
1. Exhaust cloud: both variants ship (section 6).
2. Max color: lime.
3. MCP URL: via `NEXT_PUBLIC_MCP_URL`. The "Read the MCP docs" button links to `/documentation` until a dedicated MCP page exists.
4. Dashboard screenshot: supplied later. Until then the frame shows a labeled placeholder (neutral panel with "Screenshot coming"), and the component accepts `src` so adding it is a one-line change.

Remaining, not blocking:
- Final character art from the owner (placeholders are built from the recolored sheet).
- Implementation starts on a new branch (for example `feat/landing-redesign`); the repo is currently on `chore/security-dep-updates`.

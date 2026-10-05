# Maxtest inner pages redesign: design spec

Date: 2026-10-05
Status: draft for review (layouts approved in the visual companion; mockups in `.superpowers/brainstorm/`, not committed)
Repo: `maxtest` (Next.js 16, React 19, Tailwind v4)
Builds on: `docs/superpowers/specs/2026-10-05-landing-redesign-design.md` (home page, tokens, characters, `Button`, `Bubble`, `Character`)

## 1. Goal

Redesign **Product** (`/features`), **Documentation** (`/documentation`), **Pricing** (`/pricing`) and **Blog** (`/blog`, `/blog/[slug]`) in the same ink/lime/rocket system as the home page, replacing the generic patterns the owner rejected.

Hard rules from the owner (every page must obey all four):

1. **No notch or pill badges** like "Platform Capabilities" or "Try First, Pay Later". Section labels are plain mono text (an "eyebrow"), with no background, border or radius.
2. **No mainstream icon-card grids** like "AI Test Case Generator". Content is laid out as chapters, ledgers, reference lists and editorial rows, separated by hairlines. Nothing is boxed in a bordered, rounded card. (Allowed boxed surfaces: the shared `Bubble` for code and tool calls, and the video/screenshot frame.)
3. **No emoji.** Icons are Lucide, monochrome: white on dark, black on lime, lime only as an active or accent state. No colored icons. This also covers the 6 emoji in `/features`, the 6 in `/documentation`, and the 4 in the MaxHeal blog post body.
4. **One shadow system.** The only shadow anywhere is the hard offset: `3px 3px 0 var(--color-primary-dark)` on lime buttons and `3px 3px 0 var(--color-primary)` on bubbles. No glows, no blurred shadows, no `shadow-lg`, no mismatched colors (the current Pricing page mixes a cyan glow on the Pro card, a different glow on its button, and `shadow-sm` on the toggle).

Success criteria:
- No page contains a rounded bordered card grid, a badge/pill, an emoji, or a blurred or colored glow shadow. Enforced by a test (section 9).
- Every claim is backed by the product (copy rules from the home spec, section 8, apply).
- Pages work from 360px to 1440px with no horizontal page scroll.
- Lighthouse accessibility stays at or above the current pages.

## 2. Decisions made

| Topic | Decision |
| --- | --- |
| Icons | `lucide-react` (new dependency), monochrome |
| Product page | Workflow story: Write, Run, Triage, Report |
| Pricing content | Designed for **runner minutes** and **test runs** now; those values are visible placeholders |
| Docs | Real MCP docs on one page with a sticky table of contents |
| Blog | Editorial list plus a narrow reading column; no cover cards |
| Home page | The lime `Tag` labels become the same plain mono eyebrow (consistency with rule 1) |
| Pricing model change | The pricing layout ships now; the actual numbers are the owner's later content change |

## 3. Shared pieces

New or changed, used by all four pages (and the home page for `Eyebrow`):

- `components/ui/Eyebrow.tsx`: mono, uppercase, letter-spaced, lime text, no background. Replaces `Tag` everywhere; `Tag.tsx` is deleted once nothing imports it.
- `components/ui/Icon.tsx`: thin wrapper over `lucide-react` with a fixed set of names (typed union), `size` (default 16), `strokeWidth` 2, color `currentColor`. Importing icons only through this wrapper keeps the set small and tree-shaken.
- `components/ui/PageHeader.tsx`: `Eyebrow` + `h1` (Bricolage 800) + one-line lede, left-aligned, max width about 40rem. Used by all four pages so the top of every page matches.
- `components/ui/Section.tsx`: `max-w-6xl` container with a hairline top border and consistent vertical rhythm.
- `lib/home-content.ts` unchanged except Eyebrow rename in components; copy rules and `BANNED_PHRASES` apply to the new page content too.
- Remove from these four pages, and delete when unused elsewhere: `FeatureCard.tsx`, the glow utilities that only they used (`neon-glow-*`, `card-hover-effect`, `shadow-neon*` tokens), and `glass-panel` if nothing else uses it. `CTAButton` is replaced by `Button` on these pages (the legacy file is deleted when nothing imports it).

## 4. Product page (`/features`)

Structure, top to bottom:

1. `PageHeader`: eyebrow "Product", h1 "From ticket to report, without leaving your editor.", lede "One test's life in four chapters. Each shows the real tool calls."
2. **Two-column story** on large screens: a sticky chapter rail on the left (about 8rem: `01 Write`, `02 Run`, `03 Triage`, `04 Report`, mono, active chapter in lime with a 2px left rule, driven by an `IntersectionObserver`), chapters on the right. On small screens the rail becomes a horizontal, non-sticky list of anchor links above the chapters.
3. **Four chapters**, each separated by a hairline. A chapter has an outlined large numeral (`-webkit-text-stroke`, transparent fill), a Lucide icon plus title, two sentences of explanation, a short list of the tools it uses, and a `Bubble` with a real example exchange next to the chapter's character (`noexhaust` variant). Chapters:
   - **01 Write** (icon `pencil`, character Writer): Jira ticket to test cases, staged as drafts for approval. Tools: `maxtest_get_jira_issue`, `maxtest_propose_test_cases`, `maxtest_search_test_cases`.
   - **02 Run** (icon `play`, Runner): run a suite on the Pancake Runner and follow it. Tools: `maxtest_find_suite`, `maxtest_run_suite`, `maxtest_run_execution`.
   - **03 Triage** (icon `search`, Detective, with the Scribe for recording results and evidence): find why it failed, record results in bulk with attachments. Tools: `maxtest_search_execution_history`, `maxtest_get_test_execution`, `maxtest_update_execution_statuses`, `maxtest_attach_to_execution`.
   - **04 Report** (icon `file-text`, Reporter): generate and find reports for finished launches. Tools: `maxtest_generate_report`, `maxtest_get_report`, `maxtest_list_reports`.
4. **Also in the platform**: the six old feature items (Smart Selectors, Instant Refactoring, Auto-Heal, Test Analytics, CI/CD Integration, Smart Test Plans) are reviewed against the product. Only items the code supports stay, as a plain two-column list with one Lucide icon each and one line of text. Items that cannot be verified (self-healing wording) are removed or reworded, per the copy rules. The implementer lists what was dropped in the commit message.
5. Closing CTA: left-aligned "Try Maxtest today.", `Button` "Start free" (`signupUrl()`), ghost "Read the MCP docs".

Chapter content (names, tools, examples) lives in `lib/product-content.ts`, reusing the cast data from `lib/home-content.ts` where it overlaps so the two pages cannot drift.

## 5. Pricing page (`/pricing`)

1. `PageHeader`: eyebrow "Pricing", h1 "Pay for what you run.", lede about the two meters.
2. **Billing toggle**: a segmented control (2px light border, radius 8, selected segment filled with `paper` and dark text). Monthly or Yearly with "−20%" as plain lime text. No `shadow-sm`.
3. **Plan ledger**: one comparison table, not three cards. Columns: Free, Pro, Team. The recommended plan (Pro) is marked by a 3px lime top rule on its header cell and a `panel` background tint down the whole column; the label "Most teams" is plain eyebrow text, not a badge. Other columns have a 2px light top rule.
   - Rows: price (Rp primary, USD approximate as a muted second line), **Runner minutes per month**, **Test runs per month**, MCP server with all tools, Approval queue and audit log, Support.
   - Price cells keep today's values (Free Rp 0, Pro Rp 1.199.999 monthly or Rp 959.999 yearly, Team "Talk to us"). The **meter cells are placeholders** rendered with a dashed lime underline and square brackets (`[300]`), so they cannot ship unnoticed.
   - Check marks are Lucide `check` in lime. No colored emoji or glyph ticks.
   - Last row holds the CTAs: ghost `Button` for Free and Team, primary lime `Button` for Pro. Free goes to `signupUrl()`, Team to `mailto:` (the existing contact address already used on the page).
   - On small screens the ledger becomes one stacked section per plan (plan name and price, then label-value rows), still without cards.
4. **FAQ**: an accordion list with hairline dividers (native `<details>`, Lucide `plus` that rotates to `minus`). The current answers contradict the tiers ("20 test generations per month", "unlimited for Pro"); they are rewritten to describe runner minutes and test runs, with placeholders where a number would go. FAQ JSON-LD (`generateFAQSchema`) is kept and fed the same data.
5. Plans, meters and FAQ live in `lib/pricing.ts`. Swapping placeholder values for real numbers is a content edit in that file only.

## 6. Documentation page (`/documentation`)

One long page with a sticky "On this page" list on the left (mono, active section in lime with a left rule, `IntersectionObserver`; collapses to a top anchor list on small screens). Sections:

1. **Quickstart**: create a personal access token in the dashboard, then the connect command (reuse `buildConnectCommand` and the home page's copy button component, extracted into `components/ui/CopyCommand.tsx` so both pages share it). A short paragraph on clients that support OAuth 2.1 (connect with the URL and a consent screen).
2. **Tools reference** (41 tools, count asserted by test): grouped by risk class, each group headed by its Lucide icon and a mono label with its default state. Each row: icon, mono tool name in lime, one-line description. Groups and current counts from the backend registry: **Read** (`eye`, 21, on by default), **Write** (`pencil`, 16, admin enables), **Execution** (`play`, 2, admin enables), **Destructive** (`trash-2`, 2, admin enables, preview then confirm). The model also defines an **External** class and scope, but no tool uses it today, so it is mentioned in the Scopes section only and gets no group.
3. **Scopes and permissions**: `maxtest:read`, `maxtest:write`, `maxtest:execute`, `maxtest:external`, and that every call is also checked against the user's project permissions.
4. **Approvals and audit**: proposed test cases are drafts until a person approves them in the dashboard; destructive tools use a preview step and a confirmation; calls are audited.
5. **More guides**: a plain list of the topics that are not written yet (Core concepts, AI test generation, API reference, Integrations, Analytics and reporting), each labeled "Coming soon". No dead links.
6. **Get help**: the existing Discord and support email links as two plain text links with Lucide icons (`message-circle`, `mail`).

Data: `lib/mcp-tools.ts` is a **snapshot** of the backend registry (name, risk class, title) with a header comment naming `akewops-be/app/mcp/tools/*.py` as the source and the date taken. One-line descriptions are written for the page from the backend tool descriptions, not copied verbatim. A test asserts: 41 tools, per-class counts (21, 16, 2, 2), unique names, every name matches `/^maxtest_[a-z_]+$/`, and every tool name used on the home or product pages exists in this snapshot.

## 7. Blog (`/blog`, `/blog/[slug]`)

- **Index**: `PageHeader` (eyebrow "Blog", h1 "Notes from the test bench."), then editorial rows separated by hairlines. Each row: date and read time in mono, the title (Bricolage 800; the newest post larger), a one-line excerpt, and a lime "Read →" link. No images, no card borders, no hover lift.
- **Post**: a left-aligned header (date, read time, title), then a single reading column about 65 characters wide in Merriweather (already loaded), with Bricolage headings, hairline-separated sections, code and callouts in the shared `Bubble`, lists with a lime `▸` marker, and a closing `Button` "Start free".
- **Read time**: computed at build time from the post's text (words divided by 200, rounded up, minimum 1 minute) by a pure function in `lib/blog.ts`. Never hard-coded.
- **Emoji removal**: the 4 emoji list markers in the MaxHeal post body are removed from the HTML strings in `lib/blog-data.ts`; the lime marker comes from CSS, not from characters in the content. Post content otherwise stays as is. Existing blog metadata and JSON-LD are unchanged.
- **Copy**: the posts talk about self-healing selectors because that is the subject of those posts and of the MaxHeal feature; they are the owner's authored content and are not rewritten here.

## 8. Cross-cutting

- Navbar and Footer are already restyled; they gain no new items.
- Every page uses `signupUrl()` (no raw `NEXT_PUBLIC_APP_URL` template strings).
- Motion: only the existing `.reveal` fade and the `AnimatedSection` fade; nothing animates under `prefers-reduced-motion`. The accordion and rail use CSS transitions that are disabled under reduced motion.
- Accessibility: one `h1` per page, landmark `nav` for the contents rails (`aria-label`), `aria-current="true"` on the active rail item, native `<details>` for the FAQ, focus rings in lime, Lucide icons are `aria-hidden` unless they carry meaning alone (then they get a label).
- SEO: titles, descriptions, canonical paths and JSON-LD on each page stay as they are today unless the old text makes a banned claim.

## 9. Verification

- `npm test`, `npm run lint` (no new errors beyond the 28 existing baseline errors), `npm run build`.
- **Design-rule test** (`lib/design-rules.test.ts`, scans `app/**` and `components/**` source files for the four pages and shared UI): fails on any emoji codepoint in page source, on `rounded-full` combined with a border or background on a text label, on `shadow-lg`, `shadow-xl`, `shadow-2xl`, `shadow-neon`, `blur-` glow classes or `rgba(` box shadows, and on imports of `FeatureCard`. This pins the four owner rules so they cannot regress.
- Content tests: tools snapshot (section 6), pricing ledger shape (three plans, every plan has the two meters), blog read-time function (empty text gives 1, 400 words gives 2, HTML tags are not counted), no banned phrases in the new content modules.
- HTTP checks on the production build: one `h1` per page, no `undefined/auth`, all six routes 200, FAQ JSON-LD still present on `/pricing`.
- Manual browser pass at 360, 768, 1280 and 1440px for each page: no horizontal scroll, rails and accordion work by keyboard, sticky rails highlight the right section, reduced motion respected.

## 10. Out of scope

- Writing the "More guides" documentation pages.
- Final pricing numbers (the owner replaces the placeholders).
- Rewriting blog post prose or adding posts.
- Backend changes. The tools snapshot is read-only from the backend.

## 11. Open items

1. **Pro price**: kept at today's Rp 1.199.999 monthly until the owner changes it in `lib/pricing.ts`. Confirm that is acceptable while the meters are placeholders.
2. **Team plan name**: the current page calls it "Custom"/"Enterprise"; this spec uses "Team". Confirm the name.
3. **Product page's "Also in the platform" list**: which of the six legacy items the owner wants to keep after the verification pass.
4. **Branch**: build on a new branch `feat/inner-pages-redesign` from `feat/landing-redesign`.

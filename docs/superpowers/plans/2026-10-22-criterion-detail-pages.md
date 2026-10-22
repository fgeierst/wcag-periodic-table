# Criterion Detail Pages Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Implement issue #6, “Show details as full page,” replacing the dialog.

**Architecture:** Generate static Astro pages at `/criteria/{ref_id}/` from the same enriched criterion data used by the JSON endpoint. Render the existing Svelte Details component without client hydration, and replace card dialog triggers with native links. Reuse the shared layout, badges, and reference buttons.

**Tech Stack:** Astro 7, Svelte 5, TypeScript, Tailwind CSS, Vitest, Playwright.

**Spec:** https://github.com/fgeierst/wcag-periodic-table/issues/6 (body: “replacing dialog”). The user requested isolated work and uninterrupted execution without questions.

## Global Constraints

- Work only in the isolated issue-6 worktree; preserve the original checkout's uncommitted changes.
- Use the existing dependencies, criterion data, and visual conventions.
- Every criterion, including AAA criteria, has a direct, reloadable detail URL.
- Preserve the description, exceptions, badges, axe-core rules, and W3C/reference links.
- Use one h1, a main landmark, visible keyboard focus, responsive document scrolling, and a native link back to the table; no modal or nested scroll container.
- Do not push, merge, or close the issue without authorization.

## Review Focus

- Direct visits and reloads work without JavaScript or the table's data fetch.
- Criteria without axe rules, exceptions, or references omit empty sections safely.
- All table links resolve to the correct criterion, including AAA selections.
- Long text and reference controls fit a 320px viewport with document scrolling.
- Invalid IDs return 404, not another criterion's details.

---

### Task 1: Replace criterion dialogs with static detail pages

**Files:**

- Create: `src/data/criteria.ts` — shared `getCriteria(): SuccessCriteria[]` data enrichment.
- Modify: `src/pages/api/wcag.json.ts` — use `getCriteria()` while retaining the JSON response contract.
- Create: `src/pages/criteria/[id].astro` — `getStaticPaths()` supplies criterion props from `getCriteria()`; page-specific document title, back link, main landmark, server-rendered Details.
- Modify: `src/components/Details.svelte` — full-page content, h1 and h2 sections, existing Badge/Button primitives, no Dialog/ScrollArea.
- Modify: `src/components/Card.svelte` — native `/criteria/{ref_id}/` link covering the card with an accessible name containing its ID and title.
- Modify: `tests/playwright/search.spec.ts` — retain search assertions, replace obsolete fixture-dialog assertion with the card link contract (fixture data is not the static page data).
- Create: `tests/vitest/criteria.spec.ts` and `tests/playwright/details.spec.ts` — data consistency and page behavior regressions.
- Modify: `README.md` — document shareable detail URLs.

**Interfaces:**

- Consumes: `SuccessCriteria` in `src/wcag.d.ts`, `wcag-as-json`, audit results, axe-core metadata, Layout, Badge, Button.
- Produces: `getCriteria(): SuccessCriteria[]`, unchanged `/api/wcag.json` records, static `/criteria/{ref_id}/` pages.

- [x] Write data tests for unique complete criterion records, audit/rule enrichment, unchanged endpoint output, and fresh results on repeated calls.
- [x] Write browser tests for link activation by click/Enter, no dialogs, direct visits/reloads without JS, all criterion routes, optional sections, references, back link, 320px layout, and invalid-ID 404.
- [x] Run new tests to confirm failures identify missing `getCriteria` and absent detail routes/links.
- [x] Extract existing endpoint enrichment into `getCriteria()` and delegate the endpoint to it.
- [x] Add static route and convert Details to full-page content; change Card to a native link with visible keyboard focus.
- [x] Update obsolete dialog assertion and README.
- [x] Run Vitest, full Playwright, lint, Astro check/static build, and formatting checks; verify generated route count and inspect desktop/mobile screenshots.
- [x] Review the complete diff, resolve any findings, and rerun affected checks.
- [x] Commit the implementation on the worktree branch, leaving it unmerged and unpushed.

## Baseline and execution notes

- Baseline: 22 Vitest tests and 13 Playwright tests passed; lint and static build passed.
- Astro CLI-managed build/dev stalled in this harness. Programmatic `build({})` and `dev({server:{host:"127.0.0.1",port:4326}})` completed normally; no repository workaround is needed.
- Planning self-review: requirements map to Task 1; all five review conditions have tests; data and route interfaces use existing `SuccessCriteria` consistently.
- Verification: 26 Vitest tests, 22 Playwright tests against both dev and production preview, lint, Astro check (zero diagnostics), formatting, and build (88 pages) passed. Generated JSON is identical to the saved baseline; all 87 detail files exist. Desktop and 320px screenshots inspected.
- Independent review found a table-context regression on returning from detail pages. Added two RED→GREEN round-trip tests and restored submitted query, selected levels, and sorting via validated tab-scoped session storage in `src/components/App.svelte`; synchronized `src/components/Search.svelte` with the restored query. The suite now has 24 Playwright tests. Storage failure falls back to ordinary non-persistent browsing.
- Existing omissions of criterion notes, sorting comparator defects, and JavaScript-dependent table loading remain unchanged and outside issue #6.

## Follow-up: index-style layout and name-based URLs

The user's revised requirements supersede the initial layout and numeric routes:

- Left-align detail pages at the same body inset as the index; limit text width to `80ch`.
- Use the index h1 size (`text-lg font-bold`). The heading and document title read `WCAG 2.2 / {ref_id} {title}`; the heading's `WCAG 2.2` links to `/`.
- Remove the separate back navigation and horizontal separators, including section borders.
- Use lowercase, hyphenated criterion names in `/criteria/{slug}/`, preserving parenthetical distinctions (for example, `keyboard-no-exception`).
- Share name-based link generation in `src/utils/criterion-url.ts` and generate all 87 pages in `src/pages/criteria/[slug].astro`.
- Updated routing/content/round-trip tests and added literal URL examples, uniqueness, alignment, typography, 80ch, and separator regressions. Verified new behavior RED→GREEN.

# WCAG version filters — implementation plan

> **For agentic workers:** Use executing-plans to implement the tasks below with test-first verification.

**Goal:** Resolve [issue #7](https://github.com/fgeierst/wcag-periodic-table/issues/7): replace `wcag-as-json` with official W3C data and add WCAG version/new-SC filters.

**Architecture:** Keep unmodified snapshots of the W3C 2.1 and 2.2 JSON files. Adapt them into the existing criterion records, using 2.1 membership for 2.0. Serve static version-specific JSON and detail pages; keep existing 2.2 URLs. Filter by introduction version alongside search, levels, and sorting.

**Tech stack:** Astro, Svelte stores, TypeScript, Node.js, Vitest, Playwright.

**Spec:** Approved conversation and issue #7 (no additional issue description).

## Global constraints

- Work on a new branch from main, without a worktree. Initially leave changes uncommitted; the user subsequently authorized committing, merging into main, pushing, and closing issue #7.
- Toolbar order: Search → Version → Only added in this version → Levels → Sort.
- Default version 2.2; new-only unchecked. Disable/reset new-only for 2.0.
- Counts across all levels: 2.0 = 61, 2.1 = 78, 2.2 = 86; additions: 17 in 2.1, 9 in 2.2.
- Preserve full W3C wording, links, lists and notes; retain Deque/axe enrichments as clearly attributed app data.
- Include `pnpm update:criteria`; refresh both snapshots explicitly, not during builds or browser visits.
- 2.0 is a criterion-set view derived from current 2.1 data, not an archival 2.0 transcription.

## Review focus

- A failed/invalid second download must not overwrite either existing snapshot.
- Rapid version switching must not display a stale network response.
- Older saved session state without version settings must remain usable.
- Added-only filters must combine with levels/search without miscounting hidden levels.
- Version-specific detail links, titles, Parsing, and renamed criteria must work without JavaScript.

## Tasks

### Task 1: Official data and updater

Files: `scripts/update-criteria.mjs`, `src/data/wcag-2.1.json`, `src/data/wcag-2.2.json`, `src/data/criteria.ts`, `src/wcag.d.ts`, `package.json`, `pnpm-lock.yaml`, `README.md`, `tests/vitest/criteria.spec.ts`, `tests/vitest/update-criteria.spec.ts`.
Interface: `getCriteria(version: WcagVersion = "2.2"): SuccessCriteria[]`; criteria include `version`, `versions`, full `content`, mapped text/search fields and audit/axe metadata. `updateCriteria({ directory?, fetch? })` downloads/validates both files before writing.

- [x] Write tests for 61/78/86 counts, Parsing presence/absence, correct historical names, full content/notes, fresh records, enrichments, and failed updater preserving snapshots.
- [x] Run targeted Vitest tests; confirm missing behavior fails.
- [x] Implement updater, refresh snapshots, remove dependency, adapt records, document sources and command.
- [x] Run targeted and complete Vitest suite.

### Task 2: Version filters and routes

Files: `src/utils/search.ts`, `src/stores.ts`, `src/components/{App,Filter,Search,Status,Card,Details}.svelte`, `src/utils/criterion-url.ts`, `src/pages/api/wcag/[version].json.ts`, `src/pages/wcag/[version]/criteria/[slug].astro`, `src/pages/criteria/[slug].astro`, `src/components/Footer.astro`, search and browser tests.
Interfaces: `searchCriteria(items, query, levels, sortKey, selectedVersion = "2.2", onlyAdded = false)` returns active settings and counts. `criterionPath(title, version = "2.2")` preserves latest URLs, prefixes older URLs with `/wcag/{version}`. JSON version routes use Task 1 adapter.

- [x] Add failing search/browser tests for toolbar order, counts, filters, baseline checkbox reset, storage migration, rapid switching, content, and static older-version pages.
- [x] Observe expected failures before implementation.
- [x] Implement controls, version-aware loading with stale-response guard, persisted options, filter results, static version routes, full content and attribution.
- [x] Update existing tests for intentional counts/API fields and real current footer structure.
- [x] Run Vitest, build, lint and full Playwright suite; inspect desktop/narrow UI.

## Progress / execution ledger

- Baseline: Vitest 31/31 passed; branch `feat/7-wcag-version-filters` created from main.
- Ruling: Native inline execution and no commits follow the user's request to implement in the current checkout on a new branch.
- Pre-flight: Task 2 consumes Task 1's version/versions/content fields and `getCriteria(version)`; interfaces match.
- Task 1: complete — adapter/updater regressions observed RED→GREEN; complete Vitest suite 43/43 passed.
- Task 2: complete — search/browser regressions observed RED→GREEN; build 226 pages with 0 errors/warnings/hints; lint passed; Playwright 34/34 passed against both dev and static preview servers.
- Debugging: Restarted existing Astro server after dependency migration to clear its stale SSR module import. Fixed JSON union narrowing reported by Astro check. Disabled version controls until mount to prevent pre-hydration selections being overwritten; persistence regression now passes.
- Final review: independent read-only reviewer returned three Important findings; all reproduced and fixed with RED→GREEN regression tests. No Critical or Minor findings, and no declined judgments.
- Additional verification: axe reported 0 A/AA violations for each version's table; all 225 built criterion pages match their corresponding JSON records and version-specific titles; both stored W3C snapshots are byte-identical to the published files; toolbar inspected at 320px with no overflow.
- Final: fixed legacy URL regressions — `/criteria/target-size/` redirects to `/criteria/target-size-enhanced/` and `/criteria/parsing/` redirects to the 2.1 detail page, both working without JavaScript on the static build.
- Final: fixed nested updater validation — malformed lists, list items, paragraphs, notes, and null entries reject before either snapshot is overwritten; 8 updater tests pass.
- Final: fixed searchable exception paragraphs — W3C `p` detail entries map to searchable `special_cases`, while only `note` entries map to notes; Text Spacing “scripts” and Reflow “two-dimensional layout” regression tests pass.
- Final verification: 50/50 Vitest tests; 35/35 Playwright tests against both dev and static preview; build with 0 errors/warnings/hints; lint and `git diff --check` pass; `pnpm update:criteria` succeeds against official W3C data with nested validation enabled. Changes remain uncommitted on the requested branch.
- Integration authorization: user requested commit, merge into main, push, and close issue #7. Pre-commit verification repeated: Vitest 50/50, Playwright 35/35, build/lint/diff checks passed. Fetched origin and confirmed main matches origin/main. GitHub CLI is unavailable; commit closing keyword `Fixes #7` will close the issue on push to the confirmed default branch main.

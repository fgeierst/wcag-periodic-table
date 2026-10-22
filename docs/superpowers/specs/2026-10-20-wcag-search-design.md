# WCAG search and first declarative WebMCP tool

## Approved intent and scope

Help someone identify candidate WCAG criteria while preparing an accessibility issue. The browser sidebar assistant interprets the reported behavior and asks follow-up questions; the explorer retrieves references, never a diagnosis or conformance verdict.

Add a visible “Search criteria” form next to the existing level and sort filters. Preserve the current cards and detail dialogs, default A/AA selection, and sorting. The toolbar wraps on narrow screens. Submit with Search or Enter. **No Clear button.** Submitting an empty query restores the unsearched view without resetting filters.

Search criterion IDs, titles, descriptions, exception titles/descriptions, and associated axe-core rule descriptions. Combine search with active level filters. Announce visible result count and the count of textual matches excluded by level filters. A zero-match message suggests another keyword or level selection, not absence of an applicable criterion.

Expose the same visible form as `search_wcag_criteria` using declarative WebMCP annotations and automatic submission. Agent submission updates the same query and cards as human submission. Return applied query, active levels, sort order, visible count, excluded-by-level count, and visible criteria with full descriptions, exceptions, levels, axe-core information, and authoritative/reference links. No separate filter or detail-opening tools.

Search remains functional without WebMCP support. Do not add an AI service, semantic search, dependencies, issue submission, or unrelated refactors. Do not modify pre-existing `package.json` work.

## Builder choices

- Reuse Astro, Svelte, TypeScript, Vitest, and Playwright.
- Local case-insensitive matching; trim and split queries on whitespace. Every token must occur somewhere in a criterion’s combined searchable text. Literal matching, not regular expressions or stemming.
- Keep draft field text separate from submitted query; submitting an empty or whitespace-only query matches all criteria before level filtering.
- Return only visible criteria; report excluded matches by count. Human and agent results must agree on ordering and filters.
- No ranking by likelihood, no automatic filter resets, no persistence or URL state in this first version.
- Disable submission until criterion data loads successfully; announce loading/failure distinctly from no matches. Permit retry through page reload on load failure.
- Gate tool annotations on data readiness so an agent cannot interpret an unloaded dataset as zero results.
- Feature-detect the optional `SubmitEvent.respondWith` method. Read submitted query from FormData, not assumptions about framework input events.

## Example and acceptance

For “combobox will not reopen after Escape,” the assistant can search `keyboard`, read 2.1.1 and other textual matches, then investigate available keyboard routes. The tool itself produces no violation verdict.

Human and simulated agent submissions must yield identical cards and structured results; matching AAA criteria hidden by default must be acknowledged. Existing filtering and details continue to work; keyboard submission, empty queries, narrow layout, and no-WebMCP fallback are tested. Native WebMCP registration/invocation needs a supported Chrome build and testing flag or origin trial; simulated submission tests do not prove browser-native registration.

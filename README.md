# WCAG 2.2 Explorer

Displays the WCAG 2.2 success criteria as sortable sticky notes.

Select a criterion to open its full detail page, including its description,
exceptions, related axe-core rules, and reference links. Each criterion has a
shareable URL such as `/criteria/non-text-content/` that works on direct visits
and reloads, even without JavaScript. Select **WCAG 2.2** in the heading to return
to the table. Detail pages share the table's left alignment and heading size,
with text limited to 80ch.
Search, level filters, and sorting are retained within the current browser tab
when returning from a detail page, where session storage is available.

## Search criteria

Use the search beside the filters to find criterion IDs, titles, descriptions,
exceptions, and related axe-core rule descriptions. Press Enter or **Search** to
apply the query. Matching is case-insensitive and literal; every word must occur
somewhere in a criterion's searchable text. This retrieves references, not a
diagnosis or conformance verdict.

Search respects the selected levels and sort order. The result status reports
matches hidden by level filters. Submit an empty search to remove the query
without resetting the filters. No AI service or API key is required.

## Quickstart

```bash
git clone https://github.com/fgeierst/wcag-periodic-table.git
cd wcag-periodic-table
pnpm install
pnpm dev
```

## Testing

Tests are run with [Vitest](https://vitest.dev/) and [Playwright](https://playwright.dev/).

```bash
pnpm test:vitest
pnpm test:playwright
```

## WebMCP

Currently only a single tool `search_wcag_criteria` searches by keyword, title, or ID. Calls return updated criteria and counts. For local testing, enable `chrome://flags/#enable-webmcp-testing` in Chrome, then relaunch the browser. For the experimental origin trial, add your token to `.env.local` as `PUBLIC_WEBMCP_ORIGIN_TRIAL_TOKEN=<your-token>`. See the [WebMCP documentation](https://developer.chrome.com/docs/ai/webmcp).

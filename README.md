# WCAG 2.2 Explorer

Displays the WCAG 2.2 success criteria as sortable sticky notes.

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

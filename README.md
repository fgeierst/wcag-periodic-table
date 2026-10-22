# WCAG 2.2 Explorer

Displays the WCAG 2.2 success criteria as sortable sticky notes.

Select a criterion to open its full detail page, including its description,
exceptions, related axe-core rules, and reference links. Each criterion has a
shareable URL such as `/criteria/1.1.1/` that works on direct visits and reloads,
even without JavaScript. Use **Back to criteria** to return to the table.

## Search criteria

Use the search beside the filters to find criterion IDs, titles, descriptions,
exceptions, and related axe-core rule descriptions. Press Enter or **Search** to
apply the query. Matching is case-insensitive and literal; every word must occur
somewhere in a criterion's searchable text. This retrieves references, not a
diagnosis or conformance verdict.

Search respects the selected levels and sort order. The result status reports
matches hidden by level filters. Submit an empty search to remove the query
without resetting the filters. No AI service or API key is required.

### Experimental declarative WebMCP

The same visible search form exposes `search_wcag_criteria` when the data is
ready. Its `query` parameter accepts keywords, titles, or IDs; an empty query
removes the search. Agent calls automatically submit the form, update the cards,
and return the query, selected levels, sort order, visible count, count excluded
by levels, and visible criterion records including reference links.

For local testing, use a supported Chrome build with
`chrome://flags/#enable-webmcp-testing` enabled and relaunch Chrome. Deployment
requires applicable browser support and, while experimental, an origin-trial
token. See the [Chrome WebMCP documentation](https://developer.chrome.com/docs/ai/webmcp).
Use Chrome DevTools' WebMCP inspector or a compatible tool-inspector extension
to check discovery and invocation. Browser-sidebar support depends on the agent
client; these annotations do not add a sidebar assistant to the app.

Playwright tests simulate agent submit events to verify our shared handler and
structured results. These tests do not establish native WebMCP discovery or
invocation. Ordinary search also works in browsers without WebMCP.

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

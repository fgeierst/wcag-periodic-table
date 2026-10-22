# WCAG 2.2 Explorer

Displays the WCAG 2.2 success criteria as sortable sticky notes.

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

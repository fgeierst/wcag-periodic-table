# WCAG Explorer

Displays WCAG 2.0, 2.1, and 2.2 success criteria as searchable, sortable sticky notes. Filter by conformance level or show only the criteria added in the selected version.

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

## Updating the criteria

```bash
pnpm update:criteria
```

This downloads both official [WCAG 2.1 JSON](https://www.w3.org/WAI/WCAG21/wcag.json) and [WCAG 2.2 JSON](https://www.w3.org/WAI/WCAG22/wcag.json) into `src/data/`, preserving their content unchanged. Both downloads are validated before either snapshot is overwritten. Review the diff and run the tests/build before committing an update. Builds and visitors use the local snapshots, not live W3C requests.

W3C publishes these files monthly. See the [JSON documentation and attribution requirements](https://github.com/w3c/wcag/tree/main/11ty/json#readme), [WCAG 2.1](https://www.w3.org/TR/WCAG21/), [WCAG 2.2](https://www.w3.org/TR/WCAG22/), [Techniques for WCAG 2.1](https://www.w3.org/WAI/WCAG21/Techniques/), and [Techniques for WCAG 2.2](https://www.w3.org/WAI/WCAG22/Techniques/). W3C content is used under the [W3C Document License](https://www.w3.org/copyright/document-license/); the app's MIT license does not replace that license.

The WCAG 2.0 view selects the original 61 criteria from the current 2.1 data; it is not an archival transcription of WCAG 2.0. Parsing (4.1.1) is included in 2.0/2.1 and excluded from 2.2. Deque audit statistics and axe-core rule associations are additional app data, not W3C guideline content.

## WebMCP

Currently only a single tool `search_wcag_criteria` searches by keyword, title, or ID. Calls return updated criteria and counts. For local testing, enable `chrome://flags/#enable-webmcp-testing` in Chrome, then relaunch the browser. For the experimental origin trial, add your token to `.env.local` as `PUBLIC_WEBMCP_ORIGIN_TRIAL_TOKEN=<your-token>`. See the [WebMCP documentation](https://developer.chrome.com/docs/ai/webmcp).

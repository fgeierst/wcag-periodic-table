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

## ACT rules

Criterion detail pages list related [Accessibility Conformance Testing (ACT) rules](https://www.w3.org/WAI/standards-guidelines/act/rules/) alongside axe-core rules. Each entry links to the rule, not to an individual test case. The list includes primary and secondary WCAG associations; proposed and deprecated rules are labeled. ACT rules are informative and do not by themselves establish full WCAG conformance.

To refresh the local rule catalogue:

```bash
pnpm update:act-rules
```

This downloads W3C's [rule catalogue](https://github.com/w3c/wcag-act-rules/blob/main/wcag-mapping.json), validates it, and saves a compact snapshot in `src/data/actRules.json`. Repeated versions are combined by rule ID, preferring approved metadata while retaining all criterion associations. Builds and visitors use the snapshot without live requests. Review the diff and run tests and the build before committing an update.

ACT rule content is © W3C, used under the [W3C Document License](https://www.w3.org/copyright/document-license/), with contributions from the [ACT Rules Community Group](https://act-rules.github.io/pages/about/). The app's MIT license does not replace the content license.

## WebMCP

Currently only a single tool `search_wcag_criteria` searches by keyword, title, or ID. Calls return updated criteria and counts. For local testing, enable `chrome://flags/#enable-webmcp-testing` in Chrome, then relaunch the browser. For the experimental origin trial, add your token to `.env.local` as `PUBLIC_WEBMCP_ORIGIN_TRIAL_TOKEN=<your-token>`. See the [WebMCP documentation](https://developer.chrome.com/docs/ai/webmcp).

import { mkdir, writeFile } from "node:fs/promises";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

/** Refresh the unmodified official snapshots only after both downloads validate. */
export async function updateCriteria({
  directory = fileURLToPath(new URL("../src/data/", import.meta.url)),
  fetch: fetchData = globalThis.fetch,
} = {}) {
  const snapshots = await Promise.all(
    ["2.1", "2.2"].map(async (version) => {
      const url = `https://www.w3.org/WAI/WCAG${version.replace(".", "")}/wcag.json`;
      const response = await fetchData(url, {
        signal: AbortSignal.timeout(30_000),
      });
      if (!response.ok) throw new Error(`${url}: HTTP ${response.status}`);
      const content = await response.text();
      const data = JSON.parse(content);
      const criteria = data.principles?.flatMap((principle) =>
        principle.guidelines?.flatMap((guideline) => guideline.successcriteria),
      );
      if (
        !Array.isArray(data.terms) ||
        !criteria?.length ||
        criteria.some(
          (criterion) =>
            !criterion ||
            !/^\d+\.\d+\.\d+$/.test(criterion.num) ||
            typeof criterion.id !== "string" ||
            typeof criterion.handle !== "string" ||
            typeof criterion.title !== "string" ||
            typeof criterion.content !== "string" ||
            !["A", "AA", "AAA", ""].includes(criterion.level) ||
            !Array.isArray(criterion.details) ||
            !criterion.details.every((detail) => {
              if (!detail || typeof detail !== "object") return false;
              if (detail.type === "ulist") {
                return (
                  Array.isArray(detail.items) &&
                  detail.items.every(
                    (item) =>
                      item &&
                      typeof item.text === "string" &&
                      (item.handle === undefined ||
                        typeof item.handle === "string"),
                  )
                );
              }
              return (
                ["p", "note"].includes(detail.type) &&
                typeof detail.text === "string" &&
                (detail.type !== "note" || typeof detail.handle === "string")
              );
            }) ||
            !Array.isArray(criterion.versions) ||
            !criterion.versions.every((value) =>
              ["2.0", "2.1", "2.2"].includes(value),
            ),
        ) ||
        !criteria.some((criterion) => criterion.versions.includes(version))
      )
        throw new Error(`${url}: unexpected WCAG JSON structure`);
      return { version, content };
    }),
  );
  await mkdir(directory, { recursive: true });
  await Promise.all(
    snapshots.map(({ version, content }) =>
      writeFile(join(directory, `wcag-${version}.json`), content),
    ),
  );
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  await updateCriteria();
  console.log("Updated official WCAG 2.1 and 2.2 snapshots.");
}

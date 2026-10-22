import { writeFile } from "node:fs/promises";
import { pathToFileURL } from "node:url";

const sourceUrl =
  "https://raw.githubusercontent.com/w3c/wcag-act-rules/main/wcag-mapping.json";
const outputPath = new URL("../src/data/actRules.json", import.meta.url);

export function normalizeActRules(data) {
  if (!Array.isArray(data?.["act-rules"]) || !data["act-rules"].length) {
    throw new Error(
      "Invalid ACT rule catalogue: expected a non-empty act-rules array",
    );
  }

  const rules = new Map();
  const priority = { approved: 0, proposed: 1, deprecated: 2 };
  for (const source of data["act-rules"]) {
    const id = source?.frontmatter?.id;
    if (
      typeof id !== "string" ||
      !/^[a-z0-9]{6}$/.test(id) ||
      typeof source.title !== "string" ||
      !source.title.trim() ||
      typeof source.frontmatter.description !== "string" ||
      !source.frontmatter.description.trim() ||
      typeof source.proposed !== "boolean" ||
      typeof source.deprecated !== "boolean" ||
      !Array.isArray(source.successCriteria) ||
      !source.successCriteria.every(
        (slug) =>
          typeof slug === "string" && /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug),
      ) ||
      ![
        `/standards-guidelines/act/rules/${id}/`,
        `/standards-guidelines/act/rules/${id}/proposed/`,
      ].includes(source.permalink)
    ) {
      throw new Error(`Invalid ACT rule metadata: ${id ?? "unknown ID"}`);
    }

    const rule = {
      ruleId: id,
      ruleName: source.title.trim(),
      description: source.frontmatter.description.trim(),
      rulePage: `https://www.w3.org/WAI${source.permalink}`,
      successCriteria: [...new Set(source.successCriteria)].sort(),
      status: source.deprecated
        ? "deprecated"
        : source.proposed
          ? "proposed"
          : "approved",
    };
    const existing = rules.get(id);
    if (existing) {
      const preferred =
        priority[rule.status] < priority[existing.status] ? rule : existing;
      rules.set(id, {
        ...preferred,
        successCriteria: [
          ...new Set([...existing.successCriteria, ...rule.successCriteria]),
        ].sort(),
      });
    } else {
      rules.set(id, rule);
    }
  }
  return [...rules.values()].sort((a, b) =>
    a.ruleName.localeCompare(b.ruleName, "en"),
  );
}

export async function updateActRules(options = {}) {
  const response = await (options.fetcher ?? fetch)(sourceUrl);
  if (!response.ok) {
    throw new Error(`ACT rule download failed: HTTP ${response.status}`);
  }
  const rules = normalizeActRules(await response.json());
  await writeFile(
    options.outputPath ?? outputPath,
    `${JSON.stringify(rules, null, 2)}\n`,
  );
  return rules;
}

if (
  process.argv[1] &&
  import.meta.url === pathToFileURL(process.argv[1]).href
) {
  try {
    const rules = await updateActRules();
    console.log(`Updated ${rules.length} ACT rules in src/data/actRules.json`);
  } catch (error) {
    console.error(error.message);
    process.exitCode = 1;
  }
}

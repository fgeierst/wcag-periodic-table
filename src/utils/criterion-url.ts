import type { WcagVersion } from "../wcag";

export function criterionPath(
  title: string,
  version: WcagVersion = "2.2",
): string {
  const slug = title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
  const prefix = version === "2.2" ? "" : `/wcag/${version}`;
  return `${prefix}/criteria/${slug}/`;
}

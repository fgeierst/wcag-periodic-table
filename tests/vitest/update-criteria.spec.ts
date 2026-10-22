import { afterEach, describe, expect, it } from "vitest";
import { mkdtemp, readFile, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";

const directories: string[] = [];
afterEach(async () => {
  await Promise.all(
    directories.map((directory) =>
      rm(directory, { recursive: true, force: true }),
    ),
  );
  directories.length = 0;
});

describe("official criteria updater", () => {
  it("downloads both version files without changing the content", async () => {
    const { updateCriteria } =
      await import("../../scripts/update-criteria.mjs");
    const directory = await mkdtemp(join(tmpdir(), "wcag-update-"));
    directories.push(directory);
    const bodies = ["21", "22"].map((version) =>
      JSON.stringify(
        {
          principles: [
            {
              guidelines: [
                {
                  successcriteria: [
                    {
                      num: "1.1.1",
                      id: "non-text-content",
                      handle: "Non-text Content",
                      title: "Official description",
                      level: "A",
                      versions:
                        version === "21"
                          ? ["2.0", "2.1"]
                          : ["2.0", "2.1", "2.2"],
                      content: "<p>Official description</p>",
                      details: [],
                    },
                  ],
                },
              ],
            },
          ],
          terms: [],
        },
        null,
        2,
      ),
    );
    await updateCriteria({
      directory,
      fetch: async (url) =>
        new Response(bodies[String(url).includes("WCAG21") ? 0 : 1]),
    });
    expect(await readFile(join(directory, "wcag-2.1.json"), "utf8")).toBe(
      bodies[0],
    );
    expect(await readFile(join(directory, "wcag-2.2.json"), "utf8")).toBe(
      bodies[1],
    );
  });

  it.each([
    "http",
    "invalid",
    "nested-list",
    "nested-item",
    "nested-paragraph",
    "nested-note",
    "null-detail",
  ])("preserves both snapshots when a download is %s", async (failure) => {
    const { updateCriteria } =
      await import("../../scripts/update-criteria.mjs");
    const directory = await mkdtemp(join(tmpdir(), "wcag-update-"));
    directories.push(directory);
    await writeFile(join(directory, "wcag-2.1.json"), "existing 2.1");
    await writeFile(join(directory, "wcag-2.2.json"), "existing 2.2");
    await expect(
      updateCriteria({
        directory,
        fetch: async (url) => {
          if (String(url).includes("WCAG22")) {
            if (failure === "http")
              return new Response("Unavailable", { status: 503 });
            if (failure === "invalid")
              return new Response('{"principles": []}');
            const data = JSON.parse(
              await readFile(
                new URL("../../src/data/wcag-2.2.json", import.meta.url),
                "utf8",
              ),
            );
            const invalidDetails = {
              "nested-list": { type: "ulist", items: {} },
              "nested-item": { type: "ulist", items: [null] },
              "nested-paragraph": { type: "p", text: 42 },
              "nested-note": { type: "note", handle: null, text: "Note" },
              "null-detail": null,
            };
            data.principles[0].guidelines[0].successcriteria[0].details = [
              invalidDetails[failure as keyof typeof invalidDetails],
            ];
            return new Response(JSON.stringify(data));
          }
          return new Response(
            await readFile(
              new URL("../../src/data/wcag-2.1.json", import.meta.url),
              "utf8",
            ),
          );
        },
      }),
    ).rejects.toThrow();
    expect(await readFile(join(directory, "wcag-2.1.json"), "utf8")).toBe(
      "existing 2.1",
    );
    expect(await readFile(join(directory, "wcag-2.2.json"), "utf8")).toBe(
      "existing 2.2",
    );
  });
});

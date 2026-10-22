import type { GetStaticPaths, APIRoute } from "astro";
import { getCriteria } from "../../../data/criteria";
import type { WcagVersion } from "../../../wcag";

export const getStaticPaths = (() =>
  ["2.0", "2.1", "2.2"].map((version) => ({
    params: { version },
  }))) satisfies GetStaticPaths;

export const GET: APIRoute = ({ params }) =>
  new Response(JSON.stringify(getCriteria(params.version as WcagVersion)), {
    headers: { "Content-Type": "application/json" },
  });

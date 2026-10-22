import { getCriteria } from "../../data/criteria";

export async function GET() {
  return new Response(JSON.stringify(getCriteria()), {
    status: 200,
    headers: {
      "Content-Type": "application/json",
    },
  });
}

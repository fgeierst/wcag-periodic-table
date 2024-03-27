import axe from "axe-core";

export async function GET({}) {
  if (!axe) {
    return new Response(null, {
      status: 404,
      statusText: "Not found",
    });
  }

  const rules = axe.getRules([]);
  console.log("rules length: ", rules.length);

  return new Response(JSON.stringify(rules), {
    status: 200,
    headers: {
      "Content-Type": "application/json",
    },
  });
}

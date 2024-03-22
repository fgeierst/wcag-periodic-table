import wcag from "wcag-as-json/wcag.json";

export async function GET({}) {
  if (!wcag) {
    return new Response(null, {
      status: 404,
      statusText: "Not found",
    });
  }

  const successCriteria = extractSuccessCriteria(wcag);

  return new Response(JSON.stringify(successCriteria), {
    status: 200,
    headers: {
      "Content-Type": "application/json",
    },
  });
}

function extractSuccessCriteria(wcagData) {
  const successCriteria = [];

  wcagData.forEach((item) => {
    item.guidelines.forEach((guideline) => {
      guideline.success_criteria.forEach((criteria) => {
        successCriteria.push({
          ref_id: criteria.ref_id,
          title: criteria.title,
          description: criteria.description,
          url: criteria.url,
          level: criteria.level,
        });
      });
    });
  });

  return successCriteria;
}

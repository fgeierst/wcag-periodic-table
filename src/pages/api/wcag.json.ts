import wcag from "wcag-as-json/wcag.json";
import auditResults from "../../data/auditResults.json";
import type { Wcag, SuccessCriteria } from "../../../types/wcag";

export async function GET({}) {
  if (!wcag) {
    return new Response(null, {
      status: 404,
      statusText: "Not found",
    });
  }

  const successCriteria = extractSuccessCriteria(wcag);
  const successCriteriaWithAuditResults = addAuditResults(
    successCriteria,
    auditResults.auditResultsDeque2021
  );

  return new Response(JSON.stringify(successCriteriaWithAuditResults), {
    status: 200,
    headers: {
      "Content-Type": "application/json",
    },
  });
}

function extractSuccessCriteria(wcagData: Wcag[]) {
  const successCriteria: SuccessCriteria[] = [];

  wcagData.forEach((item) => {
    item.guidelines?.forEach((guideline) => {
      guideline.success_criteria?.forEach((criteria) => {
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

type AuditResult = {
  ref_id: string;
  AutomatedIssues: number;
  ManualIssues: number;
};
function addAuditResults(
  successCriteria: SuccessCriteria[],
  auditResults: AuditResult[]
) {
  const totalIssues = auditResults.reduce(
    (total, result) => total + result.AutomatedIssues + result.ManualIssues,
    0
  );
  successCriteria.forEach((item) => {
    const auditResult = auditResults.find(
      (result) => result.ref_id === item.ref_id
    );

    item.automatedIssues = auditResult?.AutomatedIssues || 0;
    item.manualIssues = auditResult?.ManualIssues || 0;
    item.percentageOfTotalIssues = Math.round(
      (((auditResult?.AutomatedIssues || 0) +
        (auditResult?.ManualIssues || 0)) /
        totalIssues) *
        100
    );
  });
  return successCriteria;
}

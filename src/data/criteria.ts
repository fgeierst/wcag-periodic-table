import wcag from "wcag-as-json/wcag.json";
import auditResults from "./auditResults.json";
import type { Wcag, SuccessCriteria } from "../wcag";
import axe from "axe-core";

export function getCriteria(): SuccessCriteria[] {
  const successCriteria = extractSuccessCriteria(wcag);
  const successCriteriaWithAuditResults = addAuditResults(
    successCriteria,
    auditResults.auditResultsDeque2021,
  );
  addAxeCoreData(successCriteriaWithAuditResults, axe.getRules([]));
  return successCriteriaWithAuditResults;
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
          special_cases: criteria.special_cases,
          references: criteria.references,
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
  auditResults: AuditResult[],
) {
  const totalIssues = auditResults.reduce(
    (total, result) => total + result.AutomatedIssues + result.ManualIssues,
    0,
  );
  successCriteria.forEach((item) => {
    const auditResult = auditResults.find(
      (result) => result.ref_id === item.ref_id,
    );

    item.automatedIssues = auditResult?.AutomatedIssues || 0;
    item.manualIssues = auditResult?.ManualIssues || 0;
    item.percentageOfTotalIssues =
      Math.round(
        (((auditResult?.AutomatedIssues || 0) +
          (auditResult?.ManualIssues || 0)) /
          totalIssues) *
          100 *
          100,
      ) / 100;
  });
  return successCriteria;
}

function addAxeCoreData(
  successCriteria: SuccessCriteria[],
  axeRules: axe.RuleMetadata[],
) {
  successCriteria.forEach((item) => {
    const matchingRules = axeRules.filter((rule) =>
      rule.tags.includes(`wcag${item.ref_id.replace(/\./g, "")}`),
    );
    if (matchingRules.length) {
      item.axeCoreRules = matchingRules;
    }
  });
}

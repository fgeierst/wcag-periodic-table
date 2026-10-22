import wcag21 from "./wcag-2.1.json";
import wcag22 from "./wcag-2.2.json";
import auditResults from "./auditResults.json";
import actRules from "./actRules.json";
import type { WcagVersion, SuccessCriteria, ActRule } from "../wcag";
import axe from "axe-core";
import { criterionPath } from "../utils/criterion-url";

const actRuleCatalogue = actRules as ActRule[];

export function getCriteria(version: WcagVersion = "2.2"): SuccessCriteria[] {
  const source = version === "2.2" ? wcag22 : wcag21;
  const sourceVersion = version === "2.2" ? "22" : "21";
  const successCriteria: SuccessCriteria[] = source.principles.flatMap(
    (principle) =>
      principle.guidelines.flatMap((guideline) =>
        guideline.successcriteria
          .filter((criterion) => criterion.versions.includes(version))
          .map((criterion) => ({
            ref_id: criterion.num,
            title: criterion.handle,
            description: criterion.title,
            content: criterion.content,
            version,
            versions: [...criterion.versions] as WcagVersion[],
            level: criterion.level,
            url: `https://www.w3.org/TR/WCAG${sourceVersion}/#${criterion.id}`,
            special_cases: criterion.details.flatMap((detail) =>
              detail.type === "ulist" && "items" in detail && detail.items
                ? detail.items.map((item) => ({
                    type: "exception",
                    title: "handle" in item ? item.handle : "",
                    description: item.text,
                  }))
                : detail.type === "p" && "text" in detail && detail.text
                  ? [{ type: "paragraph", title: "", description: detail.text }]
                  : [],
            ),
            notes: criterion.details.flatMap((detail) =>
              detail.type === "note" && "text" in detail && detail.text
                ? [{ content: detail.text }]
                : [],
            ),
            references: [
              {
                title: `How to Meet ${criterion.num}`,
                url: `https://www.w3.org/WAI/WCAG${sourceVersion}/quickref/#${criterion.id}`,
              },
              {
                title: `Understanding ${criterion.num}`,
                url: `https://www.w3.org/WAI/WCAG${sourceVersion}/Understanding/${criterion.id}.html`,
              },
            ],
          })),
      ),
  );
  const successCriteriaWithAuditResults = addAuditResults(
    successCriteria,
    auditResults.auditResultsDeque2021,
  );
  addAxeCoreData(successCriteriaWithAuditResults, axe.getRules([]));
  addActRuleData(successCriteriaWithAuditResults);
  return successCriteriaWithAuditResults;
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

function addActRuleData(successCriteria: SuccessCriteria[]) {
  successCriteria.forEach((item) => {
    const slug = criterionPath(item.title).split("/")[2];
    const matchingRules = actRuleCatalogue.filter((rule) =>
      rule.successCriteria.includes(slug),
    );
    if (matchingRules.length) {
      item.actRules = matchingRules.map((rule) => ({
        ...rule,
        successCriteria: [...rule.successCriteria],
      }));
    }
  });
}

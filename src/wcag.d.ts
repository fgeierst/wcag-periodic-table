export type WcagVersion = "2.0" | "2.1" | "2.2";
export interface ReferencesEntity {
  title: string;
  url: string;
}
export interface SuccessCriteria {
  version?: WcagVersion;
  versions?: WcagVersion[];
  content?: string;
  ref_id: string;
  title: string;
  description: string;
  url: string;
  level: string;
  special_cases?: SpecialCasesEntity[] | null;
  notes?: NotesEntity[] | null;
  references?: ReferencesEntity[] | null;
  automatedIssues?: number;
  manualIssues?: number;
  percentageOfTotalIssues?: number;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  axeCoreRules?: any;
  actRules?: ActRule[];
}
export interface ActRule {
  ruleId: string;
  ruleName: string;
  description: string;
  rulePage: string;
  successCriteria: string[];
  status: "approved" | "proposed" | "deprecated";
}
export interface SpecialCasesEntity {
  type: string;
  title: string;
  description?: string | null;
}
export interface NotesEntity {
  content: string;
}

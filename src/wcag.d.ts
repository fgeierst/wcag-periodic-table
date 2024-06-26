﻿export interface Wcag {
  ref_id: string;
  title: string;
  description: string;
  url: string;
  guidelines?: GuidelinesEntity[] | null;
}
export interface GuidelinesEntity {
  ref_id: string;
  title: string;
  description: string;
  url: string;
  references?: ReferencesEntity[] | null;
  success_criteria?: SuccessCriteria[] | null;
}
export interface ReferencesEntity {
  title: string;
  url: string;
}
export interface SuccessCriteria {
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
}
export interface SpecialCasesEntity {
  type: string;
  title: string;
  description?: string | null;
}
export interface NotesEntity {
  content: string;
}

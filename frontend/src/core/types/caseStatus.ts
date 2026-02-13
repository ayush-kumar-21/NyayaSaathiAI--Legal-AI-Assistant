// Types for Case Status Tracker - Skill 23

export type CaseStage =
    | 'fir_filed' | 'investigation' | 'chargesheet_filed'
    | 'trial_commenced' | 'evidence_stage' | 'arguments'
    | 'judgment_reserved' | 'judgment_delivered' | 'appeal' | 'disposed';

export interface HearingInfo {
    date: string;
    court: string;
    judge: string;
    purpose: string;
    result: string;
    next_date?: string;
}

export interface CaseStatusRequest {
    cnr_number?: string;
    fir_number?: string;
    case_type?: string;
    year?: number;
}

export interface CaseStatusResponse {
    id: string;
    cnr_number: string;
    case_title: string;
    case_type: string;
    court: string;
    judge: string;
    current_stage: CaseStage;
    stage_percentage: number;
    filing_date: string;
    next_hearing?: string;
    hearings: HearingInfo[];
    parties: { petitioner: string; respondent: string };
    status_summary: string;
    estimated_timeline: string;
    retrieved_at: string;
}

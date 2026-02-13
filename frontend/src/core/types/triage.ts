// Types for Case Intake Triage - Skill 18

export type UrgencyLevel = 'critical' | 'high' | 'medium' | 'low' | 'deferred';

export type CaseCategory =
    | 'bail' | 'remand' | 'anticipatory_bail' | 'quashing'
    | 'appeals' | 'civil' | 'family' | 'writ' | 'pil' | 'other';

export interface TriageFactor {
    factor: string;
    impact: 'increases_urgency' | 'decreases_urgency';
    weight: number;
    description: string;
}

export interface TriageRequest {
    case_id: string;
    case_title: string;
    filing_date?: string;
    offense_sections?: string[];
    case_type?: string;
    accused_in_custody?: boolean;
    custody_days?: number;
    statutory_deadline_days?: number;
    is_senior_citizen?: boolean;
    is_minor_involved?: boolean;
    is_woman_complainant?: boolean;
    brief_facts?: string;
}

export interface TriageResult {
    id: string;
    case_id: string;
    case_title: string;
    urgency_level: UrgencyLevel;
    urgency_score: number;
    category: CaseCategory;
    factors: TriageFactor[];
    recommended_bench: string;
    recommended_hearing_date: string;
    estimated_hearing_time: string;
    special_instructions: string[];
    statutory_alerts: string[];
    created_at: string;
}

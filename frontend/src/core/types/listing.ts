export type CaseType =
    | 'civil'
    | 'criminal'
    | 'writ'
    | 'appeal'
    | 'revision'
    | 'bail_application'
    | 'interlocutory';

export type CaseStage =
    | 'admission'
    | 'notice'
    | 'filing_of_documents'
    | 'interlocutory_arguments'
    | 'final_arguments'
    | 'judgment_reserved'
    | 'mention'
    | 'orders'
    | 'evidence';

export type CasePriority = 'urgent' | 'high' | 'normal' | 'low';
export type Urgency = 'Urgent' | 'High' | 'Normal' | 'Low';

export interface TimeSlot {
    slot_id?: number;
    start_time: string;
    end_time: string;
    duration_minutes: number;
}

export interface CaseListing {
    id: string;
    cino: string;
    case_number: string;
    title: string;
    case_type: CaseType | string;
    stage: CaseStage | string;
    priority: CasePriority;
    urgency: string; // "Normal", "High" etc matching backend default
    estimated_duration?: number;
    preferred_time?: string;
    judge_id?: string;
    court_id: string;
    last_listed_date?: string;
    adjournment_count: number;
    notes?: string;
}

export interface ScheduledSlot {
    slot_id: number;
    start_time: string;
    end_time: string;
    duration_minutes: number;
    case: CaseListing;
}

export interface OptimizedSchedule {
    date: string;
    court_id: string;
    judge_id: string;
    judge_name: string;
    total_cases: number;
    total_minutes_scheduled: number;
    utilization_percentage: number;
    schedule: ScheduledSlot[];
    unlisted_cases: CaseListing[];
    breaks: TimeSlot[];
}

export interface OptimizationRequest {
    court_id: string;
    judge_id: string;
    date: string;
    cases: CaseListing[];
    max_daily_minutes?: number;
}

export interface ListingCreate {
    case_number: string;
    title: string;
    case_type: CaseType;
    stage: CaseStage;
    priority?: CasePriority;
    court_id: string;
    judge_id?: string;
    notes?: string;
}

export interface ListingUpdate {
    title?: string;
    stage?: CaseStage;
    priority?: CasePriority;
    notes?: string;
}

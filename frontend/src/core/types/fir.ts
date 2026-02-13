export enum FIRStatus {
    DRAFT = 'draft',
    PENDING_REVIEW = 'pending_review',
    APPROVED = 'approved',
    FILED = 'filed',
    REJECTED = 'rejected'
}

export enum CrimeSeverity {
    MINOR = 'minor',
    MODERATE = 'moderate',
    SERIOUS = 'serious',
    HEINOUS = 'heinous'
}

export interface ExtractedEntity {
    entity_type: string;
    value: string;
    confidence: number;
    position?: { start: number; end: number };
}

export interface BNSSection {
    section_number: string;
    description: string;
    severity: CrimeSeverity;
    confidence: number;
    keywords_matched: string[];
    punishment_summary?: string;
    cognizable: boolean;
    bailable: boolean;
}

export interface FIRAnalysis {
    entities: ExtractedEntity[];
    bns_sections: BNSSection[];
    incident_summary: string;
    key_facts: string[];
    recommended_io?: string;
    priority_score: number;
}

export interface FIRCreateRequest {
    complaint_text: string;
    complainant_name: string;
    complainant_contact: string;
    police_station_id: string;
    incident_location?: string;
    incident_datetime?: string;
    supporting_docs?: string[];
}

export interface FIRResponse {
    fir_id: string;
    fir_number: string;
    status: FIRStatus;
    complaint_text: string;
    analysis: FIRAnalysis;
    draft_content: string;
    generated_at: string;
    reviewed_by?: string;
    reviewed_at?: string;
    confidence_score: number;
}

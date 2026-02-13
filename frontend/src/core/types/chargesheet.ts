export enum ChargeSheetStatus {
    DRAFT = "draft",
    PENDING_REVIEW = "pending_review",
    APPROVED = "approved",
    FILED = "filed"
}

export interface AccusedDetails {
    id: string;
    name: string;
    parentage: string;
    address: string;
    is_arrested: boolean;
    arrest_date?: string;
    remand_status: string;
}

export interface WitnessSummary {
    id: string;
    name: string;
    statement_summary: string;
    is_key_witness: boolean;
}

export interface EvidenceSummary {
    id: string;
    description: string;
    seizure_memo_ref: string;
}

export interface OffenseSection {
    act: string;
    section: string;
    description: string;
    is_bailable: boolean;
    max_punishment: string;
}

export interface ChargeSheet {
    id: string;
    fir_id: string;
    police_station: string;
    district: string;
    year: number;
    date_filed?: string;
    complainant_name: string;
    accused: AccusedDetails[];
    offenses: OffenseSection[];
    brief_facts: string;
    investigation_details: string;
    witnesses: WitnessSummary[];
    evidence_list: EvidenceSummary[];
    investigating_officer: string;
    status: ChargeSheetStatus;
    created_at: string;
    updated_at: string;
    metadata: Record<string, any>;
}

export interface ChargeSheetCreate {
    fir_id: string;
}

export interface ChargeSheetUpdate {
    brief_facts?: string;
    investigation_details?: string;
    offenses?: OffenseSection[];
    status?: ChargeSheetStatus;
    accused?: AccusedDetails[];
}

export enum ThreatLevel {
    CRITICAL = "critical",
    HIGH = "high",
    MODERATE = "moderate",
    LOW = "low"
}

export enum ProtectionStatus {
    ACTIVE = "active",
    RELOCATED = "relocated",
    COMPLETED = "completed",
    WITHDRAWN = "withdrawn",
    TERMINATED = "terminated"
}

export enum IdentityStatus {
    REVEALED = "revealed",
    CONCEALED = "concealed",
    ALIAS_ACTIVE = "alias_active"
}

export interface Witness {
    id: string;
    case_id: string;
    real_name?: string;
    date_of_birth?: string;
    contact_number?: string;
    address?: string;
    alias_name?: string;
    identity_status: IdentityStatus;
    threat_level: ThreatLevel;
    protection_status: ProtectionStatus;
    assigned_officer_id: string;
    risk_factors: string[];
    protection_measures: string[];
    next_check_in?: string;
    last_check_in?: string;
    metadata: Record<string, any>;
}

export interface WitnessCreate {
    case_id: string;
    real_name: string;
    date_of_birth: string;
    contact_number: string;
    address: string;
    threat_level: ThreatLevel;
    risk_factors: string[];
    protection_measures: string[];
}

export interface RiskAssessment {
    id: string;
    witness_id: string;
    assessed_by: string;
    assessment_date: string;
    threat_level: ThreatLevel;
    threat_source: string;
    evidence_of_threat?: string;
    recommended_measures: string[];
}

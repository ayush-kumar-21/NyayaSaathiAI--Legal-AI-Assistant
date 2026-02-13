// Registry Automator Types - Skill 19
// Matches backend/app/schemas/registry.py

export type DefectSeverity = 'critical' | 'major' | 'minor';

export type FilingType = 'writ_petition' | 'civil_suit' | 'criminal_case' | 'appeal';

export interface Defect {
    id: string;
    description: string;
    severity: DefectSeverity;
    section_reference?: string;
    suggestion?: string;
    location?: string;
}

export interface FeeBreakdown {
    base_fee: number;
    value_based_fee: number;
    additional_charges: number;
    total_fee: number;
    max_fee_applied: boolean;
}

export interface ScrutinyRequest {
    document_url: string;
    filing_type?: FilingType;
}

export interface ScrutinyResponse {
    filing_id: string;
    status: 'COMPLIANT' | 'DEFECTIVE';
    defect_count: number;
    defects_found: Defect[];
    ai_summary?: string;
}

export interface FeeCalculationRequest {
    filing_type: FilingType;
    value_in_dispute: number;
}

export interface FeeCalculationResponse {
    filing_type: FilingType;
    value_in_dispute: number;
    fee_breakdown: FeeBreakdown;
    applicable_rules: string[];
}

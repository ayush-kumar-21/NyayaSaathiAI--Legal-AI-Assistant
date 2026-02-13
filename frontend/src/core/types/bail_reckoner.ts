// Bail Reckoner Types - Skill 09
// Mirrors backend/app/schemas/bail_reckoner.py

export type RiskLevel = 'low' | 'medium' | 'high' | 'critical';
export type BailRecommendation = 'grant' | 'grant_with_conditions' | 'reject';

export interface RiskFactor {
    category: string;
    description: string;
    risk_level: RiskLevel;
    weight: number;
}

export interface BailReport {
    id: string;
    case_id: string;
    accused_id: string;
    accused_name: string;
    offenses: string[];
    is_bailable_offense: boolean;
    max_punishment_years: number;
    criminal_history_score: number;
    flight_risk_score: number;
    tampering_risk_score: number;
    overall_risk_score: number;
    risk_factors: RiskFactor[];
    recommendation: BailRecommendation;
    suggested_conditions: string[];
    created_at: string;
    metadata: Record<string, any>;
}

export interface BailAnalysisRequest {
    case_id: string;
    accused_id: string;
    offenses: string[];
    prior_convictions?: number;
    is_flight_risk?: boolean;
    is_witness_tampering_risk?: boolean;
}

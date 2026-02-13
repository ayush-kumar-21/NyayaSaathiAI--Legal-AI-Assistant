export enum SentenceType {
    IMPRISONMENT = "imprisonment",
    FINE = "fine",
    COMMUNITY_SERVICE = "community_service",
    PROBATION = "probation",
    DEATH_PENALTY = "death_penalty"
}

export enum FactorType {
    AGGRAVATING = "aggravating",
    MITIGATING = "mitigating"
}

export interface SentencingFactor {
    description: string;
    type: FactorType;
    weight: number;
}

export interface SentenceRange {
    min_years: number;
    max_years: number;
    fine_amount: number;
    type: SentenceType;
}

export interface SentencingReport {
    id: string;
    case_id: string;
    convict_id: string;
    convict_name: string;
    offenses: string[];
    statutory_min: SentenceRange;
    statutory_max: SentenceRange;
    aggravating_factors: SentencingFactor[];
    mitigating_factors: SentencingFactor[];
    recommended_sentence: SentenceRange;
    reasoning: string;
    precedents_cited: string[];
    created_at: string;
    metadata: Record<string, any>;
}

export interface SentencingRequest {
    case_id: string;
    convict_id: string;
    offenses: string[];
    age: number;
    prior_convictions: number;
    background_info: string;
}

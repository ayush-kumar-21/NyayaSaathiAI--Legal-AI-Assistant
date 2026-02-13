export enum PatternType {
    MODUS_OPERANDI = "modus_operandi",
    GEOSPATIAL = "geospatial",
    RECURRING_SUSPECT = "recurring_suspect",
    TEMPORAL = "temporal",
    FORENSIC_MATCH = "forensic_match",
    CYBER_SIGNATURE = "cyber_signature"
}

export enum LinkStrength {
    CONFIRMED = "confirmed",
    HIGH = "high",
    MEDIUM = "medium",
    LOW = "low"
}

export interface CrimeNode {
    id: string;
    type: string;
    label: string;
    metadata: Record<string, any>;
    // Visualization props
    x?: number;
    y?: number;
}

export interface CrimeLink {
    source: string;
    target: string;
    strength: LinkStrength;
    type: PatternType;
    description: string;
    confidence_score: number;
}

export interface CrimeGraph {
    nodes: CrimeNode[];
    links: CrimeLink[];
}

export interface PatternAlert {
    id: string;
    pattern_type: PatternType;
    title: string;
    description: string;
    linked_cases: string[];
    suspects_involved: string[];
    confidence_score: number;
    detected_at: string;
    recommended_action: string;
}

export interface CaseLinkResponse {
    case_id: string;
    graph: CrimeGraph;
    patterns: PatternAlert[];
    similar_cases: { id: string; similarity: number; reason: string }[];
}

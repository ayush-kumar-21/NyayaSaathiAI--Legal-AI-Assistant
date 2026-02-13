// Types for Know Your Rights - Skill 22

export type RightsCategory =
    | 'arrest' | 'bail' | 'fir' | 'search_seizure' | 'property'
    | 'consumer' | 'labour' | 'women' | 'children' | 'cyber' | 'rti' | 'general';

export interface RightInfo {
    title: string;
    description: string;
    legal_basis: string;
    key_points: string[];
    dos: string[];
    donts: string[];
}

export interface RightsQueryRequest {
    query: string;
    category?: RightsCategory;
    language?: string;
}

export interface RightsQueryResponse {
    id: string;
    query: string;
    category: RightsCategory;
    rights: RightInfo[];
    emergency_contacts: { name: string; number: string; type: string }[];
    related_sections: string[];
    disclaimer: string;
    generated_at: string;
}

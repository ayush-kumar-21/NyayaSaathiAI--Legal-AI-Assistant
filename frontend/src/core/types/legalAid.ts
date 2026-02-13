// Types for Legal Aid Finder - Skill 24

export type AidType = 'free_lawyer' | 'legal_clinic' | 'nalsa_scheme' | 'district_authority' | 'ngo' | 'pro_bono';
export type EligibilityStatus = 'eligible' | 'likely_eligible' | 'needs_verification' | 'not_eligible';

export interface LegalAidProvider {
    id: string;
    name: string;
    type: AidType;
    address: string;
    district: string;
    state: string;
    contact_phone: string;
    contact_email?: string;
    specialization: string[];
    languages: string[];
    availability: string;
    rating: number;
}

export interface LegalAidRequest {
    category: string;
    district: string;
    state?: string;
    annual_income?: number;
    is_sc_st?: boolean;
    is_woman?: boolean;
    is_minor?: boolean;
    is_disabled?: boolean;
    case_description?: string;
}

export interface LegalAidResponse {
    id: string;
    eligibility: EligibilityStatus;
    eligibility_reason: string;
    providers: LegalAidProvider[];
    nalsa_schemes: { name: string; description: string }[];
    helpline_numbers: { name: string; number: string; hours: string }[];
    application_steps: string[];
    documents_required: string[];
    generated_at: string;
}

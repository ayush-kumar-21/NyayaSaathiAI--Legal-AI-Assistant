// Types for Judgment Validator - Skill 21

export type ValidityStatus = 'valid' | 'needs_review' | 'critical_issues';
export type IssueCategory = 'citation' | 'procedural' | 'constitutional' | 'factual' | 'sentencing' | 'formatting';
export type IssueSeverity = 'critical' | 'warning' | 'info';

export interface ValidationIssue {
    id: string;
    category: IssueCategory;
    severity: IssueSeverity;
    title: string;
    description: string;
    location: string;
    suggestion: string;
    legal_reference?: string;
}

export interface JudgmentValidateRequest {
    case_id: string;
    judgment_text: string;
    judgment_type?: string;
    offense_sections?: string[];
}

export interface JudgmentValidateResponse {
    id: string;
    case_id: string;
    status: ValidityStatus;
    overall_score: number;
    issues: ValidationIssue[];
    issue_summary: Record<string, number>;
    strengths: string[];
    recommendation: string;
    validated_at: string;
}

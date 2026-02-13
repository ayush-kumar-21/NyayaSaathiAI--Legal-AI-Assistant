// Bench Memo Types - Skill 08
// Mirrors backend/app/schemas/bench_memo.py

export type MemoStatus = 'draft' | 'generated' | 'reviewed';

export interface CasePrecedent {
    title: string;
    citation: string;
    summary: string;
    relevance: string;
}

export interface LegalIssue {
    issue: string;
    rule_of_law: string;
    analysis: string;
    conclusion: string;
}

export interface BenchMemo {
    id: string;
    case_id: string;
    judge_id: string;
    case_summary: string;
    procedural_history: string;
    legal_issues: LegalIssue[];
    precedents: CasePrecedent[];
    recommended_ruling: string;
    status: MemoStatus;
    created_at: string;
    updated_at: string;
    metadata: Record<string, any>;
}

export interface GenerateMemoRequest {
    case_id: string;
    focus_area?: string;
}

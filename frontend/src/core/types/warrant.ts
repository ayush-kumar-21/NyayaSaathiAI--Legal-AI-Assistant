export enum WarrantStatus {
    PENDING = "pending",
    ISSUED = "issued",
    EXECUTED = "executed",
    RECALLED = "recalled",
    EXPIRED = "expired"
}

export enum WarrantType {
    ARREST = "arrest",
    SEARCH = "search",
    BENCH = "bench"
}

export interface Warrant {
    id: string;
    case_id: string;
    accused_name: string;
    warrant_type: WarrantType;
    status: WarrantStatus;
    issue_date: string;
    expiry_date?: string;
    issuing_authority: string;
    execution_notes?: string;
    metadata: Record<string, any>;
}

export interface WarrantIssueRequest {
    case_id: string;
    accused_name: string;
    warrant_type: WarrantType;
    issuing_authority: string;
    expiry_date?: string;
}

export interface WarrantUpdateRequest {
    status: WarrantStatus;
    execution_notes?: string;
}

export interface Transaction {
    id: string;
    date: string;
    amount: number;
    from_account: string;
    to_account: string;
    description: string;
    type: 'credit' | 'debit' | 'transfer' | 'cash_deposit' | 'cash_withdrawal' | 'foreign';
    channel: string;
    reference_no?: string;
}

export interface Account {
    account_number: string;
    account_holder: string;
    bank_name: string;
    account_type: string;
    risk_rating: 'critical' | 'high' | 'medium' | 'low';
}

export interface AnomalyAlert {
    id: string;
    type: string;
    risk_level: 'critical' | 'high' | 'medium' | 'low';
    title: string;
    description: string;
    affected_accounts: string[];
    amount_involved: number;
    evidence: Record<string, any>;
    detected_at: string;
    confidence_score: number;
}

export interface NetworkNode {
    id: string;
    label: string;
    type: string;
    risk_level: string;
    properties: Record<string, any>;
}

export interface NetworkEdge {
    source: string;
    target: string;
    weight: number;
    amount: number;
    transactions: number;
}

export interface FinancialNetwork {
    nodes: NetworkNode[];
    edges: NetworkEdge[];
}

export interface InvestigationLead {
    priority: number;
    title: string;
    description: string;
    recommended_action: string;
    accounts_to_investigate: string[];
    estimated_amount: number;
}

export interface FinancialAnalysisResponse {
    case_id: string;
    analysis_id: string;
    network: FinancialNetwork;
    anomalies: AnomalyAlert[];
    leads: InvestigationLead[];
    metrics: Record<string, any>;
    generated_at: string;
    summary: string;
}

export interface FinancialAnalysisRequest {
    case_id: string;
    transactions: Transaction[];
    accounts?: Account[];
    threshold_amount?: number;
}

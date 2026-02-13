export enum EvidenceType {
    DOCUMENT = "document",
    IMAGE = "image",
    VIDEO = "video",
    AUDIO = "audio",
    FORENSIC_REPORT = "forensic_report",
    PHYSICAL_ITEM_RECORD = "physical_item_record",
    OTHER = "other"
}

export enum EvidenceStatus {
    COLLECTED = "collected",
    SEALED = "sealed",
    ANALYZED = "analyzed",
    SUBMITTED_TO_COURT = "submitted_to_court",
    ARCHIVED = "archived",
    DISPOSED = "disposed"
}

export enum CustodyAction {
    COLLECTED = "collected",
    UPLOADED = "uploaded",
    ACCESSED = "accessed",
    TRANSFERRED = "transferred",
    SEALED = "sealed",
    UNSEALED = "unsealed",
    ANALYZED = "analyzed",
    CHECKED_OUT = "checked_out",
    CHECKED_IN = "checked_in"
}

export interface ChainOfCustodyEvent {
    id: string;
    evidence_id: string;
    timestamp: string;
    actor_id: string;
    actor_name: string;
    actor_role: string;
    action: CustodyAction;
    location: string;
    comments?: string;
    previous_hash: string;
    event_hash: string;
}

export interface Evidence {
    id: string;
    case_id: string;
    title: string;
    description: string;
    evidence_type: EvidenceType;
    file_url?: string;
    file_hash: string;
    file_size_bytes: number;
    collection_date: string;
    collection_location: string;
    collected_by: string;
    current_status: EvidenceStatus;
    custodian_id: string;
    tags: string[];
    metadata: Record<string, any>;
    is_tampered: boolean;
    blockchain_tx_id?: string;
}

export interface EvidenceCreate {
    case_id: string;
    title: string;
    description: string;
    evidence_type: EvidenceType;
    collection_location: string;
    collection_date?: string;
    tags: string[];
    metadata?: Record<string, any>;
}

export interface CustodyTransferRequest {
    evidence_id: string;
    to_user_id: string;
    to_user_name: string;
    location: string;
    comments: string;
    action: CustodyAction;
}

export interface EvidenceResponse {
    evidence: Evidence;
    chain_of_custody: ChainOfCustodyEvent[];
    integrity_status: "VERIFIED" | "TAMPERED" | "UNKNOWN";
}

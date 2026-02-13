export enum DocumentType {
    FIR = "fir",
    AFFIDAVIT = "affidavit",
    SUMMONS = "summons",
    PETITION = "petition",
    ORDER = "order",
    OTHER = "other"
}

export interface ScannedDocument {
    id: string;
    user_id: string;
    filename: string;
    file_url: string;
    extracted_text: string;
    detected_language: string;
    confidence_score: number;
    document_type: DocumentType;
    created_at: string;
    metadata: Record<string, any>;
}

export interface ScanRequest {
    filename: string;
    content_type: string;
    image_data?: string;
}

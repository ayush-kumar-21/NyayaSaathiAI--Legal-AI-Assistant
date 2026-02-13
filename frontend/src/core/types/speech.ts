export enum Language {
    HINDI = "hi",
    ENGLISH = "en",
    TAMIL = "ta",
    TELUGU = "te",
    BENGALI = "bn",
    GUJARATI = "gu",
    MARATHI = "mr"
}

export enum GrievanceStatus {
    RECORDED = "recorded",
    PROCESSING = "processing",
    SUBMITTED = "submitted"
}

export interface VoiceGrievance {
    id: string;
    user_id: string;
    audio_url: string;
    transcript: string;
    detected_language: Language;
    summary: string;
    category: string;
    status: GrievanceStatus;
    created_at: string;
    metadata: Record<string, any>;
}

export interface VoiceSubmissionRequest {
    audio_content_type: string;
    language_hint?: Language;
}

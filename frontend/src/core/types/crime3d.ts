export enum EvidenceMarkerType {
    WEAPON = "weapon",
    BLOOD = "blood",
    FINGERPRINT = "fingerprint",
    FOOTPRINT = "footprint",
    OTHER = "other"
}

export interface EvidenceMarker {
    id: string;
    type: EvidenceMarkerType;
    description: string;
    position_x: number;
    position_y: number;
    position_z: number;
    image_url?: string;
    collected_by?: string;
    timestamp: string;
}

export interface CrimeScene {
    id: string;
    case_id: string;
    location: string;
    date: string;
    description: string;
    markers: EvidenceMarker[];
    model_url?: string;
    metadata: Record<string, any>;
}

export interface CreateSceneRequest {
    case_id: string;
    location: string;
    date: string;
    description: string;
}

export interface AddMarkerRequest {
    type: EvidenceMarkerType;
    description: string;
    position_x: number;
    position_y: number;
    position_z: number;
}

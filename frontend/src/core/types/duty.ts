export enum ShiftType {
    MORNING = "morning",
    EVENING = "evening",
    NIGHT = "night"
}

export enum OfficerStatus {
    ON_DUTY = "on_duty",
    OFF_DUTY = "off_duty",
    LEAVE = "leave"
}

export interface DutyShift {
    id: string;
    officer_id: string;
    officer_name: string;
    shift_type: ShiftType;
    date: string;
    location: string;
    status: OfficerStatus;
    metadata: Record<string, any>;
}

export interface RosterGenerateRequest {
    start_date: string;
    end_date: string;
    station_id: string;
}

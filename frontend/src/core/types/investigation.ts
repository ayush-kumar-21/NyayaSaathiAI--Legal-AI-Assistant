export enum TaskStatus {
    PENDING = "pending",
    IN_PROGRESS = "in_progress",
    COMPLETED = "completed",
    BLOCKED = "blocked",
    DEFERRED = "deferred"
}

export enum TaskPriority {
    CRITICAL = "critical",
    HIGH = "high",
    MEDIUM = "medium",
    LOW = "low"
}

export interface InvestigationTask {
    id: string;
    plan_id: string;
    title: string;
    description: string;
    assigned_to?: string;
    due_date?: string;
    status: TaskStatus;
    priority: TaskPriority;
    completed_at?: string;
    notes: string[];
}

export interface InvestigationPlan {
    id: string;
    case_id: string;
    title: string;
    description: string;
    lead_officer: string;
    tasks: InvestigationTask[];
    created_at: string;
    updated_at: string;
    status: string;
    total_tasks: number;
    completed_tasks: number;
    progress_percentage: number;
}

export interface CreatePlanRequest {
    case_id: string;
    title: string;
    description?: string;
}

export interface CreateTaskRequest {
    plan_id: string;
    title: string;
    description: string;
    priority: TaskPriority;
    due_date?: string;
}

export interface UpdateTaskRequest {
    status?: TaskStatus;
    assigned_to?: string;
    notes?: string;
}

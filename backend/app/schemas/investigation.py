"""
Investigation Planner Schemas - Skill 07
Structured planning and task management for investigations
"""
from pydantic import BaseModel, Field
from typing import List, Optional, Dict, Any
from datetime import datetime, date
from enum import Enum


class TaskStatus(str, Enum):
    PENDING = "pending"
    IN_PROGRESS = "in_progress"
    COMPLETED = "completed"
    BLOCKED = "blocked"
    DEFERRED = "deferred"


class TaskPriority(str, Enum):
    CRITICAL = "critical"
    HIGH = "high"
    MEDIUM = "medium"
    LOW = "low"


class InvestigationTask(BaseModel):
    id: str
    plan_id: str
    title: str
    description: str
    assigned_to: Optional[str] = None  # Officer ID
    due_date: Optional[datetime] = None
    status: TaskStatus
    priority: TaskPriority
    completed_at: Optional[datetime] = None
    notes: List[str] = []


class InvestigationPlan(BaseModel):
    id: str
    case_id: str
    title: str
    description: str
    lead_officer: str
    tasks: List[InvestigationTask]
    created_at: datetime
    updated_at: datetime
    status: str  # active, completed, suspended
    
    # Progress Metrics
    total_tasks: int
    completed_tasks: int
    progress_percentage: float


class CreatePlanRequest(BaseModel):
    case_id: str
    title: str
    description: Optional[str] = "Standard Investigation Plan"


class CreateTaskRequest(BaseModel):
    plan_id: str
    title: str
    description: str
    priority: TaskPriority = TaskPriority.MEDIUM
    due_date: Optional[datetime] = None


class UpdateTaskRequest(BaseModel):
    status: Optional[TaskStatus] = None
    assigned_to: Optional[str] = None
    notes: Optional[str] = None

"""
Investigation Planner Service - Skill 07
Manages investigation timelines and tasks
"""
import uuid
from datetime import datetime
from typing import List, Optional, Dict
from app.schemas.investigation import (
    InvestigationPlan, InvestigationTask, 
    CreatePlanRequest, CreateTaskRequest, UpdateTaskRequest,
    TaskStatus, TaskPriority
)


class InvestigationPlannerService:
    """
    Service for planning and tracking investigations
    """
    
    def __init__(self):
        self.plans: Dict[str, InvestigationPlan] = {}
        self.tasks_map: Dict[str, InvestigationTask] = {}
        
    async def create_plan(self, request: CreatePlanRequest, user: dict) -> InvestigationPlan:
        """Initialize a new investigation plan"""
        plan_id = str(uuid.uuid4())
        
        plan = InvestigationPlan(
            id=plan_id,
            case_id=request.case_id,
            title=request.title,
            description=request.description,
            lead_officer=user.get("full_name", "Unknown Lead"),
            tasks=[],
            created_at=datetime.now(),
            updated_at=datetime.now(),
            status="active",
            total_tasks=0,
            completed_tasks=0,
            progress_percentage=0.0
        )
        
        # Add default tasks based on standard procedure
        self._add_default_tasks(plan)
        
        self.plans[plan_id] = plan
        return plan

    def _add_default_tasks(self, plan: InvestigationPlan):
        """Add standard operating procedure tasks"""
        default_templates = [
            ("Visit Crime Scene", "Secure and photograph the scene", TaskPriority.CRITICAL),
            ("Collect CCTV", "Retrieve footage from 500m radius", TaskPriority.HIGH),
            ("Witness Statements", "Identify and record statements", TaskPriority.HIGH),
            ("Forensic Analysis", "Send collected samples to lab", TaskPriority.MEDIUM),
        ]
        
        for title, desc, prio in default_templates:
            task_id = str(uuid.uuid4())
            task = InvestigationTask(
                id=task_id,
                plan_id=plan.id,
                title=title,
                description=desc,
                status=TaskStatus.PENDING,
                priority=prio,
                created_at=datetime.now()
            )
            plan.tasks.append(task)
            self.tasks_map[task_id] = task
            
        self._update_metrics(plan)

    async def get_plan_by_case(self, case_id: str) -> Optional[InvestigationPlan]:
        """Find plan for a specific case"""
        # Linear search for mock data
        for plan in self.plans.values():
            if plan.case_id == case_id:
                return plan
        return None

    async def add_task(self, request: CreateTaskRequest) -> InvestigationTask:
        """Add a custom task to the plan"""
        plan = self.plans.get(request.plan_id)
        if not plan:
            raise ValueError("Plan not found")
            
        task_id = str(uuid.uuid4())
        task = InvestigationTask(
            id=task_id,
            plan_id=request.plan_id,
            title=request.title,
            description=request.description,
            status=TaskStatus.PENDING,
            priority=request.priority,
            due_date=request.due_date
        )
        
        plan.tasks.append(task)
        self.tasks_map[task_id] = task
        self._update_metrics(plan)
        
        return task

    async def update_task(self, task_id: str, update: UpdateTaskRequest) -> InvestigationTask:
        """Update task status or details"""
        task = self.tasks_map.get(task_id)
        if not task:
            raise ValueError("Task not found")
        
        if update.status:
            task.status = update.status
            if update.status == TaskStatus.COMPLETED:
                task.completed_at = datetime.now()
                
        if update.assigned_to:
            task.assigned_to = update.assigned_to
            
        if update.notes:
            task.notes.append(f"{datetime.now().strftime('%Y-%m-%d %H:%M')}: {update.notes}")
            
        # Update parent plan metrics
        plan = self.plans.get(task.plan_id)
        if plan:
            self._update_metrics(plan)
            
        return task

    def _update_metrics(self, plan: InvestigationPlan):
        """Recalculate progress"""
        total = len(plan.tasks)
        if total == 0:
            plan.progress_percentage = 0.0
            return
            
        completed = len([t for t in plan.tasks if t.status == TaskStatus.COMPLETED])
        plan.total_tasks = total
        plan.completed_tasks = completed
        plan.progress_percentage = (completed / total) * 100
        plan.updated_at = datetime.now()


# Singleton
investigation_service = InvestigationPlannerService()

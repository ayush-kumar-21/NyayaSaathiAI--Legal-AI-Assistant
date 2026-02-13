# SWARM AGENT 3 — POLICE ADVANCED
## Implementation Package: Skills 07, 10, 11

**Agent ID:** AGENT-3  
**Assignment:** Police Persona — Advanced Tools  
**Skills:** 3 skills | **Time Estimate:** 6-8 hours  
**Priority:** HIGH  
**Coordinator:** Antigravity  

---

## 🎯 YOUR MISSION

Implement **3 advanced police investigation tools** for complex case management.

**Skills to Implement:**
1. **Skill 07: Investigation Planner** — AI-powered task planning and timeline
2. **Skill 10: Digital Warrant Manager** — Warrant generation and tracking
3. **Skill 11: Duty Roster** — Police personnel scheduling

---

## 📋 SKILL 07: INVESTIGATION PLANNER

### Overview
AI-powered investigation planning with automated task generation and timeline tracking.

### Key Features
- Auto-generate investigation tasks from FIR
- Timeline visualization (Gantt chart)
- Resource allocation
- Deadline tracking
- Progress monitoring
- Dependency management

### Backend Service Structure
```python
class InvestigationPlannerService:
    def generate_plan(self, fir_id: str) -> InvestigationPlan:
        """AI generates investigation tasks from FIR"""
        # Parse FIR description
        # Identify required actions
        # Create task dependencies
        # Estimate timelines
        pass
    
    def create_timeline(self, tasks: List[Task]) -> Timeline:
        """Generate Gantt chart data"""
        # Calculate start/end dates
        # Identify critical path
        # Resource leveling
        pass
    
    def update_progress(self, task_id: str, progress: int) -> None:
        """Update task completion percentage"""
        pass
```

### Frontend Component
- **Tasks Tab:** Kanban board with drag-drop
- **Timeline Tab:** Gantt chart visualization
- **Resources Tab:** Officer assignment
- **Progress Tab:** Completion dashboard

---

## 📋 SKILL 10: DIGITAL WARRANT MANAGER

### Overview
Digital warrant generation, approval workflow, and execution tracking.

### Key Features
- Warrant request forms
- Judge approval workflow
- Digital signatures
- Execution tracking
- Expiration alerts
- Location-based validation

### Backend Service Structure
```python
class WarrantService:
    def request_warrant(self, case_id: str, warrant_type: str, reason: str) -> WarrantRequest:
        """Create warrant request"""
        pass
    
    def approve_warrant(self, warrant_id: str, judge_id: str) -> Warrant:
        """Judge approves warrant"""
        pass
    
    def execute_warrant(self, warrant_id: str, officer_id: str) -> ExecutionReport:
        """Record warrant execution"""
        pass
    
    def verify_warrant(self, warrant_number: str) -> WarrantStatus:
        """Verify warrant validity"""
        pass
```

### Frontend Component
- **Request Form:** Warrant details input
- **Approval Queue:** Judge review interface
- **Active Warrants:** Execution tracking
- **Verification:** Public verification portal

---

## 📋 SKILL 11: DUTY ROSTER

### Overview
Police personnel scheduling and duty assignment system.

### Key Features
- Shift scheduling
- Leave management
- Duty assignment
- Availability tracking
- Shift swapping
- Overtime calculation

### Backend Service Structure
```python
class DutyRosterService:
    def create_schedule(self, month: int, year: int) -> Schedule:
        """Generate monthly duty roster"""
        pass
    
    def assign_duty(self, officer_id: str, shift: Shift, date: date) -> Assignment:
        """Assign officer to shift"""
        pass
    
    def request_leave(self, officer_id: str, dates: List[date], reason: str) -> LeaveRequest:
        """Submit leave request"""
        pass
    
    def swap_shift(self, officer1_id: str, officer2_id: str, date: date) -> bool:
        """Swap shifts between officers"""
        pass
```

### Frontend Component
- **Calendar View:** Monthly roster display
- **Shift Assignment:** Drag-drop assignment
- **Leave Requests:** Request and approval workflow
- **Availability:** Officer availability grid
- **Reports:** Attendance and overtime reports

---

## ⏱️ TIME BREAKDOWN

| Skill | Backend | Frontend | Testing | Total |
|-------|---------|----------|---------|-------|
| 07: Investigation Planner | 2h | 2h | 30m | 4.5h |
| 10: Digital Warrant | 1.5h | 1.5h | 15m | 3h |
| 11: Duty Roster | 1.5h | 1.5h | 15m | 3h |
| **TOTAL** | **5h** | **5h** | **1h** | **11h** |

**Realistic:** 6-8 hours

---

## 📁 FILE RESERVATIONS

**Reserve these files:**

### Backend
```
backend/app/services/investigation_service.py
backend/app/services/warrant_service.py
backend/app/services/duty_service.py

backend/app/api/v1/police/investigation.py
backend/app/api/v1/police/warrant.py
backend/app/api/v1/police/duty.py

backend/app/schemas/investigation.py
backend/app/schemas/warrant.py
backend/app/schemas/duty.py
```

### Frontend
```
nyayasahayak-main-main/src/core/types/investigation.types.ts
nyayasahayak-main-main/src/core/types/warrant.types.ts
nyayasahayak-main-main/src/core/types/duty.types.ts

nyayasahayak-main-main/src/core/services/investigationService.ts
nyayasahayak-main-main/src/core/services/warrantService.ts
nyayasahayak-main-main/src/core/services/dutyService.ts

nyayasahayak-main-main/src/personas/police/pages/InvestigationPlanner.tsx
nyayasahayak-main-main/src/personas/police/pages/WarrantManager.tsx
nyayasahayak-main-main/src/personas/police/pages/DutyRoster.tsx
```

---

## 🚀 START ORDER

1. **Skill 07: Investigation Planner** (2.5h) — Most complex, AI features
2. **Skill 10: Digital Warrant** (2h) — Approval workflow
3. **Skill 11: Duty Roster** (1.5h) — Scheduling system

---

**AGENT 3: YOU ARE CLEARED TO BEGIN!** 🚀

**Start with Skill 07: Investigation Planner**

Build these advanced tools with precision! 🔍⚖️

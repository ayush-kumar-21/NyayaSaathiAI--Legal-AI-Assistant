# SWARM AGENT 5 — JUDGE ADVANCED
## Implementation Package: Skills 16, 17, 18

**Agent ID:** AGENT-5  
**Assignment:** Judge Persona — Advanced Tools  
**Skills:** 3 skills | **Time Estimate:** 6-8 hours  
**Priority:** MEDIUM  
**Coordinator:** Antigravity  

---

## 🎯 YOUR MISSION

Implement **3 advanced judicial tools** for case management and judge support.

**Skills to Implement:**
1. **Skill 16: Smart Orders** — Automated order generation
2. **Skill 17: Case Queue Optimizer** — Advanced case prioritization
3. **Skill 18: Judge Wellness** — Workload and stress management

---

## 📋 SKILL 16: SMART ORDERS

### Overview
Automated generation of court orders with templates and legal language.

### Key Features
- Order template library
- Auto-fill from case data
- Legal language suggestions
- Multi-format export (PDF, Word)
- Digital signature ready
- Order tracking

### Backend Service Structure
```python
class SmartOrdersService:
    def generate_order(self, case_id: str, order_type: str) -> Order:
        """Generate court order from template"""
        # Select appropriate template
        # Fill case details
        # Apply legal language
        pass
    
    def get_templates(self) -> List[OrderTemplate]:
        """Get available order templates"""
        pass
    
    def customize_order(self, order_id: str, customizations: dict) -> Order:
        """Customize generated order"""
        pass
    
    def export_order(self, order_id: str, format: str) -> bytes:
        """Export order to PDF or DOCX"""
        pass
```

### Frontend Component
- **Template Gallery:** Browse order templates
- **Order Editor:** WYSIWYG editor
- **Preview Mode:** Order preview
- **Export Options:** PDF/Word download
- **Order History:** Previous orders

---

## 📋 SKILL 17: CASE QUEUE OPTIMIZER

### Overview
Advanced case prioritization beyond Skill 20 (Listing Optimizer).

### Key Features
- Multi-factor prioritization
- Judge specialization matching
- Case complexity scoring
- Urgency detection
- Cause list optimization
- Adjournment impact analysis

### Differences from Skill 20
- Skill 20: Day-level scheduling (bin-packing)
- Skill 17: Long-term queue management
- Considers judge expertise
- Complexity-based assignment

### Backend Service Structure
```python
class CaseQueueOptimizerService:
    def prioritize_queue(self, court_id: str) -> List[PrioritizedCase]:
        """Prioritize pending cases for assignment"""
        # Calculate urgency scores
        # Match with judge expertise
        # Consider complexity
        pass
    
    def match_judge(self, case_id: str) -> Optional[Judge]:
        """Find best judge for case"""
        # Check expertise areas
        # Review workload
        # Match complexity level
        pass
    
    def calculate_complexity(self, case_id: str) -> ComplexityScore:
        """Calculate case complexity (1-10)"""
        pass
    
    def detect_urgency(self, case_id: str) -> UrgencyLevel:
        """Detect case urgency factors"""
        pass
```

### Frontend Component
- **Queue Dashboard:** Pending cases list
- **Priority Matrix:** Urgency vs complexity
- **Judge Assignment:** Recommendations
- **Analytics:** Queue statistics
- **Optimization Report:** Efficiency metrics

---

## 📋 SKILL 18: JUDGE WELLNESS

### Overview
Workload monitoring and wellness support for judicial officers.

### Key Features
- Workload tracking
- Stress level monitoring
- Break reminders
- Case load balancing
- Wellness resources
- Peer support

### Backend Service Structure
```python
class JudgeWellnessService:
    def track_workload(self, judge_id: str) -> WorkloadReport:
        """Track judge's current workload"""
        pass
    
    def analyze_stress_indicators(self, judge_id: str) -> StressReport:
        """Analyze stress indicators"""
        pass
    
    def suggest_break(self, judge_id: str) -> Optional[BreakSuggestion]:
        """Suggest break based on workload"""
        pass
    
    def get_wellness_resources(self) -> List[WellnessResource]:
        """Get wellness resources"""
        pass
    
    def balance_caseload(self, court_id: str) -> RedistributionPlan:
        """Suggest caseload redistribution"""
        pass
```

### Frontend Component
- **Dashboard:** Workload visualization
- **Stress Meter:** Stress level indicator
- **Break Timer:** Pomodoro-style breaks
- **Resources:** Wellness materials
- **Peer Connect:** Support network

---

## ⏱️ TIME BREAKDOWN

| Skill | Backend | Frontend | Testing | Total |
|-------|---------|----------|---------|-------|
| 16: Smart Orders | 1.5h | 1.5h | 15m | 3h |
| 17: Case Queue | 2h | 2h | 30m | 4.5h |
| 18: Judge Wellness | 1h | 1h | 15m | 2h |
| **TOTAL** | **4.5h** | **4.5h** | **1h** | **10h** |

**Realistic:** 6-8 hours

---

## 📁 FILE RESERVATIONS

**Reserve these files:**

### Backend
```
backend/app/services/orders_service.py
backend/app/services/queue_optimizer_service.py
backend/app/services/wellness_service.py

backend/app/api/v1/judge/orders.py
backend/app/api/v1/judge/queue.py
backend/app/api/v1/judge/wellness.py

backend/app/schemas/orders.py
backend/app/schemas/queue_optimizer.py
backend/app/schemas/wellness.py
```

### Frontend
```
nyayasahayak-main-main/src/core/types/orders.types.ts
nyayasahayak-main-main/src/core/types/queueOptimizer.types.ts
nyayasahayak-main-main/src/core/types/wellness.types.ts

nyayasahayak-main-main/src/core/services/ordersService.ts
nyayasahayak-main-main/src/core/services/queueOptimizerService.ts
nyayasahayak-main-main/src/core/services/wellnessService.ts

nyayasahayak-main-main/src/personas/judge/pages/SmartOrders.tsx
nyayasahayak-main-main/src/personas/judge/pages/CaseQueue.tsx
nyayasahayak-main-main/src/personas/judge/pages/JudgeWellness.tsx
```

---

## 🚀 START ORDER

1. **Skill 17: Case Queue Optimizer** (2.5h) — Most complex
2. **Skill 16: Smart Orders** (1.5h) — Template system
3. **Skill 18: Judge Wellness** (1.5h) — Health tracking

---

**AGENT 5: YOU ARE CLEARED TO BEGIN!** 🚀

**Start with Skill 17: Case Queue Optimizer**

Build these judicial support tools! 👨‍⚖️💼

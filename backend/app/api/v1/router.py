from fastapi import APIRouter
from app.api.v1.admin import listing, registry
from app.api.v1.endpoints import (
    police, financial, evidence, witness, case_linker, chargesheet,
    investigation, bench_memo, bail_reckoner, sentencing, scanner,
    speech, chat, duty, warrant, crime3d,
    triage, judgment, rights, case_status, legal_aid, feedback, auth, audit,
    escalation,
)

api_router = APIRouter()

# Skill 19: Registry Automator
api_router.include_router(registry.router, prefix="/admin", tags=["registry"])

# Skill 20: Listing Optimizer
api_router.include_router(listing.router, prefix="/admin", tags=["listing"])

# Skill 01: Smart-FIR Generator
api_router.include_router(police.router, prefix="/police", tags=["police"])

# Skill 02: Financial Trail Analyzer
api_router.include_router(financial.router, prefix="/police", tags=["financial"])

# Skill 03: Evidence Locker (Sakshya)
api_router.include_router(evidence.router, prefix="/police", tags=["evidence"])

# Skill 04: Witness Protection (Rakshak)
api_router.include_router(witness.router, prefix="/police", tags=["witness"])

# Skill 05: Case Linker & Pattern Detection
api_router.include_router(case_linker.router, prefix="/police", tags=["case-linker"])

# Skill 06: Charge Sheet Builder (Rakshak)
api_router.include_router(chargesheet.router, prefix="/police", tags=["chargesheet"])

# Skill 07: Investigation Planner (Rakshak)
api_router.include_router(investigation.router, prefix="/police", tags=["investigation"])

# Skill 08: Bench Memo Generator (Nyaya Mitra)
api_router.include_router(bench_memo.router, prefix="/judge", tags=["bench-memo"])

# Skill 09: Bail Reckoner (Nyaya Mitra)
api_router.include_router(bail_reckoner.router, prefix="/judge", tags=["bail-reckoner"])

# Skill 10: Sentencing Assistant (Nyaya Mitra)
api_router.include_router(sentencing.router, prefix="/judge", tags=["sentencing"])

# Skill 11: Document Scanner (Nyaya Setu)
api_router.include_router(scanner.router, prefix="/citizen", tags=["scanner"])

# Skill 12: Multilingual Speech-to-Text (Nyaya Setu)
api_router.include_router(speech.router, prefix="/citizen", tags=["voice-grievance"])

# Skill 14: Secure Chat (Nyaya Setu)
api_router.include_router(chat.router, prefix="/citizen", tags=["secure-chat"])

# Skill 15: Duty Roster (Nyaya Rakshak)
api_router.include_router(duty.router, prefix="/police", tags=["duty-roster"])

# Skill 16: Warrant Manager (Nyaya Rakshak)
api_router.include_router(warrant.router, prefix="/police", tags=["warrant-manager"])

# Skill 17: Crime Scene 3D (Nyaya Rakshak)
api_router.include_router(crime3d.router, prefix="/police", tags=["crime-scene-3d"])

# Skill 18: Case Intake Triage (Nyaya Mitra)
api_router.include_router(triage.router, prefix="/judge", tags=["case-triage"])

# Skill 21: Judgment Validator (Nyaya Mitra)
api_router.include_router(judgment.router, prefix="/judge", tags=["judgment-validator"])

# Skill 22: Know Your Rights (Nyaya Setu)
api_router.include_router(rights.router, prefix="/citizen", tags=["know-your-rights"])

# Skill 23: Case Status Tracker (Nyaya Setu)
api_router.include_router(case_status.router, prefix="/citizen", tags=["case-status"])

# Skill 24: Legal Aid Finder (Nyaya Setu)
# Skill 24: Legal Aid Finder (Nyaya Setu)
api_router.include_router(legal_aid.router, prefix="/citizen", tags=["legal-aid"])

# Feedback System (Global)
api_router.include_router(feedback.router, prefix="/citizen/feedback", tags=["feedback"])

# Authentication
api_router.include_router(auth.router, prefix="/auth", tags=["auth"])

# Audit Logging (Admin only)
api_router.include_router(audit.router, prefix="/audit", tags=["audit"])

# Case Escalation Pipeline
api_router.include_router(escalation.router, prefix="/escalation", tags=["escalation"])


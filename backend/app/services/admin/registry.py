"""
Expert Implementation: Registry Automator (Skill 19)
Optimization: Rule Engine for Document Scrutiny
"""
from typing import List, Dict, Any, Callable
from pydantic import BaseModel
from datetime import datetime

from app.core.architecture import BaseService, InMemoryRepository, IRepository

# --- Domain Models ---

class RegistryDocument(BaseModel):
    id: str
    case_type: str
    metadata: Dict[str, Any]
    file_size_mb: float
    format: str

class ScrutinyResult(BaseModel):
    document_id: str
    status: str # COMPLIANT, DEFECTIVE
    defects: List[str]
    timestamp: datetime

# --- Service Implementation ---

class ScrutinyEngine:
    """Pluggable Rule Engine"""
    def __init__(self):
        self.rules: List[Callable[[RegistryDocument], str]] = []
        
    def add_rule(self, rule: Callable):
        self.rules.append(rule)
        
    def validate(self, doc: RegistryDocument) -> List[str]:
        defects = []
        for rule in self.rules:
            result = rule(doc)
            if result:
                defects.append(result)
        return defects

# Standard Rules
def rule_file_size(doc: RegistryDocument) -> str:
    limit = 50.0 # MB
    if doc.file_size_mb > limit:
        return f"File size exceeds limit ({doc.file_size_mb}MB > {limit}MB)"
    return ""

def rule_format(doc: RegistryDocument) -> str:
    allowed = ["pdf", "xml"]
    if doc.format.lower() not in allowed:
        return f"Invalid format '{doc.format}'. Allowed: {allowed}"
    return ""

def rule_metadata(doc: RegistryDocument) -> str:
    required = ["petitioner", "respondent", "court_fee_paid"]
    missing = [k for k in required if k not in doc.metadata]
    if missing:
        return f"Missing required metadata: {missing}"
    return ""

class RegistryService(BaseService[ScrutinyResult, str]):
    def __init__(self, repo: IRepository[ScrutinyResult, str]):
        super().__init__(repo)
        self.engine = ScrutinyEngine()
        self.engine.add_rule(rule_file_size)
        self.engine.add_rule(rule_format)
        self.engine.add_rule(rule_metadata)
        
    async def scrutinize_document(self, doc: RegistryDocument) -> ScrutinyResult:
        defects = self.engine.validate(doc)
        
        result = ScrutinyResult(
            document_id=doc.id,
            status="DEFECTIVE" if defects else "COMPLIANT",
            defects=defects,
            timestamp=datetime.now()
        )
        
        return await self.create(result)

# Factory
def get_registry_service() -> RegistryService:
    repo = InMemoryRepository[ScrutinyResult, str]()
    return RegistryService(repo)

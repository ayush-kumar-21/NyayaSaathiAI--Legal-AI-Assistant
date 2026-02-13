"""
Financial Trail Analyzer Schemas - Skill 02
Network analysis for financial crime detection
"""
from pydantic import BaseModel, Field
from typing import List, Optional, Dict, Any
from datetime import datetime, date
from enum import Enum


class TransactionType(str, Enum):
    CREDIT = "credit"
    DEBIT = "debit"
    TRANSFER = "transfer"
    CASH_DEPOSIT = "cash_deposit"
    CASH_WITHDRAWAL = "cash_withdrawal"
    FOREIGN = "foreign"


class AnomalyType(str, Enum):
    CIRCULAR_TRADING = "circular_trading"
    LAYERING = "layering"
    STRUCTURING = "structuring"
    HIGH_VALUE = "high_value"
    RAPID_SUCCESSION = "rapid_succession"
    UNUSUAL_HOURS = "unusual_hours"
    SHELL_COMPANY = "shell_company"
    PEP_INVOLVED = "pep_involved"
    SANCTIONED_ENTITY = "sanctioned_entity"


class RiskLevel(str, Enum):
    CRITICAL = "critical"
    HIGH = "high"
    MEDIUM = "medium"
    LOW = "low"


class Transaction(BaseModel):
    id: str
    date: datetime
    amount: float = Field(..., gt=0)
    from_account: str
    to_account: str
    description: str
    type: TransactionType
    channel: str  # NEFT, RTGS, IMPS, Cash, etc.
    reference_no: Optional[str] = None
    latitude: Optional[float] = None
    longitude: Optional[float] = None
    device_id: Optional[str] = None


class Account(BaseModel):
    account_number: str
    account_holder: str
    bank_name: str
    account_type: str  # savings, current, loan
    opening_date: Optional[date] = None
    kyc_status: bool = True
    risk_rating: RiskLevel = RiskLevel.LOW
    pep_associated: bool = False


class AnomalyAlert(BaseModel):
    id: str
    type: AnomalyType
    risk_level: RiskLevel
    title: str
    description: str
    affected_accounts: List[str]
    amount_involved: float
    evidence: Dict[str, Any]
    detected_at: datetime
    confidence_score: float = Field(..., ge=0.0, le=1.0)


class NetworkNode(BaseModel):
    id: str
    label: str
    type: str  # account, person, company
    risk_level: RiskLevel
    properties: Dict[str, Any]


class NetworkEdge(BaseModel):
    source: str
    target: str
    weight: float
    transactions: int
    total_amount: float
    first_transaction: datetime
    last_transaction: datetime


class FinancialNetwork(BaseModel):
    nodes: List[NetworkNode]
    edges: List[NetworkEdge]


class InvestigationLead(BaseModel):
    priority: int = Field(..., ge=1, le=10)
    title: str
    description: str
    recommended_action: str
    accounts_to_investigate: List[str]
    estimated_amount: float


class FinancialAnalysisRequest(BaseModel):
    case_id: str
    transactions: List[Transaction]
    accounts: Optional[List[Account]] = []
    investigation_period_days: int = 90
    threshold_amount: float = 100000.0
    focus_areas: Optional[List[str]] = []


class FinancialAnalysisResponse(BaseModel):
    case_id: str
    analysis_id: str
    network: FinancialNetwork
    anomalies: List[AnomalyAlert]
    leads: List[InvestigationLead]
    metrics: Dict[str, Any]
    generated_at: datetime
    summary: str


class TransactionPattern(BaseModel):
    pattern_type: str
    frequency: int
    average_amount: float
    total_amount: float
    accounts_involved: List[str]
    time_span_days: int

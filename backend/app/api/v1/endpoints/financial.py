"""
Financial Analysis API - Skill 02
Expert Implementation using Graph Algorithms
"""
from fastapi import APIRouter, Depends, HTTPException, status
from typing import List
from datetime import datetime, timedelta

from app.schemas.financial import (
    FinancialAnalysisRequest, FinancialAnalysisResponse,
    Transaction, Account, AnomalyAlert
)
# UPDATED: Import the EXPERT service factory
from app.services.police.financial import get_financial_service, FinancialService
from app.core.security import get_current_admin_user

router = APIRouter() # Prefix handled in router.py

@router.post("/analyze", response_model=FinancialAnalysisResponse)
async def analyze_financial_trail(
    request: FinancialAnalysisRequest,
    service: FinancialService = Depends(get_financial_service),
    current_user = Depends(get_current_admin_user)
):
    """
    Analyze financial transaction trail for suspicious patterns (Skill 02)
    
    Detects:
    - Circular trading (Graph Cycles)
    - Money layering
    - Structuring/smurfing
    - Shell companies
    """
    try:
        return await service.analyze(request)
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Analysis failed: {str(e)}"
        )

@router.post("/test-analyze")
async def test_financial_analysis(
    service: FinancialService = Depends(get_financial_service),
    current_user = Depends(get_current_admin_user)
):
    """Test with sample transaction data"""
    test_transactions = [
        Transaction(
            id="txn-001",
            date=datetime.now() - timedelta(days=5),
            amount=95000,
            from_account="ACC-001",
            to_account="ACC-002",
            description="Transfer",
            type="transfer",
            channel="NEFT"
        ),
        Transaction(
            id="txn-002",
            date=datetime.now() - timedelta(days=5, hours=1),
            amount=98000,
            from_account="ACC-001",
            to_account="ACC-003",
            description="Transfer",
            type="transfer",
            channel="NEFT"
        ),
        Transaction(
            id="txn-003",
            date=datetime.now() - timedelta(days=4),
            amount=150000,
            from_account="ACC-002",
            to_account="ACC-004",
            description="Business payment",
            type="transfer",
            channel="RTGS"
        ),
        Transaction(
            id="txn-004",
            date=datetime.now() - timedelta(days=3),
            amount=140000,
            from_account="ACC-003",
            to_account="ACC-004",
            description="Consulting fee",
            type="transfer",
            channel="NEFT"
        ),
        Transaction(
            id="txn-005",
            date=datetime.now() - timedelta(days=2),
            amount=280000,
            from_account="ACC-004",
            to_account="ACC-001",
            description="Return payment",
            type="transfer",
            channel="RTGS"
        ),
    ]
    
    test_accounts = [
        Account(account_number="ACC-001", account_holder="Rahul Sharma", bank_name="SBI", account_type="savings"),
        Account(account_number="ACC-002", account_holder="Global Traders", bank_name="ICICI", account_type="current"),
        Account(account_number="ACC-003", account_holder="ABC Enterprises", bank_name="HDFC", account_type="current"),
        Account(account_number="ACC-004", account_holder="XYZ Consultants", bank_name="Axis", account_type="current"),
    ]
    
    request = FinancialAnalysisRequest(
        case_id="CASE-2025-001",
        transactions=test_transactions,
        accounts=test_accounts,
        threshold_amount=100000
    )
    
    return await service.analyze(request)

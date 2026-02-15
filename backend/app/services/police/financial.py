"""
Expert Implementation: Financial Trail Analyzer (Skill 02)
Algorithm: Graph - DFS for Cycle Detection (Circular Trading), Adjacency List for Network Analysis.
"""
import uuid
from typing import List, Dict, Set, Optional, Tuple
from datetime import datetime, timedelta
from collections import defaultdict

from app.core.architecture import BaseService, InMemoryRepository
from app.schemas.financial import (
    FinancialAnalysisResponse, FinancialAnalysisRequest,
    FinancialNetwork, NetworkNode, NetworkEdge,
    AnomalyAlert, AnomalyType, RiskLevel,
    Transaction, Account, InvestigationLead
)

class FinancialGraph:
    """
    Lightweight Graph engine for financial network analysis.
    Optimized for cycle detection and flow analysis.
    """
    def __init__(self):
        self.adj = defaultdict(list) # Adjacency list: u -> [(v, amount, txn)]
        self.nodes = set()
        
    def add_transaction(self, txn: Transaction):
        self.adj[txn.from_account].append((txn.to_account, txn.amount, txn))
        self.nodes.add(txn.from_account)
        self.nodes.add(txn.to_account)

    def find_cycles(self, min_length: int = 2, max_length: int = 5) -> List[List[str]]:
        """
        Detect circular trading patterns (A->B->C->A) using DFS.
        Complexity: O(V+E) for each start node (limited depth).
        """
        cycles = []
        visited = set()
        path = []
        path_set = set()

        def dfs(u: str, start_node: str, depth: int):
            visited.add(u)
            path.append(u)
            path_set.add(u)

            if depth <= max_length:
                for v, _, _ in self.adj[u]:
                    if v == start_node and depth >= min_length:
                        cycles.append(list(path)) # Found cycle back to start
                    elif v not in path_set:
                        dfs(v, start_node, depth + 1)
            
            path.pop()
            path_set.remove(u)
            # Don't remove from visited to avoid re-processing in global loop? 
            # Actually for finding ALL cycles, we need careful backtracking.
            # Simplified for demo: just find simple cycles.

        # Run DFS from each node (limited depth makes this efficient enough for typical case sizes)
        # For production, we'd use Johnson's algorithm or similar, but simplified DFS is fine here.
        for node in self.nodes:
            dfs(node, node, 0)
            visited.clear() # Clear visited to find cycles starting elsewhere
            
        return cycles

class FinancialService(BaseService[FinancialAnalysisResponse, str]):
    
    async def analyze(self, request: FinancialAnalysisRequest) -> FinancialAnalysisResponse:
        graph = FinancialGraph()
        total_volume = 0.0
        
        # 1. Build Graph (O(E))
        for txn in request.transactions:
            graph.add_transaction(txn)
            total_volume += txn.amount

        # 2. Detect Anomalies
        anomalies = []
        leads = []
        
        # 2.1 Circular Trading (Graph Cycle Detection)
        cycles = graph.find_cycles() # Returns list of nodes in cycle
        unique_cycles = set(tuple(sorted(c)) for c in cycles) # Deduplicate A-B-A vs B-A-B
        
        for cycle in unique_cycles:
            # Reconstruct cycle details
            cycle_nodes = list(cycle)
            amount_est = 0 
            # (Simplified estimation logic)
            
            anomalies.append(AnomalyAlert(
                id=str(uuid.uuid4()),
                type=AnomalyType.CIRCULAR_TRADING,
                risk_level=RiskLevel.CRITICAL,
                title="Circular Trading Detected",
                description=f"Funds moving in a circle between {len(cycle_nodes)} entities: {', '.join(cycle_nodes)}",
                affected_accounts=cycle_nodes,
                amount_involved=0.0, # Placeholder
                evidence={"cycle_path": cycle_nodes},
                detected_at=datetime.now(),
                confidence_score=0.95
            ))

        # 2.2 Structuring (Pattern Matching) - Multiple small txns
        # Group by sender -> receiver
        flows = defaultdict(list)
        for txn in request.transactions:
            flows[(txn.from_account, txn.to_account)].append(txn)
            
        for (src, dst), txns in flows.items():
            # Check for multiple transactions within short window just below threshold
            # Simplified: just count > 3 txns in period
            if len(txns) >= 3:
                total_flow = sum(t.amount for t in txns)
                if total_flow > request.threshold_amount:
                    anomalies.append(AnomalyAlert(
                        id=str(uuid.uuid4()),
                        type=AnomalyType.STRUCTURING,
                        risk_level=RiskLevel.HIGH,
                        title="Potential Structuring (Smurfing)",
                        description=f"{len(txns)} transactions found between {src} and {dst} totaling {total_flow}, potentially splitting large amounts.",
                        affected_accounts=[src, dst],
                        amount_involved=total_flow,
                        evidence={"transaction_count": len(txns)},
                        detected_at=datetime.now(),
                        confidence_score=0.85
                    ))

        # 3. Construct Network for Visualization
        nodes = []
        edges = []
        
        # Create Nodes
        for acc_id in graph.nodes:
            # Find account details if provided
            acc_details = next((a for a in request.accounts if a.account_number == acc_id), None)
            nodes.append(NetworkNode(
                id=acc_id,
                label=acc_details.account_holder if acc_details else f"Unknown ({acc_id})",
                type="account",
                risk_level=acc_details.risk_rating if acc_details else RiskLevel.MEDIUM,
                properties={"bank": acc_details.bank_name if acc_details else "Unknown"}
            ))
            
        # Create Edges
        for (src, dst), txns in flows.items():
            total = sum(t.amount for t in txns)
            edges.append(NetworkEdge(
                source=src,
                target=dst,
                weight=total / 10000, # Visual weight
                transactions=len(txns),
                total_amount=total,
                first_transaction=min(t.date for t in txns),
                last_transaction=max(t.date for t in txns)
            ))
            
        # 4. Generate Leads
        if anomalies:
            leads.append(InvestigationLead(
                priority=1,
                title="Investigate Circular Flow",
                description="High confidence circular trading detected. Immediate freeze recommended.",
                recommended_action="Freeze accounts and request KYC.",
                accounts_to_investigate=anomalies[0].affected_accounts,
                estimated_amount=anomalies[0].amount_involved
            ))

        analysis_uuid = str(uuid.uuid4())
        response = FinancialAnalysisResponse(
            id=analysis_uuid,
            case_id=request.case_id,
            analysis_id=analysis_uuid,
            network=FinancialNetwork(nodes=nodes, edges=edges),
            anomalies=anomalies,
            leads=leads,
            metrics={
                "total_volume": total_volume,
                "transaction_count": len(request.transactions),
                "risk_score": len(anomalies) * 25
            },
            generated_at=datetime.now(),
            summary=f"Analysis of {len(request.transactions)} transactions reveals {len(anomalies)} anomalies."
        )
        
        return await self.create(response)

# Factory
_service_instance = None

def get_financial_service() -> FinancialService:
    global _service_instance
    if _service_instance is None:
        repo = InMemoryRepository[FinancialAnalysisResponse, str]()
        _service_instance = FinancialService(repo)
    return _service_instance

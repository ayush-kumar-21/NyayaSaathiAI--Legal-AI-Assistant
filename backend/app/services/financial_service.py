"""
Financial Analyzer Service - Skill 02
NetworkX-based financial crime detection
"""
import uuid
import networkx as nx
from datetime import datetime, timedelta
from typing import List, Dict, Set, Tuple
from collections import defaultdict

from app.schemas.financial import (
    Transaction, Account, AnomalyAlert, AnomalyType, RiskLevel,
    NetworkNode, NetworkEdge, FinancialNetwork, InvestigationLead,
    FinancialAnalysisRequest, FinancialAnalysisResponse,
    TransactionPattern
)


class FinancialAnalyzer:
    """
    Advanced financial crime detection using network analysis
    """
    
    def __init__(self, threshold_amount: float = 100000.0):
        self.threshold = threshold_amount
        self.graph = nx.DiGraph()
        self.anomalies = []
        self.leads = []
    
    def analyze(self, request: FinancialAnalysisRequest) -> FinancialAnalysisResponse:
        """
        Complete financial analysis pipeline
        """
        self.case_id = request.case_id
        self.transactions = request.transactions
        self.accounts = {acc.account_number: acc for acc in request.accounts}
        
        # Step 1: Build transaction network
        self._build_network()
        
        # Step 2: Detect anomalies
        self._detect_circular_trading()
        self._detect_layering()
        self._detect_structuring()
        self._detect_high_value()
        self._detect_rapid_succession()
        self._detect_unusual_hours()
        self._detect_shell_companies()
        
        # Step 3: Generate leads
        self._generate_leads()
        
        # Step 4: Build response
        network = self._build_network_response()
        metrics = self._calculate_metrics()
        summary = self._generate_summary()
        
        return FinancialAnalysisResponse(
            case_id=request.case_id,
            analysis_id=str(uuid.uuid4()),
            network=network,
            anomalies=self.anomalies,
            leads=self.leads,
            metrics=metrics,
            generated_at=datetime.now(),
            summary=summary
        )
    
    def _build_network(self):
        """Build directed graph from transactions"""
        for txn in self.transactions:
            # Add nodes (accounts)
            if not self.graph.has_node(txn.from_account):
                self.graph.add_node(txn.from_account, type="account")
            if not self.graph.has_node(txn.to_account):
                self.graph.add_node(txn.to_account, type="account")
            
            # Add or update edge
            if self.graph.has_edge(txn.from_account, txn.to_account):
                # Update existing edge
                edge_data = self.graph[txn.from_account][txn.to_account]
                edge_data['weight'] += txn.amount
                edge_data['transactions'] += 1
                edge_data['txn_ids'].append(txn.id)
            else:
                # Create new edge
                self.graph.add_edge(
                    txn.from_account,
                    txn.to_account,
                    weight=txn.amount,
                    transactions=1,
                    txn_ids=[txn.id]
                )
    
    def _detect_circular_trading(self):
        """Detect money circulating in loops"""
        try:
            cycles = list(nx.simple_cycles(self.graph))
            
            for cycle in cycles:
                if len(cycle) >= 3:  # Minimum 3 nodes for meaningful cycle
                    # Calculate total amount in cycle
                    cycle_amount = self._calculate_cycle_amount(cycle)
                    
                    if cycle_amount > self.threshold:
                        alert = AnomalyAlert(
                            id=str(uuid.uuid4()),
                            type=AnomalyType.CIRCULAR_TRADING,
                            risk_level=RiskLevel.HIGH,
                            title="Circular Trading Pattern Detected",
                            description=f"Money circulating in loop: {' → '.join(cycle)}",
                            affected_accounts=cycle,
                            amount_involved=cycle_amount,
                            evidence={
                                "cycle_length": len(cycle),
                                "cycle_path": cycle
                            },
                            detected_at=datetime.now(),
                            confidence_score=0.85
                        )
                        self.anomalies.append(alert)
        except Exception as e:
            pass  # Handle graph cycles error
    
    def _calculate_cycle_amount(self, cycle: List[str]) -> float:
        """Calculate total amount flowing in cycle"""
        total = 0
        for i in range(len(cycle)):
            source = cycle[i]
            target = cycle[(i + 1) % len(cycle)]
            if self.graph.has_edge(source, target):
                total += self.graph[source][target].get('weight', 0)
        return total
    
    def _detect_layering(self):
        """Detect complex layering (5+ hops)"""
        for node in self.graph.nodes():
            # Find all nodes reachable within 5 hops
            lengths = nx.single_source_shortest_path_length(self.graph, node, cutoff=5)
            distant_nodes = [n for n, dist in lengths.items() if dist >= 5]
            
            if len(distant_nodes) >= 3:  # Multiple long paths
                # Calculate total flow through these paths
                total_flow = self._calculate_flow_to_nodes(node, distant_nodes)
                
                if total_flow > self.threshold * 2:
                    alert = AnomalyAlert(
                        id=str(uuid.uuid4()),
                        type=AnomalyType.LAYERING,
                        risk_level=RiskLevel.CRITICAL,
                        title="Complex Layering Pattern",
                        description=f"Money flowing through {len(distant_nodes)} entities in 5+ hops",
                        affected_accounts=[node] + distant_nodes[:5],
                        amount_involved=total_flow,
                        evidence={
                            "source_account": node,
                            "hops": 5,
                            "destination_count": len(distant_nodes)
                        },
                        detected_at=datetime.now(),
                        confidence_score=0.80
                    )
                    self.anomalies.append(alert)
    
    def _calculate_flow_to_nodes(self, source: str, targets: List[str]) -> float:
        """Calculate total flow from source to target nodes"""
        total = 0
        for target in targets:
            try:
                paths = list(nx.all_simple_paths(self.graph, source, target, cutoff=5))
                for path in paths[:5]:  # Limit to 5 paths
                    path_amount = self._calculate_path_amount(path)
                    total += path_amount
            except:
                continue
        return total
    
    def _calculate_path_amount(self, path: List[str]) -> float:
        """Calculate minimum amount along a path"""
        amounts = []
        for i in range(len(path) - 1):
            if self.graph.has_edge(path[i], path[i + 1]):
                amounts.append(self.graph[path[i]][path[i + 1]].get('weight', 0))
        return min(amounts) if amounts else 0
    
    def _detect_structuring(self):
        """Detect structuring (just below reporting threshold)"""
        reporting_threshold = 100000  # INR
        structuring_window = 7  # days
        
        # Group transactions by account and date
        account_daily = defaultdict(lambda: defaultdict(list))
        
        for txn in self.transactions:
            day_key = txn.date.strftime("%Y-%m-%d")
            account_daily[txn.from_account][day_key].append(txn)
        
        # Check for structuring patterns
        for account, daily_txns in account_daily.items():
            for day, txns in daily_txns.items():
                # Check multiple transactions just below threshold
                below_threshold = [t for t in txns if 80000 <= t.amount < reporting_threshold]
                
                if len(below_threshold) >= 3:  # 3+ structured transactions
                    total_structured = sum(t.amount for t in below_threshold)
                    
                    alert = AnomalyAlert(
                        id=str(uuid.uuid4()),
                        type=AnomalyType.STRUCTURING,
                        risk_level=RiskLevel.HIGH,
                        title="Structuring/Smurfing Detected",
                        description=f"{len(below_threshold)} transactions just below reporting threshold",
                        affected_accounts=[account],
                        amount_involved=total_structured,
                        evidence={
                            "transaction_count": len(below_threshold),
                            "individual_amounts": [t.amount for t in below_threshold],
                            "threshold": reporting_threshold
                        },
                        detected_at=datetime.now(),
                        confidence_score=0.90
                    )
                    self.anomalies.append(alert)
    
    def _detect_high_value(self):
        """Flag high-value transactions"""
        for txn in self.transactions:
            if txn.amount >= self.threshold * 5:  # 5x threshold
                alert = AnomalyAlert(
                    id=str(uuid.uuid4()),
                    type=AnomalyType.HIGH_VALUE,
                    risk_level=RiskLevel.MEDIUM,
                    title="High-Value Transaction",
                    description=f"Transaction of ₹{txn.amount:,.2f} detected",
                    affected_accounts=[txn.from_account, txn.to_account],
                    amount_involved=txn.amount,
                    evidence={
                        "transaction_id": txn.id,
                        "date": txn.date.isoformat(),
                        "channel": txn.channel
                    },
                    detected_at=datetime.now(),
                    confidence_score=0.95
                )
                self.anomalies.append(alert)
    
    def _detect_rapid_succession(self):
        """Detect rapid-fire transactions"""
        # Group by account and sort by time
        account_txns = defaultdict(list)
        for txn in self.transactions:
            account_txns[txn.from_account].append(txn)
        
        for account, txns in account_txns.items():
            txns.sort(key=lambda x: x.date)
            
            # Check for 5+ transactions within 1 hour
            for i in range(len(txns) - 4):
                window_start = txns[i].date
                window_end = window_start + timedelta(hours=1)
                
                rapid_txns = [t for t in txns[i:i+10] if t.date <= window_end]
                
                if len(rapid_txns) >= 5:
                    total_amount = sum(t.amount for t in rapid_txns)
                    
                    alert = AnomalyAlert(
                        id=str(uuid.uuid4()),
                        type=AnomalyType.RAPID_SUCCESSION,
                        risk_level=RiskLevel.HIGH,
                        title="Rapid Succession Transactions",
                        description=f"{len(rapid_txns)} transactions within 1 hour",
                        affected_accounts=[account],
                        amount_involved=total_amount,
                        evidence={
                            "transaction_count": len(rapid_txns),
                            "time_window": "1 hour",
                            "first_txn": rapid_txns[0].date.isoformat()
                        },
                        detected_at=datetime.now(),
                        confidence_score=0.88
                    )
                    self.anomalies.append(alert)
                    break  # One alert per account is enough
    
    def _detect_unusual_hours(self):
        """Detect transactions outside business hours"""
        unusual_count = 0
        unusual_amount = 0
        accounts_involved = set()
        
        for txn in self.transactions:
            hour = txn.date.hour
            # Define unusual hours: before 6 AM or after 10 PM
            if hour < 6 or hour > 22:
                unusual_count += 1
                unusual_amount += txn.amount
                accounts_involved.add(txn.from_account)
                accounts_involved.add(txn.to_account)
        
        if unusual_count >= 5 and unusual_amount > self.threshold:
            alert = AnomalyAlert(
                id=str(uuid.uuid4()),
                type=AnomalyType.UNUSUAL_HOURS,
                risk_level=RiskLevel.MEDIUM,
                title="Unusual Hours Activity",
                description=f"{unusual_count} transactions outside business hours",
                affected_accounts=list(accounts_involved)[:10],
                amount_involved=unusual_amount,
                evidence={
                    "transaction_count": unusual_count,
                    "unusual_hours": "22:00 - 06:00"
                },
                detected_at=datetime.now(),
                confidence_score=0.75
            )
            self.anomalies.append(alert)
    
    def _detect_shell_companies(self):
        """Detect potential shell company indicators"""
        # Look for accounts with high in-degree and out-degree but low balance
        for node in self.graph.nodes():
            in_degree = self.graph.in_degree(node)
            out_degree = self.graph.out_degree(node)
            
            # Shell company pattern: Many connections, circular flow
            if in_degree >= 10 and out_degree >= 10:
                # Check if it's part of circular trading
                try:
                    cycles = list(nx.simple_cycles(self.graph))
                    node_in_cycles = any(node in cycle for cycle in cycles)
                    
                    if node_in_cycles:
                        total_throughput = self._calculate_node_throughput(node)
                        
                        alert = AnomalyAlert(
                            id=str(uuid.uuid4()),
                            type=AnomalyType.SHELL_COMPANY,
                            risk_level=RiskLevel.CRITICAL,
                            title="Potential Shell Company Activity",
                            description=f"Account shows shell company patterns: high connectivity with circular flows",
                            affected_accounts=[node],
                            amount_involved=total_throughput,
                            evidence={
                                "incoming_connections": in_degree,
                                "outgoing_connections": out_degree,
                                "circular_flow": True
                            },
                            detected_at=datetime.now(),
                            confidence_score=0.70
                        )
                        self.anomalies.append(alert)
                except:
                    continue
    
    def _calculate_node_throughput(self, node: str) -> float:
        """Calculate total money flowing through node"""
        incoming = sum(
            self.graph[u][node].get('weight', 0)
            for u in self.graph.predecessors(node)
        )
        outgoing = sum(
            self.graph[node][v].get('weight', 0)
            for v in self.graph.successors(node)
        )
        return max(incoming, outgoing)
    
    def _generate_leads(self):
        """Generate investigation leads from anomalies"""
        # Sort anomalies by risk level and confidence
        risk_order = {RiskLevel.CRITICAL: 4, RiskLevel.HIGH: 3, RiskLevel.MEDIUM: 2, RiskLevel.LOW: 1}
        sorted_anomalies = sorted(
            self.anomalies,
            key=lambda a: (risk_order.get(a.risk_level, 0), a.confidence_score),
            reverse=True
        )
        
        for idx, anomaly in enumerate(sorted_anomalies[:5], 1):  # Top 5 leads
            lead = InvestigationLead(
                priority=11 - idx,  # 10 down to 6
                title=f"Investigate {anomaly.type.replace('_', ' ').title()}",
                description=anomaly.description,
                recommended_action=self._get_recommended_action(anomaly.type),
                accounts_to_investigate=anomaly.affected_accounts[:5],
                estimated_amount=anomaly.amount_involved
            )
            self.leads.append(lead)
    
    def _get_recommended_action(self, anomaly_type: AnomalyType) -> str:
        """Get recommended investigation action"""
        actions = {
            AnomalyType.CIRCULAR_TRADING: "Trace ultimate beneficiaries and source of funds",
            AnomalyType.LAYERING: "Freeze accounts and trace money trail through all hops",
            AnomalyType.STRUCTURING: "Interview account holder and verify source of funds",
            AnomalyType.SHELL_COMPANY: "Verify company registration and actual business activity",
            AnomalyType.HIGH_VALUE: "Verify KYC and transaction purpose",
            AnomalyType.RAPID_SUCCESSION: "Check for automation/scripting and account takeover",
            AnomalyType.UNUSUAL_HOURS: "Verify if account holder was in control during transactions"
        }
        return actions.get(anomaly_type, "Conduct detailed investigation")
    
    def _build_network_response(self) -> FinancialNetwork:
        """Build network visualization data"""
        nodes = []
        edges = []
        
        # Build nodes
        for node_id in self.graph.nodes():
            account = self.accounts.get(node_id)
            risk = RiskLevel.LOW
            
            # Determine risk from anomalies
            for alert in self.anomalies:
                if node_id in alert.affected_accounts:
                    if alert.risk_level == RiskLevel.CRITICAL:
                        risk = RiskLevel.CRITICAL
                        break
                    elif alert.risk_level == RiskLevel.HIGH and risk != RiskLevel.CRITICAL:
                        risk = RiskLevel.HIGH
            
            nodes.append(NetworkNode(
                id=node_id,
                label=account.account_holder if account else node_id[:10],
                type="account",
                risk_level=risk,
                properties={
                    "holder": account.account_holder if account else "Unknown",
                    "bank": account.bank_name if account else "Unknown"
                }
            ))
        
        # Build edges
        for u, v, data in self.graph.edges(data=True):
            edges.append(NetworkEdge(
                source=u,
                target=v,
                weight=data.get('weight', 0),
                transactions=data.get('transactions', 0),
                total_amount=data.get('weight', 0),
                first_transaction=datetime.now(),  # Would track actual first/last
                last_transaction=datetime.now()
            ))
        
        return FinancialNetwork(nodes=nodes, edges=edges)
    
    def _calculate_metrics(self) -> Dict:
        """Calculate analysis metrics"""
        total_volume = sum(t.amount for t in self.transactions)
        unique_accounts = len(set(
            [t.from_account for t in self.transactions] +
            [t.to_account for t in self.transactions]
        ))
        
        return {
            "total_transactions": len(self.transactions),
            "total_volume": total_volume,
            "unique_accounts": unique_accounts,
            "network_density": nx.density(self.graph),
            "anomalies_detected": len(self.anomalies),
            "critical_alerts": len([a for a in self.anomalies if a.risk_level == RiskLevel.CRITICAL]),
            "high_risk_accounts": len([n for n in self.graph.nodes() if self._is_high_risk(n)])
        }
    
    def _is_high_risk(self, node: str) -> bool:
        """Check if node is high risk based on anomalies"""
        for alert in self.anomalies:
            if node in alert.affected_accounts and alert.risk_level in [RiskLevel.CRITICAL, RiskLevel.HIGH]:
                return True
        return False
    
    def _generate_summary(self) -> str:
        """Generate human-readable summary"""
        parts = []
        
        if self.anomalies:
            critical = len([a for a in self.anomalies if a.risk_level == RiskLevel.CRITICAL])
            high = len([a for a in self.anomalies if a.risk_level == RiskLevel.HIGH])
            
            parts.append(f"Detected {len(self.anomalies)} suspicious patterns:")
            if critical:
                parts.append(f"- {critical} CRITICAL alerts requiring immediate action")
            if high:
                parts.append(f"- {high} HIGH risk patterns identified")
            
            # List top anomaly types
            type_counts = {}
            for a in self.anomalies:
                type_counts[a.type] = type_counts.get(a.type, 0) + 1
            
            parts.append("\nKey findings:")
            for anomaly_type, count in sorted(type_counts.items(), key=lambda x: -x[1])[:3]:
                parts.append(f"- {count} instances of {anomaly_type.replace('_', ' ').title()}")
        else:
            parts.append("No significant suspicious patterns detected in the analyzed transactions.")
        
        if self.leads:
            parts.append(f"\nGenerated {len(self.leads)} investigation leads.")
        
        return "\n".join(parts)


# Singleton
financial_analyzer = FinancialAnalyzer()

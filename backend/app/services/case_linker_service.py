"""
Case Linker Service - Skill 05
Advanced crime pattern detection using NetworkX
"""
import uuid
import networkx as nx
from typing import List, Dict, Set
from datetime import datetime
from app.schemas.case_linker import (
    CrimeGraph, CrimeNode, CrimeLink, PatternAlert,
    CaseLinkRequest, CaseLinkResponse, PatternType, LinkStrength
)


class CaseLinkerService:
    """
    Analyzes crime data to find hidden connections
    """
    
    def __init__(self):
        self.graph = nx.Graph()
        # In a real app, this would load from DB
        self._initialize_mock_graph()
    
    def _initialize_mock_graph(self):
        """Pre-load some dummy data for demo"""
        # Cases
        self.graph.add_node("FIR-2025-001", type="Case", label="Theft at Sector 4")
        self.graph.add_node("FIR-2025-002", type="Case", label="Burglary at Sector 5")
        self.graph.add_node("FIR-2025-003", type="Case", label="Snatching at Market")
        
        # Suspects
        self.graph.add_node("SUS-001", type="Suspect", label="Raju 'Blade'")
        self.graph.add_node("SUS-002", type="Suspect", label="Unknown Biker")
        
        # MOs
        self.graph.add_node("MO-001", type="MO", label="Night time entry")
        self.graph.add_node("MO-002", type="MO", label="Bike borne snatching")
        
        # Links
        self.graph.add_edge("FIR-2025-001", "SUS-001", type=PatternType.RECURRING_SUSPECT, strength=LinkStrength.HIGH)
        self.graph.add_edge("FIR-2025-002", "SUS-001", type=PatternType.RECURRING_SUSPECT, strength=LinkStrength.MEDIUM)
        
        self.graph.add_edge("FIR-2025-001", "MO-001", type=PatternType.MODUS_OPERANDI, strength=LinkStrength.CONFIRMED)
        self.graph.add_edge("FIR-2025-002", "MO-001", type=PatternType.MODUS_OPERANDI, strength=LinkStrength.CONFIRMED)
        
        self.graph.add_edge("FIR-2025-003", "MO-002", type=PatternType.MODUS_OPERANDI, strength=LinkStrength.HIGH)
        self.graph.add_edge("FIR-2025-003", "SUS-002", type=PatternType.RECURRING_SUSPECT, strength=LinkStrength.LOW)

    async def analyze_case(self, request: CaseLinkRequest) -> CaseLinkResponse:
        """Analyze a specific case for links"""
        case_id = request.case_id
        
        # If case not in graph, add main node essentially
        if case_id not in self.graph:
            self.graph.add_node(case_id, type="Case", label=f"Investigation {case_id}")
            
        # 1. Traversal Analysis (2-hop neighbors)
        subgraph_nodes = set([case_id])
        file_neighbors = list(self.graph.neighbors(case_id))
        subgraph_nodes.update(file_neighbors)
        
        for n in file_neighbors:
            subgraph_nodes.update(self.graph.neighbors(n))
            
        subgraph = self.graph.subgraph(subgraph_nodes)
        
        # 2. Build Response Graph
        nodes = []
        links = []
        
        for n, data in subgraph.nodes(data=True):
            nodes.append(CrimeNode(
                id=n,
                type=data.get("type", "Unknown"),
                label=data.get("label", n),
                metadata=data
            ))
            
        for u, v, data in subgraph.edges(data=True):
            links.append(CrimeLink(
                source=u,
                target=v,
                strength=data.get("strength", LinkStrength.LOW),
                type=data.get("type", PatternType.MODUS_OPERANDI),
                description=f"Linked via {data.get('type')}",
                confidence_score=0.85 # Mock score
            ))
            
        # 3. Detect Patterns
        patterns = self._detect_patterns(subgraph, case_id)
        
        # 4. Find Similar Cases
        similar_cases = self._find_similar_cases(case_id)
        
        return CaseLinkResponse(
            case_id=case_id,
            graph=CrimeGraph(nodes=nodes, links=links),
            patterns=patterns,
            similar_cases=similar_cases
        )
    
    def _detect_patterns(self, subgraph: nx.Graph, focal_case: str) -> List[PatternAlert]:
        """Detect automated patterns in subgraph"""
        alerts = []
        
        # Check for Common Suspect
        suspects = [n for n, d in subgraph.nodes(data=True) if d.get("type") == "Suspect"]
        for suspect in suspects:
            degree = subgraph.degree(suspect)
            if degree >= 2:
                alerts.append(PatternAlert(
                    id=str(uuid.uuid4()),
                    pattern_type=PatternType.RECURRING_SUSPECT,
                    title=f"Serial Offender Detected: {self.graph.nodes[suspect].get('label')}",
                    description=f"Suspect linked to {degree} cases in this cluster",
                    linked_cases=[n for n in subgraph.neighbors(suspect) if self.graph.nodes[n].get("type") == "Case"],
                    suspects_involved=[suspect],
                    confidence_score=0.9,
                    detected_at=datetime.now(),
                    recommended_action="Interrogate suspect regarding all linked cases"
                ))
                
        # Check for Common MO
        mos = [n for n, d in subgraph.nodes(data=True) if d.get("type") == "MO"]
        for mo in mos:
            degree = subgraph.degree(mo)
            if degree >= 2:
                alerts.append(PatternAlert(
                    id=str(uuid.uuid4()),
                    pattern_type=PatternType.MODUS_OPERANDI,
                    title=f"MO Pattern: {self.graph.nodes[mo].get('label')}",
                    description=f"Distinctive MO observed in multiple investigations",
                    linked_cases=[n for n in subgraph.neighbors(mo) if self.graph.nodes[n].get("type") == "Case"],
                    suspects_involved=[],
                    confidence_score=0.75,
                    detected_at=datetime.now(),
                    recommended_action="Combine investigation teams"
                ))
                
        return alerts

    def _find_similar_cases(self, case_id: str) -> List[Dict]:
        """Find cases with similar attributes (e.g. text similarity)"""
        # Mock implementation
        return [
            {"id": "FIR-2024-889", "similarity": 0.88, "reason": "Same location type"},
            {"id": "FIR-2024-912", "similarity": 0.76, "reason": "Similar time of day"}
        ]


# Singleton
case_linker_service = CaseLinkerService()

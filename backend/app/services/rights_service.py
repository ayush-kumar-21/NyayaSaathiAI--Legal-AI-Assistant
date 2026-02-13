"""
Know Your Rights Service - Skill 22 (Expert)
Curated legal rights knowledge base for Indian citizens
"""
import uuid
from datetime import datetime
from typing import Dict
from app.schemas.rights import (
    RightsQueryRequest, RightsQueryResponse, RightsCategory,
    RightInfo
)


class KnowYourRightsService:
    """
    Expert rights information engine with:
    - Curated Indian constitutional and statutory rights database
    - Category-based lookup with keyword matching
    - Emergency contacts integration
    """

    # Pre-built rights knowledge base
    RIGHTS_DB = {
        RightsCategory.ARREST: [
            RightInfo(
                title="Right to Know Grounds of Arrest",
                description="Every person arrested must be informed of the grounds of arrest immediately.",
                legal_basis="Article 22(1) Constitution + BNSS Section 47",
                key_points=[
                    "Police must inform you WHY you are being arrested",
                    "Arrest memo must be prepared with date and time",
                    "A family member must be informed immediately"
                ],
                dos=["Ask for the arrest memo", "Note badge number of arresting officer", "Stay calm and cooperate"],
                donts=["Do not resist physically", "Do not sign blank papers", "Do not make statements without lawyer"]
            ),
            RightInfo(
                title="Right to Legal Representation",
                description="Every arrested person has the right to consult and be defended by a legal practitioner.",
                legal_basis="Article 22(1) Constitution + BNSS Section 49",
                key_points=[
                    "You can call your lawyer immediately upon arrest",
                    "If you cannot afford a lawyer, free legal aid must be provided",
                    "Police cannot deny access to legal counsel"
                ],
                dos=["Ask to call your lawyer", "Request free legal aid if needed"],
                donts=["Do not waive your right to counsel", "Do not give confession without lawyer present"]
            ),
            RightInfo(
                title="Right Against Torture",
                description="No person in custody shall be subjected to torture or inhuman treatment.",
                legal_basis="Article 21 Constitution + BNS Section 131",
                key_points=[
                    "Custodial torture is a criminal offense",
                    "Medical examination must be done within 24 hours",
                    "You can complain to the Magistrate about maltreatment"
                ],
                dos=["Request medical examination", "Report any maltreatment to Magistrate"],
                donts=["Do not suffer in silence", "Do not destroy evidence of torture"]
            ),
        ],
        RightsCategory.BAIL: [
            RightInfo(
                title="Right to Bail in Bailable Offenses",
                description="Bail is a RIGHT in bailable offenses, not a privilege.",
                legal_basis="BNSS Section 478",
                key_points=[
                    "Police MUST grant bail for bailable offenses",
                    "Refusal of bail in bailable offense is illegal",
                    "Even if you cannot furnish surety, you can get personal bond"
                ],
                dos=["Apply for bail at the earliest", "Keep surety documents ready"],
                donts=["Do not assume all offenses are non-bailable"]
            ),
            RightInfo(
                title="Default Bail (Section 479 BNSS)",
                description="If chargesheet is not filed within the statutory period, accused gets default bail.",
                legal_basis="BNSS Section 479",
                key_points=[
                    "60 days for offenses with max punishment < 7 years",
                    "90 days for offenses with max punishment >= 7 years",
                    "This is a fundamental right and cannot be denied"
                ],
                dos=["Track the chargesheet filing deadline", "File application immediately when deadline passes"],
                donts=["Do not miss the window — file before chargesheet is submitted"]
            ),
        ],
        RightsCategory.FIR: [
            RightInfo(
                title="Right to File FIR",
                description="Police MUST register an FIR for every cognizable offense.",
                legal_basis="BNSS Section 173 + Lalita Kumari v. Govt of UP (2014)",
                key_points=[
                    "Police cannot refuse to register FIR for cognizable offenses",
                    "You can file FIR at any police station (Zero FIR)",
                    "You are entitled to a free copy of the FIR"
                ],
                dos=["Insist on written FIR", "Get the FIR number and copy", "Contact SP if police refuses"],
                donts=["Do not accept oral assurances", "Do not leave without FIR copy"]
            ),
        ],
        RightsCategory.WOMEN: [
            RightInfo(
                title="Rights of Women During Arrest",
                description="Women cannot be arrested after sunset and before sunrise except in exceptional circumstances.",
                legal_basis="BNSS Section 46(4)",
                key_points=[
                    "Female officer must be present during arrest",
                    "No arrest after sunset without Magistrate's written order",
                    "Women have right to privacy during search"
                ],
                dos=["Request female officer presence", "Ask for night arrest order copy"],
                donts=["Do not allow male officers to conduct body search"]
            ),
        ],
    }

    EMERGENCY_CONTACTS = [
        {"name": "Police Emergency", "number": "112", "type": "emergency"},
        {"name": "Women Helpline", "number": "181", "type": "women"},
        {"name": "Child Helpline", "number": "1098", "type": "children"},
        {"name": "NALSA Legal Aid", "number": "15100", "type": "legal_aid"},
        {"name": "Cyber Crime", "number": "1930", "type": "cyber"},
        {"name": "Senior Citizen Helpline", "number": "14567", "type": "senior"},
    ]

    def __init__(self):
        self.queries: Dict[str, RightsQueryResponse] = {}

    async def query_rights(self, request: RightsQueryRequest) -> RightsQueryResponse:
        """Find relevant rights based on query and category"""
        result_id = str(uuid.uuid4())

        # Determine category from query if not specified
        category = request.category or self._detect_category(request.query)

        # Fetch rights for category
        rights = self.RIGHTS_DB.get(category, [])

        # If no direct match, search across all categories by keyword
        if not rights:
            rights = self._keyword_search(request.query)

        # Related sections
        related = self._extract_related_sections(rights)

        response = RightsQueryResponse(
            id=result_id,
            query=request.query,
            category=category,
            rights=rights,
            emergency_contacts=self.EMERGENCY_CONTACTS,
            related_sections=related,
        )

        self.queries[result_id] = response
        return response

    def _detect_category(self, query: str) -> RightsCategory:
        """Simple keyword-based category detection"""
        q = query.lower()
        mappings = {
            RightsCategory.ARREST: ["arrest", "detained", "custody", "jail", "lock up"],
            RightsCategory.BAIL: ["bail", "release", "surety", "bond"],
            RightsCategory.FIR: ["fir", "complaint", "report", "police station"],
            RightsCategory.WOMEN: ["woman", "women", "wife", "dowry", "harassment"],
            RightsCategory.CHILDREN: ["child", "minor", "juvenile", "kid"],
            RightsCategory.CYBER: ["cyber", "online", "internet", "hacking"],
            RightsCategory.PROPERTY: ["property", "land", "house", "encroachment"],
        }
        for cat, keywords in mappings.items():
            if any(kw in q for kw in keywords):
                return cat
        return RightsCategory.GENERAL

    def _keyword_search(self, query: str) -> list:
        """Search all rights by keyword"""
        q = query.lower()
        results = []
        for cat_rights in self.RIGHTS_DB.values():
            for right in cat_rights:
                if any(word in right.title.lower() or word in right.description.lower()
                       for word in q.split()):
                    results.append(right)
        return results[:5]  # Top 5

    def _extract_related_sections(self, rights: list) -> list:
        sections = set()
        for r in rights:
            sections.add(r.legal_basis)
        return list(sections)


# Singleton + Factory
_service = None

def get_rights_service() -> KnowYourRightsService:
    global _service
    if _service is None:
        _service = KnowYourRightsService()
    return _service

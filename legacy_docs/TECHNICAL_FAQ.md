# Technical FAQ & Integrity Assurance
> **NyayaSaathiAI Grand Finale Defense Guide**

## 🛡️ System Integrity & Security

### Q1: How do you prevent evidence tampering?
**A:** We use a dual-layer integrity system called **Akhand Ledger™**:
1.  **SHA-256 Hashing:** Every file uploaded is instantly hashed. This digital fingerprint is unique to the file's content.
2.  **Blockchain Anchoring:** This hash is recorded in an immutable ledger (`blockchain_records` table) along with a timestamp and the officer's digital signature.
3.  **Verification:** When a judge views evidence, the system re-computes the hash of the file on disk and compares it to the ledger. Any mismatch triggers a "TAMPERED" alert.

### Q2: Is the AI making legal decisions?
**A:** **Absolutely not.** The AI is strictly an **advisory tool**:
*   **Bail Reckoner:** Provides a risk score based on precedent, but the Judge must manually click "Grant" or "Deny".
*   **Vipaksh Audit:** Flags potential errors for human review.
*   **Drafting:** Generates a starting template, which the Judge must edit and sign.
*   *Legal Basis:* This complies with the principle that judicial discretion cannot be delegated to machines.

### Q3: How do you handle AI hallucinations?
**A:** We use **Retrieval-Augmented Generation (RAG)** with a strict "Grounding" protocol:
1.  The AI searches *only* the official BNS/BNSS legal corpus (stored in our vector database).
2.  Every claim must cite a specific section.
3.  **Vipaksh™ (Adversarial AI)** runs a second pass to verify that the cited section actually supports the claim. If not, the output is flagged.

## ⚡ Technical Architecture

### Q4: How does the system scale to a national level?
**A:** The architecture is stateless and horizontally scalable:
*   **Backend:** Python FastAPI (Async IO) allows high concurrency for API requests.
*   **Database:** PostgreSQL with PostGIS for geospatial queries (Heatmap). It handles millions of rows efficiently.
*   **Services:** Critical services (Evidence, Analytics) are modular. The "MHA Heatmap" uses optimized SQL aggregation (`func.count`) rather than processing raw data in Python, ensuring sub-second load times even with millions of cases.

### Q5: What happens if the internet goes down?
**A:** The **NyayaRakshak (Police)** app follows an "Offline-First" architecture:
1.  Evidence and FIR details are stored locally (SQLite/Encrypted Store).
2.  A SHA-256 hash is generated locally on the device immediately.
3.  Data syncs to the central server automatically once connectivity is restored.

## 🚀 Future Roadmap (Q3/Q4 2026)

| Feature | Status | Plan |
| :--- | :--- | :--- |
| **Section 63 BSA Certificate** | ⚠️ Partial | Current: Live Hash Verification. <br>Future: PDF Generation with DSC (Digital Signature Certificate) integration. |
| **POCSO PII Masking** | 🚧 Planned | Auto-redaction of names/addresses for juvenile cases using NLP before public display. |
| **Video Testimony Analysis** | 🧪 Beta | Using Gemini 1.5 Pro to flag inconsistencies in cross-examination videos (currently mocked). |
| **Real-Time WebSockets** | 📅 Q3 | Moving from polling to WebSocket push for instant "Bail Granted" alerts. |

---

## 🔎 Verification Status (Current Build)

*   ✅ **Real Database:** 5,000+ seeded cases in SQLite/Postgres.
*   ✅ **Real Hashing:** `evidence_service.py` computes actual SHA-256 hashes.
*   ✅ **Real Analytics:** Admin dashboard pulls live aggregations.
*   ✅ **Real Compliance:** BNSS 193 logic tracks 60/90 day deadlines dynamically.

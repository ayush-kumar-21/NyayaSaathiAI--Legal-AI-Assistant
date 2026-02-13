/**
 * EscalationInbox — Shared inbox for Police and Judge portals.
 * Shows cases assigned to the user's station/court.
 * Provides Resolve and Escalate actions.
 */
import React, { useState, useEffect } from 'react';
import {
    Shield, Scale, Loader2, CheckCircle2, ArrowUpRight,
    AlertTriangle, FileText, Clock, RefreshCw, ChevronRight,
    Search, Filter, Eye,
} from 'lucide-react';
import api from '../../core/services/api';
import CaseEscalationPipeline from './CaseEscalationPipeline';

// ── Types ────────────────────────────────────────────────

interface CaseListItem {
    id: string;
    fir_number: string;
    complainant_name: string;
    complaint_summary: string;
    current_level: string;
    current_status: string;
    current_assigned_to: string;
    created_at: string;
    updated_at: string;
}

interface Props {
    /** 'police' or 'judge' — determines the UI framing */
    role: 'police' | 'judge';
}

// ── Level labels ─────────────────────────────────────────

const LEVEL_LABELS: Record<string, string> = {
    police_local: 'Local Station',
    police_nearby: 'Nearby Station',
    magistrate_court: 'Magistrate Court',
    sessions_court: 'Sessions Court',
    high_court: 'High Court',
    supreme_court: 'Supreme Court',
};

const STATUS_COLORS: Record<string, { color: string; bg: string }> = {
    pending: { color: '#fbbf24', bg: 'rgba(251,191,36,0.12)' },
    investigating: { color: '#3b82f6', bg: 'rgba(59,130,246,0.12)' },
    resolved: { color: '#22c55e', bg: 'rgba(34,197,94,0.12)' },
    escalated: { color: '#f97316', bg: 'rgba(249,115,22,0.12)' },
    closed: { color: '#22c55e', bg: 'rgba(34,197,94,0.12)' },
};

const EscalationInbox: React.FC<Props> = ({ role }) => {
    const [cases, setCases] = useState<CaseListItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedCaseId, setSelectedCaseId] = useState<string | null>(null);
    const [selectedCase, setSelectedCase] = useState<any>(null);
    const [loadingCase, setLoadingCase] = useState(false);
    const [search, setSearch] = useState('');

    // Action modals
    const [showResolve, setShowResolve] = useState(false);
    const [showEscalate, setShowEscalate] = useState(false);
    const [actionText, setActionText] = useState('');
    const [actionBy, setActionBy] = useState('');
    const [actionLoading, setActionLoading] = useState(false);

    // ── Load cases ───────────────────────────────────────

    const loadCases = async () => {
        setLoading(true);
        try {
            const res = await api.get('/escalation/cases');
            setCases(res.data.cases || []);
        } catch {
            // Fallback — still show something
            setCases([]);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { loadCases(); }, []);

    // ── Load case detail ─────────────────────────────────

    const openCase = async (caseId: string) => {
        setSelectedCaseId(caseId);
        setLoadingCase(true);
        try {
            const res = await api.get(`/escalation/case/${caseId}`);
            setSelectedCase(res.data);
        } catch {
            setSelectedCase(null);
        } finally {
            setLoadingCase(false);
        }
    };

    // ── Actions ───────────────────────────────────────────

    const handleResolve = async () => {
        if (!selectedCaseId || !actionText || !actionBy) return;
        setActionLoading(true);
        try {
            const res = await api.post(`/escalation/case/${selectedCaseId}/resolve`, {
                conclusion: actionText,
                resolved_by: actionBy,
            });
            setSelectedCase(res.data);
            setShowResolve(false);
            setActionText('');
            setActionBy('');
            loadCases();
        } catch { /* ignore */ }
        finally { setActionLoading(false); }
    };

    const handleEscalate = async () => {
        if (!selectedCaseId || !actionText || !actionBy) return;
        setActionLoading(true);
        try {
            const res = await api.post(`/escalation/case/${selectedCaseId}/escalate`, {
                reason: actionText,
                escalated_by: actionBy,
            });
            setSelectedCase(res.data);
            setShowEscalate(false);
            setActionText('');
            setActionBy('');
            loadCases();
        } catch { /* ignore */ }
        finally { setActionLoading(false); }
    };

    // ── Filter ───────────────────────────────────────────

    const filteredCases = cases.filter(c => {
        // For police, show police-level cases; for judge, show court-level cases
        const isRelevant = role === 'police'
            ? c.current_level.startsWith('police')
            : !c.current_level.startsWith('police');

        const matchesSearch = !search ||
            c.fir_number.toLowerCase().includes(search.toLowerCase()) ||
            c.complainant_name.toLowerCase().includes(search.toLowerCase()) ||
            c.complaint_summary.toLowerCase().includes(search.toLowerCase());

        return matchesSearch; // Show all for demo; use isRelevant in prod
    });

    const formatDate = (iso: string) => {
        try {
            return new Date(iso).toLocaleDateString('en-IN', {
                day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit',
            });
        } catch { return iso; }
    };

    const isPolice = role === 'police';
    const accent = isPolice ? '#3b82f6' : '#f59e0b';

    // ── Render ───────────────────────────────────────────

    return (
        <div style={{
            padding: 24, minHeight: '100vh',
            background: '#0a0a0a', color: '#e4e4e7',
            fontFamily: "'Inter', sans-serif",
        }}>
            {/* Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
                <div>
                    <h1 style={{
                        fontSize: 24, fontWeight: 800, margin: 0,
                        background: isPolice
                            ? 'linear-gradient(135deg, #3b82f6, #6366f1)'
                            : 'linear-gradient(135deg, #f59e0b, #f97316)',
                        WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
                    }}>
                        {isPolice ? '🛡️ Case Inbox' : '⚖️ Case Queue'}
                    </h1>
                    <p style={{ fontSize: 13, color: '#71717a', margin: '4px 0 0' }}>
                        {isPolice ? 'Cases assigned to your station' : 'Cases requiring judicial resolution'}
                    </p>
                </div>
                <button onClick={loadCases} style={{
                    padding: '8px 16px', borderRadius: 10, border: 'none',
                    background: 'rgba(255,255,255,0.06)', color: '#a1a1aa',
                    cursor: 'pointer', fontSize: 13, display: 'flex', alignItems: 'center', gap: 6,
                }}>
                    <RefreshCw size={14} /> Refresh
                </button>
            </div>

            {/* Search */}
            <div style={{
                display: 'flex', alignItems: 'center', gap: 8, marginBottom: 20,
                padding: '10px 16px', borderRadius: 12,
                background: 'rgba(255,255,255,0.04)',
                border: '1px solid rgba(255,255,255,0.06)',
            }}>
                <Search size={16} color="#71717a" />
                <input
                    value={search} onChange={e => setSearch(e.target.value)}
                    placeholder="Search by FIR number, name, or complaint..."
                    style={{
                        flex: 1, background: 'none', border: 'none', outline: 'none',
                        color: '#e4e4e7', fontSize: 14,
                    }}
                />
            </div>

            {/* Content */}
            <div style={{ display: 'flex', gap: 20 }}>
                {/* Case list */}
                <div style={{ width: selectedCase ? 380 : '100%', transition: 'width 0.3s', flexShrink: 0 }}>
                    {loading ? (
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: 40, justifyContent: 'center', color: '#71717a' }}>
                            <Loader2 size={18} className="animate-spin" /> Loading cases...
                        </div>
                    ) : filteredCases.length === 0 ? (
                        <div style={{ textAlign: 'center', padding: 40, color: '#52525b' }}>
                            <FileText size={40} style={{ marginBottom: 12, opacity: 0.3 }} />
                            <p>No cases found</p>
                        </div>
                    ) : (
                        filteredCases.map(c => {
                            const sc = STATUS_COLORS[c.current_status] || STATUS_COLORS.pending;
                            const isSelected = c.id === selectedCaseId;

                            return (
                                <div
                                    key={c.id}
                                    onClick={() => openCase(c.id)}
                                    style={{
                                        padding: '14px 18px', borderRadius: 14, marginBottom: 10,
                                        background: isSelected ? `rgba(${isPolice ? '59,130,246' : '245,158,11'},0.08)` : 'rgba(255,255,255,0.02)',
                                        border: `1px solid ${isSelected ? `rgba(${isPolice ? '59,130,246' : '245,158,11'},0.25)` : 'rgba(255,255,255,0.06)'}`,
                                        cursor: 'pointer',
                                        transition: 'all 0.2s',
                                    }}
                                >
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                        <span style={{ fontWeight: 700, fontSize: 13, color: accent }}>{c.fir_number}</span>
                                        <span style={{
                                            padding: '2px 8px', borderRadius: 10, fontSize: 10, fontWeight: 600,
                                            color: sc.color, background: sc.bg,
                                        }}>
                                            {c.current_status.toUpperCase()}
                                        </span>
                                    </div>
                                    <div style={{ fontSize: 14, fontWeight: 500, marginTop: 4 }}>{c.complainant_name}</div>
                                    <div style={{ fontSize: 12, color: '#71717a', marginTop: 4, lineHeight: 1.5 }}>
                                        {c.complaint_summary}
                                    </div>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 8 }}>
                                        <span style={{ fontSize: 11, color: '#52525b' }}>
                                            {LEVEL_LABELS[c.current_level] || c.current_level}
                                        </span>
                                        <span style={{ fontSize: 11, color: '#52525b' }}>
                                            <Clock size={10} style={{ marginRight: 3, verticalAlign: 'middle' }} />
                                            {formatDate(c.created_at)}
                                        </span>
                                    </div>
                                </div>
                            );
                        })
                    )}
                </div>

                {/* Case detail panel */}
                {selectedCase && (
                    <div style={{
                        flex: 1, padding: '20px 24px', borderRadius: 16,
                        background: 'rgba(255,255,255,0.02)',
                        border: '1px solid rgba(255,255,255,0.06)',
                        maxHeight: 'calc(100vh - 200px)', overflowY: 'auto',
                    }}>
                        {loadingCase ? (
                            <div style={{ textAlign: 'center', padding: 40, color: '#71717a' }}>
                                <Loader2 size={20} className="animate-spin" />
                            </div>
                        ) : (
                            <>
                                {/* Case header */}
                                <div style={{ marginBottom: 20 }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                        <h2 style={{ margin: 0, fontSize: 18, fontWeight: 700 }}>{selectedCase.fir_number}</h2>
                                        <button onClick={() => { setSelectedCase(null); setSelectedCaseId(null); }} style={{
                                            background: 'none', border: 'none', color: '#71717a', cursor: 'pointer',
                                        }}>✕</button>
                                    </div>
                                    <div style={{ fontSize: 13, color: '#a1a1aa', marginTop: 4 }}>
                                        Complainant: <strong>{selectedCase.complainant_name}</strong> • {selectedCase.complainant_contact}
                                    </div>
                                </div>

                                {/* Complaint */}
                                <div style={{
                                    padding: '12px 16px', borderRadius: 12, marginBottom: 16,
                                    background: 'rgba(255,255,255,0.03)',
                                    border: '1px solid rgba(255,255,255,0.06)',
                                }}>
                                    <span style={{ fontSize: 11, fontWeight: 600, color: '#71717a' }}>COMPLAINT</span>
                                    <p style={{ margin: '6px 0 0', fontSize: 13, color: '#d4d4d8', lineHeight: 1.6 }}>
                                        {selectedCase.complaint_text}
                                    </p>
                                </div>

                                {/* Evidence */}
                                {selectedCase.evidence_urls?.length > 0 && (
                                    <div style={{ marginBottom: 16 }}>
                                        <span style={{ fontSize: 11, fontWeight: 600, color: '#71717a' }}>EVIDENCE</span>
                                        <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginTop: 6 }}>
                                            {selectedCase.evidence_urls.map((url: string, i: number) => (
                                                <span key={i} style={{
                                                    padding: '4px 10px', borderRadius: 8, fontSize: 12,
                                                    background: 'rgba(255,255,255,0.06)', color: '#a1a1aa',
                                                }}>
                                                    📎 {url}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {/* Pipeline */}
                                <CaseEscalationPipeline caseData={selectedCase} />

                                {/* Action buttons */}
                                {selectedCase.current_status !== 'closed' && selectedCase.current_status !== 'resolved' && (
                                    <div style={{ display: 'flex', gap: 12, marginTop: 24 }}>
                                        <button
                                            onClick={() => { setShowResolve(true); setShowEscalate(false); }}
                                            style={{
                                                flex: 1, padding: '12px', borderRadius: 12, border: 'none',
                                                background: 'linear-gradient(135deg, rgba(34,197,94,0.2), rgba(16,185,129,0.15))',
                                                color: '#86efac', cursor: 'pointer', fontSize: 14, fontWeight: 600,
                                                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                                            }}
                                        >
                                            <CheckCircle2 size={16} /> Resolve Case
                                        </button>
                                        <button
                                            onClick={() => { setShowEscalate(true); setShowResolve(false); }}
                                            style={{
                                                flex: 1, padding: '12px', borderRadius: 12, border: 'none',
                                                background: 'linear-gradient(135deg, rgba(249,115,22,0.2), rgba(234,88,12,0.15))',
                                                color: '#fdba74', cursor: 'pointer', fontSize: 14, fontWeight: 600,
                                                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                                            }}
                                        >
                                            <ArrowUpRight size={16} /> Escalate Case
                                        </button>
                                    </div>
                                )}

                                {/* Resolve Form */}
                                {showResolve && (
                                    <div style={{
                                        marginTop: 16, padding: '16px 20px', borderRadius: 14,
                                        background: 'rgba(34,197,94,0.06)',
                                        border: '1px solid rgba(34,197,94,0.15)',
                                    }}>
                                        <h4 style={{ margin: '0 0 12px', fontSize: 14, color: '#86efac' }}>Resolve Case</h4>
                                        <input
                                            value={actionBy} onChange={e => setActionBy(e.target.value)}
                                            placeholder={isPolice ? "Officer name (e.g. SI Vikram Singh)" : "Judge name (e.g. Hon. Justice Sharma)"}
                                            style={{ ...inpStyle, marginBottom: 10 }}
                                        />
                                        <textarea
                                            value={actionText} onChange={e => setActionText(e.target.value)}
                                            placeholder="Conclusion / resolution summary..."
                                            rows={3}
                                            style={{ ...inpStyle, resize: 'vertical' }}
                                        />
                                        <div style={{ display: 'flex', gap: 8, marginTop: 12 }}>
                                            <button onClick={handleResolve} disabled={actionLoading || !actionText || !actionBy} style={greenBtn}>
                                                {actionLoading ? <Loader2 size={14} className="animate-spin" /> : 'Confirm Resolve'}
                                            </button>
                                            <button onClick={() => setShowResolve(false)} style={cancelBtn}>Cancel</button>
                                        </div>
                                    </div>
                                )}

                                {/* Escalate Form */}
                                {showEscalate && (
                                    <div style={{
                                        marginTop: 16, padding: '16px 20px', borderRadius: 14,
                                        background: 'rgba(249,115,22,0.06)',
                                        border: '1px solid rgba(249,115,22,0.15)',
                                    }}>
                                        <h4 style={{ margin: '0 0 12px', fontSize: 14, color: '#fdba74' }}>Escalate Case</h4>
                                        <input
                                            value={actionBy} onChange={e => setActionBy(e.target.value)}
                                            placeholder={isPolice ? "Officer name" : "Judge name"}
                                            style={{ ...inpStyle, marginBottom: 10 }}
                                        />
                                        <textarea
                                            value={actionText} onChange={e => setActionText(e.target.value)}
                                            placeholder="Reason for escalation..."
                                            rows={3}
                                            style={{ ...inpStyle, resize: 'vertical' }}
                                        />
                                        <div style={{ display: 'flex', gap: 8, marginTop: 12 }}>
                                            <button onClick={handleEscalate} disabled={actionLoading || !actionText || !actionBy} style={orangeBtn}>
                                                {actionLoading ? <Loader2 size={14} className="animate-spin" /> : 'Confirm Escalate'}
                                            </button>
                                            <button onClick={() => setShowEscalate(false)} style={cancelBtn}>Cancel</button>
                                        </div>
                                    </div>
                                )}
                            </>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

// ── Styles ───────────────────────────────────────────────

const inpStyle: React.CSSProperties = {
    width: '100%', padding: '10px 14px', borderRadius: 10,
    border: '1px solid rgba(255,255,255,0.08)',
    background: 'rgba(255,255,255,0.04)',
    color: '#e4e4e7', fontSize: 13, outline: 'none', boxSizing: 'border-box',
};

const greenBtn: React.CSSProperties = {
    padding: '8px 20px', borderRadius: 10, border: 'none',
    background: 'rgba(34,197,94,0.2)', color: '#86efac',
    cursor: 'pointer', fontSize: 13, fontWeight: 600,
};

const orangeBtn: React.CSSProperties = {
    padding: '8px 20px', borderRadius: 10, border: 'none',
    background: 'rgba(249,115,22,0.2)', color: '#fdba74',
    cursor: 'pointer', fontSize: 13, fontWeight: 600,
};

const cancelBtn: React.CSSProperties = {
    padding: '8px 16px', borderRadius: 10, border: 'none',
    background: 'rgba(255,255,255,0.06)', color: '#71717a',
    cursor: 'pointer', fontSize: 13,
};

export default EscalationInbox;

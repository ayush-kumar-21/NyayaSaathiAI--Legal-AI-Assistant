/**
 * CaseEscalationPipeline — Shared visual timeline for the escalation flow.
 * Used in citizen case tracker, police inbox, and judge inbox.
 */
import React from 'react';
import {
    Shield, Scale, Building, Building2, Landmark, CheckCircle2,
    AlertTriangle, Clock, ArrowRight, ChevronRight,
} from 'lucide-react';

// ── Types ────────────────────────────────────────────────

interface EscalationEntry {
    level: string;
    status: string;
    assigned_to: string;
    assigned_to_id: string;
    started_at: string;
    ended_at?: string | null;
    action_by?: string | null;
    conclusion?: string | null;
    reason?: string | null;
    notes?: string | null;
}

interface CaseData {
    id: string;
    fir_number: string;
    complainant_name: string;
    complaint_text: string;
    current_level: string;
    current_status: string;
    current_assigned_to: string;
    timeline: EscalationEntry[];
    created_at: string;
    updated_at: string;
    resolved_at?: string | null;
    conclusion?: string | null;
}

interface Props {
    caseData: CaseData;
}

// ── Level Config ─────────────────────────────────────────

const LEVEL_CONFIG: Record<string, {
    icon: React.ElementType;
    label: string;
    color: string;
    bgColor: string;
    borderColor: string;
}> = {
    police_local: {
        icon: Shield,
        label: 'Local Police Station',
        color: '#3b82f6',
        bgColor: 'rgba(59,130,246,0.1)',
        borderColor: 'rgba(59,130,246,0.3)',
    },
    police_nearby: {
        icon: Shield,
        label: 'Nearby Police Station',
        color: '#6366f1',
        bgColor: 'rgba(99,102,241,0.1)',
        borderColor: 'rgba(99,102,241,0.3)',
    },
    magistrate_court: {
        icon: Scale,
        label: 'Magistrate Court',
        color: '#f59e0b',
        bgColor: 'rgba(245,158,11,0.1)',
        borderColor: 'rgba(245,158,11,0.3)',
    },
    sessions_court: {
        icon: Building,
        label: 'Sessions Court',
        color: '#f97316',
        bgColor: 'rgba(249,115,22,0.1)',
        borderColor: 'rgba(249,115,22,0.3)',
    },
    high_court: {
        icon: Building2,
        label: 'High Court',
        color: '#ef4444',
        bgColor: 'rgba(239,68,68,0.1)',
        borderColor: 'rgba(239,68,68,0.3)',
    },
    supreme_court: {
        icon: Landmark,
        label: 'Supreme Court',
        color: '#dc2626',
        bgColor: 'rgba(220,38,38,0.1)',
        borderColor: 'rgba(220,38,38,0.3)',
    },
};

const STATUS_BADGE: Record<string, { label: string; color: string; bg: string }> = {
    pending: { label: 'Pending', color: '#fbbf24', bg: 'rgba(251,191,36,0.15)' },
    investigating: { label: 'Investigating', color: '#3b82f6', bg: 'rgba(59,130,246,0.15)' },
    resolved: { label: 'Resolved', color: '#22c55e', bg: 'rgba(34,197,94,0.15)' },
    escalated: { label: 'Escalated', color: '#f97316', bg: 'rgba(249,115,22,0.15)' },
    closed: { label: 'Closed', color: '#22c55e', bg: 'rgba(34,197,94,0.15)' },
};

const ALL_LEVELS = [
    'police_local', 'police_nearby',
    'magistrate_court', 'sessions_court',
    'high_court', 'supreme_court',
];

// ── Component ────────────────────────────────────────────

const CaseEscalationPipeline: React.FC<Props> = ({ caseData }) => {
    const { timeline, current_level, current_status } = caseData;

    // Find which levels have been visited
    const visitedLevels = new Set(timeline.map(e => e.level));
    const currentLevelIdx = ALL_LEVELS.indexOf(current_level);

    const formatDate = (iso: string) => {
        try {
            return new Date(iso).toLocaleDateString('en-IN', {
                day: 'numeric', month: 'short', year: 'numeric',
                hour: '2-digit', minute: '2-digit',
            });
        } catch { return iso; }
    };

    return (
        <div style={{ fontFamily: "'Inter', sans-serif" }}>
            {/* ── Top Progress Bar ─────────────────────────── */}
            <div style={{
                display: 'flex', alignItems: 'center', gap: 4,
                padding: '16px 0', overflowX: 'auto',
            }}>
                {ALL_LEVELS.map((lvl, i) => {
                    const cfg = LEVEL_CONFIG[lvl];
                    const Icon = cfg.icon;
                    const isVisited = visitedLevels.has(lvl);
                    const isCurrent = lvl === current_level;
                    const isPast = i < currentLevelIdx;
                    const isFuture = !isVisited && !isCurrent;

                    return (
                        <React.Fragment key={lvl}>
                            <div style={{
                                display: 'flex', flexDirection: 'column', alignItems: 'center',
                                minWidth: 80, opacity: isFuture ? 0.3 : 1,
                                transition: 'opacity 0.3s',
                            }}>
                                <div style={{
                                    width: 40, height: 40, borderRadius: '50%',
                                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                                    background: isCurrent ? cfg.color : isPast ? 'rgba(34,197,94,0.2)' : 'rgba(255,255,255,0.05)',
                                    border: `2px solid ${isCurrent ? cfg.color : isPast ? '#22c55e' : 'rgba(255,255,255,0.1)'}`,
                                    transition: 'all 0.3s',
                                }}>
                                    {isPast ? (
                                        <CheckCircle2 size={18} color="#22c55e" />
                                    ) : (
                                        <Icon size={18} color={isCurrent ? '#fff' : cfg.color} />
                                    )}
                                </div>
                                <span style={{
                                    fontSize: 10, marginTop: 4, textAlign: 'center',
                                    color: isCurrent ? cfg.color : isPast ? '#22c55e' : '#71717a',
                                    fontWeight: isCurrent ? 700 : 400,
                                }}>
                                    {cfg.label}
                                </span>
                            </div>
                            {i < ALL_LEVELS.length - 1 && (
                                <ChevronRight size={14} style={{
                                    color: isPast ? '#22c55e' : 'rgba(255,255,255,0.15)',
                                    flexShrink: 0,
                                }} />
                            )}
                        </React.Fragment>
                    );
                })}
            </div>

            {/* ── Overall Status ────────────────────────────── */}
            <div style={{
                display: 'flex', alignItems: 'center', gap: 12,
                padding: '12px 16px', borderRadius: 12,
                background: 'rgba(255,255,255,0.03)', marginBottom: 16,
                border: '1px solid rgba(255,255,255,0.06)',
            }}>
                <div>
                    <span style={{ fontSize: 12, color: '#71717a' }}>Current Status</span>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 4 }}>
                        <span style={{
                            padding: '3px 10px', borderRadius: 20, fontSize: 12, fontWeight: 600,
                            color: STATUS_BADGE[current_status]?.color || '#fff',
                            background: STATUS_BADGE[current_status]?.bg || 'rgba(255,255,255,0.1)',
                        }}>
                            {STATUS_BADGE[current_status]?.label || current_status}
                        </span>
                        <span style={{ fontSize: 13, color: '#a1a1aa' }}>
                            at <strong style={{ color: '#e4e4e7' }}>{caseData.current_assigned_to}</strong>
                        </span>
                    </div>
                </div>
            </div>

            {/* ── Timeline ──────────────────────────────────── */}
            <div style={{ position: 'relative' }}>
                {/* Vertical line */}
                <div style={{
                    position: 'absolute', left: 19, top: 0, bottom: 0,
                    width: 2, background: 'rgba(255,255,255,0.06)',
                }} />

                {timeline.map((entry, i) => {
                    const cfg = LEVEL_CONFIG[entry.level] || LEVEL_CONFIG.police_local;
                    const Icon = cfg.icon;
                    const badge = STATUS_BADGE[entry.status] || STATUS_BADGE.pending;
                    const isLast = i === timeline.length - 1;

                    return (
                        <div key={i} style={{
                            display: 'flex', gap: 16, marginBottom: 16, position: 'relative',
                        }}>
                            {/* Dot */}
                            <div style={{
                                width: 40, height: 40, borderRadius: '50%', flexShrink: 0,
                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                background: cfg.bgColor, border: `2px solid ${cfg.borderColor}`,
                                zIndex: 1,
                            }}>
                                <Icon size={16} color={cfg.color} />
                            </div>

                            {/* Card */}
                            <div style={{
                                flex: 1, padding: '12px 16px', borderRadius: 12,
                                background: isLast ? cfg.bgColor : 'rgba(255,255,255,0.02)',
                                border: `1px solid ${isLast ? cfg.borderColor : 'rgba(255,255,255,0.06)'}`,
                            }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                    <span style={{ fontWeight: 600, fontSize: 14, color: cfg.color }}>
                                        {cfg.label}
                                    </span>
                                    <span style={{
                                        padding: '2px 8px', borderRadius: 12, fontSize: 11, fontWeight: 600,
                                        color: badge.color, background: badge.bg,
                                    }}>
                                        {badge.label}
                                    </span>
                                </div>

                                <div style={{ fontSize: 13, color: '#a1a1aa', marginTop: 4 }}>
                                    {entry.assigned_to}
                                </div>

                                <div style={{ fontSize: 11, color: '#71717a', marginTop: 6, display: 'flex', gap: 12 }}>
                                    <span>⏱ {formatDate(entry.started_at)}</span>
                                    {entry.ended_at && <span>→ {formatDate(entry.ended_at)}</span>}
                                </div>

                                {entry.conclusion && (
                                    <div style={{
                                        marginTop: 8, padding: '6px 10px', borderRadius: 8,
                                        background: 'rgba(34,197,94,0.1)', border: '1px solid rgba(34,197,94,0.2)',
                                        fontSize: 12, color: '#86efac',
                                    }}>
                                        ✅ {entry.conclusion}
                                    </div>
                                )}

                                {entry.reason && (
                                    <div style={{
                                        marginTop: 8, padding: '6px 10px', borderRadius: 8,
                                        background: 'rgba(249,115,22,0.1)', border: '1px solid rgba(249,115,22,0.2)',
                                        fontSize: 12, color: '#fdba74',
                                    }}>
                                        ⚠️ Escalated: {entry.reason}
                                    </div>
                                )}

                                {entry.action_by && (
                                    <div style={{ fontSize: 11, color: '#71717a', marginTop: 4 }}>
                                        Action by: {entry.action_by}
                                    </div>
                                )}
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* ── Conclusion Banner ─────────────────────────── */}
            {caseData.conclusion && (
                <div style={{
                    marginTop: 16, padding: '16px 20px', borderRadius: 12,
                    background: 'linear-gradient(135deg, rgba(34,197,94,0.15), rgba(16,185,129,0.1))',
                    border: '1px solid rgba(34,197,94,0.3)',
                }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
                        <CheckCircle2 size={18} color="#22c55e" />
                        <span style={{ fontWeight: 700, fontSize: 15, color: '#22c55e' }}>Case Resolved</span>
                    </div>
                    <p style={{ fontSize: 13, color: '#d4d4d8', margin: 0 }}>{caseData.conclusion}</p>
                    {caseData.resolved_at && (
                        <span style={{ fontSize: 11, color: '#71717a', marginTop: 4, display: 'block' }}>
                            Resolved on {formatDate(caseData.resolved_at)}
                        </span>
                    )}
                </div>
            )}
        </div>
    );
};

export default CaseEscalationPipeline;

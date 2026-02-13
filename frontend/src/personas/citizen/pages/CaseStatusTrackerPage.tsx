import React, { useState } from 'react';
import { caseStatusService, getStageColor, getStageLabel } from '../../../core/services/caseStatusService';
import { CaseStatusRequest, CaseStatusResponse } from '../../../core/types/caseStatus';

const CaseStatusTrackerPage: React.FC = () => {
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState<CaseStatusResponse | null>(null);
    const [cnr, setCnr] = useState('');

    const handleTrack = async () => {
        setLoading(true);
        try {
            const req: CaseStatusRequest = { cnr_number: cnr || undefined };
            const { data } = await caseStatusService.track(req);
            setResult(data);
        } catch {
            try { const { data } = await caseStatusService.testTrack(); setResult(data); } catch { }
        }
        setLoading(false);
    };

    const handleTest = async () => {
        setLoading(true);
        try { const { data } = await caseStatusService.testTrack(); setResult(data); } catch { }
        setLoading(false);
    };

    const stages = ['fir_filed', 'investigation', 'chargesheet_filed', 'trial_commenced', 'evidence_stage', 'arguments', 'judgment_reserved', 'judgment_delivered', 'disposed'];

    return (
        <div style={{ padding: '2rem', maxWidth: 1000, margin: '0 auto' }}>
            <div style={{ background: 'linear-gradient(135deg, #0c4a6e 0%, #0369a1 100%)', borderRadius: 16, padding: '2rem', marginBottom: '2rem', color: '#fff' }}>
                <h1 style={{ fontSize: '1.8rem', margin: 0 }}>📊 Case Status Tracker</h1>
                <p style={{ opacity: 0.8, marginTop: 8 }}>Track your case progress in real-time using CNR number</p>
            </div>

            <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '2rem' }}>
                <input placeholder="Enter CNR Number (e.g., DLHC01-000001-2025)" value={cnr} onChange={e => setCnr(e.target.value)}
                    onKeyDown={e => e.key === 'Enter' && handleTrack()}
                    style={{ flex: 1, padding: '0.75rem', borderRadius: 8, border: '1px solid #374151', background: '#1f2937', color: '#fff' }} />
                <button onClick={handleTrack} disabled={loading}
                    style={{ padding: '0.75rem 1.5rem', borderRadius: 8, background: '#0284c7', color: '#fff', border: 'none', cursor: 'pointer', fontWeight: 600 }}>
                    {loading ? '...' : '🔍 Track'}
                </button>
                <button onClick={handleTest} disabled={loading}
                    style={{ padding: '0.75rem 1rem', borderRadius: 8, background: '#374151', color: '#fff', border: '1px solid #4b5563', cursor: 'pointer' }}>
                    🧪
                </button>
            </div>

            {result && (
                <div>
                    <div style={{ background: '#111827', borderRadius: 12, padding: '1.5rem', border: '1px solid #374151', marginBottom: '1.5rem' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
                            <div>
                                <h2 style={{ color: '#fff', margin: 0 }}>{result.case_title}</h2>
                                <div style={{ color: '#9ca3af', marginTop: 4 }}>CNR: {result.cnr_number} | {result.case_type}</div>
                            </div>
                            <span style={{ padding: '0.5rem 1rem', borderRadius: 20, background: getStageColor(result.current_stage), color: '#fff', fontWeight: 600 }}>
                                {getStageLabel(result.current_stage)}
                            </span>
                        </div>

                        {/* Progress Bar */}
                        <div style={{ background: '#1f2937', borderRadius: 8, height: 8, marginBottom: '1rem', overflow: 'hidden' }}>
                            <div style={{ background: `linear-gradient(90deg, #3b82f6, ${getStageColor(result.current_stage)})`, height: '100%', width: `${result.stage_percentage}%`, borderRadius: 8, transition: 'width 0.5s' }} />
                        </div>
                        <div style={{ color: '#9ca3af', fontSize: '0.85rem', textAlign: 'right' }}>{result.stage_percentage}% complete</div>

                        {/* Stage Timeline */}
                        <div style={{ display: 'flex', justifyContent: 'space-between', margin: '1rem 0', overflow: 'auto' }}>
                            {stages.map((s, i) => {
                                const currentIdx = stages.indexOf(result.current_stage);
                                const isActive = i <= currentIdx;
                                return (
                                    <div key={s} style={{ textAlign: 'center', flex: 1, minWidth: 60 }}>
                                        <div style={{ width: 12, height: 12, borderRadius: '50%', background: isActive ? getStageColor(result.current_stage) : '#374151', margin: '0 auto 4px' }} />
                                        <div style={{ fontSize: '0.6rem', color: isActive ? '#fff' : '#6b7280' }}>{getStageLabel(s)}</div>
                                    </div>
                                );
                            })}
                        </div>

                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1rem', marginTop: '1rem' }}>
                            <div style={{ background: '#1f2937', padding: '0.75rem', borderRadius: 8 }}>
                                <div style={{ color: '#9ca3af', fontSize: '0.8rem' }}>Court</div>
                                <div style={{ color: '#fff' }}>{result.court}</div>
                            </div>
                            <div style={{ background: '#1f2937', padding: '0.75rem', borderRadius: 8 }}>
                                <div style={{ color: '#9ca3af', fontSize: '0.8rem' }}>Judge</div>
                                <div style={{ color: '#fff' }}>{result.judge}</div>
                            </div>
                            <div style={{ background: '#1f2937', padding: '0.75rem', borderRadius: 8 }}>
                                <div style={{ color: '#9ca3af', fontSize: '0.8rem' }}>Next Hearing</div>
                                <div style={{ color: '#60a5fa', fontWeight: 600 }}>{result.next_hearing || 'N/A'}</div>
                            </div>
                        </div>
                    </div>

                    {/* Hearing History */}
                    <div style={{ background: '#111827', borderRadius: 12, padding: '1.5rem', border: '1px solid #374151' }}>
                        <h3 style={{ color: '#fff', margin: '0 0 1rem' }}>📅 Hearing History</h3>
                        {result.hearings.map((h, i) => (
                            <div key={i} style={{ display: 'flex', gap: '1rem', padding: '0.75rem 0', borderBottom: i < result.hearings.length - 1 ? '1px solid #1f2937' : 'none' }}>
                                <div style={{ color: '#60a5fa', fontWeight: 600, minWidth: 100 }}>{h.date}</div>
                                <div style={{ flex: 1 }}>
                                    <div style={{ color: '#fff' }}>{h.purpose}</div>
                                    <div style={{ color: '#9ca3af', fontSize: '0.85rem' }}>{h.result}</div>
                                </div>
                            </div>
                        ))}
                    </div>

                    <div style={{ background: '#1f2937', borderRadius: 8, padding: '1rem', marginTop: '1rem', color: '#d1d5db', textAlign: 'center' }}>
                        ⏱️ {result.estimated_timeline}
                    </div>
                </div>
            )}
        </div>
    );
};

export default CaseStatusTrackerPage;

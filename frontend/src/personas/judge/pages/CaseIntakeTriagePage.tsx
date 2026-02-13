import React, { useState } from 'react';
import { triageService, getUrgencyColor } from '../../../core/services/triageService';
import { TriageRequest, TriageResult } from '../../../core/types/triage';

const CaseIntakeTriagePage: React.FC = () => {
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState<TriageResult | null>(null);
    const [form, setForm] = useState<TriageRequest>({
        case_id: '', case_title: '', case_type: 'bail',
        accused_in_custody: false, custody_days: 0,
        is_minor_involved: false, is_woman_complainant: false,
        is_senior_citizen: false, brief_facts: '',
        offense_sections: [],
    });

    const handleSubmit = async () => {
        setLoading(true);
        try {
            const { data } = await triageService.analyze(form);
            setResult(data);
        } catch { /* fallback to test */
            try { const { data } = await triageService.testAnalyze(); setResult(data); } catch { }
        }
        setLoading(false);
    };

    const handleTest = async () => {
        setLoading(true);
        try { const { data } = await triageService.testAnalyze(); setResult(data); } catch { }
        setLoading(false);
    };

    return (
        <div style={{ padding: '2rem', maxWidth: 1000, margin: '0 auto' }}>
            <div style={{ background: 'linear-gradient(135deg, #1e1b4b 0%, #312e81 100%)', borderRadius: 16, padding: '2rem', marginBottom: '2rem', color: '#fff' }}>
                <h1 style={{ fontSize: '1.8rem', margin: 0 }}>⚡ Case Intake Triage</h1>
                <p style={{ opacity: 0.8, marginTop: 8 }}>AI-powered urgency classification for incoming cases</p>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
                <input placeholder="Case ID" value={form.case_id} onChange={e => setForm({ ...form, case_id: e.target.value })}
                    style={{ padding: '0.75rem', borderRadius: 8, border: '1px solid #374151', background: '#1f2937', color: '#fff' }} />
                <input placeholder="Case Title" value={form.case_title} onChange={e => setForm({ ...form, case_title: e.target.value })}
                    style={{ padding: '0.75rem', borderRadius: 8, border: '1px solid #374151', background: '#1f2937', color: '#fff' }} />
                <select value={form.case_type} onChange={e => setForm({ ...form, case_type: e.target.value })}
                    style={{ padding: '0.75rem', borderRadius: 8, border: '1px solid #374151', background: '#1f2937', color: '#fff' }}>
                    {['bail', 'remand', 'anticipatory_bail', 'quashing', 'appeals', 'civil', 'writ'].map(t => <option key={t} value={t}>{t.replace('_', ' ').toUpperCase()}</option>)}
                </select>
                <input placeholder="Custody Days" type="number" value={form.custody_days} onChange={e => setForm({ ...form, custody_days: +e.target.value })}
                    style={{ padding: '0.75rem', borderRadius: 8, border: '1px solid #374151', background: '#1f2937', color: '#fff' }} />
            </div>

            <div style={{ display: 'flex', gap: '1rem', marginBottom: '1rem', flexWrap: 'wrap' }}>
                {[{ key: 'accused_in_custody', label: 'Accused in Custody' }, { key: 'is_minor_involved', label: 'Minor Involved' },
                { key: 'is_woman_complainant', label: 'Woman Complainant' }, { key: 'is_senior_citizen', label: 'Senior Citizen' }
                ].map(({ key, label }) => (
                    <label key={key} style={{ display: 'flex', alignItems: 'center', gap: 6, color: '#d1d5db', cursor: 'pointer' }}>
                        <input type="checkbox" checked={(form as any)[key]} onChange={e => setForm({ ...form, [key]: e.target.checked })} />
                        {label}
                    </label>
                ))}
            </div>

            <textarea placeholder="Brief Facts..." value={form.brief_facts} onChange={e => setForm({ ...form, brief_facts: e.target.value })}
                style={{ width: '100%', padding: '0.75rem', borderRadius: 8, border: '1px solid #374151', background: '#1f2937', color: '#fff', minHeight: 80, marginBottom: '1rem' }} />

            <div style={{ display: 'flex', gap: '1rem' }}>
                <button onClick={handleSubmit} disabled={loading}
                    style={{ padding: '0.75rem 2rem', borderRadius: 8, background: '#4f46e5', color: '#fff', border: 'none', cursor: 'pointer', fontWeight: 600 }}>
                    {loading ? 'Analyzing...' : '⚡ Triage Case'}
                </button>
                <button onClick={handleTest} disabled={loading}
                    style={{ padding: '0.75rem 2rem', borderRadius: 8, background: '#374151', color: '#fff', border: '1px solid #4b5563', cursor: 'pointer' }}>
                    🧪 Test with Sample
                </button>
            </div>

            {result && (
                <div style={{ marginTop: '2rem', background: '#111827', borderRadius: 12, padding: '1.5rem', border: '1px solid #374151' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                        <h2 style={{ color: '#fff', margin: 0 }}>Triage Result</h2>
                        <span style={{ padding: '0.5rem 1rem', borderRadius: 20, background: getUrgencyColor(result.urgency_level), color: '#fff', fontWeight: 700, textTransform: 'uppercase' }}>
                            {result.urgency_level}
                        </span>
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
                        <div style={{ background: '#1f2937', padding: '1rem', borderRadius: 8, textAlign: 'center' }}>
                            <div style={{ color: '#9ca3af', fontSize: '0.85rem' }}>Score</div>
                            <div style={{ color: getUrgencyColor(result.urgency_level), fontSize: '2rem', fontWeight: 700 }}>{result.urgency_score.toFixed(0)}</div>
                        </div>
                        <div style={{ background: '#1f2937', padding: '1rem', borderRadius: 8, textAlign: 'center' }}>
                            <div style={{ color: '#9ca3af', fontSize: '0.85rem' }}>Recommended Date</div>
                            <div style={{ color: '#fff', fontSize: '1.2rem', fontWeight: 600 }}>{result.recommended_hearing_date}</div>
                        </div>
                        <div style={{ background: '#1f2937', padding: '1rem', borderRadius: 8, textAlign: 'center' }}>
                            <div style={{ color: '#9ca3af', fontSize: '0.85rem' }}>Bench</div>
                            <div style={{ color: '#fff', fontSize: '1rem' }}>{result.recommended_bench}</div>
                        </div>
                    </div>
                    {result.statutory_alerts.length > 0 && (
                        <div style={{ background: '#7f1d1d', padding: '1rem', borderRadius: 8, marginBottom: '1rem' }}>
                            {result.statutory_alerts.map((a, i) => <div key={i} style={{ color: '#fca5a5' }}>{a}</div>)}
                        </div>
                    )}
                    {result.factors.map((f, i) => (
                        <div key={i} style={{ display: 'flex', justifyContent: 'space-between', padding: '0.5rem 0', borderBottom: '1px solid #1f2937', color: '#d1d5db' }}>
                            <span>{f.factor}: {f.description}</span>
                            <span style={{ color: f.impact === 'increases_urgency' ? '#ef4444' : '#22c55e' }}>w={f.weight}</span>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default CaseIntakeTriagePage;

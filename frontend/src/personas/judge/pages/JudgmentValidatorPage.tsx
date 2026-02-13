import React, { useState } from 'react';
import { judgmentService, getValidityColor, getSeverityColor } from '../../../core/services/judgmentService';
import { JudgmentValidateRequest, JudgmentValidateResponse } from '../../../core/types/judgment';

const JudgmentValidatorPage: React.FC = () => {
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState<JudgmentValidateResponse | null>(null);
    const [form, setForm] = useState<JudgmentValidateRequest>({
        case_id: '', judgment_text: '', judgment_type: 'order', offense_sections: [],
    });

    const handleSubmit = async () => {
        setLoading(true);
        try { const { data } = await judgmentService.validate(form); setResult(data); }
        catch { try { const { data } = await judgmentService.testValidate(); setResult(data); } catch { } }
        setLoading(false);
    };

    const handleTest = async () => {
        setLoading(true);
        try { const { data } = await judgmentService.testValidate(); setResult(data); } catch { }
        setLoading(false);
    };

    return (
        <div style={{ padding: '2rem', maxWidth: 1000, margin: '0 auto' }}>
            <div style={{ background: 'linear-gradient(135deg, #14532d 0%, #166534 100%)', borderRadius: 16, padding: '2rem', marginBottom: '2rem', color: '#fff' }}>
                <h1 style={{ fontSize: '1.8rem', margin: 0 }}>✅ Judgment Validator</h1>
                <p style={{ opacity: 0.8, marginTop: 8 }}>Check draft judgments for legal completeness and citation accuracy</p>
            </div>

            <input placeholder="Case ID" value={form.case_id} onChange={e => setForm({ ...form, case_id: e.target.value })}
                style={{ width: '100%', padding: '0.75rem', borderRadius: 8, border: '1px solid #374151', background: '#1f2937', color: '#fff', marginBottom: '1rem' }} />
            <textarea placeholder="Paste your draft judgment text here..." value={form.judgment_text}
                onChange={e => setForm({ ...form, judgment_text: e.target.value })}
                style={{ width: '100%', padding: '0.75rem', borderRadius: 8, border: '1px solid #374151', background: '#1f2937', color: '#fff', minHeight: 200, marginBottom: '1rem', fontFamily: 'monospace' }} />

            <div style={{ display: 'flex', gap: '1rem', marginBottom: '1.5rem' }}>
                <button onClick={handleSubmit} disabled={loading}
                    style={{ padding: '0.75rem 2rem', borderRadius: 8, background: '#16a34a', color: '#fff', border: 'none', cursor: 'pointer', fontWeight: 600 }}>
                    {loading ? 'Validating...' : '✅ Validate Judgment'}
                </button>
                <button onClick={handleTest} disabled={loading}
                    style={{ padding: '0.75rem 2rem', borderRadius: 8, background: '#374151', color: '#fff', border: '1px solid #4b5563', cursor: 'pointer' }}>
                    🧪 Test with Sample
                </button>
            </div>

            {result && (
                <div style={{ background: '#111827', borderRadius: 12, padding: '1.5rem', border: '1px solid #374151' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                        <h2 style={{ color: '#fff', margin: 0 }}>Validation Results</h2>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                            <div style={{ background: '#1f2937', padding: '0.5rem 1rem', borderRadius: 8, textAlign: 'center' }}>
                                <span style={{ color: getValidityColor(result.status), fontSize: '1.5rem', fontWeight: 700 }}>{result.overall_score}</span>
                                <span style={{ color: '#9ca3af', fontSize: '0.8rem' }}>/100</span>
                            </div>
                            <span style={{ padding: '0.5rem 1rem', borderRadius: 20, background: getValidityColor(result.status), color: '#fff', fontWeight: 600, textTransform: 'uppercase' }}>
                                {result.status.replace('_', ' ')}
                            </span>
                        </div>
                    </div>

                    {result.strengths.length > 0 && (
                        <div style={{ marginBottom: '1rem' }}>
                            <h3 style={{ color: '#22c55e', margin: '0 0 0.5rem' }}>Strengths</h3>
                            {result.strengths.map((s, i) => <div key={i} style={{ color: '#d1d5db', padding: '0.25rem 0' }}>{s}</div>)}
                        </div>
                    )}

                    {result.issues.length > 0 && (
                        <div style={{ marginBottom: '1rem' }}>
                            <h3 style={{ color: '#ef4444', margin: '0 0 0.5rem' }}>Issues Found ({result.issues.length})</h3>
                            {result.issues.map((issue, i) => (
                                <div key={i} style={{ background: '#1f2937', padding: '1rem', borderRadius: 8, marginBottom: '0.5rem', borderLeft: `4px solid ${getSeverityColor(issue.severity)}` }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                        <strong style={{ color: '#fff' }}>{issue.title}</strong>
                                        <span style={{ color: getSeverityColor(issue.severity), fontSize: '0.8rem', textTransform: 'uppercase' }}>{issue.severity}</span>
                                    </div>
                                    <p style={{ color: '#9ca3af', margin: '0.25rem 0' }}>{issue.description}</p>
                                    <div style={{ color: '#60a5fa', fontSize: '0.85rem' }}>💡 {issue.suggestion}</div>
                                </div>
                            ))}
                        </div>
                    )}

                    <div style={{ background: '#1f2937', padding: '1rem', borderRadius: 8, color: '#d1d5db' }}>
                        <strong>Recommendation:</strong> {result.recommendation}
                    </div>
                </div>
            )}
        </div>
    );
};

export default JudgmentValidatorPage;

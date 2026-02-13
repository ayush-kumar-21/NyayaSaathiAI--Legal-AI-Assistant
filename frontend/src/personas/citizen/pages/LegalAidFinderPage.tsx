import React, { useState } from 'react';
import { legalAidService, getEligibilityColor, getAidTypeLabel } from '../../../core/services/legalAidService';
import { LegalAidRequest, LegalAidResponse } from '../../../core/types/legalAid';

const LegalAidFinderPage: React.FC = () => {
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState<LegalAidResponse | null>(null);
    const [form, setForm] = useState<LegalAidRequest>({
        category: 'criminal', district: '', state: 'Delhi',
        annual_income: undefined, is_sc_st: false, is_woman: false,
        is_minor: false, is_disabled: false, case_description: '',
    });

    const handleSubmit = async () => {
        setLoading(true);
        try { const { data } = await legalAidService.find(form); setResult(data); }
        catch { try { const { data } = await legalAidService.testFind(); setResult(data); } catch { } }
        setLoading(false);
    };

    const handleTest = async () => {
        setLoading(true);
        try { const { data } = await legalAidService.testFind(); setResult(data); } catch { }
        setLoading(false);
    };

    return (
        <div style={{ padding: '2rem', maxWidth: 1000, margin: '0 auto' }}>
            <div style={{ background: 'linear-gradient(135deg, #581c87 0%, #7e22ce 100%)', borderRadius: 16, padding: '2rem', marginBottom: '2rem', color: '#fff' }}>
                <h1 style={{ fontSize: '1.8rem', margin: 0 }}>🤝 Legal Aid Finder</h1>
                <p style={{ opacity: 0.8, marginTop: 8 }}>Find free legal aid services under NALSA — it's your right</p>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
                <select value={form.category} onChange={e => setForm({ ...form, category: e.target.value })}
                    style={{ padding: '0.75rem', borderRadius: 8, border: '1px solid #374151', background: '#1f2937', color: '#fff' }}>
                    {['criminal', 'civil', 'family', 'labour', 'consumer', 'property'].map(c => <option key={c} value={c}>{c.toUpperCase()}</option>)}
                </select>
                <input placeholder="District (e.g., South Delhi)" value={form.district} onChange={e => setForm({ ...form, district: e.target.value })}
                    style={{ padding: '0.75rem', borderRadius: 8, border: '1px solid #374151', background: '#1f2937', color: '#fff' }} />
                <input placeholder="Annual Income (₹)" type="number" value={form.annual_income || ''} onChange={e => setForm({ ...form, annual_income: e.target.value ? +e.target.value : undefined })}
                    style={{ padding: '0.75rem', borderRadius: 8, border: '1px solid #374151', background: '#1f2937', color: '#fff' }} />
                <input placeholder="State" value={form.state} onChange={e => setForm({ ...form, state: e.target.value })}
                    style={{ padding: '0.75rem', borderRadius: 8, border: '1px solid #374151', background: '#1f2937', color: '#fff' }} />
            </div>

            <div style={{ display: 'flex', gap: '1rem', marginBottom: '1rem', flexWrap: 'wrap' }}>
                {[{ key: 'is_sc_st', label: 'SC/ST' }, { key: 'is_woman', label: 'Woman' },
                { key: 'is_minor', label: 'Minor' }, { key: 'is_disabled', label: 'Person with Disability' }
                ].map(({ key, label }) => (
                    <label key={key} style={{ display: 'flex', alignItems: 'center', gap: 6, color: '#d1d5db', cursor: 'pointer' }}>
                        <input type="checkbox" checked={(form as any)[key]} onChange={e => setForm({ ...form, [key]: e.target.checked })} />
                        {label}
                    </label>
                ))}
            </div>

            <textarea placeholder="Brief case description..." value={form.case_description} onChange={e => setForm({ ...form, case_description: e.target.value })}
                style={{ width: '100%', padding: '0.75rem', borderRadius: 8, border: '1px solid #374151', background: '#1f2937', color: '#fff', minHeight: 80, marginBottom: '1rem' }} />

            <div style={{ display: 'flex', gap: '1rem', marginBottom: '2rem' }}>
                <button onClick={handleSubmit} disabled={loading}
                    style={{ padding: '0.75rem 2rem', borderRadius: 8, background: '#7c3aed', color: '#fff', border: 'none', cursor: 'pointer', fontWeight: 600 }}>
                    {loading ? 'Finding...' : '🔍 Find Legal Aid'}
                </button>
                <button onClick={handleTest} disabled={loading}
                    style={{ padding: '0.75rem 2rem', borderRadius: 8, background: '#374151', color: '#fff', border: '1px solid #4b5563', cursor: 'pointer' }}>
                    🧪 Test with Sample
                </button>
            </div>

            {result && (
                <div>
                    {/* Eligibility Card */}
                    <div style={{ background: '#111827', borderRadius: 12, padding: '1.5rem', border: '1px solid #374151', marginBottom: '1.5rem' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <h2 style={{ color: '#fff', margin: 0 }}>Eligibility Status</h2>
                            <span style={{ padding: '0.5rem 1.5rem', borderRadius: 20, background: getEligibilityColor(result.eligibility), color: '#fff', fontWeight: 700, textTransform: 'uppercase' }}>
                                {result.eligibility.replace('_', ' ')}
                            </span>
                        </div>
                        <p style={{ color: '#d1d5db', marginTop: 8 }}>{result.eligibility_reason}</p>
                    </div>

                    {/* Providers */}
                    <h3 style={{ color: '#fff', marginBottom: '0.75rem' }}>📍 Available Providers ({result.providers.length})</h3>
                    {result.providers.map((p, i) => (
                        <div key={i} style={{ background: '#111827', borderRadius: 12, padding: '1.25rem', marginBottom: '0.75rem', border: '1px solid #374151' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                                <div>
                                    <h4 style={{ color: '#a78bfa', margin: 0 }}>{p.name}</h4>
                                    <div style={{ color: '#9ca3af', fontSize: '0.85rem' }}>{p.address}</div>
                                </div>
                                <span style={{ background: '#2e1065', padding: '0.25rem 0.75rem', borderRadius: 12, color: '#c4b5fd', fontSize: '0.8rem' }}>
                                    {getAidTypeLabel(p.type)}
                                </span>
                            </div>
                            <div style={{ display: 'flex', gap: '1rem', marginTop: '0.75rem', flexWrap: 'wrap' }}>
                                <span style={{ color: '#60a5fa', fontSize: '0.85rem' }}>📞 {p.contact_phone}</span>
                                <span style={{ color: '#d1d5db', fontSize: '0.85rem' }}>🕐 {p.availability}</span>
                                <span style={{ color: '#fbbf24', fontSize: '0.85rem' }}>⭐ {p.rating}</span>
                            </div>
                        </div>
                    ))}

                    {/* Helplines */}
                    <div style={{ background: '#1e1b4b', borderRadius: 12, padding: '1.5rem', marginTop: '1rem', border: '1px solid #4338ca' }}>
                        <h3 style={{ color: '#fff', margin: '0 0 0.75rem' }}>📞 Helpline Numbers</h3>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.75rem' }}>
                            {result.helpline_numbers.map((h, i) => (
                                <div key={i} style={{ background: '#312e81', padding: '0.75rem', borderRadius: 8, textAlign: 'center' }}>
                                    <div style={{ color: '#c7d2fe', fontSize: '0.8rem' }}>{h.name}</div>
                                    <div style={{ color: '#fff', fontSize: '1.3rem', fontWeight: 700 }}>{h.number}</div>
                                    <div style={{ color: '#818cf8', fontSize: '0.7rem' }}>{h.hours}</div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Steps */}
                    <div style={{ background: '#111827', borderRadius: 12, padding: '1.5rem', marginTop: '1rem', border: '1px solid #374151' }}>
                        <h3 style={{ color: '#fff', margin: '0 0 0.75rem' }}>📝 How to Apply</h3>
                        {result.application_steps.map((s, i) => <div key={i} style={{ color: '#d1d5db', padding: '0.25rem 0' }}>{s}</div>)}
                    </div>
                </div>
            )}
        </div>
    );
};

export default LegalAidFinderPage;

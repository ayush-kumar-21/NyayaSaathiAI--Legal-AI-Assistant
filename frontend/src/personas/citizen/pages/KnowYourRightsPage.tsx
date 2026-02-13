import React, { useState } from 'react';
import { rightsService, getCategoryIcon } from '../../../core/services/rightsService';
import { RightsQueryRequest, RightsQueryResponse, RightsCategory } from '../../../core/types/rights';

const KnowYourRightsPage: React.FC = () => {
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState<RightsQueryResponse | null>(null);
    const [query, setQuery] = useState('');
    const [category, setCategory] = useState<RightsCategory | ''>('');

    const categories: RightsCategory[] = ['arrest', 'bail', 'fir', 'women', 'children', 'cyber', 'property', 'consumer', 'labour', 'rti'];

    const handleSearch = async () => {
        setLoading(true);
        try {
            const req: RightsQueryRequest = { query, ...(category ? { category: category as RightsCategory } : {}) };
            const { data } = await rightsService.query(req);
            setResult(data);
        } catch {
            try { const { data } = await rightsService.testQuery(); setResult(data); } catch { }
        }
        setLoading(false);
    };

    const handleTest = async () => {
        setLoading(true);
        try { const { data } = await rightsService.testQuery(); setResult(data); } catch { }
        setLoading(false);
    };

    return (
        <div style={{ padding: '2rem', maxWidth: 1000, margin: '0 auto' }}>
            <div style={{ background: 'linear-gradient(135deg, #7c2d12 0%, #c2410c 100%)', borderRadius: 16, padding: '2rem', marginBottom: '2rem', color: '#fff' }}>
                <h1 style={{ fontSize: '1.8rem', margin: 0 }}>📖 Know Your Rights</h1>
                <p style={{ opacity: 0.8, marginTop: 8 }}>Your fundamental legal rights as an Indian citizen</p>
            </div>

            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', marginBottom: '1rem' }}>
                {categories.map(c => (
                    <button key={c} onClick={() => setCategory(c === category ? '' : c)}
                        style={{
                            padding: '0.5rem 1rem', borderRadius: 20, border: category === c ? '2px solid #f97316' : '1px solid #374151',
                            background: category === c ? '#431407' : '#1f2937', color: '#fff', cursor: 'pointer', fontSize: '0.85rem'
                        }}>
                        {getCategoryIcon(c)} {c.replace('_', ' ').toUpperCase()}
                    </button>
                ))}
            </div>

            <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.5rem' }}>
                <input placeholder="Ask about your rights... e.g. 'What are my rights if arrested?'" value={query}
                    onChange={e => setQuery(e.target.value)} onKeyDown={e => e.key === 'Enter' && handleSearch()}
                    style={{ flex: 1, padding: '0.75rem', borderRadius: 8, border: '1px solid #374151', background: '#1f2937', color: '#fff' }} />
                <button onClick={handleSearch} disabled={loading}
                    style={{ padding: '0.75rem 1.5rem', borderRadius: 8, background: '#ea580c', color: '#fff', border: 'none', cursor: 'pointer', fontWeight: 600 }}>
                    {loading ? '...' : '🔍'}
                </button>
                <button onClick={handleTest} disabled={loading}
                    style={{ padding: '0.75rem 1rem', borderRadius: 8, background: '#374151', color: '#fff', border: '1px solid #4b5563', cursor: 'pointer' }}>
                    🧪
                </button>
            </div>

            {result && (
                <div>
                    {result.rights.map((right, i) => (
                        <div key={i} style={{ background: '#111827', borderRadius: 12, padding: '1.5rem', marginBottom: '1rem', border: '1px solid #374151' }}>
                            <h3 style={{ color: '#f97316', margin: '0 0 0.5rem' }}>{right.title}</h3>
                            <p style={{ color: '#d1d5db', margin: '0 0 0.75rem' }}>{right.description}</p>
                            <div style={{ color: '#60a5fa', fontSize: '0.85rem', marginBottom: '0.75rem' }}>📜 {right.legal_basis}</div>

                            <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '0.5rem', marginBottom: '0.75rem' }}>
                                {right.key_points.map((p, j) => <div key={j} style={{ color: '#e5e7eb', padding: '0.25rem 0' }}>• {p}</div>)}
                            </div>

                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                                <div style={{ background: '#052e16', padding: '0.75rem', borderRadius: 8 }}>
                                    <strong style={{ color: '#22c55e' }}>✅ DO</strong>
                                    {right.dos.map((d, j) => <div key={j} style={{ color: '#86efac', fontSize: '0.85rem', paddingTop: 4 }}>• {d}</div>)}
                                </div>
                                <div style={{ background: '#450a0a', padding: '0.75rem', borderRadius: 8 }}>
                                    <strong style={{ color: '#ef4444' }}>❌ DON'T</strong>
                                    {right.donts.map((d, j) => <div key={j} style={{ color: '#fca5a5', fontSize: '0.85rem', paddingTop: 4 }}>• {d}</div>)}
                                </div>
                            </div>
                        </div>
                    ))}

                    {result.emergency_contacts.length > 0 && (
                        <div style={{ background: '#1e1b4b', borderRadius: 12, padding: '1.5rem', border: '1px solid #4338ca' }}>
                            <h3 style={{ color: '#fff', margin: '0 0 0.75rem' }}>📞 Emergency Contacts</h3>
                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.75rem' }}>
                                {result.emergency_contacts.map((c, i) => (
                                    <div key={i} style={{ background: '#312e81', padding: '0.75rem', borderRadius: 8, textAlign: 'center' }}>
                                        <div style={{ color: '#c7d2fe', fontSize: '0.8rem' }}>{c.name}</div>
                                        <div style={{ color: '#fff', fontSize: '1.3rem', fontWeight: 700 }}>{c.number}</div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default KnowYourRightsPage;

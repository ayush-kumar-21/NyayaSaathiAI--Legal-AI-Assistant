import React, { useState } from 'react';
import { listingService } from '../core/services/listingService';
import { registryService } from '../core/services/registryService';
import api from '../core/services/api';

const TestDashboard: React.FC = () => {
    const [logs, setLogs] = useState<string[]>([]);
    const [activeTest, setActiveTest] = useState<string | null>(null);

    const addLog = (message: string) => {
        setLogs(prev => [...prev, message]);
        console.log(message);
    };

    const clearLogs = () => setLogs([]);

    // ===== Skill 19: Registry Tests =====
    const runRegistryTests = async () => {
        clearLogs();
        setActiveTest('registry');
        addLog('📋 Testing Skill 19: Registry Automator\n');

        try {
            addLog('1️⃣ Running document scrutiny...');
            const scrutiny = await registryService.scrutinizeDocument(
                'http://example.com/test-petition.pdf'
            );
            addLog(`✅ Scrutiny complete!`);
            addLog(`📄 Filing ID: ${scrutiny.filing_id}`);
            addLog(`📊 Status: ${scrutiny.status}`);
            addLog(`🔍 Defects found: ${scrutiny.defect_count}`);
            if (scrutiny.defects_found.length > 0) {
                scrutiny.defects_found.forEach((d, i) => {
                    addLog(`   ${i + 1}. [${d.severity.toUpperCase()}] ${d.description}`);
                });
            }
            addLog(`💡 Summary: ${scrutiny.ai_summary}`);

            addLog('\n2️⃣ Calculating court fees...');
            const fees = await registryService.calculateFees('civil_suit', 500000);
            addLog(`✅ Fee calculation complete!`);
            addLog(`💰 Total: ${registryService.formatCurrency(fees.fee_breakdown.total_fee)}`);

            addLog('\n✅ All Registry tests passed!');
        } catch (error: any) {
            addLog(`❌ Registry test failed: ${error.message || error}`);
        }
        setActiveTest(null);
    };

    // ===== Skill 20: Listing Tests =====
    const runListingTests = async () => {
        clearLogs();
        setActiveTest('listing');
        addLog('🎯 Testing Skill 20: Listing Optimizer\n');

        try {
            addLog('1️⃣ Fetching pending cases...');
            const cases = await listingService.getCurrentCauseList('COURT-01');
            addLog(`✅ Found ${cases.length} cases`);

            addLog('\n2️⃣ Running optimization...');
            const schedule = await listingService.optimizeSchedule(cases);
            addLog('✅ Optimization complete!');
            addLog(`📊 Cases scheduled: ${schedule.total_cases}`);
            addLog(`📊 Utilization: ${schedule.utilization_percentage}%`);

            addLog('\n✅ All Listing tests passed!');
        } catch (error: any) {
            addLog(`❌ Listing test failed: ${error.message || error}`);
        }
        setActiveTest(null);
    };

    // ===== Generic API Test Runner =====
    const runApiTest = async (name: string, endpoint: string, emoji: string) => {
        clearLogs();
        setActiveTest(name);
        addLog(`${emoji} Testing ${name}\n`);
        try {
            addLog('▶️ Calling test endpoint...');
            const { data } = await api.post(endpoint);
            addLog('✅ Response received!');
            addLog(`📋 Result:\n${JSON.stringify(data, null, 2).slice(0, 1500)}`);
            addLog(`\n✅ ${name} test passed!`);
        } catch (error: any) {
            addLog(`❌ ${name} test failed: ${error?.response?.data?.detail || error.message || error}`);
        }
        setActiveTest(null);
    };

    const testCards = [
        { name: 'Skill 19: Registry', fn: runRegistryTests, emoji: '📋', color: 'amber', key: 'registry' },
        { name: 'Skill 20: Listing', fn: runListingTests, emoji: '🎯', color: 'blue', key: 'listing' },
        { name: 'Skill 18: Case Triage', fn: () => runApiTest('Skill 18: Case Triage', '/judge/triage/test-analyze', '⚡'), emoji: '⚡', color: 'indigo', key: 'triage' },
        { name: 'Skill 21: Judgment Validator', fn: () => runApiTest('Skill 21: Judgment Validator', '/judge/judgment/test-validate', '✅'), emoji: '✅', color: 'green', key: 'judgment' },
        { name: 'Skill 22: Know Your Rights', fn: () => runApiTest('Skill 22: Know Your Rights', '/citizen/rights/test-query', '📖'), emoji: '📖', color: 'orange', key: 'rights' },
        { name: 'Skill 23: Case Status', fn: () => runApiTest('Skill 23: Case Status', '/citizen/case-status/test-track', '📊'), emoji: '📊', color: 'cyan', key: 'status' },
        { name: 'Skill 24: Legal Aid', fn: () => runApiTest('Skill 24: Legal Aid', '/citizen/legal-aid/test-find', '🤝'), emoji: '🤝', color: 'purple', key: 'aid' },
    ];

    const colorMap: Record<string, string> = {
        amber: 'bg-amber-600 hover:bg-amber-500',
        blue: 'bg-blue-600 hover:bg-blue-500',
        indigo: 'bg-indigo-600 hover:bg-indigo-500',
        green: 'bg-green-600 hover:bg-green-500',
        orange: 'bg-orange-600 hover:bg-orange-500',
        cyan: 'bg-cyan-600 hover:bg-cyan-500',
        purple: 'bg-purple-600 hover:bg-purple-500',
    };

    const textColorMap: Record<string, string> = {
        amber: 'text-amber-400', blue: 'text-blue-400', indigo: 'text-indigo-400',
        green: 'text-green-400', orange: 'text-orange-400', cyan: 'text-cyan-400', purple: 'text-purple-400',
    };

    return (
        <div className="p-8 text-white bg-slate-900 min-h-screen">
            <h1 className="text-3xl font-bold mb-2">🧪 Integration Test Dashboard</h1>
            <p className="text-slate-400 mb-8">LegalOS 4.0 — All Skills Testing Suite (24 Skills)</p>

            {/* Test Buttons */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
                {testCards.map(card => (
                    <div key={card.key} className="bg-slate-800/50 p-5 rounded-xl border border-slate-700">
                        <h2 className={`text-lg font-semibold ${textColorMap[card.color]} mb-2`}>{card.emoji} {card.name}</h2>
                        <button
                            onClick={card.fn}
                            disabled={activeTest !== null}
                            className={`${colorMap[card.color]} disabled:bg-slate-600 disabled:cursor-not-allowed text-white px-5 py-2 rounded-lg font-semibold transition-colors w-full text-sm`}
                        >
                            {activeTest === card.key ? '⏳ Running...' : `▶️ Run Test`}
                        </button>
                    </div>
                ))}
            </div>

            {/* Console Output */}
            <div className="bg-black/60 p-6 rounded-xl border border-slate-700 font-mono text-sm">
                <div className="flex items-center justify-between mb-4 border-b border-slate-700 pb-2">
                    <h2 className="text-slate-400">Console Output</h2>
                    <button onClick={clearLogs} className="text-xs text-slate-500 hover:text-slate-300 transition-colors">
                        Clear
                    </button>
                </div>
                <div className="space-y-1 max-h-96 overflow-y-auto">
                    {logs.length === 0 ? (
                        <span className="text-slate-600 italic">No logs yet. Click a test button to start.</span>
                    ) : (
                        logs.map((log, i) => (
                            <div key={i} className="whitespace-pre-wrap">{log}</div>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
};

export default TestDashboard;


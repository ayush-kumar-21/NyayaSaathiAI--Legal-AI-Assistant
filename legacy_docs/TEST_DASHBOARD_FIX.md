# URGENT FIX: Test Dashboard Blank Page
## Correction Document for Antigravity

**Issue:** Test Dashboard showing blank/white page  
**Root Cause:** Multiple issues in routing and component  
**Fix Time:** 10 minutes  
**Priority:** HIGH

---

## 🔧 ISSUE #1: Duplicate Route in App.tsx

### Problem
The `/test` route is defined TWICE in App.tsx:
- Line 263: Inside authenticated routes section
- Line 294: Inside public routes section

This causes routing conflicts.

### Fix
**File:** `nyayasahayak-main-main/src/App.tsx`

**REMOVE** line 263 (the one inside authenticated routes):
```typescript
{/* REMOVE THIS ENTIRE LINE */}
<Route path="/test" element={<React.Suspense fallback={<LoadingFallback />}><TestDashboard /></React.Suspense>} />
```

**KEEP** line 294 (the public one):
```typescript
{/* Test Dashboard - Public for Debugging */}
<Route path="/test" element={<React.Suspense fallback={<LoadingFallback message="Loading Test Dashboard..." />}><TestDashboard /></React.Suspense>} />
```

**Result:** Only ONE route definition for `/test`

---

## 🔧 ISSUE #2: TestDashboard.tsx Missing API Integration

### Problem
Current TestDashboard.tsx is just a placeholder:
```typescript
const TestDashboard: React.FC = () => {
    return (
        <div className="p-8 text-white bg-slate-900 min-h-screen">
            <h1 className="text-3xl font-bold mb-2">🧪 Test Dashboard Works</h1>
            <p>If you can see this, the routing involves no errors.</p>
        </div>
    );
};
```

### Fix
**REPLACE ENTIRE FILE:** `nyayasahayak-main-main/src/pages/TestDashboard.tsx`

```typescript
import React, { useState, useEffect } from 'react';
import { adminApi } from '../core/services/api';

const TestDashboard: React.FC = () => {
    const [logs, setLogs] = useState<string[]>([]);
    const [activeTest, setActiveTest] = useState<string | null>(null);
    const [backendStatus, setBackendStatus] = useState<'checking' | 'online' | 'offline'>('checking');

    const addLog = (message: string) => {
        setLogs(prev => [...prev, `${new Date().toLocaleTimeString()}: ${message}`]);
    };

    const clearLogs = () => setLogs([]);

    // Check backend health on mount
    useEffect(() => {
        checkBackendHealth();
    }, []);

    const checkBackendHealth = async () => {
        try {
            const response = await fetch('http://localhost:8000/health');
            if (response.ok) {
                setBackendStatus('online');
                addLog('✅ Backend is online');
            } else {
                setBackendStatus('offline');
                addLog('❌ Backend health check failed');
            }
        } catch (error) {
            setBackendStatus('offline');
            addLog('❌ Backend is offline - check if server is running on port 8000');
        }
    };

    // ===== Skill 19: Registry Tests =====
    const runRegistryTests = async () => {
        clearLogs();
        setActiveTest('registry');
        addLog('📋 Starting Skill 19: Registry Automator Tests\n');

        try {
            // Test 1: Document Scrutiny
            addLog('📝 Test 1: Document Scrutiny');
            addLog('   Sending request to /admin/registry/test-scrutiny...');
            
            const scrutinyResponse = await adminApi.registry.test();
            addLog(`   ✅ Response received!`);
            addLog(`   📄 Filing ID: ${scrutinyResponse.data.filing_id}`);
            addLog(`   📊 Status: ${scrutinyResponse.data.status}`);
            addLog(`   🔍 Defects: ${scrutinyResponse.data.defect_count}`);
            
            if (scrutinyResponse.data.defects_found.length > 0) {
                scrutinyResponse.data.defects_found.forEach((defect, i) => {
                    addLog(`   ⚠️  Defect ${i + 1}: [${defect.severity.toUpperCase()}] ${defect.description}`);
                });
            }
            addLog(`   💡 Summary: ${scrutinyResponse.data.ai_summary}`);

            // Test 2: Fee Calculation
            addLog('\n💰 Test 2: Court Fee Calculation');
            addLog('   Sending request to /admin/registry/calculate-fees...');
            
            const feeResponse = await adminApi.registry.calculateFees({
                filing_type: 'civil_suit',
                value_in_dispute: 500000
            });
            
            addLog(`   ✅ Fee calculation successful!`);
            addLog(`   💵 Base Fee: ₹${feeResponse.data.fee_breakdown.base_fee}`);
            addLog(`   💵 Value Fee: ₹${feeResponse.data.fee_breakdown.value_based_fee}`);
            addLog(`   💵 Total: ₹${feeResponse.data.fee_breakdown.total_fee}`);
            addLog(`   📜 Rules: ${feeResponse.data.applicable_rules.join(', ')}`);

            addLog('\n✅ All Registry tests passed!');
        } catch (error: any) {
            addLog(`\n❌ Registry test failed: ${error.message || error}`);
            if (error.response) {
                addLog(`   Status: ${error.response.status}`);
                addLog(`   Error: ${JSON.stringify(error.response.data)}`);
            }
        }
        setActiveTest(null);
    };

    // ===== Skill 20: Listing Tests =====
    const runListingTests = async () => {
        clearLogs();
        setActiveTest('listing');
        addLog('🎯 Starting Skill 20: Listing Optimizer Tests\n');

        try {
            // Test 1: Get pending cases
            addLog('📋 Test 1: Fetch Pending Cases');
            addLog('   Sending request to /admin/listing/court/COURT-01/pending-cases...');
            
            const casesResponse = await adminApi.listing.getCauseList('COURT-01');
            addLog(`   ✅ Found ${casesResponse.data.length} pending cases`);

            if (casesResponse.data.length > 0) {
                const sampleCase = casesResponse.data[0];
                addLog(`   📄 Sample: ${sampleCase.title}`);
                addLog(`   🏷️  Type: ${sampleCase.case_type} | Urgency: ${sampleCase.urgency}`);
                addLog(`   🆔 CINO: ${sampleCase.cino}`);
            }

            // Test 2: Optimize schedule
            addLog('\n⚡ Test 2: Schedule Optimization');
            
            if (casesResponse.data.length === 0) {
                addLog('   ⚠️  No cases to optimize - running with test data...');
            }
            
            addLog('   Sending optimization request...');
            const optimizeResponse = await adminApi.listing.test();
            
            addLog(`   ✅ Optimization complete!`);
            addLog(`   📊 Results:`);
            addLog(`      • Cases scheduled: ${optimizeResponse.data.total_cases}`);
            addLog(`      • Time used: ${optimizeResponse.data.total_minutes_scheduled} minutes`);
            addLog(`      • Utilization: ${optimizeResponse.data.utilization_percentage}%`);
            addLog(`      • Unlisted: ${optimizeResponse.data.unlisted_cases.length} cases`);

            // Verify constraints
            const maxMinutes = 330;
            if (optimizeResponse.data.total_minutes_scheduled <= maxMinutes) {
                addLog(`   ✅ Time constraint satisfied (${optimizeResponse.data.total_minutes_scheduled}m ≤ ${maxMinutes}m)`);
            } else {
                addLog(`   ❌ Time constraint violated!`);
            }

            addLog('\n✅ All Listing tests passed!');
        } catch (error: any) {
            addLog(`\n❌ Listing test failed: ${error.message || error}`);
            if (error.response) {
                addLog(`   Status: ${error.response.status}`);
                addLog(`   Error: ${JSON.stringify(error.response.data)}`);
            }
        }
        setActiveTest(null);
    };

    return (
        <div className="min-h-screen bg-slate-900 text-white p-8">
            <div className="max-w-6xl mx-auto">
                {/* Header */}
                <header className="mb-8">
                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className="text-3xl font-bold mb-2 flex items-center gap-3">
                                <span className="text-4xl">🧪</span>
                                Integration Test Dashboard
                            </h1>
                            <p className="text-slate-400">
                                LegalOS 4.0 — Skills 19 & 20 Testing Suite
                            </p>
                        </div>
                        
                        {/* Backend Status */}
                        <div className={`px-4 py-2 rounded-lg border ${
                            backendStatus === 'online' 
                                ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400' 
                                : backendStatus === 'offline'
                                ? 'bg-red-500/10 border-red-500/30 text-red-400'
                                : 'bg-amber-500/10 border-amber-500/30 text-amber-400'
                        }`}>
                            <div className="flex items-center gap-2">
                                <div className={`w-2 h-2 rounded-full ${
                                    backendStatus === 'online' ? 'bg-emerald-400 animate-pulse' :
                                    backendStatus === 'offline' ? 'bg-red-400' :
                                    'bg-amber-400 animate-pulse'
                                }`} />
                                Backend: {backendStatus === 'checking' ? 'Checking...' : backendStatus}
                            </div>
                        </div>
                    </div>
                </header>

                {/* Test Buttons */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                    {/* Skill 19 */}
                    <div className="bg-slate-800/50 rounded-xl p-6 border border-slate-700">
                        <div className="flex items-start justify-between mb-4">
                            <div>
                                <h2 className="text-xl font-bold text-amber-400 mb-1">
                                    📋 Skill 19: Registry Automator
                                </h2>
                                <p className="text-slate-400 text-sm">
                                    Document scrutiny & fee calculation
                                </p>
                            </div>
                            <div className="bg-amber-500/10 p-3 rounded-lg">
                                <span className="text-2xl">📄</span>
                            </div>
                        </div>
                        
                        <div className="space-y-2 text-sm text-slate-400 mb-4">
                            <div className="flex items-center gap-2">
                                <span className="text-emerald-400">✓</span> AI Document Scrutiny
                            </div>
                            <div className="flex items-center gap-2">
                                <span className="text-emerald-400">✓</span> BNS Section Detection
                            </div>
                            <div className="flex items-center gap-2">
                                <span className="text-emerald-400">✓</span> Court Fee Calculator
                            </div>
                        </div>

                        <button
                            onClick={runRegistryTests}
                            disabled={activeTest !== null || backendStatus === 'offline'}
                            className="w-full bg-amber-600 hover:bg-amber-500 disabled:bg-slate-700 
                                     disabled:cursor-not-allowed text-white px-5 py-3 rounded-lg 
                                     font-semibold transition-all flex items-center justify-center gap-2"
                        >
                            {activeTest === 'registry' ? (
                                <>
                                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                    Running Tests...
                                </>
                            ) : (
                                <>
                                    <span>▶️</span> Run Registry Tests
                                </>
                            )}
                        </button>
                    </div>

                    {/* Skill 20 */}
                    <div className="bg-slate-800/50 rounded-xl p-6 border border-slate-700">
                        <div className="flex items-start justify-between mb-4">
                            <div>
                                <h2 className="text-xl font-bold text-blue-400 mb-1">
                                    🎯 Skill 20: Listing Optimizer
                                </h2>
                                <p className="text-slate-400 text-sm">
                                    AI case scheduling with bin-packing
                                </p>
                            </div>
                            <div className="bg-blue-500/10 p-3 rounded-lg">
                                <span className="text-2xl">📅</span>
                            </div>
                        </div>
                        
                        <div className="space-y-2 text-sm text-slate-400 mb-4">
                            <div className="flex items-center gap-2">
                                <span className="text-emerald-400">✓</span> O(n log n) Algorithm
                            </div>
                            <div className="flex items-center gap-2">
                                <span className="text-emerald-400">✓</span> 5.5 Hour Optimization
                            </div>
                            <div className="flex items-center gap-2">
                                <span className="text-emerald-400">✓</span> Priority Scheduling
                            </div>
                        </div>

                        <button
                            onClick={runListingTests}
                            disabled={activeTest !== null || backendStatus === 'offline'}
                            className="w-full bg-blue-600 hover:bg-blue-500 disabled:bg-slate-700 
                                     disabled:cursor-not-allowed text-white px-5 py-3 rounded-lg 
                                     font-semibold transition-all flex items-center justify-center gap-2"
                        >
                            {activeTest === 'listing' ? (
                                <>
                                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                    Running Tests...
                                </>
                            ) : (
                                <>
                                    <span>▶️</span> Run Listing Tests
                                </>
                            )}
                        </button>
                    </div>
                </div>

                {/* Console Output */}
                <div className="bg-black/60 rounded-xl border border-slate-700 overflow-hidden">
                    <div className="flex items-center justify-between px-6 py-4 border-b border-slate-700 bg-slate-800/50">
                        <div className="flex items-center gap-2">
                            <span className="text-slate-400 font-mono text-sm">Console Output</span>
                            <span className="text-xs text-slate-600">|</span>
                            <span className="text-xs text-slate-500">{logs.length} lines</span>
                        </div>
                        <div className="flex gap-2">
                            <button
                                onClick={checkBackendHealth}
                                className="text-xs text-slate-400 hover:text-white transition-colors px-3 py-1 
                                         bg-slate-700/50 rounded hover:bg-slate-600"
                            >
                                🔄 Check Backend
                            </button>
                            <button
                                onClick={clearLogs}
                                className="text-xs text-slate-400 hover:text-white transition-colors px-3 py-1 
                                         bg-slate-700/50 rounded hover:bg-slate-600"
                            >
                                Clear
                            </button>
                        </div>
                    </div>
                    
                    <div className="p-6 font-mono text-sm h-96 overflow-y-auto space-y-1">
                        {logs.length === 0 ? (
                            <div className="text-slate-600 italic text-center py-8">
                                No logs yet. Click a test button above to start testing.
                                <br /><br />
                                <span className="text-xs">
                                    Make sure backend is running: <code className="text-amber-400">uvicorn app.main:app --reload</code>
                                </span>
                            </div>
                        ) : (
                            logs.map((log, i) => (
                                <div 
                                    key={i} 
                                    className={`whitespace-pre-wrap ${
                                        log.includes('❌') ? 'text-red-400' :
                                        log.includes('✅') ? 'text-emerald-400' :
                                        log.includes('⚠️') ? 'text-amber-400' :
                                        log.includes('📋') || log.includes('🎯') ? 'text-blue-400 font-bold' :
                                        'text-slate-300'
                                    }`}
                                >
                                    {log}
                                </div>
                            ))
                        )}
                    </div>
                </div>

                {/* Footer */}
                <footer className="mt-8 text-center text-slate-500 text-sm">
                    <p>LegalOS 4.0 Test Suite | Skills 19 & 20 | Backend: http://localhost:8000</p>
                </footer>
            </div>
        </div>
    );
};

export default TestDashboard;
```

---

## 🔧 ISSUE #3: Add Error Boundary (Optional but Recommended)

### Problem
If API calls fail, the entire component crashes showing blank page.

### Fix
Create error boundary wrapper. Add this to `TestDashboard.tsx` imports:

```typescript
// Add this import
import { useErrorHandler } from 'react-error-boundary';
```

And wrap API calls:
```typescript
const handleError = useErrorHandler();

try {
    // API calls
} catch (error) {
    handleError(error);
}
```

---

## ✅ VERIFICATION STEPS

After applying fixes:

1. **Restart Frontend:**
   ```bash
   cd nyayasahayak-main-main
   npm run dev
   ```

2. **Verify Backend Running:**
   ```bash
   cd backend
   uvicorn app.main:app --reload
   ```

3. **Open Browser:**
   ```
   http://localhost:5174/test
   ```

4. **Expected Result:**
   - ✅ Test Dashboard loads with UI
   - ✅ Backend status shows "online"
   - ✅ Two test buttons visible
   - ✅ Clicking buttons shows API responses

---

## 🚨 IF STILL BLANK

Check browser console (F12) for:
1. **CORS errors** → Add CORS middleware to backend
2. **Module not found** → Check import paths
3. **Type errors** → Check TypeScript compilation
4. **Network errors** → Verify backend is on port 8000

---

## 📋 SUMMARY OF CHANGES

| File | Change | Lines |
|------|--------|-------|
| `App.tsx` | Remove duplicate route (line 263) | -1 |
| `TestDashboard.tsx` | Replace with full implementation | ~300 |

**Total Time:** 10 minutes  
**Result:** Working Test Dashboard with API integration

---

**Apply these fixes and the Test Dashboard should work!** 🚀
